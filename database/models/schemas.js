import mongoose from "mongoose"


const db1 = mongoose.createConnection("mongodb://127.0.0.1:27017/Synck")
const db2 = mongoose.createConnection("mongodb://127.0.0.1:27017/Synck")
const db3 = mongoose.createConnection("mongodb://127.0.0.1:27017/Sunck")


export const userDetails = db1.model("users", mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    User_Id: {
        type: String,
        requires: true
    }
}))

export const taskDetails = db2.model("tasks", mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskId: {
        type: Number,
        required: true
    },
    
}))

export const dumpedTask = db2.model("dump" , mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskId: {
        type: Number,
        required: true
    },
}))
