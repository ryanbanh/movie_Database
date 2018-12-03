require('dotenv').config();

var express = require("express");
var app = express ();
var request = require("request");
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))


var genres = {'12': 'Adventure',
              '14': 'Fantasy',
              '16': 'Animation',
              '18': 'Drama',
              '27': 'Horror',
              '28': 'Action',
              '35': 'Comedy',
              '36': 'History',
              '37': 'Western',
              '53': 'Thriller',
              '80': 'Crime',
              '99': 'Documentary',
              '878': 'Science Fiction',
              '9648': 'Mystery',
              '10402': 'Music',
              '10749': 'Romance',
              '10751': 'Family',
              '10752': 'War',
              '10770': 'TV Movie' }
              
app.get("/", function(req, res){
    res.render("search", {genres: genres})
})              

  
app.get("/movies", function(req, res){
    var query = req.query.search;
    var genreFilter = parseInt(req.query.genre);
    var yearFilter = parseInt(req.query.year);
    var moviesUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + process.env.MOVIEDB_API_KEY+ "&query=" + query
    
    request(moviesUrl, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body)
            res.render("movies", {data: data, genreFilter: genreFilter, yearFilter:yearFilter, query:query, genres: genres});
        }
    })
})

app.get("/:id/:movietitle", function(req,res){
    var movieId = req.params.id;
    var reviewUrl = "http://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=" + process.env.MOVIEDB_API_KEY
    var movieTitle = req.params.movietitle;
    var actorUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" +  process.env.MOVIEDB_API_KEY + "&append_to_response=credits"
    var result = {};
    
        request(actorUrl, function(error, response, body){
            if(!error && response.statusCode == 200){
                var data = JSON.parse(body);
                for (var key in data){
                result[key] = data[key];
                }
            }
        request(reviewUrl, function(error, response, body){
            if(!error && response.statusCode == 200){
                var data = JSON.parse(body);
                for (var key in data){
                result[key] = data[key];
            }
            res.render("show", {data:result, title:movieTitle})
            }
        })
            
        })

})

app.listen(process.env.PORT, process.env.IP);