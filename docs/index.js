/*
Copyright 2025 Taichi Murakami.
*/

const BILLBOARD_POSITION_BUFFER = [1, 1, -1, 1, 1, -1, -1, -1];
const BILLBOARD_TEXCOORD_BUFFER = [1, 0, 0, 0, 1, 1, 0, 1];
const ERROR_CREATE_ARRAY_BUFFER = "WebGL Array Buffer cannot be created.";
const ERROR_CREATE_ATTRIB_LOCATION = "WebGL Attribute Location not found.";
const ERROR_CREATE_PROGRAM = "WebGL Program cannot be created.";
const ERROR_CREATE_SHADER = "WebGL Shader cannot be created.";
const ERROR_CREATE_TEXTURE = "WebGL Texture cannot be created.";
const ERROR_CREATE_UNIFORM_LOCATION = "WebGL Uniform Location not found.";
const HTTP_REQUEST_COMPLETE = 4;
const HTTP_STATUS_OK = 200;
const MAT4_11 = 0, MAT4_12 = 1, MAT4_13 = 2, MAT4_14 = 3;
const MAT4_21 = 4, MAT4_22 = 5, MAT4_23 = 6, MAT4_24 = 7;
const MAT4_31 = 8, MAT4_32 = 9, MAT4_33 = 10, MAT4_34 = 11;
const MAT4_41 = 12, MAT4_42 = 13, MAT4_43 = 14, MAT4_44 = 15;
const SPRITE_VERTEX_COUNT = 4;
const Mat4 = {}; /* GLSL Matrix 4x4 */
const Vec3 = {}; /* GLSL Vector 3D */
const billboard = {};
const sprite = {};
let canvas;
let gl;

const FRAGMENT_SHADER_SOURCE = `
	uniform sampler2D sampler;
	varying mediump vec2 va_Texcoord;

	void main(void) {
		gl_FragColor = texture2D(sampler, va_Texcoord);
	}
`;

const VERTEX_SHADER_SOURCE = `
	uniform mat4 projection;
	uniform mat4 view;
	uniform mat4 world;
	attribute vec2 position;
	attribute vec2 texcoord;
	varying mediump vec2 va_Texcoord;

	void main(void) {
		gl_Position = projection * view * world * vec4(position, 0.0, 1.0);
		va_Texcoord = texcoord;
	}
`;

Mat4.create = function() {
	return new Float32Array(16);
}

Mat4.identity = function(m0) {
	m0[0]  = 1; m0[1]  = 0; m0[2]  = 0; m0[3]  = 0;
	m0[4]  = 0; m0[5]  = 1; m0[6]  = 0; m0[7]  = 0;
	m0[8]  = 0; m0[9]  = 0; m0[10] = 1; m0[11] = 0;
	m0[12] = 0; m0[13] = 0; m0[14] = 0; m0[15] = 1;
}

Mat4.load = function(m0, r11, r12, r13, r14, r21, r22, r23, r24, r31, r32, r33, r34, r41, r42, r43, r44) {
	m0[0]  = r11; m0[1]  = r12; m0[2]  = r13; m0[3]  = r14;
	m0[4]  = r21; m0[5]  = r22; m0[6]  = r23; m0[7]  = r24;
	m0[8]  = r31; m0[9]  = r32; m0[10] = r33; m0[11] = r34;
	m0[12] = r41; m0[13] = r42; m0[14] = r43; m0[15] = r44;
}

/*
ビュー変換行列を作成します。
X1, Y1, Z1: 視点位置。
X2, Y2, Z2: 注視位置。
X3, Y3, Z3: 上方向。
*/
Mat4.lookAt = function(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	Mat4.lookTo(m0, x1, y1, z1, x2 - x1, y2 - y1, z2 - z1, x3, y3, z3);
}

/*
ビュー変換行列を作成します。
X1, Y1, Z1: 視点位置。
X2, Y2, Z2: 視線方向。
X3, Y3, Z3: 上方向。
*/
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
	m0[0]  = v1[0];            m0[1]  = v2[0];            m0[2]  = v3[0];            m0[3]  = 0;
	m0[4]  = v1[1];            m0[5]  = v2[1];            m0[6]  = v3[1];            m0[7]  = 0;
	m0[8]  = v1[2];            m0[9]  = v2[2];            m0[10] = v3[2];            m0[11] = 0;
	m0[12] = Vec3.dot(v1, v4); m0[13] = Vec3.dot(v2, v4); m0[14] = Vec3.dot(v3, v4); m0[15] = 1;
}

