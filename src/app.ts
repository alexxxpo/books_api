import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

async function start() {
    app.get('/', (req, res) => {
        res.send('starting')
    })
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
}

start()
