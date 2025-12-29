export {autocomplete}

function autocomplete(inp, players, onSelectCallback) {
    let currentFocus;

    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "-autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        let matchCount = 0;
        for (i = 0; i < players.length && matchCount < 10; i++) {
            // Búsqueda letra por letra usando indexOf
            if (players[i].name.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                matchCount++;

                b = document.createElement("DIV");
                b.classList.add('autocomplete-item');

                // Resaltar el texto coincidente
                const nameOriginal = players[i].name;
                const nameLower = nameOriginal.toLowerCase();
                const valLower = val.toLowerCase();
                const startIndex = nameLower.indexOf(valLower);

                let highlightedName;
                if (startIndex !== -1) {
                    const before = nameOriginal.substring(0, startIndex);
                    const match = nameOriginal.substring(startIndex, startIndex + val.length);
                    const after = nameOriginal.substring(startIndex + val.length);
                    highlightedName = `${before}<span style='background-color: #ffd700; font-weight: bold;'>${match}</span>${after}`;
                } else {
                    highlightedName = nameOriginal;
                }

                b.innerHTML = `
                    <img class="autocomplete-player-img" src="/images/players/${players[i].id}.png"
                         alt="${players[i].name}"
                         style="width: 28px; height: 28px; display: inline-block; margin-right: 10px; vertical-align: middle;">
                    <span style="display: inline-block; vertical-align: middle;">
                        ${highlightedName}
                        <input type='hidden' name='playerName' value='${players[i].name}'>
                        <input type='hidden' name='playerId' value='${players[i]._id}'>
                    </span>
                `;

                // Agregar manejador de error para la imagen
                const autocompleteImg = b.querySelector('.autocomplete-player-img');
                autocompleteImg.addEventListener('error', function() {
                    this.src = '/images/players/default.svg';
                    this.onerror = null;
                });

                b.addEventListener("click", function (e) {
                    const playerName = this.getElementsByTagName("input")[0].value;
                    const playerId = this.getElementsByTagName("input")[1].value;

                    inp.value = playerName;
                    closeAllLists();

                    if (onSelectCallback) {
                        onSelectCallback(playerId);
                    }
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
