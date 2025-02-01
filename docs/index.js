/*
Copyright 2025 Taichi Murakami.
*/

import * as GL from "./glu.js";
import * as Mat4 from "./mat4.js";
//import * as Vec3 from "./vec3.js";
const BILLBOARD_POSITION_BUFFER = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
const BILLBOARD_TEXCOORD_BUFFER = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
const DEFAULT_ASPECT_RATIO = 1.33;
const HTTP_REQUEST_COMPLETE = 4;
const HTTP_STATUS_OK = 200;
const SPRITE_VERTEX_COUNT = 4;
let canvas;
let cubeMesh;
let defaultShader;
let gl;
let sprite;
let spriteShader;
let spriteTexture;

const CUBE_ELEMENT_BUFFER = [
	0, 1, 2, 2, 3, 0,
	4, 5, 6, 6, 7, 0,
];

const CUBE_NORMAL_BUFFER = [
	1, 0, 0,
];

const CUBE_POSITION_BUFFER = [
	1, 1, 1,
	1, 1, -1,
	1, -1, 1,
	1, -1, -1,
	-1, 1, -1,
	-1, 1, 1,
	-1, -1, -1,
	-1, -1, 1,
];

const CUBE_TEXCOORD_BUFFER = [
	0, 0, 1, 0, 0, 1, 1, 1,
	0, 0, 1, 0, 0, 1, 1, 1,
	0, 0, 1, 0, 0, 1, 1, 1,
	0, 0, 1, 0, 0, 1, 1, 1,
	0, 0, 1, 0, 0, 1, 1, 1,
	0, 0, 1, 0, 0, 1, 1, 1,
];

const DEFAULT_FRAGMENT_SHADER = `
	uniform sampler2D sampler;
	varying mediump vec2 va_Texcoord;
	varying mediump float va_Diffuse;
	void main(void) {
		gl_FragColor = texture2D(sampler, va_Texcoord) * va_Diffuse;
	}
`;

const DEFAULT_VERTEX_SHADER = `
	uniform mat4 Model;
	uniform mat4 View;
	uniform mat4 Projection;
	uniform vec3 LightDirection;
	attribute vec3 Position;
	attribute vec3 Normal;
	attribute vec2 Texcoord;
	varying mediump vec2 va_Texcoord;
	varying mediump float va_Diffuse;
	void main(void) {
		gl_Position = Projection * View * Model * vec4(Position, 1.0);
		va_Texcoord = Texcoord;
		va_Diffuse = max(dot(vec3(Model * vec4(Normal, 1.0)), LightDirection), 0.0);
	}
`;

const SPRITE_FRAGMENT_SHADER = `
	uniform sampler2D sampler;
	varying mediump vec2 va_Texcoord;

	void main(void) {
		gl_FragColor = texture2D(sampler, va_Texcoord);
	}
`;

const SPRITE_VERTEX_SHADER = `
	uniform mat4 model;
	uniform mat4 projection;
	attribute vec2 position;
	attribute vec2 texcoord;
	varying mediump vec2 va_Texcoord;

	void main(void) {
		gl_Position = projection *  model * vec4(position, 0.0, 1.0);
		va_Texcoord = texcoord;
	}
`;

/*******************************************************************************
Shader:
基底クラス。
*******************************************************************************/
const Shader = function() {
	this.program = null;
}

/* 現在の Program を破棄します。 */
Shader.prototype.destroy = function() {
	if (this.program === null) {
		gl.deleteProgram(this.program);
		this.program = null;
	}
}

/*******************************************************************************
Default Shader:
Phong シェーディング。
*******************************************************************************/
const DefaultShader = function(vertexShader, fragmentShader) {
	this.program = GL.createProgram(vertexShader, fragmentShader);
	this.uniform = {
		model: gl.getUniformLocation(this.program, "Model"),
		view: gl.getUniformLocation(this.program, "View"),
		projection: gl.getUniformLocation(this.program, "Projection"),
		sampler: gl.getUniformLocation(this.program, "Sampler")
	};
	this.attribute = {
		position: gl.getAttribLocation(this.program, "Position"),
		normal: gl.getAttribLocation(this.program, "Normal"),
		texcoord: gl.getAttribLocation(this.program, "Texcoord")
	};
}

DefaultShader.prototype = Shader.prototype;

/* 現在のシェーダーを選択します。 */
DefaultShader.prototype.enable = function() {
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.position);
	gl.enableVertexAttribArray(this.normal);
	gl.enableVertexAttribArray(this.texcoord);
}

