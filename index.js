
const apiKeyDB = "9973533";

const searchURL = `https://www.thecocktaildb.com/api/json/v2/${apiKeyDB}/`;

const youtubeAPIKey = "AIzaSyAsO-8rogzeEEXbqPCiT1XWPlL2Rcho3Kg";

const youtubeURL = "https://www.googleapis.com/youtube/v3/search?";

const watchVidURL = "https://www.youtube.com/watch?v=";



function fetchDropDown() {
    let ingURL = searchURL + 'list.php?i=list';
    fetch(ingURL)
    .then(ingredients => ingredients.json())
    .then(function (ingredientsJson) {
        console.log(ingredientsJson)
    })
}

// Creates HTML template for dropdown menu with ingredients
// Calls selectedItems
function renderDropDown() {
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
        <img class="js-image">
        <div id="video"></div>
        `)
}

// Renders ingredients and instructions to DOM 7/14: return strIngredient as a variable and forEach() it in second if statement
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
    <img class="js-image" src="${drinkDeets.strDrinkThumb}">`);
    $(fetchVideos(newDrinkIDJson));
    $(backToBar())
    // $(displayMeasurements(ingredients));
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
    <iframe width="420" height="315"
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

function backToBar() {
    $('.bar').on('click', function() {
        $('.js-ingredients-template').empty()
        $(renderDropDown());
    })
}

// Modify this function to dynamically create li list under separate URL; 
// manipulate CSS to display both ul lists next to each other?
// function displayMeasurements(ingredients) {
//     console.log(ingredients)
//     // let drinkDeets = newDrinkIDJson.drinks[0];
//     // let reqMeas = Object.entries(drinkDeets);
//     for (const [k , v] of reqMeas) {
//         if (k.indexOf("strMeasure") > -1 && v !== null) {      
//         $('.js-measurements').append(`<span>${v}</span>`)   
//         }
//     }
// }

// Verifies user's selection in dropdown menu
// After clicking submit, it calls fetchDrinks
function selectedItems() {
    $('#ingredients-dropdown').change(function() {
        let selected = $(this).val();
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