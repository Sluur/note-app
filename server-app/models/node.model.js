const mongoose = require("mongoose");

const Schema = mongose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], defaults: [] },
  isPinned: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createdOn: { type: String, default: new Date().getTime() },
});

module.exports = mongoose.model("Note", noteSchema);
// hsahsjahs
