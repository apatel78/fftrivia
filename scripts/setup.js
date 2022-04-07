//Adds players to the input box
function loadPlayers() {
    $.getJSON('../data/players.json',function(data){
        $.each(data,function(i,player){
          $("#brow").append(createPlayerEntryDiv(player.name));
        });
    });
}

//Creates an entry for a player in the input box
function createPlayerEntryDiv(player_name) {
  return '<option value="' + player_name + '">';
}

function localStorageHandler() {
  let prev_game = (localStorage.getItem('fp_game') === 'true');

  //If there was a previous game
  if (prev_game) {
    //Get the player
    $.ajaxSetup({
      async: false
    });
    $.getJSON('../data/players.json',function(data){
      random_player = data[localStorage.getItem('player')];
    });
    $.ajaxSetup({
      async: true
    });


    //Update stats
    updateStatistics(random_player);

    //Load the items
    num_hints = localStorage.getItem('num_hints') ? parseInt(localStorage.getItem('num_hints')) : 0;
    num_guesses = localStorage.getItem('num_guesses') ? parseInt(localStorage.getItem('num_guesses')) : 0;
    color_list = localStorage.getItem('color_list') ? JSON.parse(localStorage.getItem('color_list')) : [];
    guesses = localStorage.getItem('guesses') ? JSON.parse(localStorage.getItem('guesses')) : [];
    prev_players = localStorage.getItem('prev_players') ? localStorage.getItem('prev_players') : [];

    hint_one = (localStorage.getItem('hint_one') === 'true');
    hint_two = (localStorage.getItem('hint_two') === 'true');
    hint_three = (localStorage.getItem('hint_three') === 'true'); 
    hint_four = (localStorage.getItem('hint_four') === 'true'); 

    //Update HTML
    for (let i = 0; i < guesses.length; i++) {
      guess_div = createGuessDiv(guesses[i].name, guesses[i].num, guesses[i].age, guesses[i].rank, guesses[i].conf, guesses[i].div, i, color_list[i]);
      $("#entry_table").append(guess_div);  
      //Update tile colors
      updateTileColors(color_list[i], i);
    }
    updateHintGuessCount();
    if (!(num_guesses >= MAX_GUESS)) {
      game_won = 0;
    }
    //Start the gamestate check
    game_interval = setInterval(updateGameState(random_player), 1); 

    $("#box").click( () => {
      if (game_won === 0) {
        updateGuesses($('#search_bar').val(), random_player);
      }
    });

  }
  else {
    random_player = startGame();
  }
  return random_player;
}

function startGame() {
  //Set localstorage game to true
  localStorage.setItem('fp_game', true);

  //Get Random Player
  let random_player;
  random_player = getPlayer();

  game_won = 0;

  //Store player id
  localStorage.setItem('player', random_player.name);
  
  //Update the statistics
  updateStatistics(random_player);

  //Start the gamestate check
  game_interval = setInterval(updateGameState(random_player), 1); 

  $("#box").click( () => {
    if (game_won === 0) {
      updateGuesses($('#search_bar').val(), random_player);
    }
  });

  return random_player;
}

//Get a random player
function getPlayer() {
  //FreePlay Mode
  $.ajaxSetup({
    async: false
  });    
  var same_player = true;
  $.getJSON('../data/players.json',function(data){
    while (same_player) {
      random_player = data[Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]];
      if (!(prev_players.length === 0)) {
        for (let i = 0; i < prev_players.length; i++) {
          if (prev_players[i] === random_player.id) {
            break;
          }
          else {
            same_player = false;
          }
        }
      }
      else {
        same_player = false;
      }
    }
  });
  $.ajaxSetup({
    async: true
  });

  prev_players.push(random_player.id);
  if (prev_players.length > 5) {
    prev_players.shift();
  }
  localStorage.setItem("prev_players", prev_players);
  return random_player;
}

//Updates the statistics for the player
function updateStatistics(random_player) {
    $("#stats_table").append(createHeaderDiv(random_player));
    $("#stats_table").append(createRushDiv(random_player));
    if (random_player.pos === "QB") {
      $("#stats_table").append(createPassDiv(random_player));
    }
    else {
      $("#stats_table").append(createCatchDiv(random_player));
    }
}

//Creates the stats table header 
function createHeaderDiv(random_player) {
  if (random_player.pos === "QB") {
    return '<tr><th id="blank"></th><th class="col">ATT</th><th class="col">CMP</th><th class="col">YD</th><th class="col">TD</th>' + 
           '<th class="col">T/O</th><th class="col">GP</th><th class="col">GS</th>';
  }
  else {
    return '<tr><th id="blank"></th><th class="col">ATT</th><th class="col">REC</th><th class="col">YD</th><th class="col">TD</th>' + 
           '<th class="col">T/O</th><th class="col">GP</th><th class="col">GS</th>';
  }
}

//Creates the stats table for passing 
function createPassDiv(random_player) {
  return '<tr><th class="row">Passing</th><td>' + random_player.stats.pass_att + '</td><td>' + random_player.stats.cmp + '</td><td>' + random_player.stats.pass_yds +
         '</td><td>' + random_player.stats.pass_tds + '</td><td>' + random_player.stats.int + '</td><td>' + random_player.stats.gp +
         '</td><td>' + random_player.stats.gs + '</td></tr>';
}

//Creates the stats table for rushing 
function createRushDiv(random_player) {
  return '<tr><th class="row">Rushing</th><td>' + random_player.stats.rush_att + '</td><td></td><td>' + random_player.stats.rush_yds +
         '</td><td>' + random_player.stats.rush_td + '</td><td>' + random_player.stats.fum + '</td><td>' + random_player.stats.gp +
         '</td><td>' + random_player.stats.gs + '</td></tr>';
}

//Creates the stats table for catching 
function createCatchDiv(random_player) {
  return '<tr><th class="row">Receiving</th><td>' + random_player.stats.tar + '</td><td>' + random_player.stats.rec + '</td><td>' + random_player.stats.rec_yds +
         '</td><td>' + random_player.stats.rec_tds + '</td><td></td><td>' + random_player.stats.gp + '</td><td>' + random_player.stats.gs + '</td></tr>';
}