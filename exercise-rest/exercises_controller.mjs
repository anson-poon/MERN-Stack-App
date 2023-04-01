import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
import { body, oneOf, validationResult } from 'express-validator';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

/**
 * CREATE a new exercise with the name, reps, weight, unit, date provided in the body
 */
app.post('/exercises',
    body('name').isLength({min: 1}),
    body('reps').isInt({gt: 0}),
    body('weight').isInt({gt: 0}),
    oneOf([
        body('unit').equals('lbs'), 
        body('unit').equals('kgs'),
    ]),
    body('date').matches(/(^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d\d$)/),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ Error: "Invalid request"});
        }
        exercises.createExercise(
            req.body.name, 
            req.body.reps, 
            req.body.weight, 
            req.body.unit, 
            req.body.date,
        )
        .then (exercise => {
            res.status(201).json(exercise);
        })
        .catch (err => {
            console.error(err);
            res.status(400).json({ Error: "Invalid request"});
        });
    }
);

/**
 * RETRIEVE exercises. 
 * All exercises are returned.
 */
app.get('/exercises', (req, res) => {
    exercises.findExercises()
        .then(exercises => {
            res.json(exercises);
        })
        .catch(err => {
            console.error(err);
            res.status
        })
});

/**
 * RETRIEVE the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: "Not found"});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ Error: "Invalid request"});
        });
});

/**
 * UPDATE the exercise whose ID is provided in the path parameter and set
 * its name, reps, weight, unit, and date to the values provided in the body.
 */
app.put('/exercises/:_id', 
        body('name').isLength({min: 1}),
        body('reps').isInt({gt: 0}),
        body('weight').isInt({gt: 0}),
        oneOf([
            body('unit').equals('lbs'), 
            body('unit').equals('kgs'),
        ]),
        body('date').matches(/(^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d\d$)/),
        (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ Error: "Invalid request"});
        }
        exercises.replaceExercise(
            req.params._id, 
            req.body.name, 
            req.body.reps, 
            req.body.weight, 
            req.body.unit, 
            req.body.date
        )
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, 
                    name: req.body.name, 
                    reps: req.body.reps, 
                    weight: req.body.weight, 
                    unit: req.body.unit, 
                    date: req.body.date
                })
            } else {
                res.status(404).json({ Error: "Not found"});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ Error: "Invalid request"});
        });
    }
);

/**
 * DELETE the exercise whose ID is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteExercises(req.params._id)
        .then(deleteCount => {
            if (deleteCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: "Not found"});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ Error: "Invalid request"});
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});