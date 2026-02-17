function isVisible(row, container) {

  var offset = 0;

  var elementTop = $(row).offset().top + offset,
    elementHeight = $(row).height(),
    containerTop = container.scrollTop(),
    containerHeight = container.height();
  // console.log(elementTop+" elementTop");
  // console.log(elementHeight+" elementHeight");
  // console.log(containerTop+" containerTop");
  // console.log(containerHeight+" containerHeight");
  return ((((elementTop - containerTop) + elementHeight) > 0) && ((elementTop - containerTop) < containerHeight));
}

var swiper = new Swiper('.swiper-container', {
  effect: 'fade',
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});

$('body').on("click", ".anchor-link", function() {

  if ($(this).attr('href').indexOf('#') > -1) {
    var hash = $(this).attr('href').match(/#(.*)/)[1];
    $('html, body').animate({
      scrollTop: $('#' + hash).offset().top - 0
    }, {
        duration: 800,
        easing: 'swing',
        complete: function() {
        }
      })
    return false
  }
})

function isVisible(row, container) {

  var offset = 0;

  var elementTop = $(row).offset().top + offset,
    elementHeight = $(row).height(),
    containerTop = container.scrollTop(),
    containerHeight = container.height();
  // console.log(elementTop+" elementTop");
  // console.log(elementHeight+" elementHeight");
  // console.log(containerTop+" containerTop");
  // console.log(containerHeight+" containerHeight");
  return ((((elementTop - containerTop) + elementHeight) > 0) && ((elementTop - containerTop) < containerHeight));
}

function throttle (callback, limit) {
  var tick = false;
  return function () {
    if (!tick) {
      callback.call();
      tick = true;
      setTimeout(function () {
        tick = false;
      }, limit);
    }
  }
}

window.addEventListener("scroll", throttle(show, 100));

$(window).resize(function() {
  show();
});

$( document ).ready(function() {
  show();
});



function show() {
	$('.reveal').each(function() {
    if (isVisible($(this), $(window))) {
      console.log(33);
      this.classList.add("anim");
    }

	});

}

$("#nav-toggle").click(function() {
  // $(".accordion.open").removeClass("open");
  $('body').toggleClass( "toggled" );
});
