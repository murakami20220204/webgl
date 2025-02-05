/*
Copyright 2025 Taichi Murakami.
*/

import * as GL from "./glu.js";
import * as Vec3 from "./vec3.js";
import * as Mat4 from "./mat4.js";
//import * as Vec3 from "./vec3.js";
const BILLBOARD_POSITION_BUFFER = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
const BILLBOARD_TEXCOORD_BUFFER = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
const DEFAULT_ASPECT_RATIO = 1.33;
const HTTP_REQUEST_COMPLETE = 4;
const HTTP_STATUS_OK = 200;
const SPRITE_VERTEX_COUNT = 4;
let actor;
let canvas;
let cubeMesh;
let gl;
let solidShader;
let sprite;
let spriteMesh;
let spriteShader;
let spriteTexture;

const CUBE_INDEX_BUFFER = [
	0, 1, 2, 2, 1, 3,
	4, 5, 6, 6, 5, 7,
];

const CUBE_VERTEX_BUFFER = [
	/* X+ */
	+1, +1, +1, +1, 0, 0, 0, 0,
	+1, +1, -1, +1, 0, 0, 1, 0,
	+1, -1, +1, +1, 0, 0, 0, 1,
	+1, -1, -1, +1, 0, 0, 1, 1,
	/* X- */
	-1, +1, -1, -1, 0, 0, 0, 0,
	-1, +1, +1, -1, 0, 0, 1, 0,
	-1, -1, -1, -1, 0, 0, 0, 1,
	-1, -1, +1, -1, 0, 0, 1, 1
];

