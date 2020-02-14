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

var overlay = {
    askFrameSrc: "https://ask.extension.org/" // this is default, but can be programmatically set now using setAskFrameSrc(url)
};

if (globalPebl)
    globalPebl.extension.overlay = overlay;

var overlayIsExtended = false;
var tutorialIsActive = false;
var overlayIsDisplayed = false;
var handling = false;
var frameIsReady = false;
var globalPebl;
var globalReadium;
var filterTags = [];
var allTags = [];
var tagCountSet = false;
var searchableTOC = null;
var currentPrefix = null;
var currentSection = null;
var searchTerms = [];

window.addEventListener("message", receiveMessage, false);

overlay.setAskFrameSrc = function(url) {
    if (url && url != '')
        overlay.askFrameSrc = url;
}

overlay.getAskFrameSrc = function() {
    if (overlay.askFrameSrc && overlay.askFrameSrc != '')
        return overlay.askFrameSrc;
    else
        return "https://ask.extension.org/";
}

function receiveMessage(event) {
    var data = event.data;
    var obj;
    try {
        obj = JSON.parse(data);
    } catch(e) {

    }

    if (data === 'ready') {
        frameIsReady = true;
    } else if (obj && obj.message === "pullResource") {
        pullResource(obj.target, obj.url, obj.docType, obj.name, obj.externalURL);
    } else if (obj && obj.message === "iframeUpdate") {
        $('.registryFrame').css('height', obj.height);
    } else if (data === 'registryBackToTop') {
        $('#registryContainer > div')[0].scroll(0,0);
    }
}

function createEmailSubmissionModal() {
    var emailModal = document.createElement('div');
    emailModal.classList.add('emailModal', 'peblModal');
    emailModal.id = 'emailModal';

    var emailModalHeader = document.createElement('div');
    emailModalHeader.classList.add('emailModalHeader');

    var emailModalHeaderText = document.createElement('span');
    emailModalHeaderText.classList.add('emailModalHeaderText');
    emailModalHeaderText.textContent = "We'd Appreciate Your Feedback";

    emailModalHeader.appendChild(emailModalHeaderText);

    var emailModalCloseContainer = document.createElement('span');
    emailModalCloseContainer.classList.add('icon', 'button');
    var emailModalCloseButton = document.createElement('i');
    emailModalCloseButton.classList.add('fa', 'fa-times-circle', 'emailModalCloseButton');
    emailModalCloseButton.addEventListener('click', function() {
        jQuery('#emailModal').remove();
        globalPebl.emitEvent(globalPebl.events.eventUndisplayed, {
            target: 'emailSubmit',
            type: 'emailSubmit'
        });
    });

    emailModalCloseContainer.appendChild(emailModalCloseButton);
    emailModalHeader.appendChild(emailModalCloseContainer);
    emailModal.appendChild(emailModalHeader);

    var emailModalBody = document.createElement('div');
    emailModalBody.classList.add('emailModalBody');
    emailModal.appendChild(emailModalBody);

    var emailModalDescription = document.createElement('p');
    emailModalDescription.classList.add('emailModalDescription');
    emailModalDescription.textContent = 'Cooperative Extension professionals can add additional value to this eFieldbook, and bring their expertise to the national conversation. If you are interested in providing feedback, becoming a contributor, or serving on an advisory group, please provide your email below. A member from our team will reach out to you.';
    emailModalBody.appendChild(emailModalDescription);

    var inputContainer = document.createElement('div');
    inputContainer.classList.add('emailModalInputContainer');

    var inputLabel = document.createElement('label');
    inputLabel.textContent = 'Email Address ';
    inputLabel.classList.add('input-label');

    var emailInput = document.createElement('input');
    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(emailInput);

    var checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('emailModalCheckboxContainer');

    var checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = "Yes, I'd like to receive email updates about this eFieldbook.";
    checkboxLabel.classList.add('input-label');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('input');
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);

    var actionsContainer = document.createElement('div');
    actionsContainer.classList.add('modal-actions');

    var emailSubmit = document.createElement('button');
    emailSubmit.textContent = 'Submit';
    emailSubmit.classList.add('main-button');
    emailSubmit.addEventListener('click', function() {
        var val = emailInput.value.trim();
        // TODO: Add better email validation
        if (val.length > 0 && val.indexOf('@') > 0) {
            globalPebl.emitEvent(globalPebl.events.eventSubmitted, {
                'name': val,
                'type': 'emailFeedback'
            });
            if (checkbox.checked) {
                globalPebl.emitEvent(globalPebl.events.eventSubmitted, {
                    'name': val,
                    'type': 'emailMarketing'
                });
            }
            jQuery('#emailModal').remove();
        } else {
            window.alert('Please provide a valid email with which we may contact you.');
        }
    });
    actionsContainer.appendChild(emailSubmit);

    emailModalBody.appendChild(inputContainer);
    emailModalBody.appendChild(checkboxContainer);
    emailModalBody.appendChild(actionsContainer);

    document.body.appendChild(emailModal);
}

