/*
Copyright 2025 Taichi Murakami.
GLSL における vec3 を表します。
*/

import * as Scalar from "./scalar.js";
const COUNT = 3;
const M11 = 0, M12 = 1, M13 = 2;
const M21 = 3, M22 = 4, M23 = 5;
const M31 = 6, M32 = 7, M33 = 8;
const X = 0, Y = 1, Z = 2;

function add(v0, v1, v2) {
	load(v0,
		v1[X] + v2[X],
		v1[Y] + v2[Y],
		v1[Z] + v2[Z]
	);
}

function create() {
	return new Float32Array(COUNT);
}

function cross(v0, v1, v2) {
	load(v0,
		(v1[Y] * v2[Z]) - (v1[Z] * v2[Y]),
		(v1[Z] * v2[X]) - (v1[X] * v2[Z]),
		(v1[X] * v2[Y]) - (v1[Y] * v2[X])
	);
}

function div(v0, v1, v2) {
	load(v0,
		v1[X] / v2[X],
		v1[Y] / v2[Y],
		v1[Z] / v2[Z]
	);
}

function dot(v1, v2) {
	return (
		(v1[X] * v2[X]) +
		(v1[Y] * v2[Y]) +
		(v1[Z] * v2[Z])
	);
}

function equal(v1, v2) {
	return (
		Scalar.equal(v1[X], v2[X]) &&
		Scalar.equal(v1[Y], v2[Y]) &&
		Scalar.equal(v1[Z], v2[Z])
	);
}

function length(v1) {
	return Math.sqrt(dot(v1, v1));
}

function lengthSquared(v1) {
	return dot(v1, v1);
}

function load(v0, x, y, z) {
	v0[X] = x;
	v0[Y] = y;
	v0[Z] = z;
}

function mod(v0, v1, v2) {
	load(v0,
		v1[X] % v2[X],
		v1[Y] % v2[Y],
		v1[Z] % v2[Z]
	);
}

function mul(v0, v1, v2) {
	load(v0,
		v1[X] * v2[X],
		v1[Y] * v2[Y],
		v1[Z] * v2[Z]
	);
}

function mulAdd(v0, v1, v2, v3) {
	load(v0,
		v1[X] * v2[X] + v3[X],
		v1[Y] * v2[Y] + v3[Y],
		v1[Z] * v2[Z] + v3[Z]
	);
}

function neg(v0, v1) {
	load(v0, -v1[X], -v1[Y], -v1[Z]);
}

function normalize(v0, v1) {
	let r2 = length(v1);
	if (r2 > 0.0) r2 = 1.0 / r2;
	load(v0,
		v1[X] * r2,
		v1[Y] * r2,
		v1[Z] * r2
	);
}

function notEqual(v1, v2) {
	return (
		!Scalar.equal(v1[X], v2[X]) ||
		!Scalar.equal(v1[Y], v2[Y]) ||
		!Scalar.equal(v1[Z], v2[Z])
	);
}

function rep(v0, r1) {
	load(v0, r1, r1, r1);
}

function sub(v0, v1, v2) {
	load(v0,
		v1[X] - v2[X],
		v1[Y] - v2[Y],
		v1[Z] - v2[Z]
	);
}

function swizzle(v0, v1, x, y, z) {
	load(v0, v1[x], v1[y], v1[z]);
}

function transform(v0, v1, m2) {
	load(v0,
		(v1[X] * m2[M11]) + (v1[Y] * m2[M21]) + (v1[Z] * m2[M31]),
		(v1[X] * m2[M12]) + (v1[Y] * m2[M22]) + (v1[Z] * m2[M32]),
		(v1[X] * m2[M13]) + (v1[Y] * m2[M23]) + (v1[Z] * m2[M33])
	);
}

function zero(v0) {
	rep(v0, 0.0);
}

export {
	COUNT,
	X, Y, Z,
	add,
	create,
	cross,
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
};
