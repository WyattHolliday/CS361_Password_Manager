var express = require('express')
var fs = require('fs')
let cors = require("cors")
var exphbs = require('express-handlebars')

var app = express()
var port = process.env.PORT || 3000;
var user = 0

app.use(express.json())

app.use(cors())

app.engine('handlebars', exphbs.engine({
    defaultLayout: null
}))
app.set('view engine', 'handlebars')

var userdata = require('./userdata.json')

app.get("/passwordmanager", function(req, res) {
    var edits5 = false
    var edits10 = false
    var edits20 = false
    var edits30 = false
    if (userdata[user].user.settings.editsCanSave === 5) {
        edits5 = true
    } else if (userdata[user].user.settings.editsCanSave === 10) {
        edits10 = true
    } else if (userdata[user].user.settings.editsCanSave === 20) {
        edits20 = true
    } else if (userdata[user].user.settings.editsCanSave === 30) {
        edits30 = true
    }
    res.status(200).render('index', {
    accounts: userdata[user].accounts,
    count: userdata[user].accounts.length,
    edits5: edits5,
    edits10: edits10,
    edits20: edits20,
    edits30: edits30
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

app.post("/updateSettings", function(req, res) {
    var id = req.body.id
    var editsCanSave = req.body.editsCanSave
    userdata[user].user.settings.editsCanSave = editsCanSave
    for (var i = 0; i < userdata[user].accounts.length; i++) {
        for (var j = userdata[user].accounts[i].future.length; j > editsCanSave; j--) {
            userdata[user].accounts[i].future.splice(0, 1)
        }
        for (var j = userdata[user].accounts[i].previous.length; j > editsCanSave; j--) {
            userdata[user].accounts[i].previous.splice(0, 1)
        }
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

app.post("/deactivate", function(req, res) {
    for (var i = userdata[user].accounts.length - 1; i >= 0; i--) {
        userdata[user].accounts.splice(i, 1)
    }
    userdata[user].user.settings.editsCanSave = 10
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

app.post("/createAcc", function(req, res) {
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
    userdata[user].accounts.push({
        address: address,
        imgurl: imgurl,
        username: username,
        password: password,
        displayPW: displayPW,
        email: email,
        notes: notes,
        id: userdata[user].accounts.length,
        previous: [],
        future: []
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
        address: userdata[user].accounts[id].address,
        imgurl: userdata[user].accounts[id].imgurl,
        username: userdata[user].accounts[id].username,
        password: userdata[user].accounts[id].password,
        email: userdata[user].accounts[id].email,
        notes: userdata[user].accounts[id].notes,
        id: userdata[user].accounts[id].id
    })
})

app.post("/saveAccInfo", function(req, res) {
    var id = req.body.id
    userdata[user].accounts[id].previous.push({
        address: userdata[user].accounts[id].address,
        imgurl: userdata[user].accounts[id].imgurl,
        username: userdata[user].accounts[id].username,
        password: userdata[user].accounts[id].password,
        displayPW: userdata[user].accounts[id].displayPW,
        email: userdata[user].accounts[id].email,
        notes: userdata[user].accounts[id].notes
    })

    userdata[user].accounts[id].address = req.body.address
    userdata[user].accounts[id].password = req.body.password
    userdata[user].accounts[id].displayPW = req.body.displayPW
    userdata[user].accounts[id].email = req.body.email
    userdata[user].accounts[id].notes = req.body.notes
    if (userdata[user].accounts[id].previous.length > userdata[user].user.settings.editsCanSave) {
        userdata[user].accounts[id].previous.splice(0, 1)
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

app.post("/undoAcc", function(req, res) {
    var id = req.body.id
    if (userdata[user].accounts[id].previous.length == 0) {
        res.status(200).send("Cannot undo further")
    } else {
        userdata[user].accounts[id].future.push({
            address: userdata[user].accounts[id].address,
            imgurl: userdata[user].accounts[id].imgurl,
            username: userdata[user].accounts[id].username,
            password: userdata[user].accounts[id].password,
            displayPW: userdata[user].accounts[id].displayPW,
            email: userdata[user].accounts[id].email,
            notes: userdata[0].accounts[id].notes
        })
        var previousLastIndex = userdata[user].accounts[id].previous.length - 1
        userdata[user].accounts[id].address = userdata[user].accounts[id].previous[previousLastIndex].address
        userdata[user].accounts[id].imgurl = userdata[user].accounts[id].previous[previousLastIndex].imgurl
        userdata[user].accounts[id].username = userdata[user].accounts[id].previous[previousLastIndex].username
        userdata[user].accounts[id].password = userdata[user].accounts[id].previous[previousLastIndex].password
        userdata[user].accounts[id].displayPW = userdata[user].accounts[id].previous[previousLastIndex].displayPW
        userdata[user].accounts[id].email = userdata[user].accounts[id].previous[previousLastIndex].email
        userdata[user].accounts[id].notes = userdata[user].accounts[id].previous[previousLastIndex].notes
        userdata[user].accounts[id].previous.splice(previousLastIndex, 1)
        if (userdata[user].accounts[id].future.length > userdata[user].user.settings.editsCanSave) {
        userdata[user].accounts[id].future.splice(0, 1)
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
        }
})

app.post("/redoAcc", function(req, res) {
    var id = req.body.id
    if (userdata[user].accounts[id].future.length == 0) {
        res.status(200).send("Cannot redo further")
    } else {
        userdata[user].accounts[id].previous.push({
            address: userdata[user].accounts[id].address,
            imgurl: userdata[user].accounts[id].imgurl,
            username: userdata[user].accounts[id].username,
            password: userdata[user].accounts[id].password,
            displayPW: userdata[user].accounts[id].displayPW,
            email: userdata[user].accounts[id].email,
            notes: userdata[user].accounts[id].notes
        })
        futureLastIndex = userdata[user].accounts[id].future.length - 1
        userdata[user].accounts[id].address = userdata[user].accounts[id].future[futureLastIndex].address
        userdata[user].accounts[id].imgurl = userdata[user].accounts[id].future[futureLastIndex].imgurl
        userdata[user].accounts[id].username = userdata[user].accounts[id].future[futureLastIndex].username
        userdata[user].accounts[id].password = userdata[user].accounts[id].future[futureLastIndex].password
        userdata[user].accounts[id].displayPW = userdata[user].accounts[id].future[futureLastIndex].displayPW
        userdata[user].accounts[id].email = userdata[user].accounts[id].future[futureLastIndex].email
        userdata[user].accounts[id].notes = userdata[user].accounts[id].future[futureLastIndex].notes
        userdata[user].accounts[id].future.splice(futureLastIndex, 1)
        if (userdata[user].accounts[id].previous.length > userdata[user].user.settings.editsCanSave) {
            userdata[user].accounts[id].previous.splice(0, 1)
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
    }
})

app.post("/accInstDelete", function(req, res) {
    var id = req.body.id
    userdata[user].accounts.splice(id, 1)
    for (var i = 0; i < userdata[user].accounts.length; i++) {
        userdata[user].accounts[i].id = i
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