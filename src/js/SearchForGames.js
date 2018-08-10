$(".searchGameBox").on("keyup", function (e) {
    let text = $(this).val();
    let append = "";

    if (text.trim() == ""){
        $(".gameSearchList").hide();
        return;
    }

    for (let field in jsonGamesList) {
        if (field.toLowerCase().includes(text.toLowerCase())) {
            $(".gameSearchList").show();
            append += '<div class="gameSearchItem" onclick="clickedSearchItem(this);"><div class="gameSearchIcon" style="background-image: url('+jsonGamesList[field].logo+')"></div><div class="gameSeachTitle">'+field+'</div></div>'
        }
    }
    if (append == ""){
        $(".gameSearchList").hide();
    }


    $(".gameSearchList").html(append)
});

function clickedSearchItem(div){
    let game = $(div)[0].children[1].innerText
    let json = jsonGamesList[game]
    $(".gameSearchItem").remove();
    addGame(game, json.logo, json.background, json.description, $("#location").val())
    $(".detectFailPopOut").fadeOut();
}