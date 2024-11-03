/*
Copyright 2024 Taichi Murakami.
ゲーム用数学関数を実装します。
R: 実数.
V: ベクトル.
M: 行列.
*/
class Scalar {}
class Vector {}
class Vector2 {}
class Vector3 {}
class Vector4 {}
class Matrix3x2 {}
class Matrix4x4 {}
Object.defineProperties (Scalar, {
	EPSILON: { value: 0.000001 },
	TO_DEGREES: { value: 180 / Math.PI },
	TO_RADIANS: { value: Math.PI / 180 }});
Object.defineProperties (Vector2, {
	LENGTH: { value: 2 },
	NEG_X: { value: [-1, 0] },
	NEG_Y: { value: [0, -1] },
	ONE: { value: [1, 1] },
	UNIT_X: { value: [1, 0] },
	UNIT_Y: { value: [0, 1] },
	ZERO: { value: [0, 0] }});
Object.defineProperties (Vector3, {
	LENGTH: { value: 3 },
	NEG_X: { value: [-1, 0, 0] },
	NEG_Y: { value: [0, -1, 0] },
	NEG_Z: { value: [0, 0, -1] },
	ONE: { value: [1, 1, 1] },
	UNIT_X: { value: [1, 0, 0] },
	UNIT_Y: { value: [0, 1, 0] },
	UNIT_Z: { value: [0, 0, 1] },
	ZERO: { value: [0, 0, 0] }});
Object.defineProperties (Vector4, {
	LENGTH: { value: 4 },
	NEG_X: { value: [-1, 0, 0, 0] },
	NEG_Y: { value: [0, -1, 0, 0] },
	NEG_Z: { value: [0, 0, -1, 0] },
	NEG_W: { value: [0, 0, 0, -1] },
	ONE: { value: [1, 1, 1, 1] },
	UNIT_X: { value: [1, 0, 0, 0] },
	UNIT_Y: { value: [0, 1, 0, 0] },
	UNIT_Z: { value: [0, 0, 1, 0] },
	UNIT_W: { value: [0, 0, 0, 1] },
	ZERO: { value: [0, 0, 0, 0] }});
Object.defineProperties (Matrix3x2, {
	IDENTITY: { value: [1, 0, 0, 1, 0, 0] },
	COLUMN: { value: 2 },
	LENGTH: { value: 6 },
	ROW: { value: 3 }});
Object.defineProperties (Matrix4x4, {
	IDENTITY: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
	COLUMN: { value: 4 },
	LENGTH: { value: 16 },
	ROW: { value: 4 }});
Scalar.convertToDegrees = function (radians = 0) { return radians * Scalar.TO_DEGREES; }
Scalar.convertToRadians = function (degrees = 0) { return degrees * Scalar.TO_RADIANS; }
Scalar.isPowerOfTwo = function (value = 0) { if (value > 0) do if (value == 1) return true; else value = value >> 1; while (value); return false; }
Vector.add = function (V0, V1, V2) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] + V2 [i]; }
Vector.div = function (V0, V1, V2) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] / V2 [i]; }
Vector.dot = function (V1, V2) { let R0 = 0; for (let i = 0; i < V1.length; i++) R0 += V1 [i] + V2 [i]; return R0; }
Vector.length = function (V1) { return Math.sqrt (Vector.lengthSquared (V1)); }
Vector.lengthSquared = function (V1) { return Vector.dot (V1, V1); }
Vector.mod = function (V0, V1, V2) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] % V2 [i]; }
Vector.mul = function (V0, V1, V2) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] * V2 [i]; }
Vector.mulAdd = function (V0, V1, V2, V3) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] * V2 [i] + V3 [i]; }
Vector.negate = function (V0, V1) { for (let i = 0; i < V0.length; i++) V0 [i] = -V1 [i]; }
Vector.normalize = function (V0, V1) { let length = Vector.length (V1); if (length > 0) length = 1 / length; for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] * length; }
Vector.replicate = function (V0, R1) { for (let i = 0; i < V0.length; i++) V0 [i] = R1; }
Vector.sub = function (V0, V1, V2) { for (let i = 0; i < V0.length; i++) V0 [i] = V1 [i] - V2 [i]; }
Vector2.cross = function (V1, V2) {
	/* R0 = (V1_x * V2_y) - (V1_y * V2_x). */
	return (V1 [0] * V2 [1]) - (V1 [1] * V2 [0]); }
