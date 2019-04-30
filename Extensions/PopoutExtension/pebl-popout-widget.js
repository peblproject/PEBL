var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var popout = {};

globalPebl.extension.popout = popout;

$(document).ready(function() {
	$('.popout_popoutExtension').each(function() {
		var insertID = $(this)[0].getAttribute('id');
		var title = $(this)[0].getAttribute('data-title');
		var content = $(this)[0].getAttribute('data-content');
		var iconType = $(this)[0].getAttribute('data-icon');
		popout.createPopout(insertID, title, content, iconType);
	});
});

popout.createPopout = function(insertID, title, content, iconType) {
	var popoutDiv,
		popoutShadowDiv,
		popoutContentDiv,
		closeButton,
		header,
		paragraph,
		insertLocation;

	popoutDiv = document.createElement('div');
	popoutDiv.classList.add('popout', 'popout-' + iconType);

	popoutShadowDiv = document.createElement('div');
	popoutShadowDiv.classList.add('popout-icon', 'shadow', 'shadow-hover');

	popoutContentDiv = document.createElement('div');
	popoutContentDiv.style.display = 'none';
	popoutContentDiv.classList.add('popout-content');

	closeButton = document.createElement('span');
	closeButton.classList.add('close');
	closeButton.innerHTML = 'x';

	header = document.createElement('h4');
	header.innerHTML = title;

	paragraph = document.createElement('p');
	paragraph.classList.add('Basic-Paragraph');
	paragraph.innerHTML = content;

	popoutContentDiv.appendChild(closeButton);
	popoutContentDiv.appendChild(header);
	popoutContentDiv.appendChild(paragraph);

	popoutDiv.appendChild(popoutShadowDiv);
	popoutDiv.appendChild(popoutContentDiv);

	popoutDiv.addEventListener('click', popout.handlePopoutClick);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(popoutDiv, insertLocation);
    insertLocation.remove();
}

$().ready(function () {
    $('.popout').addClass('inactive'); // Hide all popouts, no script fallback shows popouts.
});

popout.handlePopoutClick = function(event) {
	//Don't close the popout when clicking a link inside it.
	if (event.target.tagName === 'a')
		return;
    var e = $(this).closest('.popout');
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
