'use strict'

const apiID = '68fbf7ee';

const apiKey = 'b367beafbe4321958a04204859acfce8';

const baseUrl = 'https://api.edamam.com/search?';

let fromNum = 0;

let toNum = 19;

let newCallFromNum = 0;

let newCallToNum = 100;

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(arr) {
    console.log(arr);
  // if there are previous results, remove them
  $('#results-list').empty();
  $('.ingredientsSelected').empty();
  const foodInput = $('#js-search-term').val();
  $('.ingredientsSelected').append(`<h3>Ingredients Selected: <span class="ingredientsSelectedSpan">${foodInput}</span></h3>`);
  $('.searchIntro').text("Want to search again?");
  $("js-search-term").attr("placeholder", "waffles");
  // Iterate through the items array
  if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++){
      // for each object in the data 
      //array, add a list item to the results 
      //list with the recipe information
      $('#results-list').append(
        `<li><a href='${arr[i].recipe.url}' target='_blank'>
        <ul class="recipeBox recipe-${i}">
          <li><img class="recipeImage" src="${arr[i].recipe.image}" alt="image of recipe"></li>
          <li class="recipeTitle">${arr[i].recipe.label}</li>
          <li class="recipeIngredients">${arr[i].recipe.ingredientLines.length} Ingredients</li>   
          <li class="recipeYield">${arr[i].recipe.yield} Servings</li>   
          <li class="recipeCalories">${Math.floor(arr[i].recipe.calories/arr[i].recipe.yield)} Calories / Serving</li>   
          <li class="recipeSource">${arr[i].recipe.source}</li>         
        </ul></a/></li>`
      )};
  } else {
      $('#results-list').append(`<p class="noResults">Whoops!  It looks like there aren't any recipes that meet that criteria.  <i class="far fa-meh"></i> </p>`)
  };
  //display the results section  
  $('.fa-utensils').hide();
  $('#results').removeClass('hidden');
  $('.ingredientsSelected').removeClass('hidden');
  $('.filters').removeClass('hidden');
  $("#results > ul > li").hide();
  $("#results > ul > li").slice(fromNum, toNum+1).show();
}

function getRecipes(foodInput, apiID, apiKey, newCallFromNum, newCallToNum) {
  const params = {
    q: foodInput,
    app_id: apiID,
    app_key: apiKey,
    from: newCallFromNum,
    to: newCallToNum
  };

  const queryString = formatQueryParams(params)
  const url = baseUrl + queryString;

  console.log(url);

  fetch(url, {mode: 'cors'})
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
       arrayOfRecipes = responseJson.hits
       displayResults(arrayOfRecipes)
       moreRecipes()
       previousRecipes()
})
    
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const foodInput = $('#js-search-term').val();
    getRecipes(foodInput, apiID, apiKey, newCallFromNum, newCallToNum);
  });
}


function previousRecipes() {
  $(".previousRecipesButton").off().click(function() {
  if (fromNum > 0) {
  fromNum -= 20;
  toNum -= 20;
  // Show the previous 20 recipes
  $("#results > ul > li").slice(fromNum, toNum).show();
  // Hide the next 20 recipes
  $("#results > ul > li").slice(fromNum+20, toNum+20).hide();
  console.log("The from parameter is now " + fromNum + " and the to parameter is now " + toNum);
  }
})
}

function moreRecipes() {
  $(".moreRecipesButton").off().click(function() {
  if (toNum < arrayOfRecipes.length-1) {
  fromNum += 20;
  toNum += 20;
  // Show the next 20 recipes
  $("#results > ul > li").slice(fromNum, toNum).show();
  // Hide the previous 20 recipes
  $("#results > ul > li").slice(fromNum-20, toNum-20).hide();
  console.log("The from parameter is now " + fromNum + " and the to parameter is now " + toNum);
  }
})
}

function changeRecipePage() {
  moreRecipes();
  previousRecipes();
}

var arrayOfRecipes = [];
var filteredArr = [];

function filterVeganOne(hit) {
  if (hit.recipe.healthLabels.includes("Vegan")) {
    return true;
  }
}

function filterVeganTwo() {
     $(".Vegan").click(function() {
        filteredArr = arrayOfRecipes.filter(filterVeganOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterVegetarianOne(hit) {
  if (hit.recipe.healthLabels.includes("Vegetarian")) {
    return true;
  }
}

function filterVegetarianTwo() {
     $(".Vegetarian").click(function() {
        filteredArr = arrayOfRecipes.filter(filterVegetarianOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterSugarOne(hit) {
  if (hit.recipe.healthLabels.includes("Sugar-Conscious")) {
    return true;
  }
}

function filterSugarTwo() {
     $(".Sugar-Conscious").click(function() {
        filteredArr = arrayOfRecipes.filter(filterSugarOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterProteinOne(hit) {
  if (hit.recipe.dietLabels.includes("High-Protein")) {
    return true;
  }
}

function filterProteinTwo() {
     $(".high-protein").click(function() {
        filteredArr = arrayOfRecipes.filter(filterProteinOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterCarbOne(hit) {
  if (hit.recipe.dietLabels.includes("Low-Carb")) {
    return true;
  }
}

function filterCarbTwo() {
     $(".low-carb").click(function() {
        filteredArr = arrayOfRecipes.filter(filterCarbOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterFatOne(hit) {
  if (hit.recipe.dietLabels.includes("Low-Fat")) {
    return true;
  }
}

function filterFatTwo() {
     $(".low-fat").click(function() {
        filteredArr = arrayOfRecipes.filter(filterFatOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterLowIngredientsOne(hit) {
  if (hit.recipe.ingredientLines.length <= 5) {
    return true;
  }
}

function filterLowIngredientsTwo() {
     $(".lowIngredients").click(function() {
        filteredArr = arrayOfRecipes.filter(filterLowIngredientsOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterMediumIngredientsOne(hit) {
  if (hit.recipe.ingredientLines.length > 5 && hit.recipe.ingredientLines.length <= 10) {
    return true;
  }
}

function filterMediumIngredientsTwo() {
     $(".mediumIngredients").click(function() {
        filteredArr = arrayOfRecipes.filter(filterMediumIngredientsOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function filterHighIngredientsOne(hit) {
  if (hit.recipe.ingredientLines.length > 10) {
    return true;
  }
}

function filterHighIngredientsTwo() {
     $(".highIngredients").click(function() {
        filteredArr = arrayOfRecipes.filter(filterHighIngredientsOne);
        console.log(filteredArr);
        displayResults(filteredArr);
})
}

function showAll() {
  $(".showAllButton").click(function() {
    displayResults(arrayOfRecipes);
  })
}

function runFilters() {
  filterVeganTwo();
  filterVegetarianTwo();
  filterSugarTwo();
  filterProteinTwo();
  filterCarbTwo();
  filterFatTwo();
  filterLowIngredientsTwo();
  filterMediumIngredientsTwo();
  filterHighIngredientsTwo();
}

function runApp() {
  watchForm();
  changeRecipePage();
  runFilters();
  showAll();
}

$(runApp)