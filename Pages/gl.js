/*
Copyright 2024 Taichi Murakami.
Rendering Resources クラスは WebGL が作成した資源を格納します。
*/
class RenderingResources {
	constructor (canvas) {
		const gl = canvas.getContext ("webgl");
		this.canvas = canvas;
		this.gl = gl;
		this.spriteFragmentShader = this.createShader (gl.FRAGMENT_SHADER, GLSL_SPRITE_FRAGMENT);
		this.spriteVertexShader = this.createShader (gl.VERTEX_SHADER, GLSL_SPRITE_VERTEX);
		this.spriteProgram = this.createProgram (this.spriteVertexShader, this.spriteFragmentShader);
		this.spriteProjectionLocation = gl.getUniformLocation (this.spriteProgram, GLSL_PROJECTION);
		this.spriteRectangleLocation = gl.getUniformLocation (this.spriteProgram, GLSL_RECTANGLE);
		this.spriteTexcoordLocation = gl.getAttribLocation (this.spriteProgram, GLSL_TEXCOORD);
		this.spriteTextureLocation = gl.getUniformLocation (this.spriteProgram, GLSL_TEXTURE);
		this.spriteVertexLocation = gl.getAttribLocation (this.spriteProgram, GLSL_VERTEX);
		this.spriteWorldLocation = gl.getUniformLocation (this.spriteProgram, GLSL_WORLD);
	}
	createArrayBuffer (array) {
		const gl = this.gl;
		const buffer = gl.createBuffer();
		if (buffer) {
			gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
			gl.bufferData (gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
		} else {
			throw new RenderingResourcesError ();
		}
		return buffer;
	}
	createElementArrayBuffer (array) {
		const gl = this.gl;
		const buffer = gl.createBuffer();
		if (buffer) {
			gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
		} else {
			throw new RenderingResourcesError ();
		}
		return buffer;
	}
	createProgram (vertexShader, fragmentShader) {
		const gl = this.gl;
		const program = gl.createProgram ();
		let status = null;
		if (program) {
			gl.attachShader (program, vertexShader);
			gl.attachShader (program, fragmentShader);
			gl.linkProgram (program);
			status = gl.getProgramParameter (program, gl.LINK_STATUS);
		} if (!status) {
			let log = null;
			if (program) {
				log = gl.getProgramInfoLog (program);
				gl.deleteProgram (program);
			}
			throw new RenderingResourcesError (log);
		}
		return program;
	}
	createShader (type, source) {
		const gl = this.gl;
		const shader = gl.createShader (type);
		let status = null;
		if (shader) {
			gl.shaderSource (shader, source);
			gl.compileShader (shader);
			status = gl.getShaderParameter (shader, gl.COMPILE_STATUS);
		} if (!status) {
			let log = null;
			if (shader) {
				log = gl.getShaderInfoLog (shader);
				gl.deleteShader (shader);
			}
			throw new RenderingResourcesError (log);
		}
		return shader;
	}
	createTexture (source) {
		const gl = this.gl;
		const texture = gl.createTexture ();
		if (texture) {
			gl.bindTexture (gl.TEXTURE_2D, texture);
			gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, source.width, source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array (source.pixels.buffer));
			if (Scalar.isPowerOfTwo (source.width) && Scalar.isPowerOfTwo (source.height)) {
				gl.generateMipmap (gl.TEXTURE_2D);
			} else {
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		} else {
			throw new RenderingResourcesError ();
		}
		return texture;
	}
	resize () {
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		if ((this.canvas.width != width) || (this.canvas.height != height)) {
			this.canvas.width = width;
			this.canvas.height = height;
		}
	}
}
class RenderingResourcesError extends Error {
	constructor (log = null) {
		let message = "WebGL resources cannot be created.";
		if (log) message = `${message}\r\n${log}`;
		super (message);
	}
}
