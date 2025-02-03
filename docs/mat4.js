/*
Copyright 2025 Taichi Murakami.
GLSL における mat4 を表します。
*/

import * as Vec3 from "./vec3.js";
const COUNT = 16;
const M11 = 0,  M12 = 1,  M13 = 2,  M14 = 3;
const M21 = 4,  M22 = 5,  M23 = 6,  M24 = 7;
const M31 = 8,  M32 = 9,  M33 = 10, M34 = 11;
const M41 = 12, M42 = 13, M43 = 14, M44 = 15;
const X = 0, Y = 1, Z = 2;

/* 新しい行列を返します。 */
function create() {
	return new Float32Array(COUNT);
}

/* 指定した行列に単位行列を設定します。 */
function identity(m0) {
	load(m0,
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
}

/* 指定した行列に値を設定します。 */
function load(m0, r11, r12, r13, r14, r21, r22, r23, r24, r31, r32, r33, r34, r41, r42, r43, r44) {
	m0[M11] = r11; m0[M12] = r12; m0[M13] = r13; m0[M14] = r14;
	m0[M21] = r21; m0[M22] = r22; m0[M23] = r23; m0[M24] = r24;
	m0[M31] = r31; m0[M32] = r32; m0[M33] = r33; m0[M34] = r34;
	m0[M41] = r41; m0[M42] = r42; m0[M43] = r43; m0[M44] = r44;
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 注視位置。X3, Y3, Z3; 上方向。 */
function lookAt(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	lookTo(m0, x1, y1, z1, x2 - x1, y2 - y1, z2 - z1, x3, y3, z3);
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 視線方向。X3, Y3, Z3; 上方向。 */
function lookTo(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
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
	load(m0,
		v1[X],            v2[X],            v3[X],            0.0,
		v1[Y],            v2[Y],            v3[Y],            0.0,
		v1[Z],            v2[Z],            v3[Z],            0.0,
		Vec3.dot(v1, v4), Vec3.dot(v2, v4), Vec3.dot(v3, v4), 1.0
	);
}

/* 行列の積。 */
function mul(m0, m1, m2) {
	load(m0,
		(m1[M11] * m2[M11]) + (m1[M12] * m2[M21]) + (m1[M13] * m2[M31]) + (m1[M14] * m2 [M41]),
		(m1[M11] * m2[M12]) + (m1[M12] * m2[M22]) + (m1[M13] * m2[M32]) + (m1[M14] * m2 [M42]),
		(m1[M11] * m2[M13]) + (m1[M12] * m2[M23]) + (m1[M13] * m2[M33]) + (m1[M14] * m2 [M43]),
		(m1[M11] * m2[M14]) + (m1[M12] * m2[M24]) + (m1[M13] * m2[M34]) + (m1[M14] * m2 [M44]),
		(m1[M21] * m2[M11]) + (m1[M22] * m2[M21]) + (m1[M23] * m2[M31]) + (m1[M24] * m2 [M41]),
		(m1[M21] * m2[M12]) + (m1[M22] * m2[M22]) + (m1[M23] * m2[M32]) + (m1[M24] * m2 [M42]),
		(m1[M21] * m2[M13]) + (m1[M22] * m2[M23]) + (m1[M23] * m2[M33]) + (m1[M24] * m2 [M43]),
		(m1[M21] * m2[M14]) + (m1[M22] * m2[M24]) + (m1[M23] * m2[M34]) + (m1[M24] * m2 [M44]),
		(m1[M31] * m2[M11]) + (m1[M32] * m2[M21]) + (m1[M33] * m2[M31]) + (m1[M34] * m2 [M41]),
		(m1[M31] * m2[M12]) + (m1[M32] * m2[M22]) + (m1[M33] * m2[M32]) + (m1[M34] * m2 [M42]),
		(m1[M31] * m2[M13]) + (m1[M32] * m2[M23]) + (m1[M33] * m2[M33]) + (m1[M34] * m2 [M43]),
		(m1[M31] * m2[M14]) + (m1[M32] * m2[M24]) + (m1[M33] * m2[M34]) + (m1[M34] * m2 [M44]),
		(m1[M41] * m2[M11]) + (m1[M42] * m2[M21]) + (m1[M43] * m2[M31]) + (m1[M44] * m2 [M41]),
		(m1[M41] * m2[M12]) + (m1[M42] * m2[M22]) + (m1[M43] * m2[M32]) + (m1[M44] * m2 [M42]),
		(m1[M41] * m2[M13]) + (m1[M42] * m2[M23]) + (m1[M43] * m2[M33]) + (m1[M44] * m2 [M43]),
		(m1[M41] * m2[M14]) + (m1[M42] * m2[M24]) + (m1[M43] * m2[M34]) + (m1[M44] * m2 [M44])
	);
}

/* 平行投影行列を作成します。 */
function orthographic(m0, width, height, nearZ = -1, farZ = 1) {
	const range = nearZ / (farZ - nearZ);
	load(m0,
		2.0 / width, 0.0,          0.0,            0.0,
		0.0,         2.0 / height, 0.0,            0.0,
		0.0,         0.0,          range,          0.0,
		0.0,         0.0,          -range * nearZ, 1.0
	);
}

/* 透視変換行列を作成します。 */
function perspective(m0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos(fovAngleY);
	const sinFov = Math.sin(fovAngleY);
	const range = 1 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	load(m0,
		width, 0.0,    0.0,                           0.0,
		0.0,   height, 0.0,                           0.0,
		0.0,   0.0,    range * (farZ + nearZ),        1.0,
		0.0,   0.0,    -2.0 * range * (farZ * nearZ), 0.0
	);
}

/* 回転行列を作成します。 */
function rotation(m0, x, y, z) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	load(m0,
		(sinX * sinY * sinZ) + (cosY * cosZ), cosX * sinZ, (sinX * cosY * sinZ) - (sinY * cosZ), 0.0,
		(sinX * sinY * cosZ) - (cosY * sinZ), cosX * cosZ, (sinX * cosY * cosZ) + (sinY * sinZ), 0.0,
		cosX * sinY,                          -sinX,       cosX * cosY,                          0.0,
		0.0,                                  0.0,         0.0,                                  1.0
	);
}

function rotationFromVector(m0, v1) {
	rotation(m0, v1[X], v1[Y], v1[Z]);
}

/* 回転行列 X を作成します。 */
function rotationX(m0, x) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	load(m0,
		1.0, 0.0,   0.0,  0.0,
		0.0, cosX,  sinX, 0.0,
		0.0, -sinX, cosX, 0.0,
		0.0, 0.0,   0.0,  1.0
	);
}

/* 回転行列 Y を作成します。 */
function rotationY(m0, y) {
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	load(m0,
		cosY, 0.0, -sinY, 0.0,
		0.0,  1.0, 0.0,   0.0,
		sinY, 0.0, cosY,  0.0,
		0.0,  0.0, 0.0,   1.0
	);
}

/* 回転行列 Z を作成します。 */
function rotationZ(m0, z) {
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	load(m0,
		cosZ,  sinZ, 0.0, 0.0,
		-sinZ, cosZ, 0.0, 0.0,
		0.0,   0.0,  1.0, 0.0,
		0.0,   0.0,  0.0, 1.0
	);
}

/* 拡大変換行列を作成します。 */
function scaling(m0, x, y, z = 1) {
	load(m0,
		x,   0.0, 0.0, 0.0,
		0.0, y,   0.0, 0.0,
		0.0, 0.0, z,   0.0,
		0.0, 0.0, 0.0, 1.0
	);
}

function scalingFromVector(m0, v1) {
	scaling(m0, v1[X], v1[Y], v1[Z]);
}

/* 平行移動行列を作成します。 */
function translation(m0, x, y, z = 0) {
	load(m0,
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		x,   y,   z,   1.0
	);
}

function translationFromVector(m0, v1) {
	translation(m0, v1[X], v1[Y], v1[Z]);
}

/* 転置行列を作成します。 */
function transpose(m0, m1) {
	load(m0,
		m1[M11], m1[M21], m1[M31], m1[M41],
		m1[M12], m1[M22], m1[M32], m1[M42],
		m1[M13], m1[M23], m1[M33], m1[M43],
		m1[M14], m1[M24], m1[M34], m1[M44]
	);
}

export {
	COUNT,
	M11, M12, M13, M14,
	M21, M22, M23, M24,
	M31, M32, M33, M34,
	M41, M42, M43, M44,
	create,
	identity,
	load,
	lookAt,
	lookTo,
	mul,
	orthographic,
	perspective,
	rotation,
	rotationFromVector,
	rotationX,
	rotationY,
	rotationZ,
	scaling,
	scalingFromVector,
	translation,
	translationFromVector,
	transpose
};
