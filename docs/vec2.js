/*
Copyright 2025 Taichi Murakami.
GLSL における vec2 を表します。
*/

import * as Scalar from "./scalar.js";
const COUNT = 2;
const X = 0, Y = 1;

function add(v0, v1, v2) {
	load(v0,
		v1[X] + v2[X],
		v1[Y] + v2[Y]
	);
}

function create() {
	return new Float32Array(COUNT);
}

function cross(v1, v2) {
	return (v1[X] * v2[Y]) - (v1[Y] * v2[X]);
}

function div(v0, v1, v2) {
	load(v0,
		v1[X] / v2[X],
		v1[Y] / v2[Y]
	);
}

function dot(v1, v2) {
	return (
		(v1[X] * v2[X]) +
		(v1[Y] * v2[Y])
	);
}

function equal(v1, v2) {
	return (
		Scalar.equal(v1[X], v2[X]) &&
		Scalar.equal(v1[Y], v2[Y])
	);
}

function length(v1) {
	return Math.sqrt(dot(v1, v1));
}

function lengthSquared(v1) {
	return dot(v1, v1);
}

function load(v0, x, y) {
	v0[X] = x;
	v0[Y] = y;
}

function mod(v0, v1, v2) {
	load(v0,
		v1[X] % v2[X],
		v1[Y] % v2[Y]
	);
}

function mul(v0, v1, v2) {
	load(v0,
		v1[X] * v2[X],
		v1[Y] * v2[Y]
	);
}

function mulAdd(v0, v1, v2, v3) {
	load(v0,
		v1[X] * v2[X] + v3[X],
		v1[Y] * v2[Y] + v3[Y]
	);
}

function neg(v0, v1) {
	load(v0, -v1[X], -v1[Y]);
}

function normalize(v0, v1) {
	let r2 = length(v1);
	if (r2 > 0.0) r2 = 1.0 / r2;
	load(v0,
		v1[X] * r2,
		v1[Y] * r2
	);
}

function notEqual(v1, v2) {
	return (
		!Scalar.equal(v1[X], v2[X]) ||
		!Scalar.equal(v1[Y], v2[Y])
	);
}

function rep(v0, r1) {
	load(v0, r1, r1);
}

function sub(v0, v1, v2) {
	load(v0,
		v1[X] - v2[X],
		v1[Y] - v2[Y]
	);
}

function swizzle(v0, v1, x, y) {
	load(v0, v1[x], v1[y]);
}

function zero(v0) {
	rep(v0, 0.0);
}

export {
	COUNT,
	X, Y,
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
	zero
};
