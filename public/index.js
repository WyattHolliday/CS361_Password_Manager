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
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
        closeOtherSlides("create-slideout")
    } else {
        Slideout.classList.add("hidden")
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
    var Slideouts = document.getElementsByClassName("slideout-page")
    for (var i = 0; i < Slideouts.length; i++) {
        if(Slideouts[i].id != currSlide) {
            Slideouts[i].classList.add("hidden")
        }
    }
}

function closeAccountEdit() {
    accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
    accountEditContainer.classList.add("hidden")
    document.getElementById("edit-url").value = "www.website.com"
    document.getElementById("edit-user-username").value = "Username"
    document.getElementById("edit-user-password").value = "Password"
    document.getElementById("edit-user-email").value = "email@gmail.com"
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

    // var supportSideButton = document.getElementById("support-item")
    // supportSideButton.addEventListener("click", function() {
    //     window.open("https://www.passwordmanager/support", "_blank")
    // })
    
    var clearSearchButton = document.getElementById("clear-search-button")
    clearSearchButton.addEventListener("click", function() {
        searchBar = document.getElementsByClassName("search-bar")[0]
        searchBar.value = ""
    })

    var editClose = document.getElementsByClassName("edit-close")[0]
    editClose.addEventListener("click", closeAccountEdit)
    var revertButton = document.getElementById("edit-revert")
    revertButton.addEventListener("click", closeAccountEdit)

    var accInstEditButton = document.getElementById("acc-inst-edit-button")
    accInstEditButton.addEventListener("click", function() {
        var accountEditContainer = document.getElementsByClassName("account-edit-container")[0]
        accountEditContainer.classList.remove("hidden")
    })

    document.getElementById("edit-url").value = "www.website.com"
    document.getElementById("edit-user-username").value = "Username"
    document.getElementById("edit-user-password").value = "Password"
    document.getElementById("edit-user-email").value = "email@gmail.com"

    genPasswordButton = document.getElementById("create-gen-password")
    genPasswordButton.addEventListener("click", function() {
        fetch('/generate_password', {
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
    })
}