function OverlayThing(args)
{
	// Default settings
	var settings = {

		animationSpeed : 400,
		animationStyle: "ease-out",

		shadeClasses: "",
		contentClasses: "",

		shadeStyles: {
			backgroundColor : 'rgba(0, 0, 0, 0.3)'
		},

		backgroundStyles: {
			'filter'         : 'blur(5px)',
			'-webkit-filter' : 'blur(5px)',
			'-moz-filter'    : 'blur(5px)',
			'-o-filter'      : 'blur(5px)',
			'-ms-filter'     : 'blur(5px)'
		}
	};

	// merge default settings with given settings
	settings = jQuery.extend(settings, args);

	// misc vars
	var scrollPos;

	// jQuery elements
	var $body = $("body");
	var $html = $("html");

	var bodyChildElements;

	var backgroundElements;

	/*// create styles/*
<style title="css_style" type="text/css">
	body {

		transition: -webkit-filter 400ms;
	}

	body.overlaid > :not(.overlaying) {
		-webkit-filter: blur(5px);
	}
</style>*/

	// create the overlay shade
	var $overlayShade = $('<div>', {"class": "overlay-thing-shade " + settings.shadeClasses})
		.css(settings.shadeStyles)
		.css(settings.backgroundStyles)
		.css({
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			overflowY: "auto",
			zIndex: 9999,
			display: 'none',
			opacity: 0
		})
		.click(function ()
		{
			this.hide();
		}.bind(this))
		.appendTo($body);

	// create the overlay content (inside the shade)
	var $overlayContent = $("<div>", {"class": "overlay-thing-content " + settings.contentClasses})
		.css({
			position: "absolute"
		})
		.click(function(event) {
			event.preventDefault();
			event.stopPropagation();
		})
		.appendTo($overlayShade);

	// sets content for the Overlay
	this.setContent = function (content)
	{
		$overlayContent.html(content);

		return this;
	};

	// adds content for the Overlay
	this.addContent = function (content)
	{
		$overlayContent.append(content);

		return this;
	};

	this.centerContent = function()
	{
		var shadeInnerHeight = $overlayShade.innerHeight();
		var shadeInnerwidth  = $overlayShade.innerWidth();
		var contentOuterHeight = $overlayContent.outerHeight();
		var contentOuterWidth  = $overlayContent.outerWidth();

		// check if I have enough space to center the content vertically, meaning if the inner height of the shade is bigger that the height of the content
		if(shadeInnerHeight > contentOuterHeight)
		{
			$overlayContent
				.css({
					marginTop: Math.round((shadeInnerHeight - contentOuterHeight) / 2) + "px",
				});
		}
		else
		{
			$overlayContent
				.css({
					marginTop: "20px",
					marginBottom: "20px"
				})
		}

		// check if I have enough space to center the content horizontally, meaning if the inner width of the shade is bigger that the width of the content
		if($overlayShade.innerWidth() > $overlayContent.outerWidth())
		{
			$overlayContent
				.css({
					marginLeft: Math.round((shadeInnerwidth - contentOuterWidth) / 2) + "px",
				});
		}
		else
		{
			$overlayContent
				.css({
					marginLeft: "0px",
				});
		}

		$overlayContent
			.css({
				position: "absolute",
				top: "0px",
				left: "0px"
			});

		return this;
	};

	this.show = function ()
	{
		// apply class
		$body.addClass("overlaid");

		// disable scroll
		disableScroll();

		// get some Elements for later use
		bodyChildElements = $body.children();
		backgroundElements = bodyChildElements.not($overlayShade);

		// aplly transitions for smooth effects
		applyTransitions();

		// show overlayShade
		$overlayShade
			.css({
				display: "block"
			});

		// aplly and remove styles from overlayShade to trigger smooth animation
		setTimeout(function() {

			// apply background styles and set transitions
			applyBackgroundStyles();

			// make overlayShade fade in
			$overlayShade
				.css({
					opacity: 1
				});

			// remove styles from overlayShade
			jQuery.each(settings.backgroundStyles, function(key) {
				$overlayShade
					.css(key, "");
			});

		}, 0);

		return this;
	};

	this.hide = function ()
	{
		// fade out overlayShade
		$overlayShade
			.css({
				opacity: 0
			})
			.css(settings.backgroundStyles);

		// remove background styles so they can animate out smooth
		removeBackgroundStyles();

		// after everything has animated
		setTimeout(function(){

			// hide overlayShade
			$overlayShade
				.css({
					display: 'none'
				});

			removeTransitions();

			// clear content
			$overlayContent.html('');

			// enable scroll
			enableScroll();

			// clear body-class
			$body.removeClass("overlaid");

		}, settings.animationSpeed);

		return this;
	};

	function applyTransitions()
	{
		// create transition filters for every element in Background
		var transition = "opacity " + settings.animationSpeed + "ms, ";

		jQuery.each(settings.backgroundStyles, function(key) {
			transition += key + " " + settings.animationSpeed + "ms, ";
		});

		// apply transition to all elements
		bodyChildElements
			.css("transition", transition);
	}

	function applyBackgroundStyles()
	{
		// apply styles to background
		backgroundElements
			.css(settings.backgroundStyles);
	}

	function removeTransitions()
	{
		bodyChildElements
			.css("transition", "");
	}

	function removeBackgroundStyles()
	{
		// reset style for all background elements
		jQuery.each(settings.backgroundStyles, function(key) {
			backgroundElements
				.css(key, "");
		});
	}

	function disableScroll()
	{
		// get current scroll position
		scrollPos = $body.scrollTop() || $(document).scrollTop() || $(window).scrollTop();

		// get the current body width
		var bodyWidthBefore = $body.outerWidth();

		// disable scroll on body elm
		$body
			.css({
				height: '100%',
				overflow: 'hidden'
			})
			.scrollTop(scrollPos);

		// add margin to the html elm to make up for the missing scrollbar
		$html.attr("style", "margin-right: " + ($body.outerWidth() - bodyWidthBefore) + "px !important");
	}

	function enableScroll()
	{
		// get current scroll position
		scrollPos = $body.scrollTop() || $(document).scrollTop() || $(window).scrollTop();

		// remove margin from html elm as the scrollbar is coming back and no spacing is needed anymore
		$html.removeAttr("style");

		// enable scroll on body elm
		$body.css({
			height: '',
			overflow: '',
		}).scrollTop(scrollPos);
	}
}