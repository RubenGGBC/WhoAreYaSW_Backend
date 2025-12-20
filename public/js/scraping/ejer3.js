fetch('http://api.football-data.org/v4/competitions')
    .then(
        r => r.json())
    .then(
        data => {
            let grandes_ligas = data.competitions.filter(comp => comp.plan === 'TIER_ONE')
            let cuatro_grandes_ligas = grandes_ligas.filter(comp => comp.area.code === 'ESP' || comp.area.code === 'ENG' || comp.area.code === 'ITA' || comp.area.code === 'FRA')
            console.log(cuatro_grandes_ligas)
        }
    )