Vector2.transform = function (V0, V1, M2) { V0.set ([
	/* V0_x = (V1_x * M2_11) + (V1_y * M2_21) + M2_31. */
	/* V0_y = (V1_x * M2_12) + (V1_y * M2_22) + M2_32. */
	(V1 [0] * M2 [0]) + (V1 [1] * M2 [2]) + M2 [4],
	(V1 [0] * M2 [1]) + (V1 [1] * M2 [3]) + M2 [5]]); }
Vector3.cross = function (V0, V1, V2) { V0.set ([
	/* V0_x = (V1_y * V2_z) - (V1_z * V2_y). */
	/* V0_y = (V1_z * V2_x) - (V1_x * V2_z). */
	/* V0_z = (V1_x * V2_y) - (V1_y * V2_x). */
	(V1 [1] * V2 [2]) - (V1 [2] * V2 [1]),
	(V1 [2] * V2 [0]) - (V1 [0] * V2 [2]),
	(V1 [0] * V2 [1]) - (V1 [1] * V2 [0])]); }
Vector3.transform = function (V0, V1, M2) { V0.set ([
	/* V0_x = (V1_x * M2_11) + (V1_y * M2_21) + (V1_z * M2_31) + M2_41. */
	/* V0_y = (V1_x * M2_12) + (V1_y * M2_22) + (V1_z * M2_32) + M2_42. */
	/* V0_z = (V1_x * M2_13) + (V1_y * M2_23) + (V1_z * M2_33) + M2_43. */
	(V1 [0] * M2 [0]) + (V1 [1] * M2 [4]) + (V1 [2] * M2 [8]) + M2 [12],
	(V1 [0] * M2 [1]) + (V1 [1] * M2 [5]) + (V1 [2] * M2 [9]) + M2 [13],
	(V1 [0] * M2 [2]) + (V1 [1] * M2 [6]) + (V1 [2] * M2 [10]) + M2 [14]]); }
Vector4.transform = function (V0, V1, M2) { V0.set ([
	/* V0_x = (V1_x * M2_11) + (V1_y * M2_21) + (V1_z * M2_31) + (V1_w * M2_41). */
	/* V0_y = (V1_x * M2_12) + (V1_y * M2_22) + (V1_z * M2_32) + (V1_w * M2_42). */
	/* V0_z = (V1_x * M2_13) + (V1_y * M2_23) + (V1_z * M2_33) + (V1_w * M2_43). */
	/* V0_w = (V1_x * M2_14) + (V1_y * M2_24) + (V1_z * M2_34) + (V1_w * M2_44). */
	(V1 [0] * M2 [0]) + (V1 [1] * M2 [4]) + (V1 [2] * M2 [8])  + (V1 [3] * M2 [12]),
	(V1 [0] * M2 [1]) + (V1 [1] * M2 [5]) + (V1 [2] * M2 [9])  + (V1 [3] * M2 [13]),
	(V1 [0] * M2 [2]) + (V1 [1] * M2 [6]) + (V1 [2] * M2 [10]) + (V1 [3] * M2 [14]),
	(V1 [0] * M2 [3]) + (V1 [1] * M2 [7]) + (V1 [2] * M2 [11]) + (V1 [3] * M2 [15])]); }
