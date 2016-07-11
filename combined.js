var request = require('request');
var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');

function saveData(_data, _code) {
    var d = new Date();
    fs.writeFile("data/" + _code + "-" + d.getMonth() + d.getDate() + d.getFullYear() + ".json", JSON.stringify(_data), function() {
        console.log("data saved.");
    });
}

function processGeoTable(_data, _regions, _code) {
    var newRegions = [["code","name","value"]];
    for (var i = 0; i < _regions.length; i++) {
        var arr = [];
        for (var key in _regions[i]) {
            if (key ==  "value"){
                arr.push(_regions[i][key].replace(/[^0-9]+/g, ""));
            } else if (key == "name") {
                var n = _regions[i][key].replace(/ *\([^)]*\) */g, "");
                n = n.replace("\n", "");
                arr.push(n);
            } else {
                var codestr = _regions[i][key];
                arr.push(codestr.substring(codestr.lastIndexOf("geo=")+4, codestr.lastIndexOf("&date")));
            }
        }
        console.log(i, arr);
        newRegions.push(arr);
        if (i == _regions.length-1) {
            _data["regions"] = newRegions;
            saveData(_data, _code);
        }
    }
}


function geoTable(_data, _topic, _code) {
    x('http://www.google.com/trends/fetchComponent?hl=en-US&q=' + encodeURIComponent(_topic) + '&geo=' + _code + '&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=GEO_MAP_0_0&export=0', 'tr', [{
        code: 'a@href',
        name: 'a',
        value: '.trends-hbars-value'
    }])(function(err, res) {
        // console.log(res);
        processGeoTable(_data, res, _code);
    })
}

function timeGraphTable(_data, _topic, _code) {
    request('http://www.google.com/trends/fetchComponent?hl=en-US&q=' + encodeURIComponent(_topic) + '&geo=' + _code + '&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=TIMESERIES_GRAPH_0&export=3', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var timeArr = body.split('"f"');
            // console.log(timeArr);
            var timegraph = [];
            for (var i = 0; i < timeArr.length; i++) {
                if (i % 2 == 1) {
                    timeArr[i] = timeArr[i].slice(2, -1);
                    timeArr[i] = timeArr[i].split('"},{"v":');
                    var obj = {
                        "date": timeArr[i][0],
                        "value": parseFloat(timeArr[i][1])
                    }
                    timegraph.push(obj);
                }
            }
            console.log(timegraph);
            _data["timegraph"] = timegraph;
            var d = new Date();
            _data["date"] = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
            geoTable(_data, _topic, _code);
        }
    });
}

function topTopic(_country, _name, _code) {
    var data = {};
    request('http://www.google.com/trends/hottrends/visualize/internal/data', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(JSON.parse(body));
            var topic = JSON.parse(body)[_country][0] + "";
            data["country"] = _country;
            data["countrycode"] = _code;
            data["countryname"] = _name;
            data["topic"] = topic;
            // Problem with partial unicode for RO
            if (_code == "JP" || "HK") {
                var newtopic = topic.split("\\u")[0];
                topic = newtopic;
            }
            timeGraphTable(data, topic, _code);
        }
    });
}

// topTopic("australia", "Australia","AU");
// topTopic("argentina", "Argentina","AR");
// topTopic("brazil", "Brazil","BR");
// topTopic("chile", "Chile","CI");
// topTopic("hong_kong", "China","HK");
// topTopic("japan", "Japan","JP");
// topTopic("romania", "Romania","RO");
// topTopic("singapore", "Singapore","SG");
// topTopic("turkey", "Turkey","TR");
topTopic("united_states", "United States", "US");
// topTopic("united_kingdom", "United Kingdom","GB");







