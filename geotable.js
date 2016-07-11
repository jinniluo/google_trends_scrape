var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');

function saveData(_data) {
    fs.writeFile("data/" + Date.now() + ".json", JSON.stringify(_data), function() {
        console.log("data saved.");
    });
}

function prepareData(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var key in arr[i]) {
            if (key ==  "value"){
                arr[i][key] = arr[i][key].replace(/[^0-9]+/g, "");
            } else if (key == "name") {
                arr[i][key] = arr[i][key].replace(/ *\([^)]*\) */g, "");
                arr[i][key] = arr[i][key].replace("\n", "");
            } else {
                var str = arr[i][key];
                arr[i][key] = str.substring(str.lastIndexOf("geo=")+4,str.lastIndexOf("&date"));
            }
            console.log(i, arr[i][key]);
        }
    }
    saveData(arr);
}

x('http://www.google.com/trends/fetchComponent?hl=en-US&q=euro%202016&geo=JP&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=GEO_MAP_0_0&export=0', 'tr', [{
  name: 'a',
  code: 'a@href',
  value: '.trends-hbars-value'
}])(function(err, data){
    console.log(data);
    prepareData(data);
})