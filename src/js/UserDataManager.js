const fs = require("fs")

function saveSettings(name, settings, callback) {
    var file = 'game-data.json';
    var filePath = path.join(nw.App.dataPath, file);
    fs.writeFile(filePath, JSON.stringify({[name]:settings}), function (err) {
        if (err) {
            console.info("There was an error attempting to save your data.");
            console.warn(err.message);
            return;
        } else if (callback) {
            callback();
        }
    });
}

function getSettings(name ,callback) {
    var file = 'game-data.json';
    var filePath = path.join(nw.App.dataPath, file);
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.info("There was an error attempting to get your data.");
            console.warn(err.message);
            callback(undefined);
            return;
        } else {
            callback(JSON.parse(data)[name]);

        }
    });
}

function addImage(imageLocation){
    let fpath = nw.App.dataPath + "/gameData";
    let id = randomID();

    if (!fs.existsSync(fpath)){
        fs.mkdirSync(fpath);
    }

    fs.createReadStream(imageLocation).pipe(fs.createWriteStream(fpath + "/"+ id + path.extname(imageLocation) ));
    return fpath + "/" + id + path.extname(imageLocation);

}

function randomID() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}
