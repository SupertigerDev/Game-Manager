const Store = require('electron-store');
const path = require('path')
const store = new Store();
var jsonGamesList;
var selectedItem;

var totalMenus = []

var currentlySwitchingTimeOut = false;
store.delete("gamesList")
if (typeof store.get("gamesList") == "undefined") {
    totalMenus.push({
        div: "addGameItem",
        name: "Add a game"
    })
    totalMenus.push({
        div: "settingsItem",
        name: "Settings"
    })
    store.set("gamesList", totalMenus)
} else {
    totalMenus = store.get("gamesList")
}

selectedItem = 0;
$(document).keydown(function (e) {


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
    if (totalMenus[selectedItem].name == "Settings") {
        title = totalMenus[selectedItem].name
        message = "Change settings such as themes, background and more."
    } else if (totalMenus[selectedItem].name == "Add a game") {
        title = totalMenus[selectedItem].name
        message = "To add a game, click on this icon and Choose an executable file."
    } else {
        title = totalMenus[selectedItem].name
        message = "No message"
    }

    $(".menuItemDetail").fadeOut(300, function () {
        $(".menuDetailTitle").text(title)
        $(".menuDetailMessage").text(message)
        $(".menuItemDetail").fadeIn(300)
    })
}

function openGame() {
    if (totalMenus[selectedItem].name == "Add a game") {

        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                jsonGamesList = JSON.parse(body)
                $(".addGame").fadeIn();
                console.log("Got a response ")
            } else {
                console.log("Got an error: ", error, ", status code: ", response.statusCode)
                $('.somethingWentWrongPopout').fadeIn()
            }
        })


    }
}