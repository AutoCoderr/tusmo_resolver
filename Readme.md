# Ceci est un projet visant à trouver automatiquement les réponse au jeux du tusmo

### Setup depuis le client :

Executer le script suivant dans la console de votre navigateur, dans une partie de tusmo  
(en mettant l'url de votre api dans window.url)  

Un encadré s'affichera en haut à droite de l'écran, avec la possibilité de rechercher des mots  
et de les sélectionner
```js
    window.url = "http://127.0.0.1:3000/";

    const scriptFiles = [
    	"js/numberFunctions.js",
        "js/getDOMDatas.js",
        "js/getLevelInfos.js",
        "js/getWords.js",
        "js/getWordsGraphically.js",
        "js/pressKey.js",
        "js/templateGetter.js"
    ]

    for (const scriptFile of scriptFiles) {
		const script = document.createElement('script');

		script.src = window.url+scriptFile;

		document.head.appendChild(script);
    }
    
    const cssFiles = [
        "css/style.css"
    ]

    for (const cssFile of cssFiles) {
        const link = document.createElement("link");
        
        link.href = window.url+cssFile;
        link.rel = "stylesheet";
        
        document.head.appendChild(link);
    }
    
    setTimeout(() => {
        showOrHideGetWordsInterface()
    }, 1000);
```