
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
        scrollTouched = false;
    }

    scrolldelay = setTimeout(pageScroll,delayTime);
}

document.onscroll = function() {
    console.log("scroll override");
    scrollTouched = true;
}

module.exports = {}