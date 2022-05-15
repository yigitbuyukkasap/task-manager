const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { path } = require('express/lib/application');

const router = new express.Router()

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(404).send({ error: 'Invalid update!' })
    }

    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    
    try {
        //const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({ path: 'tasks', match }).execPopulate();
        res.send(req.user.tasks);

    } catch (error) {
        res.status(500).send();
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (error) {

        res.status(500).send();
    }
})

module.exports = router;