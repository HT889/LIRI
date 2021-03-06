require("dotenv").config();
var fs = require("fs");
var AsciiTable = require('ascii-table')

var keys = require("./keys.js");
var axios = require("axios");


const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

var moment = require("moment");

var action = process.argv[2];
var parameter = process.argv.slice(3).join(" ");
// console.log(action);


function liri() {
switch (action) {
  case "concert-this":
    concertThis();
    break;
  
  case "spotify-this-song":
    spotifyThis();
    break;

  case "movie-this":
      movieThis();
      break;

  case "do-what-it-says":
      doWhatItSays();
      break;
};
}
liri();
//CONCERT THIS
function concertThis() {
  parameter = parameter.slice(1, parameter.length-1);
  // console.log(parameter);
  let queryUrl = `https://rest.bandsintown.com/artists/${parameter}/events?app_id=codingbootcamp`;
  // console.log("q", queryUrl);
  axios.get(queryUrl).then(function (response) {
    // console.log(response.data[0]);
    console.log(`Venue:", response.data[0].venue.name`);
    console.log("Location:", response.data[0].venue.city +",", response.data[0].venue.country);
    console.log("Date:", moment(response.data[0].datetime).format("MMM Do YYYY"));
  }).catch(function (err) {
    console.log(`

Sorry! No upcoming concerts detected.
`);
    console.log()
  }) 
}
//SPOTIFY THIS
function spotifyThis() {


spotify.search({ type: 'track', query: parameter, limit: 3 })
  .then(function(response) {
    for (let i = 0; i < response.tracks.items.length; i++) {
      console.log("\n");
      console.log("-------------------------------------------------");
      console.log("Artist:", response.tracks.items[i].artists[0].name);
      console.log("Track:", response.tracks.items[i].name)
      console.log("Preview:", response.tracks.items[i].preview_url);
      console.log("Album Name:", response.tracks.items[i].album.name);
      console.log("-------------------------------------------------");
      console.log("\n");
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}
//MOVIE THIS
function movieThis() {
  let queryUrl = `http://www.omdbapi.com/?t=${parameter}&apikey=trilogy`;

  axios.get(queryUrl).then(function (response) {
    var table = new AsciiTable(response.data.Title);
    var table2 = new AsciiTable();

    table.setHeading('Year', 'IMDB Rating', 'Rotten Tomatoes', 'Produced In', 'Languages').addRow(response.data.Year, response.data.imdbRating, response.data.Ratings[1].Value, response.data.Country, response.data.Language);
    table2.setHeading('Actors').addRow(response.data.Actors);

    console.log(table.toString());
    console.log("\n");
    console.log(table2.toString());
    console.log("\n");
    console.log(response.data.Plot);
    console.log("\n");
  }).catch(function (err) {
    console.log(err);
  })
}

function doWhatItSays () {
fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }

  var dataArr = data.split(",");
  parameter = dataArr[1];
  action = dataArr[0];
  liri();

});
}