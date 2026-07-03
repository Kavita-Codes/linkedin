import express from "express"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import http from "http"
import { Server } from "socket.io"




const app = express()

let server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

export const userSocketMap = new Map()                     // for to connect a perticular using socket.io  not globally jaye //  map

export const io = new Server(server,{
    cors:({
    credentials: true,
    origin: "http://localhost:5173"
   })
})

io.on("connection" , (socket)=>{
    console.log("user connected" , socket.id)

    socket.on("addUser" , (userId)=>{
        userSocketMap.set(userId , socket.id)
        console.log(userSocketMap)
    })

    socket.on("disconnect" , (socket)=>{
        console.log("user disconnected" , socket.id)
    })
})


app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)

export default server



