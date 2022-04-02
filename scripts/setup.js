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

//Updates the statistics for the player
function updateStatistics(random_player) {
    $("#stats_table_pass").append(createPassDiv(random_player));
    $("#stats_table_rush").append(createRushDiv(random_player));
    $("#stats_table_catch").append(createCatchDiv(random_player));
}

//Creates the stats table for passing 
function createPassDiv(random_player) {
  return "<tr><td>CMP</td><td>" + random_player.stats.cmp + "</td></tr><tr><td>Att</td><td>" + random_player.stats.pass_att + "</td>\
  </tr><tr><td>Yds</td><td>" + random_player.stats.pass_yds + "</td></tr><tr><td>YPA</td><td>" + random_player.stats.pass_ypa + "</td>\
  </tr><tr><td>TDs</td><td>" + random_player.stats.pass_tds + "</td></tr><tr><td>INT</td><td>" + random_player.stats.int + "</td></tr>";
}

//Creates the stats table for rushing 
function createRushDiv(random_player) {
   return "<tr><td>GP</td><td>" + random_player.stats.gp + "</td></tr><tr><td>Att</td><td>" + random_player.stats.rush_att + "</td>\
  </tr><tr><td>Yds</td><td>" + random_player.stats.rush_yds + "</td></tr><tr><td>YPC</td><td>" + random_player.stats.rush_ypc + "</td>\
  </tr><tr><td>TDs</td><td>" + random_player.stats.rush_tds + "</td></tr><tr><td>FUM</td><td>" + random_player.stats.fum + "</td></tr>";
}

//Creates the stats table for catching 
function createCatchDiv(random_player) {
  return "<tr><td>GS</td><td>" + random_player.stats.gs + "</td></tr><tr><td>REC</td><td>" + random_player.stats.rec + "</td>\
  </tr><tr><td>TAR</td><td>" + random_player.stats.tar + "</td></tr><tr><td>Yds</td><td>" + random_player.stats.rec_yds + "</td>\
  </tr><tr><td>YPC</td><td>" + random_player.stats.rec_ypc + "</td></tr><tr><td>TDs</td><td>" + random_player.stats.rec_tds + "</td></tr>";
}