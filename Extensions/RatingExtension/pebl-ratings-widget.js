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

var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);
var globalReadium = window.parent.READIUM;

var ratings = {};

globalPebl.extension.ratings = ratings;

$(document).ready(function () {
    $('.ratingsExtension, .peblExtension[data-peblextension="ratings"]').each(function () {
        var idref = this.getAttribute('data-idref');
        var insertID = this.getAttribute('id');
        var ratingText = this.hasAttribute('data-ratingText') ? this.getAttribute('data-ratingText') : null;
        var negativeRatingPrompt = this.hasAttribute('data-negativeRatingPrompt') ? this.getAttribute('data-negativeRatingPrompt') : null;
        ratings.createRating(insertID, idref, ratingText, negativeRatingPrompt);
    });
});

ratings.createRating = function (insertID, idref, ratingText, negativeRatingPrompt) {
    var programID = null;
    if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID)
        programID = window.parent.extensionDashboard.programID;

    var ratingWrapper = document.createElement('div');
    ratingWrapper.classList.add('ratingWrapper');

    var ratingTitle = document.createElement('h2');
    ratingTitle.textContent = 'Feedback';

    ratingWrapper.appendChild(ratingTitle);

    var ratingDescription = document.createElement('p');
    var ratingDescriptionText;
    if (ratingText) {
        ratingDescriptionText = document.createTextNode(ratingText);
    } else {
        ratingDescriptionText = document.createTextNode('Please rate this section:');
    }
     
    ratingDescription.appendChild(ratingDescriptionText);

    var ratingContainer = document.createElement('div');
    ratingContainer.classList.add('ratingContainer');

    var ratingUpLabel = document.createElement('label');
    ratingUpLabel.setAttribute('for', 'ratingGroup1_up');
    ratingUpLabel.textContent = 'Thumbs Up';

    var ratingDownLabel = document.createElement('label');
    ratingDownLabel.setAttribute('for', 'ratingGroup1_down');
    ratingDownLabel.textContent = 'Thumbs Down';

    var ratingUp = document.createElement('input');
    ratingUp.type = 'radio';
    ratingUp.id = 'ratingGroup1_up';
    ratingUp.classList.add('ratingButton', 'rateUp');
    ratingUp.name = 'ratingGroup1';

    var ratingDown = document.createElement('input');
    ratingDown.type = 'radio';
    ratingDown.id = 'ratingGroup1_down';
    ratingDown.classList.add('ratingButton', 'rateDown');
    ratingDown.name = 'ratingGroup1';

    ratingContainer.appendChild(ratingUpLabel);
    ratingContainer.appendChild(ratingUp);
    ratingContainer.appendChild(ratingDownLabel);
    ratingContainer.appendChild(ratingDown);

    ratingDescription.appendChild(ratingContainer);

    var ratingNegativeFeedbackWrapper = document.createElement('div');
    ratingNegativeFeedbackWrapper.classList.add('ratingNegativeFeedbackWrapper');

    var ratingNegativeFeedbackCallout = document.createElement('div');
    ratingNegativeFeedbackCallout.classList.add('ratingNegativeFeedbackCallout', 'hideFeedbackCallout');

    ratingUp.addEventListener('click', function () {
        console.log('rate up');
        ratingNegativeFeedbackCallout.classList.remove('showFeedbackCallout');
        ratingNegativeFeedbackCallout.classList.add('hideFeedbackCallout');

        globalPebl.emitEvent(globalPebl.events.eventLiked, {
            name: idref,
            target: idref
        });

        // globalPebl.utils.getSpecificGroupMembership(programID, function (group) {
        //     globalPebl.emitEvent(globalPebl.events.eventModuleRating, {
        //         idref: idref,
        //         rating: 'positive',
        //         programId: group ? group.membershipId : undefined
        //     });
        // });
    });

    ratingDown.addEventListener('click', function () {
        console.log('rate down');
        ratingNegativeFeedbackCallout.classList.remove('hideFeedbackCallout');
        ratingNegativeFeedbackCallout.classList.add('showFeedbackCallout');

        globalPebl.emitEvent(globalPebl.events.eventDisliked, {
            name: idref,
            target: idref
        });

        // globalPebl.utils.getSpecificGroupMembership(programID, function (group) {
        //     globalPebl.emitEvent(globalPebl.events.eventModuleRating, {
        //         idref: idref,
        //         rating: 'negative',
        //         programId: group ? group.membershipId : undefined
        //     });
        // });
    });

    var form = document.createElement('form');

    var textBox = document.createElement('div');
    textBox.classList.add('textBox');

    var textInput = document.createElement('div');
    textInput.classList.add('textInput');

    var textDetailText = document.createElement('label');
    
    if (negativeRatingPrompt) {
        textDetailText.textContent = negativeRatingPrompt;
    } else {
        textDetailText.textContent = 'What feedback would you like to share about this section?';
    }
    
    textDetailText.id = 'textDetailText';

    var textarea = document.createElement('textarea');
    textarea.classList.add('edit');
    textarea.placeholder = "This section was very helpful...";

    textInput.appendChild(textDetailText);
    textInput.appendChild(textarea);

    textBox.appendChild(textInput);

    var checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkBox');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    var checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = "I'm willing to discuss this further.";

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);

    form.appendChild(textBox);
    form.appendChild(checkboxContainer);

    var thanksFeedback = document.createElement('p');
    thanksFeedback.classList.add('hideFeedbackCallout', 'thanksFeedback');
    thanksFeedback.textContent = 'Thanks for your feedback.';

    var footer = document.createElement('div');
    footer.classList.add('ratingNegativeFeedbackFooter');

    var moreFeedbackButton = document.createElement('button');
    moreFeedbackButton.textContent = 'Submit more feedback';
    moreFeedbackButton.classList.add('hideFeedbackCallout');
    moreFeedbackButton.addEventListener('click', function () {
        moreFeedbackButton.classList.add('hideFeedbackCallout');
        thanksFeedback.classList.add('hideFeedbackCallout');

        form.classList.remove('hideFeedbackCallout');
        footerButton.classList.remove('hideFeedbackCallout');
    });

    var footerButton = document.createElement('button');
    footerButton.textContent = 'Submit';
    footerButton.addEventListener('click', function () {
        if ($(textarea).val().trim().length > 0) {
            var feedback = $(textarea).val();
            var willingToDiscuss = 'No';
            if (checkbox.checked)
                willingToDiscuss = 'Yes';

            globalPebl.utils.getSpecificGroupMembership(programID, function (group) {
                globalPebl.emitEvent(globalPebl.events.eventModuleFeedback, {
                    idref: idref,
                    feedback: feedback,
                    willingToDiscuss: willingToDiscuss,
                    programId: group ? group.membershipId : undefined
                });
            });

            form.classList.add('hideFeedbackCallout');
            footerButton.classList.add('hideFeedbackCallout');

            thanksFeedback.classList.remove('hideFeedbackCallout');
            moreFeedbackButton.classList.remove('hideFeedbackCallout');
        } else {
            window.alert('Please enter some feedback first.');
            return;
        }
    });

    footer.appendChild(footerButton);
    footer.appendChild(moreFeedbackButton);

    ratingNegativeFeedbackCallout.appendChild(form);
    ratingNegativeFeedbackCallout.appendChild(thanksFeedback);
    ratingNegativeFeedbackCallout.appendChild(footer);

    var cfiPlaceholderStart = document.createElement('p');
    cfiPlaceholderStart.classList.add('ratingsCfiPlaceholder');
    cfiPlaceholderStart.textContent = 'CFI';

    var cfiPlaceholderEnd = document.createElement('p');
    cfiPlaceholderEnd.classList.add('ratingsCfiPlaceholder');
    cfiPlaceholderEnd.textContent = 'CFI';

    ratingNegativeFeedbackWrapper.appendChild(cfiPlaceholderStart);
    ratingNegativeFeedbackWrapper.appendChild(ratingNegativeFeedbackCallout);
    ratingNegativeFeedbackWrapper.appendChild(cfiPlaceholderEnd);

    ratingDescription.appendChild(ratingNegativeFeedbackWrapper);

    ratingWrapper.appendChild(ratingDescription);

    var insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(ratingWrapper, insertLocation);
    insertLocation.remove();
}