/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';


// requesting a detection for an image
const detectionRequest = async (req: Request, res: Response, next: NextFunction) => {
    //let image: string = req.body.image;
    // request the api endpoint to process the image detection
    //let response: void|AxiosResponse = await axios.post(`http://localhost:8000/`, { 
    //    file : image
    //}).catch(function (error) {console.log(error.response.data.detail[0].loc)});
    //return response;
    return res.status(200).json({
        detection: "Airbus A320"
    })
};

export default { detectionRequest };