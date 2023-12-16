const Celebrity = require("../models/Celebrity.model");

// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here

//GET route to display the form which allows for the creation of a new celebrity
router.get('/celebrites/create', (req, res, next) => {
    res.render('celebrities/new-celebrity')
});

//POST route to create a celebrity using data submited via form
router.post("/celebrities/create", (req, res) => {
    const { name, occupation, catchPhrase } = req.body;

    Celebrity.findOne({ name })
        .then((celebFromDb) => {
            if (!celebFromDb) {
                Celebrity.create({ name, occupation, catchPhrase })
                    .then(() =>
                    res.redirect("/celebrities")
                    );
            } 
            else {
                res.render("celebrities/new-celebrity", {
                message: "Celebrity is already registered",
                });
                return;
            }
        })
        .catch((err) =>
            console.log(`Error while creating new celebrity: ${err}`)
        );
  });

  //GET route to display a list of all celebrities
router.get('/celebrities', (req, res, next) => {
    Celebrity.find()
        .then((celebsFromDb) => {
            res.render('celebrities/celebrities.hbs', { celebrities: celebsFromDb })
        })
        .catch((err) =>
            console.log(`Error while getting celebrities from the database: ${err}`)
        );
});

module.exports = router;