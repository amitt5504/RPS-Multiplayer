var p1Score = 0;
var p2Score = 0;
var ties = 0;
var p1Choice = "";
var p2Choice = "";
var p1Flag = false;
var p2Flag = false;
var gameover = false;
var ST = [""];

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

$(document).on("click", ".player", characterSelect);
$(document).on("click", ".option1", getChoiceP1);
$(document).on("click", ".option2", getChoiceP2);
$(document).on("click", "#add-smack1", p1Smack);
$(document).on("click", "#add-smack2", p2Smack);



function characterSelect() {
    // event.preventDefault();
    var character = $(this).attr("id");
    console.log(this);

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

function getChoiceP1(event) {
    // Don't refresh the page!
    event.preventDefault();

    p1Choice = $(this).attr("choice");
    //console.log(p1Choice);
    if (p1Choice == "rock") {
        $("#p1-choice-image").attr("src", "./assets/images/rock.png");
    }
    if (p1Choice == "paper") {
        $("#p1-choice-image").attr("src", "./assets/images/paper.png");
    }
    if (p1Choice == "scissors") {
        $("#p1-choice-image").attr("src", "./assets/images/scissors.png");
    }
    p1Flag = true;

    database.ref().update({
        p1Choice: p1Choice,
        p1Flag: p1Flag
    });
    database.ref().on("value", function (snapshot) {
        var player2Flag = snapshot.val().p2Flag;
        //console.log(player2Flag);

        if (player2Flag === true) {
            setTimeout(checkChoice, 3000);
        }
    });

};

function getChoiceP2(event) {
    // Don't refresh the page!
    event.preventDefault();

    p2Choice = $(this).attr("choice");
    //console.log(p2Choice);
    if (p2Choice == "rock") {
        $("#p2-choice-image").attr("src", "./assets/images/rock.png");
    }
    if (p2Choice == "paper") {
        $("#p2-choice-image").attr("src", "./assets/images/paper.png");
    }
    if (p2Choice == "scissors") {
        $("#p2-choice-image").attr("src", "./assets/images/scissors.png");
    }
    p2Flag = true;

    database.ref().update({
        p2Choice: p2Choice,
        p2Flag: p2Flag
    });

    database.ref().on("value", function (snapshot) {
        var player1Flag = snapshot.val().p1Flag;

        if (player1Flag === true) {
            setTimeout(checkChoice, 5000);
        }
    });
};

function checkChoice() {
    console.log("me?")
    $("#p1-choice-image").attr("src", "");
    $("#p2-choice-image").attr("src", "");

    database.ref().on("value", function (snapshot) {
        var p1 = snapshot.val().p1Choice;
        var p2 = snapshot.val().p2Choice;
        var p1F = snapshot.val().p1Flag;
        var p2F = snapshot.val().p2Flag;
        p1Score = snapshot.val().p1Score;
        p2Score = snapshot.val().p2Score;
        ties = snapshot.val().ties;

        if (p1F == true && p2F == true) {



            if ((p1 == "rock" && p2 == "scissors") || (p1 == "scissors" && p2 == "paper") ||
                (p1 == "paper" && p2 == "rock")) {
                p1Score++;
                $("#winner").text("Player 1 wins!!!");
                if (p1 == "rock") {
                    $("#winning-img").attr("src", "./assets/images/rock.png");
                }
                if (p1 == "paper") {
                    $("#winning-img").attr("src", "./assets/images/paper.png");
                }
                if (p1 == "scissors") {
                    $("#winning-img").attr("src", "./assets/images/scissors.png");
                }
            } else if (p1 === p2) {
                ties++;
                $("#winner").text("Tie Game?")

                // console.log(ties);
                $("#winning-img").attr("src", "./assets/images/tie-game.png");

            } else {
                p2Score++;
                $("#winner").text("Player 2 wins!!!")
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
            setTimeout(clearImg, 5000);

        }
    });

    p1Flag = false;
    p2Flag = false;
    p1Choice = "";
    p2Choice = "";


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

function clearImg() {
    $("#winning-img").attr("src", "");
    $("#winner").text("");
    gameover = false;
}


function p1Smack() {
    event.preventDefault();

    database.ref().on("value", function (snapshot) {

        ST = snapshot.val().ST;
        console.log(ST);

        var smackTalk = $("#p1-smack").val().trim();
        $("#p1-smack").val("");

        if (smackTalk != "") {
            //$("#smack-talk").empty();
            ST.push("Player 1: " + smackTalk);

            // for (var i = 0; i < ST.length; i++) {

            //     var smack = $("<p>");
            //     smack.addClass("ST");
            //     smack.text(ST[i]);
            //     $("#smack-talk").prepend(smack);
            // }

        }
    });

    database.ref().update({
        ST: ST
    })
};

function p2Smack() {
    event.preventDefault();

    database.ref().on("value", function (snapshot) {

        ST = snapshot.val().ST;
        console.log(ST);

        var smackTalk = $("#p2-smack").val().trim();
        $("#p2-smack").val("");


        if (smackTalk != "") {
            ST.push("Player 2: " + smackTalk);
        }
    });

    database.ref().update({
        ST: ST
    });

};



database.ref().on("value", function (snapshot) {
    player1Active = snapshot.val().player1Active;
    player2Active = snapshot.val().player2Active;
    //var player1Flag = snapshot.val().p1Flag;
    //var player2Flag = snapshot.val().p2Flag;


    p1Score = snapshot.val().p1Score;
    p2Score = snapshot.val().p2Score;
    ties = snapshot.val().ties;

    // Change the HTML to reflect
    $(".p1-score").text("Player 1: " + snapshot.val().p1Score);
    $(".p2-score").text("Player 2: " + snapshot.val().p2Score);
    $(".ties").text("Ties: " + snapshot.val().ties);


    if (player1Active === false) {
        $("#selecting-1, #p1-choice-1").hide();
    } else if (player1Active === true) {
        $("#waiting-1, #p1-choice-1").hide();
    }

    if (player2Active === false) {
        $("#selecting-2, #p1-choice-2").hide();
    } else if (player2Active === true) {
        $("#waiting-2, #p1-choice-2").hide();
    }


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