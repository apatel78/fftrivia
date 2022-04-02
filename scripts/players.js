function updatePlayers() {
    //Check if the json file is empty, if it is call the updateplayersjson function
    $.getJSON('../data/players.json',function(data){
        if (Object.keys(data).length === 0) {
            updatePlayersJson();
        }
    });
    //Check if it is a certain day and year, if it is call the updateplayersjson function
    var date1 = new Date();
    var date2 = new Date('March 18, 2023 01:30:00');
    if(date1.getTime() > date2.getTime()){
        //same date
        updatePlayersJson();
    }
}

function updatePlayersJson() {

}