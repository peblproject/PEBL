var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var popout = {};
if (globalPebl)
    globalPebl.extension.popout = popout;

jQuery(document).ready(function () {

    jQuery('.popout_popoutExtension, .peblExtension[data-peblextension="popout"]').each(function () {
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
    header.innerHTML = title;

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
    paragraph.innerHTML = content;

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
    var e = jQuery(this).closest('.pebl__popout');
    e.toggleClass('inactive');
    e.toggleClass('active');

    if (globalPebl != null) {
        var cfi = "";
        // if (window.top.ReadiumSDK != null)
        //     cfi = window.top.ReadiumSDK.reader.getCfiForElement(e);

        globalPebl.emitEvent(globalPebl.events.eventPreferred, {
            target: cfi,
            type: e.hasClass('inactive') ? "popoutHide" : "popoutShow"
        });

    }
}