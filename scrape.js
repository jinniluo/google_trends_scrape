var request = require('request');
var scraperjs = require('scraperjs');
var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');
var data = {};

function saveData(_country) {
    fs.writeFile("data/" + _country + "-" + Date.now() + ".json", JSON.stringify(data), function() {
        console.log("data saved.");
    });
}

function parseHTML(_html, _country) {
    x(_html, 'tr', [{
            date: 'td:first-child',
            value: 'td:last-child',
        }])(function(err, res){
            if (err) throw err;
            console.log(res);
            data["timegraph"] = res;
            data["date"] = Date.now();
            saveData(_country);
        });
}

function timeGraphTable(_topic, _country) {
    console.log(_topic, _country);
    var url1 = "http://www.google.com/trends/fetchComponent?hl=en-US&q=" + encodeURIComponent(_topic) + "&geo=US&date=now%207-d&cmpt=q&tz=Etc/GMT%2B4&tz=Etc/GMT%2B4&content=1&cid=TIMESERIES_GRAPH_0&export=5&w=500&h=330";
    var url2 = "http://www.google.com/trends/explore#q=fourth+of+july&date=now+7-d&geo=US";
    scraperjs.DynamicScraper.create(url1)
        .scrape(function($) {
            return $("tbody").map(function() {
                return $(this).html();
            }).get();
        })
        .then(function(res) {
            console.log(res);
            parseHTML(res[0], _country);
        })
}

function topTopic(_country) {
    request('http://www.google.com/trends/hottrends/visualize/internal/data', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(JSON.parse(body));
            var topic = JSON.parse(body)[_country][0] + "";
            data["country"] = _country;
            data["topic"] = topic;
            timeGraphTable(topic, _country);
        }
    });
}

// topTopic("australia");
// topTopic("argentina");
// topTopic("brazil");
// topTopic("chile");
// topTopic("china");
// topTopic("japan");
// topTopic("romania");
// topTopic("singapore");
// topTopic("turkey");
topTopic("united_states");
// topTopic("united_kingdom");