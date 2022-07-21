# Ceci est un projet visant à trouver automatiquement les réponse au jeux du tusmo

### Setup depuis le client :

Executer le script suivant dans la console de votre navigateur, dans une partie de tusmo  
(en mettant l'url de votre api dans window.url)  

Un encadré s'affichera en haut à droite de l'écran, avec la possibilité de rechercher des mots  
et de les sélectionner
```js
    window.url = "http://127.0.0.1:3000/";

    const scriptFiles = [
    	"libs.js",
        "client/getDOMDatas.js",
        "client/getLevelInfos.js",
        "client/getWords.js", 
        "client/getWordsGraphically.js"
    ]

    for (const scriptFile of scriptFiles) {
		const script = document.createElement('script');

		script.src = window.url+scriptFile;

		document.head.appendChild(script)	
    }
    
    setTimeout(() => getWordsGraphically(), 1000)
```
