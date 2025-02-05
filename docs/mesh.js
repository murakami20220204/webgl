/*
Copyright 2025 Taichi Murakami.
メッシュ。
*/

import * as GL from "./glu.js";

const SPRITE_MESH_BUFFER = new Float32Array([
	+1.0, +1.0, 1.0, 0.0,
	-1.0, +1.0, 0.0, 0.0,
	+1.0, -1.0, 1.0, 1.0,
	-1.0, -1.0, 0.0, 1.0
]);

/* スプライト用メッシュ。新しいメッシュを作成します。 */
export class SpriteMesh {
	constructor(gl) {
		this.gl = gl;
		this.buffer = GL.createBuffer(gl.ARRAY_BUFFER, SPRITE_MESH_BUFFER, gl.STATIC_DRAW);
	}

	/* 現在のメッシュを破棄します。 */
	destroy() {
		if (this.buffer) {
			this.gl.deleteBuffer(this.buffer);
			this.buffer = null;
		}
	}

	/* ドロー コールを実行します。 */
	draw() {
		this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	/* 指定したシェーダーに現在のメッシュを割り当てます。 */
	enable(shader) {
		const gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(shader.position, 2, gl.FLOAT, false, 16, 0);
		gl.vertexAttribPointer(shader.texcoord, 2, gl.FLOAT, false, 16, 2);
	}
}
