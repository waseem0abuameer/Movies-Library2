'user strict'
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const movies = require("./Movie Data/data.json")
const app = express();
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
app.get('/', DataMovieHandler);
app.get('/favorite', FavoriteMovieHandler);
app.get('/trending', trendingMovieHandler);
app.get('/search', searchMovieHandler);
app.get('/upcoming', upcomingMovieHandler);
app.get('/toprated', ratedMovieHandler);
app.use('*', wrongHandler);
app.use('/', notfoundHandler);
//app.use(errorHandler);

function MovieData(id, title, poster_path, overview) {
    this.id = id;
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

function trendingMovieHandler(req, res) {
    let Tmovie = [];
    let respons = axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let onemovie = new MovieData(value.id, value.title, value.poster_path, value.overview)
                Tmovie.push(onemovie);
            });
            return res.status(200).json(Tmovie);
        }).catch(error => {
            errorHandler();
        });
}


function searchMovieHandler(req, res) {
    let Tmovie = [];
    const search = req.query.Tmovie;

    let respons = axios.get(` https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${search}`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let onemovie = new MovieData(value.id || 'N\A', value.title || ' ', value.poster_path || ' ', value.overview || ' ')
                Tmovie.push(onemovie);
            });
            return res.status(200).json(Tmovie);
        }).catch(error => {
            errorHandler();
        });
}

function ratedMovieHandler(req, res) {
    let Tmovie = [];
    let respons = axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&query=The&page=2`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let onemovie = new MovieData(value.id, value.title, value.poster_path, value.overview)
                Tmovie.push(onemovie);
            });
            return res.status(200).json(Tmovie);
        }).catch(error => {
            errorHandler();
        });
}

function upcomingMovieHandler(req, res) {
    let Tmovie = [];
    let respons = axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&language=en-US&query=The&page=2`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let onemovie = new MovieData(value.id, value.title, value.poster_path, value.overview)
                Tmovie.push(onemovie);
            });
            return res.status(200).json(Tmovie);
        }).catch(error => {
            errorHandler();
        });
}

function FavoriteMovieHandler(req, res) {
    return res.send("Welcome to Favorite Page");
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error
    }
    res.status(500).send(err);
}

function wrongHandler(req, res) {
    return res.status(500).send("Sorry, something went wrong")
}

function notfoundHandler(req, res) {
    return res.status(404).send("not found")
}
app.listen(PORT, () => {
    console.log(`Listen ${PORT}`);
});