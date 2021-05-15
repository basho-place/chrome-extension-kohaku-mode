const APP = "yt-live-chat-app"
const TEXT_MESSAGE_RENDERER = "yt-live-chat-text-message-renderer"
const TEXT_MESSAGE_RENDERER_UPPER = TEXT_MESSAGE_RENDERER.toUpperCase()

const TIGER = image("emoji_u1f405.svg")
const TIGER_FACE = image("emoji_u1f42f.svg")

const LOG_NAME = "雪音こはくモード"

init()

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

function traverse(items) {
    for (const renderer of items.querySelectorAll(TEXT_MESSAGE_RENDERER)) {
        replace(renderer)
    }
}

function observe(items) {
    const observer = new MutationObserver((records) => {
        records.forEach(record => record.addedNodes.forEach(node => {
            if (node.nodeName !== TEXT_MESSAGE_RENDERER_UPPER) {
                return
            }

            replace(node)
        }))
    })

    observer.observe(items, {childList: true, subtree: true})
}

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

    info("有効になりました。")
    traverse(chat)
    observe(chat)
}
