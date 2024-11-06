/*
Copyright 2024 Taichi Murakami.
Bitmap クラスはビットマップ画像を格納します。
[BITMAPFILEHEADER]
	WORD  bfType
	DWORD bfSize
	DWORD bfReserved
	DWORD bfOffBits
[BITMAPINFOHEADER]
	DWORD biSize
	LONG  biWidth
	LONG  biHeight
	WORD  biPlanes
	WORD  biBitCount
	DWORD biCompression
	DWORD biSizeImage
	LONG  biXPelsPerMeter
	LONG  biYPelsPerMeter
	DWORD biClrUsed
	DWORD biClrImportant
*/
class Bitmap {
	constructor (width, height) {
		this.width = width;
		this.height = height;
		this.pixels = new Uint32Array (this.width * this.height);
	}
	getPixel (x, y) {
		return this.pixels [this.getPixelIndex (x, y)];
	}
	getPixelIndex (x, y) {
		return x + y * this.width;
	}
	setPixel (x, y, color) {
		this.pixels [this.getPixelIndex (x, y)] = color;
	}
}
class BitmapAsset extends Asset {
	constructor (source) {
		super (source);
		this.readFileHeader ();
		this.readInfoHeader ();
		this.offColors = this.offset;
		this.getPixel = (() => { switch (this.bitCount) {
			case 1: return this.getPixel1;
			case 4: return this.getPixel4;
			case 8: return this.getPixel8;
			case 24: return this.getPixel24;
			case 32: return this.getPixel32;
			default: throw new BitmapAssetError ();
		}}) ();
	}
	check (conditions) {
		if (!conditions) throw new BitmapAssetError ();
	}
	getColor (index) {
		const offset = this.offColors + (index << 2);
		return this.getUint32 (offset) | 0xff000000;
	}
	getIndex (x, y) {
		return x + this.stride * (this.height - y - 1);
	}
	getPixel1 (x, y) {
		const offset = this.offBits + (this.getIndex (x, y) >> 3);
		const pixel = (this.getUint8 (offset) >> (x % 8)) & 1;
		return this.getColor (pixel);
	}
	getPixel4 (x, y) {
		const offset = this.offBits + (this.getIndex (x, y) >> 1);
		const pixel = (this.getUint8 (offset) >> ((x % 2) * 4)) & 16;
		return this.getColor (pixel);
	}
	getPixel8 (x, y) {
		const offset = this.offBits + this.getIndex (x, y);
		const pixel = this.getUint8 (offset);
		return this.getColor (pixel);
	}
	getPixel24 (x, y) {
		return this.getUint32 (this.getIndex (x, y) * 3) & 0xffffff;
	}
	getPixel32 (x, y) {
		return this.getUint32 (this.getIndex (x, y) * 4);
	}
	readFileHeader () {
		const type = this.readUint16 ();
		this.check (type == 0x4d42);
		this.offset += 8;
		this.offBits = this.readUint32 ();
	}
	readInfoHeader () {
		const begin = this.offset;
		const size = this.readUint32 ();
		this.check (size >= 40);
		this.width = this.readInt32 ();
		this.check (this.width > 0);
		this.height = this.readInt32 ();
		this.check (this.height > 0);
		this.offset += 2;
		this.bitCount = this.readUint16 ();
		this.check (this.bitCount > 0);
		this.stride = (((this.width * this.bitCount) + 31) & ~31) >> 3;
		this.offset = begin + size;
	}
}
class BitmapAssetError extends Error {
	constructor () {
		super ("Unknown Bitmap format.");
	}
}
Bitmap.from = function (source) {
	const asset = new BitmapAsset (source);
	const bitmap = new Bitmap (asset.width, asset.height);
	for (let y = 0; y < bitmap.height; y++) for (let x = 0; x < bitmap.width; x++) bitmap.setPixel (x, y, asset.getPixel (x, y));
	return bitmap;
}
