var overlayIsExtended = false;
var tutorialIsActive = false;
var overlayIsDisplayed = false;
var handling = false;
var frameIsReady = false;
var globalPebl;
var globalReadium;

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    var data = event.data;

    if (data === 'ready') {
        frameIsReady = true;
    }
}

$(document).ready(function() {
    var setGlobalPebl = setInterval(function() {
        if (window.top && window.top.pebl) {
            globalPebl = window.top.pebl;
            clearInterval(setGlobalPebl);
        }
        else if (window.pebl) {
            globalPebl = window.pebl
            clearInterval(setGlobalPebl);
        }
    }, 10);

    var setGlobalReadium = setInterval(function() {
        if (window.top && window.top.ReadiumSDK) {
            globalReadium = window.top.ReadiumSDK;
            clearInterval(setGlobalReadium);
        }
        else if (window.ReadiumSDK) {
            globalReadium = window.ReadiumSDK;
            clearInterval(setGlobalReadium);
        }
    }, 10);

    createOverlay();
    createFooter();
    attachAddedResources();
    handleOrientationChange();

    try {
        getAddedResources();
    }catch{}
    try {
        getNotificationsCount();
    }catch{}
    displayUITutorial();

    var checkAccount = setInterval(setAccountName, 1000);
    //var fixIframes = setInterval(fixIframeScrolling, 500);
    var updateAddedResourceCount = setInterval(getAddedResources, 5000);
    var updateNotificationsCount = setInterval(getNotificationsCount, 5000);
    var searchTerms = $('#fake-page').attr('keywords').split(',');

    openDocumentAtDestination();

    $(document.body).on('click', "#discussButton", function() {
        handleDiscussButtonClick();
    });
    
    $(document.body).on('click', "#notesButton", function() {
        handleNotesButtonClick();
    });

    //FindMenu click handlers
    $(document.body).on('click', '#findMenuContent', function() {
        $('#findMenuContainer').addClass('hidden');
        handleExpandButtonClick();
        handleRegistryButtonClick();

        var waitingForReady = setInterval(function() {
            if (frameIsReady) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var obj = {
                    "messageType": "Find",
                    "findType": ["Content"],
                    "searchTerms": searchTerms
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
            }
        }, 500);
    });

    $(document.body).on('click', '#findMenuPeople', function() {
        $('#findMenuContainer').addClass('hidden');
        handleExpandButtonClick();
        handleRegistryButtonClick();

        var waitingForReady = setInterval(function() {
            if (frameIsReady) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var obj = {
                    "messageType": "Find",
                    "findType": ["People"],
                    "searchTerms": searchTerms
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
            }
        }, 500);
    });

    $(document.body).on('click', '#findMenuResources', function() {
        $('#findMenuContainer').addClass('hidden');
        handleExpandButtonClick();
        handleRegistryButtonClick();

        var waitingForReady = setInterval(function() {
            if (frameIsReady) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var obj = {
                    "messageType": "Find",
                    "findType": ["Resources"],
                    "searchTerms": searchTerms
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
            }
        }, 500);
    });

    $(document.body).on('click', '#findMenuInstitutions', function() {
        $('#findMenuContainer').addClass('hidden');
        handleExpandButtonClick();
        handleRegistryButtonClick();

        var waitingForReady = setInterval(function() {
            if (frameIsReady) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var obj = {
                    "messageType": "Find",
                    "findType": ["Institutions"],
                    "searchTerms": searchTerms
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
            }
        }, 500);
    });

    //Help Section click handler
    $(document.body).on('click', '.helpSectionHeading', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).next().slideUp();
        } else {
            $(this).addClass('active');
            $(this).next().slideDown();
        }
    });

    $(document.body).on('click', '.tocSectionTitleText', function(e) {
        e.preventDefault();
        globalReadium.reader.openContentUrl($(this).attr('href'));
    });

    $(document.body).on('click', '.tocSubsectionTitleText', function(e) {
        e.preventDefault();
        globalReadium.reader.openContentUrl($(this).attr('href'));
    });

    //TOC delete click handler
    $(document.body).on('click', '.tocPageDeleteButton', function(e) {
        var sectionId = $(this).attr('section-id');
        var documentId = $(this).attr('document-id');
        createTOCDeleteConfirmDialog(sectionId, documentId);
    });

    $(document.body).on('click', '#tocDeleteConfirmButton', function(e) {
        var sectionId = $(this).attr('section-id');
        var documentId = $(this).attr('document-id');
        globalPebl.removeToc(documentId, sectionId);

        //Remove from the list
        $('#' + documentId).remove();

        //Reload the count
        getAddedResources();

        $('.tocDeleteConfirmDialogContainer').remove();
        $('.tocDeleteConfirmDialogOverlay').remove();
    });

    $(document.body).on('click', '#tocDeleteCancelButton', function(e) {
        $('.tocDeleteConfirmDialogContainer').remove();
        $('.tocDeleteConfirmDialogOverlay').remove();
    });

    $(document.body).on('click', '#dynamicPageCloseButton', function(e) {
        closeDynamicPage();
    });

    $(document.body).on('click', '#overlayCloseButton', function(e) {
        handleOverlayCloseButtonClick();
    });

    $(document.body).on('click', '.notificationElementWrapper', function(e) {
        sendDocumentToDestination($(this).attr('url'), $(this).attr('docType'), $(this).attr('externalURL'), $(this).attr('title'));
        globalPebl.removeNotification($(this).attr('notification-id'));
        if ($('body')[0].baseURI.split('/').pop() === $(this).attr('destination')) {
            $('#notificationsContainer').remove();
            openDocumentAtDestination();
        } else {
            globalReadium.reader.openContentUrl($(this).attr('destination'));
        }
    });

    window.onorientationchange = handleOrientationChange;
});

//Overlay button creation

function createOverlay() {
    if ($('#peblOverlay')) {
        $('#peblOverlay').remove();
    }

    //Header
    var overlay = document.createElement('div');
    overlay.id = 'peblOverlay';
    overlay.classList.add('peblOverlay');

    var headerWrapper = document.createElement('div');
    headerWrapper.classList.add('headerWrapper');

    var iconContainer = document.createElement('div');
    iconContainer.id = 'iconContainer';
    iconContainer.classList.add('iconContainer');

    overlay.appendChild(headerWrapper);

    headerWrapper.appendChild(createCloseButton());
    headerWrapper.appendChild(createExpandButton());
    //overlay.appendChild(createAccountButton());
    //iconContainer.appendChild(createHelpButton());
    //iconContainer.appendChild(createNotificationButton());
    iconContainer.appendChild(createAskButton());
    iconContainer.appendChild(createSearchButton());
    iconContainer.appendChild(createTOCButton());
    headerWrapper.appendChild(iconContainer);
    headerWrapper.appendChild(createNotificationButton());

    var hr = document.createElement('hr');
    hr.id = 'uiBarDivider';
    hr.setAttribute('style', 'display:none; clear:both;');
    overlay.appendChild(hr);

    document.body.appendChild(overlay);
}

function createFooter() {
    if ($('#peblFooter')) {
        $('#peblFooter').remove();
    }

    //Footer
    var footer = document.createElement('div');
    footer.id = 'peblFooter';
    footer.classList.add('peblFooter');

    var footerIconContainer = document.createElement('div');
    footerIconContainer.id = 'footerIconContainer';
    footerIconContainer.classList.add('footerIconContainer');

    footerIconContainer.appendChild(createFooterFindButton());
    footerIconContainer.appendChild(createFooterDiscussButton());
    footerIconContainer.appendChild(createFooterNotesButton());
    // footerIconContainer.appendChild(createFooterContributeButton());
    // footerIconContainer.appendChild(createFooterAddedResourcesButton());

    footer.appendChild(footerIconContainer);

    document.body.appendChild(footer);
}

