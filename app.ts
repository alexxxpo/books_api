import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

const cookieParser = require('cookie-parser')
dotenv.config();


async function start() {
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(cookieParser())
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use('/', router)

    
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
}

start()
