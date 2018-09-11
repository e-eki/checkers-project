
import mongoose from 'mongoose';
import config from './config';

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title     : { type: String },
});

const Note = mongoose.model('Note', NoteSchema);




export function setUpConnection() {
    mongoose.connect(config.db.mongo.url);
}

