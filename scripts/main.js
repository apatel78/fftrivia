let hint_one = false;
let hint_two = false;
let hint_three = false;
let hint_four = false;

var random_player;

$(document).ready( function() {

    // TODO: Event Handlers for header buttons
    updatePlayers();

    // TODO: Return a random player entry
    $.ajaxSetup({
      async: false
    });    
    $.getJSON('../data/players.json',function(data){
      random_player = data[Math.floor(Math.random() * Object.keys(data).length)];
    });
    $.ajaxSetup({
      async: true
    });

    $("#age_button").one('click', () => {
      hint_one = true;
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      updateHintGuessCount();
      updatePreviousTiles("#table_age", "age");
    });
    $("#rank_button").one('click', () => {
      hint_two = true;
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      updateHintGuessCount();
      updatePreviousTiles("#table_rank", "rank");
    });
    $("#conf_button").one('click', () => {
      hint_three = true;
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      updateHintGuessCount();
      updatePreviousTiles("#table_conf", "conf");
    });
    $("#div_button").one('click', () => {
      hint_four = true;
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      updateHintGuessCount();
      updatePreviousTiles("#table_div", "div");
    });

    // TODO: Load in Players for input
    loadPlayers();

    // TODO: Update Statistics
    updateStatistics(random_player);


    // TODO: Keyboard Event Handlers

    // Check Gamestate
    game_interval = setInterval(updateGameState, 1); 

    // TODO: Submit Button Event Handler
    $("#box").click( () => {
        if (!game_ended) {
          updateGuesses($('#search_bar').val(), random_player);
        }
    });
  
  });

  function updatePreviousTiles(hint, value) {
    for(let i = 0; i < num_guesses; i++) {
      updateTileColors(color_list[i], i + 1);
      new_val = guesses[i][value];
      $(hint + (i + 1)).text(new_val);
    }
  }

  /*
  ** TODO:
  ** Pull players
  ** Daily and freeplay mode
  ** header buttons
  ** keyboard event handlers
  ** design
  */