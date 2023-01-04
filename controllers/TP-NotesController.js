const notesSchema = require('../schemas/TP-NotesSchema');

const addNote = async (req, res) => {
  try {
    console.log('req.body ===', req.body);
    const newNote = new notesSchema(req.body);
    newNote.save();
    console.log('newNote ===', newNote);
    return res.status(201).json({ error: false, data: { note: newNote, message: 'new note created successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Incorrect data', data: error.details });
  }
};

const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { noteType, noteStatus, sort, page, search } = req.query;

    let sorting;
    let type = 'all';
    let searchParam = '';

    if (sort === 'latest') {
      sorting = {
        createdAt: -1,
      };
    } else if (sort === 'oldest') {
      sorting = {
        createdAt: 1,
      };
    } else if (sort === 'a-z') {
      sorting = {
        noteTitle: 1,
      };
    } else {
      sorting = {
        noteTitle: -1,
      };
    }

    if (noteType === 'all') {
      type = 'all';
    } else if (noteType === 'task') {
      type = 'note';
    } else {
      type = 'task';
    }

    if (search === undefined) {
      searchParam = '';
    } else {
      searchParam = search;
    }

    const notes = await notesSchema
      .find({
        userId: userId,
        noteType: { $nin: [type] },
        status: noteStatus,
        noteTitle: { $regex: searchParam },
      })
      .sort(sorting)
      .skip((page - 1) * 10)
      .limit(page * 10);
    const amount = await notesSchema.find({ userId: userId });
    return res.json({ error: false, data: { notes, noteAmount: amount.length } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'No notes found', data: { notes: [] } });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId, title, text, status } = req.body;
    const updatedNote = await notesSchema.findOneAndUpdate(
      { _id: noteId },
      { $set: { noteTitle: title, noteText: text, status: status } }
    );
    return res.status(201).json({ error: false, data: { message: 'User info updated successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Failed to update a note', data: error.details });
  }
};

const removeNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deleteNote = await notesSchema.findOneAndDelete({ _id: noteId });
    res.status(203).json({ error: false, data: { message: 'note deleted successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Failed to delete a note', data: error.details });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  removeNote,
};
