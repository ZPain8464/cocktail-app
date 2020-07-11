
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

//Passes two Promises as arguments
//Appends drink suggestion with ingredients and basic instructions
function displayIngredients(responseJson, newDrinkIDJson) {
    console.log(newDrinkIDJson.drinks)
    $('#result').empty();
    for (let i = 0; i < newDrinkIDJson.drinks.length; i++) {
            $('#result').append(`
      <h3>${responseJson.drinks[0].strDrink}</h3>
        <ul>
          <li>${newDrinkIDJson.drinks[0].strIngredient1}<span>&nbsp${newDrinkIDJson.drinks[0].strMeasure1}</span></li>
          <li>${newDrinkIDJson.drinks[0].strIngredient2}<span>&nbsp${newDrinkIDJson.drinks[0].strMeasure2}</span></li>
        </ul>
    <p>${newDrinkIDJson.drinks[0].strInstructions}</p> 
    `);
    }
}


// Verifies user's selection in dropdown menu
// After clicking submit, it calls fetchAPIPromises()
function selectedItems() {
    $('#ingredients-dropdown').change(function() {
        let selected = $(this).val();
        console.log(selected);
        $('#result').html(selected);
        $('#submit').on('click', function() {
            $(fetchPromises(selected));
        })
    })
}

//Passes user's selected item as argument;
//Fetches two separate API endpoints to retrieve drinkID and ingredients
//Calls displayDrinks to render to DOM
function fetchPromises(selected) {
    let URL = searchURL + `filter.php?i=${selected}`;
            fetch(URL)
            .then(function(response) {
                return response.json();
            }).then(function(responseJson) {
            let drinkID = responseJson.drinks[0].idDrink;
            let newURL = searchURL + `lookup.php?i=${drinkID}`;
            fetch(newURL)
            .then(newDrinkID => newDrinkID.json())
            .then(newDrinkIDJson => displayIngredients(responseJson, newDrinkIDJson));
            });
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