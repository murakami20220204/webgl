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

function onAnimationFrame (timestamp) {
	game.deltaSeconds = timestamp - game.deltaSeconds;
	resize ();
	game.update ();
	game.draw ();
	window.requestAnimationFrame (onAnimationFrame);
}

function onError (event) {
	window.alert (event);
}

function onLoad (event) {
	canvas = document.getElementById ("gl");
	canvas.width
	game = new Game ();
	window.requestAnimationFrame (onAnimationFrame);
}

function resize (event) {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	if ((canvas.width != width) || (canvas.height != height)) {
		canvas.width = width;
		canvas.height = height;
		game.surfaceWidth = width;
		game.surfaceHeight = height;
	}
}
