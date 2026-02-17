// <!--GSAP-->

// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>


// <script>

/* 
TODO 
- redraw SVG paths on window resize
- (optional) clean up scroll triggers to use a more consistent approach to trigger elements / classes
- set more gsap default settings / functions to make things more DRY 
- consider disabling all anim if user prefers-reduced-motion - see https://greensock.com/docs/v3/GSAP/gsap.matchMedia() 
*/

/* register scrollTrigger plugin (free) */
gsap.registerPlugin(ScrollTrigger);

/* set some gsap defaults */
gsap.defaults({
    ease: "power1.inOut", 
    duration: 1
  });

/* helper function to draw a path for a given pre-existing svg, empty path element and set of hidden marker responsive divs */
function drawPath(svgSelector, pathSelector, pointElsArr, requiresViewBox, strokeColor) {

    var svg = document.querySelector(svgSelector);
    var path = document.querySelector(pathSelector);

    /* get the divs and their top left pos */
    var pointStrArr = [];

    for (var i = 0; i < pointElsArr.length; i++) {
        var x = $(pointElsArr[i]).offset().left;
        var y = $(pointElsArr[i]).offset().top;
        
        /* if first point in line */
        if (i == 0) {
            var pointStr = "M " + x + " " + y + " ";
        }
        /* any other point in line */
        else {
            var pointStr = "L " + x + " " + y + " ";
        }
        pointStrArr.push(pointStr);
    }
    
    /* update path */
    path.setAttribute("d", pointStrArr.join(" "));
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke", strokeColor);


    /* update SVG viewbox if needed */
    /* haven't quite figured out why some SVGs need it and others dont - it seems like that if the SVG is nested within a specific section then we need it, but if we're layering the SVG over the whole page (e.g. if the SVG element sits within the <body> because it crosses sections, like for the vision to intro path) then it seems we don't want a vb
    EDIT - now removed from all and adding all dynamic SVGs to a top level .global_lines element  */

    if (requiresViewBox) {
        var bbox = path.getBBox();
        var bbox_x = bbox.x;
        var bbox_y = bbox.y;
        var bbox_w = Math.max(bbox.width, 10); /* make sure svg is at least 10px x 10px */
        var bbox_h = Math.max(bbox.height, 10); 
        svg.setAttribute("viewBox", bbox_x + " " + bbox_y + " " + bbox_w + " " + bbox_h);
        svg.setAttribute("preserveAspectRatio", "xMinYMin");
    }
    else {
        svg.removeAttribute("viewBox");
    }    
    setPathStroke(path);
}

/* helper function to set stroke settings so gsap can later animate */
function setPathStroke(path) {
    var pathLength = path.getTotalLength()
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
}

