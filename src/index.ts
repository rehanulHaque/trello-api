import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import {DbConnect} from './utils/dbConnect'
import UserRouter from './routes/User'
import BoardRouter from './routes/Board'
import NoteRouter from './routes/Note'
import TodoRouter from './routes/Todo'
const app = express()

app.use(express.json())

app.use('/api/user', UserRouter)
app.use('/api/board', BoardRouter)
app.use('/api/todo', TodoRouter)
app.use('/api/note', NoteRouter)


DbConnect()
app.listen(3000, () => console.log('Server started on port 3000'))