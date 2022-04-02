const MAX_GUESS = 5;
const MAX_HINT = 4;

let num_hints = 0;
let num_guesses = 0;

let color_list = [];
let guesses = [];

let game_ended = false;

//Process a Guess
function updateGuesses(player_name, random_player) {
    //Find the guessed player
    $.ajaxSetup({
      async: false
    });
    let guessed_player;
    $.getJSON('../data/players.json',function(data){
      $.each(data,function(i,player){
        if (player.name == player_name) {
          guessed_player = player;
        }
      });
    });
    $.ajaxSetup({
      async: true
    });

    //Check if this player was guessed before
    for(let i = 0; i < num_guesses; i++) {
        if (player_name === guesses[i]["name"]) {
            return;
        }
    }

    //If the guess was valid
    if (!(guessed_player == null)) {
        num_guesses = num_guesses + 1;
        updateHintGuessCount();
      //Find out what color each tile should be
      colors = checkGuessedPlayer(random_player, guessed_player);
      color_list.push(colors);
      guesses.push(guessed_player);
      //Create and append the guess
      guess_div = createGuessDiv(player_name, guessed_player.num, guessed_player.age, guessed_player.rank, guessed_player.conf, guessed_player.div, num_guesses, colors);
      $("#entry_table").append(guess_div);  
      //Update tile colors
      updateTileColors(colors, num_guesses);
    }
  }
  
  //Figure out what color every tile should be
  function checkGuessedPlayer(random_player, guessed_player) {
    //If the guess was correct
    if (random_player === guessed_player) {
      hint_one = true;
      hint_two = true;
      hint_three = true;
      hint_four = true;
      return ['green', 0];
    }

    //If any of the guesses were correct set to green otherwise set to gray
    name_matches = random_player.name === guessed_player.name ? 'green' : 'gray';
    num_matches = random_player.num === guessed_player.num ? 'green' : 'gray';
    age_matches = random_player.age === guessed_player.age ? 'green' : 'gray';
    rank_matches = random_player.rank === guessed_player.rank ? 'green' : 'gray';
    conf_matches = random_player.conf === guessed_player.conf ? 'green' : 'gray';
    div_matches = random_player.div === guessed_player.div ? 'green' : 'gray';

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
    if (num_matches === 'gray') {
      if (between(guessed_player.num, min_num, random_player.num + 3)) {
        num_matches = 'yellow';
      }
    }
    if (age_matches === 'gray') {
      if (between(guessed_player.age, min_age, random_player.age + 3)) {
        age_matches = 'yellow';
      }
    }
    if (rank_matches === 'gray') {
      if (between(guessed_player.rank, min_rank, random_player.rank + 3)) {
        rank_matches = 'yellow';
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
    if (colors.length === 2) {
      $("#table_name" + num_guesses).css("background-color","green");
      $("#table_num" + num_guesses).css("background-color","green");
      $("#table_age" + num_guesses).css("background-color","green");
      $("#table_rank" + num_guesses).css("background-color","green");
      $("#table_conf" + num_guesses).css("background-color","green");
      $("#table_div" + num_guesses).css("background-color","green");
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
  function updateGameState() {
    if (num_guesses === MAX_GUESS) {
        game_ended = true;
    }
  }

  //Update Hints and Guesses
  function updateHintGuessCount() {
      $("#guess_counter").text(num_guesses + "/5 Guesses Used");
      $("#hint_counter").text(num_hints + "/4 Hints Used");
  }