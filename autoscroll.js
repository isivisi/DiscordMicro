
var allowedScroll = true;
var scrollTouched = false;
function pageScroll() { 
    var delayTime = 10;

    if (allowedScroll) {
        window.scrollBy(0,50);
    }
    
    if (scrollTouched) {
        delayTime = 500;
        allowedScroll = (document.body.scrollHeight - window.pageYOffset < window.innerHeight);
        console.log("Autoscroll enabled:", allowedScroll);
        scrollTouched = false;
    }

    scrolldelay = setTimeout(pageScroll,delayTime);
}

document.onscroll = function() {
    console.log("scroll override");
    scrollTouched = true;
}

pageScroll();

module.exports = {}