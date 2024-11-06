/*
Copyright 2024 Taichi Murakami.
Game クラスはゲーム上で行うことを記述します。
*/
class Game {
	constructor () {
		this.resources = new RenderingResources (document.getElementById ("gl"));
		this.background = new BackgroundRenderer (this.resources);
		this.sprite = new SpriteRenderer (this.resources);
		this.spriteTexture = this.resources.createTexture (Bitmap.from (Asset.SPRITE_BITMAP));
		this.deltaSeconds = 0;
		this.timestamp = 0;
	}
	draw () {
		this.resources.resize ();
		this.resources.gl.viewport (0, 0, this.resources.canvas.width, this.resources.canvas.height);
		this.sprite.size.width =  this.resources.canvas.width;
		this.sprite.size.height =  this.resources.canvas.height;
		this.background.draw ();
		this.sprite.enable ();
		this.sprite.texture = this.spriteTexture;
		this.sprite.updateProjection ();
		this.sprite.updateWorld ();
		this.sprite.updateTexture ();
		this.sprite.updateRectangle ();
		this.sprite.draw ();
	}
	update (timestamp) {
		this.deltaSeconds = timestamp - this.timestamp;
		this.timestamp = timestamp;
		this.deltaSeconds = Math.min (this.deltaSeconds, 1);
		this.sprite.rotation = (this.sprite.rotation + this.deltaSeconds / 100) % (Math.PI * 2);
		this.sprite.position.x = 1;
		this.sprite.scaling.y = 0.5;
		this.sprite.scaling.x = 1;
		this.sprite.rectangle.width = 0.5;
		this.sprite.rectangle.height = 0.5;
		console.log (`Rotation: ${this.sprite.rotation}`);
	}
}
