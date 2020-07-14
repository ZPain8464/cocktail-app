
const apiKey = "9973533";

const searchURL = `https://www.thecocktaildb.com/api/json/v2/${apiKey}/`;



// Creates HTML template for dropdown menu with ingredients
// Calls selectedItems
function renderDropDown() {
    console.log('renderDropdown ran')
    $('.js-dropdown').append(
        `<div class="dropdown">
        <button id="submit">Submit</button>
        <p>Pick your poison(s):</p>
            <select id="ingredients-dropdown" multiple size="4">
                <option value="vodka">Vodka</option>
                <option value="Cranberry juice">Cranberry juice</option>
                <option value="Lime">Lime</option>
                <option value="Tequila">Tequila</option>
            </select>
            <span id="result"></span>
            </div>`
    ).hide().fadeIn(2000);
    $(selectedItems());
}

//Passes Promise as an argument
//Creates dynamic list of drink suggestions
function displayDrinks(responseJson) {
    $('#result').empty();
    $('#result').append(`
    <div class="js-drink-name"></div>
         <ul>
           <li class="drink-name"></li>
         </ul>
     `)
    responseJson.drinks.forEach(function(drinkName, drinkIndex) {
        $(`.drink-name`).append(`
            <h3>${drinkName.strDrink}</h3>
            <button class="ing-button" id="drinkItem-${drinkIndex}" value="${drinkName.idDrink}">Get Ingredients</button>
            <div class="js-ingredients"></div>
        `);
        $(`#drinkItem-${drinkIndex}`).on('click', function() {
            let drinkID = $(this).val();
            $(fetchIngredients(drinkID));
        });
    })
}


// Passes drink ID as an argument
//Empties DropDown list and fetches drink ID 
function fetchIngredients(drinkID) {
    $('.js-dropdown').empty();
        let newURL = searchURL + `lookup.php?i=${drinkID}`;
        console.log(newURL)
            fetch(newURL)
            .then(newDrinkID => newDrinkID.json())
            .then(newDrinkIDJson => displayIngredients(newDrinkIDJson));
}

// Creates HTML template for presenting ingredients and instructions for specified drink
function ingredientsTemplate() {
   return $('.js-ingredients-template').append(`
    <h2 class="targetDrink"></h2>
    <h3>Ingredients:</h3>
        <ul class="targetIngredients">
        </ul>
    <h3>Instructions</h3>
        <p class="targetInstructions"></p>
        `)
}

// Renders ingredients and instructions to DOM
function displayIngredients(newDrinkIDJson) {
    console.log(newDrinkIDJson)
    let drinkDeets = newDrinkIDJson.drinks[0];
    $(ingredientsTemplate());
    $('.targetDrink').append(`${drinkDeets.strDrink}`);
    $('.targetIngredients').append(`
        <li>${newDrinkIDJson.drinks[0].strIngredient1}</li>
        <li>${newDrinkIDJson.drinks[0].strIngredient2}</li>`)
    $('.targetInstructions').append(`${newDrinkIDJson.drinks[0].strInstructions}
    <img class="js-image" src="${drinkDeets.strDrinkThumb}">`)
}


// Verifies user's selection in dropdown menu
// After clicking submit, it calls fetchDrinks
function selectedItems() {
    $('#ingredients-dropdown').change(function() {
        let selected = $(this).val();
        console.log(selected);
        $('#result').html(selected);
        $('#submit').on('click', function() {
            $(fetchDrinks(selected));
        })
    })
}

//Passes user's selected item as argument;
//Fetches selected item to retrieve drinkID and ingredients
//Calls displayDrinks to render to DOM
function fetchDrinks(selected) {
    let URL = searchURL + `filter.php?i=${selected}`;
            fetch(URL)
            .then(function(response) {
                return response.json();
            }).then(responseJson => displayDrinks(responseJson));
}



// User's mouse hovers over ul text; code fades out message and 
// calls renderDropDown
function startApp() {
    $('.welcome-message').mouseenter( function(event) {
        event.preventDefault();
        $(this).fadeOut(1000);
        $(renderDropDown())
    })
}

// loads app and calls startApp()
function handleApp() {
    startApp();
}

$(handleApp());