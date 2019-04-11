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
            $(".question").append("<h2 class='question-header2'>" + this.question + "</h2>");
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
                $(".answers").append("<p class='answer-paragraph'>" + answer + "</p>");
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

    var questionObjectOne = new Questions("How many pounds of milk does it take to make one pound of cheese?", "10 pounds", "8 pounds", "20 pounds", "42 pounds");
    var questionObjectTwo = new Questions("Which state produces over 25% of the cheese in this country?", "Wisconsin", "New York", "California", "Delaware");
    var questionObjectThree = new Questions("What makes some cheddar cheese orange in color?", "Typically Annato, which is derived from the seeds of the achiote tree", "Freshly ground orange rind, dipped in sulfuric acid.", "Melted traffic cones", "Most cheese is colored orange with small amounts of turmeric");
    var questionObjectFour = new Questions("Is American Cheese really cheese?", "No, it is classified as \"Cheese Product\".", "Yes of course it is", "No, it's actually made of Soylent Green, died with annato", "Yes, and it is regarded by the French as the finest form of cheese ever made");
    var questionObjectFive = new Questions("What are the crunchy bits you sometimes encounter in aged cheese?", "Those are composed of amino acid crystals", "They are ground up bits of lost lego steering wheels", "The are chunks of undisolved rennet", "What chunks?");
    var questionObjectSix = new Questions("How many types of French cheese are there?", "Roughly 1,000", "Only one: American Cheese", "Close to 300,000", "Who cares, I hate cheese");
    var questionObjectSeven = new Questions("Where is Västerbottensost cheese made?", "Burträsk, Sweden", "Madison, WI", "Hedgehog, KY", "Obviously you're not a golfer");
    var questionObjectEight = new Questions("What is the maximum cheese content of Kraft singles?", "At most, 51%", "At least 90%", "Nobody Knows", "They struggle to get 33% in there.");
    var questionObjectNine = new Questions("What is the most expensive cheese in the world?", "Pule cheese, which is made from the milk of Balkan Donkeys", "Yasserbatro Cheese which is made from the dung of the Peruvian muskrat", "Cheddar cheese wrapped in $100 bills", "Tatooine Womp Rat cheese which is made from womp rats bullseyed with a T-16");
    var questionObjectTen = new Questions("What is the preferred cheese of Wallace, from Wallace and Gromit?", "Wensleydale Cheese", "Farmswoggle Cheese", "Kraft Singles", "Robotic Pants");

    questionArray.push(questionObjectOne, questionObjectTwo, questionObjectThree, questionObjectFour, questionObjectFive, questionObjectSix, questionObjectSeven, questionObjectEight, questionObjectNine, questionObjectTen);

    // ----------------------------- global functions ------------------------------------

    // timer function for the question duration (ten seconds)
    // after time is up changes color of correct answer, and grays out the rest of the paragraphs. 
    // creates a h1 above the question that says "time's up!"
    // then calls the 3 sec delay to set the next question
    function questionTimer() {
        console.log("questionTimer is running");
        countDown = 15;
        $(".count-down").animate({width: "100%"}, 10);
        countDownTimerInterval();
        questionTimerVar = setTimeout(function () {
            currentQuestion.correctAnswerStyler();
            $(".question").before("<h1 class='time-up'>Time's up!</h1>");
            questionSwitchTimout(questionIndex);
            questionIndex++;
            clearInterval(countDownTimer);
        }, countDown * 1000 + 100);
    }

    // set interval function that counts down the seconds till you run out of time.
    function countDownTimerInterval() {
        $(".count-down-timer").text("Time Remaining: " + countDown);
        $(".count-down").css({"background-color": "green"});
            countDownTimer = setInterval(function() {
                countDown--;
                $(".count-down-timer").text("Time Remaining: " + countDown);
                $(".count-down").animate({width: "-=6.7%"}, 100);
                if (countDown >= 11) {
                    $(".count-down").css({"background-color": "green"});
                } else if (countDown < 11 && countDown >= 6) {
                    $(".count-down").css({"background-color": "orange"});
                } else {
                    $(".count-down").css({"background-color": "red"});
                }
            }, 1000);
    }

    // timer function to switch the question (three seconds)
    function questionSwitchTimout(index) {
        console.log("you started the next question timer");
        // checks to see if we're at the end of the array
        var questionSwitch = setTimeout(function () {
            if (index === randomQuestionArray.length - 1) {
                // run code to go to final screen
                // erase the paragraphs, h1 and h2 for the question and answers
                $(".container").find(".time-up").remove();
                $(".question").children().remove();
                $(".answers").children().remove();
                // set answer arrays to empty arrays before running the randomizers 
                randomAnswerArray.length = 0;
                answerArray.length = 0;
                // show correct and incorrect answers
                $(".count-down").remove();
                $(".count-down-timer").remove();
                $(".question").append("<h2 class='final-screen-h2'>You're Done!</h2>");
                $(".answers").append("<p class='stats'>Correct Answers: " + correctAnswers + "</p>");
                $(".answers").append("<p class='stats'>Incorrect Answers: " + incorrectAnswers + "</p>");
                $(".answers").append("<p class='stats'>Percent Correct: " + correctAnswers/(correctAnswers + incorrectAnswers)*100 + "%</p>");
                $(".answers").append("<button class='reset' type='button'>Start Again?</button>");


            } else {
                // set the current question
                currentQuestion = randomQuestionArray[index];
                // erase the paragraphs, h1 and h2 for the question and answers
                $(".container").find(".time-up").remove();
                $(".question").children().remove();
                $(".answers").children().remove();
                // set answer arrays to empty arrays before running the randomizers 
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


    // question randomizer 
    function questionRandomizer() {
        while (randomQuestionArray.length < questionArray.length) {
            var randomIndex = Math.floor(Math.random() * questionArray.length);
            if (!randomQuestionArray.includes(questionArray[randomIndex])) {
                randomQuestionArray.push(questionArray[randomIndex]);
            }
        }
    }
    // ----------------------------- page building code ---------------------------------
    var containerDiv = $(".container");



    // ----------------------------- event listeners -------------------------------------
    $("#start-button").on("click", function () {
        questionTimer();
        $("#start-button").fadeOut();
        $("header").fadeOut();
        containerDiv.append("<div class='question'></div>");
        containerDiv.append("<div class='answers'></div>");
        containerDiv.addClass("cheese");
        $(".question").after("<div class='count-down-timer'></div>");
        $(".question").after("<div class='count-down'></div>");
        questionRandomizer();
        currentQuestion = randomQuestionArray[questionIndex];
        currentQuestion.answerDisplay();
        currentQuestion.questionDisplay();
    });

    $("body").on("click", ".answer-paragraph", function () {
        clearInterval(countDownTimer);
        clearTimeout(questionTimerVar);
        questionIndex++;
        questionSwitchTimout(questionIndex);
        if ($(this).text() === currentQuestion.answer) {
            $(".question").before("<h1 class='time-up'>Correct!</h1>");
            $(this).css({ "background-color": "green" });
            correctAnswers++;
        } else {
            $(".question").before("<h1 class='time-up'>Wrong!</h1>");
            $(this).css({ "background-color": "red" });
            incorrectAnswers++;
        }
    });




















});