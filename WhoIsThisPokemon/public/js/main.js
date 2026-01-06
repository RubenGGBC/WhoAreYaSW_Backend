import { folder, leftArrow } from "./fragments.js";
import { fetchJSON, fetchCurrentGame, fetchSolution } from "./loaders.js";
import { setupRows } from "./rows.js";
import { autocomplete } from "./autocomplete.js";

export function differenceInDays(date1) {
    let today_date = new Date();
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

async function initGame() {
  try {
    game.pokemons = await fetchJSON("pokedex-1-1000");
    console.log('Pokémon cargados:', game.pokemons.length);

    const currentGame = await fetchCurrentGame();
    const gameNumber = currentGame.gameNumber || difference_In_Days;

    document.getElementById("gamenumber").innerText = gameNumber.toString();

    let solutionData;
    try {
      solutionData = await fetchSolution(gameNumber);
    } catch (solutionError) {
      console.error('Error obteniendo solución:', solutionError);

      const root = document.getElementById('root');
      if (root) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'padding: 20px; margin: 20px; background: #fffbeb; border: 2px solid #fbbf24; border-radius: 8px; color: #92400e;';
        errorDiv.innerHTML = `
          <h3>No hay solución para el juego actual</h3>
          <p>La base de datos no tiene soluciones creadas. Por favor ejecuta:</p>
          <pre style="background: #fef3c7; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>npm run seed</code></pre>
          <p>Esto poblará la base de datos con:</p>
          <ul>
            <li>1000 Pokémon</li>
            <li>365 soluciones diarias</li>
          </ul>
          <p><small>Error: ${solutionError.message}</small></p>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Recargar página
          </button>
        `;
        root.prepend(errorDiv);
      }
      return;
    }

    const solutionId = solutionData.pokemonId;

    game.solution = game.pokemons.find(p => Number(p.pokemonId) === Number(solutionId));

    if (!game.solution) {
      console.error('No se encontró el Pokémon solución:', solutionId);
      game.solution = game.pokemons[0];
    }


    const misteryEl = document.getElementById("mistery");
    if (misteryEl) {
      misteryEl.src = `/images/pokemon/${game.solution.pokemonId}.png`;
    }


    autocomplete(document.getElementById("myInput"), game);

    if (typeof setupRows === 'function') {
      setupRows(game);
    }

    console.log('Juego inicializado:', game);

  } catch (error) {
    console.error('Error inicializando el juego:', error);

    const root = document.getElementById('root');
    if (root) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.cssText = 'padding: 20px; margin: 20px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;';
      errorDiv.innerHTML = `
        <h3>Error al cargar el juego</h3>
        <p>No se pudo conectar con el servidor. Por favor:</p>
        <ol>
          <li>Verifica que el servidor esté corriendo en <code>http://localhost:3000</code></li>
          <li>Ejecuta: <code>npm start</code> en la carpeta del proyecto</li>
          <li>Si es la primera vez, ejecuta: <code>npm run seed</code></li>
          <li>Recarga la página</li>
        </ol>
        <p><small>Error: ${error.message}</small></p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recargar página
        </button>
      `;
      root.prepend(errorDiv);
    }
  }
}

// Iniciar el juego
initGame();

