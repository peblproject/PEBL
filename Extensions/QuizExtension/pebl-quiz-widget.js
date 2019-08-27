var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var lowStakesQuiz = {};
if (globalPebl)
    globalPebl.extension.lowStakesQuiz = lowStakesQuiz;

lowStakesQuiz.createQuizAnchor = function(id) {
    var anchor = document.createElement('ol');
    anchor.id = id;
    anchor.classList.add('pebl__quiz');

    var quizScore = document.createElement('h3');
    quizScore.classList.add('quizScore');
    quizScore.textContent = "You haven't answered all of the questions yet!";

    anchor.appendChild(quizScore);

    return anchor;
}

lowStakesQuiz.createLowStakesMultiChoiceQuestion = function (insertID, id, questionNumber, choices, prompt, answer, image, required, attempts, feedbackLink, linkText) {
    var quizToAppendTo = document.getElementById(id);
    var questionElement = document.createElement('li');
    var questionPromptContainer = document.createElement('div');
    questionPromptContainer.classList.add('questionPromptContainer');
    var questionNumberSpan = document.createElement('span');
    questionNumberSpan.classList.add('questionNumberSpan');
    var questionPrompt = document.createElement('span');
    var responseList = document.createElement('ul');
    var feedbackElement = document.createElement('div');

    if (!quizToAppendTo) {        
        quizToAppendTo = lowStakesQuiz.createQuizAnchor(id);        
        var insertLocation = document.getElementById(insertID);        
        insertLocation.parentNode.insertBefore(quizToAppendTo, insertLocation);        
        insertLocation.remove();        
    }        
    var insertPoint = quizToAppendTo.lastElementChild;

    questionNumberSpan.textContent = questionNumber + ".";
    questionPrompt.innerHTML = prompt;
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
    responseList.classList.add('pebl__quiz--choices');

    for (var i = 0; i < choices.length; i++) {
        var listElement = document.createElement('li');
        listElement.innerHTML = choices[i];
        if (choices[i] === answer) {
            listElement.classList.add('pebl__quiz--correct');
        }
        if (linkText) {
            listElement.setAttribute('data-feedbackText', linkText[i]);
        }
        responseList.appendChild(listElement);
    }
    questionElement.appendChild(responseList);
    feedbackElement.classList.add('pebl__quiz--feedback');
    feedbackElement.style.display = 'none';
    feedbackElement.textContent = 'Feedback';
    feedbackElement.setAttribute('feedbackLink', feedbackLink);
    feedbackElement.setAttribute('linkText', linkText);
    questionElement.appendChild(feedbackElement);
    quizToAppendTo.insertBefore(questionElement, insertPoint);
    // attachClickHandler(id);
}


jQuery(document).on('click', '.feedbackLink', function (evt) {
    evt.preventDefault();
    globalReadium.reader.openContentUrl(jQuery(this).attr('href'));
});

jQuery().ready(function () {
    jQuery('.quiz_quizExtension, .peblExtension[data-peblextension="quiz"]').each(function() {
        var insertID = jQuery(this)[0].getAttribute('id');    
        var id = jQuery(this)[0].getAttribute('data-id');
        var questionNumber = jQuery(this)[0].getAttribute('data-questionNumber') || jQuery(this)[0].getAttribute('data-questionnumber');
        var choices = JSON.parse(jQuery(this)[0].getAttribute('data-choices'));
        var prompt = jQuery(this)[0].getAttribute('data-prompt');
        var answer = jQuery(this)[0].getAttribute('data-answer');
        var image = jQuery(this)[0].hasAttribute('data-image') ? jQuery(this)[0].getAttribute('data-image') : null;
        var required = jQuery(this)[0].hasAttribute('data-required') ? jQuery(this)[0].getAttribute('data-required') : true;
        var attempts = jQuery(this)[0].hasAttribute('data-attempts') ? parseInt(jQuery(this)[0].getAttribute('data-attempts')) : 2;
        var feedbackLink = jQuery(this)[0].hasAttribute('data-feedbackLink') ? jQuery(this)[0].getAttribute('data-feedbackLink') : '';
        var linkText = JSON.parse(jQuery(this)[0].getAttribute('data-linkText'));
        lowStakesQuiz.createLowStakesMultiChoiceQuestion(insertID, id, questionNumber, choices, prompt, answer, image, required, attempts, feedbackLink, linkText);
    });

    jQuery('ol.pebl__quiz').each(function () {
        var quizEntry = this.id + '-quizAttempts';

        lowStakesQuiz.attachClickHandler(this.id);

        var quizAttempts = localStorage.getItem(quizEntry);

        if (quizAttempts) {
            quizAttempts = JSON.parse(quizAttempts);

            if (quizAttempts.length != 0) {
                var counter = 0;
                jQuery('ol.pebl__quiz > li').each(function () {
                    if (quizAttempts[counter][0] == false && quizAttempts[counter][1] == false) {
                        jQuery(this).children('.pebl__quiz--choices').addClass('reveal', 'secondary');
                        var linkText = jQuery(this).attr('data-feedbackText');
                        jQuery(this).children('.pebl__quiz--feedback').text(linkText);
                        lowStakesQuiz.handleResize(function () {
                            jQuery(this).children('.pebl__quiz--feedback').slideDown();
                        });
                    }
                    if (quizAttempts[counter][0] == true || quizAttempts[counter][1] == true) {
                        jQuery(this).children('.pebl__quiz--choices').addClass('reveal');
                        var linkText = jQuery(this).attr('data-feedbackText');
                        jQuery(this).children('.pebl__quiz--feedback').text(linkText);
                        lowStakesQuiz.handleResize(function () {
                            jQuery(this).children('.pebl__quiz--feedback').slideDown();
                        });
                    }
                    counter++;
                });
            }

        }

    });
});