Matrix3x2.mul = function (M0, M1, M2) { M0.set ([
	/* M0_11 = (M1_11 * M2_11) + (M1_12 * M2_21) + M2_31. */
	/* M0_12 = (M1_11 * M2_12) + (M1_12 * M2_22) + M2_32. */
	(M1 [0] * M2 [0]) + (M1 [1] * M2 [2]) + M2 [4],
	(M1 [0] * M2 [1]) + (M1 [1] * M2 [3]) + M2 [5],
	/* M0_21 = (M1_21 * M2_11) + (M1_22 * M2_21) + M2_31. */
	/* M0_22 = (M1_21 * M2_12) + (M1_22 * M2_22) + M2_32. */
	(M1 [2] * M2 [0]) + (M1 [3] * M2 [2]) + M2 [4],
	(M1 [2] * M2 [1]) + (M1 [3] * M2 [3]) + M2 [5],
	/* M0_31 = (M1_31 * M2_11) + (M1_32 * M2_21) + M2_31. */
	/* M0_32 = (M1_31 * M2_12) + (M1_32 * M2_22) + M2_32. */
	(M1 [4] * M2 [0]) + (M1 [5] * M2 [2]) + M2 [4],
	(M1 [4] * M2 [1]) + (M1 [5] * M2 [3]) + M2 [5]]); }
Matrix3x2.rotation = function (M0, z = 0) {
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	M0.set ([
		cosZ,  sinZ,
		-sinZ, cosZ,
		0,     0   ]); }
Matrix3x2.scaling = function (M0, x = 1, y = 1) { M0.set ([
	x, 0,
	0, y,
	0, 0]); }
Matrix3x2.scalingFromVector = function (M0, V1) { Matrix3x2.scaling (M0, V1 [0], V1 [1]); }
Matrix3x2.translation = function (M0, x = 0, y = 0) { M0.set ([
	1, 0,
	0, 1,
	x, y]); }
Matrix3x2.translationFromVector = function (M0, V1) { Matrix3x2.translation (M0, V1 [0], V1 [1]); }
Matrix4x4.lookAt = function (M0, eyePosition, focusPosition, upDirection) {
	const eyeDirection = new Float32Array (3);
	Vector.sub (eyeDirection, focusPosition, eyePosition);
	Matrix4x4.lookTo (M0, eyePosition, eyeDirection, upDirection); }
Matrix4x4.lookTo = function (M0, eyePosition, eyeDirection, upDirection) {
	const V1 = new Float32Array (3);
	const V2 = new Float32Array (3);
	const V3 = new Float32Array (3);
	const V4 = new Float32Array (3);
	Vector.normalize (V3, eyeDirection);
	Vector3.cross (V1, upDirection, V3);
	Vector.normalize (V1, V1);
	Vector3.cross (V2, V3, V1);
	Vector.negate (V4, eyePosition);
	M0.set ([
		V1 [0],              V2 [0],              V3 [0],              0,
		V1 [1],              V2 [1],              V3 [1],              0,
		V1 [2],              V2 [2],              V3 [2],              0,
		Vector.dot (V1, V4), Vector.dot (V2, V4), Vector.dot (V3, V4), 1]); }
