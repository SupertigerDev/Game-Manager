var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;

function browseButton() {
    let chosenLocation = dialog.showOpenDialog({
        properties: ['openFile']
    })

    if (chosenLocation) {
        $("#location").val(chosenLocation)
    }
}