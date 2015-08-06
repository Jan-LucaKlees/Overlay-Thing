var overlayThing;

//preparation
$(document).ready(function() {

	// create overlayThing
	overlayThing = new OverlayThing({
		animationSpeed: 200,
		shadeStyles: {
			backgroundColor: 'rgba(255, 255, 255, .5)'
		}
	});

});


// Vimeo
function showVimeoVideo(vimeoID, postID)
{
	var $details = $("#details-" + postID).html();

	overlayThing
		.setContent("<div class='video-wrapper'><iframe src='//player.vimeo.com/video/" + vimeoID + "?autoplay=true' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>")
		.addContent('<div class="post-details">' + $details + '</div>');

	setTimeout(function(){
		overlayThing.show().centerContent();
		setTimeout(function(){
			overlayThing.centerContent();
		}, 50);
	}, 50);


}