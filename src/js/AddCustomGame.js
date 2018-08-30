let customGameBackgroundImages = [],
    customGameIcon;




function customGameIconButton(){

    var chooserIcon = $("#locateIcon")

    chooserIcon.on("change", function (evt) {
        chooserIcon.unbind('change')

        let location = this.value;
        if (location.trim() == ""){
            return
        }
        location = location.replace(/\\/g, "/");
    
        customGameIcon = ("'file://"+addImage(location) + "'").replace(/\\/g, "/");
        $(".gameArt").css("background-image", "url('file://"+location+"')")
        chooserIcon.replaceWith(chooserIcon.val('').clone(true));

    });
    chooserIcon.click();

}


function customGamebackgroundButton() {
    if (customGameBackgroundImages.length >= 5) {
        return
    }
    var chooserBG = $("#locateImages")

    chooserBG.on("change", function (evt) {
        chooserBG.unbind('change')
        let location = this.value;
        if (location.trim() == "") {
            return
        }
        location = location.replace(/\\/g, "/");

        customGameBackgroundImages.push(("file://" + addImage(location)).replace(/\\/g, "/"));


        $("#image" + (customGameBackgroundImages.length - 1)).css("background-image", "url('file://" + location + "')")
        $("#image" + (customGameBackgroundImages.length - 1)).html("<div class='text' onclick='removeImage(" + (customGameBackgroundImages.length - 1) + ")' >X</div>");
        $(".currentAddedGamesTotal").text("(" + customGameBackgroundImages.length + "/5)");
        chooserBG.replaceWith(chooserBG.val('').clone(true));


    });
    chooserBG.click();
}




function removeImage(index){

    removeAnElement(customGameBackgroundImages, index + 1)
    $(".currentAddedGamesTotal").text("("+ customGameBackgroundImages.length + "/5)");
    resortImages()

}

function removeAnElement( array, index ) {
    index--;

    if ( index === -1 ) {
        return array.shift();
    } else {
        return array.splice( index, 1 );
    }
}
function resortImages(){
    $(".image").css("background-image", "none")
    $(".image").html("");
    
    for (let index = 0; index < customGameBackgroundImages.length; index++) {
        const element = customGameBackgroundImages[index];

        $("#image" + index).css("background-image", "url('file://"+element+"')")
        $("#image" + index).html("<div class='text' onclick='removeImage("+(index)+")' >X</div>");
    }
}
function addCustomGame() {
    let customGameName = $(".customName").val(),
        customGameDescription = $(".customDesc").val();


    addGame(customGameName, customGameIcon, customGameBackgroundImages, customGameDescription, $("#location").val());
    closeMenu('add-custom-game');
}