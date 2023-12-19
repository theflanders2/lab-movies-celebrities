// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// all your routes here

//GET route to show a form to create a movie and pass all celebrities to page so they can be listed as cast members
router.get('/movies/create', (req, res) => {
    Celebrity.find()
        .then((allCelebsFromDb) => {
            res.render('movies/new-movie', { allCelebsFromDb })
        })
        .catch(error => {
            console.log('Error while showing form to create a new movie: ', error);
            next(error);
        });
});

//POST route to send the data from the form to this route to create the movie and save it to the database
router.post('/movies/create', (req, res, next) => {
    const { title, genre, plot, cast } = req.body // by using destructuring here, we are creating separate variables with the information coming from the form
    // the same as:
    // const title = req.body.title;
    // const genre = req.body.genre;
    // const plot = req.body.plot;
    // const cast = req.body.cast;

    Movie.findOne({ title })
        .then((aMovieFromDb) => {
            if (!aMovieFromDb) {
                Movie.create({ title, genre, plot, cast })
                    .then(() => res.redirect("/movies/movies"));
                    console.log('New movie successfully added to database.')
            } 
            else {
                res.render("movies/new-movie", {
                message: "This movie already exists in the database."
                });
                console.log('The movie has not been added. The movie already exists in the database.');
                return;
            }
        })
        .catch(error => {
            console.log('Error while sending data from form to route /movies/movies: ', error);
            next(error);
        });
  });

//GET route to display a list of all movies
router.get('/movies/movies', (req, res, next) => {
    Movie.find()
        .then((allMoviesFromDb) => {
            res.render('movies/movies', { allMoviesFromDb })
            console.log(`There are currently ${allMoviesFromDb.length} movies in the database.`);
            console.log(`The ${allMoviesFromDb.length} movies in the database are:`, allMoviesFromDb);
        })
        .catch(error => {
            console.log('Error while displaying list of movies: ', error);
            next(error);
        });
});

//GET route to display a specific movie on the movie-details page
router.get('/movies/:movieId', (req, res, next) => {
    const { movieId } = req.params;

    Movie.findById(movieId)
        .populate('cast')
        .then(foundMovie => res.render('movies/movie-details', { foundMovie }))
        .catch(error => {
            console.log('Error while retrieving movie details: ', error);
            next(error);
        });
});

//POST route to remove a specific movie from the database
router.post('/movies/:movieId/delete', (req, res, next) => {
    const { movieId } = req.params;

    Movie.findByIdAndRemove(movieId)
        .then(() => res.redirect('/movies/movies'))
        .catch(error => {
            console.log('Error while removing movie: ', error);
            next(error);
        });
});

//GET route to find the movie we would like to edit in the database
//Show a pre-filled form to update a movie
router.get('/movies/:movieId/edit', (req, res, next) => {
    const { movieId } = req.params;

    Movie.findById(movieId)
        .then((foundMovie) => {
            Celebrity.find()
                .then((allCelebsFromDb) => {
                    res.render('movies/edit-movie', { foundMovie, allCelebsFromDb });
                })
                .catch(error => {
                    console.log('Error while updating movie: ', error);
                    next(error);
                });
        })
        .catch(error => {
            console.log('Error while updating movie: ', error);
            next(error);
        });
});

//POST to submit the form to update the movie in the database
//Save the updated movie to the database
router.post('/movies/:movieId/edit', (req, res, next) => {
    const { movieId } = req.params;
    const { title, genre, plot, cast } = req.body;

    Movie.findByIdAndUpdate(movieId, { title, genre, plot, cast })
        .then((foundMovie) => {
            console.log(foundMovie);
            res.redirect(`/movies/${foundMovie._id}`)
        })
        .catch(error => {
            console.log('Error while updating movie: ', error);
            next(error);
        });
});

module.exports = router;