import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"

const PORT = process.env.PORT || 3000

try {
    await connectToDB()
    app.listen(PORT, () => {
        console.log("server is running")
    })
} catch (error) {
    console.error("Server could not start because the database connection failed.")
    process.exit(1)
}