Mat4.mul = function(m0, m1, m2) {
	const r11 = (m1[0]  * m2[0]) + (m1[1]  * m2[4]) + (m1[2]  * m2[8])  + (m1[3]  * m2 [12]);
	const r12 = (m1[0]  * m2[1]) + (m1[1]  * m2[5]) + (m1[2]  * m2[9])  + (m1[3]  * m2 [13]);
	const r13 = (m1[0]  * m2[2]) + (m1[1]  * m2[6]) + (m1[2]  * m2[10]) + (m1[3]  * m2 [14]);
	const r14 = (m1[0]  * m2[3]) + (m1[1]  * m2[7]) + (m1[2]  * m2[11]) + (m1[3]  * m2 [15]);
	const r21 = (m1[4]  * m2[0]) + (m1[5]  * m2[4]) + (m1[6]  * m2[8])  + (m1[7]  * m2 [12]);
	const r22 = (m1[4]  * m2[1]) + (m1[5]  * m2[5]) + (m1[6]  * m2[9])  + (m1[7]  * m2 [13]);
	const r23 = (m1[4]  * m2[2]) + (m1[5]  * m2[6]) + (m1[6]  * m2[10]) + (m1[7]  * m2 [14]);
	const r24 = (m1[4]  * m2[3]) + (m1[5]  * m2[7]) + (m1[6]  * m2[11]) + (m1[7]  * m2 [15]);
	const r31 = (m1[8]  * m2[0]) + (m1[9]  * m2[4]) + (m1[10] * m2[8])  + (m1[11] * m2 [12]);
	const r32 = (m1[8]  * m2[1]) + (m1[9]  * m2[5]) + (m1[10] * m2[9])  + (m1[11] * m2 [13]);
	const r33 = (m1[8]  * m2[2]) + (m1[9]  * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2 [14]);
	const r34 = (m1[8]  * m2[3]) + (m1[9]  * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2 [15]);
	const r41 = (m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8])  + (m1[15] * m2 [12]);
	const r42 = (m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9])  + (m1[15] * m2 [13]);
	const r43 = (m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2 [14]);
	const r44 = (m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2 [15]);
	m0[0]  = r11; m0[1]  = r12; m0[2]  = r13; m0[3]  = r14;
	m0[4]  = r21; m0[5]  = r22; m0[6]  = r23; m0[7]  = r24;
	m0[8]  = r31; m0[9]  = r32; m0[10] = r33; m0[11] = r34;
	m0[12] = r41; m0[13] = r42; m0[14] = r43; m0[15] = r44;
}

/*
平行投影行列を作成します。
*/
Mat4.orthographic = function(m0, width, height, nearZ = -1, farZ = 1) {
	const range = nearZ / (farZ - nearZ);
	m0[0]  = 2 / width; m0[1]  = 0;          m0[2]  = 0;              m0[3]  = 0;
	m0[4]  = 0;         m0[5]  = 2 / height; m0[6]  = 0;              m0[7]  = 0;
	m0[8]  = 0;         m0[9]  = 0;          m0[10] = range;          m0[11] = 0;
	m0[12] = 0;         m0[13] = 0;          m0[14] = -range * nearZ; m0[15] = 1;
}

/*
透視変換行列を作成します。
*/
Mat4.perspective = function(m0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos (fovAngleY);
	const sinFov = Math.sin (fovAngleY);
	const range = 1 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	m0[0]  = width; m0[1]  = 0;      m0[2]  = 0;                           m0[3]  = 0;
	m0[4]  = 0;     m0[5]  = height; m0[6]  = 0;                           m0[7]  = 0;
	m0[8]  = 0;     m0[9]  = 0;      m0[10] = range * (farZ + nearZ);      m0[11] = 1;
	m0[12] = 0;     m0[13] = 0;      m0[14] = -2 * range * (farZ * nearZ); m0[15] = 0;
}

