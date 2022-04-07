const MAX_GUESS = 5;
const MAX_HINT = 4;

let num_hints = 0;
let num_guesses = 0;

let color_list = [];
let guesses = [];
let prev_players = [];

let game_ended = false;


// 0 Means unknown, 1 means game lost, 2 means game won
let game_won = 0;

let streak = 0;

//Process a Guess
function updateGuesses(player_name, random_player) {
    //Find the guessed player
    $.ajaxSetup({
      async: false
    });
    let guessed_player = null;
    $.getJSON('../data/players.json',function(data){
      if (data[player_name]) {
        guessed_player = data[player_name];
      }
    });
    $.ajaxSetup({
      async: true
    });

    if (guessed_player == null) {
      return;
    }
    //Check if this player was guessed before
    if (guesses) {
      for(let i = 0; i < guesses.length; i++) {
        if (player_name === guesses[i]["name"]) {
            return;
        }
      }
    }

    //If the guess was valid
    num_guesses = num_guesses + 1;
    localStorage.setItem('num_guesses', num_guesses);
    updateHintGuessCount();
    //Find out what color each tile should be
    colors = checkGuessedPlayer(random_player, guessed_player);
    color_list.push(colors);
    localStorage.setItem('color_list', JSON.stringify(color_list));
    var guess = {
      "name": guessed_player.name,
      "num": guessed_player.num,
      "age":guessed_player.age,
      "rank": guessed_player.rank, 
      "conf": guessed_player.conf,
      "div": guessed_player.div
    };
    guesses.push(guess);
    localStorage.setItem('guesses', JSON.stringify(guesses));
    //Create and append the guess
    guess_div = createGuessDiv(player_name, guessed_player.num, guessed_player.age, guessed_player.rank, guessed_player.conf, guessed_player.div, num_guesses, colors);
    $("#entry_table").append(guess_div);  
    //Update tile colors
    preAnimateGuess(colors, num_guesses);
    animateGuess(colors, num_guesses);
    updateTileColors(colors, num_guesses);
  }
  
  //Figure out what color every tile should be
  function checkGuessedPlayer(random_player, guessed_player) {
    //If the guess was correct
    if (random_player.id === guessed_player.id) {
      hint_one = true;
      hint_two = true;
      hint_three = true;
      hint_four = true;
      game_ended = true;
      game_won = 2;
      return ['rgba(30, 158, 0, 0.75)', 0];
    }

    //If any of the guesses were correct set to rgba(30, 158, 0, 0.75) otherwise set to rgba(238, 238, 238, 0.5)
    name_matches = random_player.name === guessed_player.name ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';
    num_matches = random_player.num === guessed_player.num ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';
    age_matches = random_player.age === guessed_player.age ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';
    rank_matches = random_player.rank === guessed_player.rank ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';
    conf_matches = random_player.conf === guessed_player.conf ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';
    div_matches = random_player.div === guessed_player.div ? 'rgba(30, 158, 0, 0.75)' : 'rgba(238, 238, 238, 0.5)';

    //Prevent min from being negative
    if (random_player.num < 3) {
      min_num = 0;
    }
    else {
      min_num = random_player.num - 3
    }
    if (random_player.age < 3) {
      min_age = 0;
    }
    else {
      min_age = random_player.age - 3
    }
    if (random_player.rank < 3) {
      min_rank = 0;
    }
    else {
      min_rank = random_player.rank - 3
    }

    //Figure out if a tile should be yellow
    if (num_matches === 'rgba(238, 238, 238, 0.5)') {
      if (between(guessed_player.num, min_num, random_player.num + 3)) {
        num_matches = 'rgba(243, 225, 90, 0.75)';
      }
    }
    if (age_matches === 'rgba(238, 238, 238, 0.5)') {
      if (between(guessed_player.age, min_age, random_player.age + 3)) {
        age_matches = 'rgba(243, 225, 90, 0.75)';
      }
    }
    if (rank_matches === 'rgba(238, 238, 238, 0.5)') {
      if (between(guessed_player.rank, min_rank, random_player.rank + 3)) {
        rank_matches = 'rgba(243, 225, 90, 0.75)';
      }
    }

    return [name_matches, num_matches, age_matches, rank_matches, conf_matches, div_matches]
  }

  //Helper function to return is a number is between a min and max
  function between(x, min, max) {
    return x >= min && x <= max;
  }

  //Update the Color of the tiles
  function updateTileColors(colors, num_guesses) {
    if (!colors) {
      return;
    }
    if (colors.length == 2) {
      $("#table_name" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
      $("#table_num" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
      $("#table_age" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
      $("#table_rank" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
      $("#table_conf" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
      $("#table_div" + num_guesses).css("background-color","rgba(30, 158, 0, 0.75)");
    }
    else {
      $("#table_name" + num_guesses).css("background-color",colors[0]);
      $("#table_num" + num_guesses).css("background-color",colors[1]);

      if (hint_one) {
        $("#table_age" + num_guesses).css("background-color",colors[2]);
      }
      if (hint_two) {
        $("#table_rank" + num_guesses).css("background-color",colors[3]);
      }
      if (hint_three) {
        $("#table_conf" + num_guesses).css("background-color",colors[4]);
      }
      if (hint_four) {
        $("#table_div" + num_guesses).css("background-color",colors[5]);
      }
    }
  }

  //Create a Div for a guess
  function createGuessDiv(player_name, jersey_num, age, pos_rank, conf, div, num_guesses) {
    start_string = '<td id="table_name' + num_guesses + '">' + player_name + '</td><td id="table_num' + num_guesses + '">' + jersey_num + '</td>';
    age_string = hint_one ? '<td id="table_age' + num_guesses + '">' + age + '</td>' : '<td id="table_age' + num_guesses + '">?</td>';
    rank_string = hint_two ? '<td id="table_rank' + num_guesses + '">' + pos_rank + '</td>' : '<td id="table_rank' + num_guesses + '">?</td>';
    conf_string = hint_three ? '<td id="table_conf' + num_guesses + '">' + conf + '</td>' : '<td id="table_conf' + num_guesses + '">?</td>';
    div_string = hint_four ? '<td id="table_div' + num_guesses + '">' + div + '</td>' : '<td id="table_div' + num_guesses + '">?</td>';
    return '<tr class="one_row" id="one_row' + num_guesses + '">' + start_string + age_string + rank_string + conf_string + div_string + '</tr>';
  }

  //Check if the game is over or not
  function updateGameState(random_player) {
    if (num_guesses >= MAX_GUESS) {
        if(!(game_won === 2)) {
          game_won = 1;
        }
    }
    if (!(game_won === 0)) {
      endGame(random_player);
    }
  }

  //Update Hints and Guesses
  function updateHintGuessCount() {
      $("#guess_counter").text(num_guesses + "/5 Guesses Used");
      $("#hint_counter").text(num_hints + "/4 Hints Used");
  }

  function preAnimateGuess(colors, num_guesses) {
    $("#table_name" + num_guesses).animate({
      "visibility" : "hidden",
      "opactiy" : 0,
      "transition": "visibility 0s, opacity 0.5s linear"
    });
  }

  function animateGuess(colors, num_guesses) {
    $("#table_name" + num_guesses).animate({
      "visibility" : "visible",
      "opactiy" : 1,
    });
  }

  function endGame() {
    //Display correct player
    console.log(random_player);

    //Adjust Local storage accordingly
    localStorage.setItem('num_hints', 0);
    localStorage.setItem('num_guesses', 0);
    localStorage.setItem('color_list', []);
    localStorage.setItem('guesses', []);
    localStorage.setItem('prev_players', []);

    localStorage.setItem('hint_one', false);
    localStorage.setItem('hint_two', false);
    localStorage.setItem('hint_three', false);
    localStorage.setItem('hint_four', false);

    localStorage.setItem('fp_game', false);

    clearInterval(game_interval);

    if (game_won === 2) {
      streak = streak + 1;
    }
    else if(game_won === 1) {
      streak = 0;
    }
    $("#streak_counter").text(streak + " Correct");

  }