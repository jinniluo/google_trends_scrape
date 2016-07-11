var request = require('request');
var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');
var data = {};

function timeGraphTable() {
    request('http://www.google.com/trends/fetchComponent?hl=en-US&q=CNN&geo=US&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=TIMESERIES_GRAPH_0&export=3', function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {

            var newArr = body.split('"f"');
            // console.log(newArr);
            var dataNew = [];
            for (var i = 0; i < newArr.length; i++) {
                if (i % 2 == 1) {
                    newArr[i] = newArr[i].slice(2, -1);
                    newArr[i] = newArr[i].split('"},{"v":');
                    var obj = {
                        "date": newArr[i][0],
                        "value": parseFloat(newArr[i][1])
                    }
                    dataNew.push(obj);
                }
            }
            console.log(dataNew);

        }
    });
}

timeGraphTable();
