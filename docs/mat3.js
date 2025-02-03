/*
Copyright 2025 Taichi Murakami.
GLSL における mat3 を表します。
*/

const COUNT = 9;
const M11 = 0, M12 = 1, M13 = 2;
const M21 = 3, M22 = 4, M23 = 5;
const M31 = 6, M32 = 7, M33 = 8;

/* 新しい行列を返します。 */
function create() {
	return new Float32Array(COUNT);
}

/* 指定した行列に単位行列を設定します。 */
function identity(m0) {
	load(m0,
		1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 1.0
	);
}

/* 指定した行列に値を設定します。 */
function load(m0, r11, r12, r13, r21, r22, r23, r31, r32, r33) {
	m0[M11]  = r11; m0[M12]  = r12; m0[M13] = r13;
	m0[M21]  = r21; m0[M22]  = r22; m0[M23] = r23;
	m0[M31]  = r31; m0[M32]  = r32; m0[M33] = r33;
}

/* 行列の積。 */
function mul(m0, m1, m2) {
	load(m0,
		(m1[M11] * m2[M11]) + (m1[M12] * m2[M21]) + (m1[M13] * m2[M31]),
		(m1[M11] * m2[M12]) + (m1[M12] * m2[M22]) + (m1[M13] * m2[M32]),
		(m1[M11] * m2[M13]) + (m1[M12] * m2[M23]) + (m1[M13] * m2[M33]),
		(m1[M21] * m2[M11]) + (m1[M22] * m2[M21]) + (m1[M23] * m2[M31]),
		(m1[M21] * m2[M12]) + (m1[M22] * m2[M22]) + (m1[M23] * m2[M32]),
		(m1[M21] * m2[M13]) + (m1[M22] * m2[M23]) + (m1[M23] * m2[M33]),
		(m1[M31] * m2[M11]) + (m1[M32] * m2[M21]) + (m1[M33] * m2[M31]),
		(m1[M31] * m2[M12]) + (m1[M32] * m2[M22]) + (m1[M33] * m2[M32]),
		(m1[M31] * m2[M13]) + (m1[M32] * m2[M23]) + (m1[M33] * m2[M33]),
	);
}

/* 転置行列を作成します。 */
function transpose(m0, m1) {
	load(m0,
		m1[M11], m1[M21], m1[M31],
		m1[M12], m1[M22], m1[M32],
		m1[M13], m1[M23], m1[M33]
	);
}

export {
	COUNT,
	M11, M12, M13,
	M21, M22, M23,
	M31, M32, M33,
	create,
	identity,
	load,
	mul,
	transpose
};
