/*
Copyright 2025 Taichi Murakami.
*/

const BILLBOARD_POSITION_BUFFER = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
const BILLBOARD_TEXCOORD_BUFFER = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
const DEFAULT_ASPECT_RATIO = 1.33;
const ERROR_CREATE_ARRAY_BUFFER = "WebGL Array Buffer cannot be created.";
const ERROR_CREATE_ATTRIB_LOCATION = "WebGL Attribute Location not found.";
const ERROR_CREATE_PROGRAM = "WebGL Program cannot be created.";
const ERROR_CREATE_SHADER = "WebGL Shader cannot be created.";
const ERROR_CREATE_TEXTURE = "WebGL Texture cannot be created.";
const ERROR_CREATE_UNIFORM_LOCATION = "WebGL Uniform Location not found.";
const HTTP_REQUEST_COMPLETE = 4;
const HTTP_STATUS_OK = 200;
const SPRITE_VERTEX_COUNT = 4;
let canvas;
let cubeMesh;
let defaultShader;
let gl;
let sprite;
let spriteShader;

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
	uniform sampler2D Sampler;
	varying mediump vec2 va_Texcoord;
	varying mediump float va_Diffuse;
	void main(void) {
		gl_FragColor = texture2D(Sampler, va_Texcoord) * va_Diffuse;
	}
