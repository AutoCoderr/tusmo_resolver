function getDOMNodeFromHtml(html) {
    const template = document.createElement("template")
    template.innerHTML = html;
    return template.content.firstChild;
}

function getDOMNodeFromTemplate(template) {
    const url = window.url;

    return fetch(url+"html/"+template+"_template.html")
        .then(res => res.text())
        .then(html => getDOMNodeFromHtml(html))
}

const templates = {
    interface: {
        cache: true,
        cloneNode: false
    },
    no_word_found: {
        cache: true,
        cloneNode: true
    },
    word: {
        cache: true,
        cloneNode: true
    }
}

const cache = {};

async function getTemplate(template) {
    if (!templates[template])
        throw new Error("Template '"+template+"' not found");

    const templateNode = cache[template] ?? await getDOMNodeFromTemplate(template)

    if (!cache[template] && templates[template].cache)
        cache[template] = templateNode;

    return templates[template].cloneNode ? templateNode.cloneNode(true) : templateNode
}