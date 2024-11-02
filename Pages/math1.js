/*
Copyright 2024 Taichi Murakami.
ゲーム用数学関数を実装します。
*/
class Scalar {
	constructor () { throw new Error (); }
}
class Point2 extends Int32Array {
	constructor () { super (Point2.LENGTH); }
	add    (p2)     {        Point2.add    (this, this, p2);     }
	cross  (p2)     { return Point2.cross  (this, p2);           }
	div    (p2)     {        Point2.div    (this, this, p2);     }
	dot    (p2)     { return Point2.dot    (this, p2);           }
	len    ()       { return Point2.len    (this);               }
	lensq  ()       { return Point2.lensq  (this);               }
	mul    (p2)     {        Point2.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point2.muladd (this, this, p2, p3); }
	neg    ()       {        Point2.neg    (this);               }
	norm   ()       {        Point2.norm   (this);               }
	rep    (c)      {        Point2.rep    (this, c);            }
	sub    (p2)     {        Point2.sub    (this, this, p2);     }
	trans  (m)      {        Point2.trans  (this, this, m);      }
}
class Point2F extends Float32Array {
	constructor () { super (Point2.LENGTH); }
	add    (p2)     {        Point2.add    (this, this, p2);     }
	cross  (p2)     { return Point2.cross  (this, p2);           }
	div    (p2)     {        Point2.div    (this, this, p2);     }
	dot    (p2)     { return Point2.dot    (this, p2);           }
	len    ()       { return Point2.len    (this);               }
	lensq  ()       { return Point2.lensq  (this);               }
	mul    (p2)     {        Point2.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point2.muladd (this, this, p2, p3); }
	neg    ()       {        Point2.neg    (this);               }
	norm   ()       {        Point2.norm   (this);               }
	rep    (c)      {        Point2.rep    (this, c);            }
	sub    (p2)     {        Point2.sub    (this, this, p2);     }
	trans  (m)      {        Point2.trans  (this, this, m);      }
}
class Point2U extends Uint32Array {
	constructor () { super (Point2.LENGTH); }
	add    (p2)     {        Point2.add    (this, this, p2);     }
	cross  (p2)     { return Point2.cross  (this, p2);           }
	div    (p2)     {        Point2.div    (this, this, p2);     }
	dot    (p2)     { return Point2.dot    (this, p2);           }
	len    ()       { return Point2.len    (this);               }
	lensq  ()       { return Point2.lensq  (this);               }
	mul    (p2)     {        Point2.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point2.muladd (this, this, p2, p3); }
	neg    ()       {        Point2.neg    (this);               }
	norm   ()       {        Point2.norm   (this);               }
	rep    (c)      {        Point2.rep    (this, c);            }
	sub    (p2)     {        Point2.sub    (this, this, p2);     }
	trans  (m)      {        Point2.trans  (this, this, m);      }
}
class Point3 extends Int32Array {
	constructor () { super (Point3.LENGTH); }
	add    (p2)     {        Point3.add    (this, this, p2);     }
	cross  (p2)     {        Point3.cross  (this, this, p2);     }
	div    (p2)     {        Point3.div    (this, this, p2);     }
	dot    (p2)     { return Point3.dot    (this, p2);           }
	len    ()       { return Point3.len    (this);               }
	lensq  ()       { return Point3.lensq  (this);               }
	mul    (p2)     {        Point3.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point3.muladd (this, this, p2, p3); }
	neg    ()       {        Point3.neg    (this);               }
	norm   ()       {        Point3.norm   (this);               }
	rep    (c)      {        Point3.rep    (this, c);            }
	sub    (p2)     {        Point3.sub    (this, this, p2);     }
	trans  (m)      {        Point3.trans  (this, this, m);      }
}
class Point3F extends Float32Array {
	constructor () { super (Point3.LENGTH); }
	add    (p2)     {        Point3.add    (this, this, p2);     }
	cross  (p2)     {        Point3.cross  (this, this, p2);     }
	div    (p2)     {        Point3.div    (this, this, p2);     }
	dot    (p2)     { return Point3.dot    (this, p2);           }
	len    ()       { return Point3.len    (this);               }
	lensq  ()       { return Point3.lensq  (this);               }
	mul    (p2)     {        Point3.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point3.muladd (this, this, p2, p3); }
	neg    ()       {        Point3.neg    (this);               }
	norm   ()       {        Point3.norm   (this);               }
	rep    (c)      {        Point3.rep    (this, c);            }
	sub    (p2)     {        Point3.sub    (this, this, p2);     }
	trans  (m)      {        Point3.trans  (this, this, m);      }
}
class Point4 extends Int32Array {
	constructor () { super (Point4.LENGTH); }
	add    (p2)     {        Point4.add    (this, this, p2);     }
	div    (p2)     {        Point4.div    (this, this, p2);     }
	dot    (p2)     { return Point4.dot    (this, p2);           }
	len    ()       { return Point4.len    (this);               }
	lensq  ()       { return Point4.lensq  (this);               }
	mul    (p2)     {        Point4.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point4.muladd (this, this, p2, p3); }
	neg    ()       {        Point4.neg    (this);               }
	norm   ()       {        Point4.norm   (this);               }
	rep    (c)      {        Point4.rep    (this, c);            }
	sub    (p2)     {        Point4.sub    (this, this, p2);     }
	trans  (m)      {        Point4.trans  (this, this, m);      }
}
class Point4F extends Float32Array {
	constructor () { super (Point4.LENGTH); }
	add    (p2)     {        Point4.add    (this, this, p2);     }
	div    (p2)     {        Point4.div    (this, this, p2);     }
	dot    (p2)     { return Point4.dot    (this, p2);           }
	len    ()       { return Point4.len    (this);               }
	lensq  ()       { return Point4.lensq  (this);               }
	mul    (p2)     {        Point4.mul    (this, this, p2);     }
	muladd (p2, p3) {        Point4.muladd (this, this, p2, p3); }
	neg    ()       {        Point4.neg    (this);               }
	norm   ()       {        Point4.norm   (this);               }
	rep    (c)      {        Point4.rep    (this, c);            }
	sub    (p2)     {        Point4.sub    (this, this, p2);     }
	trans  (m)      {        Point4.trans  (this, this, m);      }
}
class Color extends Uint8Array {
	constructor () { super (Color.LENGTH); }
}
class ColorF extends Float32Array {
	constructor () { super (Color.LENGTH); }
}
class Matrix3x2 extends Int32Array {
	constructor () { super (Matrix3x2.LENGTH); }
}
class Matrix3x2F extends Float32Array {
	constructor () { super (Matrix3x2.LENGTH); }
}
class Matrix4x4 extends Int32Array {
	constructor () { super (Matrix4x4.LENGTH); }
}
class Matrix4x4F extends Float32Array {
	constructor () { super (Matrix4x4.LENGTH); }
	mul          (m2)                         { Matrix4x4.mul          (this, this, m2);                   }
	orthographic (width = 1, height = 1, nearZ = -1, farZ = 1) { Matrix4x4.orthographic (this, width, height, nearZ, farZ); }
	scaling      (x, y, z)                    { Matrix4x4.scaling      (this, x, y, z);                    }
	translation  (x, y, z)                    { Matrix4x4.translation  (this, x, y, z);                    }
}
Object.defineProperties (Scalar, {
	EPSILON: { value: 0.000001 },
	TO_DEGREES: { value: 180 / Math.PI },
	TO_RADIANS: { value: Math.PI / 180 }
});
Object.defineProperties (Point2, {
	LENGTH: { value: 2 },
	NEG_X: { value: [-1, 0] },
	NEG_Y: { value: [0, -1] },
	ONE: { value: [1, 1] },
	UNIT_X: { value: [1, 0] },
	UNIT_Y: { value: [0, 1] },
	ZERO: { value: [0, 0] }
});
Object.defineProperties (Point3, {
	LENGTH: { value: 3 },
	NEG_X: { value: [-1, 0, 0] },
	NEG_Y: { value: [0, -1, 0] },
	NEG_Z: { value: [0, 0, -1] },
	ONE: { value: [1, 1, 1] },
	UNIT_X: { value: [1, 0, 0] },
	UNIT_Y: { value: [0, 1, 0] },
	UNIT_Z: { value: [0, 0, 1] },
	ZERO: { value: [0, 0, 0] }
});
Object.defineProperties (Point4, {
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
	ZERO: { value: [0, 0, 0, 0] }
});
Object.defineProperties (Color, {
	LENGTH: { value: 4 }
});
Object.defineProperties (Matrix3x2, {
	IDENTITY: { value: [1, 0, 0, 1, 0, 0] },
	COLUMN: { value: 2 },
	LENGTH: { value: 6 },
	ROW: { value: 3 }
});
Object.defineProperties (Matrix4x4, {
	IDENTITY: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
	COLUMN: { value: 4 },
	LENGTH: { value: 16 },
	ROW: { value: 4 }
});
Object.defineProperties (Point2F.prototype, {
	x: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	y: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }}
});
Object.defineProperties (Point3F.prototype, {
	x: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	y: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	z: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }}
});
Object.defineProperties (Point4F.prototype, {
	x: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	y: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	z: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }},
	w: { get: function () { return this [3]; }, set: function (value) { this [3] = value; }}
});
Object.defineProperties (Color.prototype, {
	r: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	g: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	b: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }},
	a: { get: function () { return this [3]; }, set: function (value) { this [3] = value; }}
});
Object.defineProperties (ColorF.prototype, {
	r: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	g: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	b: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }},
	a: { get: function () { return this [3]; }, set: function (value) { this [3] = value; }}
});
Object.defineProperties (Matrix3x2F.prototype, {
	_11: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	_12: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	_21: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }},
	_22: { get: function () { return this [3]; }, set: function (value) { this [3] = value; }},
	_31: { get: function () { return this [4]; }, set: function (value) { this [4] = value; }},
	_32: { get: function () { return this [5]; }, set: function (value) { this [5] = value; }}
});
Object.defineProperties (Matrix4x4F.prototype, {
	_11: { get: function () { return this [0]; }, set: function (value) { this [0] = value; }},
	_12: { get: function () { return this [1]; }, set: function (value) { this [1] = value; }},
	_13: { get: function () { return this [2]; }, set: function (value) { this [2] = value; }},
	_14: { get: function () { return this [3]; }, set: function (value) { this [3] = value; }},
	_21: { get: function () { return this [4]; }, set: function (value) { this [4] = value; }},
	_22: { get: function () { return this [5]; }, set: function (value) { this [5] = value; }},
	_23: { get: function () { return this [6]; }, set: function (value) { this [6] = value; }},
	_24: { get: function () { return this [7]; }, set: function (value) { this [7] = value; }},
	_31: { get: function () { return this [8]; }, set: function (value) { this [8] = value; }},
	_32: { get: function () { return this [9]; }, set: function (value) { this [9] = value; }},
	_33: { get: function () { return this [10]; }, set: function (value) { this [10] = value; }},
	_34: { get: function () { return this [11]; }, set: function (value) { this [11] = value; }},
	_41: { get: function () { return this [12]; }, set: function (value) { this [12] = value; }},
	_42: { get: function () { return this [13]; }, set: function (value) { this [13] = value; }},
	_43: { get: function () { return this [14]; }, set: function (value) { this [14] = value; }},
	_44: { get: function () { return this [15]; }, set: function (value) { this [15] = value; }},
});
/* Add */
Point2.add = function (p0, p1, p2) {
	p0.set ([
		p1.x + p2.x,
		p1.y + p2.y]);
}
Point3.add = function (p0, p1, p2) {
	p0.set ([
		p1.x + p2.x,
		p1.y + p2.y,
		p1.z + p2.z]);
}
Point4.add = function (p0, p1, p2) {
	p0.set ([
		p1.x + p2.x,
		p1.y + p2.y,
		p1.z + p2.z,
		p1.w + p2.w]);
}
/* Convert */
Scalar.convertToDegrees = function (radians) {
	return radians * Scalar.TO_DEGREES;
}
Scalar.convertToRadians = function (degrees) {
	return degrees * Scalar.TO_RADIANS;
}
/* Create */
Point2.create = function (args) {
	const p0 = new Point2 ();
	p0.set (args);
	return p0;
}
Point2F.create = function (args) {
	const p0 = new Point2F ();
	p0.set (args);
	return p0;
}
Point2U.create = function (args) {
	const p0 = new Point2U ();
	p0.set (args);
	return p0;
}
Point3.create = function (args) {
	const p0 = new Point3 ();
	p0.set (args);
	return p0;
}
Point3F.create = function (args) {
	const p0 = new Point3F ();
	p0.set (args);
	return p0;
}
Point4.create = function (args) {
	const p0 = new Point4 ();
	p0.set (args);
	return p0;
}
Point4F.create = function (args) {
	const p0 = new Point4F ();
	p0.set (args);
	return p0;
}
Color.create = function (args) {
	const value = new Color ();
	value.set (args);
	return value;
}
ColorF.create = function (args) {
	const value = new ColorF ();
	value.set (args);
	return value;
}
Matrix3x2F.create = function (args) {
	const m0 = new Matrix3x2F ();
	m0.set (args);
	return m0;
}
Matrix4x4F.create = function (args) {
	const m0 = new Matrix4x4F ();
	m0.set (args);
	return m0;
}
/* Cross Product */
Point2.cross = function (p1, p2) {
	return (
		(p1.x * p2.y) -
		(p1.y * p2.x));
}
Point3.cross = function (p0, p1, p2) {
	p0.set ([
		(p1.y * p2.z) - (p1.z * p2.y),
		(p1.z * p2.x) - (p1.x * p2.z),
		(p1.x * p2.y) - (p1.y * p2.x)]);
}
/* Divide */
Point2.div = function (p0, p1, p2) {
	p0.set ([
		p1.x / p2.x,
		p1.y / p2.y]);
}
Point3.div = function (p0, p1, p2) {
	p0.set ([
		p1.x / p2.x,
		p1.y / p2.y,
		p1.z / p2.z]);
}
Point4.div = function (p0, p1, p2) {
	p0.set ([
		p1.x / p2.x,
		p1.y / p2.y,
		p1.z / p2.z,
		p1.w / p2.w]);
}
/* Dot Product */
Point2.dot = function (p1, p2) {
	return (
		(p1.x * p2.x) +
		(p1.y * p2.y));
}
Point3.dot = function (p1, p2) {
	return (
		(p1.x * p2.x) +
		(p1.y * p2.y) +
		(p1.z * p2.z));
}
Point4.dot = function (p1, p2) {
	return (
		(p1.x * p2.x) +
		(p1.y * p2.y) +
		(p1.z * p2.z) +
		(p1.w * p2.w));
}
/* Is */
Scalar.isPowerOfTwo = function (value) {
	if (value > 0) do {
		if (value == 1) return true;
		else value = value >> 1;
	} while (value);
	return false;
}
/* Length */
Point2.len = function (p1) {
	return Math.sqrt (Point2.lensq (p1));
}
Point3.len = function (p1) {
	return Math.sqrt (Point3.lensq (p1));
}
Point4.len = function (p1) {
	return Math.sqrt (Point4.lensq (p1));
}
/* Length Squared */
Point2.lensq = function (p1) {
	return Point2.dot (p1, p1);
}
Point3.lensq = function (p1) {
	return Point3.dot (p1, p1);
}
Point4.lensq = function (p1) {
	return Point4.dot (p1, p1);
}
/* Look */
Matrix4x4.lookAt = function (m0, eyePosition, focusPosition, upDirection) {
	const eyeDirection = new Point3F ();
	Point3.sub (eyeDirection, focusPosition, eyePosition);
	Matrix4x4.lookTo (m0, eyePosition, eyeDirection, upDirection);
}
Matrix4x4.lookTo = function (m0, eyePosition, eyeDirection, upDirection) {
	const p1 = new Point3F ();
	const p2 = new Point3F ();
	const p3 = new Point3F ();
	const p4 = new Point3F ();
	Point3.norm (p3, eyeDirection);
	Point3.cross (p1, upDirection, p3);
	Point3.norm (p1, p1);
	Point3.cross (p2, p3, p1);
	Point3.neg (p4, eyePosition);
	m0.set ([
		p1 [0],      p2 [0],      p3 [0],      0,
		p1 [1],      p2 [1],      p3 [1],      0,
		p1 [2],      p2 [2],      p3 [2],      0,
		p1.dot (p4), p2.dot (p4), p3.dot (p4), 1]);
}
/* Multiply */
Point2.mul = function (p0, p1, p2) {
	p0.set ([
		p1.x * p2.x,
		p1.y * p2.y]);
}
Point3.mul = function (p0, p1, p2) {
	p0.set ([
		p1.x * p2.x,
		p1.y * p2.y,
		p1.z * p2.z]);
}
Point4.mul = function (p0, p1, p2) {
	p0.set ([
		p1.x * p2.x,
		p1.y * p2.y,
		p1.z * p2.z,
		p1.w * p2.w]);
}
Matrix3x2.mul = function (m0, m1, m2) {
	m0.set ([
		(m1._11 * m2._11) + (m1._12 * m2._21) + m2._31,
		(m1._11 * m2._12) + (m1._12 * m2._22) + m2._32,
		(m1._21 * m2._11) + (m1._22 * m2._21) + m2._31,
		(m1._21 * m2._12) + (m1._22 * m2._22) + m2._32,
		(m1._31 * m2._11) + (m1._32 * m2._21) + m2._31,
		(m1._31 * m2._12) + (m1._32 * m2._22) + m2._32]);
}
Matrix4x4.mul = function (m0, m1, m2) {
	m0.set ([
		(m1._11 * m2._11) + (m1._12 * m2._21) + (m1._13 * m2._31) + (m1._14 * m2._41),
		(m1._11 * m2._12) + (m1._12 * m2._22) + (m1._13 * m2._32) + (m1._14 * m2._42),
		(m1._11 * m2._13) + (m1._12 * m2._23) + (m1._13 * m2._33) + (m1._14 * m2._43),
		(m1._11 * m2._14) + (m1._12 * m2._24) + (m1._13 * m2._34) + (m1._14 * m2._44),
		(m1._21 * m2._11) + (m1._22 * m2._21) + (m1._23 * m2._31) + (m1._24 * m2._41),
		(m1._21 * m2._12) + (m1._22 * m2._22) + (m1._23 * m2._32) + (m1._24 * m2._42),
		(m1._21 * m2._13) + (m1._22 * m2._23) + (m1._23 * m2._33) + (m1._24 * m2._43),
		(m1._21 * m2._14) + (m1._22 * m2._24) + (m1._23 * m2._34) + (m1._24 * m2._44),
		(m1._31 * m2._11) + (m1._32 * m2._21) + (m1._33 * m2._31) + (m1._34 * m2._41),
		(m1._31 * m2._12) + (m1._32 * m2._22) + (m1._33 * m2._32) + (m1._34 * m2._42),
		(m1._31 * m2._13) + (m1._32 * m2._23) + (m1._33 * m2._33) + (m1._34 * m2._43),
		(m1._31 * m2._14) + (m1._32 * m2._24) + (m1._33 * m2._34) + (m1._34 * m2._44),
		(m1._41 * m2._11) + (m1._42 * m2._21) + (m1._43 * m2._31) + (m1._44 * m2._41),
		(m1._41 * m2._12) + (m1._42 * m2._22) + (m1._43 * m2._32) + (m1._44 * m2._42),
		(m1._41 * m2._13) + (m1._42 * m2._23) + (m1._43 * m2._33) + (m1._44 * m2._43),
		(m1._41 * m2._14) + (m1._42 * m2._24) + (m1._43 * m2._34) + (m1._44 * m2._44)]);
}
/* Multiply Add */
Point2.muladd = function (p0, p1, p2, p3) {
	p0.set ([
		p1.x * p2.x + p3.x,
		p1.y * p2.y + p3.y]);
}
Point3.muladd = function (p0, p1, p2, p3) {
	p0.set ([
		p1.x * p2.x + p3.x,
		p1.y * p2.y + p3.y,
		p1.z * p2.z + p3.z]);
}
Point4.muladd = function (p0, p1, p2, p3) {
	p0.set ([
		p1.x * p2.x + p3.x,
		p1.y * p2.y + p3.y,
		p1.z * p2.z + p3.z,
		p1.w * p2.w + p3.w]);
}
/* Negate */
Point2.neg = function (p0, p1) {
	p0.set ([-p1.x, -p1.y]);
}
Point3.neg = function (p0, p1) {
	p0.set ([-p1.x, -p1.y, -p1.z]);
}
Point4.neg = function (p0, p1) {
	p0.set ([-p1.x, -p1.y, -p1.z, -p1.w]);
}
/* Normalize */
Point2.norm = function (p0, p1) {
	let len = Point2.len (p1);
	if (len > 0) len = 1 / len;
	p0.set ([
		p1.x * len,
		p1.y * len]);
}
Point3.norm = function (p0, p1) {
	let len = Point3.len (p1);
	if (len > 0) len = 1 / len;
	p0.set ([
		p1.x * len,
		p1.y * len,
		p1.z * len]);
}
Point4.norm = function (p0, p1) {
	let len = Point4.len (p1);
	if (len > 0) len = 1 / len;
	p0.set ([
		p1.x * len,
		p1.y * len,
		p1.z * len,
		p1.w * len]);
}
/* Orthographic */
Matrix4x4.orthographic = function (m0, width, height, nearZ, farZ) {
	const range = nearZ / (farZ - nearZ);
	m0.set ([
		2 / width, 0,          0,              0,
		0,         2 / height, 0,              0,
		0,         0,          range,          0,
		0,         0,          -range * nearZ, 1]);
}
/* Perspective */
Matrix4x4.perspective = function (m0, fovAngleY, aspectRatio, nearZ, farZ) {
	const cosFov = Math.cos (fovAngleY);
	const sinFov = Math.sin (fovAngleY);
	const range = 1.0 / (farZ - nearZ);
	const height = cosFov / sinFov;
	const width = height / aspectRatio;
	m0.set ([
		width, 0,      0,                           0,
		0,     height, 0,                           0,
		0,     0,      range * (farZ + nearZ),      1,
		0,     0,      -range * 2 * (farZ * nearZ), 0]);
}
/* Replicate */
Point2.rep = function (p0, c) {
	p0.set ([c, c]);
}
Point3.rep = function (p0, c) {
	p0.set ([c, c, c]);
}
Point4.rep = function (p0, c) {
	p0.set ([c, c, c, c]);
}
/* Rotation */
Matrix3x2.rotation = function (m0, z) {
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	m0.set ([
		cosZ,  sinZ,
		-sinZ, cosZ,
		0,     0   ]);
}
Matrix4x4.rotation = function (m0, x, y, z) {
	const cosX = Math.cos (x);
	const sinX = Math.sin (x);
	const cosY = Math.cos (y);
	const sinY = Math.sin (y);
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	m0.set ([
		(sinX * sinY * sinZ) + (cosY * cosZ), cosX * sinZ, (sinX * cosY * sinZ) - (sinY * cosZ), 0,
		(sinX * sinY * cosZ) - (cosY * sinZ), cosX * cosZ, (sinX * cosY * cosZ) + (sinY * sinZ), 0,
		cosX * sinY,                          -sinX,       cosX * cosY,                          0,
		0,                                    0,           0,                                    1]);
}
Matrix4x4.rotationFromVector = function (m0, v) {
	Matrix4x4.rotation (m0, v [0], v [1], v [2]);
}
Matrix4x4.rotationX = function (m0, x) {
	const cosX = Math.cos (x);
	const sinX = Math.sin (x);
	m0.set ([
		1, 0,     0,    0,
		0, cosX,  sinX, 0,
		0, -sinX, cosX, 0,
		0, 0,     0,    1]);
}
Matrix4x4.rotationY = function (m0, y) {
	const cosY = Math.cos (y);
	const sinY = Math.sin (y);
	m0.set ([
		cosY, 0, -sinY, 0,
		0,    1, 0,     0,
		sinY, 0, cosY,  0,
		0,    0, 0,     1]);
}
Matrix4x4.rotationZ = function (m0, z) {
	const cosZ = Math.cos (z);
	const sinZ = Math.sin (z);
	m0.set ([
		cosZ,  sinZ, 0, 0,
		-sinZ, cosZ, 0, 0,
		0,     0,    1, 0,
		0,     0,    0, 1]);
}
/* Scaling */
Matrix3x2.scaling = function (m0, x, y) {
	m0.set ([
		x, 0,
		0, y,
		0, 0]);
}
Matrix4x4.scaling = function (m0, x, y, z) {
	m0.set ([
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1]);
}
Matrix3x2.scalingFromVector = function (m0, v) {
	Matrix3x2.scaling (m0, v [0], v [1]);
}
Matrix4x4.scalingFromVector = function (m0, v) {
	Matrix4x4.scaling (m0, v [0], v [1], v [2]);
}
/* Subtract */
Point2.sub = function (p0, p1, p2) {
	p0.set ([
		p1.x - p2.x,
		p1.y - p2.y]);
}
Point3.sub = function (p0, p1, p2) {
	p0.set ([
		p1.x - p2.x,
		p1.y - p2.y,
		p1.z - p2.z]);
}
Point4.sub = function (p0, p1, p2) {
	p0.set ([
		p1.x - p2.x,
		p1.y - p2.y,
		p1.z - p2.z,
		p1.w - p2.w]);
}
/* Transform */
Point2.trans = function (p0, p1, m) {
	p0.set ([
		(p1.x * m._11) + (p1.y * m._21) + m._31,
		(p1.x * m._12) + (p1.y * m._22) + m._32]);
}
Point3.trans = function (p0, p1, m) {
	p0.set ([
		(p1.x * m._11) + (p1.y * m._21) + (p1.z * m._31) + m._41,
		(p1.x * m._12) + (p1.y * m._22) + (p1.z * m._32) + m._42,
		(p1.x * m._13) + (p1.y * m._23) + (p1.z * m._33) + m._43]);
}
Point4.trans = function (p0, p1, m) {
	p0.set ([
		(p1.x * m._11) + (p1.y * m._21) + (p1.z * m._31) + (p1.w * m._41),
		(p1.x * m._12) + (p1.y * m._22) + (p1.z * m._32) + (p1.w * m._42),
		(p1.x * m._13) + (p1.y * m._23) + (p1.z * m._33) + (p1.w * m._43),
		(p1.x * m._14) + (p1.y * m._24) + (p1.z * m._34) + (p1.w * m._44)]);
}
/* Translation */
Matrix3x2.translation = function (m0, x, y) {
	m0.set ([
		1, 0,
		0, 1,
		x, y]);
}
Matrix4x4.translation = function (m0, x, y, z) {
	m0.set ([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1]);
}
Matrix3x2.translationFromVector = function (m0, v) {
	Matrix3x2.translation (m0, v [0], v [1]);
}
Matrix4x4.translationFromVector = function (m0, v) {
	Matrix4x4.translation (m0, v [0], v [1], v [2]);
}
/* Transpose */
Matrix4x4.transpose = function (m0, m1) {
	m0.set ([
		m1._11, m1._21, m1._31, m1._41,
		m1._12, m1._22, m1._32, m1._42,
		m1._13, m1._23, m1._33, m1._43,
		m1._14, m1._24, m1._34, m1._44]);
}
