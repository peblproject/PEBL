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

var knowledgeNetwork = {};

globalPebl.extension.knowledgeNetwork = knowledgeNetwork;

knowledgeNetwork.frameIsReady = false;
knowledgeNetwork.searchTerms = [];

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

knowledgeNetwork.createAddResourceModal = function(element) {
    let existingModal = document.getElementById('knowledgeNetworkAddResourceModal');
    if (existingModal) {
        jQuery(existingModal).remove();
    }

    var addResourceModal = document.createElement('div');
    addResourceModal.classList.add('knowledgeNetworkAddResourceModal', 'peblModal');
    addResourceModal.id = 'knowledgeNetworkAddResourceModal';

    var addResourceModalHeader = document.createElement('div');
    addResourceModalHeader.classList.add('knowledgeNetworkAddResourceModalHeader');

    var addResourceModalHeaderText = document.createElement('span');
    addResourceModalHeaderText.classList.add('knowledgeNetworkAddResourceModalHeaderText');
    addResourceModalHeaderText.textContent = 'Add Resource';

    addResourceModalHeader.appendChild(addResourceModalHeaderText);

    var addResourceModalCloseButton = document.createElement('i');
    addResourceModalCloseButton.classList.add('fa', 'fa-times', 'knowledgeNetworkAddResourceModalCloseButton');
    addResourceModalCloseButton.addEventListener('click', function() {
        jQuery('#knowledgeNetworkAddResourceModal').remove();
    });

    addResourceModalHeader.appendChild(addResourceModalCloseButton);

    addResourceModal.appendChild(addResourceModalHeader);

    var addResourceModalBody = document.createElement('div');
    addResourceModalBody.classList.add('knowledgeNetworkAddResourceModalBody');

    var addResourceDescription = document.createElement('p');
    addResourceDescription.classList.add('knowledgeNetworkAddResourceModalDescription');
    addResourceDescription.textContent = 'Enter a title and URL below to add a resource to your Additional Resources. Your resource will be added to the list based on your current place in the book.';

    var addResourceTitle = document.createElement('div');
    addResourceTitle.classList.add('AddResources_inputContainer');

    var addResourceTitleInputLabel = document.createElement('label');
    addResourceTitleInputLabel.for = 'knowledgeNetworkAddResourceTitle';
    addResourceTitleInputLabel.textContent = 'Resource Title: ';

    var addResourceTitleInput = document.createElement('input');
    addResourceTitleInput.id = 'knowledgeNetworkAddResourceTitle';

    addResourceTitle.appendChild(addResourceTitleInputLabel);
    addResourceTitle.appendChild(addResourceTitleInput);

    var addResourceUrl = document.createElement('div');
    addResourceUrl.classList.add('AddResources_inputContainer');

    var addResourceUrlInputLabel = document.createElement('label');
    addResourceUrlInputLabel.for = 'knowledgeNetworkAddResourceUrl';
    addResourceUrlInputLabel.textContent = 'Resource URL: ';

    var addResourceUrlInput = document.createElement('input');
    addResourceUrlInput.id = 'knowledgeNetworkAddResourceUrl'

    addResourceUrl.appendChild(addResourceUrlInputLabel);
    addResourceUrl.appendChild(addResourceUrlInput);

    var addResourceSuccess = document.createElement('div');
    addResourceSuccess.classList.add('knowledgeNetworkAddResourceModalSuccess');

    var addResourceSuccessText = document.createElement('p');
    addResourceSuccessText.textContent = 'Your resource will be added to your Additional Resources shortly.';

    var addResourceAgainButton = document.createElement('button');
    addResourceAgainButton.textContent = 'Add Another Resource';
    addResourceAgainButton.addEventListener('click', function () {
        addResourceUrlInput.value = '';
        addResourceTitleInput.value = '';
        jQuery(addResourceSuccess).hide();
        jQuery(addResourceModalBody).show();
    });

    addResourceSuccess.appendChild(addResourceSuccessText);
    addResourceSuccess.appendChild(addResourceAgainButton);

    var addResourceSubmitButton = document.createElement('button');
    addResourceSubmitButton.textContent = 'Add Resource';
    addResourceSubmitButton.addEventListener('click', function() {
        globalPebl.user.getUser(function (userProfile) {
            var url = addResourceUrlInput.value;
            var title = addResourceTitleInput.value;

            if (url.trim().length > 0 && title.trim().length > 0 && userProfile) {
                if (url.substring(0, 8).toLowerCase() !== 'https://') {
                    window.alert('URL must begin with https://');
                } else {
                    knowledgeNetwork.pullResource(userProfile.identity, url, 'html', title, url);
                    jQuery(addResourceSuccess).show();
                    jQuery(addResourceModalBody).hide();
                }
            } else {
                window.alert('Please fill out both fields.');
            }
        });
    });

    addResourceModalBody.appendChild(addResourceDescription);
    addResourceModalBody.appendChild(addResourceTitle);
    addResourceModalBody.appendChild(addResourceUrl);
    addResourceModalBody.appendChild(addResourceSubmitButton);

    addResourceModal.appendChild(addResourceModalBody);
    addResourceModal.appendChild(addResourceSuccess);

    element.appendChild(addResourceModal);
}

