let hint_one = false;
let hint_two = false;
let hint_three = false;
let hint_four = false;

var random_player;

let game_interval;

$(document).ready( function() {
  //localStorage.clear();
  //Load all the players into the search bar
  loadPlayers();

  //TODO: Load local storage

  //Start Game
  random_player = localStorageHandler();

  $('#settings_icon').click( () => {
    endGame(random_player);
    game_won = 0;
    window.location = window.location;
    startGame();
  });

  $('#stats_icon').click( () => {
    if (game_won === 2) {
      game_won = 0;
      window.location = window.location;
      startGame();
    }
  });

  $('#info_icon').click( () => {
    $("#info_modal").modal('show');
  });

  $('#info_close').click ( () => {
    $("#info_modal").modal('hide');
  });
  
  //Button Handlers
  $("#age_button").one('click', () => {
    if (num_guesses + 1 < MAX_GUESS) {
      hint_one = true;
      localStorage.setItem('hint_one', hint_one);
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      localStorage.setItem('num_hints', num_hints);
      localStorage.setItem('num_guesses', num_guesses);
      updateHintGuessCount();
      updatePreviousTiles("#table_age", "age");
    }
  });

  $("#rank_button").one('click', () => {
    if (num_guesses + 1 < MAX_GUESS) {
      hint_two = true;
      localStorage.setItem('hint_two', hint_two);
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      localStorage.setItem('num_hints', num_hints);
      localStorage.setItem('num_guesses', num_guesses);
      updateHintGuessCount();
      updatePreviousTiles("#table_rank", "rank");
    }
  });

  $("#conf_button").one('click', () => {
    if (num_guesses + 1 < MAX_GUESS) {
      hint_three = true;
      localStorage.setItem('hint_three', hint_three);
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      localStorage.setItem('num_hints', num_hints);
      localStorage.setItem('num_guesses', num_guesses);
      updateHintGuessCount();
      updatePreviousTiles("#table_conf", "conf");
    }
  });

  $("#div_button").one('click', () => {
    if (num_guesses + 1 < MAX_GUESS) {
      hint_four = true;
      localStorage.setItem('hint_four', hint_four);
      num_hints = num_hints + 1;
      num_guesses = num_guesses + 1;
      localStorage.setItem('num_hints', num_hints);
      localStorage.setItem('num_guesses', num_guesses);
      updateHintGuessCount();
      updatePreviousTiles("#table_div", "div");
    }
  });
  
});

  function updatePreviousTiles(hint, value) {
    if(!(guesses.length === 0)) {
      for(let i = 0; i < guesses.length; i++) {
        updateTileColors(color_list[i], i + 1);
        if(guesses[i][value]) {
          new_val = guesses[i][value];
        }
        $(hint + (i + 1)).text(new_val);
      }
    }
  }

  /*
  ** TODO:
  ** Daily gamemode:
  ** One random player a day
  ** LOCAL STORAGE: gamemode, game_state, load guesses hints counter, which hint used


  ** Make first two hints free?
  ** Freeplay mode
  ** Daily mode
  ** design
  ** Header button modals
  ** Easily sortable input list
  ** Add a timer
  */