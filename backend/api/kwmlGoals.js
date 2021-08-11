const express = require('express');
const router = express.Router()

const KwmlGoal = require('../models/Goal');

router.get('/', (req, res) => {
    KwmlGoal.find()
        .then(kwmlGoals => res.json(kwmlGoals))
        .catch(err => console.log(err))
})

router.post('/', (req, res) => {
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