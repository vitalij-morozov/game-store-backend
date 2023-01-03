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
    console.log('userId ===', userId);
    // const { search } = req.search;
    console.log('noteType ===', noteType);
    console.log('noteStatus ===', noteStatus);
    console.log('sort ===', sort);
    console.log('search ===', search);
    console.log('page ===', page);

    let searchParam;
    let sortKey = 'createdAt';
    let sortVal = -1;

    if (sort === 'latest') {
      sortKey = 'createdAt';
      sortVal = -1;
    } else if (sort === 'oldest') {
      sortKey = 'createdAt';
      sortVal = 1;
    } else if (sort === 'a-z') {
      sortKey = 'noteTitle';
      sortVal = 1;
    } else {
      sortKey = 'noteTitle';
      sortVal = -1;
    }

    if (search) {
      searchParam = search;
    } else {
      searchParam = null;
    }
    console.log('sortKey ===', sortKey);
    console.log('sortVal ===', sortVal);
    const notes = await notesSchema
      .find({
        userId: userId,
        noteType,
        status: noteStatus,
      })
      .skip((page - 1) * 10)
      .limit(page * 10)
      .sort({ sortKey: sortVal });
    return res.json({ error: false, data: { notes } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'No notes found', data: { notes: [] } });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId, title, text, status } = req.body;
    const updatedNote = await notesSchema.findOneAndUpdate(
      { _id: id },
      { $set: { noteTitle: title, noteText: text, status: status } }
    );
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
