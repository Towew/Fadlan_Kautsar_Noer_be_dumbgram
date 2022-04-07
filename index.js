const express = require('express');

const app = express();

const port = 5000;

//Import routing dari folder routes
const router = require('./src/routes');

//Allow app for incoming json request
app.use(express.json());

//Gunakan fungsi route yang sudah dijadikan variabel
app.use('/api/v1/', router); 

app.listen(port, () => console.log(`Listening on port: ${port}`));