function browseButton() {
    chooseFile();

}


function addButton() {
    var found = false;
    let location = $("#location").val()
    if (location.trim() == "") {
        return;
    }

    for (var gameName in jsonGamesList) {
        for (var i in jsonGamesList[gameName].names) {

            if (jsonGamesList[gameName].names[i].toLowerCase() == path.parse(location).name.toLowerCase()) {
                found = true;
                addGame(gameName, jsonGamesList[gameName].logo, jsonGamesList[gameName].background, jsonGamesList[gameName].description, location)
                break;
            }
        }
    }
    if (found == false) {

        //$(".detectFailPopOut").show();
        hideMenu("add-game", false)
        content = '<p>Try finding it your self in the list or make your own.</p><div class="gamesList"><textarea class="searchGameBox" placeholder="Search game"></textarea><div class="gameSearchList"></div></div><div><div class="button" style="width: 100px;" onclick="hideMenu(\'detect-fail\', false);showCustomGame();">Make my own</div> <div class="button" onclick="closeMenu(\'detect-fail\', false);showMenu(\'add-game\')">Back</div></div>';
        appendMenu("detect-fail", "Game couldn't be detected", content, false, true, 583, 302, 498, 199)
        searchBoxEvent()

    }

}

function showCustomGame() {
    content = ' <p>Fill in the information below to add your game.</p> <div class="leftContainer"> <div style="padding-bottom: 20px;">Name <input type="text" class="customName" placeholder="Name of the game."> </div>Description<div> <textarea class="customDesc"style="width: 320px;height: 200px;" placeholder="Find some information about the game from Wikipedia or the game website."> </textarea> </div> </div> <div class="rightContainer">Add multiple background images <span class="currentAddedGamesTotal">(0/5)</span> <div class="added-images"> <div class="image" id="image0"> </div> <div class="image" id="image1"> </div> <div class="image" id="image2"> </div> <div class="image" id="image3"> </div> <div class="image" id="image4"> </div> </div> <input style="display:none;" id="locateImages" type="file" /> <div class="button" onclick="customGamebackgroundButton()">Browse</div> <center>Add a game icon</center> <div class="gameArt"> </div> <div style="margin: auto;display: table;" onclick="customGameIconButton()" class="button">Browse</div> <input style="display:none;" id="locateIcon" type="file" /> </div> <center> <div class="button" style="width: 76px;" onclick="addCustomGame()">Add Game</div> <div class="button" onclick="closeMenu(\'add-custom-game\');showMenu(\'detect-fail\', false);">Back</div> </center>'
    appendMenu("add-custom-game", "Add Own Game", content, false, false, 775,547 ,677, 444)

}

function addGame(name, icon, backgroundArr, description, path) {

    if (gameExists(name)) {
        closeMenu('add-game', true);
        currentScreen = 'homeScreen'
        AddToNotificationQueue("Game exists", name + " already exists! Try reopening Game Manager if you dont see your game.")
        return;
    }
    fadeOutIdle()
    let gameID = "game-" + gameIDGenerator()
    totalMenus.push({
        div: gameID,
        name: name,
        icon: icon,
        background: backgroundArr,
        description: description,
        path: path,

    })
    saveSettings("gameList", totalMenus, function () {
        console.log('Settings saved');
    });
    AddToNotificationQueue("Game Found", name + " has been found!")
    closeMenu('add-game', true);
    currentScreen = 'homeScreen'
    $(".menuItems").append('<div class="menuItem" game="' + name + '" style="background-image: url(' + icon + ');background-size: 100%;background-position: center;background-repeat: no-repeat;" id="' + gameID + '"><div style="margin-top: 250px;" class="title">Start</div></div>')
}

function gameIDGenerator() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

function gameExists(name) {
    for (let index = 0; index < totalMenus.length; index++) {
        if (totalMenus[index].name == name) {
            return true;
        }
    }
    return false;
}



function chooseFile() {
    var chooser = $("#LocateGame")


    chooser.on("change", function (evt) {
        if (this.value.trim() != "") {
            $("#location").val(this.value)
        }
        console.log("test")
        chooser.unbind('change')
    });
    chooser.click();


}