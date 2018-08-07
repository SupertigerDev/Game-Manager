doDate();
function doDate()
{
    var str = "";

    var now = new Date();

    let minutes = now.getMinutes()
    let hours = now.getHours();
    
    if (minutes <= 9){
        minutes =   "0" + minutes.toString();
    }
    if (hours <= 9){
        hours =   "0" + hours.toString();
    }

    str = hours +":" + minutes;
    $(".time").text(str)
}

setInterval(doDate, 60000);