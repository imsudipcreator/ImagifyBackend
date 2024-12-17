import axios from "axios";
import userModel from "../models/userModel.js";
import imageToBase64 from "image-to-base64";


export const generateImage = async (req , res) => {
    try {
        const { userId , prompt } = req.body;
        const user = await userModel.findById(userId)
        if (!user || !prompt ){
          return  res.json({success : false,  message: "Missing details" })
        }
        if(user.creditBalance === 0 || user.creditBalance < 0){
            return res.json({success : false,  message: "Insufficient credits", creditBalance : user.creditBalance})
        }

        const image =  imageToBase64(`https://image.pollinations.ai/prompt/${prompt}`) // Image URL
       .then(
        (response) => {
         return response; // "iVBORw0KGgoAAAANSwCAIA..."
            
        }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
        const base64Image = await image
        const resultImage = `data:image/png;base64,${base64Image}`
    
        
        await userModel.findByIdAndUpdate(user._id , {creditBalance : user.creditBalance - 1})

        res.json({success : true , message : "Image generated" , resultImage , creditBalance : user.creditBalance - 1})
    } catch (error) {
        console.log(error)
        res.json({success : false , message : "Error generating image" })
    }
}