Mat4.rotation = function(m0, x, y, z) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	m0[0] = (sinX * sinY * sinZ) + (cosY * cosZ);
	m0[1] = cosX * sinZ;
	m0[2] = (sinX * cosY * sinZ) - (sinY * cosZ);
	m0[3] = 0;
	m0[4] = (sinX * sinY * cosZ) - (cosY * sinZ);
	m0[5] = cosX * cosZ;
	m0[6] = (sinX * cosY * cosZ) + (sinY * sinZ);
	m0[7] = 0;
	m0[8] = cosX * sinY;
	m0[9] = -sinX;
	m0[10] = cosX * cosY;
	m0[11] = 0;
	m0[12] = 0;
	m0[13] = 0;
	m0[14] = 0;
	m0[15] = 1;
}

Mat4.scaling = function(m0, x, y, z) {
	m0[0]  = x; m0[1]  = 0; m0[2]  = 0; m0[3]  = 0;
	m0[4]  = 0; m0[5]  = y; m0[6]  = 0; m0[7]  = 0;
	m0[8]  = 0; m0[9]  = 0; m0[10] = z; m0[11] = 0;
	m0[12] = 0; m0[13] = 0; m0[14] = 0; m0[15] = 1;
}

Vec3.add = function(v0, v1, v2) {
	v0[0] = v1[0] + v2[0];
	v0[1] = v1[1] + v2[1];
	v0[2] = v1[2] + v2[2];
}

Vec3.create = function() {
	return new Float32Array(3);
}

Vec3.cross = function(v0, v1, v2) {
	const x = (v1[1] * v2[2]) - (v1[2] * v2[1]);
	const y = (v1[2] * v2[0]) - (v1[0] * v2[2]);
	const z = (v1[0] * v2[1]) - (v1[1] * v2[0]);
	v0[0] = x;
	v0[1] = y;
	v0[2] = z;
}

Vec3.div = function(v0, v1, v2) {
	v0[0] = v1[0] / v2[0];
	v0[1] = v1[1] / v2[1];
	v0[2] = v1[2] / v2[2];
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
	v0[0] = v1[0] * v2[0];
	v0[1] = v1[1] * v2[1];
	v0[2] = v1[2] * v2[2];
}

Vec3.neg = function(v0, v1) {
	v0[0] = -v1[0];
	v0[1] = -v1[1];
	v0[2] = -v1[2];
}

Vec3.normalize = function(v0, v1) {
	let length = Vec3.length(v1);
	if (length > 0) length = 1 / length;
	v0[0] = v1[0] * length;
	v0[1] = v1[1] * length;
	v0[2] = v1[2] * length;
}

Vec3.sub = function(v0, v1, v2) {
	v0[0] = v1[0] - v2[0];
	v0[1] = v1[1] - v2[1];
	v0[2] = v1[2] - v2[2];
}

Vec3.zero = function(v0) {
	v0[0] = 0;
	v0[1] = 0;
	v0[2] = 0;
}

/*
新しい頂点バッファーを作成します。
失敗した場合は例外を投げます。
*/
function createArrayBuffer(source) {
	const array = new Float32Array(source);
	const buffer = gl.createBuffer();

	if (buffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
		return buffer;
	}

	throw new Error(ERROR_CREATE_ARRAY_BUFFER);
}

/*
指定した属性の位置を返します。
失敗した場合は例外を投げます。
*/
function createAttribLocation(program, attribute) {
	const location = gl.getAttribLocation(program, attribute);
	if (location !== -1) return location;
	throw new Error(`${ERROR_CREATE_ATTRIB_LOCATION}\r\n${attribute}`);
}

/*
新しい WebGL Program を作成します。
失敗した場合は例外を投げます。
*/
function createProgram(vertexShader, fragmentShader) {
	const program = gl.createProgram();

	if (program) {
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
			return program;
		} else {
			const error = new Error(`${ERROR_CREATE_PROGRAM}\r\n${gl.getProgramInfoLog(program)}`);
			gl.deleteProgram(program);
			throw error;
		}
	}

	throw new Error(ERROR_CREATE_PROGRAM);
}

/*
新しい WebGL Shader を作成します。
失敗した場合は例外を投げます。
*/
function createShader(type, source) {
	const shader = gl.createShader(type);

	if (shader) {
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			return shader;
		} else {
			const error = new Error(`${ERROR_CREATE_SHADER}\r\n${gl.getShaderInfoLog(shader)}`);
			gl.deleteShader(shader);
			throw error;
		}
	}

	throw new Error(ERROR_CREATE_SHADER);
}

