DROP TABLE IF EXISTS TMovies;

CREATE TABLE IF NOT EXISTS TMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(255)
);
