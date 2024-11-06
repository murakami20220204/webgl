/*
Copyright 2024 Taichi Murakami.
GLSL で記述されたシェーダー ソース。
*/
const GLSL_PROJECTION = "Projection";
const GLSL_RECTANGLE =  "Rectangle";
const GLSL_TEXCOORD =   "Texcoord";
const GLSL_TEXTURE =    "Sampler";
const GLSL_VERTEX =     "Vertex";
const GLSL_VIEW =       "View";
const GLSL_WORLD =      "World";
const GLSL_SPRITE_VERTEX = `
	uniform mat4 Projection;
	uniform mat4 World;
	uniform vec4 Rectangle;
	attribute vec4 Vertex;
	attribute vec2 Texcoord;
	varying mediump vec2 va_Texcoord;
	void main() {
		gl_Position = Projection * World * Vertex;
		va_Texcoord = (Texcoord - Rectangle.xy) / Rectangle.zw;
	}
`;
const GLSL_SPRITE_FRAGMENT = `
	uniform sampler2D Sampler;
	varying mediump vec2 va_Texcoord;
	void main() {
		gl_FragColor = texture2D(Sampler, va_Texcoord);
	}
`;