/*
新しい WebGL Shader を作成します。
失敗した場合は例外を投げます。
*/
function createShaderById(id) {
	const element = document.getElementById(id);

	if (element) {
		const request = new XMLHttpRequest();
		request.open("GET", element.src, false);
		request.send(null);

		if (request.status = HTTP_STATUS_OK) {
			let shader;

			switch (element.type) {
				case "x-shader/x-vertex":
					shader = gl.createShader(gl.VERTEX_SHADER);
					break;
				case "x-shader/x-fragment":
					shader = gl.createShader(gl.FRAGMENT_SHADER);
					break;
				default:
					shader = null;
					break;
			} if (shader) {
				gl.shaderSource(shader, request.responseText);
				gl.compileShader(shader);

				if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					return shader;
				} else {
					const error = new Error(`${ERROR_CREATE_SHADER}\r\n${gl.getShaderInfoLog(shader)}`);
					gl.deleteShader(shader);
					throw error;
				}
			}
		}
	}

	throw new Error(ERROR_CREATE_SHADER);
}

/*
新しいテクスチャを作成します。
*/
function createTextureFromUrl(url) {
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
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
		};

		image.src = url;
		return texture;
	}

	throw new Error(ERROR_CREATE_TEXTURE);
}

/*
指定した Uniform の位置を返します。
失敗した場合は例外を投げます。
*/
function createUniformLocation(program, uniform) {
	const location = gl.getUniformLocation(program, uniform);
	if (location !== null) return location;
	throw new Error(`${ERROR_CREATE_UNIFORM_LOCATION}\r\n${uniform}`);
}

/*
スプライトを描画します。
*/
function drawSprite(timestamp) {
	const m1 = Mat4.create();
	//Mat4.scaling(m1, 1, 1);
	Mat4.rotation(m1, timestamp / 1024, timestamp / 512, timestamp / 256);
	gl.uniformMatrix4fv(sprite.world, false, m1);
	//Mat4.identity(m1);
	Mat4.lookAt(m1, 0, 2, 5, 0, 0, 0, 0, 1, 0);
	gl.uniformMatrix4fv(sprite.view, false, m1);
	//Mat4.orthographic(m1, canvas.width, canvas.height, 0.1, 100);
	Mat4.perspective(m1, 0.25, canvas.width / canvas.height, 0.1, 100);
	gl.uniformMatrix4fv(sprite.projection, false, m1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, spriteTexture);
	gl.uniform1i(sprite.sampler, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, SPRITE_VERTEX_COUNT);
}

/*
スプライト用シェーダーを選択します。
*/
function enableSpriteShader() {
	gl.useProgram(sprite.program);
	gl.bindBuffer(gl.ARRAY_BUFFER, billboard.positions);
	gl.enableVertexAttribArray(sprite.position);
	gl.vertexAttribPointer(sprite.position, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, billboard.texcoords);
	gl.enableVertexAttribArray(sprite.texcoord);
	gl.vertexAttribPointer(sprite.texcoord, 2, gl.FLOAT, false, 0, 0);
}

/*
指定した値が 2 の累乗である場合は true を返します。
*/
function isPowerOfTwo(value) {
	return (value & (value - 1)) === 0;
}

/*
画面を描画します。
*/
function onAnimationFrame(timestamp) {
	resizeCanvas();
	enableSpriteShader();
	gl.viewport(0, 0, canvas.width, canvas.height);
	drawSprite(timestamp);
	requestAnimationFrame(onAnimationFrame);
}

/*
例外が発生しました。
*/
function onError(error) {
	alert(error.message);
	stop();
}

/*
HTML ファイルが読み込まれました。
*/
function onLoad(event) {
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	const spriteFragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
	const spriteVertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
	sprite.program = createProgram(spriteVertexShader, spriteFragmentShader);
	sprite.position = createAttribLocation(sprite.program, "position");
	sprite.texcoord = createAttribLocation(sprite.program, "texcoord");
	sprite.projection = createUniformLocation(sprite.program, "projection");
	sprite.sampler = createUniformLocation(sprite.program, "sampler");
	sprite.view = createUniformLocation(sprite.program, "view");
	sprite.world = createUniformLocation(sprite.program, "world");
	billboard.positions = createArrayBuffer(BILLBOARD_POSITION_BUFFER);
	billboard.texcoords = createArrayBuffer(BILLBOARD_TEXCOORD_BUFFER);
	spriteTexture = createTextureFromUrl("favicon.png");
	requestAnimationFrame(onAnimationFrame);
}

/*
画面解像度は Canvas の大きさに等しくなります。
*/
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