knowledgeNetwork.receiveMessage = function(event) {
    var data = event.data;
    var obj;
    try {
        obj = JSON.parse(data);
    } catch(e) {

    }

    if (data === 'ready') {
        knowledgeNetwork.frameIsReady = true;
    } else if (obj && obj.message === "pullResource") {
        knowledgeNetwork.pullResource(obj.target, obj.url, obj.docType, obj.name, obj.externalURL);
    } else if (obj && obj.message === "iframeUpdate") {
        $('.registryFrame').css('height', obj.height);
    } else if (data === 'registryBackToTop') {
        $('#registryContainer > div')[0].scroll(0,0);
    }
}

knowledgeNetwork.pullResource = function(target, url, docType, name, externalURL)  {
    knowledgeNetwork.getCurrentPrefix(function(currentPrefix, currentSection) {
        globalPebl.storage.getCurrentBook(function(book) {
            var data = {
                target: target,
                location: currentSection,
                card: currentPrefix,
                book: book,
                externalURL: externalURL,
                docType: docType,
                name: name,
                url: url
            }
            globalPebl.emitEvent(globalPebl.events.newReference, data);
        });
    });
}

knowledgeNetwork.getCurrentPrefix = function(callback) {
    var page = $('body')[0].baseURI.split('/').pop();
    globalPebl.utils.getToc(function(obj) {
        Object.keys(obj).forEach(function(section) {
            Object.keys(obj[section]).forEach(function(subsection) {
                if (obj[section][subsection].location && !obj[section][subsection].fake && obj[section][subsection].location == page) {
                    currentPrefix = obj[section][subsection].prefix;
                    currentSection = "Section" + obj[section].Section.prefix;
                    callback(currentPrefix, currentSection);
                    return;
                } else if (obj[section][subsection].pages) {
                    Object.keys(obj[section][subsection].pages).forEach(function(key) {
                        if (obj[section][subsection].pages[key].location && obj[section][subsection].pages[key].location == page) {
                            currentPrefix = obj[section][subsection].pages[key].prefix;
                            currentSection = "Section" + obj[section].Section.prefix;
                            callback(currentPrefix, currentSection);
                            return;
                        }
                   });
                }
            });
        });
    });
}

knowledgeNetwork.searchType = function(type) {
    var waitingForReady = setInterval(function() {
        if (knowledgeNetwork.frameIsReady) {
            clearInterval(waitingForReady);
            var iframe = document.getElementById('registryFrame');
            var obj = {
                "messageType": "Find",
                "findType": [type],
                "searchTerms": searchTerms
            }
            var message = JSON.stringify(obj);
            iframe.contentWindow.postMessage(message, '*');
        }
    }, 500);
}

knowledgeNetwork.createRegistrySearch = function(element) {
    knowledgeNetwork.frameIsReady = false;
    var currentPage = window.location.pathname.split('/').pop().slice(0, -6).substring(5);
    //clearUI();
    //Create the registrySearch page
    var registryContainer = document.createElement('div');
    registryContainer.id = 'registryContainer';
    registryContainer.classList.add('registryContainer');
    registryContainer.setAttribute('style', 'overflow: auto;');

       var closeButton = document.createElement('i');
    closeButton.classList.add('fa', 'fa-times', 'registryCloseButton');
    closeButton.addEventListener('click', function() {
        $('#registryContainer').remove();
    });

    var wrapper = document.createElement('div');
    wrapper.classList.add('responsive-wrapper');
    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

    var registryFrame = document.createElement('iframe');
    registryFrame.id = 'registryFrame';
    registryFrame.classList.add('registryFrame');
    registryFrame.src = 'https://peblproject.com/registry/#welcome';
    registryFrame.name = 'registryFrame';
    registryFrame.setAttribute('scrolling', 'no');
    wrapper.appendChild(registryFrame);

    registryContainer.appendChild(closeButton);
    registryContainer.appendChild(wrapper);
    element.appendChild(registryContainer);

    //Post Messages
    var waitingForReady = setInterval(function() {
        if (knowledgeNetwork.frameIsReady) {
            globalPebl.user.getUser(function(user) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var currentUser = user.identity;
                var obj = {
                    "messageType": "Login",
                    "user": currentUser,
                    "currentPage": currentPage
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
                //Script on registry page would login as that user
            });
        }
    }, 500);

    window.addEventListener("message", knowledgeNetwork.receiveMessage, false);
}