const {getLens, getWordModel} = require("./models/Word");
require("./libs/public/arrayFunctions");

async function initWordEntropies() {
	Promise.all(getLens().map(async len => {
		const Word = await getWordModel(len);

		return Word.find()
			.then(words =>
				Promise.all(words.map(({word}) =>
					Word.find({word: {$ne: word}})
						.then(words =>
							words.reduce((acc,{word}) => ({

							}), {})
						)
				))
			)
	}))
}