/* ワールド変換行列を更新します。 */
DefaultShader.prototype.updateModel = function(actor) {
	const m0 = Mat4.create();
	const m1 = Mat4.create();
	Mat4.scaling(m0, actor.scale[0], actor.scale[1], actor.scale[2]);
	Mat4.rotationZ(m1, actor.rotation[0], actor.rotation[1], actor.rotation[2]);
	Mat4.mul(m0, m0, m1);
	Mat4.translation(m1, actor.location[0], actor.location[1], actor.location[2]);
	Mat4.mul(m0, m0, m1);
	gl.uniformMatrix4fv(this.uniform.model, false, m0);
}

/* ビュー変換行列を更新します。 */
DefaultShader.prototype.updateProjection = function() {
}

/* テクスチャ サンプラーを更新します。 */
DefaultShader.prototype.updateTexture = function(texture) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(this.uniform.sampler, 0);
}

/*******************************************************************************
Sprite Shader:
スプライトを描画する方法を提供します。
*******************************************************************************/
const SpriteShader = function(vertexShader, fragmentShader) {
	this.program = GL.createProgram(vertexShader, fragmentShader);
	this.uniform = {
		model: gl.getUniformLocation(this.program, "model"),
		projection: gl.getUniformLocation(this.program, "projection"),
		sampler: gl.getUniformLocation(this.program, "sampler")
	};
	this.attribute = {
		position: gl.getAttribLocation(this.program, "position"),
		texcoord: gl.getAttribLocation(this.program, "texcoord")
	};
	this.buffers = {
		position: GL.createBuffer(gl.ARRAY_BUFFER, BILLBOARD_POSITION_BUFFER, gl.STATIC_DRAW),
		texcoord: GL.createBuffer(gl.ARRAY_BUFFER, BILLBOARD_TEXCOORD_BUFFER, gl.STATIC_DRAW)
	};
}

SpriteShader.prototype = Shader.prototype;

/* 現在の設定でスプライトを描画します。 */
SpriteShader.prototype.draw = function() {
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, SPRITE_VERTEX_COUNT);
}

/* スプライト用シェーダーを選択します。 */
SpriteShader.prototype.enable = function() {
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.attribute.position);
	gl.enableVertexAttribArray(this.attribute.texcoord);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
	gl.vertexAttribPointer(this.attribute.position, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texcoord);
	gl.vertexAttribPointer(this.attribute.texcoord, 2, gl.FLOAT, false, 0, 0);
}

/* ワールド変換行列を更新します。 */
SpriteShader.prototype.updateModel = function(sprite) {
	const m0 = Mat4.create();
	const m1 = Mat4.create();
	Mat4.scaling(m0, sprite.scale[0], sprite.scale[1]);
	Mat4.rotationZ(m1, sprite.rotation);
	Mat4.mul(m0, m0, m1);
	Mat4.translation(m1, sprite.location[0], sprite.location[1]);
	Mat4.mul(m0, m0, m1);
	gl.uniformMatrix4fv(this.uniform.model, false, m0);
}

/* ビュー変換行列を更新します。 */
SpriteShader.prototype.updateProjection = function() {
	const m0 = Mat4.create();
	let width = canvas.width;
	let height = canvas.height;

	if (height > 0) {
		const aspectRatio = width / height;

		if (aspectRatio >= DEFAULT_ASPECT_RATIO) {
			width = 2 * aspectRatio;
			height = 2;
		} else {
			width = 2 * DEFAULT_ASPECT_RATIO;
			height = width / aspectRatio;
		}

		Mat4.orthographic(m0, width, height);
	} else {
		Mat4.identity(m0);
	}

	gl.uniformMatrix4fv(this.uniform.projection, false, m0);
}

/* テクスチャ サンプラーを更新します。 */
SpriteShader.prototype.updateTexture = function(texture) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(this.uniform.sampler, 0);
}

/*******************************************************************************
Cube Mesh:
メッシュ用バッファーを格納します。
*******************************************************************************/
const CubeMesh = function() {
	this.position = GL.createBuffer(gl.ARRAY_BUFFER, CUBE_POSITION_BUFFER, gl.STATIC_DRAW);
	this.normal = GL.createBuffer(gl.ARRAY_BUFFER, CUBE_NORMAL_BUFFER, gl.STATIC_DRAW);
	this.texcoord = GL.createBuffer(gl.ARRAY_BUFFER, CUBE_TEXCOORD_BUFFER, gl.STATIC_DRAW);
	this.element = GL.createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(CUBE_ELEMENT_BUFFER), gl.STATIC_DRAW);
}

/* 現在のメッシュを描画します。 */
CubeMesh.prototype.draw = function() {
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
}

CubeMesh.prototype.enable = function(shader) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
	gl.vertexAttribPointer(shader.position, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normal);
	gl.vertexAttribPointer(shader.normal, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoord);
	gl.vertexAttribPointer(shader.normal, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.element);
}

/*******************************************************************************
Sprite:
任意のメッシュについて位置と回転を格納できます。
*******************************************************************************/
const Actor = function() {
	this.texture = null;
	this.location = [0, 0, 0];
	this.mesh = null;
	this.rotation = [0, 0, 0];
	this.scale = [0, 0, 0];
	this.shader = null;
}

