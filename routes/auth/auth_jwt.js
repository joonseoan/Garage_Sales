module.exports = app => {

    app.post('/signup', (req, res) => {

        // console.log(req.body)
        // res.send('<h1>Working</h1>');

    });

    app.get('/signup', (req, res) => {

        console.log(req.body)
        res.send('<h1>Working</h1>');

    });   

}