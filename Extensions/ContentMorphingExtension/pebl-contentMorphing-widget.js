$(document).ready(function() {
	$('.contentMorphing_contentMorphingExtension').each(function() {
		var insertID = $(this)[0].getAttribute('id');
		var levels = JSON.parse($(this)[0].getAttribute('data-levels'));
		var levelContent = JSON.parse($(this)[0].getAttribute('data-levelContent'));
		var id = $(this)[0].getAttribute('data-id');
		var cassMapping = $(this)[0].hasAttribute('data-cassMapping') ? $(this)[0].getAttribute('data-cassMapping') : null;
		var cassTarget = $(this)[0].hasAttribute('data-cassTarget') ? $(this)[0].getAttribute('data-cassTarget') : null;
		var cassLevels = $(this)[0].hasAttribute('data-cassLevels') ? JSON.parse($(this)[0].getAttribute('data-cassLevels')) : null;
		createMorphing(insertID, levels, levelContent, id, cassMapping, cassTarget, cassLevels);
	});
});

//Takes an array with names of desired levels, and array with the content to be contained within those levels, optional parameters cassMapping, cassTarget, cassLevels[]
function createMorphing(insertID, levels, levelContent, id, cassMapping, cassTarget, cassLevels) {
	var adjustableContentDiv,
		levelOptionsDiv,
		currentLevelDiv,
		levelSelectList,
		levelListElement,
		level,
		content,
		clickEvent,
		levelContentDiv,
		insertLocation;

	adjustableContentDiv = document.createElement('div');
	adjustableContentDiv.classList.add('adjustable-content');
	adjustableContentDiv.id = id;

	levelOptionsDiv = document.createElement('div');
	levelOptionsDiv.classList.add('level-options');

	currentLevelDiv = document.createElement('div');
	currentLevelDiv.classList.add('current-level', 'set-level1');
	currentLevelDiv.addEventListener('click', handleCurrentLevelClick);

	levelSelectList = document.createElement('ul');

	for (level in levels) {
		var convertedValue = parseInt(level) + 1;
		levelListElement = document.createElement('li');

		if (cassMapping !== null) {
			levelListElement.setAttribute('data-cassMapping', cassMapping);
		}
		if (cassTarget !== null) {
			levelListElement.setAttribute('data-cassTarget', cassTarget);
		}
		if (cassLevels !== null && cassLevels.constructor === Array) {
			levelListElement.setAttribute('data-cassLevel', cassLevels[level]);
		}


		clickEvent = document.createAttribute('onclick');
		clickEvent.value = "setLevel('" + convertedValue + "', '" + id + "');";

		levelListElement.classList.add('select-level' + convertedValue);

		if (level == 0) {
			levelListElement.classList.add('selected');
		}

		levelListElement.innerHTML = levels[level];

		levelListElement.setAttributeNode(clickEvent);

		levelSelectList.appendChild(levelListElement);
	}

	levelOptionsDiv.appendChild(currentLevelDiv);
	levelOptionsDiv.appendChild(levelSelectList);

	adjustableContentDiv.appendChild(levelOptionsDiv);

	for (content in levelContent) {
		var convertedValue = parseInt(content) + 1;
		var target = document.getElementById(levelContent[content]);
		var clone = target.cloneNode(true);
		levelContentDiv = document.createElement('div');
		levelContentDiv.classList.add('level' + convertedValue);

		levelContentDiv.appendChild(clone);
		adjustableContentDiv.appendChild(levelContentDiv);

		target.outerHTML = "";
		delete outerHTML;
	}

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(adjustableContentDiv, insertLocation);
    insertLocation.remove();
}

function handleCurrentLevelClick() {
    //console.log('Toggle level');
    $(this).next('ul').toggleClass('active');
}

function isLevelSet(n, sectionID) {
    return $("#" + sectionID + ".adjustable-content .level-options .current-level").hasClass('set-level' + n);
}

function setLevel(n, sectionID, programInvoked) {
    //    $("#"+sectionID+".adjustable-content .level-options .current-level").removeClass('set-level' + contentLevel);

    // if (isLevelSet(n, sectionID))
    //  return;
    
    $("#" + sectionID + ".adjustable-content .level-options .current-level").removeClass('set-level1 set-level2 set-level3');

    $("#" + sectionID + ".adjustable-content .level-options .current-level").addClass('set-level' + n);
    $("#" + sectionID + ".adjustable-content .level-options ul").removeClass('active');
    $("#" + sectionID + ".adjustable-content .level-options li").removeClass('selected');
    $("#" + sectionID + ".adjustable-content .level-options li.select-level" + n).addClass('selected');

    if (n != '1') $('#' + sectionID + '.adjustable-content .level1').slideUp();
    if (n != '2') $('#' + sectionID + '.adjustable-content .level2').slideUp();
    if (n != '3') $('#' + sectionID + '.adjustable-content .level3').slideUp();
    
    $('#' + sectionID + '.adjustable-content .level' + n).slideDown(400, function () {
    if (window.top.ReadiumSDK != null && window.top.ReadiumSDK.reader.plugins.highlights != null)
        window.top.ReadiumSDK.reader.plugins.highlights.redrawAnnotations();
    });
    //contentLevel = n;

    if (window.top.pebl != null) {
        if (!programInvoked) {
        $('#' + sectionID).addClass("userToggled");
            var cfi = "";
            // if (window.top.ReadiumSDK != null)
            //  cfi = window.top.ReadiumSDK.reader.getCfiForElement($("#" + sectionID));
            window.top.pebl.eventPreferred(cfi, "morphing");
        }
    }   
    //    console.log("#" + sectionID + ", Content Level: " + n);
}