//const Store = require('electron-store');
var execFile = require('child_process').execFile,
    child;
const request = require('request'),
    url = 'https://www.jasonbase.com/things/WYJw.json'
const path = require('path')
//const store = new Store();
var jsonGamesList = undefined;
var selectedItem;
var gamelistUpdated = false;
var totalMenus = []
var fadeOutTimerID;

var switchBackgroundID;
var menuSwitchTimeout = null;



function bootup() {
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


    if (gamelistUpdated == false) {
        return;
    }
    if (currentScreen == "homeScreen") {
        fadeOutIdle()

        if (e.keyCode == 13) {
            openGame();
        }
        if (e.keyCode == 78) {
            openNotificationMenu();
        }

        if (menuSwitchTimeout == null) {
            menuSwitchTimeout = setTimeout(() => {
                clearTimeout(menuSwitchTimeout);
                menuSwitchTimeout = null;
            }, 100);
        } else {
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
            }, 100)


        } else if (e.keyCode == 37) {
            if (typeof totalMenus[selectedItem - 1] == "undefined") {
                return;
            }

            $(".menuItems").animate({
                marginLeft: "+=330"
            }, 100)


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
        $('.backgroundImage').fadeOut(400);
        clearTimeout(switchBackgroundID);
        switchBackgroundID = setTimeout(() => {

            let random = getRandomArray(totalMenus[selectedItem].background).replace(/ /g,"%20");

            $('<img/>').attr('src', random).on('load', function () {
                $(this).remove(); // prevent memory leaks.
                $('.backgroundImage').css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url(' + random + ')');

                $('.backgroundImage').fadeIn(300);



            });

        }, 1000);



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

        currentScreen = "Add a game"

        if (jsonGamesList != undefined) {
            content = '<p>Choose a game executable file or a shortcut.</p><br><input id="location" type="text" placeholder="Location"> <div class="browsebutton" onclick="browseButton()">Browse</div><div><div class="button" onclick="addButton()">Add</div> <div class="button" onclick="closeMenu(\'add-game\', true); closeMenu(\'detect-fail\', true);currentScreen = \'homeScreen\';">Close</div></div><input style="display:none;" id="LocateGame" type="file" />'
            appendMenu("add-game", "Add Game", content, true, true, 583, 302, 498, 199)
            return;
        } else {
            fadeOutMenu(() => {
                request(url, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        jsonGamesList = JSON.parse(body)

                        content = '<p>Choose a game executable file or a shortcut.</p><br><input id="location" type="text" placeholder="Location"> <div class="browsebutton" onclick="browseButton()">Browse</div><div><div class="button" onclick="addButton()">Add</div> <div class="button" onclick="closeMenu(\'add-game\', true); closeMenu(\'detect-fail\', true);currentScreen = \'homeScreen\';">Close</div></div><input style="display:none;" id="LocateGame" type="file" />'
                        appendMenu("add-game", "Add Game", content, true, true, 583, 302, 498, 199)
                        console.log("Got a response ")


                    } else {
                        console.log("Got an error: ", error)
                        somethingWrong("There is no internet connection right now.");
                        currentScreen = "somethingWentWrong"
                    }
                })
            });

        }

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
            jsonGamesList = newGameList;

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
            console.log("Got an error: ", error)
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
            $(".menuItems").append('<div class="menuItem" game="' + element.name + '" style="background-image: url(' + element.icon + ');background-size: cover;background-position: center;background-repeat: no-repeat;" id="' + element.div + '"><div style="margin-top: 250px;" class="title">Start</div></div>')
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
    $(".content").css("opacity", "1")
    clearTimeout(fadeOutTimerID);
    fadeOutTimerID = setTimeout(() => {
        $(".content").css("opacity", "0")
    }, 20000);
}

function fadeOutMenu(cb) {
    $(".allContent").animate({
        opacity: 0
    }, 30, () => {
        setTimeout(() => {
            $(".allContent").css("transform", "scale(1)")

        }, 400);
    })
    $(".allContent").css("transform", "scale(0.9)")

    setTimeout(() => {
        cb(true);
    }, 700);
}

function fadeInMenu(cb) {
    $(".allContent").css("transform", "scale(0.9)")
    setTimeout(() => {


        $(".allContent").animate({
            opacity: 1
        }, 30)
        $(".allContent").css("transform", "scale(1)")
    }, 400);

    setTimeout(() => {
        cb(true);
    }, 700);
}

function nextMenuSoundPlay() {
    var audio = new Audio('sounds/MenuMoveSound.mp3');
    audio.play();
}



function GameOpenSound() {
    var audio = new Audio('sounds/GameOpenSound.mp3');
    audio.play();
}