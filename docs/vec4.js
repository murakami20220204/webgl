/*
Copyright 2025 Taichi Murakami.
GLSL における vec4 を表します。
*/

import * as Scalar from "./scalar.js";
const COUNT = 4;
const M11 = 0,  M12 = 1,  M13 = 2,  M14 = 3;
const M21 = 4,  M22 = 5,  M23 = 6,  M24 = 7;
const M31 = 8,  M32 = 9,  M33 = 10, M34 = 11;
const M41 = 12, M42 = 13, M43 = 14, M44 = 15;
const X = 0, Y = 1, Z = 2, W = 3;

function add(v0, v1, v2) {
	load(v0,
		v1[X] + v2[X],
		v1[Y] + v2[Y],
		v1[Z] + v2[Z],
		v1[W] + v2[W]
	);
}

function create() {
	return new Float32Array(COUNT);
}

function div(v0, v1, v2) {
	load(v0,
		v1[X] / v2[X],
		v1[Y] / v2[Y],
		v1[Z] / v2[Z],
		v1[W] / v2[W]
	);
}

function dot(v1, v2) {
	return (
		(v1[X] * v2[X]) +
		(v1[Y] * v2[Y]) +
		(v1[Z] * v2[Z]) +
		(v1[W] * v2[W])
	);
}

function equal(v1, v2) {
	return (
		Scalar.equal(v1[X], v2[X]) &&
		Scalar.equal(v1[Y], v2[Y]) &&
		Scalar.equal(v1[Z], v2[Z]) &&
		Scalar.equal(v1[W], v2[W])
	);
}

function length(v1) {
	return Math.sqrt(dot(v1, v1));
}

function lengthSquared(v1) {
	return dot(v1, v1);
}

function load(v0, x, y, z, w) {
	v0[X] = x;
	v0[Y] = y;
	v0[Z] = z;
	v0[W] = w;
}

function mod(v0, v1, v2) {
	load(v0,
		v1[X] % v2[X],
		v1[Y] % v2[Y],
		v1[Z] % v2[Z],
		v1[W] % v2[W]
	);
}

function mul(v0, v1, v2) {
	load(v0,
		v1[X] * v2[X],
		v1[Y] * v2[Y],
		v1[Z] * v2[Z],
		v1[W] * v2[W]
	);
}

function mulAdd(v0, v1, v2, v3) {
	load(v0,
		v1[X] * v2[X] + v3[X],
		v1[Y] * v2[Y] + v3[Y],
		v1[Z] * v2[Z] + v3[Z],
		v1[W] * v2[W] + v3[W]
	);
}

function neg(v0, v1) {
	load(v0, -v1[X], -v1[Y], -v1[Z], -v1[W]);
}

function normalize(v0, v1) {
	let r2 = length(v1);
	if (r2 > 0.0) r2 = 1.0 / r2;
	load(v0,
		v1[X] * r2,
		v1[Y] * r2,
		v1[Z] * r2,
		v1[W] * r2
	);
}

function notEqual(v1, v2) {
	return (
		!Scalar.equal(v1[X], v2[X]) ||
		!Scalar.equal(v1[Y], v2[Y]) ||
		!Scalar.equal(v1[Z], v2[Z]) ||
		!Scalar.equal(v1[W], v2[W])
	);
}

function rep(v0, r1) {
	load(v0, r1, r1, r1, r1);
}

function sub(v0, v1, v2) {
	load(v0,
		v1[X] - v2[X],
		v1[Y] - v2[Y],
		v1[Z] - v2[Z],
		v1[W] - v2[W]
	);
}

function swizzle(v0, v1, x, y, z, w) {
	load(v0, v1[x], v1[y], v1[z], v1[w]);
}

function transform(v0, v1, m2) {
	load(v0,
		(v1[X] * m2[M11]) + (v1[Y] * m2[M21]) + (v1[Z] * m2[M31]) + (v1[W] * m2[M41]),
		(v1[X] * m2[M12]) + (v1[Y] * m2[M22]) + (v1[Z] * m2[M32]) + (v1[W] * m2[M42]),
		(v1[X] * m2[M13]) + (v1[Y] * m2[M23]) + (v1[Z] * m2[M33]) + (v1[W] * m2[M43]),
		(v1[X] * m2[M14]) + (v1[Y] * m2[M24]) + (v1[Z] * m2[M34]) + (v1[W] * m2[M44])
	);
}

function zero(v0) {
	rep(v0, 0.0);
}

export {
	COUNT,
	X, Y, Z, W,
	add,
	create,
	div,
	dot,
	equal,
	length,
	lengthSquared,
	load,
	mod,
	mul,
	mulAdd,
	neg,
	normalize,
	notEqual,
	rep,
	sub,
	swizzle,
	transform,
	zero
}
