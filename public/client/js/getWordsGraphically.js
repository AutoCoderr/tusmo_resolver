function getDOMNodeFromHtml(html) {
	const template = document.createElement("template")
	template.innerHTML = html;
	return template.content.firstChild;
}

function getInterface(url = window.url) {
	return fetch(url+"/client/html/template.html")
		.then(res => res.text())
		.then(html => getDOMNodeFromHtml(html))
}

let wordTemplate = null;

async function getWordTemplate(url = window.url) {
	return wordTemplate ??
		fetch(url+"/client/html/word_template.html")
			.then(res => res.text())
			.then(html => {
				wordTemplate = getDOMNodeFromHtml(html)
				return wordTemplate;
			})
}

async function getWordsGraphically(url = window.url) {
	const graphicInterface = await getInterface(url);

	document.body.appendChild(graphicInterface)

	const [button,list] = ["search_button","search_list"].map(id => graphicInterface.querySelector('#'+id));

	button.addEventListener("click", () => {
		getWords(url).then(async words => {
			list.innerHTML = "";
			for (const {word,formattedWord} of words) {
				const wordTemplate = await getWordTemplate(url).then(template => template.cloneNode(true));
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
