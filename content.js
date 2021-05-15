const APP = "yt-live-chat-app"
const TEXT_MESSAGE_RENDERER = "yt-live-chat-text-message-renderer"
const TEXT_MESSAGE_RENDERER_UPPER = TEXT_MESSAGE_RENDERER.toUpperCase()

const TIGER = image("emoji_u1f405.svg")
const TIGER_FACE = image("emoji_u1f42f.svg")

const LOG_NAME = "雪音こはくモード"

const ENABLED = "enabled"

const state = {
    chat: null,
    observer: null,
    enabled: false,
}

init()

function init() {
    const app = document.querySelector(APP)

    if (app === null) {
        warn(`\`${APP}\`が見つかりませんでした。`)
        return
    }

    const chat = app.querySelector("#chat")

    if (chat === null) {
        abort(`\`#chat\`が見つかりませんでした。`)
    }

    state.chat = chat

    chrome.storage.sync.get(ENABLED, result => {
        set(validate(result.enabled))
    })

    chrome.storage.sync.onChanged.addListener(changes => {
        if (ENABLED in changes) {
            set(validate(changes[ENABLED].newValue))
        }
    })
}

function set(enabled) {
    if (state.chat === null) {
        return
    }

    if (state.enabled === enabled) {
        return
    }

    if (enabled) {
        if (state.observer === null) {
            traverse(state.chat)
            observe(state.chat)
        } else {
            state.observer.observe(state.chat, {childList: true, subtree: true})
        }
        info("有効になりました。")
    } else {
        if (state.observer !== null) {
            state.observer.disconnect()
        }
        info("無効になりました")
    }

    state.enabled = enabled
}

function validate(enabled) {
    return enabled !== false;
}

function image(name) {
    return chrome.runtime.getURL(`images/${name}`)
}

function info(message) {
    console.info(`[${LOG_NAME}] ${message}`)
}

function warn(message) {
    console.warn(`[${LOG_NAME}] ${message}`)
}

function abort(message) {
    throw new Error(`[${LOG_NAME}] ${message}`)
}

function replace(renderer) {
    for (const emoji of renderer.querySelectorAll("img.emoji")) {
        switch (emoji.alt) {
            // 歩いてるトラ（🐅）
            case "\u{1F405}": {
                emoji.src = TIGER
                break
            }
            // トラの顔（🐯）
            case "\u{1F42F}": {
                emoji.src = TIGER_FACE
                break
            }
        }
    }
}

function traverse(chat) {
    for (const renderer of chat.querySelectorAll(TEXT_MESSAGE_RENDERER)) {
        replace(renderer)
    }
}

function observe(chat) {
    const observer = new MutationObserver((records) => {
        records.forEach(record => record.addedNodes.forEach(node => {
            if (node.nodeName !== TEXT_MESSAGE_RENDERER_UPPER) {
                return
            }

            replace(node)
        }))
    })

    observer.observe(chat, {childList: true, subtree: true})

    state.observer = observer
}
