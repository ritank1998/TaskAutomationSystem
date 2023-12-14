import express from "express"
import { addUsers , addTask , getUsers  } from "../route/route.js"
const router = express.Router()



router.post("/user" , addUsers)
router.post("/task" , addTask)
router.get("/myusers" , getUsers)
//router.get("/mytask" , getTask)




export default router