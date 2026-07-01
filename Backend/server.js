import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"

const PORT = process.env.PORT || 5000

await connectToDB()

app.listen(PORT,()=>{
    console.log("server is running")
})