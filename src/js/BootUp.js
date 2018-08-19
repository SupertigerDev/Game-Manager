var circleOne = $(".circle-one"),
    circleTwo = $(".circle-two"),
    windowHeight = $(window).height(),
    windowWidth = $(window).width();

bootupSound();



circleOne.css("height", windowHeight + "px")
circleOne.css("width", windowHeight + "px")
circleOne.css("left", -windowHeight + "px")


circleTwo.css("height", windowHeight + "px")
circleTwo.css("width", windowHeight + "px")
circleTwo.css("right", -windowHeight + "px")

$(".startup").animate({
    opacity: 1
},{
    duration: 300,
    queue: false
})
$(".particles").animate({
    opacity: 1
},{
    duration: 300,
    queue: false
})

$(circleOne).animate({
    left: windowHeight + windowHeight
}, {
    duration: 3000,
    queue: false
});

$(circleTwo).animate({
    left: -windowHeight - 300
}, {
    duration: 3000,
    queue: false
});

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'js/particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
});


setTimeout(() => {
    $(".startup-name").animate({
        opacity: 1
    }, {
        duration: 200,
        queue: false
    })
    $(".startup-name").css("font-size", "50")
}, 500);


setTimeout(() => {
    bootup()
    $(".startup").fadeOut(300,function(){
        $(".allContent").fadeIn();
        $("body").css("transform", "scale(1)")
        setTimeout(() => {
            $(".popOutNotification").css("opacity", "1")

        }, 500);
    });
}, 3000);






function bootupSound() {
    var audio = new Audio('sounds/BootUp.mp3');
    audio.play();
}