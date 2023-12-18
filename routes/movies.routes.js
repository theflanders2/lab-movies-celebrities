// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// all your routes here

//GET route to show a form to create a movie
router.get('/movies/create', (req, res) => {
    const allCelebsFromDb = Celebrity.find() //pass all the celebrities from database to form
    .then(() => res.render('movies/new-movie', { allCelebsFromDb }))
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
                message: "This movie already exists in the database.",
                });
                console.log('The movie has not been added. The movie already exists in the database.');
                return;
            }
        })
        .catch((error) => next(error));
  });
    
//     Movie.create({title, genre, plot, cast})
//         .then(() => {
//             res.redirect("/movies/movies")
//             console.log('New movie successfully added to database.')
//         })
//         .catch((error) => next(error));
// });

//GET route to display a list of all movies
router.get('/movies/movies', (req, res, next) => {
    Movie.find()
        .then((allMoviesFromDb) => {
            res.render('movies/movies.hbs', { allMoviesFromDb })
            console.log(`There are currently ${allMoviesFromDb.length} movies in the database.`);
            console.log(`The ${allMoviesFromDb.length} movies in the database are:`, allMoviesFromDb);
        })
        .catch((error) => next(error));
});


module.exports = router;