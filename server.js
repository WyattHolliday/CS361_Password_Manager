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
    var edits5 = false // find which saves setting user has
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
    res.status(200).render('index', { // display page
    accounts: userdata[user].accounts,
    count: userdata[user].accounts.length,
    edits5: edits5,
    edits10: edits10,
    edits20: edits20,
    edits30: edits30
    })
  })

app.use(express.static('public')) // give page direct access to public and photos folders
app.use(express.static('photos'))

app.get("/generatePassword", function(req, res) {
    fetch('http://127.0.0.1:5000/generate_password', {
    method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        res.status(200).send(data.password) // send generated password
    });
})

function writeToUserData(res, errorMessage, sucessMessage) { // function for writing data to JSON file
    fs.writeFile('./userdata.json', JSON.stringify(userdata, null, 2), 
        function (err) {
            if (err) {
                res.status(500).send(errorMessage)
            } else {
                res.status(200).send(sucessMessage)
            }
        }
    )
}

app.post("/sort", function(req, res) { // UNFINISHED
    var type = req.body.type
    if (type === "alphabetical") {
        userdata[user].accounts = userdata[user].accounts.sort(function(a, b){
            return a.address - b.address;
        })
        for (var i = 0; i < userdata[user].accounts.length; i++) {
            userdata[user].accounts[i].id = i
        }
    } else if (type === "dateAdded") {
        userdata[user].accounts = userdata[user].accounts.sort(function(a, b){
            return a.added - b.added;
        })
        for (var i = 0; i < userdata[user].accounts.length; i++) {
            userdata[user].accounts[i].id = i
        }
    }
    writeToUserData(res, "Server failed to sort accounts", "Successfully sorted accounts")
})

app.post("/updateSettings", function(req, res) {
    var editsCanSave = req.body.editsCanSave
    userdata[user].user.settings.editsCanSave = editsCanSave // update data to reflect settings
    for (var i = 0; i < userdata[user].accounts.length; i++) { // for all accounts
        for (var j = userdata[user].accounts[i].future.length; j > editsCanSave; j--) {
            userdata[user].accounts[i].future.splice(0, 1) // delete saved futures outside of new bounds
        }
        for (var j = userdata[user].accounts[i].previous.length; j > editsCanSave; j--) {
            userdata[user].accounts[i].previous.splice(0, 1) // delete saved pasts outside of new bounds
        }
    }
    writeToUserData(res, "Server failed to deactivate account", "Successfully deactivated account")
})

app.post("/deactivate", function(req, res) {
    for (var i = userdata[user].accounts.length - 1; i >= 0; i--) {
        userdata[user].accounts.splice(i, 1) // delete all accounts
    }
    userdata[user].user.settings.editsCanSave = 10 // reset settings
    writeToUserData(res, "Server failed to deactivate account", "Successfully deactivated account")
})

app.post("/createAcc", function(req, res) {
    var displayPW = "" // create hidden password
    for (var i = 0; i < req.body.password.length; i++) {
        displayPW += "*"
    }
    userdata[user].accounts.push({ // add all data to server file
        address: req.body.address,
        imgurl: req.body.imgurl,
        username: req.body.username,
        password: req.body.password,
        displayPW: displayPW,
        email: req.body.email,
        notes: req.body.notes,
        id: userdata[user].accounts.length,
        added: req.body.totalAccounts + 1,
        previous: [],
        future: []
    })
    writeToUserData(res, "Server failed to add account data", "Successfully added account data")
})

app.post("/getAccountData", function(req, res) {
    var id = req.body.id
    res.status(200).send({ // send back all data at the id
        address: userdata[user].accounts[id].address,
        imgurl: userdata[user].accounts[id].imgurl,
        username: userdata[user].accounts[id].username,
        password: userdata[user].accounts[id].password,
        email: userdata[user].accounts[id].email,
        notes: userdata[user].accounts[id].notes,
        id: userdata[user].accounts[id].id
    })
})

function storePastAccount(id) { // store data in past section of server file
    userdata[user].accounts[id].previous.push({
        address: userdata[user].accounts[id].address,
        imgurl: userdata[user].accounts[id].imgurl,
        username: userdata[user].accounts[id].username,
        password: userdata[user].accounts[id].password,
        displayPW: userdata[user].accounts[id].displayPW,
        email: userdata[user].accounts[id].email,
        notes: userdata[user].accounts[id].notes
    })
}

