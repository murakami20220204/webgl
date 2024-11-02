/*
Copyright 2024 Taichi Murakami.
WebGL を用いた一連の操作を各関数内で実施できます。
*/
const SPRITE_RENDERER_TEXCOORDS = [
	1.0, 0.0,
	0.0, 0.0,
	1.0, 1.0,
	0.0, 1.0
];
const SPRITE_RENDERER_VERTICES = [
	1.0, 1.0,
	-1.0, 1.0,
	1.0, -1.0,
	-1.0, -1.0
];
class RenderingResources {
	constructor (canvas) {
		const gl = canvas.getContext (ID_CONTEXT);
		this.canvas = canvas;
		this.gl = gl;
		this.spriteFragmentShader = this.createShader (gl.FRAGMENT_SHADER, GLSL_SPRITE_FRAGMENT);
		this.spriteVertexShader = this.createShader (gl.VERTEX_SHADER, GLSL_SPRITE_VERTEX);
		this.spriteProgram = this.createProgram (this.spriteVertexShader, this.spriteFragmentShader);
		this.spriteTexcoordAttrib = gl.getAttribLocation (this.spriteProgram, GLSL_TEXCOORD);
		this.spriteVertexAttrib = gl.getAttribLocation (this.spriteProgram, GLSL_VERTEX);
		this.spriteSamplerUniform = gl.getUniformLocation (this.spriteProgram, GLSL_SAMPLER);
		this.spriteProjectionUniform = gl.getUniformLocation (this.spriteProgram, GLSL_PROJECTION);
		this.spriteWorldUniform = gl.getUniformLocation (this.spriteProgram, GLSL_WORLD);
	}
	createArrayBuffer (array) {
		const gl = this.gl;
		const buffer = gl.createBuffer();
		if (buffer) {
			gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
			gl.bufferData (gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
		} else {
			throw new Error (E_CREATE_ARRAY_BUFFER);
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
			throw new Error (E_CREATE_ARRAY_BUFFER);
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
			let message = E_CREATE_PROGRAM;
			if (program) {
				const log = gl.getProgramInfoLog (program);
				message = `${message}\r\n${log}`;
				gl.deleteProgram (program);
			}
			throw new Error (message);
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
			let message = E_CREATE_SHADER;
			if (shader) {
				const log = gl.getShaderInfoLog (shader);
				message = `${message}\r\n${log}`;
				gl.deleteShader (shader);
			}
			throw new Error (message);
		}
		return shader;
	}
	createTexture (source) {
		const gl = this.gl;
		const texture = gl.createTexture ();
		if (texture) {
			gl.bindTexture (gl.TEXTURE_2D, texture);
			gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, source.width, source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, source.pixels);
			if (Scalar.isPowerOfTwo (source.width) && Scalar.isPowerOfTwo (source.height)) {
				gl.generateMipmap (gl.TEXTURE_2D);
			} else {
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		} else {
			throw new Error (E_CREATE_TEXTURE);
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
class BackgroundRenderer {
	constructor (resources) {
		this.gl = resources.gl;
		this.color = ColorF.create([0.0, 0.0, 0.5, 1.0]);
	}
	draw () {
		const gl = this.gl;
		const color = this.color;
		gl.clearColor (color.r, color.g, color.b, color.a);
		gl.clear (gl.COLOR_BUFFER_BIT);
	}
}
class SpriteRenderer {
	constructor (resources) {
		this.gl = resources.gl;
		this.program = resources.spriteProgram;
		this.texcoordAttrib = resources.spriteTexcoordAttrib;
		this.vertexAttrib = resources.spriteVertexAttrib;
		this.samplerUniform = resources.spriteSamplerUniform;
		this.projectionUniform = resources.spriteProjectionUniform;
		this.worldUniform = resources.spriteWorldUniform;
		this.texcoordBuffer = resources.createArrayBuffer (new Float32Array (SPRITE_RENDERER_TEXCOORDS));
		this.vertexBuffer = resources.createArrayBuffer (new Float32Array (SPRITE_RENDERER_VERTICES));
		this.texture = null;
		this.position = new Point2F ();
		this.scaling = new Point2F ();
		this.scaling.set (Point2.ONE);
		this.size = new Point2F ();
		this.size.set (Point2.ONE);
	}
	draw () {
		const gl = this.gl;
		gl.drawArrays (gl.TRIANGLE_STRIP, 0, 4);
	}
	enable () {
		const gl = this.gl;
		gl.useProgram (this.program);
		gl.bindBuffer (gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.enableVertexAttribArray (this.vertexAttrib);
		gl.vertexAttribPointer (this.vertexAttrib, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.enableVertexAttribArray (this.texcoordAttrib);
		gl.vertexAttribPointer (this.texcoordAttrib, 2, gl.FLOAT, false, 0, 0);
	}
	updateProjection () {
		const gl = this.gl;
		const aspectRatio = this.size.x / this.size.y;
		const size = new Point2F ();
		const m0 = new Matrix4x4F ();
		size.set ((aspectRatio > 1) ? [2 * aspectRatio, 2] : [2, 2 / aspectRatio]);
		m0.orthographic (size.x, size.y);
		gl.uniformMatrix4fv (this.projectionUniform, false, m0);
	}
	updateTexture () {
		const gl = this.gl;
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_2D, this.texture);
		gl.uniform1i (this.samplerUniform, 0);
	}
	updateWorld () {
		const gl = this.gl;
		const m0 = new Matrix4x4F ();
		const m1 = new Matrix4x4F ();
		m0.scaling (this.scaling.x, this.scaling.y, 1);
		Matrix4x4.translation (m1, this.position.x, this.position.y, 0);
		m0.mul (m1);
		gl.uniformMatrix4fv (this.worldUniform, false, m0);
	}
}

var GL = {
	create: function () {
		const canvas = document.getElementById ("gl");
		let context = null;
		if (canvas) context = canvas.getContext ("webgl");
		if (!context) throw new Error ("WebGL cannot be created.");
		return context;
	},
	createElementBuffer: function (gl, source) {
		const buffer = gl.createBuffer ();

		if (buffer) {
			const array = new Uint16Array (source);
			gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
		} else {
			throw new Error ("WebGL element array buffer cannot be created.");
		}
	
		return buffer;
	},
	createProgram: function (gl, vertexShader, fragmentShader) {
		const program = gl.createProgram ();
		let status = null;
	
		if (program) {
			gl.attachShader (program, vertexShader);
			gl.attachShader (program, fragmentShader);
			gl.linkProgram (program);
			status = gl.getProgramParameter (program, gl.LINK_STATUS);
		}
		if (!status) {
			const text = "WebGL shader program cannot be created.";
			let message;
	
			if (program) {
				const log = gl.getProgramInfoLog (program);
				message = `${text}\r\n${log}`;
				gl.deleteProgram (program);
			} else {
				message = text;
			}
	
			throw new Error (message);
		}
	
		return program;
	},
	createShader: function (gl, type, source) {
		const shader = gl.createShader (type);
		let status = null;
	
		if (shader) {
			gl.shaderSource (shader, source);
			gl.compileShader (shader);
			status = gl.getShaderParameter (shader, gl.COMPILE_STATUS);
		} if (!status) {
			const text = "WebGL shader cannot be created.";
			let message;
	
			if (shader) {
				const log = gl.getShaderInfoLog (shader);
				message = `${text}\r\n${log}`;
				gl.deleteShader (shader);
			} else {
				message = text;
			}
	
			throw new Error (message);
		}
	
		return shader;
	},
	createTextureById: function (gl, id) {
		const image = document.getElementById (id);
		let texture = null;

		if (image) {
			texture = gl.createTexture ();

			if (texture) {
				const level = 0;
				const internalFormat = gl.RGBA;
				const sourceFormat = gl.RGBA;
				const sourceType = gl.UNSIGNED_BYTE;
				gl.bindTexture (gl.TEXTURE_2D, texture);
				gl.texImage2D (gl.TEXTURE_2D, level, internalFormat, sourceFormat, sourceType, image);
				if (Scalar.isPowerOfTwo (image.width) && Scalar.isPowerOfTwo (image.height)) {
					gl.generateMipmap (gl.TEXTURE_2D);
				} else {
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				}
			}
		}

		return texture;
	},
	createTextureFromBitmap: function (gl, bitmap) {
		const texture = gl.createTexture ();

		if (texture) {
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = bitmap.width;
			const height = bitmap.height;
			const border = 0;
			const sourceFormat = gl.RGBA;
			const sourceType = gl.UNSIGNED_BYTE;
			const pixels = bitmap.pixels;
			gl.bindTexture (gl.TEXTURE_2D, texture);
			gl.texImage2D (gl.TEXTURE_2D, level, internalFormat, width, height, border, sourceFormat, sourceType, pixels);

			if (Scalar.isPowerOfTwo (bitmap.width) && Scalar.isPowerOfTwo (bitmap.height)) {
				gl.generateMipmap (gl.TEXTURE_2D);
			} else {
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
		} else {
			throw new Error ("WebGL texture cannot be created.");
		}

		return texture;
	},
	createTextureFromFile: function (gl, url) {
		const texture = gl.createTexture ();

		if (texture) {
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 1;
			const height = 1;
			const border = 0;
			const sourceFormat = gl.RGBA;
			const sourceType = gl.UNSIGNED_BYTE;
			const pixels = new Uint8Array ([0, 0, 255, 255]);
			const image = new Image ();
			gl.bindTexture (gl.TEXTURE_2D, texture);
			gl.texImage2D (gl.TEXTURE_2D, level, internalFormat, width, height, border, sourceFormat, sourceType, pixels);
			image.addEventListener ("load", function (event) {
				gl.bindTexture (gl.TEXTURE_2D, texture);
				gl.texImage2D (gl.TEXTURE_2D, level, internalFormat, sourceFormat, sourceType, image);
				if (Scalar.isPowerOfTwo (image.width) && Scalar.isPowerOfTwo (image.height)) {
					gl.generateMipmap (gl.TEXTURE_2D);
				} else {
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				}
			});

			image.src = url;
		}

		return texture;
	},
	createVertexBuffer: function (gl, source) {
		const buffer = gl.createBuffer();

		if (buffer) {
			const array = new Float32Array (source);
			gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
			gl.bufferData (gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
		} else {
			throw new Error ("WebGL vertex array buffer cannot be created.");
		}

		return buffer;
	}
};
