const express = require('express');
const bodyPaerser = require('body-parser');

const app = express();

app.use(bodyPaerser.urlencoded({ extended: false }));

require('./routes/auth/auth_jwt')(app);

app.listen(4000, () => {
    console.log('Listening');
});