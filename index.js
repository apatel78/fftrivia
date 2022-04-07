$(document).ready( function() {

    $("#daily_button").click( () => {
        window.location.replace("http://127.0.0.1:5500/pages/game.html");
        sessionStorage.setItem("mode", "daily");
    });

    $("#free_button").click( () => {
        window.location.replace("http://127.0.0.1:5500/pages/game.html");
        sessionStorage.setItem("mode", "free");
    });

});