function attachAddedResources() {
    document.getElementsByClassName('contentContainerWrapper')[0].appendChild(createFooterAddedResourcesButton());
}

function createFooterFindButton() {
    var findButtonContainer = document.createElement('div');
    findButtonContainer.classList.add('findButtonContainer');
    findButtonContainer.id = 'findButtonContainer';

    var findButton = document.createElement('button');
    findButton.id = 'findButton';
    findButton.classList.add('findButton');
    findButton.addEventListener('click', handleFindButtonClick);

    var findButtonIcon = document.createElement('i');
    findButtonIcon.classList.add('fa', 'fa-search', 'footerIcon');

    findButton.appendChild(findButtonIcon);

    var findButtonTextContainer = document.createElement('div');

    var findButtonText = document.createElement('span');
    findButtonText.textContent = 'Find Resources';

    findButtonTextContainer.appendChild(findButtonText);

    findButton.appendChild(findButtonTextContainer);

    var findMenuContainer = document.createElement('div');
    findMenuContainer.classList.add('findMenuContainer', 'hidden');
    findMenuContainer.id = 'findMenuContainer';

    var findMenuList = document.createElement('ul');
    findMenuList.classList.add('findMenuList');

    var tempTextElement = document.createElement('span');
    tempTextElement.classList.add('findMenuListElementText');

    var findMenuPrograms = document.createElement('li');
    findMenuPrograms.id = 'findMenuContent';
    findMenuPrograms.classList.add('findMenuListElement');
    tempTextElement.textContent = 'Content';
    findMenuPrograms.appendChild(tempTextElement);

    var tempTextElement = document.createElement('span');
    tempTextElement.classList.add('findMenuListElementText');

    var findMenuPeople = document.createElement('li');
    findMenuPeople.id = 'findMenuPeople';
    findMenuPeople.classList.add('findMenuListElement');
    tempTextElement.textContent = 'People';
    findMenuPeople.appendChild(tempTextElement);

    var tempTextElement = document.createElement('span');
    tempTextElement.classList.add('findMenuListElementText');

    var findMenuDocuments = document.createElement('li');
    findMenuDocuments.id = 'findMenuResources';
    findMenuDocuments.classList.add('findMenuListElement');
    tempTextElement.textContent = 'Resources';
    findMenuDocuments.appendChild(tempTextElement);

    var tempTextElement = document.createElement('span');
    tempTextElement.classList.add('findMenuListElementText');

    var findMenuOther = document.createElement('li');
    findMenuOther.id = 'findMenuInstitutions';
    findMenuOther.classList.add('findMenuListElement');
    tempTextElement.textContent = 'Institutions';
    findMenuOther.appendChild(tempTextElement);

    findMenuList.appendChild(findMenuPrograms);
    findMenuList.appendChild(findMenuPeople);
    findMenuList.appendChild(findMenuDocuments);
    findMenuList.appendChild(findMenuOther);

    findMenuContainer.appendChild(findMenuList);

    findButtonContainer.appendChild(findButton);
    findButtonContainer.appendChild(findMenuContainer);

    return findButtonContainer;
}

function createFooterDiscussButton() {
    var discussButtonContainer = document.createElement('div');
    discussButtonContainer.classList.add('discussButtonContainer');

    var discussButton = document.createElement('button');
    discussButton.id = 'discussButton';
    discussButton.classList.add('discussButton');

    var discussIcon = document.createElement('i');
    discussIcon.classList.add('fa', 'fa-comments', 'footerIcon');

    discussButton.appendChild(discussIcon);

    var discussButtonTextContainer = document.createElement('div');

    var discussButtonText = document.createElement('span');
    discussButtonText.textContent = 'Discuss';

    discussButtonTextContainer.appendChild(discussButtonText);

    discussButton.appendChild(discussButtonTextContainer);

    discussButtonContainer.appendChild(discussButton);

    return discussButtonContainer;
}

function createFooterContributeButton() {
    var contributeButtonContainer = document.createElement('div');
    contributeButtonContainer.classList.add('contributeButtonContainer');

    var contributeButton = document.createElement('button');
    contributeButton.id = 'contributeButton';
    contributeButton.classList.add('contributeButton');
    contributeButton.textContent = 'Contribute';

    contributeButtonContainer.appendChild(contributeButton);

    return contributeButtonContainer;
}

function createFooterAddedResourcesButton() {
    var addedResourcesButtonContainer = document.createElement('div');
    addedResourcesButtonContainer.classList.add('addedResourcesButtonContainer', 'hidden');

    var addedResourcesButton = document.createElement('button');
    addedResourcesButton.id = 'addedResourcesButton';
    addedResourcesButton.classList.add('addedResourcesButton');
    addedResourcesButton.addEventListener('click', handleAddedResourcesButtonClick);

    var addedResourcesBadgeContainer = document.createElement('div');
    addedResourcesBadgeContainer.classList.add('addedResourcesBadgeContainer');

    var addedResourcesBadge = document.createElement('span');
    addedResourcesBadge.id = 'addedResourcesBadge';
    addedResourcesBadge.classList.add('addedResourcesBadge');
    addedResourcesBadge.textContent = '0';

    var text1 = document.createElement('span');
    text1.textContent = 'View';

    var text2 = document.createElement('span');
    text2.textContent = 'Resources';

    addedResourcesButton.appendChild(text1);
    addedResourcesButton.appendChild(addedResourcesBadge);
    addedResourcesButton.appendChild(text2);

    // addedResourcesBadgeContainer.appendChild(addedResourcesBadge);

    addedResourcesButtonContainer.appendChild(addedResourcesButton);
    // addedResourcesButtonContainer.appendChild(addedResourcesBadgeContainer);

    return addedResourcesButtonContainer;
}

function createFooterNotesButton() {
    var notesButtonContainer = document.createElement('div');
    notesButtonContainer.classList.add('notesButtonContainer');

    var notesButton = document.createElement('button');
    notesButton.id = 'notesButton';
    notesButton.classList.add('notesButton');

    var notesIcon = document.createElement('i');
    notesIcon.classList.add('fa', 'fa-sticky-note', 'footerIcon');

    notesButton.appendChild(notesIcon);

    var notesTextContainer = document.createElement('div');

    var notesText = document.createElement('span');
    notesText.textContent = 'Notes';

    notesTextContainer.appendChild(notesText);

    notesButton.appendChild(notesTextContainer);

    notesButtonContainer.appendChild(notesButton);

    return notesButtonContainer;
}

function createExpandButton() {
    var expandButtonContainerUnderlay = document.createElement('div');
    expandButtonContainerUnderlay.classList.add('expandButtonContainerUnderlay');
    expandButtonContainerUnderlay.addEventListener('click', handleExpandButtonClick);

    var expandButtonContainer = document.createElement('div');
    expandButtonContainer.id = 'expandButtonContainer';
    expandButtonContainer.classList.add('expandButtonContainer');

    var expandButton = document.createElement('i');
    expandButton.id = 'expandButton';
    expandButton.classList.add('expandButton', 'fa', 'fa-toolbox');

    var expandText = document.createElement('span');
    expandText.classList.add('expandText');
    expandText.textContent = 'Menu';

    expandButtonContainer.appendChild(expandButton);
    expandButtonContainerUnderlay.appendChild(expandButtonContainer);
    expandButtonContainerUnderlay.appendChild(expandText);
    return expandButtonContainerUnderlay;
}

function createCloseButton() {
    var closeButton = document.createElement('i');
    closeButton.id = 'closeButton';
    closeButton.classList.add('fa', 'fa-times', 'closeButton');
    closeButton.addEventListener('click', handleCloseButtonClick);
    return closeButton;
}

