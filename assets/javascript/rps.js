//Initializing all local variables to be saved to firebase as false/empty/0
var p1Score = 0;
var p2Score = 0;
var ties = 0;
var p1Choice = "";
var p2Choice = "";
var p1Flag = false;
var p2Flag = false;
var gameover = false;
var ST = [""];

//Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAfjcuATk4gfY2wVac4Wi_LuMMFVNfuv9g",
    authDomain: "rps-mp-24d46.firebaseapp.com",
    databaseURL: "https://rps-mp-24d46.firebaseio.com",
    projectId: "rps-mp-24d46",
    storageBucket: "rps-mp-24d46.appspot.com",
    messagingSenderId: "488796740290",
    appId: "1:488796740290:web:0edf54fcb171079513795b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//active status set to false on index page load.
var player1Active = false;
var player2Active = false;

database.ref().update({
    p1Score: p1Score,
    p2Score: p2Score,
    ties: ties,
    p1Flag: p1Flag,
    p2Flag: p2Flag,
    p1Choice: p1Choice,
    p2Choice: p2Choice,
    ST: ST
});

//onlick events for selection the player (index), player choices and submitting smack talk
$(document).on("click", ".player", characterSelect);
$(document).on("click", ".option1", getChoiceP1);
$(document).on("click", ".option2", getChoiceP2);
$(document).on("click", "#add-smack1", p1Smack);
$(document).on("click", "#add-smack2", p2Smack);


//this function is only for the index page. Based on the selected image, firebase is updated with the active user
function characterSelect() {
    var character = $(this).attr("id");

    if (character === "cap") {
        player1Active = true;
    } else {
        player2Active = true;
    }

    database.ref().update({
        player1Active: player1Active,
        player2Active: player2Active,

    });
}

//function for grabbing the choice from Player 1
function getChoiceP1(event) {
    // Don't refresh the page!
    event.preventDefault();

    //grabs the choice based on the button click, displays an image based on the choice
    p1Choice = $(this).attr("choice");
    if (p1Choice == "rock") {
        $("#p1-choice-image").attr("src", "./assets/images/rock.png");
    }
    if (p1Choice == "paper") {
        $("#p1-choice-image").attr("src", "./assets/images/paper.png");
    }
    if (p1Choice == "scissors") {
        $("#p1-choice-image").attr("src", "./assets/images/scissors.png");
    }
    //this flag shows p1 has made a selection
    p1Flag = true;

    //update firebase
    database.ref().update({
        p1Choice: p1Choice,
        p1Flag: p1Flag
    });
    //check if player 2 has made a choice, if so then check the choices for the winner
    database.ref().on("value", function (snapshot) {
        var player2Flag = snapshot.val().p2Flag;
        if (player2Flag === true) {
            setTimeout(checkChoice, 3000);
        }
    });

};

//function for grabbing the choice from Player 2
function getChoiceP2(event) {
    // Don't refresh the page!
    event.preventDefault();

    //grabs the choice based on the button click, displays an image based on the choice
    p2Choice = $(this).attr("choice");
    if (p2Choice == "rock") {
        $("#p2-choice-image").attr("src", "./assets/images/rock.png");
    }
    if (p2Choice == "paper") {
        $("#p2-choice-image").attr("src", "./assets/images/paper.png");
    }
    if (p2Choice == "scissors") {
        $("#p2-choice-image").attr("src", "./assets/images/scissors.png");
    }

    //this flag shows p1 has made a selection
    p2Flag = true;

    //update firebase
    database.ref().update({
        p2Choice: p2Choice,
        p2Flag: p2Flag
    });

    //check if player 1 has made a choice, if so then check the choices for the winner
    database.ref().on("value", function (snapshot) {
        var player1Flag = snapshot.val().p1Flag;
        if (player1Flag === true) {
            setTimeout(checkChoice, 5000);
        }
    });
};

