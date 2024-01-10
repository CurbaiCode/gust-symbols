/*
 * Gust Symbols 2.1.1 - https://curbaicode.github.io/Gust-Symbols/
 * License - https://curbaicode.github.io/Gust-Symbols/license/ (Symbols: CC BY SA 4.0, Fonts: SIL OFL 1.1, Code: GNU AGPLv3)
 * Copyright 2024 Curbai
 */
function Gust() {
	var symbols = document.querySelectorAll(".gs, .gsl");
	for (var i = 0; i < symbols.length; i++) {
		var symbol = symbols[i];
		var cs = getComputedStyle(symbol);
		var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
		var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
		var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
		var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
		symbol.style.width = (symbol.offsetHeight - paddingY - borderY + paddingX + borderX) + "px";
	}
}

if (typeof window.webkitConvertPointFromNodeToPage === "function") { // Browser is WebKit
	if (document.readyState === "loading") {
		// Loading hasn't finished yet
		document.addEventListener("DOMContentLoaded", Gust);
	} else {
		// "DOMContentLoaded" has already fired
		Gust();
	}
}
