export {initState}

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



