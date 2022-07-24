let keysByLetter = {}

function initKeys() {
    keysByLetter = {};
    for (const {node, key} of getKeys())
        keysByLetter[key] = node
}

function pressKey(letter) {
    if (!keysByLetter[letter])
        throw new Error("Lettre '"+letter+"' introuvable");

    keysByLetter[letter].click();
}

