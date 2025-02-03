/*
Copyright 2025 Taichi Murakami.
GLSL における vec2 を表します。
*/

import * as Scalar from "./scalar.js";
export const COUNT = 2;
export const X = 0;
export const Y = 1;

export function add(v0, v1, v2) {
	load(v0,
		v1[X] + v2[X],
		v1[Y] + v2[Y]
	);
}

export function create() {
	return new Float32Array(COUNT);
}

export function cross(v1, v2) {
	return (v1[X] * v2[Y]) - (v1[Y] * v2[X]);
}

export function div(v0, v1, v2) {
	load(v0,
		v1[X] / v2[X],
		v1[Y] / v2[Y]
	);
}

export function dot(v1, v2) {
	return (
		(v1[X] * v2[X]) +
		(v1[Y] * v2[Y])
	);
}

export function equal(v1, v2) {
	return (
		Scalar.equal(v1[X], v2[X]) &&
		Scalar.equal(v1[Y], v2[Y])
	);
}

export function length(v1) {
	return Math.sqrt(dot(v1, v1));
}

export function lengthSquared(v1) {
	return dot(v1, v1);
}

export function load(v0, x, y) {
	v0[X] = x;
	v0[Y] = y;
}

export function mod(v0, v1, v2) {
	load(v0,
		v1[X] % v2[X],
		v1[Y] % v2[Y]
	);
}

export function mul(v0, v1, v2) {
	load(v0,
		v1[X] * v2[X],
		v1[Y] * v2[Y]
	);
}

export function mulAdd(v0, v1, v2, v3) {
	load(v0,
		v1[X] * v2[X] + v3[X],
		v1[Y] * v2[Y] + v3[Y]
	);
}

export function neg(v0, v1) {
	load(v0, -v1[X], -v1[Y]);
}

export function normalize(v0, v1) {
	let r2 = length(v1);
	if (r2 > 0.0) r2 = 1.0 / r2;
	load(v0,
		v1[X] * r2,
		v1[Y] * r2
	);
}

export function notEqual(v1, v2) {
	return (
		!Scalar.equal(v1[X], v2[X]) ||
		!Scalar.equal(v1[Y], v2[Y])
	);
}

export function rep(v0, r1) {
	load(v0, r1, r1);
}

export function sub(v0, v1, v2) {
	load(v0,
		v1[X] - v2[X],
		v1[Y] - v2[Y]
	);
}

export function swizzle(v0, v1, x, y) {
	load(v0, v1[x], v1[y]);
}

export function zero(v0) {
	rep(v0, 0.0);
}
