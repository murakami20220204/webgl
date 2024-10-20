/*
Copyright 2024 Taichi Murakami.
Shader Resources クラスは WebGL が作成した各資源を格納します。
*/

var ShaderResources = function (gl) {
	this.gl = gl;
	this.spriteFragmentShader = GL.createShader (gl, gl.FRAGMENT_SHADER, GLSL_SPRITE_FRAGMENT);
	this.spriteVertexShader = GL.createShader (gl, gl.VERTEX_SHADER, GLSL_SPRITE_VERTEX);
	this.spriteProgram = GL.createProgram (gl, this.spriteVertexShader, this.spriteFragmentShader);
	this.spriteTexcoordAttribute = gl.getAttribLocation (this.spriteProgram, "Texcoord");
	this.spriteVertexAttribute = gl.getAttribLocation (this.spriteProgram, "Vertex");
	this.spriteSamplerUniform = gl.getUniformLocation (this.spriteProgram, "Sampler");
	this.spriteWorldUniform = gl.getUniformLocation (this.spriteProgram, "World");
}

ShaderResources.prototype.destroy = function () {
	this.gl.deleteProgram (this.spriteProgram);
	this.gl.deleteShader (this.spriteFragmentShader);
	this.gl.deleteShader (this.spriteVertexShader);
}
