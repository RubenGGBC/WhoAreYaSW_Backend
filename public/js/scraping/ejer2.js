fetch('http://api.football-data.org/v4/competitions')
    .then(
        r => r.json())
    .then(
        data => {
            let comp_españolas = data.competitions.filter(comp => comp.area.code === 'ESP')
            console.log(comp_españolas)
        }
    )