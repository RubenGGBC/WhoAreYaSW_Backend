import { differenceInDays } from './main.js';
import { stringToHTML, higher, lower, stats, headless, toggle } from './fragments.js';
import { initState, crearNuevoInitState, updateStats } from './stats.js';
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....
const delay = 350;

function getGeneration(pokemonId) {
    const id = Number(pokemonId);
    if (id >= 1 && id <= 151) return 1;
    if (id >= 152 && id <= 251) return 2;
    if (id >= 252 && id <= 386) return 3;
    if (id >= 387 && id <= 493) return 4;
    if (id >= 494 && id <= 649) return 5;
    if (id >= 650 && id <= 721) return 6;
    if (id >= 722 && id <= 809) return 7;
    if (id >= 810 && id <= 905) return 8;
    if (id >= 906 && id <= 1025) return 9;
    return 0;
}

export let setupRows = function (game) {

    let [state, updateState] = initState('WITPgamestate', game.solution.pokemonId)

    let getPokemon = function (pokemonId) {
        return game.pokemons.find(pokemon => Number(pokemon.pokemonId) === Number(pokemonId));
    }

    let check = function (theKey, theValue) {
        let valorjson = game.solution[theKey];
        if (theKey === 'generation') {
            let solGen = getGeneration(game.solution.pokemonId);
            let guessGen = Number(theValue);
            if (solGen === guessGen) {
                return "correct";
            } else if (solGen > guessGen) {
                return "higher";
            } else {
                return "lower";
            }
        }
        if (theKey === 'weight') {
            let solWeight = Number(valorjson);
            let guessWeight = Number(theValue);
            if (solWeight === guessWeight) {
                return "correct";
            } else if (solWeight > guessWeight) {
                return "higher";
            } else {
                return "lower";
            }
        }
        if (valorjson === theValue) {
            return "correct";
        } else {
            return "incorrect";
        }
    }

    function recuperarPartida() {

        if (state.solution !== game.solution.pokemonId) {
            [state, updateState] = crearNuevoInitState('WITPgamestate', game.solution.pokemonId)
        }
        else{
            if(state.guesses.length > 0) {

                game.guesses = state.guesses;

                for (let i = 0; i < game.guesses.length; i++) {
                    let guessId = game.guesses[i]

                    let guess = getPokemon(guessId);

                    let content = setContent(guess)
                    showContent(content, guess)

                }

                let pokemonId = game.guesses[game.guesses.length - 1];

                if (gameEnded(pokemonId)) {

                    if (pokemonId == game.solution.pokemonId) {
                        success();
                    }

                    if (game.guesses.length === 8) {
                        gameOver();
                    }
                }
            }
        }
    }

    recuperarPartida();

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                const misteryEl = document.getElementById("mistery");
                const comboboxEl = document.getElementById("combobox");
                
                if (misteryEl) {
                    misteryEl.classList.remove("blur");
                }
                
                if (comboboxEl) {
                    comboboxEl.remove();
                }
                
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The pokémon was " + game.solution.pokemonName
                }
                
                const picboxEl = document.getElementById("picbox");
                if (picboxEl) {
                    picboxEl.innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`;
                }
                resolve();
            }, "2000")
        })
    }

    function success(){
        unblur('success').then( () => {
            showStats(2000);
        })
    }

    function gameOver(){
        unblur('gameover').then( () => {
            showStats(2000);
        })
    }
     function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));

                let interval = setInterval(() => {
                    let now = new Date();
                    let midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);

                    let diff = midnight - now;

                    let hours = Math.floor(diff / (1000 * 60 * 60));
                    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    let nextPlayerElement = document.getElementById("nextPlayer");
                    if (nextPlayerElement) {
                        nextPlayerElement.textContent =
                            String(hours).padStart(2, '0') + ':' +
                            String(minutes).padStart(2, '0') + ':' +
                            String(seconds).padStart(2, '0');
                    } else {
                        clearInterval(interval);
                    }
                }, 1000);

                let showHideBtn = document.getElementById("showHide");
                if (showHideBtn) {
                    showHideBtn.onclick = toggle;
                }

                bindClose();
                resolve();
            }, timeout)
        })
    }
     function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("blur")
        }
    }

    function setContent(guess) {
        let generation = getGeneration(guess.pokemonId);
        let genContent = `Gen ${generation}`;
        let genCheck = check('generation', generation);
        if (genCheck === 'higher') {
            genContent += higher;
        } else if (genCheck === 'lower') {
            genContent += lower;
        }

        let weightContent = `${guess.weight}`;
        let weightCheck = check('weight', guess.weight);
        if (weightCheck === 'higher') {
            weightContent += higher;
        } else if (weightCheck === 'lower') {
            weightContent += lower;
        }

        return [
            {
                content: genContent,
                label: 'GEN',
                checkResult: genCheck
            },
            {
                content: `${guess.type1}`,
                label: 'TYPE 1',
                checkResult: check('type1', guess.type1)
            },
            {
                content: `${guess.type2}`,
                label: 'TYPE 2',
                checkResult: check('type2', guess.type2)
            },
            {
                content: weightContent,
                label: 'WEIGHT',
                checkResult: weightCheck
            }
        ]
    }

    function resetInput(){
        let input = document.getElementById("myInput");
        input.placeholder = `Guess ${game.guesses.length + 1} of 8`;
        input.value = "";
    }

    function gameEnded(lastGuess){
        return (Number(lastGuess) === Number(game.solution.pokemonId)) || (game.guesses.length >= 8)
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="flex-1 min-w-0 flex justify-center">
                <div class="flex flex-col items-center gap-1">
                    <div class="mx-1 overflow-hidden w-full shadowed font-bold text-sm flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${content[j].checkResult == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 75px; min-height: 75px; animation-delay: ${s};">
                        <div class="flex items-center justify-center w-full h-full p-1">
                            ${content[j].content}
                        </div>
                    </div>
                    <div class="text-xs font-semibold text-gray-600 opacity-0 fadeInDown" style="animation-delay: ${s};">
                        ${content[j].label}
                    </div>
                </div>
             </div>`
        }

        let child = `<div class="flex flex-col w-full text-l py-2">
            <div class="w-full text-center pb-2">
                <div class="mx-1 overflow-hidden h-full flex items-center justify-center px-4 uppercase font-bold text-lg opacity-0 fadeInDown" style="animation-delay: 0ms;">
                    ${guess.pokemonName}
                </div>
            </div>
            <div class="flex w-full justify-center gap-1">
                ${fragments}
            </div>
        </div>`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    resetInput();

    return /* addRow */ function (pokemonId) {

        let guess = getPokemon(pokemonId)

        let content = setContent(guess)

        game.guesses.push(pokemonId)
        updateState(pokemonId)

        resetInput();

        if (gameEnded(pokemonId)) {
             updateStats(game.guesses.length);

            if (pokemonId == game.solution.pokemonId) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }
        }


        showContent(content, guess)
    }
    
}