//checks the choices and determines the winner
function checkChoice() {
    //clears the image of the choice
    $("#p1-choice-image").attr("src", "");
    $("#p2-choice-image").attr("src", "");

    //checks fire based for the choices of the players
    database.ref().on("value", function (snapshot) {
        var p1 = snapshot.val().p1Choice;
        var p2 = snapshot.val().p2Choice;
        var p1F = snapshot.val().p1Flag;
        var p2F = snapshot.val().p2Flag;
        p1Score = snapshot.val().p1Score;
        p2Score = snapshot.val().p2Score;
        ties = snapshot.val().ties;

        //check only if both have made a selection
        if (p1F == true && p2F == true) {

            //player 1 win conditions
            if ((p1 == "rock" && p2 == "scissors") || (p1 == "scissors" && p2 == "paper") ||
                (p1 == "paper" && p2 == "rock")) {
                p1Score++;
                $("#winner").text("Captain America wins!!!");
                if (p1 == "rock") {
                    $("#winning-img").attr("src", "./assets/images/rock.png");
                }
                if (p1 == "paper") {
                    $("#winning-img").attr("src", "./assets/images/paper.png");
                }
                if (p1 == "scissors") {
                    $("#winning-img").attr("src", "./assets/images/scissors.png");
                }
            } 
            //ties condition   
            else if (p1 === p2) {
                ties++;
                $("#winner").text("Tie Game? Hulk Smash!!")
                $("#winning-img").attr("src", "./assets/images/tie-game.png");

            } 
            //player 2 wins if all else fails
            else {
                p2Score++;
                $("#winner").text("Iron Man wins!!!")
                if (p2 == "rock") {
                    $("#winning-img").attr("src", "./assets/images/rock.png");
                }
                if (p2 == "paper") {
                    $("#winning-img").attr("src", "./assets/images/paper.png");
                }
                if (p2 == "scissors") {
                    $("#winning-img").attr("src", "./assets/images/scissors.png");
                }
            }
            gameover = true;
            //calls a new function that updates the scores
            setTimeout(clearImg, 5000);

        }
    });

    //sets flags and choices to empty/false to reset the selections
    p1Flag = false;
    p2Flag = false;
    p1Choice = "";
    p2Choice = "";


    //write to firebase
    database.ref().update({
        p1Score: p1Score,
        p2Score: p2Score,
        ties: ties,
        p1Flag: p1Flag,
        p2Flag: p2Flag,
        p1Choice: p1Choice,
        p2Choice: p2Choice,

    });

};

//clears the winning image div and text
function clearImg() {
    $("#winning-img").attr("src", "");
    $("#winner").text("");
    gameover = false;
}

//saving the smack talk for player 1
function p1Smack() {
    event.preventDefault();

    database.ref().on("value", function (snapshot) {

        ST = snapshot.val().ST;
        var smackTalk = $("#p1-smack").val().trim();
        $("#p1-smack").val("");

        if (smackTalk != "") {
            ST.push("Captain America: " + smackTalk);
        }
    });

    database.ref().update({
        ST: ST
    })
};

//saving the smack talk for player 2
function p2Smack() {
    event.preventDefault();

    database.ref().on("value", function (snapshot) {

        ST = snapshot.val().ST;
        var smackTalk = $("#p2-smack").val().trim();
        $("#p2-smack").val("");

        if (smackTalk != "") {
            ST.push("Iron Man: " + smackTalk);
        }
    });

    database.ref().update({
        ST: ST
    });

};

database.ref().on("value", function (snapshot) {
    player1Active = snapshot.val().player1Active;
    player2Active = snapshot.val().player2Active;
    
    p1Score = snapshot.val().p1Score;
    p2Score = snapshot.val().p2Score;
    ties = snapshot.val().ties;

    //update the HTML with the scores
    $(".p1-score").text("Captain America: " + snapshot.val().p1Score);
    $(".p2-score").text("Iron Man: " + snapshot.val().p2Score);
    $(".ties").text("Ties: " + snapshot.val().ties);


    //hides and shows certain text based on if the user is active
    if (player1Active === false) {
        $("#selecting-1, #p1-choice-1").hide();
    } else if (player1Active === true) {
        $("#waiting-1, #p1-choice-1").hide();
    }

    //hides and shows certain text based on if the user is active
    if (player2Active === false) {
        $("#selecting-2, #p1-choice-2").hide();
    } else if (player2Active === true) {
        $("#waiting-2, #p1-choice-2").hide();
    }


    //updates the smack talk
    ST = snapshot.val().ST;
    $("#smack-talk").empty();
    for (var i = 0; i < ST.length; i++) {
        var smack = $("<p>");
        smack.addClass("ST");
        smack.text(ST[i]);
        $("#smack-talk").prepend(smack);
    }



}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});