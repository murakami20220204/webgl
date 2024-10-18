/*
Copyright 2024 Taichi Murakami.
WebGL を用いて画面を描画する方法を提供します。
Background Renderer クラスは背景を塗りつぶす方法を提供します。
*/

var BackgroundRenderer = function (gl) {
	this.gl = gl;
	this.color = [0.0, 0.0, 0.5, 1.0];
}

var SpriteRenderer = function (gl) {
	this.gl = gl;
	this.vertexBuffer = GL.createVertexBuffer (gl, SPRITE_VERTICES);
}

BackgroundRenderer.prototype.draw = function () {
	const gl = this.gl;
	const color = this.color;
	gl.clearColor (color [0], color [1], color [2], color [3]);
	gl.clear (gl.COLOR_BUFFER_BIT);
}

SpriteRenderer.prototype.draw = function () {
	const gl = this.gl;
	gl.drawArrays (gl.TRIANGLE_STRIP, 0, 3);
}

SpriteRenderer.prototype.enable = function () {
	const gl = this.gl;
	gl.bindBuffer (gl.ARRAY_BUFFER, this.vertexBuffer);
}
