var express = require('express')
var fs = require('fs')
let cors = require("cors");

var app = express()
var port = process.env.PORT || 3000;

app.use(express.json())

app.use(cors());

app.use(express.static('public'))
app.use(express.static('photos'))

app.get("/generate_password", function(req, res) {
    fetch('http://127.0.0.1:5000/generate_password', {
    method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        res.status(200).send(data.password)
    });
})

app.get("*", function(req, res) {
    res.status(200).sendFile(__dirname + "/public/index.html")
})

app.listen(port, function () {
    console.log("Server is listening on port", port)
})