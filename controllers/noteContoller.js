const { sequelize } = require("../models/");

// Return all notes
const getAllNotes = async (req, res) => {
  try {
    const { user_id } = req.body;
    const notes = await sequelize.models.Note.findAll({
      where: {
        user_id,
      },
    });
    return res.status(200).json({ notes });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { user_id, body, is_done } = req.body;
    const note = await sequelize.models.Note.create({
      body,
      user_id,
      isDone: is_done,
    });
    return res.status(201).json(note);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { id, body, is_done } = req.body;
    const note = await sequelize.models.Note.update(
      { body, isDone: is_done },
      {
        where: { id },
      }
    );
    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.body;
    const note = await sequelize.models.Note.destroy({
      where: { id },
    });
    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
