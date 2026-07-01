import mongoose from "mongoose"

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connnected")
    } catch (error) {
        console.log(error.message)
        throw error
    }
}

export default connectToDB