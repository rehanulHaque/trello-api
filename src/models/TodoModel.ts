import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: String,
        default: false
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId
    }
},
{timestamps: true})

const Todo = mongoose.model('Todo', TodoSchema)

export default Todo