/* 現在の設定でシェーダーを更新します。 */
Actor.prototype.updateShader = function(shader) {
	const m0 = Mat4.create();
	const m1 = Mat4.create();
	Mat4.scaling(m0, actor.scale[0], actor.scale[1], actor.scale[2]);
	Mat4.rotationZ(m1, actor.rotation[0], actor.rotation[1], actor.rotation[2]);
	Mat4.mul(m0, m0, m1);
	Mat4.translation(m1, actor.location[0], actor.location[1], actor.location[2]);
	Mat4.mul(m0, m0, m1);
	gl.uniformMatrix4fv(shader.uniform.model, false, m0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(this.uniform.sampler, 0);
}

/*******************************************************************************
Camera:
視点位置を格納できます。
*******************************************************************************/
function Camera() {
	this.eyePosition = [0, 5, 2.5];
	this.focusPosition = [0, 0, 0];
	this.upDirection = [0, 0, 1];
	this.fovAngleY = 1;
	this.aspectRatio = 1;
	this.nearZ = 0.1;
	this.farZ = 100;
}

/* 現在のカメラを用いてシェーダー変数を設定します。 */
Camera.prototype.updateShader = function(shader) {
	const m0 = Mat4.create();
	Mat4.lookAt(m0, this.eyePosition[0], this.eyePosition[1], this.eyePosition[2], this.focusPosition[0], this.focusPosition[1], this.focusPosition[2], this.upDirection[0], this.upDirection[1], this.upDirection[2]);
	gl.uniformMatrix4fv(shader.uniform.view, false, m0);
	Mat4.perspective(m0, this.fovAngleY, this.aspectRatio, this.nearZ, this.farZ);
	gl.uniformMatrix4fv(shader.uniform.projection, false, m0);
}

/*******************************************************************************
Sprite:
任意のスプライトについて位置と回転を格納できます。
*******************************************************************************/
const Sprite = function() {
	this.location = [0, 0];
	this.rotation = 0;
	this.scale = [1, 1];
}

function drawCube(timestamp) {
	const m1 = Mat4.create();
	Mat4.rotation(m1, timestamp / 1024, timestamp / 512, timestamp / 256);
	gl.uniformMatrix4fv(sprite.world, false, m1);
	Mat4.lookAt(m1, 0, 2, 5, 0, 0, 0, 0, 1, 0);
	gl.uniformMatrix4fv(sprite.view, false, m1);
	Mat4.perspective(m1, 0.25, canvas.width / canvas.height, 0.1, 100);
	gl.uniformMatrix4fv(sprite.projection, false, m1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, spriteTexture);
	gl.uniform1i(sprite.sampler, 0);

	gl.drawElements(gl.TRIANGLS, CUBE_VERTEX_COUNT, gl.UNSIGNED_BYTE, 0);
}

/* 指定した値が 2 の累乗である場合は true を返します。 */
function isPowerOfTwo(value) {
	return (value & (value - 1)) === 0;
}

/* この関数は画面を描画すべき時に呼び出されます。 */
function onAnimationFrame(timestamp) {
	resizeCanvas();
	//enableSpriteShader();
	gl.enable(gl.CULL_FACE);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	spriteShader.enable();
	spriteShader.updateModel(sprite);
	spriteShader.updateProjection();
	spriteShader.updateTexture(spriteTexture);
	spriteShader.draw();
	requestAnimationFrame(onAnimationFrame);
}

/* この関数は例外が発生した時に呼び出されます。 */
function onError(error) {
	console.error(error);
	stop();
}

/* この関数は HTML ページが読み込まれた時に呼び出されます。 */
function onLoad() {
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");
	GL.setContext(gl);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	const defaultFragmentShader = GL.createShader(gl.FRAGMENT_SHADER, DEFAULT_FRAGMENT_SHADER);
	const defaultVertexShader = GL.createShader(gl.VERTEX_SHADER, DEFAULT_VERTEX_SHADER);
	const spriteFragmentShader = GL.createShader(gl.FRAGMENT_SHADER, SPRITE_FRAGMENT_SHADER);
	const spriteVertexShader = GL.createShader(gl.VERTEX_SHADER, SPRITE_VERTEX_SHADER);
	sprite = new Sprite();
	spriteShader = new SpriteShader(spriteVertexShader, spriteFragmentShader);
	spriteTexture = GL.createTexture("./favicon.png");
	requestAnimationFrame(onAnimationFrame);
}

/* 画面解像度は Canvas の大きさに等しくなります。 */
function resizeCanvas() {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	if ((canvas.width != width) || (canvas.height != height)) {
		canvas.width = width;
		canvas.height = height;
	}
}

addEventListener("error", onError);
addEventListener("load", onLoad);
