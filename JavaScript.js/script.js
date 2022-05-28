var startButton = $("#startbutton");
var gameH1 = $("#game-h1");
var questEl = $('#question');
var answerOrdered = $("#answers");
var highScoreForm = $("#highscoreform");
var answerAlert = $("#answeralert");

var highScore;
var timeLeft;
var quizIndex;
var correctInput;
var incorrectInput;


// Load Highscores from local storage
highScore = JSON.parse(localStorage.getItem("high-scores"));
if (highScore !== null) {
    for (i=0; i<8 && i<highScore.length; i++){
        let scoreList = $("<li>");
        scoreList.text(`${highScore[i].name}: ${highScore[i].score}`);
        $("#highscore").append(scoreList);
    };
}


// Write a game init function for when start is pressed
// create and append a p ol for questions and ans
function gameInit() {
    // Load Highscores from local storage
    highScore = JSON.parse(localStorage.getItem("high-scores"));
    // Set scores back to 0
    correctInput = 0;
    incorrectInput = 0;
    // Init quiz index to 0
    quizIndex = 0;
    // Set timer
    timeLeft = 60;
    // Remove start button
    startButton.css("display", "none");
    // display first question
    displayQuestion(quizObject[quizIndex]);
    // start timer
    timer();
}


// Function uses myObject parameter to display a question and answers
function displayQuestion(myObject) {

    // Display question in questEl
    questEl.text(myObject.question);

    // for loop to randomly order answers
    let order = Math.round(Math.random() * 3);
    for (i=0; i<3; i++) {
        let answerTrue = $("<li>").addClass("li-answer");
        let answerWrong = $("<li>").addClass("li-answer");
        // if statement to randomly place the true answer
        if (order === i && order < 3) {
            answerTrue.text(myObject.true);
            answerOrdered.append(answerTrue);
            // access index of wrong answer and append to ol
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
        }
        else if (order === 3 && i === 2) {
            // access index of wrong answer and append to ol
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
            // append true last for else case
            answerTrue.text(myObject.true);
            answerOrdered.append(answerTrue);
        }
        else {
            // access index of wrong answer and append to ol
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
        }
    }
}


// Timer function
function timer() {
    // Make a timer element show on HTML game-h1
    gameH1.text(`You have ${timeLeft} seconds left.`);

    var timeInterval = setInterval(function () {

        if (timeLeft > 0 && quizIndex !== quizObject.length){
            // Update timer message every interval
            gameH1.text(`You have ${timeLeft} seconds left.`);
            timeLeft--;
        }
        
        // Finished questions or ran out of time
        else if (timeLeft === 0 || quizIndex === quizObject.length) {

            // Check if not null, and call highScores if correctInput is a top 8 score
            if (highScore !== null) {
                if (highScore.length < 8 || correctInput > highScore[7].score) {
                    highScores();
                }
            }

            // if highS is null, call highScore function
            else if (highScore === null) {
                highScores();
            };

            // delete question
            questEl.text(`You got ${correctInput} answers right and ${incorrectInput} answers wrong.`);
            // delete ansOl items
            answerOrdered.html('');
            // remove answer alert
            answerAlert.text('');
            // remove timer text
            gameH1.text('FINISHED');
            // put back start button
            startButton.css("display", "block")
                .text('Try Again');
            // set variables back to zero
            // set quizindex back to 0
            quizIndex = 0;

            // clear timer function
            clearInterval(timeInterval);
        }
    },1000);
}

function highScores() {
    // show the highscores form
    highScoreForm.show();
};

// Highscores name input event listener
$("#highscoreform").on("click", "#highscorebutton", function (event) {
    event.preventDefault();
    // Get name value from initials input and store in variable name
    let name = $("#initials").val();
    // clear input field
    $("#initials").text('');
    // Create an object with the name and corresponding score
    let myScoreObject = {
        name: name,
        score: correctInput,
    };

    // if no highscores exist in local storage
    if (highScore === null) {
        highScore = [myScoreObject];
    }

    // else highscores exist in local storage
    else {
        let scoreIndex = highScore.length;
        // store name and score to highscores object
        for (let i = 0; i < scoreIndex; i++) {
            // Place value in order of highest to lowest score
            if (correctInput >= highScore[i].score) {
                highScore.splice(i, 0, myScoreObject);
                break;
            }
            else if (i === highScore.length - 1 && correctInput < highScore[i].score) {
                highScore.push(myScoreObject);
                break;
            }
        };
    };

    // store to local storage
    localStorage.clear();
    localStorage.setItem("high-scores", JSON.stringify(highS));
    highScoreForm.hide();
    // update Highscore Container
    $("#highscore").empty();
    for (i = 0; i < 8 && i < highS.length; i++) {
        let scoreList = $("<li>").css("text-decoration", "none");
        scoreList.text(`${highScore[i].name}: ${highScore[i].score}`);
        $("#highscore").append(scoreList);
    };
});



// Write an event listener for start button
// Start button will initialize game
startButton.on("click", function(event) {
    // make sure the start button is target of event with if statement
    let element = event.target;
    if (element.matches("button") === true) {
        // Call functions to initialize game
        gameInit();
    }
})

// Write an event listener for answer selection
answerOrdered.on("click", function(event) {
    // Make sure an <li> was clicked
    let element = event.target;
    if (element.matches("li") === true) {


        // Check the answer
        if (element.textContent === quizObject[quizIndex].true) {
            correctInput++;
            // Increment the quiz object index
            quizIndex++;
            // alert for correct answer
            answerAlert.text("Correct!");
        }
        else if (element.textContent !== quizObject[quizIndex].true) {
            incorrectInput++;
            // Increment the quiz object index
            quizIndex++;
            // Alert wrong answer
            answerAlert.text("Incorrect!");
            // subtract time from clock
            timeLeft -= 5;
        }

        // move on to next quiz question
        if (quizIndex < quizObject.length) {
            // delete question
            questEl.text('');
            // delete ansOl items
            answerOrdered.html('');
            displayQuestion(quizObject[quizIndex]);
        };
    };
});