function createHelpButton() {
    var helpButtonContainer = document.createElement('div');
    helpButtonContainer.id = 'helpButtonContainer';
    helpButtonContainer.classList.add('helpButtonContainer');

    var helpButton = document.createElement('span');
    helpButton.id = 'helpButton';
    helpButton.classList.add('helpButton');
    helpButton.textContent = '?';
    helpButtonContainer.appendChild(helpButton);

    return helpButtonContainer;
}

function createNotificationButton() {
    var peblNotificationButtonContainer = document.createElement('div');
    peblNotificationButtonContainer.id = 'peblNotificationButtonContainer';
    peblNotificationButtonContainer.classList.add('peblNotificationButtonContainer');

    var peblNotificationButton = document.createElement('i');
    peblNotificationButton.id = 'peblNotificationButton';
    peblNotificationButton.classList.add('fa', 'fa-bell', 'peblNotificationButton');
    peblNotificationButton.setAttribute('aria-hidden', 'true');
    peblNotificationButton.addEventListener('click', handleNotificationButtonClick);

    var peblNotificationBadge = document.createElement('div');
    peblNotificationBadge.id = 'peblNotificationBadge';
    peblNotificationBadge.classList.add('peblNotificationBadge');
    peblNotificationButtonContainer.appendChild(peblNotificationButton);
    peblNotificationButtonContainer.appendChild(peblNotificationBadge);
    return peblNotificationButtonContainer;
}

function createAskButton() {
    var askButtonContainer = document.createElement('div');
    askButtonContainer.id = 'askButtonContainer';
    askButtonContainer.classList.add('askButtonContainer');
    askButtonContainer.addEventListener('click', handleAskButtonClick);

    var askButton = document.createElement('i');
    askButton.id = 'askButton';
    askButton.classList.add('askButton', 'fa', 'fa-comment-alt');
    askButtonContainer.appendChild(askButton);

    var askButtonLabel = document.createElement('span');
    askButtonLabel.classList.add('askButtonLabel');
    askButtonLabel.id = 'askButtonLabel';
    askButtonLabel.textContent = 'Ask an Expert';
    askButtonContainer.appendChild(askButtonLabel);

    return askButtonContainer;
}

function createSearchButton() {
    var searchButtonContainer = document.createElement('div');
    searchButtonContainer.id = 'searchButtonContainer';
    searchButtonContainer.classList.add('searchButtonContainer');
    searchButtonContainer.addEventListener('click', handleRegistryButtonClick);

    var searchButton = document.createElement('i');
    searchButton.id = 'searchButton';
    searchButton.classList.add('searchButton', 'fa', 'fa-search');
    searchButtonContainer.appendChild(searchButton);

    var searchButtonLabel = document.createElement('div');
    searchButtonLabel.classList.add('searchButtonLabel');
    searchButtonLabel.id = 'searchButtonLabel';
    searchButtonLabel.textContent = 'Search Network';
    searchButtonContainer.appendChild(searchButtonLabel);

    return searchButtonContainer;
}

function createAccountButton() {
    var accountButtonContainer = document.createElement('div');
    accountButtonContainer.id = 'accountButtonContainer';
    accountButtonContainer.classList.add('accountButtonContainer');

    var accountIcon = document.createElement('img');
    accountIcon.id = 'accountIcon';
    accountIcon.classList.add('accountIcon');
    accountIcon.src = 'image/peblAccountIcon.png';

    var accountName = document.createElement('span');
    accountName.id = 'accountName';
    accountName.classList.add('accountName');

    var accountLogoutButton = document.createElement('button');
    accountLogoutButton.id = 'accountLogoutButton';
    accountLogoutButton.classList.add('accountLogoutButton');
    accountLogoutButton.textContent = 'Logout';

    accountButtonContainer.appendChild(accountIcon);
    accountButtonContainer.appendChild(accountName);
    accountButtonContainer.appendChild(accountLogoutButton);
    return accountButtonContainer;
}

function createTOCButton() {
    var tocButtonContainer = document.createElement('div');
    tocButtonContainer.id = 'tocButtonContainer';
    tocButtonContainer.classList = 'tocButtonContainer';
    tocButtonContainer.addEventListener('click', handleTOCButtonClick);

    var tocButton = document.createElement('i');
    tocButton.id = 'tocButton';
    tocButton.classList.add('tocButton', 'fa', 'fa-list-ul');

    var tocButtonLabel = document.createElement('span');
    tocButtonLabel.classList.add('tocButtonLabel');
    tocButtonLabel.id = 'tocButtonLabel';
    tocButtonLabel.textContent = 'Contents';


    tocButtonContainer.appendChild(tocButton);
    tocButtonContainer.appendChild(tocButtonLabel);
    return tocButtonContainer;
}

//Helper Functions

function clearUI() {
    $('#overlayCloseButton').remove();
    clearRegistrySearch();
    clearAskExpert();
    clearHelp();
    clearTOC();
    //Add more as needed
}

function clearNotifications() {
    $('#notificationsContainer').remove();
}

function clearHelp() {
    //Remove help elements
    $('#helpContainer').remove();
    $('#helpButtonContainer').removeClass('active');
}

function clearAskExpert() {
    //Remove askExpert elements
    $('#askContainer').remove();
    document.getElementById('askButton').classList.remove('active');
    document.getElementById('askButtonLabel').classList.remove('active');
}

function clearRegistrySearch() {
    //Remove registrySearch elements
    $('#registryContainer').remove();
    document.getElementById('searchButton').classList.remove('active');
    document.getElementById('searchButtonLabel').classList.remove('active');
}

function clearTOC() {
    $('#tocContainer').remove();
    document.getElementById('tocButton').classList.remove('active');
    document.getElementById('tocButtonLabel').classList.remove('active');
}

//Display the notification
function setNotificationBadgeCounter(n) {
    $('#peblNotificationBadge').text(n);
    if (n === 0) {
        $('#peblNotificationBadge').hide();
    } else {
        $('#peblNotificationBadge').show();
    }
}

function setAccountName() {
    if (typeof pebl !== 'undefined' && pebl.userManager.isLoggedIn === true) {
        $('#accountName').text(pebl.userManager.profile.name);
    }
}

//Tutorial

function createUITutorial() {
    //Create tutorial elements
    if (overlayIsExtended) {
        retractOverlay();
    }

    var tutorialMessageContainer = document.createElement('div');
    tutorialMessageContainer.id = 'tutorialMessageContainer';
    tutorialMessageContainer.classList.add('tutorialMessageContainer');
    tutorialMessageContainer.setAttribute('Stage', '1');

    var tutorialMessage = document.createElement('p');
    tutorialMessage.id = 'tutorialMessage';
    tutorialMessage.classList.add('tutorialMessage');
    tutorialMessage.textContent = 'This is your PEBL toolbar, most of the functionality is located here. Take advantage of it!';
    tutorialMessageContainer.appendChild(tutorialMessage);

    var tutorialMessageNextButton = document.createElement('label');
    tutorialMessageNextButton.id = 'tutorialMessageNextButton';
    tutorialMessageNextButton.classList.add('tutorialMessageNextButton');
    tutorialMessageNextButton.textContent = 'Next';
    tutorialMessageContainer.appendChild(tutorialMessageNextButton);
    tutorialMessageNextButton.addEventListener('click', nextTutorialStage);

    var tutorialMessageArrow = document.createElement('div');
    tutorialMessageArrow.id = 'tutorialMessageArrow';
    tutorialMessageArrow.classList.add('tutorialMessageArrow');

    tutorialMessageContainer.appendChild(tutorialMessageArrow);
    document.getElementById('peblOverlay').appendChild(tutorialMessageContainer);

}

