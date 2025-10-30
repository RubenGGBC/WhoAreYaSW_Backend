import { differenceInDays } from './main.js';
import { stringToHTML, higher, lower } from './fragments.js';
// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


export let setupRows = function (game) {


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
        if (valorjson === theValue) {
            return "correct";
        } else {
            return "incorrect";
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
        
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            ageContent
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    let getPlayer = function (playerId) {
        return game.players.find(player => Number(player.id) === Number(playerId));
    }

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)

        if (!guess) {
            console.error('Player not found with ID:', playerId);
            return;
        }

        let content = setContent(guess)
        showContent(content, guess)
    }
}
