
const apiKeyDB = "9973533";

const searchURL = `https://www.thecocktaildb.com/api/json/v2/${apiKeyDB}/`;

// Fetches ingredients list from cocktail API
function fetchDropDown() {
    let ingURL = searchURL + 'list.php?i=list';
    fetch(ingURL)
    .then(ingredients => ingredients.json())
    .then(function (ingredientsJson) {
        $(generateDropOpps(ingredientsJson));
    });
}

// Dynamically generates dropdown menu ingredients optoins and appends to <option> 
function generateDropOpps(ingredientsJson) {
    for (let i = 0; i < ingredientsJson.drinks.length; i++) {
        let drinks = ingredientsJson.drinks[i].strIngredient1;
        $('#ingredients-dropdown').append(`<option value="${drinks}">${drinks}</option>`);
    }
    $('.js-dropdown').show();
}

//Passes Promise as an argument
//Creates dynamic list of drink suggestions
function displayDrinks(responseJson, selected) {
    $('.js-dropdown').hide();
    $('#drink-list-results').append(drinkListResultsHTML(selected));
    generateIngredientsButtons(responseJson);
}

// HTML Template for drinks list
function drinkListResultsHTML(selected) {
    $('#poison').hide();
    return `
    <p class="sel-response">You chose ${selected} (good choice!)</p>
    <p class="choose">Choose your drink:</p>
    <div class="js-drink-name"></div>
    <ul class="drinks-list">
        <li class="drink-name"></li>
    </ul>`; 
}

// Generate HTML for Get Ingredients buttons; listens for on click event
function generateIngredientsButtons(responseJson) {
    let response = Object.entries(responseJson);
    if (response[0].includes("None Found")) {
        noneFound(); 
    } else {
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
    })};
}

// Function notifites user if no drinks are available
function noneFound() {
    // apply shake animation
    $('.js-dropdown').show();
    $('.sel-response').hide();
    $('.choose').hide();
    $('#poison').text(`Sorry, no drinks for that one!`).show();
    $('#drink-list-results').empty();
    fetchDropDown();
}

//Fetches drink ID and mmpties drink list
function fetchIngredients(drinkID) {
    $('#drink-list-results').empty();
    $('.js-dropdown').hide();
        let newURL = searchURL + `lookup.php?i=${drinkID}`;
            fetch(newURL)
            .then(newDrinkID => newDrinkID.json())
            .then(newDrinkIDJson => displayIngredients(newDrinkIDJson))
}

// Creates HTML template for presenting ingredients and instructions for specified drink
function ingredientsTemplate() {
   return $('.js-ingredients-template').append(`
   <div class="ing-header">
        <h2 class="targetDrink"></h2>
        <button class="bar" id="back-to-bar">Back to the Bar</button>
    </div>
    <div class="big-group">
        <div class="ing-group">
            <div class="item">
                <h3 class="ing-h3">Ingredients:</h3>

                <ul class="targetIngredients">
                </ul>
            </div>
            <div class="item">
                <h3 class="meas-h3">Measurements:</h3>
                <ul class="targetMeasurements">
                </ul>
            </div>
        </div>
        <div class="ins-section">
            <h3 class="ins-h3">Instructions:</h3>
            <p class="targetInstructions"></p>
        </div>
        <div class="js-img-container"></div>
    </div>
        `);
}

// Renders ingredients and instructions to DOM 
//Calls backToBar function, which brings user back to dropdown screen
function displayIngredients(newDrinkIDJson) {
    $('.header').hide();
    let drinkDeets = newDrinkIDJson.drinks[0];
    $(ingredientsTemplate());
    $('.targetDrink').append(`${drinkDeets.strDrink}`);
        let reqIng = Object.entries(drinkDeets);
        for (const [k , v] of reqIng) {
            if (k.indexOf('strIngredient') > -1 && v !== null && v !== "") {
               $('.targetIngredients').append(`<li>${v}</li>`)
            };
        };
        for (const [k , v] of reqIng) {
            if (k.indexOf('strMeasure') > -1 && v !== null && v !== "") {
                $('.targetMeasurements').append(`<li>${v}</li>`)
            };
        };
    $('.targetInstructions').append(`${drinkDeets.strInstructions}
    <div class="img-container">
        <img class="js-image" src="${drinkDeets.strDrinkThumb}">
    </div>`);
}

//Resets app and calls fetchDropDown
function backToBar() {
    $('body').on('click', '.bar' , function() {
        $('#poison').show().text('Pick your poison:');
        $('.js-ingredients-template').empty();
        $('#drink-list-results').empty();
        $('.none-found').empty();
        $('.header').show();
        $('logo-msg').show();
        fetchDropDown();
    });
}

//Passes user's selected item as argument;
//Fetches selected item to retrieve drinkID and ingredients
//Calls displayDrinks to render to DOM
function fetchDrinks(selected) {
    let URL = searchURL + `filter.php?i=${selected}`;
            fetch(URL)
            .then( response => response.json())
            .then(responseJson => displayDrinks(responseJson, selected));
}

// calls fetchDropDown; listens for #start event
function startApp() {
    $('#start').on('click', function(event) {
        event.preventDefault();
        $(this).fadeOut(1000);
        $('.welcome-message').fadeOut(1000);
        fetchDropDown();
    });
}

// Takes value of selected and passes it into fetchDrinks()
function selectedItem() { 
    $('body').on('click', "#submit" , function(event) {
        let selectedOption = $($("#ingredients-dropdown option:selected")[0]).val();
        fetchDrinks(selectedOption);
    })
}


function handleApp() {
    $('.js-dropdown').hide();
    startApp();
    selectedItem();
    backToBar();
}

$(handleApp());