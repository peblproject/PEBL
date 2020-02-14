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

var popout = {};
if (globalPebl)
    globalPebl.extension.popout = popout;

jQuery(document).ready(function () {

    jQuery('.popout_popoutExtension, .peblExtension[data-peblextension="popout"], .peblExtension[data-peblExtension="popout"]').each(function () {
        var insertID = jQuery(this)[0].getAttribute('id');
        var title = jQuery(this)[0].getAttribute('data-title');
        var content = jQuery(this)[0].getAttribute('data-content');
        var iconType = jQuery(this)[0].getAttribute('data-icon');
        popout.createPopout(insertID, title, content, iconType);
    });
});

popout.iconTable = {
    "book": "fa-book",
    "file": "fa-file-alt",
    "info": "fa-info-circle",
    "link": "fa-link",
    "chat": "fa-chat",
    "note": "fa-sticky-note"
}

/* inputs
    insertID: the id of the html element this will be attaching to, the popoutDiv replaes this element
    title: the title of the popout which displays in the extension clickable bar 
    content: the body content of the popout which only displays when a user chooses to expose the 
    element by clicking the top bar 
    iconType: the type of icon to display
    */
popout.createPopout = function (insertID, title, content, iconType) {
    var popoutDiv,
        popoutTitleSpan,
        popoutHeaderDiv,
        popoutIconDiv,
        popoutIconI,
        popoutContentDiv,
        closeButton,
        header,
        paragraph,
        insertLocation;

    /* Create div to wrap the entire popout */
    popoutDiv = document.createElement('div');
    popoutDiv.classList.add('pebl__popout');
    popoutDiv.setAttribute('data-trackingId', insertID);

    /* Create span to accept icon class  */
    popoutTitleSpan = document.createElement('div');
    popoutTitleSpan.classList.add('pebl__popout--popout-title');

    /* create header span for title wrapper */
    popoutHeaderDiv = document.createElement('div');
    popoutHeaderDiv.classList.add('pebl__popout--popout-header');

    /* create span for holding icon */
    popoutIconDiv = document.createElement('div');
    popoutIconDiv.classList.add('pebl__popout--popout-icon', 'shadow', 'shadow-hover');

    /* create popout title */
    header = document.createElement('h4');
    header.innerHTML = title.replace('&',' and ');

    /* create icon element for iconType */
    popoutIconI = document.createElement('i');
    popoutIconI.classList.add('fas', popout.iconTable[iconType]);

    /* create div to hold popoutContentDiv */
    popoutContentDiv = document.createElement('div');
    popoutContentDiv.classList.add('pebl__popout--popout-content');

    closeButton = document.createElement('div');
    closeButton.classList.add('close');

    paragraph = document.createElement('p');
    paragraph.classList.add('Basic-Paragraph');
    paragraph.innerHTML = content.replace('&','&amp;');

    popoutContentDiv.appendChild(closeButton);
    popoutContentDiv.appendChild(paragraph);

    popoutDiv.appendChild(popoutTitleSpan);
    popoutDiv.appendChild(popoutContentDiv);
    popoutTitleSpan.appendChild(popoutHeaderDiv);
    popoutHeaderDiv.appendChild(header);
    popoutTitleSpan.appendChild(popoutIconDiv);
    popoutIconDiv.appendChild(popoutIconI);
    popoutDiv.addEventListener('click', popout.handlePopoutClick);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(popoutDiv, insertLocation);
    insertLocation.remove();
}

jQuery().ready(function () {
    jQuery('.pebl__popout').addClass('inactive'); // Hide all popouts, no script fallback shows popouts.
});

popout.handlePopoutClick = function (event) {
    //Don't close the popout when clicking a link inside it.
    if (event.target.tagName === 'a')
        return;
    var e = $(this).closest('.pebl__popout');
    if (e.hasClass('active')) {
        e.children('.pebl__popout--popout-content').slideToggle(400, function () {
            e.toggleClass('inactive');
            e.toggleClass('active');
            globalPebl.emitEvent(globalPebl.events.eventHid, {
                target: e.attr('data-trackingId'),
                type: 'popout'
            });
        });
    } else {
        e.toggleClass('inactive');
           e.toggleClass('active');
           e.children('.pebl__popout--popout-content').slideToggle(400);
           globalPebl.emitEvent(globalPebl.events.eventShowed, {
            target: e.attr('data-trackingId'),
            type: 'popout'
        });
    }
}