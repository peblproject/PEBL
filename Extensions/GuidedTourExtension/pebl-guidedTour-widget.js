var globalPebl = window.top.PeBL;

var guidedTour = {};

globalPebl.extension.guidedTour = guidedTour;

guidedTour.stages = {};

//TODO: Move the configuration of the stages object out of this file
guidedTour.startTour = function(element) {
	guidedTour.createTour(element, {
            1: {
            	targetElement: $('#main-menu__collapsed').children('a').first(),
                message: "Test message 1",
                position: "bottom-left",
                beforeNext: function() {
                	showMainMenu();
                }
            },
            2: {
            	targetElement: $('#140B51A9-4C11-4620-B691-1B3E757C2528'),
                message: "Test message 2",
                position: "bottom-left",
                beforeNext: function() {
                	showMainMenu();
                }
            },
            3: {
            	targetElement: $('#AC3682C5-89D4-4867-AC13-1DC2FE7C6218'),
            	message: "Test message 3",
            	position: "bottom-right",
            	beforeNext: function() {
                	showMainMenu();
                }
            },
            4: {
            	targetElement: $('#startTourButton'),
            	message: "Test message 4",
            	position: "left",
            	beforeNext: function() {
                	showMainMenu();
                }
            },
            5: {
            	targetElement: $('#knowledgeNetworkButton'),
            	message: "Test message 5",
            	position: "bottom-left",
            	beforeNext: function() {
                	showMainMenu();
                }
            },
            6: {
            	targetElement: $('#askAnExpertButton'),
            	message: "Test message 6",
            	position: "bottom-right",
            	beforeNext: function() {
                	showMainMenu();
                }
            },
            7: {
            	targetElement: $('#tableOfContentsButton'),
            	message: "Test message 7",
            	position: "bottom-left",
            	beforeNext: function() {
                	showMainMenu();
                }
            },
            8: {
            	targetElement: $('#rateThisLearnletButton'),
            	message: "Test message 8",
            	position: "bottom-right",
            	end: true,
            	afterNext: function() {
            		hideMainMenu();
            	}
            }
        });
}

guidedTour.createTour = function(element, stages) {

	guidedTour.stages = stages;
	    //Create tutorial elements
    var tutorialMessageContainer = document.createElement('div');
    tutorialMessageContainer.id = 'tutorialMessageContainer';
    tutorialMessageContainer.classList.add('tutorialMessageContainer');
    tutorialMessageContainer.setAttribute('Stage', 1);

    var tutorialMessage = document.createElement('p');
    tutorialMessage.id = 'tutorialMessage';
    tutorialMessage.classList.add('tutorialMessage');
    tutorialMessage.textContent = stages[1].message;
    tutorialMessageContainer.appendChild(tutorialMessage);

    var tutorialMessageCancelButon = document.createElement('label');
    tutorialMessageCancelButon.id = 'tutorialMessageCancelButton';
    tutorialMessageCancelButon.classList.add('tutorialMessageCancelButton');
    tutorialMessageCancelButon.textContent = 'Cancel';
    tutorialMessageCancelButon.addEventListener('click', function() {
        guidedTour.endTour();
    });
    tutorialMessageContainer.appendChild(tutorialMessageCancelButon);

    var tutorialMessageNextButton = document.createElement('label');
    tutorialMessageNextButton.id = 'tutorialMessageNextButton';
    tutorialMessageNextButton.classList.add('tutorialMessageNextButton');
    tutorialMessageNextButton.textContent = 'Next';
    tutorialMessageNextButton.addEventListener('click', function() {
    	guidedTour.nextTutorialStage();
    });
    tutorialMessageContainer.appendChild(tutorialMessageNextButton);
    

    var tutorialMessageArrow = document.createElement('div');
    tutorialMessageArrow.id = 'tutorialMessageArrow';
    tutorialMessageArrow.classList.add('tutorialMessageArrow');

    tutorialMessageContainer.appendChild(tutorialMessageArrow);
    element.appendChild(tutorialMessageContainer);
    guidedTour.animateToElement(guidedTour.stages[1].targetElement, guidedTour.stages[1].position);

}

guidedTour.endTour = function() {
	console.log('end tour');
	$('#tutorialMessageContainer').remove();
}

guidedTour.animateToElement = function(element, position) {
	var targetLeft = element.offset().left;
	var targetTop = element.offset().top;

	var targetHeight = element.height();
	var targetWidth = element.width();

	var newLeft = targetLeft;
	var newTop = targetTop;

	if (position === "bottom-right") {
		newLeft -= 200;
		newLeft += (targetWidth / 2);
		newTop += targetHeight + 10;

		$('#tutorialMessageArrow').css({
			marginLeft: "200px",
			top: "0",
		    left: "0",
		    right: "unset",
		    "margin-top": "-10px",
		    width: 0,
		    height: 0,
		    "border-bottom": "10px solid rgb(7, 126, 188)",
		    "border-right": "10px solid transparent",
		    "border-left": "10px solid transparent",
		    "border-top": "unset"
		});
	} else if (position === "bottom-left") {
		newTop += targetHeight + 10;
		newLeft += (targetWidth / 2);
		newLeft -= 30;
		$('#tutorialMessageArrow').css({
			marginLeft: "30px",
			top: "0",
		    left: "0",
		    right: "unset",
		    "margin-top": "-10px",
		    width: 0,
		    height: 0,
		    "border-bottom": "10px solid rgb(7, 126, 188)",
		    "border-right": "10px solid transparent",
		    "border-left": "10px solid transparent",
		    "border-top": "unset"
		});
	} else if (position === "left") {
		$('#tutorialMessageArrow').css({
			marginLeft: "0",
			"margin-top": "unset",
			"border-bottom": "10px solid transparent",
		    "border-left": "10px solid rgb(7, 126, 188)",
		    "border-top": "10px solid transparent",
		    "border-right": "unset",
		    "right": "-10px",
		    "top": "10px",
		    "left": "unset"
		});

		newLeft -= 260;
	}

	$('#tutorialMessageContainer').animate({
		top: newTop + 'px',
		left: newLeft + 'px'
	});
}

guidedTour.nextTutorialStage = function() {
	var currentStage = $('#tutorialMessageContainer').attr('Stage');
	var nextStage = parseInt(currentStage) + 1;
	if (guidedTour.stages[currentStage].end) {
		guidedTour.endTour();
		return;
	}
	if (guidedTour.stages[currentStage].beforeNext)
		guidedTour.stages[currentStage].beforeNext();

	if (guidedTour.stages[nextStage].end) {
		$('#tutorialMessageNextButton').text('Finish');
	}

	$('#tutorialMessage').text(guidedTour.stages[nextStage].message);
	$('#tutorialMessageContainer').attr('Stage', nextStage);
	guidedTour.animateToElement(guidedTour.stages[nextStage].targetElement, guidedTour.stages[nextStage].position);

	if (guidedTour.stages[currentStage].afterNext)
		guidedTour.stages[currentStage].afterNext();
}