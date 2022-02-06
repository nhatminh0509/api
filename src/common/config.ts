import { loadEnv } from './function'

const NODE_ENV = process.env.NODE_ENV || 'development'

const env = loadEnv(NODE_ENV) as { [k: string]: string }

const config = {
    MONGO_URI: env.MONGO_URI,
    JWT_SECRET: env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET
}

export default config