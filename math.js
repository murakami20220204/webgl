/*
Copyright 2024 Taichi Murakami.
ゲーム用数学関数を実装します。
Vector クラスは要素数 4 の実数配列を操作する方法を提供します。
Matrix クラスは要素数 16 の実数配列を操作する方法を提供します。
各クラスの Create 関数を呼び出して新しい実数配列を作成できます。
Scalar クラス、Vector 2 クラス、Vector 3 クラス、および Vector 4 クラスはそれぞれ実数、二次元ベクトル、三次元ベクトル、および四次元ベクトルに特有の操作を提供します。
*/

var Scalar = {
	EPSILON: 0.000001,
	TO_DEGREES: 180.0 / Math.PI,
	TO_RADIANS: Math.PI / 180.0,
	convertToDegrees: function (radians) {
		return (radians * this.TO_DEGREES);
	},
	convertToRadians: function (degrees) {
		return (degrees * this.TO_RADIANS);
	}
};

var Vector = {
	add: function (r0, r1, r2) {
		this.set (r0,
			r1 [0] + r2 [0],
			r1 [1] + r2 [1],
			r1 [2] + r2 [2],
			r1 [3] + r2 [3]);
	},
	create: function () {
		return (new Float32Array (4));
	},
	divide: function (r0, r1, r2) {
		this.set (r0,
			r1 [0] / r2 [0],
			r1 [1] / r2 [1],
			r1 [2] / r2 [2],
			r1 [3] / r2 [3]);
	},
	multiply: function (r0, r1, r2) {
		this.set (r0,
			r1 [0] * r2 [0],
			r1 [1] * r2 [1],
			r1 [2] * r2 [2],
			r1 [3] * r2 [3]);
	},
	multiplyAdd: function (r0, r1, r2, r3) {
		this.set (r0,
			r1 [0] * r2 [0] + r3 [0],
			r1 [1] * r2 [1] + r3 [1],
			r1 [2] * r2 [2] + r3 [2],
			r1 [3] * r2 [3] + r3 [3]);
	},
	negate: function (r0, r1) {
		this.set (r0, -r1 [0], -r1 [1], -r1 [2], -r1 [3]);
	},
	one: function (r0) {
		this.replicate(r0, 1.0);
	},
	replicate: function (r0, v) {
		this.set (r0, v, v, v, v);
	},
	set: function (r0, x, y, z, w) {
		r0 [0] = x;
		r0 [1] = y;
		r0 [2] = z;
		r0 [3] = w;
	},
	subtract: function (r0, r1, r2) {
		this.set (r0,
			r1 [0] - r2 [0],
			r1 [1] - r2 [1],
			r1 [2] - r2 [2],
			r1 [3] - r2 [3]);
	},
	unitW: function (r0) {
		this.set (r0, 0.0, 0.0, 0.0, 1.0);
	},
	unitX: function (r0) {
		this.set (r0, 1.0, 0.0, 0.0, 0.0);
	},
	unitY: function (r0) {
		this.set (r0, 0.0, 1.0, 0.0, 0.0);
	},
	unitZ: function (r0) {
		this.set (r0, 0.0, 0.0, 1.0, 0.0);
	},
	zero: function (r0) {
		this.replicate(r0, 0.0);
	}
};

