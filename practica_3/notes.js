const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'notes.json');

function loadNotes() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

function addNote(title, body) {
  const notes = loadNotes();
  const exists = notes.find(n => n.title.toLowerCase() === title.toLowerCase());
  if (exists) return { ok: false, msg: 'Ya existe una nota con ese título.' };
  notes.push({ title, body });
  saveNotes(notes);
  return { ok: true, msg: 'Nota agregada.' };
}

function removeNote(title) {
  const notes = loadNotes();
  const filtered = notes.filter(n => n.title.toLowerCase() !== title.toLowerCase());
  if (filtered.length === notes.length) return { ok: false, msg: 'No se encontró la nota.' };
  saveNotes(filtered);
  return { ok: true, msg: 'Nota eliminada.' };
}

function listNotes() {
  return loadNotes().map(n => ({ title: n.title }));
}

function readNote(title) {
  const note = loadNotes().find(n => n.title.toLowerCase() === title.toLowerCase());
  if (!note) return { ok: false, msg: 'No se encontró la nota.' };
  return { ok: true, note };
}

module.exports = { addNote, removeNote, listNotes, readNote };
