import mongoose from 'mongoose'

export const DbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: 'trello',
        })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}