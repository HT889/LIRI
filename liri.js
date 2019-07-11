require("dotenv").config();
var AsciiTable = require('ascii-table')

var keys = require("./keys.js");
var axios = require("axios");


const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

var moment = require("moment");

const action = process.argv[2];

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
};

function concertThis() {
  const artistName = process.argv.slice(3).join(" ");

  let queryUrl = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`;
  // console.log(queryUrl);
  axios.get(queryUrl).then(function (response) {
    console.log(response.data);

  }).catch(function (err) {
    console.log(err);
  }) 
}


function spotifyThis() {

  const query = process.argv.slice(3).join(" ");
  console.log(query);

spotify.search({ type: 'track', query: query, limit: 3 })
  .then(function(response) {
    for (let i = 0; i < response.tracks.items.length; i++) {
      console.log("-------------------------------------------------");
      console.log("Track:", response.tracks.items[i].name)
      console.log("Preview:", response.tracks.items[i].preview_url);
      console.log("Album Name:", response.tracks.items[i].album.name);
      console.log("-------------------------------------------------");
      console.log("\n");
    }
    // console.log(response.tracks);
    // console.log(response.tracks.items[0].name);
    // console.log(response.tracks.items[0].preview_url);
    // console.log(response.tracks.items[0].album.name)
  })
  .catch(function(err) {
    console.log(err);
  });
}

function movieThis() {
  const movieName = process.argv[3];
  let queryUrl = `http://www.omdbapi.com/?t=${movieName}&apikey=trilogy`;

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