function nextTutorialStage() {
    var currentStage = $('#tutorialMessageContainer').attr('Stage');
    if (currentStage === '1') {
        handleExpandButtonClick();
        setTimeout(function() {
            $('#tutorialMessageContainer').animate({
                left: $('#tocButtonContainer').offset().left
            }, 500);

            $('#tutorialMessageArrow').animate({
                marginLeft: '50px'
            }, 500);

            $('#tutorialMessage').text('The table of contents section allows you to view and navigate to all of major sections of your book.');
            $('#tutorialMessageContainer').attr('Stage', '2');
        }, 500);
    } else if (currentStage === '2') {
        $('#tutorialMessageContainer').animate({
            left: $('#searchButtonContainer').offset().left
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '50px'
        }, 500);

        $('#tutorialMessage').text('The Registry Search feature allows you to find the information you need quickly and easily from a wide variety of sources.');
        $('#tutorialMessageContainer').attr('Stage', '3');
    } else if (currentStage === '3') {
        $('#tutorialMessageContainer').animate({
            left: $('#askButtonContainer').offset().left - 150
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '175px'
        }, 500);

        $('#tutorialMessage').text('The Ask an Expert feature allows you to get in contact with a real professional in one of many fields.');

        $('#tutorialMessageNextButton').text('Got it');
        $('#tutorialMessageContainer').attr('Stage', 'End');
    } else if (currentStage === 'End') {
        endTutorial();
        //Collapse the overlay buttons after tutorial ends.
        handleCloseButtonClick();
    }
}

function endTutorial() {
    //Clean up
    $('#tutorialMessageContainer').remove();
    localStorage.setItem('tutorialStatus', 'Complete');
}

function displayUITutorial() {
    var tutorialStatus = localStorage.getItem('tutorialStatus');
    if (tutorialStatus && tutorialStatus === 'Complete') {
        //Don't show the tutorial
    } else {
        //show the overlay buttons first
        createUITutorial();
    }
}

//Overlay sections

function createNotifications() {

    var notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notificationsContainer';
    notificationsContainer.classList.add('notificationsContainer');

    

    globalPebl.getNotifications(function(obj) {
        var notificationsObj = obj;

        Object.keys(notificationsObj).forEach(function(key) {
            var pulled;
            if (notificationsObj[key].payload.actorId === globalPebl.getUserName()) {
                pulled = true;
            } else {
                pulled = false;
            }
            var notificationElementWrapper = document.createElement('div');
            notificationElementWrapper.classList.add('notificationElementWrapper');
            notificationElementWrapper.setAttribute('url', notificationsObj[key].payload.url);
            notificationElementWrapper.setAttribute('docType', notificationsObj[key].payload.docType);
            notificationElementWrapper.setAttribute('externalURL', notificationsObj[key].payload.externalURL);
            notificationElementWrapper.setAttribute('title', notificationsObj[key].payload.name);
            notificationElementWrapper.setAttribute('destination', 'Page-' + notificationsObj[key].payload.card + '.xhtml');
            notificationElementWrapper.setAttribute('notification-id', notificationsObj[key].id);

            var notificationElement = document.createElement('p');
            notificationElement.classList.add('notificationElement');

            var notificationElementSenderText = document.createElement('span');
            notificationElementSenderText.classList.add('notificationElementSenderText');
            if (pulled)
                notificationElementSenderText.textContent = 'You added ';
            else
                notificationElementSenderText.textContent = notificationsObj[key].payload.actorId + ' shared ';

            var notificationElementContentText = document.createElement('span');
            notificationElementContentText.classList.add('notificationElementContentText');
            notificationElementContentText.textContent = notificationsObj[key].payload.name;

            var toSpan = document.createElement('span');
            toSpan.textContent = ' to ';

            var notificationElementLocationText = document.createElement('a');
            notificationElementLocationText.classList.add('notificationElementLocationText');
            notificationElementLocationText.textContent = 'Section ' + notificationsObj[key].payload.card;

            notificationElement.appendChild(notificationElementSenderText);
            notificationElement.appendChild(notificationElementContentText);
            notificationElement.appendChild(toSpan);
            notificationElement.appendChild(notificationElementLocationText);

            notificationElementWrapper.appendChild(notificationElement);
            notificationsContainer.appendChild(notificationElementWrapper);
        });

        document.getElementById('peblNotificationButtonContainer').appendChild(notificationsContainer);
    });
}

