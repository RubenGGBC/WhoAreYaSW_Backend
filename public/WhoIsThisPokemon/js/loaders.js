export { fetchJSON };

async function fetchJSON(what) {
    //Ejercicio 2:
    const response = await fetch(`./json/${what}.json`);
    const data = await response.json();
    return data;
}
