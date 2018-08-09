var elerem = require('electron').remote;
var dialog = elerem.dialog;





function browseButton() {
    $(".noticePopOut").fadeIn();



}

function understoodButton() {
    var found = false;
    $(".noticePopOut").fadeOut();
    let chosenLocation = dialog.showOpenDialog({
        properties: ['openFile']
    })

    if (chosenLocation) {
        $("#location").val(chosenLocation)


        for (var gameName in jsonGamesList) {
            for (var i in jsonGamesList[gameName].names){

                if (jsonGamesList[gameName].names[i] == path.parse(chosenLocation[0]).name){
                    found = true;
                    addGame(gameName,jsonGamesList[gameName].logo,jsonGamesList[gameName].background,jsonGamesList[gameName].description ,chosenLocation[0])
                    break;
                }
            }
        }
        if (found ==  false){
            AddToNotificationQueue("Game not found",  "Your game could not be found.")
            $(".detectFailPopOut").fadeIn();
            $(".addGame").fadeOut();
        }

    }
}
function addGame(name, icon, backgroundArr,description ,path) {

    if (gameExists(name)){
        $(".addGame").fadeOut();
        AddToNotificationQueue("Game exists", name + " already exists! Try reopening Game Manager if you dont see your game.")
        return;
    }
    let gameID = "game-" + gameIDGenerator()
    totalMenus.push({
        div: gameID,
        name: name,
        icon: icon,
        background: backgroundArr,
        description: description,
        path: path,

    })
    store.set("gamesList", totalMenus)
    AddToNotificationQueue("Game Found", name + " has been found!")
    $(".addGame").fadeOut();
    $(".menuItems").append('<div class="menuItem" game="'+name+'" style="background-image: url('+icon+');background-size: 100%;background-position: center;background-repeat: no-repeat;" id="'+gameID+'"><div style="margin-top: 300px;" class="title">Start</div></div>')
}

function gameIDGenerator(){
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

function gameExists(name){
for (let index = 0; index < totalMenus.length; index++) {
    if (totalMenus[index].name == name){
        return true;
    }
}
    return false;
}