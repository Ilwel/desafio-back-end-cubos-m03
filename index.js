const express = require('express');
const app = express();
const router = require('./router')

app.use(express.json());

app.use(router);

const PORT = 8000;
app.listen(PORT, () => {

    console.log('the server is open on port ' + PORT);

})