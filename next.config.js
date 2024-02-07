const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve('env', `.env.${process.env.ENV_TYPE}`);
const envConfig = dotenv.config({ path: envPath }).parsed;

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ...envConfig
    }
};

module.exports= nextConfig;
