import * as cloudinary from 'cloudinary'
import config from './config';

cloudinary.v2.config({ 
  cloud_name: config.CLOUDINARY_CLOUD_NAME, 
  api_key: config.CLOUDINARY_API_KEY, 
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true
});

const upload = async (file) => {
    const res = await cloudinary.v2.uploader.upload(file)
    return res
}

export default upload