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
  pokemons: [],
  
};

function getSolution(pokemons, solutionArray, difference_In_Days) {
    // Ejercicio 3:
    let index = (difference_In_Days - 1) % solutionArray.length
    let solutionId = solutionArray[index];
    let solutionPokemon = pokemons.filter(pokemon => Number(pokemon.pokemonId) === Number(solutionId));
    return solutionPokemon[0];
}

Promise.all([fetchJSON("pokedex-1-1000"), fetchJSON("pokemonSolutions")]).then(
  (values) => {

    let solution;

    [game.pokemons, solution] = values;

    game.solution = getSolution(game.pokemons, solution, difference_In_Days);

    document.getElementById("mistery").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${game.solution.pokemonId}.png`;
    console.log(game);
    autocomplete(document.getElementById("myInput"), game);
  }
);