$(document).ready(function() {
    globalPebl = window.parent.PeBL;
    globalReadium = window.parent.ReadiumSDK;
    
    preloadIframes();
    createTags();
    createOverlay();
    createFooter();
    createSidebar();
    attachAddedResources();
    handleOrientationChange();
    displayUITutorial();

    // Prompt for voluntary participation in evaluation
    var previouslyPrompted = window.localStorage.getItem('previouslyPrompted-' + embeddedBookName);
    if (!previouslyPrompted) {
        createEmailSubmissionModal();
        window.localStorage.setItem('previouslyPrompted-' + embeddedBookName, 'true');
    }

    //var checkAccount = setInterval(setAccountName, 1000);
    //var fixIframes = setInterval(fixIframeScrolling, 500);
    var updateAddedResourceCount = setInterval(getAddedResources, 2000);
    var updateNotificationsCount = setInterval(getNotificationsCount, 2000);

    openDocumentAtDestination();

    $(document.body).on('click', '#tutorialMessageCancelButton', function() {
        endTutorial();
        handleCloseButtonClick();
    });

    $(document.body).on('click', '#tutorialMessageNextButton', nextTutorialStage);

    $(document.body).on('click', '.expandButtonContainerUnderlay', handleExpandButtonClick);
    $(document.body).on('click', '#closeButton', handleCloseButtonClick);
    $(document.body).on('click', '#helpButton', handleHelpButtonClick);
    $(document.body).on('click', '#feedbackButton', handleFeedbackButtonClick);
    $(document.body).on('click', '.showCardTagsButton', toggleCardTags);

    $(document.body).on('click', ".discussButton", function() {
        globalPebl.extension.discussion.handleChatButtonClick(this);
        //handleDiscussButtonClick(this);
    });
    
    $(document.body).on('click', ".notesButton", function() {
        globalPebl.extension.discussion.handleChatButtonClick(this);
        //handleNotesButtonClick();
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
        globalPebl.utils.removeToc(documentId, sectionId);

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
        var prefix = $(this).attr('destination');
        var url = $(this).attr('url');
        var docType = $(this).attr('docType');
        var externalURL = $(this).attr('externalURL');
        var title = $(this).attr('title');
        var notificationID = $(this).attr('notification-id');
        var destination = null;
        globalPebl.utils.removeNotification(notificationID);
        globalPebl.utils.getToc(function(toc) {
            Object.keys(toc).forEach(function(section) {
                Object.keys(toc[section]).forEach(function(subsection) {
                    if (toc[section][subsection].prefix && toc[section][subsection].prefix === prefix) {
                        destination = toc[section][subsection].location;
                    } else if (toc[section][subsection].pages) {
                        Object.keys(toc[section][subsection].pages).forEach(function(page) {
                            if (toc[section][subsection].pages[page].prefix && toc[section][subsection].pages[page].prefix === prefix) {
                                destination = toc[section][subsection].pages[page].location;
                            }
                        });
                    }
                });
            });
            if (destination != null) {
                sendDocumentToDestination(url, docType, externalURL, title);
                if ($('body')[0].baseURI.split('/').pop() === destination) {
                    clearNotifications();
                    openDocumentAtDestination();
                } else {
                    globalReadium.reader.openContentUrl(destination);
                }
            }
        });
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
    //iconContainer.appendChild(createNotificationButton());
    iconContainer.appendChild(createHelpButton());
    iconContainer.appendChild(createFeedbackButton());
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

function createTags() {
    var tags = window.pageCategories;

    if (tags) {
        var showCardTagsButton = document.createElement('button');
        showCardTagsButton.classList.add('showCardTagsButton', 'contracted', 'hidden');

        var tagContainer = document.createElement('div');
        tagContainer.classList.add('cardTagContainer', 'expanded');

        Object.keys(tags).forEach(function(key, index) {
            if (tags[key].length > 0) {
                // var tagGroup = document.createElement('div');
                // tagGroup.classList.add('cardTagGroup');

                for (var i = 0; i < tags[key].length; i++) {
                    var tagWrapper = document.createElement('div');
                    tagWrapper.classList.add('cardTag', 'taxonomy-' + key);
                    var tag = document.createElement('div');
                    tag.id = globalPebl.utils.getUuid();
                    tag.classList.add('resource-tag');
                    tag.setAttribute('data-bucket', key);
                    tag.setAttribute('data-tag', tags[key][i]);
                    $(document.body).on('click', '#' + tag.id, function(event) {
                        var bucket = this.getAttribute('data-bucket');
                        var tag = this.getAttribute('data-tag');

                        var elem = $('#peblSidebar').find('div[data-bucket="' + bucket + '"]').filter('div[data-tag="' + tag + '"]');
                        $('.peblSidebarTagList').scrollTop($('.peblSidebarTagList').scrollTop() + (elem.position().top - $('.peblSidebarTagList').position().top) - ($('.peblSidebarTagList').height()/2) + (elem.height()/2)  );
                        elem.click();
                    });

                    var tagText = document.createElement('span');
                    tagText.classList.add('cardTagText');
                    tagText.textContent = tags[key][i];

                    tag.appendChild(tagText);
                    tagWrapper.appendChild(tag);
                    tagContainer.appendChild(tagWrapper);
                }
                // tagContainer.appendChild(tagGroup);
            }
        });
        $('.contentContainer').append(tagContainer);
        //$('.contentContainer').prepend(showCardTagsButton);
        // if ($('.cardTagContainer').children().length > 0) {
        //     $('.showCardTagsButton').removeClass('hidden');
        //     toggleCardTags();  // Now turning on tags by default when they are present
        // }
    }
}

function toggleCardTags() {
    $('.showCardTagsButton').toggleClass('contracted');
    $('.showCardTagsButton').toggleClass('expanded');

    $('.cardTagContainer').toggleClass('contracted');
    $('.cardTagContainer').toggleClass('expanded');

    //iOS strikes again...
    setTimeout(function() {
        $('.contentContainer').attr('style', 'overflow: hidden !important');
        setTimeout(function() {
            $('.contentContainer').attr('style', 'overflow: auto !important');
        }, 10);
    }, 1000)
}

function createSidebar() {
    if ($('#peblSidebar')) {
        $('#peblSidebar').remove();
    }

    var allCatAttr = window.pageAllCategories;
    var categories = allCatAttr ? allCatAttr : window.pageCategories;
    
    if (categories) {
        if (categories['pebl_conversion_flags']) {
            delete categories['pebl_conversion_flags']; // We don't want this tag in the list
        }
        var sidebar = document.createElement('div');
        sidebar.id = 'peblSidebar';
        sidebar.classList.add('peblSidebar');

        var sidebarTagList = document.createElement('div');
        sidebarTagList.classList.add('peblSidebarTagList');

        sidebar.appendChild(createSidebarSearch());

        for (var i in categories) {
            for (var j = 0; j < categories[i].length; j++) {
                allTags.push(i + "|" + categories[i][j]);
            }
        }

        for (var i in categories) {
            if (categories[i].length > 0) {
                var header = document.createElement('div');
                header.classList.add('sidebarTagHeader');

                var headerText = document.createElement('span');
                headerText.classList.add('sidebarTagHeaderText');
                headerText.textContent = niceName(i);

                header.appendChild(headerText);

                var container = document.createElement('div');
                container.classList.add('sidebarTagContainer');

                for (var j = 0; j < categories[i].length; j++) {
                    var element = document.createElement('div');
                    element.classList.add('sidebarTagElement');
                    element.id = globalPebl.utils.getUuid();
                    $(document.body).on('click', '#' + element.id, function() {
                        filterPosts(this);
                    });
                    element.setAttribute('data-bucket', i);
                    element.setAttribute('data-tag', categories[i][j]);

                    var text = document.createElement('span');
                    text.classList.add('sidebarTagText');
                    text.textContent = categories[i][j];

                    var count = document.createElement('span');
                    count.classList.add('sidebarTagCount');

                    element.appendChild(text);
                    element.appendChild(count);
                    container.appendChild(element);
                }
                //TODO: Don't hard code this order
                if (i === "md_addiction" || i === "dei_competency") {
                    $(sidebarTagList).prepend($(container));
                    $(sidebarTagList).prepend($(header));
                } else {
                    sidebarTagList.appendChild(header);
                    sidebarTagList.appendChild(container);
                }
            }
        }

        sidebar.appendChild(sidebarTagList);

        var sidebarExpandButton = document.createElement('div');
        sidebarExpandButton.classList.add('peblSidebarExpandButton', 'contracted');
        $(document.body).on('click', '.peblSidebarExpandButton', function() {
            if (!tagCountSet) {
                $('.sidebarTagElement').each(function() {
                    var tag = $(this).attr('data-tag');
                    var bucket = $(this).attr('data-bucket');
                    var newFilterTags = filterTags.concat([bucket + "|" + tag]);
                    getTagCount($(this).children('.sidebarTagCount')[0], newFilterTags);
                });
                tagCountSet = true;
            }
            $('#peblSidebar').toggleClass('expanded');
            $(this).toggleClass('expanded');
            $(this).toggleClass('contracted');
        });

        var sidebarExtendedFrame = document.createElement('div');
        sidebarExtendedFrame.classList.add('peblSidebarExtendedFrame', 'contracted');

        var sidebarExtendedFrameCloseButton = document.createElement('i');
        sidebarExtendedFrameCloseButton.classList.add('fa', 'fa-times', 'peblSidebarExtendedFrameCloseButton');
        $(document.body).on('click', '.peblSidebarExtendedFrameCloseButton', closeSidebarExtendedFrame);

        sidebarExtendedFrame.appendChild(sidebarExtendedFrameCloseButton);

        $('.contentInnerFlexContainer').append(sidebarExtendedFrame);
        $('.contentInnerFlexContainer').append(sidebarExpandButton);
        $('.contentContainerWrapper').append(sidebar);
    }
}

function closeSidebarExtendedFrame() {
    $('.contentContainer').removeClass('contracted');
    $('.peblSidebarExtendedFrame').addClass('contracted');
    $('.peblSidebarSearchField').val('');
    resetTagFilter();
}

function resetTagFilter() {
    filterTags = [];
    $('.sidebarTagElement').each(function() {
        $(this).removeClass('active');
        var tag = $(this).attr('data-tag');
        var bucket = $(this).attr('data-bucket');
        var newFilterTags = filterTags.concat([bucket + "|" + tag]);
        getTagCount($(this).children('.sidebarTagCount')[0], newFilterTags);
    });
}

function createSidebarSearch() {
    var sidebarSearchContainer = document.createElement('div');
    sidebarSearchContainer.classList.add('peblSidebarSearchContainer');

    var sidebarSearchField = document.createElement('input');
    sidebarSearchField.classList.add('peblSidebarSearchField');
    sidebarSearchField.placeholder = 'Search your resources...';
    $(document.body).on('input', '.peblSidebarSearchField', function(event) {
        performSidebarSearch(event, this);
    });

    sidebarSearchContainer.appendChild(sidebarSearchField);

    return sidebarSearchContainer;
}

function performSidebarSearch(event, elem) {
    if (Fuse) {
        if (!searchableTOC) {
            generateSearchableTOC();
            return;
        }
        var input = $(elem).val();
        var options = {
            shouldSort: true,
            tokenize: true,
            findAllMatches: true,
            threshold: 0,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['title', 'content']
        }

        var fuse = new Fuse(searchableTOC, options);
        //No input, show everything
        if (input.length < 1) {
            var posts = {};
            globalPebl.utils.getToc(function(toc) {
                Object.keys(toc).forEach(function(section) {
                    Object.keys(toc[section]).sort(toc_sort).forEach(function(subsection) {
                        if (toc[section][subsection].tags != null && toc[section].Section != null) {
                            if (posts[toc[section].Section.prefix] == null)
                                posts[toc[section].Section.prefix] = {
                                    "title": toc[section].Section.title,
                                    "location": toc[section].Section.location,
                                    "posts": []
                                };
                            posts[toc[section].Section.prefix].posts.push({
                                "prefix": toc[section][subsection].prefix,
                                "post": toc[section][subsection].post
                            });
                            if (toc[section][subsection].skip == undefined) {
                                Object.keys(toc[section][subsection].pages).forEach(function(page) {
                                    if (posts[toc[section].Section.prefix].subPages == null) 
                                        posts[toc[section].Section.prefix].subPages = {
                                            "title": toc[section][subsection].title,
                                            "location": toc[section][subsection].location,
                                            "posts": []
                                        }
                                    if (posts[toc[section].Section.prefix].posts.length < 1)
                                        posts[toc[section].Section.prefix].posts.push({
                                            "prefix": toc[section][subsection].prefix,
                                            "post": toc[section][subsection].post
                                        });

                                    posts[toc[section].Section.prefix].subPages.posts.push({
                                        "prefix": toc[section][subsection].pages[page].prefix,
                                        "post": toc[section][subsection].pages[page].post
                                    });
                                });
                            }
                        }
                    });
                });
                displayFilteredTOC(posts);
            });
        } else {
            var result = fuse.search(input);
            var newResult = {};
            globalPebl.utils.getToc(function(toc) {
                Object.keys(toc).forEach(function(section) {
                    Object.keys(toc[section]).sort(toc_sort).forEach(function(subsection) {
                        for (var i = 0; i < result.length; i++) {
                            //Has subPages
                            if (result[i].parent) {
                                if (result[i].parent.location === toc[section][subsection].location) {
                                    if (toc[section][subsection].tags != null && toc[section].Section != null) {
                                        if (newResult[toc[section].Section.prefix] == null)
                                            newResult[toc[section].Section.prefix] = {
                                                "title": toc[section].Section.title,
                                                "location": toc[section].Section.location,
                                                "posts": []
                                            };
                                        if (newResult[toc[section].Section.prefix].subPages == null) 
                                            newResult[toc[section].Section.prefix].subPages = {
                                                "title": toc[section][subsection].title,
                                                "location": toc[section][subsection].location,
                                                "posts": []
                                            }
                                        if (newResult[toc[section].Section.prefix].posts.length < 1)
                                            newResult[toc[section].Section.prefix].posts.push({
                                                "prefix": toc[section][subsection].prefix,
                                                "post": toc[section][subsection].post
                                            });
                                        newResult[toc[section].Section.prefix].subPages.posts.push(result[i]);
                                    }
                                }
                            } else {
                                if (result[i].location === toc[section][subsection].location) {
                                    if (toc[section][subsection].tags != null && toc[section].Section != null) {
                                        if (newResult[toc[section].Section.prefix] == null)
                                            newResult[toc[section].Section.prefix] = {
                                                "title": toc[section].Section.title,
                                                "location": toc[section].Section.location,
                                                "posts": []
                                            };
                                        newResult[toc[section].Section.prefix].posts.push(result[i]);
                                    }
                                }
                            }
                        }
                    });
                });
                displayFilteredTOC(newResult);
            });
        }
    }
}

function generateSearchableTOC() {
    var result = [];
    globalPebl.utils.getToc(function(toc) {
        Object.keys(toc).forEach(function(key) {
            Object.keys(toc[key]).forEach(function(key2) {
                if (toc[key][key2].post)
                    result.push({
                        "title": toc[key][key2].post.title,
                        "content": toc[key][key2].post.content,
                        "location": toc[key][key2].location,
                        "prefix": toc[key][key2].prefix,
                        "post": toc[key][key2].post
                    });
                //Has subpages
                if (toc[key][key2].skip == undefined && toc[key][key2].pages) {
                    Object.keys(toc[key][key2].pages).forEach(function(page) {
                        result.push({
                            "title": toc[key][key2].pages[page].post.title,
                            "content": toc[key][key2].pages[page].post.content,
                            "location": toc[key][key2].pages[page].location,
                            "prefix": toc[key][key2].pages[page].prefix,
                            "post": toc[key][key2].pages[page].post,
                            "parent": {
                                "title": toc[key][key2].post.title,
                                "content": toc[key][key2].post.content,
                                "location": toc[key][key2].location,
                                "prefix": toc[key][key2].prefix,
                                "post": toc[key][key2].post
                            }
                        });
                    });
                }
            });
        });
        searchableTOC = result;
    });
}

function parseFilterTag(filterTag) {
    var arr = filterTag.split("|");
    return {
        bucket : arr[0],
        tag : arr[1]
    };
}

function filterPosts(elem) {
    var bucket = elem.getAttribute('data-bucket');
    var tag = elem.getAttribute('data-tag');
    if ($(elem).hasClass('active')) {
        $(elem).removeClass('active');
        filterTags.splice(filterTags.indexOf(bucket + "|" + tag), 1);
    } else {
        $(elem).addClass('active');
        filterTags.push(bucket + "|" + tag);
    }
    var posts = {};

    globalPebl.utils.getToc(function(toc) {
        Object.keys(toc).forEach(function(section) {
            Object.keys(toc[section]).sort(toc_sort).forEach(function(subsection) {
                if (toc[section][subsection].tags != null && toc[section].Section != null) {
                    //Show all of them
                    if (filterTags.length < 1) {
                        if (posts[toc[section].Section.prefix] == null)
                            posts[toc[section].Section.prefix] = {
                                "title": toc[section].Section.title,
                                "location": toc[section].Section.location,
                                "posts": []
                            };
                        posts[toc[section].Section.prefix].posts.push({
                            "prefix": toc[section][subsection].prefix,
                            "post": toc[section][subsection].post
                        });
                        if (toc[section][subsection].skip == undefined) {
                            Object.keys(toc[section][subsection].pages).forEach(function(page) {
                                if (posts[toc[section].Section.prefix].subPages == null) 
                                    posts[toc[section].Section.prefix].subPages = {
                                        "title": toc[section][subsection].title,
                                        "location": toc[section][subsection].location,
                                        "posts": []
                                    }
                                if (posts[toc[section].Section.prefix].posts.length < 1)
                                    posts[toc[section].Section.prefix].posts.push({
                                        "prefix": toc[section][subsection].prefix,
                                        "post": toc[section][subsection].post
                                    });

                                posts[toc[section].Section.prefix].subPages.posts.push({
                                    "prefix": toc[section][subsection].pages[page].prefix,
                                    "post": toc[section][subsection].pages[page].post
                                });
                            });
                        }
                    } else {
                        if (toc[section][subsection].skip == undefined && toc[section][subsection].pages) {
                            //Has subPages
                            Object.keys(toc[section][subsection].pages).forEach(function(page) {
                                for (var i = 0; i < filterTags.length; i++) {
                                    var thing = parseFilterTag(filterTags[i]);
                                    var bucket = thing.bucket;
                                    var tag = thing.tag;

                                    if (toc[section][subsection].pages[page].tags[bucket].indexOf(tag) == -1)
                                            break;
                                    else if (i == filterTags.length - 1) {
                                        if (posts[toc[section].Section.prefix] == null)
                                            posts[toc[section].Section.prefix] = {
                                                "title": toc[section].Section.title,
                                                "location": toc[section].Section.location,
                                                "posts": []
                                            };
                                        if (posts[toc[section].Section.prefix].subPages == null) 
                                            posts[toc[section].Section.prefix].subPages = {
                                                "title": toc[section][subsection].title,
                                                "location": toc[section][subsection].location,
                                                "posts": []
                                            }
                                        if (posts[toc[section].Section.prefix].posts.length < 1)
                                            posts[toc[section].Section.prefix].posts.push({
                                                "prefix": toc[section][subsection].prefix,
                                                "post": toc[section][subsection].post
                                            });
                                        posts[toc[section].Section.prefix].subPages.posts.push({
                                            "prefix": toc[section][subsection].pages[page].prefix,
                                            "post": toc[section][subsection].pages[page].post
                                        });
                                    }
                                }
                            });
                        } else {
                            for (var i = 0; i < filterTags.length; i++) {
                                var thing = parseFilterTag(filterTags[i]);
                                var bucket = thing.bucket;
                                var tag = thing.tag;

                                //Just a subsection
                                if (toc[section][subsection].skip != undefined) {
                                    if (toc[section][subsection].tags[bucket] != null) {
                                        if (toc[section][subsection].tags[bucket].indexOf(tag) == -1)
                                            break;
                                        else if (i == filterTags.length - 1) {
                                            if (posts[toc[section].Section.prefix] == null)
                                                posts[toc[section].Section.prefix] = {
                                                    "title": toc[section].Section.title,
                                                    "location": toc[section].Section.location,
                                                    "posts": []
                                                };
                                            posts[toc[section].Section.prefix].posts.push({
                                                "prefix": toc[section][subsection].prefix,
                                                "post": toc[section][subsection].post
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
        displayFilteredTOC(posts);
        //Update the tag counts
        $('.sidebarTagElement').each(function() {
            var tag = $(this).attr('data-tag');
            var bucket = $(this).attr('data-bucket');
            var newFilterTags = filterTags.concat([bucket + "|" + tag]);
            getTagCount($(this).children('.sidebarTagCount')[0], newFilterTags);
        });
    });
}

function displayFilteredTOC(posts) {
    $('.peblSidebarExtendedFrame').children(':not(.peblSidebarExtendedFrameCloseButton)').remove();
    Object.keys(posts).forEach(function(key) {
        var tocSectionTitle = document.createElement('div');
        tocSectionTitle.classList.add('tocSectionTitle');

        var tocSectionPrefix = document.createElement('div');
        tocSectionPrefix.classList.add('tocSectionPrefix');

        var tocSectionPrefixText = document.createElement('a');
        tocSectionPrefixText.classList.add('tocSectionPrefixText');
        tocSectionPrefixText.textContent = key;
        tocSectionPrefixText.href = posts[key].location;

        tocSectionPrefix.appendChild(tocSectionPrefixText);

        var tocSectionTitleTextWrapper = document.createElement('div');
        tocSectionTitleTextWrapper.classList.add('tocSectionTitleTextWrapper');

        var tocSectionTitleText = document.createElement('a');
        tocSectionTitleText.classList.add('tocSectionTitleText');
        tocSectionTitleText.textContent = posts[key].title;
        tocSectionTitleText.href = posts[key].location;

        tocSectionTitleTextWrapper.appendChild(tocSectionTitleText);

        tocSectionTitle.appendChild(tocSectionPrefix);
        tocSectionTitle.appendChild(tocSectionTitleTextWrapper);

        $('.peblSidebarExtendedFrame')[0].appendChild(tocSectionTitle);

        for (var i = 0; i < posts[key].posts.length; i++) {
            var tocSubsectionTitle = document.createElement('div');
            tocSubsectionTitle.classList.add('tocSubsectionTitle');

            var tocSubsectionPrefix = document.createElement('div');
            tocSubsectionPrefix.classList.add('tocSubsectionPrefix');

            var tocSubsectionPrefixText = document.createElement('span');
            tocSubsectionPrefixText.classList.add('tocSubsectionPrefixText');
            tocSubsectionPrefixText.textContent = posts[key].posts[i].prefix;

            var tocSubsectionTitleTextWrapper = document.createElement('div');
            tocSubsectionTitleTextWrapper.classList.add('tocSubsectionTitleTextWrapper');

            var tocSubsectionTitleText = document.createElement('a');
            tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
            tocSubsectionTitleText.href = posts[key].posts[i].post.filename;
            tocSubsectionTitleText.textContent = posts[key].posts[i].post.title;

            tocSubsectionPrefix.appendChild(tocSubsectionPrefixText);
            tocSubsectionTitleTextWrapper.appendChild(tocSubsectionTitleText);

            tocSubsectionTitle.appendChild(tocSubsectionPrefix);
            tocSubsectionTitle.appendChild(tocSubsectionTitleTextWrapper);

            $('.peblSidebarExtendedFrame')[0].appendChild(tocSubsectionTitle);
            //Display the subPages
            if (posts[key].subPages != null && posts[key].posts[i].post.title === posts[key].subPages.title) {
                for (var j = 0; j < posts[key].subPages.posts.length; j++) {
                    var tocPage = document.createElement('div');
                    tocPage.classList.add('tocPage', 'header');

                    var tocPagePrefixWrapper = document.createElement('div');
                    tocPagePrefixWrapper.classList.add('tocPagePrefixWrapper');

                    var tocPagePrefix = document.createElement('a');
                    tocPagePrefix.classList.add('tocPagePrefix');
                    tocPagePrefix.href = posts[key].subPages.posts[j].post.filename;
                    tocPagePrefix.textContent = posts[key].subPages.posts[j].prefix;

                    var tocPageTextWrapper = document.createElement('div');
                    tocPageTextWrapper.classList.add('tocPageTextWrapperWide');

                    var tocPageText = document.createElement('a');
                    tocPageText.classList.add('tocPageText');
                    tocPageText.href = posts[key].subPages.posts[j].post.filename;
                    tocPageText.textContent = posts[key].subPages.posts[j].post.title;
                    tocPageText.addEventListener('click', function() {
                        handleTocPageTextClick(event, this);
                    });

                    tocPagePrefixWrapper.appendChild(tocPagePrefix);
                    tocPageTextWrapper.appendChild(tocPageText);

                    tocPage.appendChild(tocPagePrefixWrapper);
                    tocPage.appendChild(tocPageTextWrapper);

                    $('.peblSidebarExtendedFrame')[0].appendChild(tocPage);
                }
            }
        }
    });

    $('.contentContainer').addClass('contracted');
    $('.peblSidebarExtendedFrame').removeClass('contracted');
}

function getTagCount(elem, tagArr) {
    if (!globalPebl)
        return setTimeout(function() {
            getTagCount(elem, tagArr);
        }, 1000);
    var counter = new Set();
    globalPebl.utils.getToc(function(toc) {
        if (Object.keys(toc).length < 1)
            return setTimeout(function() {
                getTagCount(elem, tagArr);
            }, 1000);
        Object.keys(toc).forEach(function(section) {
            Object.keys(toc[section]).forEach(function(subsection) {
                if (toc[section][subsection].skip == undefined && toc[section][subsection].pages) {
                    //Has subPages
                    Object.keys(toc[section][subsection].pages).forEach(function(page) {
                        for (var i = 0; i < tagArr.length; i++) {
                            var thing = parseFilterTag(tagArr[i]);
                            var bucket = thing.bucket;
                            var tag = thing.tag;

                            if (toc[section][subsection].pages[page].tags[bucket].indexOf(tag) == -1)
                                    break;
                            else if (i == tagArr.length - 1) {
                                counter.add(toc[section][subsection].pages[page].location);
                            }
                        }
                    });
                } else {
                    for (var i = 0; i < tagArr.length; i++) {
                        var thing = parseFilterTag(tagArr[i]);
                        var bucket = thing.bucket;
                        var tag = thing.tag;
                        //Just a subsection
                        if (toc[section][subsection].skip != undefined) {
                            if (toc[section][subsection].tags != null && toc[section][subsection].tags[bucket] != null) {
                                if (toc[section][subsection].tags[bucket].indexOf(tag) == -1)
                                    break;
                                else if (i == tagArr.length - 1) {
                                    counter.add(toc[section][subsection].location);
                                }
                            }
                        }
                    }
                }
            });
        });
        elem.textContent = '(' + counter.size + ')';
        //Hide tags if they don't have any resources associated with them
        if (counter.size == 0)
            $(elem).parent().hide();
        else
            $(elem).parent().show();
    });
}

function attachAddedResources() {
    document.getElementsByClassName('contentFlexContainer')[0].appendChild(createFooterAddedResourcesButton());
}

function createFooterFindButton() {
    var findButtonContainer = document.createElement('div');
    findButtonContainer.classList.add('findButtonContainer');
    findButtonContainer.id = 'findButtonContainer';

    var findButton = document.createElement('button');
    findButton.id = 'findButton';
    findButton.classList.add('findButton');
    $(document.body).on('click', '#findButton', handleFindButtonClick);

    var findButtonIcon = document.createElement('i');
    findButtonIcon.classList.add('fa', 'fa-search', 'footerIcon');

    findButton.appendChild(findButtonIcon);

    var findButtonTextContainer = document.createElement('div');

    var findButtonText = document.createElement('span');
    findButtonText.textContent = 'Knowledge Network';  // Recently changed from "Find Resources"

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
    discussButton.id = $('body')[0].baseURI.split('/').pop().slice(0, -6) + '_Discussion';
    discussButton.classList.add('discussButton');

    var discussPrompt = document.createElement('p');
    discussPrompt.textContent = $('h1.title').text() + ' Discussion';
    discussPrompt.style.display = 'none';

    var discussIcon = document.createElement('i');
    discussIcon.classList.add('fa', 'fa-comments', 'footerIcon');

    discussButtonContainer.appendChild(discussPrompt);

    discussButton.appendChild(discussIcon);

    var discussButtonTextContainer = document.createElement('div');

    var discussButtonText = document.createElement('span');
    discussButtonText.textContent = 'Discuss';

    var discussCount = document.createElement('span');
    discussCount.id = 'discussCounter';

    discussButtonTextContainer.appendChild(discussButtonText);

    discussButton.appendChild(discussButtonTextContainer);
    discussButton.appendChild(discussCount);

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
    $(document.body).on('click', '#addedResourcesButton', handleAddedResourcesButtonClick);

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
    notesButton.id = $('body')[0].baseURI.split('/').pop().slice(0, -6) + '_Notes';
    notesButton.setAttribute('data-sharing', 'private');
    notesButton.classList.add('notesButton');

    var notesPrompt = document.createElement('p');
    notesPrompt.textContent = $('h1.title').text() + ' Notes';
    notesPrompt.style.display = 'none';

    var notesIcon = document.createElement('i');
    notesIcon.classList.add('fa', 'fa-sticky-note', 'footerIcon');

    notesButton.appendChild(notesIcon);

    var notesTextContainer = document.createElement('div');

    var notesText = document.createElement('span');
    notesText.textContent = 'My Notes';      // Recently changed from "Notes"

    var notesCount = document.createElement('span');
    notesCount.id = "notesCounter";

    notesTextContainer.appendChild(notesText);

    notesButton.appendChild(notesTextContainer);
    notesButton.appendChild(notesCount);

    notesButtonContainer.appendChild(notesPrompt);

    notesButtonContainer.appendChild(notesButton);

    return notesButtonContainer;
}

function createExpandButton() {
    var expandButtonContainerUnderlay = document.createElement('div');
    expandButtonContainerUnderlay.classList.add('expandButtonContainerUnderlay');

    var expandButtonContainer = document.createElement('div');
    expandButtonContainer.id = 'expandButtonContainer';
    expandButtonContainer.classList.add('expandButtonContainer');

    var expandButton = document.createElement('i');
    expandButton.id = 'expandButton';
    expandButton.classList.add('expandButton', 'fa', 'fa-bars');

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
    return closeButton;
}

function createHelpButton() {
    var helpButtonContainer = document.createElement('div');
    helpButtonContainer.id = 'helpButtonContainer';
    helpButtonContainer.classList.add('helpButtonContainer');

    var helpButton = document.createElement('i');
    helpButton.id = 'helpButton';
    helpButton.classList.add('helpButton', 'fa', 'fa-question-circle');
    helpButtonContainer.appendChild(helpButton);

    return helpButtonContainer;
}

function createFeedbackButton() {
    var feedbackButtonContainer = document.createElement('div');
    feedbackButtonContainer.id = 'feedbackButtonContainer';
    feedbackButtonContainer.classList.add('feedbackButtonContainer');

    var feedbackButton = document.createElement('i');
    feedbackButton.id = 'feedbackButton';
    feedbackButton.classList.add('feedbackButton', 'fa', 'fa-share-square');
    feedbackButtonContainer.appendChild(feedbackButton);

    return feedbackButtonContainer;
}

function createNotificationButton() {
    var peblNotificationButtonContainer = document.createElement('div');
    peblNotificationButtonContainer.id = 'peblNotificationButtonContainer';
    peblNotificationButtonContainer.classList.add('peblNotificationButtonContainer');

    var peblNotificationButton = document.createElement('i');
    peblNotificationButton.id = 'peblNotificationButton';
    peblNotificationButton.classList.add('fa', 'fa-bell', 'peblNotificationButton');
    peblNotificationButton.setAttribute('aria-hidden', 'true');
    $(document.body).on('click', '#peblNotificationButton', handleNotificationButtonClick);

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
    $(document.body).on('click', '#askButtonContainer', handleAskButtonClick);

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
    $(document.body).on('click', '#searchButtonContainer', handleRegistryButtonClick);

    var searchButton = document.createElement('i');
    searchButton.id = 'searchButton';
    searchButton.classList.add('searchButton', 'fa', 'fa-search');
    searchButtonContainer.appendChild(searchButton);

    var searchButtonLabel = document.createElement('div');
    searchButtonLabel.classList.add('searchButtonLabel');
    searchButtonLabel.id = 'searchButtonLabel';
    searchButtonLabel.textContent = 'Knowledge Network';     // Recently changed from "Search Network"
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
    $(document.body).on('click', '#tocButtonContainer', handleTOCButtonClick);

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
    $('.notificationsWrapper').remove();
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
    // if (typeof pebl !== 'undefined' && pebl.userManager.isLoggedIn === true) {
    //     $('#accountName').text(pebl.userManager.profile.name);
    // }
}

//Tutorial

function createUITutorial() {
    //Create tutorial elements
    if (overlayIsExtended) {
        retractOverlay();
        hideToolbar();
    }

    var tutorialMessageContainer = document.createElement('div');
    tutorialMessageContainer.id = 'tutorialMessageContainer';
    tutorialMessageContainer.classList.add('tutorialMessageContainer');
    tutorialMessageContainer.setAttribute('Stage', '1');

    var tutorialMessage = document.createElement('p');
    tutorialMessage.id = 'tutorialMessage';
    tutorialMessage.classList.add('tutorialMessage');
    tutorialMessage.textContent = 'Because you are a first time user, you will now receive a short tour of PeBL eBook features, starting with this Menu button. This button displays the PeBL toolbar. Most of the functionality is located here.';
    tutorialMessageContainer.appendChild(tutorialMessage);

    var tutorialMessageCancelButon = document.createElement('label');
    tutorialMessageCancelButon.id = 'tutorialMessageCancelButton';
    tutorialMessageCancelButon.classList.add('tutorialMessageCancelButton');
    tutorialMessageCancelButon.textContent = 'Cancel';
    
    tutorialMessageContainer.appendChild(tutorialMessageCancelButon);

    var tutorialMessageNextButton = document.createElement('label');
    tutorialMessageNextButton.id = 'tutorialMessageNextButton';
    tutorialMessageNextButton.classList.add('tutorialMessageNextButton');
    tutorialMessageNextButton.textContent = 'Next';
    tutorialMessageContainer.appendChild(tutorialMessageNextButton);
    

    var tutorialMessageArrow = document.createElement('div');
    tutorialMessageArrow.id = 'tutorialMessageArrow';
    tutorialMessageArrow.classList.add('tutorialMessageArrow');

    tutorialMessageContainer.appendChild(tutorialMessageArrow);
    document.getElementById('peblOverlay').appendChild(tutorialMessageContainer);

}

function nextTutorialStage() {
    var currentStage = $('#tutorialMessageContainer').attr('Stage');
    if (currentStage === '1') {
        localStorage.setItem('tutorialStatus', 'Complete');
        handleExpandButtonClick();
        setTimeout(function() {
            $('#tutorialMessageContainer').animate({
                left: $('#tocButtonContainer').offset().left
            }, 500);

            $('#tutorialMessageArrow').animate({
                marginLeft: '50px'
            }, 500);

            $('#tutorialMessage').text('The Table of Contents allows you to view and navigate to all major sections of your eFieldbook.');
            $('#tutorialMessageContainer').attr('Stage', '2');
        }, 500);
    } else if (currentStage === '2') {
        $('#tutorialMessageContainer').animate({
            left: $('#searchButtonContainer').offset().left
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '50px'
        }, 500);

        $('#tutorialMessage').text('The Knowledge Network feature allows you to find the information you need quickly and easily, from a wide variety of Extension sources.');
        $('#tutorialMessageContainer').attr('Stage', '3');
    } else if (currentStage === '3') {
        $('#tutorialMessageContainer').animate({
            left: $('#askButtonContainer').offset().left - 150
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '175px'
        }, 500);

        $('#tutorialMessage').text('The Ask an Expert feature allows you to get in contact with an Extension expert in one of many fields.');
        $('#tutorialMessageContainer').attr('Stage', '4');
    } else if (currentStage === '4') {
        $('#tutorialMessageContainer').animate({
            left: ($('#feedbackButtonContainer').offset().left - ($('#feedbackButtonContainer').width() / 2)) - 150
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '175px'
        }, 500);

        $('#tutorialMessage').text('Click this Feedback button at any time to send an email with your feedback');

        $('#tutorialMessageContainer').attr('Stage', '5');
    } else if (currentStage === '5') {
        $('#tutorialMessageContainer').animate({
            left: ($('#helpButtonContainer').offset().left - ($('#helpButtonContainer').width() / 2)) - 150
        }, 500);

        $('#tutorialMessageArrow').animate({
            marginLeft: '175px'
        }, 500);

        $('#tutorialMessage').text('Click this Help button at any time you would like to review this eFieldbook feature tour.');
        //Skip the sidebar section if it doesn't exist
        if ($('.peblSidebar').length < 1) {
            $('#tutorialMessageContainer').attr('Stage', '7');
        } else {
            $('#tutorialMessageContainer').attr('Stage', '6');
        }
    } else if (currentStage === '6') {
        $('.peblSidebarExpandButton').click();
        setTimeout(function() {
            $('#tutorialMessageContainer').animate({
                left: $('.peblSidebarExpandButton').offset().left - 260,
                top: $('.peblSidebarExpandButton').offset().top + ($('.peblSidebarExpandButton').height() / 2) - $('#tutorialMessageContainer').offset().top + 7
            }, 500);

            $('#tutorialMessageArrow').css({
                marginLeft: '0',
                right: '-20px',
                top: '50%',
                left: 'unset',
                "border-bottom": '10px solid transparent',
                "border-top": '10px solid transparent',
                "border-left": '10px solid rgb(7, 126, 188)'
            });

            $('#tutorialMessage').text('The Category Filters feature allows you to build and refine filtered lists of eFieldbook resources using descriptive tags.');
            $('#tutorialMessageContainer').attr('Stage', '7');
        }, 500)
    } else if (currentStage === '7') {
        $('.peblSidebarExpandButton').click();
        var offset = ($('#findButton').width() - $('#tutorialMessageContainer').width()) / 2;
        if (offset < 0)
            offset = 0;
        $('#tutorialMessageContainer').animate({
            left: $('#findButton').offset().left + offset,
            top: $('#findButton').offset().top - ($('#tutorialMessageContainer').height() + 20)
        }, 500);

        $('#tutorialMessageArrow').css({
            right: '50%',
            left: 'unset',
            bottom: '-10px',
            top: 'unset',
            "border-top": '10px solid rgb(7, 126, 188)',
            "border-left": '10px solid transparent',
            "border-right": '10px solid transparent',
            "border-bottom": '0',
            "margin-top": '0'
        });

        $('#tutorialMessage').text('This option will launch a search of Knowledge Network resources that is in context to the current page.');
        $('#tutorialMessageContainer').attr('Stage', '8');
    } else if (currentStage === '8') {
        var offset = ($('.discussButton').width() - $('#tutorialMessageContainer').width()) / 2;
        if (offset < 0)
            offset = 0;
        $('#tutorialMessageContainer').animate({
            left: $('.discussButton').offset().left + offset
        }, 500);

        $('#tutorialMessage').text('The Discuss feature provides a place for PeBL eBook users to share feedback and insights in context to the current page.');
        $('#tutorialMessageContainer').attr('Stage', '9');
    } else if (currentStage === '9') {
        var offset = ($('.notesButton').width() - $('#tutorialMessageContainer').width());
        if (offset > 0 && $('.notesButton').width() < $('#tutorialMessageContainer').width())
            offset = 0;
        else if (offset > 0)
            offset = offset / 2;
        $('#tutorialMessageContainer').animate({
            left: $('.notesButton').offset().left + offset
        }, 500);

        if (offset < 0)
            $('#tutorialMessageArrow').animate({
                'margin-right': offset
            }, 500);


        $('#tutorialMessage').text('The My Notes feature lets you collect private notations relative to the current page.');

        $('#tutorialMessageNextButton').text('Got it');
        $('#tutorialMessageContainer').attr('Stage', 'End');
    }
    
    else if (currentStage === 'End') {
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

    var notificationsWrapper = document.createElement('div');
    notificationsWrapper.classList.add('notificationsWrapper');

    var notificationsClearButton = document.createElement('div');
    notificationsClearButton.classList.add('notificationsClearButton');
    $(document.body).on('click', '.notificationsClearButton', function() {
        $('#notificationsContainer').children('div').each(function() {
            globalPebl.utils.removeNotification($(this).attr('notification-id'));
        });
        clearNotifications();
    });

    var notificationsClearText = document.createElement('span');
    notificationsClearText.classList.add('notificationsClearText');
    notificationsClearText.textContent = 'Clear Notifications';

    notificationsClearButton.appendChild(notificationsClearText);
    
    globalPebl.user.getUser(function(userProfile) {
        globalPebl.utils.getNotifications(function(notifications) {
            if (notifications.length === 0)
                return;

            for (var notification of notifications) {
                var pulled;
                if (notification.identity === userProfile.identity) {
                    pulled = true;
                } else {
                    pulled = false;
                }
                var notificationElementWrapper = document.createElement('div');
                notificationElementWrapper.classList.add('notificationElementWrapper');
                notificationElementWrapper.setAttribute('url', notification.url);
                notificationElementWrapper.setAttribute('docType', notification.docType);
                notificationElementWrapper.setAttribute('externalURL', notification.externalURL);
                notificationElementWrapper.setAttribute('title', notification.name);
                notificationElementWrapper.setAttribute('destination', notification.card);
                notificationElementWrapper.setAttribute('notification-id', notification.id);

                var notificationElement = document.createElement('p');
                notificationElement.classList.add('notificationElement');

                var notificationElementSenderText = document.createElement('span');
                notificationElementSenderText.classList.add('notificationElementSenderText');
                if (pulled)
                    notificationElementSenderText.textContent = 'You added ';
                else
                    notificationElementSenderText.textContent = notification.actor.name + ' shared ';

                var notificationElementContentText = document.createElement('span');
                notificationElementContentText.classList.add('notificationElementContentText');
                notificationElementContentText.textContent = notification.name;

                var toSpan = document.createElement('span');
                toSpan.textContent = ' to ';

                var notificationElementLocationText = document.createElement('a');
                notificationElementLocationText.classList.add('notificationElementLocationText');
                notificationElementLocationText.textContent = niceName(notification.book.replace('.epub', ''));

                notificationElement.appendChild(notificationElementSenderText);
                notificationElement.appendChild(notificationElementContentText);
                notificationElement.appendChild(toSpan);
                notificationElement.appendChild(notificationElementLocationText);

                notificationElementWrapper.appendChild(notificationElement);
                notificationsContainer.appendChild(notificationElementWrapper);
            }

            notificationsWrapper.appendChild(notificationsContainer);
            notificationsWrapper.appendChild(notificationsClearButton);

            document.getElementById('peblNotificationButtonContainer').appendChild(notificationsWrapper);
        });
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
    askFrame.src = overlay.getAskFrameSrc();        
    wrapper.appendChild(askFrame);
    askContainer.appendChild(wrapper);
    document.getElementById('peblOverlay').appendChild(askContainer);
    askContainer.appendChild(createOverlayCloseButton());
}



function createRegistrySearch() {
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6);
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
            //Script on registry page would login as that user
        }
    }, 500);
}

function createTOC() {
    clearUI();

    globalPebl.utils.getToc(function(obj) {
        var tocObject = obj;

        var tocContainer = document.createElement('div');
        tocContainer.id = 'tocContainer';
        tocContainer.classList.add('tocContainer');

        Object.keys(tocObject).forEach(function(sectionKey) {
            if (!tocObject[sectionKey].Section) {
                return;
            }
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
                        tocSubsectionTitleText.innerHTML = tocObject[sectionKey][pageKey].title;
                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
                    } else {
                        var tocSubsectionTitleText = document.createElement('a');
                        tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
                        tocSubsectionTitleText.innerHTML = tocObject[sectionKey][pageKey].title;
                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
                    }
                    

                    tocSubsectionTitleTextWrapper.appendChild(tocSubsectionTitleText);
                    tocSubsectionTitle.appendChild(tocSubsectionPrefix);
                    tocSubsectionTitle.appendChild(tocSubsectionTitleTextWrapper);
                    tocSection.appendChild(tocSubsectionTitle);

                    //Add Dynamic content associated with a subsection
                    var cardMatch = tocObject[sectionKey][pageKey].prefix;
                    Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
                        if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
                            var tocPage = document.createElement('div');
                            tocPage.classList.add('tocPage');
                            tocPage.id = dynamicKey;

                            var tocPageIconWrapper = document.createElement('div');
                            tocPageIconWrapper.classList.add('tocPageIconWrapper');

                            var tocPageIcon = document.createElement('i');
                            tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-link');

                            tocPageIconWrapper.appendChild(tocPageIcon);

                            var tocPageTextWrapper = document.createElement('div');
                            tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                            var tocPageText = document.createElement('a');
                            tocPageText.id = globalPebl.utils.getUuid();
                            tocPageText.classList.add('tocPageText');
                            tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
                            tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                            tocPageText.setAttribute('slide', dynamicKey);
                            tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                            tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                            tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                            tocPageText.href = tocObject[sectionKey][pageKey].location;
                            tocPageText.setAttribute('tocLink', 'true');
                            $(document.body).on('click', '#' + tocPageText.id, function() {
                                handleTocPageTextClick(event, this);
                            });

                            tocPageTextWrapper.appendChild(tocPageText);

                            var tocPageDeleteButtonWrapper = document.createElement('div');
                            tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                            var tocPageDeleteButton = document.createElement('i');
                            tocPageDeleteButton.classList.add('tocPageDeleteButton', 'fa', 'fa-trash-alt');
                            tocPageDeleteButton.setAttribute('aria-hidden', 'true');
                            tocPageDeleteButton.setAttribute('section-id', sectionKey);
                            tocPageDeleteButton.setAttribute('document-id', dynamicKey);

                            tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                            tocPage.appendChild(tocPageIconWrapper);
                            tocPage.appendChild(tocPageTextWrapper);
                            tocPage.appendChild(tocPageDeleteButtonWrapper);
                            tocSection.appendChild(tocPage);
                        }
                    });


                    Object.keys(tocObject[sectionKey][pageKey].pages).sort(toc_sort).forEach(function(cardKey) {
                        
                        if (tocObject[sectionKey][pageKey].skip !== undefined) {
                            
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
                            tocPageText.id = globalPebl.utils.getUuid();
                            tocPageText.classList.add('tocPageText');
                            tocPageText.innerHTML = tocObject[sectionKey][pageKey].pages[cardKey].title;
                            tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
                            $(document.body).on('click', '#' + tocPageText.id, function() {
                                handleTocPageTextClick(event, this);
                            });

                            tocPageTextWrapper.appendChild(tocPageText);

                            tocPage.appendChild(tocPageTextWrapper);
                            tocSection.appendChild(tocPage);

                            var cardMatch = tocObject[sectionKey][pageKey].pages[cardKey].prefix;
                            //Add any dynamic documents associated with subpages
                            Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
                                if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
                                    var tocPage = document.createElement('div');
                                    tocPage.classList.add('tocPage');
                                    tocPage.id = dynamicKey;

                                    var tocPageIconWrapper = document.createElement('div');
                                    tocPageIconWrapper.classList.add('tocPageIconWrapper');

                                    var tocPageIcon = document.createElement('i');
                                    tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-link');

                                    tocPageIconWrapper.appendChild(tocPageIcon);

                                    var tocPageTextWrapper = document.createElement('div');
                                    tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                                    var tocPageText = document.createElement('a');
                                    tocPageText.id = globalPebl.utils.getUuid();
                                    tocPageText.classList.add('tocPageText');
                                    tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
                                    tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                                    tocPageText.setAttribute('slide', dynamicKey);
                                    tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                                    tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                                    tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                                    tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
                                    tocPageText.setAttribute('tocLink', 'true');
                                    $(document.body).on('click', '#' + tocPageText.id, function() {
                                        handleTocPageTextClick(event, this);
                                    });

                                    tocPageTextWrapper.appendChild(tocPageText);

                                    var tocPageDeleteButtonWrapper = document.createElement('div');
                                    tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                                    var tocPageDeleteButton = document.createElement('i');
                                    tocPageDeleteButton.classList.add('tocPageDeleteButton', 'fa', 'fa-trash-alt');
                                    tocPageDeleteButton.setAttribute('aria-hidden', 'true');
                                    tocPageDeleteButton.setAttribute('section-id', sectionKey);
                                    tocPageDeleteButton.setAttribute('document-id', dynamicKey);

                                    tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                                    tocPage.appendChild(tocPageIconWrapper);
                                    tocPage.appendChild(tocPageTextWrapper);
                                    tocPage.appendChild(tocPageDeleteButtonWrapper);
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
        document.getElementById('peblOverlay').appendChild(createOverlayCloseButton());
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
    var dynamicPageHeader = document.createElement('div');
    dynamicPageHeader.id = 'dynamicPageHeader';
    dynamicPageHeader.classList.add('dynamicPageHeader');

    var dynamicPageHeaderLink = document.createElement('a');
    dynamicPageHeaderLink.id = 'dynamicPageHeaderLink';
    dynamicPageHeaderLink.classList.add('dynamicPageHeaderLink');
    dynamicPageHeaderLink.href = externalURL;
    dynamicPageHeaderLink.innerHTML = externalURL;
    $(document.body).on('click', '#dynamicPageHeaderLink', function() {
        handleDynamicPageHeaderLinkClick(event, this);
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
        dynamicPageFrame.src = externalURL.replace('http://', 'https://');
    } else if (docType === 'pdf') {
        // dynamicPageFrame.src = 'pdfjs-1.8.188-dist/web/viewer.html';
        // dynamicPageFrame.onload = function() {
        //  var frame = top.frames[0].document.getElementById('dynamicPageFrame');
        //  frame.contentWindow.PDFViewerApplication.open(arrayBuffer);
        // }
        dynamicPageFrame.src = 'https://docs.google.com/gview?url=' + externalURL + '&embedded=true';
    }

    dynamicPage.appendChild(dynamicPageWrapper);
    document.body.appendChild(dynamicPageHeader);
    document.body.appendChild(dynamicPage);
    document.body.appendChild(dynamicPageCloseButton);
}

function createOverlayCloseButton() {
    var overlayCloseButton = document.createElement('i');
    overlayCloseButton.id = 'overlayCloseButton';
    overlayCloseButton.classList.add('overlayCloseButton', 'fa', 'fa-times');
    $(document.body).on('click', '#overlayCloseButton', handleOverlayCloseButtonClick);

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
    $('.contentContainer').removeClass('contractedVertical');
    $('.peblSidebarExtendedFrame').removeClass('contractedVertical');
    $('.contentInnerFlexContainer').removeClass('contractedVertical');
    $('.addedResourcesButtonContainer').removeClass('expanded');
    $('#addedResourcesContainer').remove();
    $('.addedResourcesButton').children('span').first().text('View');
}

function showAddedResources() {
    $('.contentContainer').addClass('contractedVertical');
    $('.peblSidebarExtendedFrame').addClass('contractedVertical');
    $('.contentInnerFlexContainer').addClass('contractedVertical');
    $('.addedResourcesButtonContainer').addClass('expanded');
    $('.addedResourcesButton').children('span').first().text('Hide');
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
    if ($('.notificationsWrapper').length) {
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
    localStorage.setItem('tutorialStatus', 'Incomplete');
    displayUITutorial();
}

function handleFeedbackButtonClick() {
    location.href = "mailto:impact-collaborative@extension.org?subject=Feedback%20for%20" + embeddedBookName;
}

function handleAskButtonClick() {
    expandOverlay();
    createAskExpert();
    document.getElementById('askButton').classList.add('active');
    document.getElementById('askButtonLabel').classList.add('active');
}

function handleRegistryButtonClick() {
    frameIsReady = false;
    // if (currentSection) {
        expandOverlay();
        createRegistrySearch();
        document.getElementById('searchButton').classList.add('active');
        document.getElementById('searchButtonLabel').classList.add('active');
    // } else {
    //     setTimeout(handleRegistryButtonClick, 1000);
    // }
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
    handleExpandButtonClick();
    handleRegistryButtonClick();

    var keywords = [];
    if (window.pageMetadata && window.pageMetadata["_seopress_analysis_target_kw"]) {
        keywords = window.pageMetadata["_seopress_analysis_target_kw"].split(',');
    } else if ($('#fake-page')[0].hasAttribute('keywords')) {
        keywords = $('#fake-page').attr('keywords').split(',');
    }

    var waitingForReady = setInterval(function() {
        if (frameIsReady) {
            console.log('frame is ready');
            clearInterval(waitingForReady);
            var iframe = document.getElementById('registryFrame');
            var obj = {
                "messageType": "Find",
                "findType": ["Resources"],
                "searchTerms": keywords
            }
            var message = JSON.stringify(obj);
            iframe.contentWindow.postMessage(message, '*');
        }
    }, 500);
    //$('#findMenuContainer').removeClass('hidden');
}

function handleDiscussButtonClick() {
    $('#discussionLightbox').remove();
    var currentBook = globalPebl.activityManager.currentBook;
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6);
    var discussionId;
    var discussionTitle;

    if ($('#dynamicPage').length) {
        var currentDynamicPage = $('#dynamicPage').attr('resource-id');
        discussionId = currentDynamicPage;

        var title = $('#dynamicPage').attr('title');
        discussionTitle = 'Added Resource - ' + title + ' Discussion';

    } else {
        discussionId = currentPage;
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
    $(lightBoxContent).append('<i class="fa fa-times discussionCloseButton" onclick="closeLightBox();"></i>')
    lightBoxContent.appendChild(questionBox);

    var chatResponses = $('<div class="chatResponses" style="display:none;"><div id="discussionSpanContainer" style="text-align: center; margin-top: 10px; margin-bottom: 10px; display: none;"><span class="discussionSpan">No one has replied to this discussion yet.</span></div></div>');
    var chatInput = $('<div class="chatInput" style="display:none;"><textarea id="discussTextArea" placeholder="Participate in the discussion."></textarea><button class="chatSubmit">Submit</button></div>');
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
    var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6);
    var discussionId;
    var discussionTitle;

    if ($('#dynamicPage').length) {
        var currentDynamicPage = $('#dynamicPage').attr('resource-id');
        discussionId = currentDynamicPage + '_' + globalPebl.userManager.profile.name + '_Notes';

        var title = $('#dynamicPage').attr('title');
        discussionTitle = 'Added Resource - ' + title + ' Notes';

    } else {
        discussionId = currentPage + '_' + globalPebl.userManager.profile.name + '_Notes';
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
    $(lightBoxContent).append('<i class="fa fa-times discussionCloseButton" onclick="closeLightBox();"></i>');
    lightBoxContent.appendChild(questionBox);

    var notesResponses = $('<div class="notesResponses" style="display:none;"><div id="discussionSpanContainer" style="text-align: center; margin-top: 10px; margin-bottom: 10px; display: none;"><span class="discussionSpan">You haven\'t added any notes yet.</span></div></div>');
    var notesInput = $('<div class="notesInput" style="display:none;"><textarea id="notesTextArea" placeholder="Add a note."></textarea><button class="notesSubmit chatSubmit">Add note</button></div>');
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
    var messageHandle = messageHandler(responseBox, null, true);
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
        var currentPage = $('body')[0].baseURI.split('/').pop().slice(0, -6);
        var addedResourcesContainer = document.createElement('div');
        addedResourcesContainer.classList.add('addedResourcesContainer');
        if (Math.abs(window.orientation) === 90) {
            addedResourcesContainer.classList.add('landscape');
        }
        addedResourcesContainer.id = 'addedResourcesContainer';

        globalPebl.utils.getToc(function(obj) {
            var tocObject = obj;

            Object.keys(tocObject).forEach(function(sectionKey) {
                //Sections
                Object.keys(tocObject[sectionKey]).forEach(function(pageKey) {
                    //Pages
                    if (!pageKey.includes('Subsection')) {
                        //Documents
                        if (tocObject[sectionKey][pageKey].card === currentPrefix) {
                            var tocPage = document.createElement('div');
                            tocPage.classList.add('tocPage');
                            tocPage.id = pageKey;

                            var tocPageIconWrapper = document.createElement('div');
                            tocPageIconWrapper.classList.add('tocPageIconWrapper');

                            var tocPageIcon = document.createElement('i');
                            tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-link');

                            // tocPageIconWrapper.appendChild(tocPageIcon);

                            var tocPageTextWrapper = document.createElement('div');
                            tocPageTextWrapper.classList.add('tocPageTextWrapper');

                            var tocPageText = document.createElement('a');
                            tocPageText.id = globalPebl.utils.getUuid();
                            tocPageText.classList.add('tocPageText');
                            tocPageText.style = 'font-size: 28px !important;'
                            tocPageText.textContent = tocObject[sectionKey][pageKey].documentName;
                            tocPageText.href = '#';
                            tocPageText.setAttribute('url', tocObject[sectionKey][pageKey].url);
                            tocPageText.setAttribute('docType', tocObject[sectionKey][pageKey].docType);
                            tocPageText.setAttribute('externalURL', tocObject[sectionKey][pageKey].externalURL);
                            $(document.body).on('click', '#' + tocPageText.id, function() {
                                handleTocPageTextClick(event, this);
                            });

                            tocPageTextWrapper.appendChild(tocPageText);

                            var tocPageDeleteButtonWrapper = document.createElement('div');
                            tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                            var tocPageDeleteButton = document.createElement('i');
                            tocPageDeleteButton.classList.add('tocPageDeleteButton', 'fa', 'fa-trash-alt');
                            tocPageDeleteButton.setAttribute('aria-hidden', 'true');
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

            $('.addedResourcesButtonContainer')[0].appendChild(addedResourcesContainer);
            showAddedResources();
        });
    }
}

function handleTocPageTextClick(event, elem) {
    event.preventDefault();
    //If its a dynamic document
    handleOverlayCloseButtonClick();
    if ($(elem).attr('url')) {
        if ($(elem).attr('tocLink')) {
            sendDocumentToDestination($(elem).attr('url'), $(elem).attr('docType'), $(elem).attr('externalURL'), $(elem).text());
            $('#tocContainer').remove();
            globalReadium.reader.openContentUrl($(elem).attr('href'));
            openDocumentAtDestination();
        } else {
            createDynamicPage($(elem).attr('url'), $(elem).attr('docType'), $(elem).attr('externalURL'), $(elem).text()); 
            $('#tocContainer').remove();
            //hideAddedResources();
        }
    } else {
        globalReadium.reader.openContentUrl($(elem).attr('href'));
    }
}

function handleDynamicPageHeaderLinkClick(event, elem) {
    event.preventDefault();
    window.open($(elem).attr('href').replace('openinbrowser:', ''), '_blank');
}

function getNotificationsCount() {
    globalPebl.utils.getNotifications(function(notifications) {
        var notificationsCount = notifications.length;
        setNotificationBadgeCounter(notificationsCount);
    });
}

function getCurrentPrefix(page) {
    globalPebl.utils.getToc(function(obj) {
        Object.keys(obj).forEach(function(section) {
            Object.keys(obj[section]).forEach(function(subsection) {
                if (obj[section][subsection].location && !obj[section][subsection].fake && obj[section][subsection].location == page) {
                    currentPrefix = obj[section][subsection].prefix;
                    currentSection = "Section" + obj[section].Section.prefix;
                    return getAddedResources();
                } else if (obj[section][subsection].pages) {
                    Object.keys(obj[section][subsection].pages).forEach(function(key) {
                        if (obj[section][subsection].pages[key].location && obj[section][subsection].pages[key].location == page) {
                            currentPrefix = obj[section][subsection].pages[key].prefix;
                            currentSection = "Section" + obj[section].Section.prefix;
                            return getAddedResources();
                        }
                   });
                }
            });
        });
    });
}

function getAddedResources() {
    var currentPage = $('body')[0].baseURI.split('/').pop();
    if (currentPrefix == null) {
        return getCurrentPrefix(currentPage);
    }
    var docCounter = 0;
    if (currentPage && currentPage !== '') {
        globalPebl.utils.getToc(function(obj) {
            var tocObject = obj;

            Object.keys(tocObject).forEach(function(sectionKey) {
                //Sections
                Object.keys(tocObject[sectionKey]).forEach(function(page) {
                    //Pages
                    if (!page.includes('Subsection')) {
                        //Documents
                        if (tocObject[sectionKey][page].card === currentPrefix) {
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
                hideAddedResources();
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
    if (parts && parts.a && parts.a[1] && parts.a[1].includes('.')) {
        a_compare = parts.a[1].split('.').pop();
    } else {
        return -1;
    }

    if (parts && parts.b && parts.b[1] && parts.b[1].includes('.')) {
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

function niceName(str) {
    str = str.replace(/_/g, ' ');
    str = str.replace(/-/g, ' ');
    str = str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    str = str.replace('Dei', 'DEI');
    str = str.replace('Md', 'MD');
    return str;
}

function preloadIframes() {
    setTimeout(function() {
        $(document.body).append('<iframe src="https://peblproject.com/registry/#welcome" style="display:none;"></iframe>');
        $(document.body).append('<iframe src="https://ask.extension.org/" style="display:none;"></iframe>');
    }, 1000);
}

function pullResource(target, url, docType, name, externalURL)  {
    if (currentSection && currentPrefix) {
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
    } else {
        console.log('no prefix and section');
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
