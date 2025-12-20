fetch('http://api.football-data.org/v4/competitions')
    .then(
        r => r.json())
    .then(
        data => {
            console.log(data)
        }
    )

