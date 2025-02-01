/*
Copyright 2025 Taichi Murakami.
GLSL における mat4 を表します。
*/

import * as Vec3 from "./vec3.js";

/* 新しい行列を返します。 */
export function create() {
	return new Float32Array(16);
}

/* 指定した行列に単位行列を設定します。 */
export function identity(m0) {
	load(m0,
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}

/* 指定した行列に値を設定します。 */
export function load(m0, r11, r12, r13, r14, r21, r22, r23, r24, r31, r32, r33, r34, r41, r42, r43, r44) {
	m0[0]  = r11; m0[1]  = r12; m0[2]  = r13; m0[3]  = r14;
	m0[4]  = r21; m0[5]  = r22; m0[6]  = r23; m0[7]  = r24;
	m0[8]  = r31; m0[9]  = r32; m0[10] = r33; m0[11] = r34;
	m0[12] = r41; m0[13] = r42; m0[14] = r43; m0[15] = r44;
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 注視位置。X3, Y3, Z3; 上方向。 */
export function lookAt(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	lookTo(m0, x1, y1, z1, x2 - x1, y2 - y1, z2 - z1, x3, y3, z3);
}

/* ビュー変換行列を作成します。X1, Y1, Z1; 視点位置。X2, Y2, Z2; 視線方向。X3, Y3, Z3; 上方向。 */
export function lookTo(m0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
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
		v1[0],            v2[0],            v3[0],            0,
		v1[1],            v2[1],            v3[1],            0,
		v1[2],            v2[2],            v3[2],            0,
		Vec3.dot(v1, v4), Vec3.dot(v2, v4), Vec3.dot(v3, v4), 1
	);
}

/* 行列の積。 */
export function mul(m0, m1, m2) {
	load(m0,
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
export function orthographic(m0, width, height, nearZ = -1, farZ = 1) {
	const range = nearZ / (farZ - nearZ);
	load(m0,
		2 / width, 0,          0,              0,
		0,         2 / height, 0,              0,
		0,         0,          range,          0,
		0,         0,          -range * nearZ, 1
	);
}

/* 透視変換行列を作成します。 */
export function perspective(m0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos(fovAngleY);
	const sinFov = Math.sin(fovAngleY);
	const range = 1 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	load(m0,
		width, 0,      0,                           0,
		0,     height, 0,                           0,
		0,     0,      range * (farZ + nearZ),      1,
		0,     0,      -2 * range * (farZ * nearZ), 0
	);
}

/* 回転行列を作成します。 */
export function rotation(m0, x, y, z) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	load(m0,
		(sinX * sinY * sinZ) + (cosY * cosZ), cosX * sinZ, (sinX * cosY * sinZ) - (sinY * cosZ), 0,
		(sinX * sinY * cosZ) - (cosY * sinZ), cosX * cosZ, (sinX * cosY * cosZ) + (sinY * sinZ), 0,
		cosX * sinY,                          -sinX,       cosX * cosY,                          0,
		0,                                    0,           0,                                    1
	);
}

export function rotationFromVector(m0, v1) {
	rotation(m0, v1[0], v1[1], v1[2]);
}

/* 回転行列 X を作成します。 */
export function rotationX(m0, x) {
	const cosX = Math.cos(x);
	const sinX = Math.sin(x);
	load(m0,
		1, 0,     0,    0,
		0, cosX,  sinX, 0,
		0, -sinX, cosX, 0,
		0, 0,     0,    1
	);
}

/* 回転行列 Y を作成します。 */
export function rotationY(m0, y) {
	const cosY = Math.cos(y);
	const sinY = Math.sin(y);
	load(m0,
		cosY, 0, -sinY, 0,
		0,    1, 0,     0,
		sinY, 0, cosY,  0,
		0,    0, 0,     1
	);
}

/* 回転行列 Z を作成します。 */
export function rotationZ(m0, z) {
	const cosZ = Math.cos(z);
	const sinZ = Math.sin(z);
	load(m0,
		cosZ,  sinZ, 0, 0,
		-sinZ, cosZ, 0, 0,
		0,     0,    1, 0,
		0,     0,    0, 1
	);
}

/* 拡大変換行列を作成します。 */
export function scaling(m0, x, y, z = 1) {
	load(m0,
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	);
}

export function scalingFromVector(m0, v1) {
	scaling(m0, v1[0], v1[1], v1[2]);
}

/* 平行移動行列を作成します。 */
export function translation(m0, x, y, z = 0) {
	load(m0,
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	);
}

export function translationFromVector(m0, v1) {
	translation(m0, v1[0], v1[1], v1[2]);
}

/* 転置行列を作成します。 */
export function transpose(m0, m1) {
	load(m0,
		m1[0], m1[4], m1[8],  m1[12],
		m1[1], m1[5], m1[9],  m1[13],
		m1[2], m1[6], m1[10], m1[14],
		m1[3], m1[7], m1[11], m1[15]
	);
}
