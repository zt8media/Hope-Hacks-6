const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const sequelize = require('./config.js'); // Assuming config.js includes Sequelize configurations
const Event = require('./config.js'); // Assuming the same file exports your Event model


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

        // Send confirmation email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        let mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@gmail.com',
            subject: 'Event Confirmation',
            text: `Your event "${event.title}" has been added successfully!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API endpoint to delete an event
app.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (event) {
            await event.destroy();
            res.status(204).json({ message: 'Event deleted successfully' });
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