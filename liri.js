var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var inquirer = require("inquirer");

var newStrArr = [];

var liri = function () {
    inquirer.prompt([
    {
        name: "liriFunc",
        message: "What to do today?",
        choices: ["Tweets", "Spotify", "OMDB", "random"],
        type: "list",
    }
    ]).then(function(answers) {
        picker(answers.liriFunc);
    });
};

picker = function (input) {
    if (input === "Tweets") {
        twitStart();
    } else if (input === "Spotify") {
        spotStart();
    } else if (input === "OMDB") {
        omdbStart();
    } else if (input === "random") {
        randomStart();
    }else {
        console.log("no search function exists yet");
    }
};

twitStart = function () {
    inquirer.prompt([
    {
        type: "confirm",
        name: "twit",
        message: "Would you like to read some tweets?"
    }
    ]).then(function(answers) {
        if (answers.twit) {
            //twitter API
            //console.log(answers.twit);
            var client = new Twitter(keys.t_key);
            //setup the twitter account and respnoses
            var params = {
                screen_name: "DankEngineGames",
                count: 20,
            };
            //run it through the API
            client.get("statuses/user_timeline", params, function(err, tweets, response){
                if(err){
                    console.log(err);
                } else {
                    for (i = 0; i < tweets.length; i++) {
                        console.log("\t Tweet: " + tweets[i].text);
                        console.log("\t Date: " + tweets[i].created_at);
                        console.log("\t ");
                    };
                    //log info
                    logger("tweets were called");
                    //go again?
                    again();
                };
            });
        } else {
            again();
        };
    });
};

spotStart = function () {
    inquirer.prompt([
    {
        type: "input",
        name: "spot",
        message: "What would you like to Spotify?"
    }
    ]).then(function(answers) {
        // answers.spot goes into spotify API
        //console.log(answers.spot);
        //convert to a 'nicer' variable
        var spotSearch = answers.spot;
        //pull the Key
        var spotify = new Spotify(keys.s_key);
        //catch a no song title error
        if (!spotSearch) {
            spotSearch = "the Sign Ace of Base";
        };
        //spotify API call
        spotify
        .search({
            type: 'track', 
            query: spotSearch
        })
        .then(function(spot) {
            console.log("\tSong Title: " + spot.tracks.items[0].name);
            console.log("\tArtist Name: " + spot.tracks.items[0].artists[0].name);
            console.log("\tSpotify Link: " + spot.tracks.items[0].artists[0].external_urls.spotify);
            console.log("\tAlbum Title: " + spot.tracks.items[0].album.name);
            //logging info to log.txt
            logger("Spotify Search: " + spotSearch);
            //go again?
            setTimeout(function(){ again(); }, 3000);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
};

omdbStart = function () {
    inquirer.prompt([
    {
        type: "input",
        name: "omdb",
        message: "What would you like to run through the OMDB?"
    }
    ]).then(function(answers) {
        // answers.omdb goes into omdb
        //console.log(answers.omdb);
        //convert to a 'nicer' variable
        var omdbSearch = answers.omdb;
        //catch a no movie title error
        if (!omdbSearch) {
            omdbSearch = "Mr Nobody";
        };
        //OMDB API
        var OMDBurl = "https://www.omdbapi.com/?t=" + omdbSearch + "&y=&plot=short&apikey=" + keys.o_key;
            request(OMDBurl, function(err, response, body){
                //catcher
                if (err) {
                    console.log(err);
                } else if (response.statusCode === 200) {
                    console.log("\tTitle: " + JSON.parse(body).Title);
                    console.log("\tRelease Year: " + JSON.parse(body).Year);
                    console.log("\tRated: " + JSON.parse(body).Rated);
                    console.log("\tCountry: " + JSON.parse(body).Country);
                    console.log("\tLanguage: " + JSON.parse(body).Language);
                    console.log("\tPlot: " + JSON.parse(body).Plot);
                    console.log("\tActors: " + JSON.parse(body).Actors);
                };
            });
        //logging info to log.txt
        logger("OMDB Search: " + omdbSearch);
        //go again?
        setTimeout(function(){ again(); }, 3000);
    });
};

randomStart = function () {
    fs.readFile("random.txt", "utf-8", function(err, data) {
		if (err) {
			return console.log(err);
        };
        //console.log(data);
        var newArr = data.split(",");
        var rnd = Math.floor(Math.random()*newArr.length);
        console.log(newArr[rnd]);
        picker(newArr[rnd]); //yes, I know this doesn't input the *actual* song from the random.txt, but my inquirer's are just too damn pretty to go back through and change everything
    });    
};

logger = function (data) {
    //console.log(input);
    data = data + "\n"
    fs.appendFile("logs.txt", data, function (err, data) {
        if (err) {
            return console.log(err);
        } 
    }
)};

again = function() {
    inquirer.prompt([
    {
        type: "confirm",
        name: "goagain",
        message: "Would you like go again?"
    }
    ]).then(function(answers) {
        //console.log(answers.goagain);
        if (answers.goagain) {
            liri();
        } else {
            return;
        };
    });
};

liri();