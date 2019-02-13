$(function () {
	// hide navbar

	let c, currentScrollTop = 0, navbar = $('#navbar');

	$(window).scroll(function () {
		let a = $(window).scrollTop();
		let b = navbar.height();
		
		currentScrollTop = a;
		
		if (c < currentScrollTop && a > b + b) {
			navbar.addClass("scrollUp");
		} else if (c > currentScrollTop && !(a <= b)) {
			navbar.removeClass("scrollUp");
		}
		c = currentScrollTop;
	});
})
