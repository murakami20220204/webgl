/*
Copyright 2024 Taichi Murakami.
WebGL を用いて画面を描画する方法を提供します。
Background Renderer クラスは背景を塗りつぶす方法を提供します。
*/

var BackgroundRenderer = function (resources) {
	this.gl = resources.gl;
	this.color = [0.0, 0.0, 0.5, 1.0];
}

var SpriteRenderer = function (resources) {
	const gl = resources.gl;
	this.gl = gl;
	this.program = resources.spriteProgram;
	this.projection = Matrix.createIdentity ();
	this.projectionUniform = resources.spriteProjectionUniform;
	this.samplerUniform = resources.spriteSamplerUniform;
	this.texcoordAttribute = resources.spriteTexcoordAttribute;
	this.texcoordBuffer = GL.createVertexBuffer (gl, SPRITE_TEXCOORDS);
	this.texture = null;
	this.vertexAttribute = resources.spriteVertexAttribute;
	this.vertexBuffer = GL.createVertexBuffer (gl, SPRITE_VERTICES);
	this.world = Matrix.createIdentity ();
	this.worldUniform = resources.spriteWorldUniform;
}

BackgroundRenderer.prototype.draw = function () {
	const gl = this.gl;
	const color = this.color;
	gl.clearColor (color [0], color [1], color [2], color [3]);
	gl.clear (gl.COLOR_BUFFER_BIT);
}

SpriteRenderer.prototype.draw = function () {
	const gl = this.gl;
	gl.drawArrays (gl.TRIANGLE_STRIP, 0, 4);
}

SpriteRenderer.prototype.enable = function () {
	const gl = this.gl;
	gl.useProgram (this.program);
	gl.bindBuffer (gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.enableVertexAttribArray (this.vertexAttribute);
	gl.vertexAttribPointer (this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer (gl.ARRAY_BUFFER, this.texcoordBuffer);
	gl.enableVertexAttribArray (this.texcoordAttribute);
	gl.vertexAttribPointer (this.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);
}

SpriteRenderer.prototype.update = function () {
	const gl = this.gl;
	gl.uniformMatrix4fv (this.projectionUniform, false, this.projection);
	gl.uniformMatrix4fv (this.worldUniform, false, this.world);
	gl.activeTexture (gl.TEXTURE0);
	gl.bindTexture (gl.TEXTURE_2D, this.texture);
	gl.uniform1i (this.samplerUniform, 0);
}
