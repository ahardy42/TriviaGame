$(document).ready(function () {
    // game code begins! 

    // ----------------------------- global variables ----------------------------------

    // html string of the current question 
    var currentQuestion;
    // array of questions, randomized at the start of game play
    var questionArray = [];
    // random question array
    var randomQuestionArray = [];
    // array of answers for the current question object
    var answerArray = [];
    // randomized answer array. answers are html string to be used on the page.
    var randomAnswerArray = [];
    // index counter variable
    var questionIndex = 0;
    // countdown variable
    var countDown = 15;
    // making the timeout function a global variable. 
    var questionTimerVar;
    var questionSwitch;
    var countDownTimer;

    // stats
    var correctAnswers = 0;
    var incorrectAnswers = 0;
    var percentCorrect = 0;

    // ----------------------------- page building code ---------------------------------
    // the elements of the page, not created in a class method, which will be added later, go here
    // creating the iframe for the hilarious Yellow Ledbetter misheard lyrics video
    var iframeDiv = $("<div class='iframe-container'>");
    var iframe = $("<iframe width='560' height='315' src='https://www.youtube.com/embed/xLd22ha_-VU' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen>");
    var iframeCaption = $("<p>Check out this hilarious video!</p>");
    iframeDiv.append(iframe);
    iframeDiv.append(iframeCaption);
    // creating the div to hold questions, answers and timer information
    var containerDiv = $(".container");
    var headerOne = $("<h3 class='time-up'>");
    headerOne.text("????");
    // final screen header
    var finalScreenHeader = $("<h2 class='final-screen-h2'>");
    finalScreenHeader.text("You're Done!");
    // paragraph for stats at the end of the game
    var correctAnswersParagraph = $("<p class='stats'>");
    var incorrectAnswersParagraph = $("<p class='stats'>");
    // function to determine how you did in the game
    function percentageCorrect() {
        percentCorrect = correctAnswers / (correctAnswers + incorrectAnswers) * 100;
    } 
    var PercentCorrectParagraph = $("<p class='stats'>");  
    // this button will reset and begin the game over again
    var resetButton = $("<button class='reset' id='reset-button' type='button'>");
    resetButton.text("Start Again?");
    // the common set of commands that create the final screen
    function finalScreen() {
        percentageCorrect()
        $(".count-down").remove();
        $(".count-down-timer").remove();
        $(".question").append(finalScreenHeader);
        $(".question").append(iframeDiv);
        correctAnswersParagraph.html("Correct Answers: " + correctAnswers);
        $(".answers").append(correctAnswersParagraph);
        incorrectAnswersParagraph.html("Incorrect Answers: " + incorrectAnswers);
        $(".answers").append(incorrectAnswersParagraph);
        PercentCorrectParagraph.html("Percent Correct: " + percentCorrect);
        $(".answers").append(PercentCorrectParagraph);
        $(".answers").append(resetButton);
        questionIndex = 0;
    }
    // more page creation stuff - these are divs that hold info that gets created by each instance of the class
    var questionDiv = $("<div class='question'>");
    var answerDiv = $("<div class='answers'>");
    var countDownDiv = $("<div class='count-down-timer'>");
    var countDownNumDiv = $("<div class='count-down'>");

    // common commands that start the game.  used in the intial button click event, and reset button click
    function startGame() {
        questionTimer();       
        $(".question").before(headerOne);  
        $(".question").after(countDownDiv);
        $(".question").after(countDownNumDiv);
        questionRandomizer();
        currentQuestion = randomQuestionArray[questionIndex];
        currentQuestion.answerDisplay();
        currentQuestion.questionDisplay();
    }

    // ----------------------------- classes and class instances -----------------------
    function Questions(question, answer, fakeAnswerOne, fakeAnswerTwo, fakeAnswerThree) {
        this.question = question;
        this.answer = answer;
        this.fakeAnswerOne = fakeAnswerOne;
        this.fakeAnswerTwo = fakeAnswerTwo;
        this.fakeAnswerThree = fakeAnswerThree;

        // methods
        // display the question on the screen
        this.questionDisplay = function () {
            var questionHeader = $("<h2 class='question-header2'>");
            questionHeader.text(this.question);
            $(".question").append(questionHeader);
        }

        //display the answers in a random order
        this.answerDisplay = function () {
            answerArray.push(answer, fakeAnswerOne, fakeAnswerTwo, fakeAnswerThree);
            while (randomAnswerArray.length < answerArray.length) {
                var randomIndex = Math.floor(Math.random() * answerArray.length);
                if (!randomAnswerArray.includes(answerArray[randomIndex])) {
                    randomAnswerArray.push(answerArray[randomIndex]);
                }
            }
            // grab the element you want to display the random answer array in, and do a forEach to create a new <p> with the 
            // array element. 
            randomAnswerArray.forEach(function (answer) {
                if (answer !== undefined) {
                    var answerParagraph = $("<p class='answer-paragraph'>");
                    answerParagraph.text(answer);
                    $(".answers").append(answerParagraph);
                }
            });
        }

        // change the style of the correct answer
        this.correctAnswerStyler = function () {
            var childElements = $(".answers").children();
            for (i = 0; i < childElements.length; i++) {
                if (this.answer === childElements[i].textContent) {
                    $(childElements[i]).css({
                        "background-color": "green",
                        "border-color": "green"
                    });
                } else {
                    $(childElements[i]).css({
                        "color": "grey",
                        "border-color": "grey"
                    });
                }
            }
        }
    }

    // creating instances of the class "Questions" with some Q/A about pearl jam lyrics
    var questionObjectOne = new Questions("Corduroy: chorus two, line two", "They can buy but can't put on my clothes", "Bacon by the can, put on my clothes", "Thinkin' 'bout the cancer on my clothes", "Achin' by the candle on my clothes");
    var questionObjectTwo = new Questions("Corduroy: verse one, line one", "The Waiting Drove Me Mad", "The waiting trophy man", "Stop wasting trophies, man");
    var questionObjectThree = new Questions("Daughter: verse one, line one", "Alone, listless", "Alone, breastless", "Alone, this lass", "Alone, this list");
    var questionObjectFour = new Questions("Daughter: first hook, line six", "She holds the hand that holds her down", "She holds the can, it holds her down", "She gnaws the hand that holds the pan");
    var questionObjectFive = new Questions("Yellow Ledbetter: verse one line one", "Unsealed on a porch a letter sat", "By the seaside with some pork Ledbetter sat", "On the ceiling on a porch a letter sat", "On a ceilin', on a front side letter sat");
    var questionObjectSix = new Questions("Yellow Ledbetter: verse one line three", "Once I saw her on a beach of weathered sand", "Once I saw her on a beach of little horses", "By the wayside on the frontside of the lawn", "One bizarre hymn, on a beach the little horses");
    var questionObjectSeven = new Questions("Yellow Ledbetter: verse one, line nine", "I said, I don't know whether I'm the boxer or the bag", "I said 'I know what I wear. Is that a box or a bag?'", "I know I don't want to live in a Bachelor pad", "I said, I maaa na mumble muuuuuuuuuuuh ???");
    var questionObjectEight = new Questions("Yellow Ledbetter: verse one line five", "On a weekend wanna wish it all away", "On a wheel, on a wizard, on a whale", "???????", "I wanna wheel, Imma wiz along the way");
    var questionObjectNine = new Questions("Why Go: chorus", "Why go home?", "I go home", "White girl ho!", "Rhino horn");
    
    // creating an array from the resulting clas instances
    questionArray.push(questionObjectOne, questionObjectTwo, questionObjectThree, questionObjectFour, questionObjectFive, questionObjectSix, questionObjectSeven, questionObjectEight, questionObjectNine);

    // ----------------------------- global functions ------------------------------------

    // timer function for the question duration (ten seconds)
    // after time is up changes color of correct answer, and grays out the rest of the paragraphs. 
    // creates a h1 above the question that says "time's up!"
    // then calls the 3 sec delay to set the next question
    function questionTimer() {
        countDown = 15;
        $(".count-down").animate({ width: "100%" }, 10);
        countDownTimerInterval();
        questionTimerVar = setTimeout(function () {
            currentQuestion.correctAnswerStyler();
            headerOne.text("Time's Up!");
            questionIndex++;
            questionSwitchTimout(questionIndex);
            clearInterval(countDownTimer);
            incorrectAnswers++;
        }, countDown * 1000 + 100);
    }

    // set interval function that counts down the seconds till you run out of time.
    function countDownTimerInterval() {
        $(".count-down-timer").text("Time Remaining: " + countDown);
        $(".count-down").css({ "background-color": "green" });
        countDownTimer = setInterval(function () {
            countDown--;
            $(".count-down-timer").text("Time Remaining: " + countDown);
            $(".count-down").animate({ width: "-=6.7%" }, 100);
            if (countDown >= 11) {
                $(".count-down").css({ "background-color": "green" });
            } else if (countDown < 11 && countDown >= 6) {
                $(".count-down").css({ "background-color": "orange" });
            } else {
                $(".count-down").css({ "background-color": "red" });
            }
        }, 1000);
    }

    // timer function to switch the question (three seconds)
    function questionSwitchTimout(index) {
        // checks to see if we're at the end of the array
        var questionSwitch = setTimeout(function () {
            if (index === randomQuestionArray.length - 1) {
                // run code to go to final screen
                // erase the paragraphs, h1 and h2 for the question and answers
                headerOne.remove();
                $(".question").children().remove();
                $(".answers").children().remove();
                // set answer arrays to empty arrays before running the randomizers 
                randomAnswerArray.length = 0;
                answerArray.length = 0;
                // show correct and incorrect answers
                finalScreen();
            } else {
                // set the current question
                currentQuestion = randomQuestionArray[index];
                // erase the paragraphs, h1 and h2 for the question and answers
                headerOne.text("????");
                $(".question").children().remove();
                $(".answers").children().remove();
                // set answer arrays to empty arrays before running the randomizers to randomize the next set of answers
                randomAnswerArray.length = 0;
                answerArray.length = 0;
                // display question
                currentQuestion.questionDisplay();
                // randomize answers
                currentQuestion.answerDisplay();
                // start the next timer
                questionTimer();
            }
        }, 4000);
    }

    // question randomizer creates a new array w/ questions in random order
    function questionRandomizer() {
        while (randomQuestionArray.length < questionArray.length) {
            var randomIndex = Math.floor(Math.random() * questionArray.length);
            if (!randomQuestionArray.includes(questionArray[randomIndex])) {
                randomQuestionArray.push(questionArray[randomIndex]);
            }
        }
    }

    // ----------------------------- event listeners -------------------------------------
    // start button click listener. fades out the header and button and then displays the current question
    $("#start-button").on("click", function () {
        $("#start-button").fadeOut();
        $("header").fadeOut();
        // builds the page out after clicking the start button
        containerDiv.append(questionDiv);
        containerDiv.append(answerDiv);
        containerDiv.addClass("pearl-jam");
        startGame();
    });

    // on click for the answer paragraphs. does some styling depending on whether you're right or not. 
    $("body").on("click", ".answer-paragraph", function () {
        clearInterval(countDownTimer);
        clearTimeout(questionTimerVar);
        questionIndex++;
        questionSwitchTimout(questionIndex);
        if ($(this).text() === currentQuestion.answer) {
            // change the text of headerOne and show it
            headerOne.animate({ "opacity": "0" });
            headerOne.text("Correct!");
            headerOne.animate({ "opacity": "1" });
            $(this).css({ "background-color": "green" });
            // increment the correct answer count
            correctAnswers++;
        } else {
            headerOne.animate({ "opacity": "0" });
            headerOne.text("Wrong!");
            headerOne.animate({ "opacity": "1" });
            currentQuestion.correctAnswerStyler();
            $(this).css({ "background-color": "red", "color": "black" });
            // increment the incorrect answer count
            incorrectAnswers++;
        }
    });

    /* reset the page button brings you back to the first question. 
    so, you need to remove the paragraph and heading tags and then scramble the questions / answers and
    display everything again. 
    */
    $("body").on("click", "#reset-button", function () {
        // reset the ??? header screen
        headerOne.text("????");
        // remove you're done statement
        finalScreenHeader.remove();
        iframeDiv.remove();
        // remove stats and reset stats
        correctAnswersParagraph.remove();
        incorrectAnswersParagraph.remove();
        PercentCorrectParagraph.remove();
        correctAnswers = 0;
        incorrectAnswers = 0;
        // remove button
        resetButton.remove();
        randomQuestionArray = [];
        startGame();
    });
});