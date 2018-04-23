function createLowStakesMultiChoiceQuestion(id, questionNumber, choices, prompt, answer, image, required, attempts, feedbackLink, linkText) {
    image = typeof image !== 'undefined' ? image : false;
    required = typeof required !== 'undefined' ? required : true;
    attemps = typeof attemps !== 'undefined' ? attemps : 2;
    feedbackLink = typeof feedbackLink !== 'undefined' ? feedbackLink : "default";

    var quizToAppendTo = document.getElementById(id);
    var insertPoint = quizToAppendTo.lastElementChild;
    var questionElement = document.createElement('li');
    var questionPrompt = document.createElement('span');
    var responseList = document.createElement('ul');
    var feedbackElement = document.createElement('div');

    questionPrompt.textContent = prompt;
    questionElement.appendChild(questionPrompt);
    if (image) {
        var quizImage = document.createElement('img');
        quizImage.style.width = '90%';
        quizImage.style['margin-top'] = '1em';
        quizImage.src = image;
        questionElement.appendChild(quizImage);
    }
    responseList.classList.add('choices');

    for (var choice in choices) {
        var listElement = document.createElement('li');
        listElement.textContent = choices[choice];
        if (choices[choice] === answer) {
            listElement.classList.add('correct');
        }
        responseList.appendChild(listElement);
    }
    questionElement.appendChild(responseList);
    feedbackElement.classList.add('feedback');
    feedbackElement.style.display = 'none';
    feedbackElement.textContent = 'Feedback';
    feedbackElement.setAttribute('feedbackLink', feedbackLink);
    feedbackElement.setAttribute('linkText', linkText);
    questionElement.appendChild(feedbackElement);
    quizToAppendTo.insertBefore(questionElement, insertPoint);
    attachClickHandler();
}




var quizAttempts; // tries and results
// [0,1],[1] ...
var storedData = localStorage.getItem('quizAttempts');
if (storedData) {
    quizAttempts = JSON.parse(storedData);
} else {
    quizAttempts = [];
}

$(document).on('click', '.feedbackLink', function(evt) {
    evt.preventDefault();
    window.top.ReadiumSDK.reader.openContentUrl($(this).attr('href'));
});

$().ready(function () {
    if (quizAttempts.length === 0) {
        $('ol.quiz > li').each(function () {
            quizAttempts.push([]);
        });
    } else {
        var counter = 0;
        $('ol.quiz > li').each(function () {
            if (quizAttempts[counter][0] == false && quizAttempts[counter][1] == false) {
                $(this).children('.choices').addClass('reveal secondary');
                var feedBackLink = $(this).children('.feedback').attr('feedbackLink');
                var linkText = $(this).children('.feedback').attr('linkText');
                if (feedBackLink != 'default')
                    $(this).children('.feedback').html('Please study the correct answer in <a class="feedbackLink" href="' + feedBackLink + '">' + linkText + '</a>');
                else
                    $(this).children('.feedback').text('Please study the correct answer.');
                $(this).children('.feedback').slideDown();
            }
            if (quizAttempts[counter][0] == true || quizAttempts[counter][1] == true) {
                $(this).children('.choices').addClass('reveal');
                $(this).children('.feedback').text("That's correct.");
                $(this).children('.feedback').slideDown();
            }
            counter++;
        });
    }
});

function attachClickHandler() {
    $('ol.quiz .choices').off();
    $('ol.quiz .choices').on('click', 'li', function () {
        console.log('test');
    var prompt = $(this).parents().children('span').text();
    var $answers = $(this).parents('.choices');
    var $answersText = $answers.children();
    $answersText = $answersText.map(function (i) {
    return $($answersText[i]).text();
    });
    var $feedback = $answers.siblings('.feedback');
    var correct = $(this).hasClass('correct'); // T or F
    var questionNum = $('ol.quiz .choices').index($answers);

    if (quizAttempts[questionNum].length == 0) {

        // first attempt
        $answers.children('li').removeClass('wrong');
        quizAttempts[questionNum].push(correct);
        localStorage.setItem('quizAttempts', JSON.stringify(quizAttempts));
        if (correct == true) {
            $answers.addClass('reveal');
            $feedback.text(correctFeedback(1));
            if (window.top.pebl != null)
                window.top.pebl.eventAnswered(prompt, $answersText, $(this).text(), correct, true);
        } else {
        
            $(this).addClass('wrong');
            //$(this).delay(1000).slideUp();
            $feedback.text(wrongFeedback(1));
            if (window.top.pebl != null)
            window.top.pebl.eventAnswered(prompt, $answersText, $(this).text(), correct, false);
        }
    
    gradeTest();
    $feedback.slideDown();
    } else if (quizAttempts[questionNum].length == 1 && quizAttempts[questionNum][0] == false) {

        // 2nd attempt
        //$answers.children('li').removeClass('wrong');
        quizAttempts[questionNum].push(correct);
        localStorage.setItem('quizAttempts', JSON.stringify(quizAttempts));
        if (correct == true) {
        $answers.addClass('reveal');
        $feedback.text(correctFeedback(2));
        } else {
        setTimeout(function () {
            $answers.addClass('reveal secondary');
        }, 1500);
        
        $(this).addClass('wrong');
        //$(this).delay(1000).slideUp();
        if ($feedback.attr('feedbackLink') != 'default')
            $feedback.html('Please study the correct answer in <a class="feedbackLink" href="' + $feedback.attr('feedbackLink') + '">' + $feedback.attr('linkText') + '</a>');
        else
            $feedback.text(wrongFeedback(2));
        }

    if (window.top.pebl != null)
        window.top.pebl.eventAnswered(prompt, $answersText, $(this).text(), correct, true);
    gradeTest();
    $feedback.slideDown();
    } else if (quizAttempts[questionNum].length > 1) {
        // Ignore repeated attempts
    }
});
}


function gradeTest() {
    var score = 0;
    var total = 0;
    var finished = true;
    for (var i = 0; i < quizAttempts.length && finished; i++) {
    var question = quizAttempts[i];
    if ((question.length == 0) || ((question.length == 1) && (!question[0])))
        finished = false;
    if (finished) {
        if ((question.length == 2) && question[1])
        score += 1;
        else if (question[0])
        score += 1;
    }
    total += 1;
    }
    if (finished) {
    var id = $("ol.quiz")[0].id;
    var description = $(".title").text().trim();
    var normalizedScore = ((Math.round((score/total) * 100) / 100) * 100) | 0;
    var quizFeedback = "%" + normalizedScore;
    if ((score / total) >= 0.8) {
        if (window.top.pebl != null)
        window.top.pebl.eventPassed(normalizedScore, id, description);
        quizFeedback += " - You passed!";
    } else {
        if (window.top.pebl != null)
        window.top.pebl.eventFailed(normalizedScore, id, description);
        quizFeedback += " - You did not pass, you should review the material and try again.";
    }
    localStorage.removeItem('quizAttempts');
    $(".quizScore").text(quizFeedback);
    }
}

function wrongFeedback(attempt) {
    var feedback = "";
    if (attempt == 1) {
        // First try
        //        feedback = "Attempt number " + attempt + " is wrong. Try again."
        feedback = "Not quite. Try again.";
    } else {
        // 2nd Try
        //        feedback = "Attempt number " + attempt + " is wrong. Check out the right answer."
        feedback = "Please study the correct answer.";
    }
    return feedback;
}

function correctFeedback(attempt) {
    var feedback = "";
    feedback = "That's correct.";
    return feedback;
}