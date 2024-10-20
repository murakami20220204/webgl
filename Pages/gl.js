/*
Copyright 2024 Taichi Murakami.
WebGL を用いた一連の操作を各関数内で実施できます。
*/

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
