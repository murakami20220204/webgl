/*
Copyright 2024 Taichi Murakami.
ここにゲーム上で行うことを記述します。
*/

var Game = function () {
	this.gl = GL.create ();
	this.shaderResources = new ShaderResources (this.gl);
	this.spriteShader = new SpriteShader (this.gl, this.shaderResources.glSpriteProgram);
	this.backgroundRenderer = new BackgroundRenderer (this.gl);
	this.spriteRenderer = new SpriteRenderer (this.gl);
	this.deltaSeconds = 0.0;
	this.surfaceHeight = 480;
	this.surfaceWidth = 640;
}

Game.prototype.draw = function () {
	this.gl.viewport (0, 0, this.surfaceWidth, this.surfaceHeight);
	this.backgroundRenderer.draw ();
	this.spriteShader.enable ();
	this.spriteShader.update ();
	this.spriteRenderer.enable ();
	this.spriteRenderer.draw ();
}

Game.prototype.update = function () {
	m0 = Matrix.create ();
	m1 = Matrix.create ();
	Matrix.translation (m1, 0.0, 0.0, 0.0);
	Matrix.scaling (m0, 0.5, 0.5, 1.0);
	Matrix.multiply (this.spriteShader.world, m0, m1);
}