`;

const DEFAULT_VERTEX_SHADER = `
	uniform mat4 World;
	uniform mat4 View;
	uniform mat4 Projection;
	uniform vec3 LightDirection;
	attribute vec3 Position;
	attribute vec3 Normal;
	attribute vec2 Texcoord;
	varying mediump vec2 va_Texcoord;
	varying mediump float va_Diffuse;
	void main(void) {
		gl_Position = Projection * View * World * vec4(Position, 1.0);
		va_Texcoord = Texcoord;
		va_Diffuse = max(dot(vec3(World * vec4(Normal, 1.0)), LightDirection), 0.0);
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
Vec3:
GLSL における vec3。
*******************************************************************************/
const Vec3 = {}

Vec3.add = function(v0, v1, v2) {
	Vec3.load(v0,
		v1[0] + v2[0],
		v1[1] + v2[1],
		v1[2] + v2[2]
	);
}

Vec3.create = function() {
	return new Float32Array(3);
}

Vec3.cross = function(v0, v1, v2) {
	Vec3.load(v0,
		(v1[1] * v2[2]) - (v1[2] * v2[1]),
		(v1[2] * v2[0]) - (v1[0] * v2[2]),
		(v1[0] * v2[1]) - (v1[1] * v2[0])
	);
}

Vec3.div = function(v0, v1, v2) {
	Vec3.load(v0,
		v1[0] / v2[0],
		v1[1] / v2[1],
		v1[2] / v2[2]
	);
}

Vec3.dot = function(v1, v2) {
	return (
		(v1[0] * v2[0]) +
		(v1[1] * v2[1]) +
		(v1[2] * v2[2])
	);
}

Vec3.length = function(v1) {
	return Math.sqrt(Vec3.dot(v1, v1));
}

Vec3.lengthSquared = function(v1) {
	return Vec3.dot(v1, v1);
}

Vec3.load = function(v0, x, y, z) {
	v0[0] = x;
	v0[1] = y;
	v0[2] = z;
}

Vec3.mul = function(v0, v1, v2) {
	Vec3.load(v0,
		v1[0] * v2[0],
		v1[1] * v2[1],
		v1[2] * v2[2]
	);
}

Vec3.neg = function(v0, v1) {
	Vec3.load(v0, -v1[0], -v1[1], -v1[2]);
}

Vec3.normalize = function(v0, v1) {
	let length = Vec3.length(v1);
	if (length > 0) length = 1 / length;
	Vec3.load(v0,
		v1[0] * length,
		v1[1] * length,
		v1[2] * length
	);
}

Vec3.rep = function(v0, r1) {
	Vec3.load(v0, r1, r1, r1);
}

Vec3.sub = function(v0, v1, v2) {
	Vec3.load(v0,
		v1[0] - v2[0],
		v1[1] - v2[1],
		v1[2] - v2[2]
	);
}

Vec3.zero = function(v0) {
	Vec3.load(v0, 0, 0, 0);
}

/*******************************************************************************
Mat4:
GLSL における mat4。
*******************************************************************************/
const Mat4 = {}

/* 新しい行列を返します。 */
Mat4.create = function() {
	return new Float32Array(16);
}

/* 指定した行列に単位行列を設定します。 */
Mat4.identity = function(m0) {
	Mat4.load(m0,
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}

/* 指定した行列に値を設定します。 */
Mat4.load = function(m0, r11, r12, r13, r14, r21, r22, r23, r24, r31, r32, r33, r34, r41, r42, r43, r44) {
	m0[0]  = r11; m0[1]  = r12; m0[2]  = r13; m0[3]  = r14;
	m0[4]  = r21; m0[5]  = r22; m0[6]  = r23; m0[7]  = r24;
	m0[8]  = r31; m0[9]  = r32; m0[10] = r33; m0[11] = r34;
	m0[12] = r41; m0[13] = r42; m0[14] = r43; m0[15] = r44;
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 注視位置。X3, Y3, Z3; 上方向。 */
Mat4.lookAt = function(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	Mat4.lookTo(m0, x1, y1, z1, x2 - x1, y2 - y1, z2 - z1, x3, y3, z3);
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 視線方向。X3, Y3, Z3; 上方向。 */
Mat4.lookTo = function(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	const v0 = Vec3.create();
	const v1 = Vec3.create();
	const v2 = Vec3.create();
	const v3 = Vec3.create();
	const v4 = Vec3.create();
	Vec3.load(v0, x2, y2, z2);
	Vec3.normalize(v3, v0);
	Vec3.load(v0, x3, y3, z3);
	Vec3.cross(v1, v0, v3);
	Vec3.normalize(v1, v1);
	Vec3.cross(v2, v3, v1);
	Vec3.load(v0, x1, y1, z1);
	Vec3.neg(v4, v0);
	Mat4.load(m0,
		v1[0],            v2[0],            v3[0],            0,
		v1[1],            v2[1],            v3[1],            0,
		v1[2],            v2[2],            v3[2],            0,
		Vec3.dot(v1, v4), Vec3.dot(v2, v4), Vec3.dot(v3, v4), 1
	);
}

/* 行列の積。 */
Mat4.mul = function(m0, m1, m2) {
	Mat4.load(m0,
		(m1[0]  * m2[0]) + (m1[1]  * m2[4]) + (m1[2]  * m2[8])  + (m1[3]  * m2 [12]),
		(m1[0]  * m2[1]) + (m1[1]  * m2[5]) + (m1[2]  * m2[9])  + (m1[3]  * m2 [13]),
		(m1[0]  * m2[2]) + (m1[1]  * m2[6]) + (m1[2]  * m2[10]) + (m1[3]  * m2 [14]),
		(m1[0]  * m2[3]) + (m1[1]  * m2[7]) + (m1[2]  * m2[11]) + (m1[3]  * m2 [15]),
		(m1[4]  * m2[0]) + (m1[5]  * m2[4]) + (m1[6]  * m2[8])  + (m1[7]  * m2 [12]),
		(m1[4]  * m2[1]) + (m1[5]  * m2[5]) + (m1[6]  * m2[9])  + (m1[7]  * m2 [13]),
		(m1[4]  * m2[2]) + (m1[5]  * m2[6]) + (m1[6]  * m2[10]) + (m1[7]  * m2 [14]),
		(m1[4]  * m2[3]) + (m1[5]  * m2[7]) + (m1[6]  * m2[11]) + (m1[7]  * m2 [15]),
		(m1[8]  * m2[0]) + (m1[9]  * m2[4]) + (m1[10] * m2[8])  + (m1[11] * m2 [12]),
		(m1[8]  * m2[1]) + (m1[9]  * m2[5]) + (m1[10] * m2[9])  + (m1[11] * m2 [13]),
		(m1[8]  * m2[2]) + (m1[9]  * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2 [14]),
		(m1[8]  * m2[3]) + (m1[9]  * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2 [15]),
		(m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8])  + (m1[15] * m2 [12]),
		(m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9])  + (m1[15] * m2 [13]),
		(m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2 [14]),
		(m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2 [15])
	);
}

/* 平行投影行列を作成します。 */
Mat4.orthographic = function(m0, width, height, nearZ = -1, farZ = 1) {
	const range = nearZ / (farZ - nearZ);
	Mat4.load(m0,
		2 / width, 0,          0,              0,
		0,         2 / height, 0,              0,
		0,         0,          range,          0,
		0,         0,          -range * nearZ, 1
	);
}

/* 透視変換行列を作成します。 */
Mat4.perspective = function(m0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos (fovAngleY);
	const sinFov = Math.sin (fovAngleY);
	const range = 1 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	Mat4.load(m0,
		width, 0,      0,                           0,
		0,     height, 0,                           0,
		0,     0,      range * (farZ + nearZ),      1,
		0,     0,      -2 * range * (farZ * nearZ), 0
	);
}

/* 回転行列を作成します。 */
Mat4.rotation = function(m0, x, y, z) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	Mat4.load(m0,
		(sinX * sinY * sinZ) + (cosY * cosZ), cosX * sinZ, (sinX * cosY * sinZ) - (sinY * cosZ), 0,
		(sinX * sinY * cosZ) - (cosY * sinZ), cosX * cosZ, (sinX * cosY * cosZ) + (sinY * sinZ), 0,
		cosX * sinY,                          -sinX,       cosX * cosY,                          0,
		0,                                    0,           0,                                    1
	);
}

/* 回転行列 Z を作成します。 */
Mat4.rotationZ = function(m0, z) {
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	Mat4.load(m0,
		cosZ,  sinZ, 0, 0,
		-sinZ, cosZ, 0, 0,
		0,     0,    1, 0,
		0,     0,    0, 1
	);
}

/* 拡大変換行列を作成します。 */
Mat4.scaling = function(m0, x, y, z = 1) {
	Mat4.load(m0,
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	);
}

/* 平行移動行列を作成します。 */
Mat4.translation = function(m0, x, y, z = 0) {
	Mat4.load(m0,
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	);
}

/*******************************************************************************
GL:
WebGL ヘルパー関数。
*******************************************************************************/
const GL = {}

/* 新しい頂点バッファーを作成します。 */
GL.createBuffer = function(target, array, usage) {
	const buffer = gl.createBuffer();

	if (buffer) {
		gl.bindBuffer(target, buffer);
		gl.bufferData(target, array, usage);
		gl.bindBuffer(target, null);
	}

	return buffer;
}

/* 既存の Shader から新しい Program を作成します。 */
GL.createProgram = function(vertexShader, fragmentShader) {
	const program = gl.createProgram();

	if (program) {
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(new Error(gl.getProgramInfoLog(program)));
			gl.deleteProgram(program);
			program = null;
		}
	}

	return program;
}

