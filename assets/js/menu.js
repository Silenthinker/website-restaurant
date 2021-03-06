var menuTypes = ['appetizer', 'pasta', 'meat', 'dessert'];
var menuNames = [
['Bruschette with Tomatoes', 'Green Rolls', 'Eggplants', 'Bruschette', 'Meatballs', 'Spicy Beans'],
['Home-made Carls Pasta', 'Italian Pasta', 'Semo Pasta', 'Veggie Pasta', 'Craw Pasta', 'Taco Pasta'],
['Special Duck Confit', 'Baked Fish', 'Swiss Steak', 'Crawfish', 'Veggie Beef', 'Asian Chicken'],
['Recommended Tiramisu', 'Cheesecake', 'Fired Cannoli', 'Ice Cream', 'Mille-feuille', 'Sweet Mafia'],
];
var mq = window.matchMedia('(min-width: 768px)');

function getIndexOfSubsection(elem, k) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportMiddle = viewportTop + $(window).height() / 2.0;
    // Get the position of the element on the page.
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.innerHeight();
    var size = $elem.innerHeight() / k;
    if ((elemBottom <= viewportMiddle) || (elemTop >= viewportMiddle)) return -1;
    // console.log(elemTop - viewportMiddle);
    var idx = Math.ceil((viewportMiddle - elemTop) / size);
    return idx;
}

function updateMenuItems(idx, changefocus) {
	// update menu items including images, text as well as those for popup windows
	$('.menu .overview h3').text($('.overview-list > a:nth-child(' + idx + ')').text());
	if (changefocus) {
	    $('.overview-list > a:nth-child(' + idx + ')').css("background-color", "green").data("focused", 'true');
	    $('.overview-list > a:not(.overview-list > a:nth-child(' + idx + '))').css("background-color", "black").data("focused", "false");
	}
    // update images and titles
    for (var i = 0; i < 6; i++) {
    	var row = Math.floor(i / 2) + 1;
    	var col = i % 2 + 1;
    	var imageName = menuTypes[idx-1] + '-' + i + '.jpg';
    	var viewContent = '.imageview > section.row:nth-child(' + row + ') > section:nth-of-type(' + col + ') > .view-content';
	    $(viewContent).css('background-image', 'url(./images/'+ imageName);
	    $(viewContent + ' a').text(menuNames[idx-1][i]);	
	    var j = i + 1;
	    $('section > .modal:nth-child(' + j + ') figure').css('background-image', 'url(./images/'+ imageName);
	    $('section > .modal:nth-child(' + j + ') h2').text(menuNames[idx-1][i]);
    }
}

function fancyMenuUpdate() {
	$(window).scroll(function(){ // windown scroll not responsive to media queries!
		if (mq.matches) {
			// dynamic menu highlight
			var k = 10; // divide menu section to k slices
			var idx = getIndexOfSubsection($('section.menu'), k);
			if (!(idx > (k-4)/2 && idx < (k+4)/2+1)) return;
			idx = idx - (k-4)/2;
			updateMenuItems(idx, true);
		}
	});
	// highlight menu when hover
	$('.overview-list > a').hover(
		function () {
			if (mq.matches) {
				$(this).css("background-color", "green");
				for (var i = 1; i < 5; i++) {
					var item = $('.overview-list > a:nth-child(' + i + ')'), focusedItem;
					if (item.data("focused") == "true") {
						focusedItem = item;
					}
				}
				if ($(this).data("focused") == 'false') {
					focusedItem.css("background-color", "black");
				}
				var idx;
				for (var j = 1; j < 5; j++) {
					if ($(this).attr("alt") == menuTypes[j-1]) {
						idx = j;
					}
				}
				updateMenuItems(idx, false);
			}
		},
		function () {
			if (mq.matches) {
				if ($(this).data("focused") == 'false') {
					$(this).css("background-color", "black");
					for (var i = 1; i < 5; i++) {
						var item = $('.overview-list > a:nth-child(' + i + ')'), focusedItem;
						if (item.data("focused") == "true") {
							focusedItem = item;
						}
					}
					focusedItem.css("background-color", "green");
					for (var j = 1; j < 5; j++) {
						if (focusedItem.attr("alt") == menuTypes[j-1]) {
							idx = j;
						}
					}
					updateMenuItems(idx, false);
				}
			}
		}
	)
	$('.overview-list > a').on('click', 
		function() {
			if (!mq.matches) {
				$(this).css("background-color", "green");
				for (var i = 1; i < 5; i++) {
					var item = $('.overview-list > a:nth-child(' + i + ')'), focusedItem;
					if (item.data("focused") == "true") {
						focusedItem = item;
					}
				}
				if ($(this).data("focused") == 'false') {
					focusedItem.css("background-color", "black");
				}
				var idx;
				for (var j = 1; j < 5; j++) {
					if ($(this).attr("alt") == menuTypes[j-1]) {
						idx = j;
					}
				}
				updateMenuItems(idx, true);
			}
	});
}

$(document).ready(function(){
	fancyMenuUpdate();
	mq.addListener(fancyMenuUpdate);
	// disable scrolling in case of popup
	var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
	var scrollTop;
	// make div.view-content clickable
	$('div.view-content').on('click', function() {
		scrollTop = $(scrollElem).scrollTop();
		$('body').css({'position': 'fixed'}).css({top: -1*scrollTop});
		window.location = $(this).find(".front > a").attr("href"); 
	});
	$('.popup .closebtn').click(function () {
		$('body').css({'position': 'static'});
		$(window).scrollTop(scrollTop);
	});
});
