function createInterface() {
	const div = document.createElement("div");
	for (const [key,value] of Object.entries({
		position: "fixed",
		top: "0",
		right: "0",
		width: "300px",
		height: "300px",
		backgroundColor: "#EEE"
	}))
		div.style[key] = value

	const button = document.createElement("button");
	button.innerText = "Rechercher des mots"
	button.classList.add("search-words-button");

	div.appendChild(button);

	const ul = document.createElement("ul");
	ul.classList.add("word-list");

	div.appendChild(ul);

	return div;
}

function getWordsGraphically(url = window.url) {
	const graphicInterface = createInterface();

	document.body.appendChild(graphicInterface)

	const [button,ul] = ["button","ul"].map(tag => graphicInterface.querySelector(tag));

	button.addEventListener("click", () => {
		getWords(url).then(words => {
			ul.innerHTML = "";

			for (const {word,formattedWord} of words) {
				const li = document.createElement("li");
				li.innerText = formattedWord
				li.title = word;

				ul.appendChild(li);
			}
		})
	})
}
