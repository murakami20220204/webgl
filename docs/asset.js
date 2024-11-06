/*
Copyright 2024 Taichi Murakami.
Asset クラスは Base 64 で記載されたアセットを利用する方法を提供します。
*/
class Asset {
	constructor (source) {
		this.view = new DataView (Uint8Array.from (atob (source), function (value) { return value.charCodeAt (0); }).buffer);
		this.offset = 0;
		this.endian = true;
	}
	readInt8 () {
		return this.view.getInt8 (this.offset++);
	}
	readInt16 () {
		const value = this.view.getInt16 (this.offset, this.endian);
		this.offset += 2;
		return value;
	}
	readInt32 () {
		const value = this.view.getInt32 (this.offset, this.endian);
		this.offset += 4;
		return value;
	}
	readUint8 () {
		return this.view.getUint8 (this.offset++);
	}
	readUint16 () {
		const value = this.view.getUint16 (this.offset, this.endian);
		this.offset += 2;
		return value;
	}
	readUint32 () {
		const value = this.view.getUint32 (this.offset, this.endian);
		this.offset += 4;
		return value;
	}
	getInt8 (offset) { return this.view.getInt8 (offset); }
	getInt16 (offset) { return this.view.getInt16 (offset, this.endian); }
	getInt32 (offset) { return this.view.getInt32 (offset, this.endian); }
	getUint8 (offset) { return this.view.getUint8 (offset); }
	getUint16 (offset) { return this.view.getUint16 (offset, this.endian); }
	getUint32 (offset) { return this.view.getUint32 (offset, this.endian); }
}
Object.defineProperties (Asset, {
	SPRITE_BITMAP: { value: "Qk02CAAAAAAAADYEAAAoAAAAIAAAACAAAAABAAgAAAAAAAAEAADCDgAAwg4AAAAAAAAAAAAAAAAAAAAAgAAAgAAAAICAAIAAAACAAIAAgIAAAMDAwADA3MAA8MqmAAAgQAAAIGAAACCAAAAgoAAAIMAAACDgAABAAAAAQCAAAEBAAABAYAAAQIAAAECgAABAwAAAQOAAAGAAAABgIAAAYEAAAGBgAABggAAAYKAAAGDAAABg4AAAgAAAAIAgAACAQAAAgGAAAICAAACAoAAAgMAAAIDgAACgAAAAoCAAAKBAAACgYAAAoIAAAKCgAACgwAAAoOAAAMAAAADAIAAAwEAAAMBgAADAgAAAwKAAAMDAAADA4AAA4AAAAOAgAADgQAAA4GAAAOCAAADgoAAA4MAAAODgAEAAAABAACAAQABAAEAAYABAAIAAQACgAEAAwABAAOAAQCAAAEAgIABAIEAAQCBgAEAggABAIKAAQCDAAEAg4ABAQAAAQEAgAEBAQABAQGAAQECAAEBAoABAQMAAQEDgAEBgAABAYCAAQGBAAEBgYABAYIAAQGCgAEBgwABAYOAAQIAAAECAIABAgEAAQIBgAECAgABAgKAAQIDAAECA4ABAoAAAQKAgAECgQABAoGAAQKCAAECgoABAoMAAQKDgAEDAAABAwCAAQMBAAEDAYABAwIAAQMCgAEDAwABAwOAAQOAAAEDgIABA4EAAQOBgAEDggABA4KAAQODAAEDg4ACAAAAAgAAgAIAAQACAAGAAgACAAIAAoACAAMAAgADgAIAgAACAICAAgCBAAIAgYACAIIAAgCCgAIAgwACAIOAAgEAAAIBAIACAQEAAgEBgAIBAgACAQKAAgEDAAIBA4ACAYAAAgGAgAIBgQACAYGAAgGCAAIBgoACAYMAAgGDgAICAAACAgCAAgIBAAICAYACAgIAAgICgAICAwACAgOAAgKAAAICgIACAoEAAgKBgAICggACAoKAAgKDAAICg4ACAwAAAgMAgAIDAQACAwGAAgMCAAIDAoACAwMAAgMDgAIDgAACA4CAAgOBAAIDgYACA4IAAgOCgAIDgwACA4OAAwAAAAMAAIADAAEAAwABgAMAAgADAAKAAwADAAMAA4ADAIAAAwCAgAMAgQADAIGAAwCCAAMAgoADAIMAAwCDgAMBAAADAQCAAwEBAAMBAYADAQIAAwECgAMBAwADAQOAAwGAAAMBgIADAYEAAwGBgAMBggADAYKAAwGDAAMBg4ADAgAAAwIAgAMCAQADAgGAAwICAAMCAoADAgMAAwIDgAMCgAADAoCAAwKBAAMCgYADAoIAAwKCgAMCgwADAoOAAwMAAAMDAIADAwEAAwMBgAMDAgADAwKAA8Pv/AKSgoACAgIAAAAD/AAD/AAAA//8A/wAAAP8A/wD//wAA////AP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2AEn2////////////////////BwBS9v///////////wcAAPf////////////////////3AAAH////////////BwAAUvf39wAAo/f391IASff391IAAAf///////////8HAAD3////AAAH////9wBS////9wAA9v///////////wcAAPf///8AAAf////3AFL////3AAD/////////////BwAA9////wAAB/////cAUv////cAAP////////////8HAAD3////AAAH////9wBS////9wAA/////////////wcAAPf///8AAKP39/dSAFL////3AAD/////////////9gAA9////wAAB/////cAUv////cAAP//////////////AAD3////AAAH////9wBS////9wAA//////////////8AAPf///8AAAf////3AFL////3AAD//////////////wAA9////wAAB/////cAUv////cAAP//////////////AAD3////AABSUlJSSQBS////9wAA//////////////8AAPf///8AAAf////3AFL////3AAD//////////////wAA9////wAAB/////cAUv////cAAP////////////8HAAD3////AAAH////9wBS////9wAA/////////////wcAAPf///8AAAf////3AFL////3AAD3////////////BwAAUlJSUlJSAFJSUlJSUlJSUkkAAKT///////////8HUgf///////YA9///////////9lL3/////////////////////////1IAB///////////////////////////////////////pABJ9v////////////////////////b////////////3AACk////////////////////////91JSUlJSUlJSUlJSUlJSUlJSUlJJAAAAWv////////////////////////////////////cAAFL2/////////////////////////////////////6Na9v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=" }
});
