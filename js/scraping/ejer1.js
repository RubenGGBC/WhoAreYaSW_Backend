fetch('http://api.football-data.org/v4/competitions')
    .then(
        r => r.json())
    .then(
        data => {
            //Pregunta 1:
            let laliga = data.competitions.filter(comp => comp.id === 2014)
            console.log(laliga)

            //Pregunta 2:
            let grandes_ligas = data.competitions.filter(comp => comp.plan === 'TIER_ONE')
            console.log(grandes_ligas)
        }
    )
