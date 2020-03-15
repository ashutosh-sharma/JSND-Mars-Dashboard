require('dotenv').config()
const { Map } = require('immutable');
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// NASA - MARS Rover API call
app.get('/nasaAPI', async (req, res) => {
    try {
        let roverName = req.get('roverName');
        console.log("API called for:", roverName);
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=10&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ image });
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))