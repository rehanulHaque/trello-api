import mongoose from 'mongoose'

const BoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId
    },
    notes: [{
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
            required: true
        }
    }],
    todos: [{
        todoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo',
            required: true
        }
    }]
},
{timestamps: true})

const Board = mongoose.model('Board', BoardSchema)

export default Board