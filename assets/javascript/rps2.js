var p1Score = 0;
var p2Score = 0;
var ties = 0;
var p1Choice = "";
var p2Choice = "";
var p1Flag = false;
var p2Flag = false;


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


$(document).on("click", ".option1", getChoiceP1);
$(document).on("click", ".option2", getChoiceP2);
$(document).on("click", "#add-smack1", p1Smack);
$(document).on("click", "#add-smack2", p2Smack);


function getChoiceP1(event) {
    // Don't refresh the page!
    event.preventDefault();

    p1Choice = $(this).attr("choice");
    console.log(p1Choice);
    if (p1Choice == "rock") {
        $("#p1-choice").attr("src", "./assets/images/rock.png");
    }
    if (p1Choice == "paper") {
        $("#p1-choice").attr("src", "./assets/images/paper.png");
    }
    if (p1Choice == "scissors") {
        $("#p1-choice").attr("src", "./assets/images/scissors.png");
    }
    p1Flag = true;
    if (p2Flag == true) {
        checkChoice();
    }

};

function getChoiceP2(event) {
    // Don't refresh the page!
    event.preventDefault();

    p2Choice = $(this).attr("choice");
    console.log(p2Choice);
    if (p2Choice == "rock") {
        $("#p2-choice").attr("src", "./assets/images/rock.png");
    }
    if (p2Choice == "paper") {
        $("#p2-choice").attr("src", "./assets/images/paper.png");
    }
    if (p2Choice == "scissors") {
        $("#p2-choice").attr("src", "./assets/images/scissors.png");
    }
    p2Flag = true;
    if (p1Flag == true) {
        setTimeout(checkChoice, 3000);
    }
};

function checkChoice() {
    $("#p1-choice").attr("src", "");
    $("#p2-choice").attr("src", "");

    if (p1Choice === p2Choice) {
        ties++;
        $("#winner").text("Tie Game?")

        console.log(ties);
        $("#winning-img").attr("src", "./assets/images/tie-game.png");

    } else if ((p1Choice == "rock" && p2Choice == "scissors") || (p1Choice == "scissors" && p2Choice == "paper") ||
        (p1Choice == "paper" && p2Choice == "rock")) {
        p1Score++;
        $("#winner").text("Player 1 wins!!!");
        if (p1Choice == "rock") {
            $("#winning-img").attr("src", "./assets/images/rock.png");
        }
        if (p1Choice == "paper") {
            $("#winning-img").attr("src", "./assets/images/paper.png");
        }
        if (p1Choice == "scissors") {
            $("#winning-img").attr("src", "./assets/images/scissors.png");
        }
    } else {
        p2Score++;
        $("#winner").text("Player 2 wins!!!")
        if (p2Choice == "rock") {
            $("#winning-img").attr("src", "./assets/images/rock.png");
        }
        if (p2Choice == "paper") {
            $("#winning-img").attr("src", "./assets/images/paper.png");
        }
        if (p2Choice == "scissors") {
            $("#winning-img").attr("src", "./assets/images/scissors.png");
        }
    }

    database.ref().set({
        p1Score: p1Score,
        p2Score: p2Score,
        ties: ties,
    });
    p1Flag = false;
    p2Flag = false;

    setTimeout(clearImg, 5000);

};

function clearImg() {
    $("#winning-img").attr("src", "");
    $("#winner").text("")
}

function p1Smack() {
    event.preventDefault();

    var smackTalk = $("#p1-smack").val().trim();
    console.log(smackTalk);
    $("#p1-smack").val("");
    var ST = $("<p>")
    ST.addClass("p1-ST")
    ST.text("Player 1: " + smackTalk);
    $("#smack-talk").append(ST);
};

function p2Smack() {
    event.preventDefault();

    var smackTalk = $("#p2-smack").val().trim();
    console.log(smackTalk);
    $("#p2-smack").val("");
    var ST = $("<p>")
    ST.addClass("p2-ST")
    ST.text("Player 2: " + smackTalk);
    $("#smack-talk").append(ST);
};

database.ref().on("value", function (snapshot) {

    p1Score = snapshot.val().p1Score;
    p2Score = snapshot.val().p2Score;
    ties = snapshot.val().ties;

    // Change the HTML to reflect
    $(".p1-score").text("Player 1: " + snapshot.val().p1Score);
    $(".p2-score").text("Player 2: " + snapshot.val().p2Score);
    $(".ties").text("Ties: " + snapshot.val().ties);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});