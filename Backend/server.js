import "dotenv/config"
import server from "./src/app.js"
import connectToDB from "./src/config/database.js"
import { Server } from "socket.io"

const PORT = process.env.PORT || 3000

try {
    await connectToDB()
    server.listen(PORT, () => {
        console.log("server is running")
    })
} catch (error) {
    console.error("Server could not start because the database connection failed.")
    process.exit(1)
}