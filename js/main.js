import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from "./rows.js";
import { autocomplete } from "./autocomplete.js";

export function differenceInDays(date1) {
    // Ejercicio 1:
    let today_date = new Date();
    // Calculamos la diferencia de tiempo en ms y luego la convertimos a días (con Math.ceil para redondear hacia arriba)
    let time_difference = today_date.getTime() - date1.getTime();
    let days_difference = Math.ceil(time_difference / (1000 * 3600 * 24));
    return days_difference;
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));
window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
    // Ejercicio 3:
    let index = (difference_In_Days - 1) % solutionArray.length
    let solutionId = solutionArray[index];
    let solutionPlayer = players.filter(player => Number(player.id) === Number(solutionId));
    return solutionPlayer[0];
}

Promise.all([fetchJSON("fullplayers25"), fetchJSON("solution25")]).then(
  (values) => {

    let solution;

    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;
  
    autocomplete(document.getElementById("myInput"), game);
  }
);