const DEFAULT_FRAGMENT_SHADER = `
	uniform sampler2D sampler;
	varying mediump vec2 va_Texcoord;
	varying mediump float va_Diffuse;
	void main(void) {
		gl_FragColor = texture2D(sampler, va_Texcoord);
		gl_FragColor.xyz *= va_Diffuse;
		//gl_FragColor = texture2D(sampler, va_Texcoord);
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
		va_Diffuse = min(max(dot(vec3(Model * vec4(Normal, 1.0)), LightDirection), 0.0), 1.0);
		//va_Diffuse = 0.5;
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

/* この関数は画面を描画すべき時に呼び出されます。 */
function onAnimationFrame(timestamp) {
	resizeCanvas();
	gl.enable(gl.CULL_FACE);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	spriteShader.enable();
	spriteShader.updateModel(sprite);
	spriteShader.updateProjection();
	spriteShader.updateTexture(spriteTexture);
	spriteMesh.enable(spriteShader);
	spriteMesh.draw();
	actor.rotationY = timestamp / 1000.0;
	solidShader.enable();
	solidShader.updateModel(actor);
	solidShader.updateView();
	solidShader.updateProjection();
	solidShader.updateTexture(spriteTexture);
	solidShader.updateLight();
	cubeMesh.enable(solidShader);
	cubeMesh.draw();
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
	actor = new Actor();
	cubeMesh = new CubeMesh();
	solidShader = new SolidShader(defaultVertexShader, defaultFragmentShader);
	sprite = new Sprite();
	spriteMesh = new SpriteMesh();
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

/***********************************************************************************************************************
任意のメッシュについて位置と回転を格納できます。
***********************************************************************************************************************/
function Actor() {
	this.texture = null;
	this.mesh = null;
	this.locationX = 0.0;
	this.locationY = 0.0;
	this.locationZ = 0.0;
	this.rotationX = 0.0;
	this.rotationY = 0.0;
	this.rotationZ = 0.0;
	this.scaleX = 1.0;
	this.scaleY = 1.0;
	this.scaleZ = 1.0;
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

/***********************************************************************************************************************
視点位置を格納できます。
***********************************************************************************************************************/
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

/***********************************************************************************************************************
メッシュ用バッファーを格納します。
***********************************************************************************************************************/
function CubeMesh() {
	this.vertices = GL.createBuffer(gl.ARRAY_BUFFER, new Float32Array(CUBE_VERTEX_BUFFER), gl.STATIC_DRAW);
	this.indices = GL.createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(CUBE_INDEX_BUFFER), gl.STATIC_DRAW);
}

/* 現在のメッシュを描画します。 */
CubeMesh.prototype.draw = function() {
	gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);
}

CubeMesh.prototype.enable = function(shader) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
	gl.vertexAttribPointer(shader.position, 3, gl.FLOAT, false, 32, 0);
	gl.vertexAttribPointer(shader.normal, 3, gl.FLOAT, false, 32, 12);
	gl.vertexAttribPointer(shader.texcoord, 2, gl.FLOAT, false, 32, 24);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
}

/***********************************************************************************************************************
Phong シェーディング。
***********************************************************************************************************************/
function SolidShader(vertexShader, fragmentShader) {
	this.program = GL.createProgram(vertexShader, fragmentShader);
	this.model = gl.getUniformLocation(this.program, "Model");
	this.view = gl.getUniformLocation(this.program, "View");
	this.projection = gl.getUniformLocation(this.program, "Projection");
	this.sampler = gl.getUniformLocation(this.program, "Sampler");
	this.lightDirection = gl.getUniformLocation(this.program, "LightDirection");
	this.position = gl.getAttribLocation(this.program, "Position");
	this.normal = gl.getAttribLocation(this.program, "Normal");
	this.texcoord = gl.getAttribLocation(this.program, "Texcoord");
}

/* 現在の Program を破棄します。 */
SolidShader.prototype.destroy = function() {
	if (this.program) {
		gl.deleteProgram(this.program);
		this.program = null;
	}
}

/* 現在のシェーダーを選択します。 */
SolidShader.prototype.enable = function() {
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.position);
	gl.enableVertexAttribArray(this.normal);
	gl.enableVertexAttribArray(this.texcoord);
}

SolidShader.prototype.updateLight = function() {
	const v0 = Vec3.create();
	Vec3.load(v0, -1.0, 0.0, 1.0);
	Vec3.normalize(v0, v0);
	gl.uniform3fv(this.lightDirection, v0);
}

/* ワールド変換行列を更新します。 */
SolidShader.prototype.updateModel = function(actor) {
	const m0 = Mat4.create();
	const m1 = Mat4.create();
	Mat4.scaling(m0, actor.scaleX, actor.scaleY, actor.scaleZ);
	Mat4.rotation(m1, actor.rotationX, actor.rotationY, actor.rotationZ);
	Mat4.mul(m0, m0, m1);
	Mat4.translation(m1, actor.locationX, actor.locationY, actor.locationZ);
	Mat4.mul(m0, m0, m1);
	gl.uniformMatrix4fv(this.model, false, m0);
}

SolidShader.prototype.updateView = function() {
	const m0 = Mat4.create();
	Mat4.lookAt(m0, 0, 2, 5, 0, 0, 0, 0, 1, 0);
	//Mat4.identity(m0);
	gl.uniformMatrix4fv(this.view, false, m0);
}

/* ビュー変換行列を更新します。 */
SolidShader.prototype.updateProjection = function() {
	const m0 = Mat4.create();
	Mat4.perspective(m0, 0.5, canvas.width / canvas.height, 0.1, 100.0);
	//Mat4.orthographic(m0, 10, 10, 0.0, 100.0);
	gl.uniformMatrix4fv(this.projection, false, m0);
}

/* テクスチャ サンプラーを更新します。 */
SolidShader.prototype.updateTexture = function(texture) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(this.sampler, 0);
}

/***********************************************************************************************************************
任意のスプライトについて位置と回転を格納できます。
***********************************************************************************************************************/
function Sprite() {
	this.locationX = 0.0;
	this.locationY = 0.0;
	this.rotationZ = 0.0;
	this.scaleX = 1.0;
	this.scaleY = 1.0;
}

/***********************************************************************************************************************

***********************************************************************************************************************/
function SpriteMesh() {
	this.buffer = GL.createBuffer(gl.ARRAY_BUFFER, new Float32Array([
		+1.0, +1.0, 1.0, 0.0,
		-1.0, +1.0, 0.0, 0.0,
		+1.0, -1.0, 1.0, 1.0,
		-1.0, -1.0, 0.0, 1.0]), gl.STATIC_DRAW
	);
}

/* スプイライトを描画します。 */
SpriteMesh.prototype.draw = function() {
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/* 指定したシェーダーに現在のメッシュを割り当てます。 */
SpriteMesh.prototype.enable = function(shader) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.vertexAttribPointer(shader.position, 2, gl.FLOAT, false, 16, 0);
	gl.vertexAttribPointer(shader.texcoord, 2, gl.FLOAT, false, 16, 8);
}

/***********************************************************************************************************************
スプライトを描画する方法を提供します。
***********************************************************************************************************************/
function SpriteShader(vertexShader, fragmentShader) {
	this.program = GL.createProgram(vertexShader, fragmentShader);
	this.model = gl.getUniformLocation(this.program, "model");
	this.projection = gl.getUniformLocation(this.program, "projection");
	this.sampler = gl.getUniformLocation(this.program, "sampler");
	this.position = gl.getAttribLocation(this.program, "position");
	this.texcoord = gl.getAttribLocation(this.program, "texcoord");
}

/* 現在の Program を破棄します。 */
SpriteShader.prototype.destroy = function() {
	if (this.program) {
		gl.deleteProgram(this.program);
		this.program = null;
	}
}

/* スプライト用シェーダーを選択します。 */
SpriteShader.prototype.enable = function() {
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.position);
	gl.enableVertexAttribArray(this.texcoord);
}

/* ワールド変換行列を更新します。 */
SpriteShader.prototype.updateModel = function(sprite) {
	const m0 = Mat4.create();
	const m1 = Mat4.create();
	Mat4.scaling(m0, sprite.scaleX, sprite.scaleY);
	Mat4.rotationZ(m1, sprite.rotationZ);
	Mat4.mul(m0, m0, m1);
	Mat4.translation(m1, sprite.locationX, sprite.locationY);
	Mat4.mul(m0, m0, m1);
	gl.uniformMatrix4fv(this.model, false, m0);
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

	gl.uniformMatrix4fv(this.projection, false, m0);
}

/* テクスチャ サンプラーを更新します。 */
SpriteShader.prototype.updateTexture = function(texture) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(this.sampler, 0);
}

addEventListener("error", onError);
addEventListener("load", onLoad);
