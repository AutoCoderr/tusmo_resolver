const keysByLetter = {}

setTimeout(() => {
    for (const {node,key} of getKeys())
        keysByLetter[key] = node
}, 1000);

function pressKey(letter) {
    if (!keysByLetter[letter])
        throw new Error("Lettre '"+letter+"' introuvable");

    keysByLetter[letter].click();
}

