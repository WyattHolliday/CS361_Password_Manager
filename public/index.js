function toggleAccountSlideOut(event) {
    var Slideout = document.getElementById("account-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("account-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleCreateSlideOut(event) {
    var Slideout = document.getElementById("create-slideout")
    var createPrompt = document.getElementsByClassName("prompt-create-container")[0]
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        if (createPrompt) {
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
          res.text().then(function (text) {
            document.getElementById("create-password-input").value = text
          })
        } else {
          console.log("error: " + res.status)
        }
      }).catch(function (err) {
        console.log("error: " + err)
      })
}

function createAccount() {
    var address = document.getElementById("create-address-input")
    var username = document.getElementById("create-username-input")
    var password = document.getElementById("create-password-input")
    var email = document.getElementById("create-email-input")
    var notes = document.getElementById("create-notes")
    if (address.value === "" || username.value === "" || password.value === "") {
        alert("Address, username and password fields must be filled out")
    } else {
        fetch('/addAccInfo', {
            method: 'POST',
            body: JSON.stringify({
                address: address.value,
                imgurl: "website.jpg",
                username: username.value,
                password: password.value,
                email: email.value,
                notes: notes.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            if (res.status != 200) {
                console.log("error: " + res.status)
            } else {
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

function toggleSortSlideOut(event) {
    var Slideout = document.getElementById("sort-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("sort-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleCustomizeSlideOut(event) {
    var Slideout = document.getElementById("customize-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("customize-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleSettingsSlideOut(event) {
    var Slideout = document.getElementById("settings-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("settings-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function deactivateAccount() {
    // confirm
    fetch("/deactivate", {
        method: 'POST'
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: ", res.status)
        } else {
            location.href = location.href
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

function toggleSupportSlideOut(event) {
    var Slideout = document.getElementById("support-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("support-slideout")
    } else {
        Slideout.classList.add("hidden")
    }
}

function closeOtherSlides(currSlide) {
    var createPrompt = document.getElementsByClassName("prompt-create-container")[0]
    if (currSlide != "create-slideout" && createPrompt) {
        createPrompt.classList.remove("hidden")
    }
    var Slideouts = document.getElementsByClassName("slideout-page")
    for (var i = 0; i < Slideouts.length; i++) {
        if(Slideouts[i].id != currSlide) {
            Slideouts[i].classList.add("hidden")
        }
    }
}

function accountDelete(e) {
    var textContainer = e.target.parentNode.parentNode
    var id = textContainer.childNodes[7].textContainer
    fetch("/accInstDelete", {
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
            location.href = location.href
        }
    }).catch(function (err) {
        console.log("error: ", err)
    })
}

function openAccountEdit(e) {
    var accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
    accountEditContainer.classList.remove("hidden")
    var textContainer = e.target.parentNode.parentNode
    var id = textContainer.childNodes[7].textContent

    fetch('/getAccountData', {
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
            res.json().then(function (accData) {
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

function closeAccountEdit() {
    accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
    accountEditContainer.classList.add("hidden")
}

function saveAccountEdit() {
    var address = document.getElementById("edit-user-url").value
    var username = document.getElementById("edit-user-username").value
    var password = document.getElementById("edit-user-password").value
    var email = document.getElementById("edit-user-email").value
    var notes = document.getElementById("edit-user-notes").value
    var id = document.getElementById("edit-id").textContent
    var displayPW = ""
    for (var i = 0; i < password.length; i++) {
        displayPW += "*"
    }

    fetch('/saveAccInfo', {
        method: 'POST',
        body: JSON.stringify({
            address: address,
            // imgurl: "website.jpg",
            username: username,
            password: password,
            displayPW: displayPW,
            email: email,
            notes: notes,
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        if (res.status != 200) {
            console.log("error: " + res.status)
        } else {
            console.log("refreshing")
            location.href = location.href
        }
    }).catch(function (err) {
        console.log("error: " + err)
        console.error(err)
    })
}

window.onload = function() {
    var accountSideButton = document.getElementById("account-item")
    accountSideButton.addEventListener("click", toggleAccountSlideOut)

    var createSideButton = document.getElementById("create-item")
    createSideButton.addEventListener("click", toggleCreateSlideOut)
    
    var sortSideButton = document.getElementById("sort-item")
    sortSideButton.addEventListener("click", toggleSortSlideOut)
    
    var customizeSideButton = document.getElementById("customize-item")
    customizeSideButton.addEventListener("click", toggleCustomizeSlideOut)
    
    var settingsSideButton = document.getElementById("settings-item")
    settingsSideButton.addEventListener("click", toggleSettingsSlideOut)

    var deactivateButton = document.getElementById("settings-deactivate")
    deactivateButton.addEventListener("click", deactivateAccount)

    var supportSideButton = document.getElementById("support-item")
    supportSideButton.addEventListener("click", function() {
        window.open("https://www.passwordmanager/support", "_blank")
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

    
    var revertButton = document.getElementById("edit-revert")
    revertButton.addEventListener("click", closeAccountEdit)

    var accInstEditButtons = document.getElementsByClassName("acc-inst-edit-button")
    for (var i = 0; i < accInstEditButtons.length; i++) {
        accInstEditButtons[i].addEventListener("click", openAccountEdit)
    }

    var accInstDeleteButtons = document.getElementsByClassName("acc-inst-delete-button")
    for (var i = 0; i < accInstDeleteButtons.length; i++) {
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