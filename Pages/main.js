/*
Copyright 2024 Taichi Murakami.
ゲームを起動する方法を記述します。
HTML ドキュメントから取得した情報を加工して、Game クラスのインスタンスへ情報を渡します。
HTML 画面の大きさが変更された場合は、Canvas 要素の大きさと Viewport の大きさを更新します。
*/

var canvas;
var game;
window.addEventListener ("error", onError);
window.addEventListener ("load", onLoad);

function createByteArrayFromBase64 (source) {
	return Uint8Array.from (window.atob (source), function (value) { return value.charCodeAt (0); }).buffer;
}

function onAnimationFrame (timestamp) {
	game.deltaSeconds = timestamp - game.deltaSeconds;
	game.update ();
	game.draw ();
	window.requestAnimationFrame (onAnimationFrame);
}

function onError (event) {
	window.alert (`${event.filename} (${event.lineno}:${event.colno}) ${event.message}`);
}

function onLoad (event) {
	canvas = document.getElementById ("gl");
	canvas.width
	game = new Game ();
	window.requestAnimationFrame (onAnimationFrame);
}
