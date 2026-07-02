import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


const uploadOnCloudinary = async(filePath)=>{

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_key,
        api_secret: process.env.CLOUDINARY_API_SECRET
    
    });

    try{

        if(!filePath){
            return null
        }


         const uploadResult = await cloudinary.uploader.upload(filePath)
        try{
            if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
        }catch(err){
            console.warn("Failed to unlink file:", filePath, err.message)
        }

        return uploadResult.secure_url

    }catch(error){
                try{
                    if(filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
                }catch(err){
                    console.warn("Failed to unlink file in catch:", filePath, err.message)
                }
                console.log(error)
                return null
    }

}

export default uploadOnCloudinary;