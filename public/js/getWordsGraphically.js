function getInterface() {
	return getTemplate('interface');
}

function getWordTemplate() {
	return getTemplate('word');
}

function getNoWordFoundTemplate() {
	return getTemplate('no_word_found');
}

async function getWordsGraphically() {
	const url = window.url;

	const graphicInterface = await getInterface();

	document.body.appendChild(graphicInterface)

	const [button,list,found_words_title] = ["search_button","search_list","found_words_title"].map(id => graphicInterface.querySelector('#'+id));

	button.addEventListener("click", () => {
		getWords(url).then(async words => {
			list.innerHTML = "";

			found_words_title.style.display = "inline-block";
			found_words_title.querySelector("span").innerText = words.length;

			if (words.length === 0) {
				const noWordFoundTemplate = await getNoWordFoundTemplate();
				list.appendChild(noWordFoundTemplate);
			}

			for (const {word,formattedWord} of words) {
				const wordTemplate = await getWordTemplate();
				const wordButton = wordTemplate.querySelector(".word");
				wordButton.innerText = formattedWord
				wordButton.title = word;

				wordButton.addEventListener("click", () => {
					for (const letter of formattedWord) {
						pressKey(letter);
					}
					pressKey("ENTER");
				})

				list.appendChild(wordTemplate);
			}
		})
	})
}
