/*
Copyright 2025 Taichi Murakami.
テクスチャ。
*/

import * as Scalar from "./scalar.js";

/* スプライト用テクスチャ。指定したファイルからテクスチャを読み込みます。 */
export class SpriteTexture {
	constructor(gl, url) {
		this.gl = gl;
		this.loaded = false;
		this.tileX = 1.0;
		this.tileY = 1.0;
		this.buffer = gl.createTexture();

		if (this.buffer) {
			gl.bindTexture(gl.TEXTURE_2D, this.buffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
			const image = new Image();

			image.onload = function() {
				gl.bindTexture(gl.TEXTURE_2D, this.buffer);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

				if (Scalar.isPowerOfTwo(image.width) && Scalar.isPowerOfTwo(image.height)) {
					gl.generateMipmap(gl.TEXTURE_2D);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				}

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				this.loaded = true;
			};

			image.src = url;
		}
	}

	/* 現在のテクスチャを破棄します。 */
	destroy() {
		if (this.buffer) {
			this.gl.deleteTexture(this.buffer);
			this.buffer = null;
		}
	}

	/* 指定したシェーダーにテクスチャを割り当てます。 */
	enable(shader) {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);
		gl.uniform1i(shader.sampler, 0);
	}
}
