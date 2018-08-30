function appendMenu(id,Title, Menu, fade, center, contWidth, contHeight, inWidth, inHeight){


    if($("#menu"+id).length) {
        console.log("menu Exists!")
        return;
    }
    if (center){
        var global = $("<div class='global' style='text-align:center;' id='menu"+id+"'></div>");
    }else{
        var global = $("<div class='global' id='menu"+id+"'></div>");
    }

    var globalContainer = $("<div class='globalContainer' style='height: "+contHeight +"px; width: "+contWidth+"px;' ></div>");
    var globalTitle = $("<div class='addGameTitle'>"+Title+"</div>");
    var globalInner =  $("<div class='globalInner' style='height: "+inHeight+"px; width: "+inWidth +"px;' ></div>");

    var containerAppend = $(globalContainer).append(globalTitle);

    var innerAppend = $(globalInner).append(Menu);

    var total = containerAppend.append(innerAppend);
    var final = global.html(total);

    $("body").append(final)
    if (fade){
        $("#menu"+id).fadeIn();
    }else{
        $("#menu"+id).show();
    }
}

function closeMenu(id, Fade){
    if (Fade){
        $("#menu"+id).fadeOut(300, function(){
            $("#menu"+id).remove();
        });
    }else{
        $("#menu"+id).hide();
        $("#menu"+id).remove();
    }
}
function hideMenu(id, Fade){
    if (Fade){
        $("#menu"+id).fadeOut(300, function(){
        });
    }else{
        $("#menu"+id).hide();
    }
}
function showMenu(id, Fade){
    if (Fade){
        $("#menu"+id).fadeIn(300, function(){
        });
    }else{
        $("#menu"+id).show();
    }
}
function somethingWrong(message){
    content = '<p>'+message+'</p><div class="button" onclick="closeMenu(\'something-went-wrong\', true); currentScreen = \'homeScreen\'">OK :(</div>'
    appendMenu("something-went-wrong","Something Went Wrong", content, true,true,583, 252,498, 139)
}
