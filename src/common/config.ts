import { loadEnv } from './util'

const NODE_ENV = process.env.NODE_ENV || 'development'

const env = loadEnv(NODE_ENV) as { [k: string]: string }

const config = {
    JWT_SECRET: 'secret',
    MONGO_URI: 'mongodb://nhatminh0509:nhaT0509@kathena-demo-shard-00-00.26nei.mongodb.net:27017,kathena-demo-shard-00-01.26nei.mongodb.net:27017,kathena-demo-shard-00-02.26nei.mongodb.net:27017/api?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
    test: env.test
}

export default config