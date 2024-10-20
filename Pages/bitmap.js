/*
Copyright 2024 Taichi Murakami.
ビットマップをクラス内に格納します。
*/

var Bitmap = function (width, height) {
	this.width = width;
	this.height = height;
	this.pixels = new Uint8Array (this.width * this.height * 4);
}

Bitmap.prototype.getPixel = function (x, y) {
	const begin = this.getPixelOffset (x, y);
	const end = begin + 4;
	return this.pixels.slice (begin, end);
}

Bitmap.prototype.getPixelOffset = function (x, y) {
	return 4 * (x + y * this.width);
}

Bitmap.prototype.setPixel = function (x, y, color) {
	const offset = this.getPixelOffset (x, y);
	this.pixels.set (color, offset);
}

var BitmapReader = function () {
	this.bitmap = null;
	this.palette = null;
	this.source = null;
	this.view = null;
	this.offset = 0;
	this.offBits = 0;
	this.height = 0;
	this.width = 0;
	this.bitCount = 0;
}

BitmapReader.prototype.getPaletteColor = function (index) {
	const begin = index * 4;
	const end = begin + 4;
	return this.palette.slice (begin, end);
}

BitmapReader.prototype.read = function () {
	this.bitmap = null;
	this.palette = null;
	this.view = new DataView (this.source);
	this.offset = 0;
	this.readFileHeader ();
	this.readInfoHeader ();
	this.readPalette ();
	this.bitmap = new Bitmap (this.width, this.height);
	this.offset = this.offBits;

	switch (this.bitCount) {
		case 1: this.readBody1 (); break;
		case 4: this.readBody4 (); break;
		case 8: this.readBody8 (); break;
		case 24: this.readBody24 (); break;
		case 32: this.readBody32 (); break;
		default: throw new Error ("Unknown bitmap format.");
	}
}

BitmapReader.prototype.readBody1 = function () {
	const off = new Uint8Array ([0, 0, 0, 0]);
	const on = new Uint8Array ([255, 255, 255, 255]);

	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x += 8) {
			const body = this.readUint8 ();

			for (let bit = 0; bit < 8; bit++) {
				const pixel = (1 & (body >> bit)) ? off : on;
				this.bitmap.setPixel (x, y, pixel);
			}
		}
	}
}

BitmapReader.prototype.readBody24 = function () {
	const pixel = new Uint8Array (4);
	pixel [3] = 255;

	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			pixel [0] = this.readUint8 ();
			pixel [1] = this.readUint8 ();
			pixel [2] = this.readUint8 ();
			this.bitmap.setPixel (x, y, pixel);
		}
	}
}

BitmapReader.prototype.readBody32 = function () {
	const pixel = new Uint8Array (4);
	pixel [3] = 255;

	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			this.offset++;
			pixel [0] = this.readUint8 ();
			pixel [1] = this.readUint8 ();
			pixel [2] = this.readUint8 ();
			this.bitmap.setPixel (x, y, pixel);
		}
	}
}

BitmapReader.prototype.readBody4 = function () {
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			const body = this.readUint8 ();

			for (let bit = 0; bit < 8; bit += 4) {
				const index = 0xf & (body >> bit);
				const pixel = this.getPaletteColor (index);
				this.bitmap.setPixel (x, y, pixel);
			}
		}
	}
}

BitmapReader.prototype.readBody8 = function () {
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			const index = this.readUint8 ();
			const pixel = this.getPaletteColor (index);
			this.bitmap.setPixel (x, y, pixel);
		}
	}
}

BitmapReader.prototype.readBytes = function (count) {
	const bytes = this.source.slice (this.offset, this.offset + count);
	this.offset += count;
	return bytes;
}

BitmapReader.prototype.readFileHeader = function () {
	const type = this.readUint16 ();
	if (type != 0x4d42) throw new Error ("Unknown bitmap signature.");
	this.offset += 8; // NOP.
	this.offBits = this.readUint32 ();
}

BitmapReader.prototype.readInfoHeader = function () {
	const offset = this.offset;
	const size = this.readUint32 ();
	this.width = this.readInt32 ();
	this.height = this.readInt32 ();
	this.offset += 2; // NOP: Planes.
	this.bitCount = this.readUint16 ();
	this.offset = offset + size;
}

BitmapReader.prototype.readInt32 = function () {
	const value = this.view.getInt32 (this.offset, true);
	this.offset += 4;
	return value;
}

BitmapReader.prototype.readPalette = function () {
	let count;

	switch (this.bitCount) {
		case 4: count = 64; break;
		case 8: count = 1024; break;
		default: count = 0; break;
	} if (count != 0) {
		const color = new Uint8Array (4);
		color [3] = 255;
		this.palette = new Uint8Array (count);

		for (let index = 0; index < count; index += 4) {
			for (let offset = 0; offset < 3; offset++) color [offset] = this.readUint8 ();
			this.offset++;
			this.palette.set (color, index);
		}
	}
}

BitmapReader.prototype.readSignature = function () {
	const signature = new Uint8Array (2);
	signature [0] = this.readUint8 ();
	signature [1] = this.readUint8 ();
	if ((signature [0] != 'B'.charCodeAt (0)) || (signature [1] != 'M'.charCodeAt (0))) throw new Error ("Unknown bitmap signature.");
}

BitmapReader.prototype.readUint16 = function () {
	const value = this.view.getUint16 (this.offset, true);
	this.offset += 2;
	return value;
}

BitmapReader.prototype.readUint32 = function () {
	const value = this.view.getUint32 (this.offset, true);
	this.offset += 4;
	return value;
}

BitmapReader.prototype.readUint8 = function () {
	return this.view.getUint8 (this.offset++);
}
