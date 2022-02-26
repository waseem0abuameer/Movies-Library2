'user strict'
const express = require("express");
const movies = require("./Movie Data/data.json")
const app = express();
app.get('/', DataMovieHandler);
app.get('/favorite', FavoriteMovieHandler);
app.use('*', wrongHandler);
app.use('/', notfoundHandler);

function MovieData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function DataMovieHandler(req, res) {
    let movie = [];
    movies.data.map((value, index) => {
        let onemovie = new MovieData(value.title, value.poster_path, value.overview)
        movie.push(onemovie);
    });
    return res.status(200).json(movie);
}

function FavoriteMovieHandler(req, res) {
    return res.send("Welcome to Favorite Page");
}

function wrongHandler(req, res) {
    return res.status(500).send("Sorry, something went wrong")
}

function notfoundHandler(req, res) {
    return res.status(404).send("not found")
}
app.listen(3003, () => {
    console.log("Listen 3000 ");
});