/*
Copyright 2025 Taichi Murakami.
WebGL ヘルパー関数。
*/

import * as Scalar from "./scalar.js";
let gl = null;

/* 新しい頂点バッファーを作成します。 */
function createBuffer(target, array, usage) {
	const buffer = gl.createBuffer();

	if (buffer) {
		gl.bindBuffer(target, buffer);
		gl.bufferData(target, array, usage);
		gl.bindBuffer(target, null);
	}

	return buffer;
}

/* 既存の Shader から新しい Program を作成します。 */
function createProgram(vertexShader, fragmentShader) {
	const program = gl.createProgram();

	if (program) {
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			program = null;
		}
	}

	return program;
}

/* 既存のソースから新しい Shader を作成します。 */
function createShader(type, source) {
	const shader = gl.createShader(type);

	if (shader) {
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			shader = null;
		}
	}

	return shader;
}

/* 新しいテクスチャを作成します。 */
function createTexture(url) {
	const texture = gl.createTexture();

	if (texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		const image = new Image();

		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			if (Scalar.isPowerOfTwo(image.width) && Scalar.isPowerOfTwo(image.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		};

		image.src = url;
	}

	return texture;
}

function setContext(context) {
	gl = context;
}

export {
	createBuffer,
	createProgram,
	createShader,
	createTexture,
	setContext
};