lowStakesQuiz.attachClickHandler = function (quizId) {
    // tries and results
    // [0,1],[1] ...
    var quizEntry = quizId + '-quizAttempts'

    var quizAttempts = localStorage.getItem(quizEntry);

    if (quizAttempts) {
        quizAttempts = JSON.parse(quizAttempts);
    } else {
        quizAttempts = [];
        jQuery('ol.pebl__quiz[id="' + quizId + '"] > li').each(function () {
            quizAttempts.push([]);
        });
    }

    var gradeTest = function () {
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
            var id = jQuery("ol.pebl__quiz")[0].id;
            var promptElems = jQuery("i[data-id=" + id + "]");
            var prompts = [];
            promptElems.each(function (i, elem) {
                prompts.push(" ][ " + jQuery(elem).attr("data-prompt"));
            });
            var description = jQuery(".title").text().trim() + prompts.join("");
            var normalizedScore = ((Math.round((score / total) * 100) / 100) * 100) | 0;
            var quizFeedback = normalizedScore + "%";
            var event;
            var success;
            if ((score / total) >= 0.8) {
                event = globalPebl.events.eventPassed;
                success = true;
                if (globalPebl.extension.config && globalPebl.extension.config.lowStakesQuiz && globalPebl.extension.config.lowStakesQuiz.passMessage)
                    quizFeedback = globalPebl.extension.config.lowStakesQuiz.passMessage;
                else
                    quizFeedback += " - You passed!";
            } else {
                event = globalPebl.events.eventFailed;
                success = false;
                if (globalPebl.extension.config && globalPebl.extension.config.lowStakesQuiz && globalPebl.extension.config.lowStakesQuiz.failMessage)
                    quizFeedback = globalPebl.extension.config.lowStakesQuiz.failMessage;
                else
                    quizFeedback += " - You did not pass, you should review the material and try again.";
            }
            if (globalPebl != null)
                globalPebl.emitEvent(event, {
                    score: score,
                    minScore: 0,
                    maxScore: total,
                    complete: true,
                    success: success,
                    name: id,
                    description: description
                });
            localStorage.removeItem(quizEntry);
            jQuery(".quizScore").text(quizFeedback);
        }
    };

    jQuery('ol.pebl__quiz[id="' + quizId + '"] .pebl__quiz--choices').off();
    jQuery(document.body).on('click', 'ol.pebl__quiz[id="' + quizId + '"] .pebl__quiz--choices > li', function () {
        var answered = jQuery(this).text();
        var prompt = jQuery(this).parent().parent().find(".questionPromptContainer").text();
        var jQueryanswers = jQuery(this).parents('.pebl__quiz--choices');
        var jQueryanswersText = jQueryanswers.children();
        jQueryanswersText = jQueryanswersText.map(function (i) {
            return jQuery(jQueryanswersText[i]).text();
        });
        var correctAnswer = jQueryanswers.find('.pebl__quiz--correct').text();
        var jQueryfeedback = jQueryanswers.siblings('.pebl__quiz--feedback');
        var correct = jQuery(this).hasClass('pebl__quiz--correct'); // T or F
        var questionNum = jQuery('ol.pebl__quiz .pebl__quiz--choices').index(jQueryanswers);
        var linkText = jQuery(this).attr('data-feedbackText');

        if (quizAttempts[questionNum].length == 0) {
            // first attempt
            jQueryanswers.children('li').removeClass('pebl__ quiz--wrong');
            quizAttempts[questionNum].push(correct);
            localStorage.setItem(quizEntry, JSON.stringify(quizAttempts));
            if (correct) {
                jQueryanswers.addClass('reveal');
                jQueryfeedback.text(linkText);
            } else {
                jQuery(this).addClass('pebl__quiz--wrong');
                //jQuery(this).delay(1000).slideUp();
                jQueryfeedback.text(linkText);
            }

            if (globalPebl != null)
                globalPebl.emitEvent(globalPebl.events.eventAnswered, {
                    "prompt": prompt,
                    "answers": jQueryanswersText,
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
            lowStakesQuiz.handleResize(function () {
                jQueryfeedback.slideDown();
            });
        } else if (quizAttempts[questionNum].length == 1 && quizAttempts[questionNum][0] == false) {

            // 2nd attempt
            //jQueryanswers.children('li').removeClass('wrong');
            quizAttempts[questionNum].push(correct);
            localStorage.setItem(quizEntry, JSON.stringify(quizAttempts));
            if (correct == true) {
                jQueryanswers.addClass('reveal');
                jQueryfeedback.text(linkText);
            } else {
                setTimeout(function () {
                    jQueryanswers.addClass('reveal secondary');
                }, 1500);

                jQuery(this).addClass('pebl__quiz--wrong');
                //jQuery(this).delay(1000).slideUp();
                jQueryfeedback.text(linkText);
            }

            if (globalPebl != null)
                globalPebl.emitEvent(globalPebl.events.eventAnswered, {
                    "prompt": prompt,
                    "answers": jQueryanswersText,
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
            lowStakesQuiz.handleResize(function () {
                jQueryfeedback.slideDown();
            });
        } else if (quizAttempts[questionNum].length > 1) {
            // Ignore repeated attempts
        }
    });
}

lowStakesQuiz.handleResize = function (callback) {
    //var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    callback();
    // setTimeout(function() {
    //     globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
    // }, 500);
}

lowStakesQuiz.wrongFeedback = function (attempt) {
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

lowStakesQuiz.correctFeedback = function (attempt) {
    var feedback = "";
    feedback = "That's correct.";
    return feedback;
}