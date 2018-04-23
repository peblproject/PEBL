$(document).ready(function() {
	if (window.ReadiumSDK == null) {
		PEBL.start(false, function(readypebl) {
		pebl = readypebl;
		pebl.login(function() {
			dosomething();
		});
	});
	}
});

function dosomething() {
	window.pebl.openBook(window.ReadiumInterop.getEmbeddedBookName(), function() {
		window.pebl.initializeToc(window.staticTOC);
	});
}