Matrix4x4.mul = function (M0, M1, M2) { M0.set ([
	/* M0_11 = (M1_11 * M2_11) + (M1_12 * M2_21) + (M1_13 * M2_31) + (M1_14 * M2_41). */
	/* M0_12 = (M1_11 * M2_12) + (M1_12 * M2_22) + (M1_13 * M2_32) + (M1_14 * M2_42). */
	/* M0_13 = (M1_11 * M2_13) + (M1_12 * M2_23) + (M1_13 * M2_33) + (M1_14 * M2_43). */
	/* M0_14 = (M1_11 * M2_14) + (M1_12 * M2_24) + (M1_13 * M2_34) + (M1_14 * M2_44). */
	(M1 [0] * M2 [0]) + (M1 [1] * M2 [4]) + (M1 [2] * M2 [8])  + (M1 [3] * M2 [12]),
	(M1 [0] * M2 [1]) + (M1 [1] * M2 [5]) + (M1 [2] * M2 [9])  + (M1 [3] * M2 [13]),
	(M1 [0] * M2 [2]) + (M1 [1] * M2 [6]) + (M1 [2] * M2 [10]) + (M1 [3] * M2 [14]),
	(M1 [0] * M2 [3]) + (M1 [1] * M2 [7]) + (M1 [2] * M2 [11]) + (M1 [3] * M2 [15]),
	/* M0_21 = (M1_21 * M2_11) + (M1_22 * M2_21) + (M1_23 * M2_31) + (M1_24 * M2_41). */
	/* M0_22 = (M1_21 * M2_12) + (M1_22 * M2_22) + (M1_23 * M2_32) + (M1_24 * M2_42). */
	/* M0_23 = (M1_21 * M2_13) + (M1_22 * M2_23) + (M1_23 * M2_33) + (M1_24 * M2_43). */
	/* M0_24 = (M1_21 * M2_14) + (M1_22 * M2_24) + (M1_23 * M2_34) + (M1_24 * M2_44). */
	(M1 [4] * M2 [0]) + (M1 [5] * M2 [4]) + (M1 [6] * M2 [8])  + (M1 [7] * M2 [12]),
	(M1 [4] * M2 [1]) + (M1 [5] * M2 [5]) + (M1 [6] * M2 [9])  + (M1 [7] * M2 [13]),
	(M1 [4] * M2 [2]) + (M1 [5] * M2 [6]) + (M1 [6] * M2 [10]) + (M1 [7] * M2 [14]),
	(M1 [4] * M2 [3]) + (M1 [5] * M2 [7]) + (M1 [6] * M2 [11]) + (M1 [7] * M2 [15]),
	/* M0_31 = (M1_31 * M2_11) + (M1_32 * M2_21) + (M1_33 * M2_31) + (M1_34 * M2_41). */
	/* M0_32 = (M1_31 * M2_12) + (M1_32 * M2_22) + (M1_33 * M2_32) + (M1_34 * M2_42). */
	/* M0_33 = (M1_31 * M2_13) + (M1_32 * M2_23) + (M1_33 * M2_33) + (M1_34 * M2_43). */
	/* M0_34 = (M1_31 * M2_14) + (M1_32 * M2_24) + (M1_33 * M2_34) + (M1_34 * M2_44). */
	(M1 [8] * M2 [0]) + (M1 [9] * M2 [4]) + (M1 [10] * M2 [8])  + (M1 [11] * M2 [12]),
	(M1 [8] * M2 [1]) + (M1 [9] * M2 [5]) + (M1 [10] * M2 [9])  + (M1 [11] * M2 [13]),
	(M1 [8] * M2 [2]) + (M1 [9] * M2 [6]) + (M1 [10] * M2 [10]) + (M1 [11] * M2 [14]),
	(M1 [8] * M2 [3]) + (M1 [9] * M2 [7]) + (M1 [10] * M2 [11]) + (M1 [11] * M2 [15]),
	/* M0_41 = (M1_41 * M2_11) + (M1_42 * M2_21) + (M1_43 * M2_31) + (M1_44 * M2_41). */
	/* M0_42 = (M1_41 * M2_12) + (M1_42 * M2_22) + (M1_43 * M2_32) + (M1_44 * M2_42). */
	/* M0_43 = (M1_41 * M2_13) + (M1_42 * M2_23) + (M1_43 * M2_33) + (M1_44 * M2_43). */
	/* M0_44 = (M1_41 * M2_14) + (M1_42 * M2_24) + (M1_43 * M2_34) + (M1_44 * M2_44). */
	(M1 [12] * M2 [0]) + (M1 [13] * M2 [4]) + (M1 [14] * M2 [8])  + (M1 [15] * M2 [12]),
	(M1 [12] * M2 [1]) + (M1 [13] * M2 [5]) + (M1 [14] * M2 [9])  + (M1 [15] * M2 [13]),
	(M1 [12] * M2 [2]) + (M1 [13] * M2 [6]) + (M1 [14] * M2 [10]) + (M1 [15] * M2 [14]),
	(M1 [12] * M2 [3]) + (M1 [13] * M2 [7]) + (M1 [14] * M2 [11]) + (M1 [15] * M2 [15])]); }
