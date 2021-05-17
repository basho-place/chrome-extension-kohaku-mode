const ICON_ENABLED = {
    path: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    }
}

const ICON_DISABLED = {
    path: {
        "16": "icons/gray16.png",
        "32": "icons/gray32.png",
        "48": "icons/gray48.png",
        "128": "icons/gray128.png"
    }
}

const ENABLED = "enabled"

function validate(enabled) {
    return enabled !== false;
}

function getEnabled(callback) {
    chrome.storage.sync.get(ENABLED, result => {
        callback(validate(result.enabled))
    })
}

function setEnabled(value) {
    chrome.storage.sync.set({enabled: value})
}

function updateIcon(enabled) {
    if (enabled) {
        chrome.action.setIcon(ICON_ENABLED)
    } else {
        chrome.action.setIcon(ICON_DISABLED)
    }
}

getEnabled(enabled => {
    updateIcon(enabled)
})

chrome.storage.sync.onChanged.addListener(changes => {
    if (ENABLED in changes) {
        updateIcon(validate(changes[ENABLED].newValue))
    }
})

chrome.action.onClicked.addListener(() => {
    getEnabled(enabled => {
        setEnabled(!enabled)
    })
})
