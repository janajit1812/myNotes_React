const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all notes using GET: /api/notes/fetchallnotes. Login is required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//ROUTE 2: Add all notes using POST: /api/notes/addnote. Login is required.

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);

        // This check is for bad requests, if the conditions of title and descriptions are not met, it will send a 400 status error.
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notes = new Notes(
            { title, description, tag, user: req.user.id }
        );
        const savedNotes = await notes.save();
        res.json(savedNotes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})


//ROUTE 3: Update notes using PUT: /api/notes/updatenote. Login is required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;   // Destructuring, taking out the variables from the given request body.
    try {
        // Creating a new Notes newNote
        const newNote = {};
        // Updating each and every field if they are valid requests.
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Finding the note to be updated and update it.

        let note = await Notes.findById(req.params.id); // Here it fetches the id of the note.

        // If the requested note Id is unavailble, return not found.
        if (!note) { return res.status(400).send("Note not found") };

        // If the user Id doesnot matches with the user Id of the note, that means some other user trying to delete the notes of another user. In that case return "Not allowed".
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//ROUTE 4: Deleting notes using DELETE: /api/notes/deletenote. Login is required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // Finding the note to be updated and update it.
        let note = await Notes.findById(req.params.id); // Here it fetches the id of the note.

        // If the requested note Id is unavailble, return not found.
        if (!note) { return res.status(400).send("Note not found") };

        // If the user Id doesnot matches with the user Id of the note, that means some other user trying to delete the notes of another user. In that case return "Not allowed".
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Deleting the note if present.
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})


module.exports = router;

