/*
Copyright 2024 Taichi Murakami.
ここにゲーム上で行うことを記述します。
*/

var Game = function () {
	const bitmapReader = new BitmapReader ();
	bitmapReader.source = createByteArrayFromBase64(BASE64_SPRITE_BITMAP);
	bitmapReader.read ();
	this.resources = new RenderingResources (document.getElementById ("gl"));
	this.backgroundRenderer = new BackgroundRenderer (this.resources);
	this.spriteRenderer = new SpriteRenderer (this.resources);
	this.spriteTexture = this.resources.createTexture (bitmapReader.bitmap);
	this.deltaSeconds = 0.0;
	this.surfaceHeight = 480;
	this.surfaceWidth = 640;
}

Game.prototype.draw = function () {
	this.resources.resize ();
	this.resources.gl.viewport (0, 0, this.resources.canvas.width, this.resources.canvas.height);
	this.spriteRenderer.size.x =  this.resources.canvas.width;
	this.spriteRenderer.size.y =  this.resources.canvas.height;
	this.backgroundRenderer.draw ();
	this.spriteRenderer.enable ();
	this.spriteRenderer.texture = this.spriteTexture;
	this.spriteRenderer.updateProjection ();
	this.spriteRenderer.updateWorld ();
	this.spriteRenderer.updateTexture ();
	this.spriteRenderer.draw ();
}

Game.prototype.update = function () {
	this.spriteRenderer.position.x = 0.5;
	this.spriteRenderer.scaling.y = 0.5;
	this.spriteRenderer.scaling.x = 0.5;
}
