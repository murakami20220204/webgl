/*
Copyright 2025 Taichi Murakami.
アクター。
*/

export class SpriteActor {
	constructor(gl) {
		this.gl = gl;
		this.locationX = 0.0;
		this.locationY = 0.0;
		this.rotation = 0.0;
		this.scaleX = 0.0;
		this.scaleY = 0.0;
	}

	update(shader) {
		shader.updateModel(this.locationX, this.locationY, this.rotation, this.scaleX, this.scaleY);
	}
}
