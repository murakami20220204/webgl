﻿/*
Copyright 2025 Taichi Murakami.
四則演算。
*/

const TO_DEGREES = 180 / Math.PI;
const TO_RADIANS = Math.PI / 180;
const EPSILON = 0.000001;

/* 度数を返します。 */
function convertToDegrees(radians) {
	return radians * TO_DEGREES;
}

/* ラジアン角を返します。 */
function convertToRadians(degrees) {
	return degrees * TO_RADIANS;
}

/* ふたつの値が近ければ true を返します。 */
function equal(r1, r2) {
	const r0 = r2 - r1;
	return (-EPSILON <= r0) && (r0 <= EPSILON);
}

/* 指定した値が 2 の累乗である場合は true を返します。 */
function isPowerOfTwo(value) {
	return (value & (value - 1)) === 0;
}

export {
	EPSILON,
	convertToDegrees,
	convertToRadians,
	equal,
	isPowerOfTwo
};
