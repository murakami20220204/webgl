/*
Copyright 2024 Taichi Murakami.
GLSL で記述されたシェーダー ソース。
*/

const GLSL_SPRITE_VERTEX = `
	uniform mat4 Projection;
	uniform mat4 World;
	attribute vec4 Vertex;
	attribute vec2 Texcoord;
	varying mediump vec2 TexcoordVarying;

	void main() {
		gl_Position = Vertex;
		gl_Position = World * gl_Position;
		gl_Position = Projection * gl_Position;
		TexcoordVarying = Texcoord;
	}
`;

const GLSL_SPRITE_FRAGMENT = `
	uniform sampler2D Sampler;
	varying mediump vec2 TexcoordVarying;

	void main() {
		gl_FragColor = texture2D(Sampler, TexcoordVarying);
		//gl_FragColor = vec4(1.0, 0.5, 0.5, 1.0);
	}
`;
