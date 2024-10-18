/*
Copyright 2024 Taichi Murakami.
Shader Resources クラスは WebGL が作成した各資源を格納します。
Sprite Shader クラスはスプライト用シェーダー ソースに記述された Uniform 値へ接触する方法を提供します。
*/

var ShaderResources = function (gl) {
	this.gl = gl;
	this.glSpriteFragmentShader = GL.createShader (gl, gl.FRAGMENT_SHADER, GLSL_SPRITE_FRAGMENT);
	this.glSpriteVertexShader = GL.createShader (gl, gl.VERTEX_SHADER, GLSL_SPRITE_VERTEX);
	this.glSpriteProgram = GL.createProgram (gl, this.glSpriteVertexShader, this.glSpriteFragmentShader);
}

var SpriteShader = function (gl, program) {
	this.gl = gl;
	this.program = program;
	this.vertexAttribute = gl.getAttribLocation (program, "Vertex");
	this.world = Matrix.createIdentity ();
	this.worldUniform = gl.getUniformLocation (program, "World");
}

ShaderResources.prototype.destroy = function () {
	this.gl.deleteProgram (this.glSpriteProgram);
	this.gl.deleteShader (this.glSpriteFragmentShader);
	this.gl.deleteShader (this.glSpriteVertexShader);
}

SpriteShader.prototype.enable = function () {
	const gl = this.gl;
	gl.useProgram (this.program);
	gl.vertexAttribPointer (this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray (this.vertexAttribute);
}

SpriteShader.prototype.update = function () {
	this.gl.uniformMatrix4fv (this.worldUniform, false, this.world);
}