var Vector2 = {
	cross: function (r1, r2) {
		return (
			(r1 [0] * r2 [1]) -
			(r1 [1] * r2 [0]));
	},
	dot: function (r1, r2) {
		return (
			(r1 [0] * r2 [0]) +
			(r1 [1] * r2 [1]));
	},
	length : function (r1) {
		const length = this.lengthSquared (r1);
		return (Math.sqrt (length));
	},
	lengthSquared: function (r1) {
		return (this.dot (r1, r1));
	},
	normalize: function (r0, r1) {
		let length = this.length (r1);
		if (length > 0) length = 1.0 / length;
		Vector.set (r0,
			r1 [0] * length,
			r1 [1] * length,
			0.0,
			0.0);
	},
	transform: function (r0, v1, m2) {
		const r1 = Vector.create ();
		const r2 = Vector.create ();
		const r3 = Vector.create ();
		Vector.set (r0, m2 [12], m2 [13], m2 [14], m2 [15]);
		Vector.set (r1, m2 [4], m2 [5], m2 [6], m2 [7]);
		Vector.replicate (r2, v1 [1]);
		Vector.multiplyAdd (r3, r2, r1, r0);
		Vector.set (r2, m2 [0], m2 [1], m2 [2], m2 [3]);
		Vector.replicate (r1, v1 [0]);
		Vector.multiplyAdd (r0, r1, r2, r3);
	}
};

var Vector3 = {
	cross: function (r0, r1, r2) {
		Vector.set (r0,
			(r1 [1] * r2 [2]) - (r1 [2] * r2 [1]),
			(r1 [2] * r2 [0]) - (r1 [0] * r2 [2]),
			(r1 [0] * r2 [1]) - (r1 [1] * r2 [0]),
			0.0);
	},
	dot: function (r1, r2) {
		return (
			(r1 [0] * r2 [0]) +
			(r1 [1] * r2 [1]) +
			(r1 [2] * r2 [2]));
	},
	length : function (r1) {
		const length = this.lengthSquared (r1);
		return (Math.sqrt (length));
	},
	lengthSquared: function (r1) {
		return (this.dot (r1, r1));
	},
	normalize: function (r0, r1) {
		let length = this.length (r1);
		if (length > 0) length = 1.0 / length;
		Vector.set (r0,
			r1 [0] * length,
			r1 [1] * length,
			r1 [2] * length,
			0.0);
	},
	transform: function (r0, v, m) {
		const r1 = Vector.create ();
		const r2 = Vector.create ();
		const r3 = Vector.create ();
		Vector.set (r3, m [12], m [13], m [14], m [15]);
		Vector.set (r2, m [8], m [9], m [10], m [11]);
		Vector.replicate (r1, v [2]);
		Vector.multiplyAdd (r0, r1, r2, r3);
		Vector.set (r2, m [4], m [5], m [6], m [7]);
		Vector.replicate (r1, v [1]);
		Vector.multiplyAdd (r3, r2, r1, r0);
		Vector.set (r2, m [0], m [1], m [2], m [3]);
		Vector.replicate (r1, v [0]);
		Vector.multiplyAdd (r0, r1, r2, r3);
	}
};

var Vector4 = {
	dot: function (r1, r2) {
		return (
			(r1 [0] * r2 [0]) +
			(r1 [1] * r2 [1]) +
			(r1 [2] * r2 [2]) +
			(r1 [3] * r2 [3]));
	},
	length : function (r1) {
		const length = this.lengthSquared (r1);
		return (Math.sqrt (length));
	},
	lengthSquared: function (r1) {
		return (this.dot (r1, r1));
	},
	normalize: function (r0, r1) {
		let length = this.length (r1);
		if (length > 0) length = 1.0 / length;
		Vector.set (r0,
			r1 [0] * length,
			r1 [1] * length,
			r1 [2] * length,
			r1 [3] * length);
	}
};

