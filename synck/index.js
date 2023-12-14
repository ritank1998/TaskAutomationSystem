import express from "express"
import cors from "cors"
import CircularJson from "circular-json"
import "../database/connection/conn.js"
import { userDetails, taskDetails } from "../database/models/schemas.js"
import mongoNotif from "./router/router.js"

const app = express()
const port = 4200




app.use(express())
app.use(express.json())



app.get("/" , (req,res)=>{
    res.status(200).json(CircularJson.stringify("This is Working fine!!!"))
})

app.use("/synckuser" , mongoNotif)




app.listen(port , ()=>{
    console.log("This is working fine !!!!")
})