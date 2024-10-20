/*
Copyright 2024 Taichi Murakami.
ここにゲーム上で行うことを記述します。
*/

var Game = function () {
	const bitmapReader = new BitmapReader ();
	bitmapReader.source = createByteArrayFromBase64(BASE64_SPRITE_BITMAP);
	bitmapReader.read ();
	this.gl = GL.create ();
	this.shaderResources = new ShaderResources (this.gl);
	this.backgroundRenderer = new BackgroundRenderer (this.shaderResources);
	this.spriteRenderer = new SpriteRenderer (this.shaderResources);
	this.spriteTexture = GL.createTextureFromBitmap (this.gl, bitmapReader.bitmap);
	this.deltaSeconds = 0.0;
	this.surfaceHeight = 480;
	this.surfaceWidth = 640;
}

Game.prototype.draw = function () {
	this.gl.viewport (0, 0, this.surfaceWidth, this.surfaceHeight);
	this.backgroundRenderer.draw ();
	this.spriteRenderer.enable ();
	this.spriteRenderer.texture = this.spriteTexture;
	this.spriteRenderer.update ();
	this.spriteRenderer.draw ();
}

Game.prototype.update = function () {
	m0 = Matrix.create ();
	m1 = Matrix.create ();
	Matrix.translation (m1, 0.0, 0.0, 0.0);
	Matrix.scaling (m0, 0.5, 0.5, 1.0);
	Matrix.multiply (this.spriteRenderer.world, m0, m1);
}