var Matrix = {
	create: function () {
		return (new Float32Array (16));
	},
	createIdentity: function () {
		const self = this.create ();
		this.identity (self);
		return (self);
	},
	identity: function (m0) {
		this.set (m0,
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0);
	},
	inverse: function (m0, m1) {
	},
	lookAt: function (m0, eyePosition, focusPosition, upDirection) {
		const eyeDirection = Vector.create ();
		Vector.subtract (eyeDirection, focusPosition, eyePosition);
		this.lookTo (m0, eyePosition, eyeDirection, upDirection);
	},
	lookTo: function (m0, eyePosition, eyeDirection, upDirection) {
		const r0 = Vector.create ();
		const r1 = Vector.create ();
		const r2 = Vector.create ();
		const negEyePosition = Vector.create ();
		Vector3.normalize (r2, eyeDirection);
		Vector3.cross (r0, upDirection, r2);
		Vector3.normalize (r0, r0);
		Vector3.cross (r1, r2, r0);
		Vector.negate (negEyePosition, eyePosition);
		const z0 = Vector3.dot (r0, negEyePosition);
		const z1 = Vector3.dot (r1, negEyePosition);
		const z2 = Vector3.dot (r2, negEyePosition);
		this.set (m0,
			r0 [0], r1 [0], r2 [0], 0.0,
			r0 [1], r1 [1], r2 [1], 0.0,
			r0 [2], r1 [2], r2 [2], 0.0,
			z0    , z1    , z2    , 1.0);
	},
	multiply: function (m0, m1, m2) {
		let x = m1 [0];
		let y = m1 [1];
		let z = m1 [2];
		let w = m1 [3];
		m0 [0] = (m2 [0] * x) + (m2 [4] * y) + (m2 [ 8] * z) + (m2 [12] * w);
		m0 [1] = (m2 [1] * x) + (m2 [5] * y) + (m2 [ 9] * z) + (m2 [13] * w);
		m0 [2] = (m2 [2] * x) + (m2 [6] * y) + (m2 [10] * z) + (m2 [14] * w);
		m0 [3] = (m2 [3] * x) + (m2 [7] * y) + (m2 [11] * z) + (m2 [15] * w);
		x = m1 [4];
		y = m1 [5];
		z = m1 [6];
		w = m1 [7];
		m0 [4] = (m2 [0] * x) + (m2 [4] * y) + (m2 [ 8] * z) + (m2 [12] * w);
		m0 [5] = (m2 [1] * x) + (m2 [5] * y) + (m2 [ 9] * z) + (m2 [13] * w);
		m0 [6] = (m2 [2] * x) + (m2 [6] * y) + (m2 [10] * z) + (m2 [14] * w);
		m0 [7] = (m2 [3] * x) + (m2 [7] * y) + (m2 [11] * z) + (m2 [15] * w);
		x = m1 [ 8];
		y = m1 [ 9];
		z = m1 [10];
		w = m1 [11];
		m0 [ 8] = (m2 [0] * x) + (m2 [4] * y) + (m2 [ 8] * z) + (m2 [12] * w);
		m0 [ 9] = (m2 [1] * x) + (m2 [5] * y) + (m2 [ 9] * z) + (m2 [13] * w);
		m0 [10] = (m2 [2] * x) + (m2 [6] * y) + (m2 [10] * z) + (m2 [14] * w);
		m0 [11] = (m2 [3] * x) + (m2 [7] * y) + (m2 [11] * z) + (m2 [15] * w);
		x = m1 [12];
		y = m1 [13];
		z = m1 [14];
		w = m1 [15];
		m0 [12] = (m2 [0] * x) + (m2 [4] * y) + (m2 [ 8] * z) + (m2 [12] * w);
		m0 [13] = (m2 [1] * x) + (m2 [5] * y) + (m2 [ 9] * z) + (m2 [13] * w);
		m0 [14] = (m2 [2] * x) + (m2 [6] * y) + (m2 [10] * z) + (m2 [14] * w);
		m0 [15] = (m2 [3] * x) + (m2 [7] * y) + (m2 [11] * z) + (m2 [15] * w);
	},
	orthographic: function (m0, width, height, nearZ, farZ) {
		const range = nearZ / (farZ - nearZ);
		this.set (m0,
			2.0 / width,
			0.0, 0.0, 0.0, 0.0,
			2.0 / height,
			0.0, 0.0, 0.0, 0.0,
			range,
			0.0, 0.0, 0.0,
			-range * nearZ,
			1.0);
	},
	perspective: function (m0, fovAngleY, aspectRatio, nearZ, farZ) {
		const cosFov = Math.cos (fovAngleY);
		const sinFov = Math.sin (fovAngleY);
		const range = 1.0 / (farZ - nearZ);
		const height = cosFov / sinFov;
		const width = height / aspectRatio;
		this.set (m0,
			width,
			0.0, 0.0, 0.0, 0.0,
			height,
			0.0, 0.0, 0.0, 0.0,
			range * (farZ + nearZ),
			1.0, 0.0, 0.0,
			-range * 2.0 * (farZ * nearZ),
			0.0);
	},
	rotation: function (m0, x, y, z) {
		const cosX = Math.cos (x);
		const sinX = Math.sin (x);
		const cosY = Math.cos (y);
		const sinY = Math.sin (y);
		const cosZ = Math.cos (z);
		const sinZ = Math.sin (z);
		this.set (m0,
			(sinX * sinY * sinZ) + (cosY * cosZ),
			cosX * sinZ,
			(sinX * cosY * sinZ) - (sinY * cosZ),
			0.0,
			(sinX * sinY * cosZ) - (cosY * sinZ),
			cosX * cosZ,
			(sinX * cosY * cosZ) + (sinY * sinZ),
			0.0,
			cosX * sinY,
			-sinX,
			cosX * cosY,
			0.0,
			0.0, 0.0, 0.0, 1.0);
	},
	rotationFromVector: function (m0, v) {
		this.rotation (m0, v [0], v [1], v [2]);
	},
	rotationX: function (m0, x) {
		const cosX = Math.cos (x);
		const sinX = Math.sin (x);
		this.set (m0,
			1.0,   0.0,  0.0, 0.0,
			0.0,  cosX, sinX, 0.0,
			0.0, -sinX, cosX, 0.0,
			0.0,   0.0,  0.0, 1.0);
	},
	rotationY: function (m0, y) {
		const cosY = Math.cos (y);
		const sinY = Math.sin (y);
		this.set (m0,
			cosY, 0.0, -sinY, 0.0,
			 0.0, 1.0,   0.0, 0.0,
			sinY, 0.0,  cosY, 0.0,
			 0.0, 0.0,   0.0, 1.0);
	},
	rotationZ: function (m0, z) {
		const cosZ = Math.cos (z);
		const sinZ = Math.sin (z);
		this.set (m0,
			 cosZ, sinZ, 0.0, 0.0,
			-sinZ, cosZ, 0.0, 0.0,
			  0.0,  0.0, 1.0, 0.0,
			  0.0,  0.0, 0.0, 1.0);
	},
	scaling: function (m0, x, y, z) {
		this.set (m0,
			  x, 0.0, 0.0, 0.0,
			0.0,   y, 0.0, 0.0,
			0.0, 0.0,   z, 0.0,
			0.0, 0.0, 0.0, 1.0);
	},
	scalingFromVector: function (m0, v) {
		this.scaling (m0, v [0], v [1], v [2]);
	},
	set: function (m0, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
		m0 [ 0] = m11; m0 [ 1] = m12; m0 [ 2] = m13; m0 [ 3] = m14;
		m0 [ 4] = m21; m0 [ 5] = m22; m0 [ 6] = m23; m0 [ 7] = m24;
		m0 [ 8] = m31; m0 [ 9] = m32; m0 [10] = m33; m0 [11] = m34;
		m0 [12] = m41; m0 [13] = m42; m0 [14] = m43; m0 [15] = m44;
	},
	translation: function (m0, x, y, z) {
		this.set (m0,
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			  x,   y,   z, 1.0);
	},
	translationFromVector: function (m0, v) {
		this.translation (m0, v [0], v [1], v [2]);
	},
	transpose: function (m0, m1) {
		this.set (m0,
			m1 [0], m1 [4], m1 [ 8], m1 [12],
			m1 [1], m1 [5], m1 [ 9], m1 [13],
			m1 [2], m1 [6], m1 [10], m1 [14],
			m1 [3], m1 [7], m1 [11], m1 [15]);
	},
};