function createHelp() {
    clearUI();
    //Create the help page
    var helpContainer = document.createElement('div');
    helpContainer.id = 'helpContainer';
    helpContainer.classList.add('helpContainer');

    var overviewHelpSection = createHelpListElement('overviewHelpSection', 'PEBL Overview', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var contentMorphingHelpSection = createHelpListElement('contentMorphingHelpSection', 'Content Morphing', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var discussionHelpSection = createHelpListElement('discussionHelpSection', 'Discussions', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var hotwordHelpSection = createHelpListElement('hotwordHelpSection', 'Hotwords', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var popoutHelpSection = createHelpListElement('popoutHelpSection', 'Popouts', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var quizHelpSection = createHelpListElement('quizHelpSection', 'Quizzes', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
    var showHideHelpSection = createHelpListElement('showHideHelpSection', 'Show/Hide', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');

    helpContainer.appendChild(overviewHelpSection);
    helpContainer.appendChild(contentMorphingHelpSection);
    helpContainer.appendChild(discussionHelpSection);
    helpContainer.appendChild(hotwordHelpSection);
    helpContainer.appendChild(popoutHelpSection);
    helpContainer.appendChild(quizHelpSection);
    helpContainer.appendChild(showHideHelpSection);

    document.getElementById('peblOverlay').appendChild(helpContainer);
}

function createHelpListElement(id, title, body) {
    var tempDiv = document.createElement('div');
    tempDiv.classList.add('helpSectionDiv');

    var tempHeading = document.createElement('button');
    tempHeading.textContent = title;
    tempHeading.classList.add('helpSectionHeading');

    var tempBody = document.createElement('div');
    tempBody.id = id;
    tempBody.classList.add('helpSectionBody');

    var tempPara = document.createElement('p');
    tempPara.classList.add('helpSectionPara');
    tempPara.textContent = body;

    tempBody.appendChild(tempPara);
    tempDiv.appendChild(tempHeading);
    tempDiv.appendChild(tempBody);

    return tempDiv;
}



function createAskExpert() {
    clearUI();
    //Create the askExpert page
    var askContainer = document.createElement('div');
    askContainer.id = 'askContainer';
    askContainer.classList.add('askContainer');

    var wrapper = document.createElement('div');
    wrapper.classList.add('responsive-wrapper');
    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

    var askFrame = document.createElement('iframe');
    askFrame.id = 'askFrame';
    askFrame.classList.add('askFrame');
    askFrame.src = 'https://ask.extension.org/ask';
    wrapper.appendChild(askFrame);
    askContainer.appendChild(wrapper);
    document.getElementById('peblOverlay').appendChild(askContainer);
    askContainer.appendChild(createOverlayCloseButton());
}



function createRegistrySearch() {
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6).substring(5);
    clearUI();
    //Create the registrySearch page
    var registryContainer = document.createElement('div');
    registryContainer.id = 'registryContainer';
    registryContainer.classList.add('registryContainer');
    registryContainer.setAttribute('style', 'overflow: auto;');

    var wrapper = document.createElement('div');
    wrapper.classList.add('responsive-wrapper');
    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

    var registryFrame = document.createElement('iframe');
    registryFrame.id = 'registryFrame';
    registryFrame.classList.add('registryFrame');
    registryFrame.src = 'https://peblproject.com/registry/#welcome';
    registryFrame.name = 'registryFrame';
    wrapper.appendChild(registryFrame);
    registryContainer.appendChild(wrapper);
    document.getElementById('peblOverlay').appendChild(registryContainer);

    registryContainer.appendChild(createOverlayCloseButton());

    //Post Messages
    var waitingForReady = setInterval(function() {
        if (frameIsReady) {
            clearInterval(waitingForReady);
            var iframe = document.getElementById('registryFrame');
            var currentUser = pebl.userManager.profile.identity;
            var obj = {
                "messageType": "Login",
                "user": currentUser,
                "currentPage": currentPage
            }
            var message = JSON.stringify(obj);
            iframe.contentWindow.postMessage(message, '*');
            //Script on registry page would login as that user
        }
    }, 500);
}

function createTOC() {
    clearUI();

    globalPebl.getToc(function(obj) {
        var tocObject = obj;

        var tocContainer = document.createElement('div');
        tocContainer.id = 'tocContainer';
        tocContainer.classList.add('tocContainer');

        Object.keys(tocObject).forEach(function(sectionKey) {
            //Sections
            var tocSection = document.createElement('div');
            tocSection.classList.add('tocSection');
            var tocSectionPrefix = document.createElement('div');
            tocSectionPrefix.classList.add('tocSectionPrefix');
            var tocSectionPrefixText = document.createElement('a');
            tocSectionPrefixText.classList.add('tocSectionPrefixText');
            tocSectionPrefixText.textContent = tocObject[sectionKey].Section.prefix;
            tocSectionPrefixText.href = tocObject[sectionKey].Section.location;
            tocSectionPrefix.appendChild(tocSectionPrefixText);
            var tocSectionTitle = document.createElement('div');
            tocSectionTitle.classList.add('tocSectionTitle');
            var tocSectionTitleTextWrapper = document.createElement('div');
            tocSectionTitleTextWrapper.classList.add('tocSectionTitleTextWrapper');
            var tocSectionTitleText = document.createElement('a');
            tocSectionTitleText.classList.add('tocSectionTitleText');
            tocSectionTitleText.textContent = tocObject[sectionKey].Section.title;
            tocSectionTitleText.href = tocObject[sectionKey].Section.location;
            tocSectionTitleTextWrapper.appendChild(tocSectionTitleText);
            tocSectionTitle.appendChild(tocSectionPrefix);
            tocSectionTitle.appendChild(tocSectionTitleTextWrapper);
            tocSection.appendChild(tocSectionTitle);
            Object.keys(tocObject[sectionKey]).sort(toc_sort).forEach(function(pageKey) {
                //Pages
                if (pageKey === 'Section') {
                    //Do nothing
                } else if (pageKey.includes('Subsection')) {
                    //Subsections
                    var tocSubsectionPrefix = document.createElement('div');
                    tocSubsectionPrefix.classList.add('tocSubsectionPrefix');
                    var tocSubsectionPrefixText = document.createElement('span');
                    tocSubsectionPrefixText.classList.add('tocSubsectionPrefixText');
                    tocSubsectionPrefixText.textContent = tocObject[sectionKey][pageKey].prefix;

                    tocSubsectionPrefix.appendChild(tocSubsectionPrefixText);

                    var tocSubsectionTitle = document.createElement('div');
                    tocSubsectionTitle.classList.add('tocSubsectionTitle');
                    var tocSubsectionTitleTextWrapper = document.createElement('div');
                    tocSubsectionTitleTextWrapper.classList.add('tocSubsectionTitleTextWrapper');
                    if (tocObject[sectionKey][pageKey].skip !== undefined) {
                        var tocSubsectionTitleText = document.createElement('a');
                        tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
                        tocSubsectionTitleText.textContent = tocObject[sectionKey][pageKey].title;
                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
                    } else {
                        var tocSubsectionTitleText = document.createElement('a');
                        tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
                        tocSubsectionTitleText.textContent = tocObject[sectionKey][pageKey].title;
                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
                    }
                    

                    tocSubsectionTitleTextWrapper.appendChild(tocSubsectionTitleText);
                    tocSubsectionTitle.appendChild(tocSubsectionPrefix);
                    tocSubsectionTitle.appendChild(tocSubsectionTitleTextWrapper);
                    tocSection.appendChild(tocSubsectionTitle);

                    Object.keys(tocObject[sectionKey][pageKey].pages).sort(toc_sort).forEach(function(cardKey) {
                        
                        if (tocObject[sectionKey][pageKey].skip !== undefined) {
                            //Do something different if its just a subsection
                            var cardMatch = tocObject[sectionKey][pageKey].prefix;
                            Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
                                if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
                                    var tocPage = document.createElement('div');
                                    tocPage.classList.add('tocPage');

                                    var tocPageIconWrapper = document.createElement('div');
                                    tocPageIconWrapper.classList.add('tocPageIconWrapper');

                                    var tocPageIcon = document.createElement('img');
                                    tocPageIcon.src = 'image/peblDynamicIcon.png';
                                    tocPageIcon.classList.add('tocPageIcon');

                                    tocPageIconWrapper.appendChild(tocPageIcon);

                                    var tocPageTextWrapper = document.createElement('div');
                                    tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                                    var tocPageText = document.createElement('a');
                                    tocPageText.classList.add('tocPageText');
                                    tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
                                    tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                                    tocPageText.setAttribute('slide', dynamicKey);
                                    tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                                    tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                                    tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                                    tocPageText.href = tocObject[sectionKey][pageKey].location;
                                    tocPageText.setAttribute('tocLink', 'true');
                                    tocPageText.addEventListener('click', function() {
                                        handleTocPageTextClick(event);
                                    });

                                    tocPageTextWrapper.appendChild(tocPageText);

                                    // var tocPageDeleteButtonWrapper = document.createElement('div');
                                    // tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                                    // var tocPageDeleteButton = document.createElement('span');
                                    // tocPageDeleteButton.classList.add('tocPageDeleteButton');
                                    // tocPageDeleteButton.innerHTML = '&#215;';
                                    // tocPageDeleteButton.setAttribute('section-id', sectionKey);
                                    // tocPageDeleteButton.setAttribute('document-id', dynamicKey);

                                    // tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                                    tocPage.appendChild(tocPageIconWrapper);
                                    tocPage.appendChild(tocPageTextWrapper);
                                    //tocPage.appendChild(tocPageDeleteButtonWrapper);
                                    tocSection.appendChild(tocPage);
                                }
                            });
                        } else {
                            var tocPage = document.createElement('div');
                            tocPage.classList.add('tocPage');
                            tocPage.classList.add('header');

                            var tocPagePrefixWrapper = document.createElement('div');
                            tocPagePrefixWrapper.classList.add('tocPagePrefixWrapper');

                            var tocPagePrefix = document.createElement('a');
                            tocPagePrefix.classList.add('tocPagePrefix');
                            tocPagePrefix.textContent = tocObject[sectionKey][pageKey].pages[cardKey].prefix;
                            tocPagePrefix.href = tocObject[sectionKey][pageKey].pages[cardKey].location;

                            tocPagePrefixWrapper.appendChild(tocPagePrefix);
                            tocPage.appendChild(tocPagePrefixWrapper);

                            var tocPageTextWrapper = document.createElement('div');
                            tocPageTextWrapper.classList.add('tocPageTextWrapperWide');

                            var tocPageText = document.createElement('a');
                            tocPageText.classList.add('tocPageText');
                            tocPageText.textContent = tocObject[sectionKey][pageKey].pages[cardKey].title;
                            tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
                            tocPageText.addEventListener('click', function() {
                                handleTocPageTextClick(event);
                            });

                            tocPageTextWrapper.appendChild(tocPageText);

                            tocPage.appendChild(tocPageTextWrapper);
                            tocSection.appendChild(tocPage);

                            var cardMatch = tocObject[sectionKey][pageKey].pages[cardKey].prefix;

                            //Add any dynamic documents associated with that page
                            Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
                                if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
                                    var tocPage = document.createElement('div');
                                    tocPage.classList.add('tocPage');

                                    var tocPageIconWrapper = document.createElement('div');
                                    tocPageIconWrapper.classList.add('tocPageIconWrapper');

                                    var tocPageIcon = document.createElement('img');
                                    tocPageIcon.src = 'image/peblDynamicIcon.png';
                                    tocPageIcon.classList.add('tocPageIcon');

                                    tocPageIconWrapper.appendChild(tocPageIcon);

                                    var tocPageTextWrapper = document.createElement('div');
                                    tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                                    var tocPageText = document.createElement('a');
                                    tocPageText.classList.add('tocPageText');
                                    tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
                                    tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                                    tocPageText.setAttribute('slide', dynamicKey);
                                    tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                                    tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                                    tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                                    tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
                                    tocPageText.setAttribute('tocLink', 'true');
                                    tocPageText.addEventListener('click', function() {
                                        handleTocPageTextClick(event);
                                    });

                                    tocPageTextWrapper.appendChild(tocPageText);

                                    // var tocPageDeleteButtonWrapper = document.createElement('div');
                                    // tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                                    // var tocPageDeleteButton = document.createElement('span');
                                    // tocPageDeleteButton.classList.add('tocPageDeleteButton');
                                    // tocPageDeleteButton.innerHTML = '&#215;';
                                    // tocPageDeleteButton.setAttribute('section-id', sectionKey);
                                    // tocPageDeleteButton.setAttribute('document-id', dynamicKey);

                                    // tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                                    tocPage.appendChild(tocPageIconWrapper);
                                    tocPage.appendChild(tocPageTextWrapper);
                                    //tocPage.appendChild(tocPageDeleteButtonWrapper);
                                    tocSection.appendChild(tocPage);
                                }
                            });
                        }
                    });

                } else {
                    //Do nothing
                    
                }


            });
            tocContainer.appendChild(tocSection);
        });
        document.getElementById('peblOverlay').appendChild(tocContainer);
        tocContainer.appendChild(createOverlayCloseButton());
        //Fix TOC scrolling, iOS sucks
        setTimeout(function() {
            $('.tocSection').attr('style', 'transform: translate3d(0px, 0px, 0px);');
        }, 1000);
    });
}

