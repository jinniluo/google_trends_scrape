var request = require('request');
var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');
var data = {};

function timeGraphTable() {
    request('http://www.google.com/trends/fetchComponent?hl=en-US&q=CNN&geo=US&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=TIMESERIES_GRAPH_0&export=3', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            console.log("type", typeof body);

            var json = body.substring(body.lastIndexOf("setResponse(")+12 , body.length-2);
            console.log(json);
            // console(JSON.parse(json));
        }
    });
}

timeGraphTable();