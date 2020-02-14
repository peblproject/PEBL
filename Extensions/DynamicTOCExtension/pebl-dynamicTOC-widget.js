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

//TODO: Perform some checks to find where these variables are on different platforms.
var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);
var globalReadium = window.parent.READIUM;

var dynamicTOC = {};

globalPebl.extension.dynamicTOC = dynamicTOC;

$(document).ready(function() {
    dynamicTOC.openDocumentAtDestination();

    jQuery('.peblExtension[data-peblextension="dynamicTOC"]').each(function () {
        var insertID = this.getAttribute('id');
        var buttonText = this.getAttribute('data-buttonText');
        var section = this.hasAttribute('data-section') ? this.getAttribute('data-section') : null;
        var subsection = this.hasAttribute('data-subsection') ? this.getAttribute('data-subsection') : null;
        var page = this.hasAttribute('data-page') ? this.getAttribute('data-page') : null;
        dynamicTOC.createDynamicTOCButton(insertID, buttonText, section, subsection, page);
    });

    globalPebl.subscribeSingularEvent(globalPebl.events.eventNextPage, 'dynamicTOC', false, function() {
        dynamicTOC.closeDynamicPage();
        jQuery('.peblModal').remove();
    });

    globalPebl.subscribeSingularEvent(globalPebl.events.eventPrevPage, 'dynamicTOC', false, function() {
        dynamicTOC.closeDynamicPage();
        jQuery('.peblModal').remove();
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

dynamicTOC.createDynamicTOCButton = function(insertID, buttonText, section, subsection, page) {
    var dynamicTOCButton = document.createElement('button');
    dynamicTOCButton.classList.add('dynamicTOCButton');
    dynamicTOCButton.textContent = buttonText;
    dynamicTOCButton.addEventListener('click', function() {
        dynamicTOC.createTOC(document.body, section, subsection, page, insertID);
    });

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(dynamicTOCButton, insertLocation);
    insertLocation.remove();
}

dynamicTOC.toc_sort = function(a, b) {
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
};

dynamicTOC.sendDocumentToDestination = function(url, docType, externalURL, title) {
    var obj = {
        'url': url,
        'docType': docType,
        'externalURL': externalURL,
        'title': title
    };

    localStorage.setItem('documentToOpen', JSON.stringify(obj));
}

dynamicTOC.openDocumentAtDestination = function() {
    var tryOpenDocumentAtDestination = setInterval(function() {
        if (globalPebl)
            if (localStorage.getItem('documentToOpen') !== null) {
                var documentObj = JSON.parse(localStorage.getItem('documentToOpen'));
                dynamicTOC.createDynamicPage(documentObj.url, documentObj.docType, documentObj.externalURL, documentObj.title);
                localStorage.removeItem('documentToOpen');
            }
            clearInterval(tryOpenDocumentAtDestination);
    }, 10);
}

dynamicTOC.handleDynamicPageHeaderLinkClick = function(event) {
    event.preventDefault();
    //If in iOS let the app handle opening in a new window ()
    window.open($(event.currentTarget).attr('href'), '_blank');

}

dynamicTOC.createDynamicPage = function(url, docType, externalURL, title) {
    dynamicTOC.closeDynamicPage();

    var dynamicPageHeader = document.createElement('div');
    dynamicPageHeader.id = 'dynamicPageHeader';
    dynamicPageHeader.classList.add('dynamicPageHeader');

    var dynamicPageHeaderLink = document.createElement('a');
    dynamicPageHeaderLink.id = 'dynamicPageHeaderLink';
    dynamicPageHeaderLink.classList.add('dynamicPageHeaderLink');
    dynamicPageHeaderLink.href = externalURL;
    dynamicPageHeaderLink.innerHTML = externalURL;
    dynamicPageHeaderLink.addEventListener('click', function() {
        dynamicTOC.handleDynamicPageHeaderLinkClick(event);
    });

    dynamicPageHeader.appendChild(dynamicPageHeaderLink);


    var dynamicPageCloseButton = document.createElement('i');
    dynamicPageCloseButton.id = 'dynamicPageCloseButton';
    dynamicPageCloseButton.classList.add('dynamicPageCloseButton', 'fa', 'fa-times');
    dynamicPageCloseButton.addEventListener('click', function() {
        dynamicTOC.closeDynamicPage();
    });

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
}

dynamicTOC.closeDynamicPage = function() {
    $('#dynamicPageHeader').remove();
    $('#dynamicPageCloseButton').remove();
    $('#dynamicPage').remove();
}

dynamicTOC.handleTocPageTextClick = function(event, id) {
    event.preventDefault();
    //If its a dynamic document
    if ($(event.currentTarget).attr('url')) {
        // if ($(event.currentTarget).attr('tocLink')) {
        //     dynamicTOC.sendDocumentToDestination($(event.currentTarget).attr('url'), $(event.currentTarget).attr('docType'), $(event.currentTarget).attr('externalURL'), $(event.currentTarget).text());
        //     $('#tocContainer').remove();
        //     globalReadium.reader.openContentUrl($(event.currentTarget).attr('href'));
        //     dynamicTOC.openDocumentAtDestination();
        // } else {
            globalPebl.emitEvent(globalPebl.events.eventAccessed, {
                name: event.currentTarget.textContent,
                type: 'resource',
                description: event.currentTarget.getAttribute('externalURL'),
                target: id
            });
            dynamicTOC.createDynamicPage($(event.currentTarget).attr('url'), $(event.currentTarget).attr('docType'), $(event.currentTarget).attr('externalURL'), $(event.currentTarget).text()); 
            $('#tocContainer').remove();
            //hideAddedResources();
        //} 
    } else {
        globalReadium.reader.openContentUrl($(event.currentTarget).attr('href'));
    }
}

dynamicTOC.createTOCDeleteConfirmDialog = function(sectionId, documentId) {
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
    dialogCancelButton.addEventListener('click', function() {
        $('.tocDeleteConfirmDialogContainer').remove();
        $('.tocDeleteConfirmDialogOverlay').remove();
    });

    var dialogConfirmButton = document.createElement('button');
    dialogConfirmButton.id = 'tocDeleteConfirmButton';
    dialogConfirmButton.classList.add('tocDeleteConfirmButton');
    dialogConfirmButton.textContent = 'Confirm';
    dialogConfirmButton.setAttribute('section-id', sectionId);
    dialogConfirmButton.setAttribute('document-id', documentId);
    dialogConfirmButton.addEventListener('click', function() {
        var sectionId = $(this).attr('section-id');
        var documentId = $(this).attr('document-id');
        globalPebl.utils.removeToc(documentId, sectionId);

        //Remove from the list
        $('#' + documentId).remove();

        //Reload the count
        //getAddedResources();

        $('.tocDeleteConfirmDialogContainer').remove();
        $('.tocDeleteConfirmDialogOverlay').remove();
    });

    dialogContainer.appendChild(dialogText);
    dialogContainer.appendChild(dialogCancelButton);
    dialogContainer.appendChild(dialogConfirmButton);

    document.body.appendChild(dimOverlay);
    document.body.appendChild(dialogContainer);
};

dynamicTOC.createTOC = function(element, section, subsection, page, id) {
    jQuery('.peblModal').remove();
    globalPebl.utils.getToc(function(obj) {
        var tocObject = obj;

        var tocContainer = document.createElement('div');
        tocContainer.id = 'tocContainer';
        tocContainer.classList.add('tocContainer', 'peblModal');

        var tocContainerHeader = document.createElement('div');
        tocContainerHeader.classList.add('tocContainerHeader');

        var tocContainerHeaderText = document.createElement('span');
        tocContainerHeaderText.textContent = 'Table of Contents and Additional Resources';

        tocContainerHeader.appendChild(tocContainerHeaderText);

        var closeButton = document.createElement('i');
        closeButton.classList.add('fa', 'fa-times', 'tocCloseButton');
        closeButton.addEventListener('click', function() {
            $('#tocContainer').remove();
            globalPebl.emitEvent(globalPebl.events.eventUndisplayed, {
                type: 'resource',
                target: id
            });
        });

        tocContainerHeader.appendChild(closeButton);

        tocContainer.appendChild(tocContainerHeader);

        var tocContainerBody = document.createElement('div');
        tocContainerBody.classList.add('tocContainerBody');

        tocContainer.appendChild(tocContainerBody);

        Object.keys(tocObject).forEach(function(sectionKey) {
            if (!section || ('Section' + section) === sectionKey) {
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
                tocSectionTitleText.addEventListener('click', function() {
                    dynamicTOC.handleTocPageTextClick(event);
                });
                tocSectionTitleTextWrapper.appendChild(tocSectionTitleText);
                tocSectionTitle.appendChild(tocSectionPrefix);
                tocSectionTitle.appendChild(tocSectionTitleTextWrapper);
                tocSection.appendChild(tocSectionTitle);
                Object.keys(tocObject[sectionKey]).sort(dynamicTOC.toc_sort).forEach(function(pageKey) {
                    //Pages
                    if (pageKey === 'Section') {
                        //Do nothing
                    } else if (pageKey.includes('Subsection')) {
                        //Subsections
                        if (!subsection || ('Subsection-' + section + '.' + subsection) === pageKey) {
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

                            var tocSubsectionTitleText = document.createElement('a');
                            tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
                            tocSubsectionTitleText.textContent = tocObject[sectionKey][pageKey].title;
                            tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
                            tocSubsectionTitleText.addEventListener('click', function() {
                                dynamicTOC.handleTocPageTextClick(event);
                            });
                            

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
                                    tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-external-link-square-alt');

                                    tocPageIconWrapper.appendChild(tocPageIcon);

                                    var tocPageTextWrapper = document.createElement('div');
                                    tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                                    var tocPageText = document.createElement('a');
                                    tocPageText.classList.add('tocPageText');
                                    tocPageText.setAttribute('style', 'color: var(--secondary-color) !important;');
                                    tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                                    tocPageText.setAttribute('slide', dynamicKey);
                                    tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                                    tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                                    tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                                    tocPageText.href = tocObject[sectionKey][pageKey].location;
                                    tocPageText.setAttribute('tocLink', 'true');
                                    tocPageText.addEventListener('click', function() {
                                        dynamicTOC.handleTocPageTextClick(event, id);
                                    });

                                    tocPageTextWrapper.appendChild(tocPageText);

                                    var tocPageDeleteButtonWrapper = document.createElement('div');
                                    tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                                    var tocPageDeleteButton = document.createElement('span');
                                    tocPageDeleteButton.classList.add('tocPageDeleteButton');
                                    tocPageDeleteButton.innerHTML = '&#215;';
                                    tocPageDeleteButton.setAttribute('section-id', sectionKey);
                                    tocPageDeleteButton.setAttribute('document-id', dynamicKey);
                                    tocPageDeleteButton.addEventListener('click', function() {
                                        var sectionId = $(this).attr('section-id');
                                        var documentId = $(this).attr('document-id');
                                        dynamicTOC.createTOCDeleteConfirmDialog(sectionId, documentId);
                                    });

                                    //tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                                    tocPage.appendChild(tocPageIconWrapper);
                                    tocPage.appendChild(tocPageTextWrapper);
                                    tocPage.appendChild(tocPageDeleteButtonWrapper);
                                    tocSection.appendChild(tocPage);
                                }
                            });


                            Object.keys(tocObject[sectionKey][pageKey].pages).sort(dynamicTOC.toc_sort).forEach(function(cardKey) {
                                
                                if (tocObject[sectionKey][pageKey].skip !== undefined) {
                                    
                                } else {
                                    if (!page || ('Page-' + section + '.' + subsection + '.' + page) === cardKey) {
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
                                            dynamicTOC.handleTocPageTextClick(event);
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
                                                tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-external-link-square-alt');

                                                tocPageIconWrapper.appendChild(tocPageIcon);

                                                var tocPageTextWrapper = document.createElement('div');
                                                tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

                                                var tocPageText = document.createElement('a');
                                                tocPageText.classList.add('tocPageText');
                                                tocPageText.setAttribute('style', 'color: var(--secondary-color) !important');
                                                tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
                                                tocPageText.setAttribute('slide', dynamicKey);
                                                tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
                                                tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
                                                tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
                                                tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
                                                tocPageText.setAttribute('tocLink', 'true');
                                                tocPageText.addEventListener('click', function() {
                                                    dynamicTOC.handleTocPageTextClick(event, id);
                                                });

                                                tocPageTextWrapper.appendChild(tocPageText);

                                                var tocPageDeleteButtonWrapper = document.createElement('div');
                                                tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

                                                var tocPageDeleteButton = document.createElement('span');
                                                tocPageDeleteButton.classList.add('tocPageDeleteButton');
                                                tocPageDeleteButton.innerHTML = '&#215;';
                                                tocPageDeleteButton.setAttribute('section-id', sectionKey);
                                                tocPageDeleteButton.setAttribute('document-id', dynamicKey);
                                                tocPageDeleteButton.addEventListener('click', function() {
                                                    var sectionId = $(this).attr('section-id');
                                                    var documentId = $(this).attr('document-id');
                                                    dynamicTOC.createTOCDeleteConfirmDialog(sectionId, documentId);
                                                });

                                                //tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

                                                tocPage.appendChild(tocPageIconWrapper);
                                                tocPage.appendChild(tocPageTextWrapper);
                                                tocPage.appendChild(tocPageDeleteButtonWrapper);
                                                tocSection.appendChild(tocPage);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        //Do nothing
                        
                    }
                });
            }
            tocContainerBody.appendChild(tocSection);
        });
        element.appendChild(tocContainer);

        globalPebl.emitEvent(globalPebl.events.eventDisplayed, {
            type: 'resource',
            target: id
        });
        //document.getElementById('peblOverlay').appendChild(createOverlayCloseButton());
        //Fix TOC scrolling, iOS sucks
        setTimeout(function() {
            $('.tocSection').attr('style', 'transform: translate3d(0px, 0px, 0px);');
        }, 1000);
    });
}

