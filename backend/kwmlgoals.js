const express = require('express');
const router = express.Router()

const KwmlGoal = require('./Goal');

// const goal1 = new KwmlGoal({goal: "Testing the schema", category: "Test"});

// goal1.save()

router.get('/goals', (req, res) => {
    KwmlGoal.find()
        .then(kwmlgoals => res.json(kwmlgoals))
        .catch(err => console.log(err))
})

router.post('/postGoals', (req, res) => {
    const { goal, category } = req.body;
    const newKwmlGoal = new KwmlGoal({
        goal: goal, 
        category: category
    })
    newKwmlGoal.save()
        .then(() => res.json({
            message: "Created account successfully"
        }))
        .catch(err => res.status(400).json({
            "error": err,
            "message": "Error creating account"
        }))
})

module.exports = router 