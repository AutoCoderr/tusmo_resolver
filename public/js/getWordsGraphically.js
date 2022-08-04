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
    }, 1000);
}

document.body.addEventListener("click", checkTabOnAction);
document.body.addEventListener("keydown", checkTabOnAction);

function showOrHideGetWordsInterface() {
    if (canPlayTusmo()) {
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

    const graphicInterface = await getInterface();

    if (graphicInterface.parentNode instanceof DocumentFragment) {
        document.body.appendChild(graphicInterface);
        graphicInterface.addEventListener("click", e => e.stopPropagation());
    }

    graphicInterface.style.display = "block"

    const [list, nb_found_words] = ["set-search_list", "set-nb_found_words"].map(id => graphicInterface.querySelector('#' + id));

    nb_found_words.parentNode.style = "none";
    list.innerHTML = "";

    const {nbLevels, lenWord} = getWordMeta();

    getWords({
        len: lenWord,
        levels: nbLevels.map(i => getLevelInfos(i))
    }).then(async words => {

        nb_found_words.parentNode.style.display = "inline-block";
        nb_found_words.innerText = words.length;

        if (words.length === 0) {
            const noWordFoundTemplate = await getNoWordFoundTemplate();
            list.appendChild(noWordFoundTemplate);
        }

        for (const {word,percentUse} of words) {
            const wordTemplate = await getWordTemplate();
            const wordButton = wordTemplate.querySelector(".set-word");
            wordButton.innerText = word+(percentUse ? ' ('+(Math.round(percentUse*1000)/1000)+'%)' : '');

            wordButton.addEventListener("click", () => {
                tryWord(
                    word,
                    hideGetWordsInterface,
                    showGetWordsInterface,
                    showGetWordsInterface
                )
            })

            list.appendChild(wordTemplate);
        }
    })
}
