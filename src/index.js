const express = require('express');
require('./db/mongoose');


const User = require('./models/user');
const Task = require('./models/task');
const res = require('express/lib/response');
const { use } = require('express/lib/application');


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error);
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(404).send({ error: 'Invalid update!' })
    }

    const _id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!user) {
            res.status(404).send()
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send()
        }

        res.send(user)

    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error);
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(404).send({ error: 'Invalid update!' })
    }

    const _id = req.params.id;
    try {
        const user = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!user) {
            res.status(404).send()
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(err)
    }
})

app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find()
        res.send(tasks);

    } catch (error) {
        res.status(500).send();
    }
})
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (error) {

        res.status(500).send();
    }
})


app.listen(port, () => {
    console.log('Server live in port: ' + port);
})