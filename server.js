var express = require('express')
var fs = require('fs')
let cors = require("cors")
var exphbs = require('express-handlebars')

var app = express()
var port = process.env.PORT || 3000;

app.use(express.json())

app.use(cors())

app.engine('handlebars', exphbs.engine({
    defaultLayout: null
}))
app.set('view engine', 'handlebars')

var userdata = require('./userdata.json')

app.get("/passwordmanager", function(req, res) {
    res.status(200).render('index', {
    accounts: userdata,
    count: userdata.length
    })
  })

app.use(express.static('public'))
app.use(express.static('photos'))

app.get("/generatePassword", function(req, res) {
    fetch('http://127.0.0.1:5000/generate_password', {
    method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        res.status(200).send(data.password)
    });
})

app.post("/deactivate", function(req, res) {
    for (var i = userdata.length - 1; i >= 0; i--) {
        userdata.splice(i, 1)
    }
    fs.writeFile('./userdata.json', JSON.stringify(userdata, null, 2), 
        function (err) {
            if (err) {
                res.status(500).send("Server failed to deactivate account")
            } else {
                res.status(200).send("Successfully deactivated account")
            }
        }
    )
})

app.post("/addAccInfo", function(req, res) {
    var address = req.body.address
    var imgurl = req.body.imgurl
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var notes = req.body.notes
    var displayPW = ""
    for (var i = 0; i < password.length; i++) {
        displayPW += "*"
    }
    userdata.push({
        address: address,
        imgurl: imgurl,
        username: username,
        password: password,
        displayPW: displayPW,
        email: email,
        notes: notes,
        id: userdata.length
    })
    fs.writeFile('./userdata.json', JSON.stringify(userdata, null, 2), 
        function (err) {
            if (err) {
                res.status(500).send("Server failed to add account data")
            } else {
                res.status(200).send("Successfully added account data")
            }
        }
    )
})

app.post("/getAccountData", function(req, res) {
    var id = req.body.id
    res.status(200).send({
        address: userdata[id].address,
        imgurl: userdata[id].imgurl,
        username: userdata[id].username,
        password: userdata[id].password,
        email: userdata[id].email,
        notes: userdata[id].notes,
        id: userdata[id].id
    })
})

app.post("/saveAccInfo", function(req, res) {
    var id = req.body.id
    userdata[id].address = req.body.address
    userdata[id].username = req.body.username
    userdata[id].password = req.body.password
    userdata[id].displayPW = req.body.displayPW
    userdata[id].email = req.body.email
    userdata[id].notes = req.body.notes
    fs.writeFile('./userdata.json', JSON.stringify(userdata, null, 2), 
        function (err) {
            if (err) {
                res.status(500).send("Issue saving data")
            } else {
                res.status(200).send("Data sucessfully saved")
            }
        }
    )
})

app.post("/accInstDelete", function(req, res) {
    var id = req.body.id
    userdata.splice(id, 1)
    for (var i = 0; i < userdata.length; i++) {
        userdata[i].id = i
    }
    fs.writeFile('./userdata.json', JSON.stringify(userdata, null, 2), 
        function (err) {
            if (err) {
                res.status(500).send("Issue saving data")
            } else {
                res.status(200).send("Data sucessfully saved")
            }
        }
    )
})

app.get("*", function(req, res) {
    res.status(200).sendFile(__dirname + "/public/404.html")
})

app.listen(port, function () {
    console.log("Server is listening on port", port)
})