/* wrap stuff to happen on page load */
function init() {

    /****** draw paths ******/
    /* each path is drawn as straight lines between the top left corners of an array hidden marker divs, positioned with CSS */

    /* draw hero line */
    var heroPointElsArr = [
        '.line-marker-hero-01',
        '.line-marker-hero-02',
        '.line-marker-hero-03',
        '.line-marker-hero-04',
        '.line-marker-hero-05',
    ]
    drawPath('#svg-dynamic-hero','#path-dynamic-hero-faint', heroPointElsArr, false, "#EF3340");
    drawPath('#svg-dynamic-hero','#path-dynamic-hero-bold', heroPointElsArr, false, "#EF3340");

    /* draw vision line */
    var visionPointElsArr = [
        '.line-marker-vision-01',
        '.line-marker-vision-02',
        '.line-marker-vision-03',
        '.line-marker-vision-04',
    ]
    drawPath('#svg-dynamic-vision','#path-dynamic-vision', visionPointElsArr, false, "#EF3340");

    /* draw intro line */
    var introPointElsArr = [
        '.line-marker-intro-01',
        '.line-marker-intro-02'
    ]
    drawPath('#svg-dynamic-intro','#path-dynamic-intro', introPointElsArr, false, "#FCF7F8");
    
    /* draw history line */
    var historyPointElsArr = [
        '.line-marker-history-01',
        '.line-marker-history-02'
    ]
    drawPath('#svg-dynamic-history','#path-dynamic-history', historyPointElsArr, false, "#32322C");
    
    /* draw benefits lines */
    var benefitsPointElsArr_1 = [
        '.line-marker-benefits-01',
        '.line-marker-benefits-02',
        '.line-marker-benefits-03'
    ]
    drawPath('#svg-dynamic-benefits','#path-dynamic-benefits-1', benefitsPointElsArr_1, false, "#98C1D9");
    
    var benefitsPointElsArr_2 = [
        '.line-marker-benefits-04',
        '.line-marker-benefits-05',
    ]
    drawPath('#svg-dynamic-benefits','#path-dynamic-benefits-2', benefitsPointElsArr_2, false, "#98C1D9");
    
    var benefitsPointElsArr_3 = [
        '.line-marker-benefits-06',
        '.line-marker-benefits-07',
    ]
    drawPath('#svg-dynamic-benefits','#path-dynamic-benefits-3', benefitsPointElsArr_3, false, "#98C1D9");
   
    var benefitsPointElsArr_4 = [
        '.line-marker-benefits-08',
        '.line-marker-benefits-09',
        '.line-marker-benefits-10',
        '.line-marker-benefits-11'
    ]
    drawPath('#svg-dynamic-benefits','#path-dynamic-benefits-4', benefitsPointElsArr_4, false, "#98C1D9");

    /* draw Join section lines */
    var joinPointElsArr = [
        '.line-marker-join-01',
        '.line-marker-join-02',
    ]
    drawPath('#svg-dynamic-join','#path-dynamic-join-1', joinPointElsArr, false, "#98C1D9");

    var joinPointElsArr = [
        '.line-marker-join-03',
        '.line-marker-join-04',
        '.line-marker-join-05',
    ]
    drawPath('#svg-dynamic-join','#path-dynamic-join-2', joinPointElsArr, false, "#98C1D9");

    // setPathStroke(document.querySelector(".line-wrapper-hero-arc path"));



    /****** hero animation timeline ******/

    const tl_hero = gsap.timeline();
    tl_hero.addLabel("hero") /* we add labels to specific points in timeline so other events can reference them */

    /* nav */
    tl_hero.from(".nav", {
        opacity: 0, 
        autoAlpha: 0,
    },
    "hero+=0.1"
    )
    tl_hero.addLabel("nav") 

    /* h1 */
    tl_hero.from("h1 .hero_head-split",  {
        opacity: 0,
        autoAlpha: 0,
        y: 30,
        stagger: 0.75,
        duration: 0.75,
    },
    "hero+=0.75"
    )
    tl_hero.addLabel("h1")

    /* h2 */
    tl_hero.from(".hero_subhead h2", {
        opacity: 0,
        autoAlpha: 0,
        y: 30,
        duration: 0.75,
    },
    "h1+=0.1"
    )
    tl_hero.addLabel("h2")

    /* globe */
    tl_hero.from(".hero_img-wrapper", {
        opacity: 0,
        autoAlpha: 0,
        y: 2,
        rotation: -23,
        scale: 0.98,
        duration: 1.5,
    },
    "h1+=0.1"
    )
    tl_hero.addLabel("img-wrapper")

    /* globe line */
    tl_hero.to(".line-wrapper-hero-arc path", {
        strokeDashoffset:0,
        duration: 1,
    },
    "<0.5" /* start 0.5s after start of previous animation (img-wrapper) */
    )
    tl_hero.addLabel("hero-arc")

   /* globe line circle */
    tl_hero.from(".line-wrapper-hero-arc circle", {
        autoAlpha: 0,
        scale: 0.55,
        duration: 0.1,
        ease: "none"
    },
    "<0.9" 
    )
    tl_hero.addLabel("hero-arc")

    /* faint hero line */
    tl_hero.to("#path-dynamic-hero-faint", {
        strokeDashoffset:0,
        duration: 1.5,
    },
    "h1+=0.1"
    )
    tl_hero.addLabel("hero-path")

    /* hero quote */
    tl_hero.from(".hero_quote .quote", {
        opacity: 0,
        autoAlpha: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.25,
    },
    "hero-path-=0.75"
    )
    tl_hero.addLabel("quote")

    }
