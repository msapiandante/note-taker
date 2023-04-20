const express = require('express');
const path = require('path');
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET request for notes
app.get('/api/notes', (req, res) => {
    //read from file then send data from res.json 
    res.status(200).json(`${req.method} request received to get notes`);


    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNotes = {
            title,
            text,
            review_id: uuid(),
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new note
                parsedNotes.push(newNotes);

                // Write updated notes back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNotes,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note.');
    }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