function createTOCDeleteConfirmDialog(sectionId, documentId) {
    var dimOverlay = document.createElement('div');
    dimOverlay.classList.add('tocDeleteConfirmDialogOverlay');

    var dialogContainer = document.createElement('div');
    dialogContainer.classList.add('tocDeleteConfirmDialogContainer');

    var dialogText = document.createElement('span');
    dialogText.classList.add('tocDeleteConfirmDialogText');
    dialogText.textContent = 'Delete this document?';

    var dialogCancelButton = document.createElement('button');
    dialogCancelButton.id = 'tocDeleteCancelButton';
    dialogCancelButton.classList.add('tocDeleteCancelButton');
    dialogCancelButton.textContent = 'Cancel';

    var dialogConfirmButton = document.createElement('button');
    dialogConfirmButton.id = 'tocDeleteConfirmButton';
    dialogConfirmButton.classList.add('tocDeleteConfirmButton');
    dialogConfirmButton.textContent = 'Confirm';
    dialogConfirmButton.setAttribute('section-id', sectionId);
    dialogConfirmButton.setAttribute('document-id', documentId);

    dialogContainer.appendChild(dialogText);
    dialogContainer.appendChild(dialogCancelButton);
    dialogContainer.appendChild(dialogConfirmButton);

    document.body.appendChild(dimOverlay);
    document.body.appendChild(dialogContainer);
}

function createDynamicPage(url, docType, externalURL, title) {
    closeDynamicPage();
    globalPebl.getAsset(url, function(obj) {
        // var blobURL = URL.createObjectURL(obj.content);
        // var arrayBuffer;
        // var fileReader = new FileReader();
        // fileReader.onload = function() {
        //  arrayBuffer = this.result;
        // }
        // fileReader.readAsArrayBuffer(obj.content);

        var dynamicPageHeader = document.createElement('div');
        dynamicPageHeader.id = 'dynamicPageHeader';
        dynamicPageHeader.classList.add('dynamicPageHeader');

        var dynamicPageHeaderLink = document.createElement('a');
        dynamicPageHeaderLink.id = 'dynamicPageHeaderLink';
        dynamicPageHeaderLink.classList.add('dynamicPageHeaderLink');
        dynamicPageHeaderLink.href = 'openinbrowser:' + externalURL;
        dynamicPageHeaderLink.innerHTML = externalURL;
        dynamicPageHeaderLink.addEventListener('click', function() {
            handleDynamicPageHeaderLinkClick(event);
        });

        dynamicPageHeader.appendChild(dynamicPageHeaderLink);


        var dynamicPageCloseButton = document.createElement('i');
        dynamicPageCloseButton.id = 'dynamicPageCloseButton';
        dynamicPageCloseButton.classList.add('dynamicPageCloseButton', 'fa', 'fa-times');

        var dynamicPage = document.createElement('div');
        dynamicPage.id = 'dynamicPage';
        dynamicPage.classList.add('dynamicPage');
        dynamicPage.setAttribute('resource-id', url);
        dynamicPage.setAttribute('title', title);

        var dynamicPageWrapper = document.createElement('div');
        dynamicPageWrapper.classList.add('responsive-wrapper');

        var dynamicPageFrame = document.createElement('iframe');
        dynamicPageFrame.id = 'dynamicPageFrame';
        dynamicPageFrame.classList.add('dynamicPageFrame');

        dynamicPageWrapper.appendChild(dynamicPageFrame);

        if (docType === 'html') {
            dynamicPageFrame.src = externalURL;
        } else if (docType === 'pdf') {
            // dynamicPageFrame.src = 'pdfjs-1.8.188-dist/web/viewer.html';
            // dynamicPageFrame.onload = function() {
            //  var frame = top.frames[0].document.getElementById('dynamicPageFrame');
            //  frame.contentWindow.PDFViewerApplication.open(arrayBuffer);
            // }
            dynamicPageFrame.src = 'http://docs.google.com/gview?url=' + externalURL + '&embedded=true';
        }

        dynamicPage.appendChild(dynamicPageWrapper);
        document.body.appendChild(dynamicPageHeader);
        document.body.appendChild(dynamicPage);
        document.body.appendChild(dynamicPageCloseButton);
    });
}

function createOverlayCloseButton() {
    var overlayCloseButton = document.createElement('i');
    overlayCloseButton.id = 'overlayCloseButton';
    overlayCloseButton.classList.add('overlayCloseButton', 'fa', 'fa-times');
    overlayCloseButton.addEventListener('click', handleOverlayCloseButtonClick);

    return overlayCloseButton;
}

//UI Display control

function expandOverlay() {
    overlayIsExtended = true;
    $('#uiBarDivider').css('display', 'block');
    $('#closeButton').show();
}

function retractOverlay() {
    clearUI();
    overlayIsExtended = false;
    $('#uiBarDivider').css('display', 'none');
    $('#closeButton').hide();
}

function showToolbar() {
    var iconContainer = $('#iconContainer');
    iconContainer.css('display', 'flex');
    iconContainer.animate({
        left: '15px'
    }, 250);
}

function hideToolbar() {
    var iconContainer = $('#iconContainer');
    iconContainer.animate({
        left: '-500px'
    }, 250, function() {
        iconContainer.hide();
        $('.expandButtonContainerUnderlay').show();
    });
}

function hideAddedResources() {
    $('.clearLayer').remove();
    $('#addedResourcesContainer').remove();
}

function closeDynamicPage() {
    $('#dynamicPageHeader').remove();
    $('#dynamicPageCloseButton').remove();
    $('#dynamicPage').remove();
}
 
//Click Handlers

function handleCloseButtonClick() {
    retractOverlay();
    hideToolbar();
}

function handleNotificationButtonClick() {
    if ($('#notificationsContainer').length) {
        clearNotifications();
    } else {
        createNotifications();
    }

}

function handleTOCButtonClick() {
    expandOverlay();
    createTOC();
    document.getElementById('tocButton').classList.add('active');
    document.getElementById('tocButtonLabel').classList.add('active');
}

