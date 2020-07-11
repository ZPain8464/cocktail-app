const fetchDrinks = function() {
    let URL = searchURL + `filter.php?i=${selected}`;
    console.log(URL)
    fetch(URL)
    .then(response => response.json())
    .then(responseJson => 
        displayDrinks(responseJson));
    // .then(responseJson => fetch(searchURL + `lookup.php?i=${responseJson.drink[0].idDrink}`))
    // .then(responseJson => displayDrinks(responseJson))
}

export default fetchDrinks;