/* 既存のソースから新しい Shader を作成します。 */
GL.createShader = function(type, source) {
	const shader = gl.createShader(type);

	if (shader) {
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(new Error(gl.getShaderInfoLog(shader)));
			gl.deleteShader(shader);
			shader = null;
		}
	}

	return shader;
}

/* 新しいテクスチャを作成します。 */
GL.createTexture = function(url) {
	const texture = gl.createTexture();

	if (texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		const image = new Image();

		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		};

		image.src = url;
	}

	return texture;
}

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
Sprite:
任意のスプライトについて位置と回転を格納できます。
*******************************************************************************/
const Sprite = function() {
	this.location = [0, 0];
	this.rotation = 0;
	this.scale = [1, 1];
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
Default Shader:
Phong シェーディング。
*******************************************************************************/
const DefaultShader = function(vertexShader, fragmentShader) {
	this.program = GL.createProgram(vertexShader, fragmentShader);
	this.world = gl.getUniformLocation(this.program, "World");
	this.view = gl.getUniformLocation(this.program, "View");
	this.projection = gl.getUniformLocation(this.program, "Projection");
	this.sampler = gl.getUniformLocation(this.program, "Sampler");
	this.position = gl.getAttribLocation(this.program, "Position");
	this.normal = gl.getAttribLocation(this.program, "Normal");
	this.texcoord = gl.getAttribLocation(this.program, "Texcoord");
}

/* 現在のシェーダーを選択します。 */
DefaultShader.prototype.enable = function() {
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.position);
	gl.enableVertexAttribArray(this.normal);
	gl.enableVertexAttribArray(this.texcoord);
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

Actor.prototype.draw = function() {
	const m1 = Mat4.create();
	this.shader.enable();
	this.mesh.enable();
	Mat4.rotation(m1, this.rotation.x, this.rotation.y, this.rotation.z);
	gl.uniformMatrix4fv(this.shader.world, false, m1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(this.shader.sampler, 0);
	this.mesh.draw();
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
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	const defaultFragmentShader = GL.createShader(gl.FRAGMENT_SHADER, DEFAULT_FRAGMENT_SHADER);
	const defaultVertexShader = GL.createShader(gl.VERTEX_SHADER, DEFAULT_VERTEX_SHADER);
	const spriteFragmentShader = GL.createShader(gl.FRAGMENT_SHADER, SPRITE_FRAGMENT_SHADER);
	const spriteVertexShader = GL.createShader(gl.VERTEX_SHADER, SPRITE_VERTEX_SHADER);
	sprite = new Sprite();
	spriteShader = new SpriteShader(spriteVertexShader, spriteFragmentShader);
	spriteTexture = GL.createTexture("favicon.png");
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
