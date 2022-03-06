'user strict'
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const movies = require("./Movie Data/data.json")
const app = express();
const pg = require("pg");
dotenv.config();

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
app.use(express.json());
app.get('/', DataMovieHandler);
app.get('/favorite', FavoriteMovieHandler);
app.get('/trending', trendingMovieHandler);
app.get('/search', searchMovieHandler);
app.get('/upcoming', upcomingMovieHandler);
app.get('/toprated', ratedMovieHandler);
app.post('/addmovies', addMovieHandler);
app.get('/getmovies', getHandler);
app.get('/getbyid/:id', getbyidHandler);
app.put('/UPmovies/:id', UPmoviesHandler);
app.delete('/DEmovies/:id', DEMovieHandler);

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

function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO TMovies(title, poster_path, overview) VALUES($1, $2, $3) RETURNING *`;
    const values = [movie.title, movie.poster_path, movie.overview];
    client.query(sql, values).then((result) => {
        res.status(201).json(result.rows);
    }).catch((error) => {
        console.log(error);
        serverError(error, req, res);
    });
}

function getbyidHandler(req, res) {
    let id = req.params.id;
    const sql = `SELECT * FROM TMovies WHERE id = $1;`;
    const value = [id];
    client.query(sql, value).then((result) => { return res.status(200).json(result.rows[0]); })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function getHandler(req, res) {
    const sql = `SELECT * FROM TMovies`;

    client.query(sql).then((result) => { return res.status(200).json(result.rows); }).catch((error) => {
        serverError(error, req, res);
    })

}

function UPmoviesHandler(req, res) {
    const id = req.params.id;
    const m = req.body;

    const sql = `UPDATE TMovies SET title = $1,poster_path = $2, overview = $3 WHERE id = $4  RETURNING *;`;
    const values = [m.title, m.poster_path, m.overview, id];
    client.query(sql, values).then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function DEMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM TMovies WHERE id=$1;`;
    const values = [id];
    client
        .query(sql, values)
        .then(() => {
            return res.status(204).json({});
        })
        .catch((error) => {
            serverError(error, req, res);
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
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listen ${PORT}`);
    });
})