function handleHelpButtonClick() {
    expandOverlay();
    createHelp();
    $('#helpButtonContainer').addClass('active');
}

function handleAskButtonClick() {
    expandOverlay();
    createAskExpert();
    document.getElementById('askButton').classList.add('active');
    document.getElementById('askButtonLabel').classList.add('active');
}

function handleRegistryButtonClick() {
    frameIsReady = false;
    expandOverlay();
    createRegistrySearch();
    document.getElementById('searchButton').classList.add('active');
    document.getElementById('searchButtonLabel').classList.add('active');
}

function handleExpandButtonClick() {
    showToolbar();
    $('.expandButtonContainerUnderlay').hide();
    $('#closeButton').show();
}

function handleOverlayCloseButtonClick() {
    clearUI();
    $('#uiBarDivider').css('display', 'none');
}

function handleFindButtonClick() {
    $('#findMenuContainer').removeClass('hidden');
}

function handleDiscussButtonClick() {
    closeLightBox();
    var currentBook = globalPebl.activityManager.currentBook;
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6).substring(5);
    var discussionId;
    var discussionTitle;

    if ($('#dynamicPage').length) {
        var currentDynamicPage = $('#dynamicPage').attr('resource-id');
        discussionId = currentBook + '_' + currentDynamicPage;

        var title = $('#dynamicPage').attr('title');
        discussionTitle = 'Added Resource - ' + title + ' Discussion';

    } else {
        discussionId = currentBook + '_' + currentPage;
        discussionTitle = $('h1.title').text() + ' Discussion';
    }

    //From discussion widget
    createDiscussionLightBox();

    var questionBox,
        questionBoxText,
        element,
        lightBoxContent;

    questionBox = document.createElement('div');
    questionBox.classList.add('discussionQuestionBox');
    questionBoxText = document.createElement('p');
    questionBoxText.classList.add('discussionQuestionBoxText');
    questionBoxText.textContent = discussionTitle;
    questionBox.appendChild(questionBoxText);

    lightBoxContent = document.getElementById('lightBoxContent');
    lightBoxContent.appendChild(questionBox);

    var chatResponses = $('<div class="chatResponses" style="display:none;"><div id="discussionSpanContainer" style="text-align: center; margin-top: 10px; margin-bottom: 10px; display: none;"><span class="discussionSpan">No one has replied to this discussion yet.</span></div></div>');
    var chatInput = $('<div class="chatInput" style="display:none;"><textarea id="discussTextArea" placeholder="Participate in the discussion."></textarea><button class="discussionCloseButton" onclick="closeLightBox();">Cancel</button><button class="chatSubmit">Submit</button></div>');
    var chat = $('<div class="chatBox"></div>');

    chat.append(chatInput);
    chat.append(chatResponses);
    lightBoxContent = $(lightBoxContent);
    lightBoxContent.append(chat);
    lightBoxContent.find(".chatInput").slideDown();

    //Subscribe to thread without clicking submit
    var chatInputBox = $('button.chatSubmit').parent();
    var responseBox = chatInputBox.siblings('.chatResponses');
    var messageHandle = messageHandler(responseBox);
    globalPebl.subscribeToDiscussion(discussionId, messageHandle);
    responseBox.slideDown();

    $('#discussTextArea').focus();

    chatInput.on('click', 'button.chatSubmit', function() {
        createThread(discussionId, $(this), true);
    });

    setTimeout(function() {
        $('#discussionSpanContainer').show();
    }, 2000);

    var checkDiscussionMessages = setInterval(function() {
        if (document.getElementsByClassName('chatResponses')[0].childElementCount > 1) {
            clearInterval(checkDiscussionMessages);
            $('#discussionSpanContainer').remove();
        }
    }, 1000);
}

function handleNotesButtonClick() {
    closeLightBox();
    var currentBook = globalPebl.activityManager.currentBook;
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6).substring(5);
    var discussionId;
    var discussionTitle;

    if ($('#dynamicPage').length) {
        var currentDynamicPage = $('#dynamicPage').attr('resource-id');
        discussionId = currentBook + '_' + currentDynamicPage + '_' + pebl.userManager.profile.name + '_Notes';

        var title = $('#dynamicPage').attr('title');
        discussionTitle = 'Added Resource - ' + title + ' Notes';

    } else {
        discussionId = currentBook + '_' + currentPage + '_' + pebl.userManager.profile.name + '_Notes';
        discussionTitle = $('h1.title').text() + ' Notes';
    }

    //From discussion widget
    createDiscussionLightBox();

    var questionBox,
        questionBoxText,
        element,
        lightBoxTitle,
        lightBoxContent;

    questionBox = document.createElement('div');
    questionBox.classList.add('discussionQuestionBox');
    questionBoxText = document.createElement('p');
    questionBoxText.classList.add('discussionQuestionBoxText');
    questionBoxText.textContent = discussionTitle;
    questionBox.appendChild(questionBoxText);
    
    lightBoxContent = document.getElementById('lightBoxContent');
    lightBoxContent.appendChild(questionBox);

    var notesResponses = $('<div class="notesResponses" style="display:none;"><div id="discussionSpanContainer" style="text-align: center; margin-top: 10px; margin-bottom: 10px; display: none;"><span class="discussionSpan">You haven\'t added any notes yet.</span></div></div>');
    var notesInput = $('<div class="notesInput" style="display:none;"><textarea id="notesTextArea" placeholder="Add a note."></textarea><button class="discussionCloseButton" onclick="closeLightBox();">Cancel</button><button class="notesSubmit">Add note</button></div>');
    var notes = $('<div class="notesBox"></div>');
    notes.append(notesInput);
    notes.append(notesResponses);
    lightBoxContent = $(lightBoxContent);
    lightBoxContent.append(notes);
    lightBoxContent.find(".notesInput").slideDown();

    $('#notesTextArea').focus();

    //Subscribe to thread without clicking submit
    var notesInputBox = $('button.notesSubmit').parent();
    var responseBox = notesInputBox.siblings('.notesResponses');
    var messageHandle = messageHandler(responseBox);
    globalPebl.subscribeToDiscussion(discussionId, messageHandle);
    responseBox.slideDown();

    notesInput.on('click', 'button.notesSubmit', function() {
        createThread(discussionId, $(this), true);
        globalPebl.subscribeToDiscussion(discussionId, messageHandle);
        responseBox.slideDown();
    });

    setTimeout(function() {
        $('#discussionSpanContainer').show();
    }, 2000);

    var checkDiscussionMessages = setInterval(function() {
        if (document.getElementsByClassName('notesResponses')[0].childElementCount > 1) {
            clearInterval(checkDiscussionMessages);
            $('#discussionSpanContainer').remove();
        }
    }, 1000);
}

function handleContributeButtonClick() {
    handleExpandButtonClick();
    handleRegistryButtonClick();

    setTimeout(function() {
        var iframe = document.getElementById('registryFrame');
        var obj = {
            "messageType": "Contribute"
        }
        var message = JSON.stringify(obj);
        iframe.contentWindow.postMessage(message, '*');
    }, 2000);
}

