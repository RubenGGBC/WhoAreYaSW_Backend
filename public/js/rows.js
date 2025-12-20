import { differenceInDays } from './main.js';
import { stringToHTML, higher, lower, stats, headless, toggle } from './fragments.js';
import { initState, crearNuevoInitState, updateStats } from './stats.js';
// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate', 'number']


export let setupRows = function (game) {

    let [state, updateState] = initState('WAYgameState', game.solution.id)

    let getPlayer = function (playerId) {
        return game.players.find(player => Number(player.id) === Number(playerId));
    }

    let check = function (theKey, theValue) {
        let valorjson = game.solution[theKey];
        if (theKey === 'birthdate') {
            let edadjson = getAge(valorjson);
            let edadAdivinar = getAge(theValue);
            if (edadjson === edadAdivinar) {
                return "correct";
            } else if (edadjson > edadAdivinar) {
                return "higher";
            } else {
                return "lower";
            }
        }
        if (theKey === 'number') {
            let solNum = Number(valorjson);
            let guessNum = Number(theValue);
            if (solNum === guessNum) {
                return "correct";
            } else if (solNum > guessNum) {
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

        if (state.solution !== game.solution.id) {
            [state, updateState] = crearNuevoInitState('WAYgameState', game.solution.id)
        }
        else{
            if(state.guesses.length > 0) {

                game.guesses = state.guesses;

                for (let i = 0; i < game.guesses.length; i++) {
                    let guessId = game.guesses[i]

                    let guess = getPlayer(guessId);

                    let content = setContent(guess)
                    showContent(content, guess)

                }

                let playerId = game.guesses[game.guesses.length - 1];

                if (gameEnded(playerId)) {

                    if (playerId == game.solution.id) {
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

    function leagueToFlag(leagueId) {

        const leagueMap = {
            564: 'es1',
            8: 'en1', 
            82: 'de1',
            384: 'it1',
            301: 'fr1'
        };
        return leagueMap[leagueId];
    }


    function getAge(dateString) {
        let fechaN = new Date(dateString);
        let diferenciadias = differenceInDays(fechaN);
        let edad = Math.floor(diferenciadias / 365.25);
        return edad;
    }

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
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
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }

    function setContent(guess) {
        let ageContent = `${getAge(guess.birthdate)}`;
        let ageCheck = check('birthdate', guess.birthdate);
        if (ageCheck === 'higher') {
            ageContent += higher;
        } else if (ageCheck === 'lower') {
            ageContent += lower;
        }

        let numberContent = `#${guess.number}`;
        let numberCheck = check('number', guess.number);
        if (numberCheck === 'higher') {
            numberContent += higher;
        } else if (numberCheck === 'lower') {
            numberContent += lower;
        }

        return [
            {
                content: `<img src="/images/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
                label: 'NAT'
            },
            {
                content: `<img src="/images/leagues/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
                label: 'LGE'
            },
            {
                content: `<img src="/images/teams/${guess.teamId}.png" alt="" style="width: 60%;">`,
                label: 'TEAM'
            },
            {
                content: `${guess.position}`,
                label: 'POS'
            },
            {
                content: ageContent,
                label: 'AGE'
            },
            {
                content: numberContent,
                label: 'SHIRT'
            }
        ]
    }

    function resetInput(){
        let input = document.getElementById("myInput");
        input.placeholder = `Guess ${game.guesses.length + 1} of 8`;
        input.value = "";
    }

    function gameEnded(lastGuess){
        return (Number(lastGuess) === Number(game.solution.id)) || (game.guesses.length >= 8)
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="flex-1 min-w-0 flex justify-center">
                <div class="flex flex-col items-center gap-1">
                    <div class="mx-1 overflow-hidden w-full shadowed font-bold text-base flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; min-height: 60px; animation-delay: ${s};">
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
                    ${guess.name}
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

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
             updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }
        }


        showContent(content, guess)
    }
    
}
