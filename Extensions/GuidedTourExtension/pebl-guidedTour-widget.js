/*
Copyright 2020 Eduworks Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var globalPebl = window.parent.PeBL;

var guidedTour = {};

globalPebl.extension.guidedTour = guidedTour;

guidedTour.stages = {};

//TODO: Move the configuration of the stages object out of this file
guidedTour.startTour = function(element) {
    if (globalPebl.extension.config.guidedTour)
    	guidedTour.createTour(element, globalPebl.extension.config.guidedTour);
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

guidedTour.animateToElement = function(querySelector, position) {
    var element = $(querySelector);
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