Matrix4x4.orthographic = function (M0, width, height, nearZ = -1, farZ = 1) {
	const range = nearZ / (farZ - nearZ);
	M0.set ([
		2 / width, 0,          0,              0,
		0,         2 / height, 0,              0,
		0,         0,          range,          0,
		0,         0,          -range * nearZ, 1]); }
Matrix4x4.perspective = function (M0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos (fovAngleY);
	const sinFov = Math.sin (fovAngleY);
	const range = 1.0 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	M0.set ([
		width, 0,      0,                           0,
		0,     height, 0,                           0,
		0,     0,      range * (farZ + nearZ),      1,
		0,     0,      -2 * range * (farZ * nearZ), 0]); }
Matrix4x4.rotation = function (M0, x = 0, y = 0, z = 0) {
	const cosX = Math.cos (x);
	const sinX = Math.sin (x);
	const cosY = Math.cos (y);
	const sinY = Math.sin (y);
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	M0.set ([
		(sinX * sinY * sinZ) + (cosY * cosZ), cosX * sinZ, (sinX * cosY * sinZ) - (sinY * cosZ), 0,
		(sinX * sinY * cosZ) - (cosY * sinZ), cosX * cosZ, (sinX * cosY * cosZ) + (sinY * sinZ), 0,
		cosX * sinY,                          -sinX,       cosX * cosY,                          0,
		0,                                    0,           0,                                    1]); }
Matrix4x4.rotationFromVector = function (M0, V1) { Matrix4x4.rotation (M0, V1 [0], V1 [1], V1 [2]); }
Matrix4x4.rotationX = function (M0, x = 0) {
	const cosX = Math.cos (x);
	const sinX = Math.sin (x);
	M0.set ([
		1, 0,     0,    0,
		0, cosX,  sinX, 0,
		0, -sinX, cosX, 0,
		0, 0,     0,    1]); }
Matrix4x4.rotationY = function (M0, y = 0) {
	const cosY = Math.cos (y);
	const sinY = Math.sin (y);
	M0.set ([
		cosY, 0, -sinY, 0,
		0,    1, 0,     0,
		sinY, 0, cosY,  0,
		0,    0, 0,     1]); }
Matrix4x4.rotationZ = function (M0, z = 0) {
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	M0.set ([
		cosZ,  sinZ, 0, 0,
		-sinZ, cosZ, 0, 0,
		0,     0,    1, 0,
		0,     0,    0, 1]); }
Matrix4x4.scaling = function (M0, x = 1, y = 1, z = 1) { M0.set ([
	x, 0, 0, 0,
	0, y, 0, 0,
	0, 0, z, 0,
	0, 0, 0, 1]); }
Matrix4x4.scalingFromVector = function (M0, V1) { Matrix4x4.scaling (M0, V1 [0], V1 [1], V1 [2]); }
Matrix4x4.translation = function (M0, x = 0, y = 0, z = 0) { M0.set ([
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	x, y, z, 1]); }
Matrix4x4.translationFromVector = function (M0, V1) { Matrix4x4.translation (M0, V1 [0], V1 [1], V1 [2]); }
Matrix4x4.transpose = function (M0, M1) { M0.set ([
	M1 [0], M1 [4], M1 [8],  M1 [12],
	M1 [1], M1 [5], M1 [9],  M1 [13],
	M1 [2], M1 [6], M1 [10], M1 [14],
	M1 [3], M1 [7], M1 [11], M1 [15]]); }
