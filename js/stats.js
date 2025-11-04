export {initState, crearNuevoInitState, updateStats, successRate, getStats}

let initState = function(what, solutionId) {

    let arrayResult = []
    let stored = localStorage.getItem(what)

    if (!stored) {
        arrayResult[0] = {
            "guesses": [],
            "solution": solutionId
        }
        localStorage.setItem(what, JSON.stringify(arrayResult[0]));
    } else {
        arrayResult[0] = JSON.parse(stored);
/*
            // Se limpian los datos del localStorage (para pruebas)
        localStorage.removeItem(what);
        arrayResult[0] = {
            "guesses": [],
            "solution": solutionId
        }
*/
        localStorage.setItem(what, JSON.stringify(arrayResult[0]));


    }

    arrayResult[1] = function (guess){

        let state = localStorage.getItem(what)
        state = JSON.parse(state)
        state.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(state))
        arrayResult[0] = state;
    }

    return arrayResult
}

let crearNuevoInitState = function(what, solutionId) {

    localStorage.removeItem(what);

    let arrayResult = []

    arrayResult[0] = {
        "guesses": [],
        "solution": solutionId
    }

    localStorage.setItem(what, JSON.stringify(arrayResult[0]));

    arrayResult[1] = function (guess){

        let state = localStorage.getItem(what)
        state = JSON.parse(state)
        state.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(state))
        arrayResult[0] = state;
    }

    return arrayResult
}


function successRate(e){
    return e.successRate;
}
function getStats(what){
    let storage=localStorage.getItem(what)
    if (!storage){
        let stats={
        winDistribution: [0,0,0,0,0,0,0,0,0],
        gamesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalGames: 0,
        successRate: 0
        }
        localStorage.setItem(what, JSON.stringify(stats))
        return stats
    }
    return JSON.parse(storage)
};


function updateStats(t){
    let nuevasStats=gamestats
    let haGanado=t<8
    nuevasStats.gamesFailed= haGanado ? nuevasStats.gamesFailed : nuevasStats.gamesFailed + 1
    nuevasStats.currentStreak= haGanado ? nuevasStats.currentStreak + 1 : 0
    nuevasStats.bestStreak= nuevasStats.currentStreak > nuevasStats.bestStreak ? nuevasStats.currentStreak : nuevasStats.bestStreak
    nuevasStats.totalGames=nuevasStats.totalGames + 1
    if (haGanado) {
        nuevasStats.winDistribution[t-1] = nuevasStats.winDistribution[t-1] + 1
    }
    nuevasStats.successRate= (nuevasStats.totalGames-nuevasStats.gamesFailed)/nuevasStats.totalGames

    localStorage.setItem('gameStats', JSON.stringify(nuevasStats))
};


let gamestats = getStats('gameStats');



