function createPopout(title, content, iconType) {
	var popoutDiv,
		popoutShadowDiv,
		popoutContentDiv,
		closeButton,
		header,
		paragraph,
		scripts,
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

	popoutDiv.addEventListener('click', handlePopoutClick);

	scripts = document.getElementsByTagName('script');
    insertLocation = scripts[scripts.length - 1];

    insertLocation.parentNode.insertBefore(popoutDiv, insertLocation);
    insertLocation.remove();
}

$().ready(function () {
    $('.popout').addClass('inactive'); // Hide all popouts, no script fallback shows popouts.
});

function handlePopoutClick() {
    var e = $(this).closest('.popout');
    e.toggleClass('inactive');
    e.toggleClass('active');
    if (window.top.ReadiumSDK != null)
            window.top.ReadiumSDK.reader.plugins.highlights.redrawAnnotations();
    if (window.top.pebl != null) {
        var cfi = "";
        // if (window.top.ReadiumSDK != null)
        //     cfi = window.top.ReadiumSDK.reader.getCfiForElement(e);

        if (!e.hasClass('inactive'))
            window.top.pebl.eventPreferred(cfi, "popoutShow");
        else
            window.top.pebl.eventPreferred(cfi, "popoutHide");
    }
}