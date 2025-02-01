/*
Copyright 2025 Taichi Murakami.
四則演算。
*/

const TO_DEGREES = 180 / Math.PI;
const TO_RADIANS = Math.PI / 180;
export const EPSILON = 0.000001;

/* 度数を返します。 */
export function convertToDegrees(radians) {
	return radians * TO_DEGREES;
}

/* ラジアン角を返します。 */
export function convertToRadians(degrees) {
	return degrees * TO_RADIANS;
}

/* 指定した値が 2 の累乗である場合は true を返します。 */
export function isPowerOfTwo(value) {
	return (value & (value - 1)) === 0;
}
