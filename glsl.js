/*
Copyright 2024 Taichi Murakami.
GLSL で記述されたシェーダー ソース。
*/

const GLSL_SPRITE_VERTEX = `
	uniform mat4 World;
	attribute vec4 Vertex;

	void main() {
		gl_Position = World * Vertex;
	}
`;

const GLSL_SPRITE_FRAGMENT = `
	void main() {
		gl_FragColor = vec4(1.0, 0.5, 0.5, 1.0);
	}
`;
