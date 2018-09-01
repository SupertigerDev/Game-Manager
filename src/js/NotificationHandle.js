var notificationQueue = [];
var notificationPopOutQueue = [];

var popOutLoopRunning = false;
var NotifyLoopRunning = true;

var currentNotification = 0


LoopNotification()

function LoopNotification() {

    if (notificationQueue.length == 0) {
        currentNotification = 0;
        NotifyLoopRunning = false;

        return;
    }
    NotifyLoopRunning = true;

    $(".notificationInner").css("margin-left", "350px")
    $(".notificationInner").html( "<b>"+notificationQueue[currentNotification].title+": </b>"+ notificationQueue[currentNotification].message)

    var curleft = $('.notificationInner').position().left;
    var duration = ($('.notificationInner').outerWidth() + curleft) * 1000 / 50;

    $(".notificationInner").stop().animate({
        marginLeft: -$(".notificationInner").width()
    }, duration, 'linear', function () {
        if (notificationQueue.length == (currentNotification + 1)) {
            currentNotification = 0;
        } else if (notificationQueue.length >= (currentNotification + 1)) {
            currentNotification = currentNotification + 1;
        }

        LoopNotification();
    });
}

function sendNotification(title, message, icon) {
    let mainDiv = $(".popOutNotification")
    let titleDiv = $(".notificationTitle");
    let messageDiv = $(".notificationMessage")
    let iconDiv = $(".popOutNotificationIcon")
    titleDiv.text(title)
    messageDiv.text(message)
    notifySound()
    mainDiv.animate({
        marginLeft: 0
    }, function () {
        setTimeout(() => {
            mainDiv.animate({
                marginLeft: -300
            }, function () {
                setTimeout(() => {
                    checkPopOutQueue()
                }, 500);
            })
        }, 5000);
    })



}


function checkPopOutQueue() {
    let element;
    for (let index = 0; index < notificationQueue.length; index++) {
        element = notificationQueue[index];
        if (!element.popedOut) {
            console.log(element)
            notificationQueue[index].popedOut = true;
            sendNotification(element.title, element.message, element.icon)
            break;
        } else {
            element = undefined
        }

    }
    if (typeof element == "undefined") {
        popOutLoopRunning = false;
    } else {
        popOutLoopRunning = true;
    }
}

function AddToNotificationQueue(title, message, icon) {

    notificationQueue.push({
        title: title,
        message: message,
        icon: icon,
        date: new Date(),
        popedOut: false
    })
    if (popOutLoopRunning) {
        return;
    }
    popOutLoopRunning = true;
    checkPopOutQueue();
    if (!NotifyLoopRunning) {
        LoopNotification();
    }
}
setTimeout(() => {
    AddToNotificationQueue("Game Manager - Tips", "Press \"N\" on your keyboard to read all or dismiss notifications. ", "icon1")
}, 10000);

function notifySound(){
    var audio = new Audio('sounds/NotifySound.mp3');
    audio.play();
}