/* Shows/hides WF animations on link click/page load - ie adds page transitions */
/* need to add a WF animation for transitionTrigger class - see https://www.youtube.com/watch?v=XuYO4hY0HhU */

/* NB - old method by Nelson etc uses initial states and does intro animation on page load trigger, which can result in a flash of page content before intro plays */

/* CSS
<style>
body .transition {display: block}
.w-editor .transition {display: none;}
.no-scroll-transition {overflow: hidden; position: relative;}
</style>
*/

/* Code by Timothy Ricks, commented by Sam Pilgrim 
https://www.notion.so/2021-Page-Transitions-ef50ee23f447453b88b6844c0b3ae654
*/


let transitionTrigger = $(".transition-trigger"); /* the element that on click triggers the WF animation */
let introDurationMS = 0; /* time that code waits for animation to finish after page loads, before it allows user to scroll down. We DON'T want to use this, since this blocks the page loading time for Google Lighthouse etc */ 
let exitDurationMS = 1200; /* time that code waits for animation to finish after click, before it loads the next page. This should be the same length of time as the WF animation that shows the loader */
let excludedClass = "no-transition"; /* class we add to any links we don't want to animate on click */
  
// On Page Load
if (transitionTrigger.length > 0) { /* if the trigger element exists */
	transitionTrigger.click(); /* click the trigger and start the animation that hides the loader */
	$("body").addClass("no-scroll-transition"); /* prevent user from scrolling while loader is being hidden. NB if we're setting introDuration to zero (see above), we could just remove these two lines */
	setTimeout(() => {$("body").removeClass("no-scroll-transition");}, introDurationMS); /* after set time, allow user to scroll again */
}

// On Link Click
$("a").on("click", function (e) { /* when a link is clicked */
  /* if the link destination is the same domain as the current page, is not a link to the same page or is empty, doesn't have the excluded transition class, and isn't to a new tab... */
  if ($(this).prop("hostname") == window.location.host && $(this).attr("href").indexOf("#") === -1 &&
      !$(this).hasClass(excludedClass) && $(this).attr("target") !== "_blank" && transitionTrigger.length > 0) {
    e.preventDefault(); /* don't open the link yet */
		$("body").addClass("no-scroll-transition"); /* stop user scrolling */
    let transitionURL = $(this).attr("href");
    transitionTrigger.click(); /* click trigger to start animtion to show loader */
    setTimeout(function () {window.location = transitionURL;}, exitDurationMS); /* advance to next page after set time */
  }
});

// On Back Button Tap
/* not dug into this bit, but this should apparently resolves Safari bug where clicking back button loaded previous state of last page (so showing loader) */
window.onpageshow = function(event) {if (event.persisted) {window.location.reload()}};
// Hide Transition on Window Width Resize
setTimeout(() => {$(window).on("resize", function () {
setTimeout(() => {$(".transition").css("display", "none");}, 50);});
}, introDurationMS);


