export {autocomplete}

function autocomplete(inp, pokemon, onSelectCallback) {
    let currentFocus;

    inp.addEventListener("input", function () {
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
        for (i = 0; i < pokemon.length && matchCount < 10; i++) {
            if (pokemon[i].name.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                matchCount++;

                b = document.createElement("DIV");
                b.classList.add('autocomplete-item');

                const nameOriginal = pokemon[i].name;
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

                const imageUrl = `/images/pokemon/${pokemon[i].id}.png`;

                b.innerHTML = `
                    <img class="autocomplete-pokemon-img" src="${imageUrl}"
                         alt="${pokemon[i].name}"
                         style="width: 28px; height: 28px; display: inline-block; margin-right: 10px; vertical-align: middle;">
                    <span style="display: inline-block; vertical-align: middle;">
                        #${pokemon[i].id} - ${highlightedName}
                        <input type='hidden' name='pokemonName' value='${pokemon[i].name}'>
                        <input type='hidden' name='pokemonId' value='${pokemon[i]._id}'>
                    </span>
                `;

                const autocompleteImg = b.querySelector('.autocomplete-pokemon-img');
                autocompleteImg.addEventListener('error', function() {
                    this.style.display = 'none';
                }, { once: true });

                b.addEventListener("click", function () {
                    const pokemonName = this.getElementsByTagName("input")[0].value;
                    const pokemonId = this.getElementsByTagName("input")[1].value;

                    inp.value = pokemonName;
                    closeAllLists();

                    if (onSelectCallback) {
                        onSelectCallback(pokemonId);
                    }
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");

        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(x);
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(x);
        } else if (e.key === 'Enter') {
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
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
