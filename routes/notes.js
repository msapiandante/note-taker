const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:notes_id', (req, res) => {
  const notesId = req.params.tip_id;
  readFromFile('./db/tips.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((tip) => notes.notes_id === notesId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific note
notes.delete('/:notes_id', (req, res) => {
  const notesId = req.params.tip_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((tip) => notes.notes_id !== notesId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text, } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      notes_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added!`);
  } else {
    res.error('Error in adding note.');
  }
});

module.exports = notes;