app.post("/saveAccInfo", function(req, res) {
    var id = req.body.id
    storePastAccount(id)
    userdata[user].accounts[id].address = req.body.address // update server file to new data
    userdata[user].accounts[id].username = req.body.username
    userdata[user].accounts[id].password = req.body.password
    userdata[user].accounts[id].displayPW = req.body.displayPW
    userdata[user].accounts[id].email = req.body.email
    userdata[user].accounts[id].notes = req.body.notes
    if (userdata[user].accounts[id].previous.length > userdata[user].user.settings.editsCanSave) {
        userdata[user].accounts[id].previous.splice(0, 1) // if needed delete old data
    }
    writeToUserData(res, "Issue saving data", "Data sucessfully saved")
})

function storeFutureAccount(id) { // store data in future section of server file
    userdata[user].accounts[id].future.push({
        address: userdata[user].accounts[id].address,
        imgurl: userdata[user].accounts[id].imgurl,
        username: userdata[user].accounts[id].username,
        password: userdata[user].accounts[id].password,
        displayPW: userdata[user].accounts[id].displayPW,
        email: userdata[user].accounts[id].email,
        notes: userdata[user].accounts[id].notes
    })
}

app.post("/undoAcc", function(req, res) {
    var id = req.body.id
    if (userdata[user].accounts[id].previous.length == 0) {
        res.status(200).send("Cannot undo further") // if nothing in history
    } else {
        storeFutureAccount(id) // store current data in future 
        var previousLastIndex = userdata[user].accounts[id].previous.length - 1
        userdata[user].accounts[id].address = userdata[user].accounts[id].previous[previousLastIndex].address // revert to data in history
        userdata[user].accounts[id].imgurl = userdata[user].accounts[id].previous[previousLastIndex].imgurl
        userdata[user].accounts[id].username = userdata[user].accounts[id].previous[previousLastIndex].username
        userdata[user].accounts[id].password = userdata[user].accounts[id].previous[previousLastIndex].password
        userdata[user].accounts[id].displayPW = userdata[user].accounts[id].previous[previousLastIndex].displayPW
        userdata[user].accounts[id].email = userdata[user].accounts[id].previous[previousLastIndex].email
        userdata[user].accounts[id].notes = userdata[user].accounts[id].previous[previousLastIndex].notes
        userdata[user].accounts[id].previous.splice(previousLastIndex, 1) // remove that data from history
        if (userdata[user].accounts[id].future.length > userdata[user].user.settings.editsCanSave) {
            userdata[user].accounts[id].future.splice(0, 1) // if needed delete future data to make room
        }
        writeToUserData(res, "Issue saving data", "Data sucessfully saved")
    }
})

app.post("/redoAcc", function(req, res) {
    var id = req.body.id
    if (userdata[user].accounts[id].future.length == 0) {
        res.status(200).send("Cannot redo further")// if nothing in future
    } else {
        storePastAccount(id)// store current data in past
        futureLastIndex = userdata[user].accounts[id].future.length - 1
        userdata[user].accounts[id].address = userdata[user].accounts[id].future[futureLastIndex].address // revert to data in future
        userdata[user].accounts[id].imgurl = userdata[user].accounts[id].future[futureLastIndex].imgurl
        userdata[user].accounts[id].username = userdata[user].accounts[id].future[futureLastIndex].username
        userdata[user].accounts[id].password = userdata[user].accounts[id].future[futureLastIndex].password
        userdata[user].accounts[id].displayPW = userdata[user].accounts[id].future[futureLastIndex].displayPW
        userdata[user].accounts[id].email = userdata[user].accounts[id].future[futureLastIndex].email
        userdata[user].accounts[id].notes = userdata[user].accounts[id].future[futureLastIndex].notes
        userdata[user].accounts[id].future.splice(futureLastIndex, 1) // remove that data from future
        if (userdata[user].accounts[id].previous.length > userdata[user].user.settings.editsCanSave) {
            userdata[user].accounts[id].previous.splice(0, 1) // if needed delete past data to make room
        }
        writeToUserData(res, "Issue saving data", "Data sucessfully saved")
    }
})

app.post("/accInstDelete", function(req, res) {
    var id = req.body.id
    userdata[user].accounts.splice(id, 1) // delete account
    for (var i = 0; i < userdata[user].accounts.length; i++) { // update all account ids to be index
        userdata[user].accounts[i].id = i
    }
    writeToUserData(res, "Issue saving data", "Data sucessfully saved")
})

app.get("*", function(req, res) {
    res.status(200).sendFile(__dirname + "/public/404.html")
})

app.listen(port, function () {
    console.log("Server is listening on port", port)
})