function handleAddedResourcesButtonClick() {
    if ($('#addedResourcesContainer').length) {
        hideAddedResources();
    } else {
        var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6).substring(5);
        var addedResourcesContainer = document.createElement('div');
        addedResourcesContainer.classList.add('addedResourcesContainer');
        if (Math.abs(window.orientation) === 90) {
            addedResourcesContainer.classList.add('landscape');
        }
        addedResourcesContainer.id = 'addedResourcesContainer';

        globalPebl.getToc(function(obj) {
            var tocObject = obj;

            Object.keys(tocObject).forEach(function(sectionKey) {
                //Sections
                Object.keys(tocObject[sectionKey]).forEach(function(pageKey) {
                    //Pages
                    if (!pageKey.includes('Subsection')) {
                        //Documents
                        if (tocObject[sectionKey][pageKey].card === currentPage) {
                            var tocPage = document.createElement('div');
                            tocPage.classList.add('tocPage');
                            tocPage.id = pageKey;

                            var tocPageIconWrapper = document.createElement('div');
                            tocPageIconWrapper.classList.add('tocPageIconWrapper');

                            var tocPageIcon = document.createElement('img');
                            tocPageIcon.src = 'image/peblDynamicIcon.png';
                            tocPageIcon.classList.add('tocPageIcon');

                            // tocPageIconWrapper.appendChild(tocPageIcon);

                            var tocPageTextWrapper = document.createElement('div');
                            tocPageTextWrapper.classList.add('tocPageTextWrapper');

                            var tocPageText = document.createElement('a');
                            tocPageText.classList.add('tocPageText');
                            tocPageText.style = 'font-size: 28px !important;'
                            tocPageText.textContent = tocObject[sectionKey][pageKey].documentName;
                            tocPageText.href = '#';
                            tocPageText.setAttribute('url', tocObject[sectionKey][pageKey].url);
                            tocPageText.setAttribute('docType', tocObject[sectionKey][pageKey].docType);
                            tocPageText.setAttribute('externalURL', tocObject[sectionKey][pageKey].externalURL);
                            tocPageText.addEventListener('click', function() {
                                handleTocPageTextClick(event);
                            });

                            tocPageTextWrapper.appendChild(tocPageText);

                            var tocPageDeleteButtonWrapper = document.createElement('div');
                            tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                            var tocPageDeleteButton = document.createElement('span');
                            tocPageDeleteButton.classList.add('tocPageDeleteButton');
                            tocPageDeleteButton.innerHTML = '&#215;';
                            tocPageDeleteButton.setAttribute('section-id', sectionKey);
                            tocPageDeleteButton.setAttribute('document-id', pageKey);

                            tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                            tocPage.appendChild(tocPageIconWrapper);
                            tocPage.appendChild(tocPageTextWrapper);
                            tocPage.appendChild(tocPageDeleteButtonWrapper);
                            addedResourcesContainer.appendChild(tocPage);
                        }
                    }
                });
            });
            var clearLayer = document.createElement('div');
            clearLayer.classList.add('clearLayer');
            document.body.appendChild(clearLayer);
            document.body.appendChild(addedResourcesContainer);

            $('.clearLayer').on('click', function(e) {
                $('.clearLayer').remove();
                $('#addedResourcesContainer').remove();
            });
        });
    }

}

function handleTocPageTextClick(event) {
    event.preventDefault();
        //If its a dynamic document
        if ($(event.currentTarget).attr('url')) {
            if ($(event.currentTarget).attr('tocLink')) {
                sendDocumentToDestination($(event.currentTarget).attr('url'), $(event.currentTarget).attr('docType'), $(event.currentTarget).attr('externalURL'), $(event.currentTarget).text());
                if ($('body')[0].baseURI.substr(1) === $(event.currentTarget).attr('href')) {
                    handleCloseButtonClick();
                    openDocumentAtDestination();
                } else {
                    globalReadium.reader.openContentUrl($(event.currentTarget).attr('href'));
                }
            } else {
                createDynamicPage($(event.currentTarget).attr('url'), $(event.currentTarget).attr('docType'), $(event.currentTarget).attr('externalURL'), $(event.currentTarget).text()); 
                handleCloseButtonClick();
                hideAddedResources();
            } 
        } else {
            globalReadium.reader.openContentUrl($(event.currentTarget).attr('href'));
        }
}

function handleDynamicPageHeaderLinkClick(event) {
    event.preventDefault();
    //If in iOS let the app handle opening in a new window ()
    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform))
        window.location.href = $(event.currentTarget).attr('href');
    else
        window.open($(event.currentTarget).attr('href').replace('openinbrowser:', ''), '_blank');

}

function getNotificationsCount() {
    globalPebl.getNotifications(function(obj) {
        var notificationsObj = obj;
        var notificationsCount = Object.keys(notificationsObj).length;
        setNotificationBadgeCounter(notificationsCount);

    });
}

function getAddedResources() {
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6).substring(5);
    var docCounter = 0;
    if (currentPage && currentPage !== '') {
        globalPebl.getToc(function(obj) {
            var tocObject = obj;

            Object.keys(tocObject).forEach(function(sectionKey) {
                //Sections
                Object.keys(tocObject[sectionKey]).forEach(function(pageKey) {
                    //Pages
                    if (!pageKey.includes('Subsection')) {
                        //Documents
                        if (tocObject[sectionKey][pageKey].card === currentPage) {
                            docCounter++;
                        }
                    }
                });
            });
            setAddedResourcesCount(docCounter);
            if (docCounter > 0) {
                $('.addedResourcesButtonContainer').removeClass('hidden');
                $('.contentContainer').addClass('flatBottom')
            } else {
                $('.addedResourcesButtonContainer').addClass('hidden');
                $('.contentContainer').removeClass('flatBottom');
            }
        });
    }
}

function setAddedResourcesCount(n) {
    document.getElementById('addedResourcesBadge').textContent = n;
}

function toc_sort(a, b) {
    // if (!a.includes('Page')) {
    //     return 1;
    // }
    // if (!b.includes('Page')) {
    //     return -1;
    // }

    var parts = {
        a: a.split('-'),
        b: b.split('-')
    };

    var a_compare;
    var b_compare;
    if (parts.a[1].includes('.')) {
        a_compare = parts.a[1].split('.').pop();
    } else {
        return -1;
    }

    if (parts.b[1].includes('.')) {
        b_compare = parts.b[1].split('.').pop();
    } else {
        return 1;
    }

    return parseFloat(a_compare) - parseFloat(b_compare);
}

function sendDocumentToDestination(url, docType, externalURL, title) {
    var obj = {
        'url': url,
        'docType': docType,
        'externalURL': externalURL,
        'title': title
    };

    localStorage.setItem('documentToOpen', JSON.stringify(obj));
}

function openDocumentAtDestination() {
    var tryOpenDocumentAtDestination = setInterval(function() {
        console.log('TRYING');
        if (globalPebl)
            if (localStorage.getItem('documentToOpen') !== null) {
                var documentObj = JSON.parse(localStorage.getItem('documentToOpen'));
                createDynamicPage(documentObj.url, documentObj.docType, documentObj.externalURL, documentObj.title);
                localStorage.removeItem('documentToOpen');
            }
            clearInterval(tryOpenDocumentAtDestination);
    }, 10);
}

function handleOrientationChange() {
    if (Math.abs(window.orientation) === 90) {
        $('.contentContainerWrapper, .contentContainer, .findButtonContainer, .discussButtonContainer, .notesButtonContainer, .findButton, .discussButton, .notesButton, .addedResourcesContainer').addClass('landscape');
    } else {
        $('.contentContainerWrapper, .contentContainer, .findButtonContainer, .discussButtonContainer, .notesButtonContainer, .findButton, .discussButton, .notesButton, .addedResourcesContainer').removeClass('landscape');
    }
}

//Weirdest bug ever
function fixIframeScrolling() {
    if ($('#registryContainer') && $('#registryContainer').attr('style') === 'overflow: hidden;') {
        $('#registryContainer').removeAttr('style');
    } else if ($('#registryContainer') && !($('#registryContainer').attr('style'))) {
        $('#registryContainer').attr('style', 'overflow: hidden;');
    }

    if ($('#askContainer') && $('#askContainer').attr('style') === 'overflow: hidden;') {
        $('#askContainer').removeAttr('style');
    } else if ($('#askContainer') && !($('#askContainer').attr('style'))) {
        $('#askContainer').attr('style', 'overflow: hidden;');
    }
}