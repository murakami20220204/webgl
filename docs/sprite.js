/*
Copyright 2024 Taichi Murakami.
Sprite Renderer クラスは前面画像を描画する方法を提供します。
*/
class SpriteRenderer {
	constructor (resources) {
		this.gl = resources.gl;
		this.position = new Point ();
		this.program = resources.spriteProgram;
		this.projectionLocation = resources.spriteProjectionLocation;
		this.rectangle = new Rectangle (0, 0, 1, 1);
		this.rectangleLocation = resources.spriteRectangleLocation;
		this.rotation = 0;
		this.scaling = new Point (1, 1);
		this.size = new Size (1, 1);
		this.texcoordLocation = resources.spriteTexcoordLocation;
		this.texcoordBuffer = resources.createArrayBuffer (new Float32Array (SpriteRenderer.TEXCOORDS));
		this.texture = null;
		this.textureLocation = resources.spriteTextureLocation;
		this.vertexLocation = resources.spriteVertexLocation;
		this.vertexBuffer = resources.createArrayBuffer (new Float32Array (SpriteRenderer.VERTICES));
		this.worldLocation = resources.spriteWorldLocation;
	}
	draw () {
		const gl = this.gl;
		gl.drawArrays (gl.TRIANGLE_STRIP, 0, 4);
	}
	enable () {
		const gl = this.gl;
		gl.useProgram (this.program);
		gl.bindBuffer (gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.enableVertexAttribArray (this.vertexLocation);
		gl.vertexAttribPointer (this.vertexLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.enableVertexAttribArray (this.texcoordLocation);
		gl.vertexAttribPointer (this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);
	}
	updateProjection () {
		const gl = this.gl;
		const M0 = new Float32Array (Matrix4x4.LENGTH);
		const aspectRatio = this.size.width / this.size.height;
		let width, height;
		if (aspectRatio > 1) {
			width = 2 * aspectRatio;
			height = 2;
		} else {
			width = 2;
			height = 2 / aspectRatio;
		}
		Matrix4x4.orthographic (M0, width, height);
		gl.uniformMatrix4fv (this.projectionLocation, false, M0);
	}
	updateRectangle () {
		const gl = this.gl;
		const value = this.rectangle;
		gl.uniform4f (this.rectangleLocation, value.x, value.y, value.width, value.height);
	}
	updateTexture () {
		const gl = this.gl;
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_2D, this.texture);
		gl.uniform1i (this.textureLocation, 0);
	}
	updateWorld () {
		const gl = this.gl;
		if (true) {
			const M0 = new Float32Array (Matrix3x2.LENGTH);
			const M1 = new Float32Array (Matrix3x2.LENGTH);
			Matrix3x2.scaling (M0, this.scaling.x, this.scaling.y);
			Matrix3x2.rotation (M1, this.rotation);
			Matrix3x2.mulThis (M0, M1);
			Matrix3x2.translation (M1, this.position.x, this.position.y);
			Matrix3x2.mulThis (M0, M1);
			gl.uniformMatrix4fv (this.worldLocation, false, Matrix4x4.from (M0));
		} else {
			const M0 = new Float32Array (Matrix4x4.LENGTH);
			const M1 = new Float32Array (Matrix4x4.LENGTH);
			Matrix4x4.scaling (M0, this.scaling.x, this.scaling.y, 1);
			Matrix4x4.rotation (M1, 0, 0, this.rotation);
			Matrix4x4.mulThis(M0, M1);
			Matrix4x4.translation (M1, this.position.x, this.position.y);
			Matrix4x4.mulThis(M0, M1);
			gl.uniformMatrix4fv (this.worldLocation, false, M0);
		}
	}
}
Object.defineProperties (SpriteRenderer, {
	TEXCOORDS: { value: [1, 0, 0, 0, 1, 1, 0, 1] },
	VERTICES: { value: [1, 1, -1, 1, 1, -1, -1, -1] }
});
