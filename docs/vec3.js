/*
Copyright 2025 Taichi Murakami.
GLSL における vec3 を表します。
*/

export function add(v0, v1, v2) {
	load(v0,
		v1[0] + v2[0],
		v1[1] + v2[1],
		v1[2] + v2[2]
	);
}

export function create() {
	return new Float32Array(3);
}

export function cross(v0, v1, v2) {
	load(v0,
		(v1[1] * v2[2]) - (v1[2] * v2[1]),
		(v1[2] * v2[0]) - (v1[0] * v2[2]),
		(v1[0] * v2[1]) - (v1[1] * v2[0])
	);
}

export function div(v0, v1, v2) {
	load(v0,
		v1[0] / v2[0],
		v1[1] / v2[1],
		v1[2] / v2[2]
	);
}

export function dot(v1, v2) {
	return (
		(v1[0] * v2[0]) +
		(v1[1] * v2[1]) +
		(v1[2] * v2[2])
	);
}

export function length(v1) {
	return Math.sqrt(dot(v1, v1));
}

export function lengthSquared(v1) {
	return dot(v1, v1);
}

export function load(v0, x, y, z) {
	v0[0] = x;
	v0[1] = y;
	v0[2] = z;
}

export function mod(v0, v1, v2) {
	load(v0,
		v1[0] % v2[0],
		v1[1] % v2[1],
		v1[2] % v2[2]
	);
}

export function mul(v0, v1, v2) {
	load(v0,
		v1[0] * v2[0],
		v1[1] * v2[1],
		v1[2] * v2[2]
	);
}

export function mulAdd(v0, v1, v2, v3) {
	load(v0,
		v1[0] * v2[0] + v3[0],
		v1[1] * v2[1] + v3[1],
		v1[2] * v2[2] + v3[2]
	);
}

export function neg(v0, v1) {
	load(v0, -v1[0], -v1[1], -v1[2]);
}

export function normalize(v0, v1) {
	let r2 = length(v1);
	if (r2 > 0) r2 = 1 / r2;
	load(v0,
		v1[0] * r2,
		v1[1] * r2,
		v1[2] * r2
	);
}

export function rep(v0, r1) {
	load(v0, r1, r1, r1);
}

export function sub(v0, v1, v2) {
	load(v0,
		v1[0] - v2[0],
		v1[1] - v2[1],
		v1[2] - v2[2]
	);
}

export function zero(v0) {
	rep(v0, 0);
}
