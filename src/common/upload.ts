import * as cloudinary from 'cloudinary'

cloudinary.v2.config({ 
  cloud_name: 'dofaz5gop', 
  api_key: '172273429757555', 
  api_secret: 'HWZt2ndXpmRrykCnSwQZliu63n0',
  secure: true
});

const upload = async (file) => {
    const res = await cloudinary.v2.uploader.upload(file)
    return res
}

export default upload