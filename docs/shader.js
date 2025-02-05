/*
Copyright 2025 Taichi Murakami.
シェーダー。
*/

import * as GL from "./glu.js"
import * as Mat4 from "./mat4.js";

/* スプライト用シェーダー。 */
export class SpriteShader {
	constructor(gl, vertexShader, fragmentShader) {
		this.gl = gl;
		this.program = GL.createProgram(vertexShader, fragmentShader);
		this.model = this.gl.getUniformLocation(this.program, "model");
		this.projection = this.gl.getUniformLocation(this.program, "projection");
		this.sampler = this.gl.getUniformLocation(this.program, "sampler");
		this.position = this.gl.getAttribLocation(this.program, "position");
		this.texcoord = this.gl.getAttribLocation(this.program, "texcoord");
		this.aspectRatio = 1.33;
	}

	/* 現在のプログラムを破棄します。 */
	destroy() {
		if (this.program) {
			this.gl.deleteProgram(this.program);
			this.program = null;
		}
	}

	/* スプライト用シェーダーを選択します。 */
	enable() {
		this.gl.useProgram(this.program);
		this.gl.enableVertexAttribArray(this.position);
		this.gl.enableVertexAttribArray(this.texcoord);
	}

	/* ワールド変換行列 Uniform を更新します。 */
	updateModel(sprite) {
		const m0 = Mat4.create();
		const m1 = Mat4.create();
		Mat4.scaling(m0, sprite.scaleX, sprite.scaleY);
		Mat4.rotationZ(m1, sprite.rotationZ);
		Mat4.mul(m0, m0, m1);
		Mat4.translation(m1, sprite.locationX, sprite.locationY);
		Mat4.mul(m0, m0, m1);
		this.gl.uniformMatrix4fv(this.model, false, m0);
	}

	/* ビュー変換行列 Uniform を更新します。 */
	updateProjection(width, height) {
		if (height > 0) {
			const m0 = Mat4.create();
			const aspectRatio = width / height;

			if (aspectRatio >= DEFAULT_ASPECT_RATIO) {
				width = 2.0 * aspectRatio;
				height = 2.0;
			} else {
				width = 2.0 * DEFAULT_ASPECT_RATIO;
				height = width / aspectRatio;
			}
	
			Mat4.orthographic(m0, width, height);
			this.gl.uniformMatrix4fv(this.projection, false, m0);
		}
	}

	/* テクスチャ サンプラー Uniform を更新します。 */
	updateTexture(texture) {
		this.gl.activeTexture(gl.TEXTURE0);
		this.gl.bindTexture(gl.TEXTURE_2D, texture);
		this.gl.uniform1i(this.sampler, 0);
	}
}
