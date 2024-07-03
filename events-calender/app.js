
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./events-calender/config.js');
const Event = require('./event');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API endpoint to add a new event
app.post('/events', async (req, res) => {
    try {
        const event = await Event.create({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            description: req.body.description,
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API endpoint to update an event
app.put('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (event) {
            event.title = req.body.title;
            event.start = req.body.start;
            event.end = req.body.end;
            event.description = req.body.description;
            await event.save();
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
