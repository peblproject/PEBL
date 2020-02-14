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

var askExpert = {};

globalPebl.extension.askExpert = askExpert;

jQuery(document).ready(function() {
	jQuery('.peblExtension[data-peblextension="askExpert"]').each(function () {
        var insertID = this.getAttribute('id');
        var buttonText = this.getAttribute('data-buttonText');
        var experts = this.hasAttribute('data-experts') ? JSON.parse(this.getAttribute('data-experts')) : null;
        var mailto = this.hasAttribute('data-mailto') ? this.getAttribute('data-mailto') : 'false';
        var mailtoRecipient = this.hasAttribute('data-mailtoRecipient') ? this.getAttribute('data-mailtoRecipient') : null;
        var mailtoSubject = this.hasAttribute('data-mailtoSubject') ? this.getAttribute('data-mailtoSubject') : null;
        var mailtoBody = this.hasAttribute('data-mailtoBody') ? this.getAttribute('data-mailtoBody') : null;
        askExpert.createAskExpertButton(insertID, buttonText, experts, mailto, mailtoRecipient, mailtoSubject, mailtoBody);
    });
});

// hide modals when clicking other areas
jQuery(document).mouseup(function (e) {
    var container = jQuery('.peblModal');
    if (!container.is(e.target) // if the target of the click isn't the container...
        &&
        container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.remove();
    }
});

askExpert.createAskExpert = function(element) {
		//clearUI();
	    //Create the askExpert page
	    var askContainer = document.createElement('div');
	    askContainer.id = 'askContainer';
	    askContainer.classList.add('askContainer');

	    var closeButton = document.createElement('i');
	    closeButton.classList.add('fa', 'fa-times', 'askExpertCloseButton');
	    closeButton.addEventListener('click', function() {
	    	$('#askContainer').remove();
	    });

	    askContainer.appendChild(closeButton);

	    var wrapper = document.createElement('div');
	    wrapper.classList.add('responsive-wrapper');
	    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

	    var askFrame = document.createElement('iframe');
	    askFrame.id = 'askFrame';
	    askFrame.classList.add('askFrame');
	    askFrame.src = '' // TODO: add src;
	    wrapper.appendChild(askFrame);
	    askContainer.appendChild(wrapper);
	    element.appendChild(askContainer);
}

askExpert.createAskExpertExpertModal = function(id, experts, mailto, mailtoSubject, mailtoBody) {
	globalPebl.user.getUser(function(userProfile) {
		if (userProfile) {
			var expertsModal = document.createElement('div');
			expertsModal.classList.add('askExpertExpertsModal', 'peblModal');
			expertsModal.id = 'askExpertExpertsModal';

			var expertsModalHeader = document.createElement('div');
			expertsModalHeader.classList.add('askExpertExpertsModalHeader');

			var expertsModalHeaderText = document.createElement('span');
			expertsModalHeaderText.classList.add('askExpertExpertsModalHeaderText');
			expertsModalHeaderText.textContent = 'Ask an Expert';

			expertsModalHeader.appendChild(expertsModalHeaderText);

			var expertsModalCloseButton = document.createElement('i');
			expertsModalCloseButton.classList.add('fa', 'fa-times', 'askExpertExpertsModalCloseButton');
			expertsModalCloseButton.addEventListener('click', function() {
				jQuery('#askExpertExpertsModal').remove();
				globalPebl.emitEvent(globalPebl.events.eventUndisplayed, {
					target: id,
					type: 'expert'
				});
			});

			expertsModalHeader.appendChild(expertsModalCloseButton);

			expertsModal.appendChild(expertsModalHeader);

			var expertsModalBody = document.createElement('div');
			expertsModalBody.classList.add('askExpertExpertsModalBody');

			expertsModal.appendChild(expertsModalBody);

			var askExpertModalDescription = document.createElement('p');
			askExpertModalDescription.classList.add('askExpertExpertsModalDescription');
			askExpertModalDescription.textContent = 'Have questions about the Making Good Instructors Great material? Ask an expert here.';

			expertsModalBody.appendChild(askExpertModalDescription);

			for (var expert of experts) {
				var expertContainer = document.createElement('div');
				expertContainer.classList.add('askExpertExpertContainer');
				expertContainer.setAttribute('detailText', 'Your messages with this expert will not be visible by any other users.');
				expertContainer.id = userProfile.identity + '_' + expert.id;

				var expertName = document.createElement('span');
				expertName.classList.add('askExpertExpertName');
		        var expertContactIcon = document.createElement('i');
		        expertContactIcon.classList.add('fa', 'fa-envelope', 'askExpertIcon');
				expertName.textContent = " " + expert.name;
				expertName.prepend(expertContactIcon);

				expertContainer.appendChild(expertName);

				if (expert.description) {
					var expertDescription = document.createElement('span');
					expertDescription.classList.add('askExpertExpertDescription');
					expertDescription.textContent = expert.description;
					expertContainer.appendChild(expertDescription);
				}

				
				(function(expert) {
					expertContainer.addEventListener('click', function(evt) {
						if (mailto && mailto === 'true') {
							var mailToForm = document.createElement('form');
							mailToForm.style = 'display:none;';
							var mailtoLink = 'mailto:';
							if (expert.email) {
								mailtoLink += expert.email += '?';
							}
							if (mailtoSubject) {
								mailtoLink += ('subject=' + encodeURI(mailtoSubject));
							}
							if (mailtoBody) {
								mailtoLink += ('&body=' + encodeURI(mailtoBody));
							}
							mailToForm.action = mailtoLink;
							mailToForm.method = 'post';
							evt.currentTarget.appendChild(mailToForm);
							mailToForm.submit();
							evt.currentTarget.removeChild(mailToForm);
						} else {
							globalPebl.extension.discussion.handleChatButtonClick(this, 'Message ' + expert.name);
						}

						globalPebl.emitEvent(globalPebl.events.eventAccessed, {
							name: expert.name,
							description: expert.description,
							type: 'expert',
							target: id
						});
					});
				})(expert);
				

				expertsModalBody.appendChild(expertContainer);
			}

			document.body.appendChild(expertsModal);

			globalPebl.emitEvent(globalPebl.events.eventDisplayed, {
				target: id,
				type: 'expert'
			});
		}
	});
}

askExpert.createAskExpertButton = function(insertID, buttonText, experts, mailto, mailtoRecipient, mailtoSubject, mailtoBody) {
	var askExpertButton = document.createElement('button');
	askExpertButton.classList.add('askExpertButton');
	askExpertButton.textContent = buttonText;

	askExpertButton.addEventListener('click', function(evt) {
		if (mailto && mailto === 'true') {
			var mailToForm = document.createElement('form');
			mailToForm.style = 'display:none;';
			var mailtoLink = 'mailto:';
			if (mailtoRecipient) {
				mailtoLink += mailtoRecipient += '?';
			}
			if (mailtoSubject) {
				mailtoLink += ('subject=' + encodeURI(mailtoSubject));
			}
			if (mailtoBody) {
				mailtoLink += ('&body=' + encodeURI(mailtoBody));
			}
			mailToForm.action = mailtoLink;
			mailToForm.method = 'post';
			evt.currentTarget.appendChild(mailToForm);
			mailToForm.submit();
			evt.currentTarget.removeChild(mailToForm);
		} else if (experts) {
			askExpert.createAskExpertExpertModal(insertID, experts, mailto, mailtoSubject, mailtoBody);
		} else {
			//
		}
	});

	insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(askExpertButton, insertLocation);
    insertLocation.remove();
}