/* end init() */


window.addEventListener("load", function(event) {
    init();
})


/****** scrolling animations ******/

let mm = gsap.matchMedia();

/* hero to video bold line */

const tl_hero_line = gsap.timeline({
    scrollTrigger: {
        trigger: ".section-video",
        start: 'top 98%',
        markers: false,
        scrub: true,
        end: 'top 60%' /* end line anim when video hits near top of viewport */
    }
});
tl_hero_line.to("#path-dynamic-hero-bold", {
    strokeDashoffset:0,
})

/* video */

const tl_video = gsap.timeline({
scrollTrigger: {
    trigger: ".section-video",
    start: 'top 60%',
    markers: false,
}
});
tl_video.fromTo(".video-thumbnail_wrapper", 
{
    opacity: 0,
    autoAlpha: 0,
    scaleX: 0.95,
    scaleY: 0.95,
    y: 30,
},
{
    opacity: 1,
    autoAlpha: 1,
    scaleX: 1,
    scaleY: 1,
    y: 0,
},
);

/* vision */

const tl_vision = gsap.timeline({
    scrollTrigger: {
        trigger: ".section-vision",
        start: 'top 60%',
        markers: false,
    }
});

tl_vision.from(".vision_content :is(h2, div)", {
    opacity: 0,
    autoAlpha: 0,
    y: 10,
    duration: 1,
    stagger: 0.5,
    scale: 1.15,
    filter: "blur(10px)",
})
tl_vision.from(".vision_bg", {
    opacity: 0,
    autoAlpha: 0,
    duration: 1,
    scale: 1.25,
    filter: "blur(10px)",
},
"<0.5"
);

/* hero to video bold line */
tl_vision.to("#path-dynamic-vision", {
    strokeDashoffset:0,
})


/* intro */

const tl_intro_top = gsap.timeline({
    scrollTrigger: {
        trigger: ".intro_top",
        start: 'top 60%',
        markers: false,
    }
});
tl_intro_top.from(".intro_top", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})

const tl_intro_bottom = gsap.timeline({
    scrollTrigger: {
        trigger: ".intro_bottom",
        start: 'top 60%',
        markers: false,
    }
});
tl_intro_bottom.from(".intro_bottom-content", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})
/* globe */
tl_intro_bottom.from(".intro_img-wrapper", {
    opacity: 0,
    autoAlpha: 0,
    rotation: 0,
    scale: 0.98,
    duration: 1.5,
})
/* intro line to globe - not on small screens */
mm.add("(min-width: 767px)", () => {
    tl_intro_bottom.to("#path-dynamic-intro", {
        strokeDashoffset:0,
})})


/* history */

const tl_history = gsap.timeline({
    scrollTrigger: {
        trigger: ".section-history .container",
        start: 'top 60%',
        markers: false,
    }
});
tl_history.to("#path-dynamic-history", {
    strokeDashoffset:0,
    duration: .5,
})
tl_history.from(".section-history .col", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
},
"<")
tl_history.from(".section-history .history_img-wrapper", {
    opacity: 0,
    autoAlpha: 0,
    duration: 1,
},
"<0.25")

/* benefits */

const tl_benefits = gsap.timeline({
    scrollTrigger: {
        trigger: ".benefits_part-1",
        start: 'top 60%',
        markers: false,
    }
});
tl_benefits.to("#path-dynamic-benefits-1", {
    strokeDashoffset:0,
    duration: .5,
})
tl_benefits.addLabel("benefits-line-1")
tl_benefits.from(".benefits_part-1 .col", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
},
"<")

