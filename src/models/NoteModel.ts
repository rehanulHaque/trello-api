import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: false
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId
    }
},
{timestamps: true})

const Note = mongoose.model('Note', NoteSchema)

export default Note