function getInterface() {
    return getTemplate('interface');
}

function getWordTemplate() {
    return getTemplate('word');
}

function getNoWordFoundTemplate() {
    return getTemplate('no_word_found');
}


let pathname = location.pathname;
function checkTabOnAction() {
    setTimeout(async () => {
        const newPathname = location.pathname;
        if (newPathname !== pathname) {
            pathname = newPathname;
            showOrHideGetWordsInterface();
        } else if (getTab() === null) {
            hideGetWordsInterface();
        }
    }, 500);
}

document.body.addEventListener("click", checkTabOnAction);
document.body.addEventListener("keydown", checkTabOnAction);

function canShowGetWordsInterface() {
    return getTab() !== null && getKeyboard() !== null;
}

function showOrHideGetWordsInterface() {
    if (canShowGetWordsInterface()) {
        initKeys();
        showGetWordsInterface();
    } else
        hideGetWordsInterface();
}

async function hideGetWordsInterface() {
    const graphicInterface = await getInterface();
    if (!(graphicInterface.parentNode instanceof DocumentFragment))
        graphicInterface.style.display = "none";
}

async function showGetWordsInterface() {
    const url = window.url;

    const graphicInterface = await getInterface();

    if (graphicInterface.parentNode instanceof DocumentFragment) {
        document.body.appendChild(graphicInterface);
        graphicInterface.addEventListener("click", e => e.stopPropagation());
    }

    graphicInterface.style.display = "block"

    const [list, nb_found_words] = ["set-search_list", "set-nb_found_words"].map(id => graphicInterface.querySelector('#' + id));

    nb_found_words.parentNode.style = "none";
    list.innerHTML = "";

    const {realNbLevels} = getWordMeta();
    const nbFoundWords = getNbFoundWords();

    getWords(url).then(async words => {

        nb_found_words.parentNode.style.display = "inline-block";
        nb_found_words.innerText = words.length;

        if (words.length === 0) {
            const noWordFoundTemplate = await getNoWordFoundTemplate();
            list.appendChild(noWordFoundTemplate);
        }

        for (const {word, formattedWord} of words) {
            const wordTemplate = await getWordTemplate();
            const wordButton = wordTemplate.querySelector(".set-word");
            wordButton.innerText = formattedWord
            wordButton.title = word;

            wordButton.addEventListener("click", () => {
                for (const letter of formattedWord) {
                    pressKey(letter);
                }
                pressKey("ENTER");

                setTimeout(async () => {
                    if (canShowGetWordsInterface()) {
                        const {realNbLevels: newRealNbLevels} = getWordMeta();
                        if (newRealNbLevels > realNbLevels) {
                            showGetWordsInterface();
                            return;
                        }
                        setTimeout(() => {
                           if (nbFoundWords !== null && getTab() && getNbFoundWords() > nbFoundWords)
                               showGetWordsInterface();
                        }, 2000)
                    } else {
                        hideGetWordsInterface();
                    }
                }, 500)
            })

            list.appendChild(wordTemplate);
        }
    })
}