tl_benefits.from('.benefits_card-01', {
    clipPath: "circle(0% at left 23%)",
    duration: .65,
    ease: 'ease',
},
"benefits-line-1-=0.05") /* start first card anim a fraction before prev line anim finishes */
tl_benefits.to("#path-dynamic-benefits-2", {
    strokeDashoffset:0,
    duration: .15,
},
">-0.15" /* start middle line anims a bit more early since clip path animation takes a while to do whole card */
)
tl_benefits.from('.benefits_card-02', {
    clipPath: "circle(0% at left 23%)",
    duration: .65,
    ease: 'ease',
},
">-0.05"
)
tl_benefits.to("#path-dynamic-benefits-3", {
    strokeDashoffset:0,
    duration: .15,
},
">-0.15"
)
tl_benefits.from('.benefits_card-03', {
    clipPath: "circle(0% at left 23%)",
    duration: .65,
    ease: 'ease',
},
">-0.05"
)
tl_benefits.to("#path-dynamic-benefits-4", {
    strokeDashoffset:0,
    duration: .15,
},
">-0.15"
)
tl_benefits.from(".benefits_part-3-content", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})
/* load in orbit SVG */
tl_benefits.from(".benefits_orbit-wrapper", {
    opacity: 0,
    autoAlpha: 0,
    rotation: 90,
    duration: 1.5,
    ease:Linear.easeNone,
})
/* complete full turn */
tl_benefits.to(".benefits_orbit-wrapper", {
    rotation: -270,
    duration: 4.5,
    ease:Linear.easeNone,
})



/* Path section */

const tl_path_1 = gsap.timeline({
    scrollTrigger: {
        trigger: ".path_part-1",
        start: 'top 60%',
        markers: false,
    }
});
tl_path_1.from(".path_content-1", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})
tl_path_1.from(".path_quote", {
    opacity: 0,
    autoAlpha: 0,
    x: 30,
    duration: 0.5,
},
">-0.1")

const tl_path_2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".path_part-2",
        start: 'top 60%',
        markers: false,
    }
});
tl_path_2.from(".path_content-2", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})

/* goal cards */

const goals_cards = gsap.utils.toArray('.goals_card');
goals_cards.forEach(card => {
    gsap.from(card, { 
      y: 30,
      opacity: 0,
      autoAlpha: 0,
      duration: 0.5,
      scrollTrigger: {
        start: 'top 90%',
        trigger: card,
        scrub: false,
        markers: false,
      }
    })
  });

/* join */

const tl_join = gsap.timeline({
    scrollTrigger: {
        trigger: ".join_content-1",
        start: 'top 90%',
        markers: false,
    }
});
tl_join.to("#path-dynamic-join-1", {
    strokeDashoffset:0,
    duration: .5,
})
tl_join.from(".join_content-1", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
},
"<")
tl_join.from(".join_bg", {
    opacity: 0,
    autoAlpha: 0,
    duration: 1,
},
"<0.25")
tl_join.to("#path-dynamic-join-2", {
    strokeDashoffset:0,
    duration: .5,
})
/* don't do second line in Join section on small screens as a bit fiddly */
mm.add("(min-width: 767px)", () => {
    tl_join.to("#path-dynamic-join-2", {
        strokeDashoffset:0,
        duration: .5,
    })})
tl_join.from(".join_content-2", {
    opacity: 0,
    autoAlpha: 0,
    x: -30,
    duration: 0.5,
},
"<")
tl_join.from(".join_content-3", {
    opacity: 0,
    autoAlpha: 0,
    y: 10,
    duration: 0.5,
})

/* Footer */
const tl_footer_1 = gsap.timeline({
    scrollTrigger: {
        trigger: ".footer_content-1",
        start: 'top 90%',
    }
});
tl_footer_1.from(".footer_content-1", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})

const tl_footer_2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".footer_content-2",
        start: 'top 90%',
    }
});
tl_footer_2.from(".footer_content-2", {
    opacity: 0,
    autoAlpha: 0,
    y: 30,
    duration: 0.5,
})

// </script>