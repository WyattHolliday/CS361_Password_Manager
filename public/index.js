function toggleAccountSlideOut() {
    var Slideout = document.getElementById("account-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("account-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

// Create functions
function toggleCreateSlideOut() {
    var Slideout = document.getElementById("create-slideout")
    var createPrompt = document.getElementsByClassName("prompt-create-container")[0]
    if (Slideout.classList.contains("hidden")) { 
        Slideout.classList.remove("hidden")
        if (createPrompt) { // if prompt exits hide it otherwise unhide it
            createPrompt.classList.add("hidden")
        }
        closeOtherSlides("create-slideout")
    } else {
        Slideout.classList.add("hidden")
        if (createPrompt) {
            createPrompt.classList.remove("hidden")
        }
    }
}

function generatePassword() {
    fetch('/generatePassword', {
        method: 'GET'
      })
      .then(function (res) {
        if (res.status === 200) {
          res.text().then(function (text) { // put retrived password into element
            document.getElementById("create-password-input").value = text
          })
        } else {
          console.log("error: " + res.status)
        }
      }).catch(function (err) {
        console.log("error: " + err)
      })
}

// amount of acounts created
var totalAccounts = document.getElementsByClassName("account-instance-container").length // fetch instead

function createAccount() {
    var address = document.getElementById("create-address-input")
    var username = document.getElementById("create-username-input")
    var password = document.getElementById("create-password-input")
    var email = document.getElementById("create-email-input")
    var notes = document.getElementById("create-notes")
    if (address.value === "" || username.value === "" || password.value === "") {
        alert("Address, username and password fields must be filled out")
    } else {
        totalAccounts++
        fetch("/createAcc", { // send account info to server
            method: 'POST',
            body: JSON.stringify({
                address: address.value,
                imgurl: "website.jpg",
                username: username.value,
                password: password.value,
                email: email.value,
                notes: notes.value,
                totalAccounts: totalAccounts
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            if (res.status != 200) {
                console.log("error: " + res.status)
            } else { // set all imputs blank
                address.value = ""
                username.value = ""
                password.value = ""
                email.value = ""
                notes.value = ""
            }
        }).catch(function (err) {
            console.log("error: " + err)
        })
    }
}

// Sort functions
function toggleSortSlideOut() {
    var Slideout = document.getElementById("sort-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("sort-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function changeSort() { // UNFINISHED
    var category = document.querySelectorAll("input[name='sort-checkboxes']:checked")[0]
    var type = category.nextSibling.nextSibling.textContent
    fetch("/sort", {
        method: 'POST',
        body: JSON.stringify({
            type: type
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: " + res.status)
        } else {
            location.href = location.href
        }
    }).catch(function (err) {
        console.log("error: " + err)
    })
}

// Customize functions
function toggleCustomizeSlideOut() {
    var Slideout = document.getElementById("customize-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("customize-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

// Settings functions
function toggleSettingsSlideOut() {
    var Slideout = document.getElementById("settings-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("settings-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function changeSettings() {
    var editsCanSaveSelector = document.getElementsByClassName("settings-edits-ammount")[0]
    var editsCanSave
    for (var i = 0; i < editsCanSaveSelector.length; i++) {
        if (editsCanSaveSelector[i].selected === true) {
            editsCanSave = Number(editsCanSaveSelector[i].text) // Find user imputed edits to save
        }
    }
    fetch("/updateSettings", { // Send to server
        method:'POST',
        body: JSON.stringify({
            editsCanSave: editsCanSave
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            location.href = location.href // refresh page
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

function deactivateAccount() {
    // confirm before deactivation?
    fetch("/deactivate", { // tell server to delete data
        method: 'POST'
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            location.href = location.href // refresh
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

// Support functions
function toggleSupportSlideOut() {
    var Slideout = document.getElementById("support-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("support-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

// When opening a slide ensures only it and prompt are visable
function closeOtherSlides(currSlide) {
    var createPrompt = document.getElementsByClassName("prompt-create-container")[0]
    if (currSlide != "create-slideout" && createPrompt) { // if currently opening create and prompt exists, unhide
        createPrompt.classList.remove("hidden")
    }
    var Slideouts = document.getElementsByClassName("slideout-page")
    for (var i = 0; i < Slideouts.length; i++) {
        if(Slideouts[i].id != currSlide) {
            Slideouts[i].classList.add("hidden") // hide all other slides
        }
    }
}

function getAccountIDFromMain(e) {
    return e.target.parentNode.parentNode.childNodes[7].textContent
}

// Main page functions
function accountDelete(e) {
    var id = getAccountIDFromMain(e)
    fetch("/accInstDelete", { // tell server which account to delete
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            location.href = location.href // refresh
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

// opens edit page
function openAccountEdit(e) {
    var accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
    accountEditContainer.classList.remove("hidden")
    var id = getAccountIDFromMain(e)

    fetch('/getAccountData', { // tell server which account to get data from
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function (res) {
        if (res.status != 200) {
            console.log("error: " + res.status)
        } else {
            res.json().then(function (accData) { // put data in page
                document.getElementById("edit-user-url").value = accData.address
                document.getElementById("edit-user-username").value = accData.username
                document.getElementById("edit-user-password").value = accData.password
                document.getElementById("edit-user-email").value = accData.email
                document.getElementById("edit-user-notes").value = accData.notes
                document.getElementById("edit-id").textContent = accData.id
            })
        }
    }).catch(function (err) {
        console.log("error: " + err)
    })
}

// hides edit page
function closeAccountEdit() {
    accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
    accountEditContainer.classList.add("hidden")
}

function getAccountIDFromEdit(e) {
    return e.target.parentNode.parentNode.parentNode.childNodes[13].textContent
}

 // undo to previous iteration of account
function undoAccount(e) {
    var id = getAccountIDFromEdit(e)
    fetch("/undoAcc", { // tell server which account to undo
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            res.text().then(function (text) {
                if (text === "Cannot undo further") {
                    alert(text)
                } else {
                    location.href = location.href // refresh page
                }
            })
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

// redo to previous iteration of account
function redoAccount(e) {
    var id = getAccountIDFromEdit(e)
    fetch("/redoAcc", { // tell server which account to undo
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            res.text().then(function (text) {
                if (text === "Cannot redo further") {
                    alert(text)
                } else {
                    location.href = location.href // refresh page
                }
            })
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

// saves account info to server
function saveAccountEdit() {
    var address = document.getElementById("edit-user-url").value // get data
    var username = document.getElementById("edit-user-username").value
    var password = document.getElementById("edit-user-password").value
    var email = document.getElementById("edit-user-email").value
    var notes = document.getElementById("edit-user-notes").value
    var id = document.getElementById("edit-id").textContent
    var editsCanSaveSelector = document.getElementsByClassName("settings-edits-ammount")[0]
    var editsCanSave
    for (var i = 0; i < editsCanSaveSelector.length; i++) {
        if (editsCanSaveSelector[i].selected === true) {
            editsCanSave = Number(editsCanSaveSelector[i].text)
        }
    }
    var displayPW = ""
    for (var i = 0; i < password.length; i++) {
        displayPW += "*"
    }

    fetch('/saveAccInfo', { // save data
        method: 'POST',
        body: JSON.stringify({
            address: address,
            // imgurl: "website.jpg",
            username: username,
            password: password,
            displayPW: displayPW,
            email: email,
            notes: notes,
            id: id,
            editsCanSave: editsCanSave
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: " + res.status)
        } else {
            location.href = location.href
        }
    }).catch(function (err) {
        console.log("error: " + err)
    })
}

window.onload = function() { // add all event listers
    var accountSideButton = document.getElementById("account-item")
    accountSideButton.addEventListener("click", toggleAccountSlideOut)

    var createSideButton = document.getElementById("create-item")
    createSideButton.addEventListener("click", toggleCreateSlideOut)
    
    var sortSideButton = document.getElementById("sort-item")
    sortSideButton.addEventListener("click", toggleSortSlideOut)

    // var sortChange = document.getElementById("sort-change") Work on changeSort function
    // sortChange.addEventListener("click", changeSort)

    var sortCancel = document.getElementById("sort-cancel")
    sortCancel.addEventListener("click", function() {
        location.href = location.href
    })
    
    var customizeSideButton = document.getElementById("customize-item")
    customizeSideButton.addEventListener("click", toggleCustomizeSlideOut)
    
    var settingsSideButton = document.getElementById("settings-item")
    settingsSideButton.addEventListener("click", toggleSettingsSlideOut)

    var settingsApplyChanges = document.getElementById("setttings-change")
    settingsApplyChanges.addEventListener("click", changeSettings)

    var settingsCancel = document.getElementById("settings-cancel")
    settingsCancel.addEventListener("click", toggleSettingsSlideOut)

    var deactivateButton = document.getElementById("settings-deactivate")
    deactivateButton.addEventListener("click", deactivateAccount)

    var supportSideButton = document.getElementById("support-item")
    supportSideButton.addEventListener("click", function() {
        window.open("https://www.passwordmanager/support", "_blank") // open support page that does not exist
    })
    
    var clearSearchButton = document.getElementById("clear-search-button")
    clearSearchButton.addEventListener("click", function() {
        searchBar = document.getElementsByClassName("search-bar")[0]
        searchBar.value = ""
    })

    var editClose = document.getElementsByClassName("edit-close")[0]
    editClose.addEventListener("click", closeAccountEdit)

    var editSave = document.getElementById("edit-save")
    editSave.addEventListener("click", saveAccountEdit)

    var editCancel = document.getElementById("settings-cancel")
    editCancel.addEventListener("click", function() {
        location.href = location.href
    })

    var editExit = document.getElementById("edit-exit")
    editExit.addEventListener("click", closeAccountEdit)
    
    var undoButton = document.getElementById("edit-revert")
    undoButton.addEventListener("click", undoAccount)

    var redoButton = document.getElementById("edit-rerevert")
    redoButton.addEventListener("click", redoAccount)

    var accInstEditButtons = document.getElementsByClassName("acc-inst-edit-button")
    for (var i = 0; i < accInstEditButtons.length; i++) { // add edit account listeners to all accounts
        accInstEditButtons[i].addEventListener("click", openAccountEdit)
    }

    var accInstDeleteButtons = document.getElementsByClassName("acc-inst-delete-button")
    for (var i = 0; i < accInstDeleteButtons.length; i++) { // add delete account listeners to all accounts
        accInstDeleteButtons[i].addEventListener("click", accountDelete)
    }

    var genPasswordButton = document.getElementById("create-gen-password")
    genPasswordButton.addEventListener("click", generatePassword)

    var createAccountButton = document.getElementById("create-create-account")
    createAccountButton.addEventListener("click", createAccount)

    var refreshButton = document.getElementById("create-refresh-accounts")
    refreshButton.addEventListener("click", function() {
        location.href = location.href
    })
}