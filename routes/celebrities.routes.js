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
                message: "This celebrity is already exists in the database.",
                });
                console.log('The celebrity has not been added. The celebrity already exists in the database.');
                return;
            }
        })
        .catch((error) => next(error));
  });

//GET route to display a list of all celebrities
router.get('/celebrities', (req, res, next) => {
    Celebrity.find()
        .then((allCelebsFromDb) => {
            res.render('celebrities/celebrities.hbs', { allCelebsFromDb })
            console.log(`There are currently ${allCelebsFromDb.length} celebrities in the database.`);
            console.log(`The ${allCelebsFromDb.length} celebrities in the database are:`, allCelebsFromDb);
        })
        .catch((error) => next(error));
});

module.exports = router;