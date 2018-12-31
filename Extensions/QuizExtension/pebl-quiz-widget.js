var globalPebl = window.top.PeBL;
var globalReadium = window.top.READIUM;

var lowStakesQuiz = {};

globalPebl.extension.lowStakesQuiz = lowStakesQuiz;

lowStakesQuiz.createLowStakesMultiChoiceQuestion = function(id, questionNumber, choices, prompt, answer, image, required, attempts, feedbackLink, linkText) {
    var quizToAppendTo = document.getElementById(id);
    var insertPoint = quizToAppendTo.lastElementChild;
    var questionElement = document.createElement('li');
    var questionPromptContainer = document.createElement('div');
    questionPromptContainer.classList.add('questionPromptContainer');
    var questionNumberSpan = document.createElement('span');
    questionNumberSpan.classList.add('questionNumberSpan');
    var questionPrompt = document.createElement('span');
    var responseList = document.createElement('ul');
    var feedbackElement = document.createElement('div');

    questionNumberSpan.textContent = questionNumber + ".";
    questionPrompt.textContent = prompt;
    //questionPromptContainer.appendChild(questionNumberSpan);
    questionPromptContainer.appendChild(questionPrompt);
    questionElement.appendChild(questionPromptContainer);
    if (image) {
        var quizImage = document.createElement('img');
        quizImage.style.width = '90%';
        quizImage.style['margin-top'] = '1em';
        quizImage.src = image;
        questionElement.appendChild(quizImage);
    }
    responseList.classList.add('choices');

    for (var i = 0; i < choices.length; i++) {
        var listElement = document.createElement('li');
        listElement.textContent = choices[i];
        if (choices[i] === answer) {
            listElement.classList.add('correct');
        }
        if (linkText) {
            listElement.setAttribute('data-feedbackText', linkText[i]);
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
    // attachClickHandler(id);
}


$(document).on('click', '.feedbackLink', function(evt) {
    evt.preventDefault();
    globalReadium.reader.openContentUrl($(this).attr('href'));
});

$().ready(function() {
    $('.quiz_quizExtension').each(function() {
        var id = $(this)[0].getAttribute('data-id');
        var questionNumber = $(this)[0].getAttribute('data-questionNumber');
        var choices = JSON.parse($(this)[0].getAttribute('data-choices'));
        var prompt = $(this)[0].getAttribute('data-prompt');
        var answer = $(this)[0].getAttribute('data-answer');
        var image = $(this)[0].hasAttribute('data-image') ? $(this)[0].getAttribute('data-image') : null;
        var required = $(this)[0].hasAttribute('data-required') ? $(this)[0].getAttribute('data-required') : true;
        var attempts = $(this)[0].hasAttribute('data-attempts') ? parseInt($(this)[0].getAttribute('data-attempts')) : 2;
        var feedbackLink = $(this)[0].getAttribute('data-feedbackLink');
        var linkText = JSON.parse($(this)[0].getAttribute('data-linkText'));
        lowStakesQuiz.createLowStakesMultiChoiceQuestion(id, questionNumber, choices, prompt, answer, image, required, attempts, feedbackLink, linkText);
    });

    $('ol.quiz').each(function() {
        var quizEntry = this.id + '-quizAttempts';

        lowStakesQuiz.attachClickHandler(this.id);

        var quizAttempts = localStorage.getItem(quizEntry);

        if (quizAttempts) {
            quizAttempts = JSON.parse(quizAttempts);

            if (quizAttempts.length != 0) {
                var counter = 0;
                $('ol.quiz > li').each(function() {
                    if (quizAttempts[counter][0] == false && quizAttempts[counter][1] == false) {
                        $(this).children('.choices').addClass('reveal secondary');
                        var linkText = $(this).attr('data-feedbackText');
                        $(this).children('.feedback').text(linkText);
                        lowStakesQuiz.handleResize(function() {
                            $(this).children('.feedback').slideDown();
                        });
                    }
                    if (quizAttempts[counter][0] == true || quizAttempts[counter][1] == true) {
                        $(this).children('.choices').addClass('reveal');
                        var linkText = $(this).attr('data-feedbackText');
                        $(this).children('.feedback').text(linkText);
                        lowStakesQuiz.handleResize(function() {
                            $(this).children('.feedback').slideDown();
                        });
                    }
                    counter++;
                });
            }

        }

    });
});

lowStakesQuiz.attachClickHandler = function(quizId) {
    // tries and results
    // [0,1],[1] ...
    var quizEntry = quizId + '-quizAttempts'

    var quizAttempts = localStorage.getItem(quizEntry);

    if (quizAttempts) {
        quizAttempts = JSON.parse(quizAttempts);
    } else {
        quizAttempts = [];
        $('ol.quiz[id="' + quizId + '"] > li').each(function() {
            quizAttempts.push([]);
        });
    }

    var gradeTest = function() {
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
            var promptElems = $("i[data-id=" + id + "]");
            var prompts = [];
            promptElems.each(function(i, elem) {
                prompts.push(" ][ " + $(elem).attr("data-prompt"));
            });
            var description = $(".title").text().trim() + prompts.join("");
            var normalizedScore = ((Math.round((score / total) * 100) / 100) * 100) | 0;
            var quizFeedback = "%" + normalizedScore;
            var event;
            var success;
            if ((score / total) >= 0.8) {
                event = window.top.PeBL.events.eventPassed;
                success = true;
                if (globalPebl.extension.config && globalPebl.extension.config.lowStakesQuiz && globalPebl.extension.config.lowStakesQuiz.passMessage)
                    quizFeedback = globalPebl.extension.config.lowStakesQuiz.passMessage;
                else
                    quizFeedback += " - You passed!";
            } else {
                event = window.top.PeBL.events.eventFailed;
                success = false;
                if (globalPebl.extension.config && globalPebl.extension.config.lowStakesQuiz && globalPebl.extension.config.lowStakesQuiz.failMessage)
                    quizFeedback = globalPebl.extension.config.lowStakesQuiz.failMessage;
                else
                    quizFeedback += " - You did not pass, you should review the material and try again.";
            }
            if (window.top.PeBL != null)
                window.top.PeBL.emitEvent(event, {
                    score: score,
                    minScore: 0,
                    maxScore: total,
                    complete: true,
                    success: success,
                    name: id,
                    description: description
                });
            localStorage.removeItem(quizEntry);
            $(".quizScore").text(quizFeedback);
        }
    };

    $('ol.quiz[id="' + quizId + '"] .choices').off();
    $(document.body).on('click', 'ol.quiz[id="' + quizId + '"] .choices > li', function() {
        var answered = $(this).text();
        var prompt = $(this).parent().parent().find(".questionPromptContainer").text();
        var $answers = $(this).parents('.choices');
        var $answersText = $answers.children();
        $answersText = $answersText.map(function(i) {
            return $($answersText[i]).text();
        });
        var correctAnswer = $answers.find('.correct').text();
        var $feedback = $answers.siblings('.feedback');
        var correct = $(this).hasClass('correct'); // T or F
        var questionNum = $('ol.quiz .choices').index($answers);
        var linkText = $(this).attr('data-feedbackText');

        if (quizAttempts[questionNum].length == 0) {
            // first attempt
            $answers.children('li').removeClass('wrong');
            quizAttempts[questionNum].push(correct);
            localStorage.setItem(quizEntry, JSON.stringify(quizAttempts));
            if (correct) {
                $answers.addClass('reveal');
                $feedback.text(linkText);
            } else {
                $(this).addClass('wrong');
                //$(this).delay(1000).slideUp();
                $feedback.text(linkText);
            }

            if (window.top.PeBL != null)
                window.top.PeBL.emitEvent(window.top.PeBL.events.eventAnswered, {
                    "prompt": prompt,
                    "answers": $answersText,
                    "correctAnswers": [
                        [correctAnswer]
                    ],
                    "answered": answered,
                    "score": correct ? 1 : 0,
                    "minScore": 0,
                    "maxScore": 1,
                    "complete": true,
                    "success": correct
                });


            gradeTest();
            lowStakesQuiz.handleResize(function() {
                $feedback.slideDown();
            });
        } else if (quizAttempts[questionNum].length == 1 && quizAttempts[questionNum][0] == false) {

            // 2nd attempt
            //$answers.children('li').removeClass('wrong');
            quizAttempts[questionNum].push(correct);
            localStorage.setItem(quizEntry, JSON.stringify(quizAttempts));
            if (correct == true) {
                $answers.addClass('reveal');
                $feedback.text(linkText);
            } else {
                setTimeout(function() {
                    $answers.addClass('reveal secondary');
                }, 1500);

                $(this).addClass('wrong');
                //$(this).delay(1000).slideUp();
                $feedback.text(linkText);
            }

            if (window.top.PeBL != null)
                window.top.PeBL.emitEvent(window.top.PeBL.events.eventAnswered, {
                    "prompt": prompt,
                    "answers": $answersText,
                    "correctAnswers": [
                        [correctAnswer]
                    ],
                    "answered": answered,
                    "score": correct ? 1 : 0,
                    "minScore": 0,
                    "maxScore": 1,
                    "complete": true,
                    "success": correct
                });
            gradeTest();
            lowStakesQuiz.handleResize(function() {
                $feedback.slideDown();
            });
        } else if (quizAttempts[questionNum].length > 1) {
            // Ignore repeated attempts
        }
    });
}

lowStakesQuiz.handleResize = function(callback) {
    var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    callback();
    setTimeout(function() {
        globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
    }, 500);
}

lowStakesQuiz.wrongFeedback = function(attempt) {
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

lowStakesQuiz.correctFeedback = function(attempt) {
    var feedback = "";
    feedback = "That's correct.";
    return feedback;
}