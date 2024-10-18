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
