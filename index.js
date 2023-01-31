function toggleAccountSlideOut(event) {
    var Slideout = document.getElementById("account-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleCreateSlideOut(event) {
    var Slideout = document.getElementById("create-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleSortSlideOut(event) {
    var Slideout = document.getElementById("sort-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleCustomizeSlideOut(event) {
    var Slideout = document.getElementById("customize-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleSettingsSlideOut(event) {
    var Slideout = document.getElementById("settings-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
}

function toggleSupportSlideOut(event) {
    var Slideout = document.getElementById("support-slideout")
    if (Slideout.classList.contains("hidden")) {
        Slideout.classList.remove("hidden")
    } else {
        Slideout.classList.add("hidden")
    }
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

    var supportSideButton = document.getElementById("support-item")
    supportSideButton.addEventListener("click", toggleSupportSlideOut)

    
    var clearSearchButton = document.getElementById("clear-search-button")
    clearSearchButton.addEventListener("click", function() {
        searchBar = document.getElementsByClassName("search-bar")[0]
        searchBar.value = ""
    })
}