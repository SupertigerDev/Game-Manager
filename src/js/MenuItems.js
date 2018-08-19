//const Store = require('electron-store');
var execFile = require('child_process').execFile,
    child;
const request = require('request'),
    url = 'https://www.jasonbase.com/things/WYJw.json'
const path = require('path')
//const store = new Store();
var jsonGamesList;
var selectedItem;
var gamelistUpdated = false;
var totalMenus = []
var fadeOutTimerID;

var currentlySwitchingTimeOut = false;

function bootup(){
    getSettings("gameList", function (cb) {
        if (typeof cb == "undefined") {
            totalMenus.push({
                div: "addGameItem",
                name: "Add a game"
            })
            totalMenus.push({
                div: "settingsItem",
                name: "Settings"
            })
            saveSettings("gameList", totalMenus, function () {
                console.log('Settings saved');
            });
    
        } else {
            totalMenus = cb
        }
        updateGamesList()
    })
}


selectedItem = 0;
$(document).keydown(function (e) {
    fadeOutIdle()

    if (gamelistUpdated == false) {
        return;
    }
    if (currentScreen == "homeScreen") {

        if (e.keyCode == 13) {
            openGame();
        }

        if (currentlySwitchingTimeOut) {
            return;
        }
        if (e.keyCode == 39) {
            if (typeof totalMenus[selectedItem + 1] == "undefined") {
                return;
            }
            selectedItem++;
            $(".menuItem").removeClass("selectedMenuItem");
            $("#" + totalMenus[selectedItem].div).addClass("selectedMenuItem")

            changedMenuItem()

            $(".menuItems").animate({
                marginLeft: "-=330"
            }, 100, function () {
                currentlySwitchingTimeOut = false
            })


        } else if (e.keyCode == 37) {
            if (typeof totalMenus[selectedItem - 1] == "undefined") {
                return;
            }

            $(".menuItems").animate({
                marginLeft: "+=330"
            }, 100, function () {
                currentlySwitchingTimeOut = false
            })


            selectedItem--;

            $(".menuItem").removeClass("selectedMenuItem");
            $("#" + totalMenus[selectedItem].div).addClass("selectedMenuItem")

            changedMenuItem()


        }
    }

});

function changedMenuItem() {
    let message;
    let title;
    nextMenuSoundPlay()
    if (totalMenus[selectedItem].name == "Settings") {
        $('.backgroundImage').fadeOut(400);
        title = totalMenus[selectedItem].name
        message = "Change settings such as themes, background and more."
    } else if (totalMenus[selectedItem].name == "Add a game") {
        $('.backgroundImage').fadeOut(400);
        title = totalMenus[selectedItem].name
        message = "To add a game, click on this icon and Choose an executable file."
    } else {


        $('<img/>').attr('src', totalMenus[selectedItem].background[0]).on('load', function () {
            $(this).remove(); // prevent memory leaks.
            $('.backgroundImage').fadeOut(400, function () {
                $('.backgroundImage').css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url(' + getRandomArray(totalMenus[selectedItem].background) + ')');

                setTimeout(() => {
                    $('.backgroundImage').fadeIn(300);
                }, 400);
            });

        });

        title = totalMenus[selectedItem].name
        message = totalMenus[selectedItem].description
    }

    $(".menuItemDetail").fadeOut(300, function () {
        $(".menuDetailTitle").text(title)
        $(".menuDetailMessage").text(message)
        $(".menuItemDetail").fadeIn(300)
    })

}

function openGame() {
    GameOpenSound()
    if (totalMenus[selectedItem].name == "Add a game") {

        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                jsonGamesList = JSON.parse(body)
                currentScreen = "Add a game"
                $(".addGame").fadeIn();
                console.log("Got a response ")
            } else {
                console.log("Got an error: ", error, ", status code: ", response.statusCode)
                $('.somethingWentWrongPopout').fadeIn()
                currentScreen = "somethingWentWrong"
            }
        })


    } else if (totalMenus[selectedItem].name == "Settings") {
        //add settings menu in the future.
    } else {
        currentScreen = "In Game"
        child = execFile(totalMenus[selectedItem].path, function (error, stdout, stderr) {
            if (error) {
                //console.log(error.stack); 
                //console.log('Error code: '+ error.code); 
                //console.log('Signal received: '+ 
                //       error.signal);
            }

            //console.log('Child Process stdout: '+ stdout);
            //console.log('Child Process stderr: '+ stderr);
        });
        child.on('exit', function (code) {
            currentScreen = 'homeScreen'
            //console.log('Child process exited '+
            //    'with exit code '+ code);
            //alert('exit');
            // Load native UI library
            console.log("closed");

        });
    }
}


function updateGamesList() {

    if (totalMenus.length <= 2) {
        gamelistUpdated = true;
        return;
    }

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let newGameList = JSON.parse(body)

            for (var field in newGameList) {
                for (var i in totalMenus) {
                    if (field == totalMenus[i].name) {
                        totalMenus[i].background = newGameList[field].background
                        totalMenus[i].icon = newGameList[field].logo
                        totalMenus[i].description = newGameList[field].description
                    }
                }
            }
            saveSettings("gameList", totalMenus, function () {
                console.log('Settings saved');
            });
            AddToNotificationQueue("Game List", "Game list update successful!", "icon")
            gamelistUpdated = true;
            console.log("Got a response ")
            AddGamesToDiv()
        } else {
            console.log("Got an error: ", error, ", status code: ", response.statusCode)
            AddToNotificationQueue("Game List", "Game list update has failed.", "icon")
            gamelistUpdated = true;
            AddGamesToDiv()

        }
    })
}

function AddGamesToDiv() {
    for (let index = 0; index < totalMenus.length; index++) {
        const element = totalMenus[index];
        if (index > 1) {
            $(".menuItems").append('<div class="menuItem" game="' + element.name + '" style="background-image: url(' + element.icon + ');background-size: 100%;background-position: center;background-repeat: no-repeat;" id="' + element.div + '"><div style="margin-top: 250px;" class="title">Start</div></div>')
            console.log(element)
        }
    }
    fadeOutIdle()
}

function getRandomArray(arr) {
    if (typeof arr == "undefined") {
        return "";
    }
    return arr[Math.floor(Math.random() * (arr.length))]
}

function fadeOutIdle() {
    $(".content").animate({
        opacity: 1
    }, {
        duration: 1000,
        queue: false
    })
    clearTimeout(fadeOutTimerID);
    fadeOutTimerID = setTimeout(() => {
        $(".content").animate({
            opacity: 0
        }, {
            duration: 3000,
            queue: false
        })
    }, 20000);
}

function nextMenuSoundPlay() {
    var audio = new Audio('sounds/MenuMoveSound.mp3');
    audio.play();
}



function GameOpenSound() {
    var audio = new Audio('sounds/GameOpenSound.mp3');
    audio.play();
}

function deleteAll() {

    store.delete("gamesList")
    console.log("Deleted all games!")
}