// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");

// all your routes here

//GET route to display the form which allows for the creation of a new celebrity
router.get('/celebrities/create', (req, res) => res.render('celebrities/new-celebrity'));

//POST route to create a celebrity using data submited via form
router.post('/celebrities/create', (req, res, next) => {
    console.log('New celebritity added via online form:', req.body);
    const { name, occupation, catchPhrase } = req.body; // by using destructuring here, we are creating separate variables with the information coming from the form
    // the same as:
    // const name = req.body.name;
    // const occupation = req.body.occupation;
    // const catchPhrase = req.body.catchPhrase;

    Celebrity.findOne({ name })
        .then((aCelebFromDb) => {
            if (!aCelebFromDb) {
                Celebrity.create({ name, occupation, catchPhrase })
                    .then(() => res.redirect("/celebrities"));
                    console.log('New celebrity successfully added to database.')
            } 
            else {
                res.render("celebrities/new-celebrity", {
                message: "This celebrity already exists in the database."
                });
                console.log('The celebrity has not been added to the database. Celebrity already exists.');
                return;
            }
        })
        .catch(error => {
            console.log('Error while creating new celebrity: ', error);
            next(error);
        });
  });

//GET route to display a list of all celebrities
router.get('/celebrities', (req, res, next) => {
    Celebrity.find()
        .then((allCelebsFromDb) => {
            res.render('celebrities/celebrities', { allCelebsFromDb })
            console.log(`There are currently ${allCelebsFromDb.length} celebrities in the database.`);
            console.log(`The ${allCelebsFromDb.length} celebrities in the database are:`, allCelebsFromDb);
        })
        .catch(error => {
            console.log('Error while displaying list of all celebrities: ', error);
            next(error);
        });
});

//BONUS route
//GET route to display a specific celebrity on the celebrity-details page
router.get('/celebrities/:celebrityId', (req, res, next) => {
    const { celebrityId } = req.params;

    Celebrity.findById(celebrityId)
        .then(foundCelebrity => res.render('celebrities/celebrity-details', { foundCelebrity }))
        .catch(error => {
            console.log('Error while retrieving celebrity details: ', error);
            next(error);
        });
});

//BONUS route
//POST route to remove a specific movie from the database
router.post('/celebrities/:celebrityId/delete', (req, res, next) => {
    const { celebrityId } = req.params;

    Celebrity.findByIdAndRemove(celebrityId)
        .then(() => res.redirect('/celebrities'))
        .catch(error => {
            console.log('Error while removing celebrity: ', error);
            next(error);
        });
});

//BONUS route
//GET route to find the celebrity we would like to edit in the database
//Show a pre-filled form to update a celebrity's info
router.get('/celebrities/:celebrityId/edit', (req, res, next) => {
    const { celebrityId } = req.params;

    Celebrity.findById(celebrityId)
        .then((foundCelebrity) => res.render('celebrities/edit-celebrity', { foundCelebrity }))
        .catch(error => {
            console.log('Error while updating celebrity: ', error);
            next(error);
        });
});

//BOUNS route
//POST to submit the form to update the celebrity in the database
//Save the updated celebrity to the database
router.post('/celebrities/:celebrityId/edit', (req, res, next) => {
    const { celebrityId } = req.params;
    const { name, occupation, catchPhrase } = req.body;

    Celebrity.findByIdAndUpdate(celebrityId, { name, occupation, catchPhrase })
        .then((foundCelebrity) => {
            console.log(foundCelebrity);
            res.redirect(`/celebrities/${foundCelebrity._id}`)
        })
        .catch(error => {
            console.log('Error while updating movie: ', error);
            next(error);
        });
});

module.exports = router;