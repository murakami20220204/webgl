/*
Copyright 2024 Taichi Murakami.
Background Renderer クラスは背景画像を描画する方法を提供します。
*/
class BackgroundRenderer {
	constructor (resources) {
		this.gl = resources.gl;
		this.color = new Color(0.0, 0.0, 0.5, 1.0);
	}
	draw () {
		const gl = this.gl;
		const color = this.color;
		gl.clearColor (color.r, color.g, color.b, color.a);
		gl.clear (gl.COLOR_BUFFER_BIT);
	}
}
