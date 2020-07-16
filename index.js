
const apiKeyDB = "9973533";

const searchURL = `https://www.thecocktaildb.com/api/json/v2/${apiKeyDB}/`;

const youtubeAPIKey = "AIzaSyAsO-8rogzeEEXbqPCiT1XWPlL2Rcho3Kg";

const youtubeURL = "https://www.googleapis.com/youtube/v3/search?";

const watchVidURL = "https://www.youtube.com/watch?v=";


// Fetches ingredients list from cocktail API
function fetchDropDown() {
    let ingURL = searchURL + 'list.php?i=list';
    fetch(ingURL)
    .then(ingredients => ingredients.json())
    .then(function (ingredientsJson) {
        $(generateDropOpps(ingredientsJson));
    })
}

// Dynamically generates dropdown menu ingredients optoins and appends to <option> 
//Calls selectedItems()
function generateDropOpps(ingredientsJson) {
    for (let i = 0; i < ingredientsJson.drinks.length; i++) {
        let drinks = ingredientsJson.drinks[i].strIngredient1;
        $('#ingredients-dropdown').append(`<option value="${drinks}">${drinks}</option>`);
    }
    $(selectedItems());
}


// Creates HTML template for dropdown menu with ingredients
// Calls fetchDropDown()
function renderDropDown() {
    $(fetchDropDown());
    $('.js-dropdown').append(
        `<div class="dropdown">
        <p>Pick your poison:</p>
            <select id="ingredients-dropdown" multiple size="7">
            </select>
            <span id="result"></span>
            </div>
            <button id="submit">Submit</button>
            `
    ).hide().fadeIn(2000);
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
            $('#results').empty()
            let drinkID = $(this).val();
            $(fetchIngredients(drinkID));
        });
    })
}


// Passes drink ID as an argument
//Empties drink list and fetches drink ID 
function fetchIngredients(drinkID) {
    $('.js-dropdown').empty();
    $('#result').empty();
        let newURL = searchURL + `lookup.php?i=${drinkID}`;
            fetch(newURL)
            .then(newDrinkID => newDrinkID.json())
            .then(newDrinkIDJson => displayIngredients(newDrinkIDJson));
}

// Creates HTML template for presenting ingredients and instructions for specified drink
function ingredientsTemplate() {
   return $('.js-ingredients-template').append(`
    <h2 class="targetDrink"></h2>
    <button class="bar" id="back-to-bar">Back to the Bar</button>
    <h3>Ingredients:</h3>

        <ul class="targetIngredients">
        </ul>
    <h3>Instructions:</h3>
        <p class="targetInstructions"></p>
        <div>
        <img class="js-image">
        <div>
        <div id="video"></div>
        `)
}

// Renders ingredients and instructions to DOM 
//Calls backToBar function, which brings user back to dropdown screen
function displayIngredients(newDrinkIDJson) {
    let drinkDeets = newDrinkIDJson.drinks[0];
    $(ingredientsTemplate());
    $('.targetDrink').append(`${drinkDeets.strDrink}`);
        let reqIng = Object.entries(drinkDeets);
        for (const [k , v] of reqIng) {
            if (k.indexOf('strIngredient') > -1 && v !== null) {
               $('.targetIngredients').append(`<li>${v}</li>`)
            };
        };
    $('.targetInstructions').append(`${drinkDeets.strInstructions}
    <div class="img-container">
    <img class="js-image" src="${drinkDeets.strDrinkThumb}">
    </div>`);
    $(fetchVideos(newDrinkIDJson));
    $('#results').empty()
    $(backToBar())
}
 
// pass in newDrinkISJson as an argument; extract 'strDrink' and plug into YouYube q = "how to make ${strDrink}"
function fetchVideos(newDrinkIDJson) {
    let drinkQuery = newDrinkIDJson.drinks[0].strDrink;
    let vidURL = youtubeURL + `part=snippet&maxResults=3&q=how%20to%20make%20${drinkQuery}%20cocktail&key=${youtubeAPIKey}&type=video`;
    fetch(vidURL)
    .then(videos => videos.json())
    .then(videosJson => displayVideos(videosJson));
}

function videosTemplate(vidID) {
    return `
    <iframe width="320" height="215"
    src="https://www.youtube.com/embed/${vidID}">
    </iframe>
    `
}

function displayVideos(videosJson) {
    console.log(videosJson)
    let vidURL = "";
    for (let i = 0; i < videosJson.items.length; i++) {
        vidURL = videosJson.items[i].id.videoId;
        $(`#video`).append($(videosTemplate(vidURL)));
    };
}

//Resets app and calls renderDropDown
function backToBar() {
    $('.bar').on('click', function() {
        $('.js-ingredients-template').empty()
        $(renderDropDown());
    })
}

// Verifies user's selection in dropdown menu
// After clicking submit, it calls fetchDrinks
function selectedItems() {
    $('#ingredients-dropdown').change(function() {
        let selected = $(this).val();
        $('#result').html(selected);
        $('#submit').on('click', function() {
            $(fetchDrinks(selected));
            $('#results').empty();
            $('#ingredients-dropdown').hide()
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
            $('#results').empty()
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