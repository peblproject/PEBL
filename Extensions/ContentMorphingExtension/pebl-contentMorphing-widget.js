var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);

var contentMorphing = {};
if (globalPebl)
    globalPebl.extension.contentMorphing = contentMorphing;

$(document).ready(function () {
    $('.peblExtension[data-peblextension="contentMorphingControlPanel"]').each(function () {
        var insertID = this.getAttribute('id');
        var levels = JSON.parse(this.getAttribute('data-levels'));
        var id = this.getAttribute('data-id');
        contentMorphing.createMorphingControlPanel(insertID, levels, id);
    });

    $('.peblExtension[data-peblextension="contentMorphing"], .contentMorphing_contentMorphingExtension').each(function () {
        var insertID = $(this)[0].getAttribute('id');
        var levels = JSON.parse($(this)[0].getAttribute('data-levels'));
        var levelContent = JSON.parse($(this)[0].getAttribute('data-levelContent'));
        var id = $(this)[0].getAttribute('data-id');
        var cassMapping = $(this)[0].hasAttribute('data-cassMapping') ? $(this)[0].getAttribute('data-cassMapping') : null;
        var cassTarget = $(this)[0].hasAttribute('data-cassTarget') ? $(this)[0].getAttribute('data-cassTarget') : null;
        var cassLevels = $(this)[0].hasAttribute('data-cassLevels') ? JSON.parse($(this)[0].getAttribute('data-cassLevels')) : null;
        var controls = this.hasAttribute('data-controls') ? this.getAttribute('data-controls') : 'true';
        var controller = this.hasAttribute('data-controller') ? this.getAttribute('data-controller') : 'user';
        contentMorphing.createMorphing(insertID, levels, levelContent, id, cassMapping, cassTarget, cassLevels, controls, controller);
    });
});

contentMorphing.createMorphingControlPanel = function (insertID, levels, id) {
    var controlPanelContainer = document.createElement('label');
    controlPanelContainer.classList.add('contentMorphingControlPanelContainer');

    var whichLevels = localStorage.getItem('contentMorphingControlPanel-' + id);
    if (whichLevels)
        whichLevels = JSON.parse(whichLevels);

    for (var i = 0; i < levels.length; i++) {
        var levelCheckboxContainer = document.createElement('div');
        levelCheckboxContainer.classList.add('contentMorphingControlPanelLevelCheckboxContainer');

        var levelCheckbox = document.createElement('input');
        var levelCheckboxSpan = document.createElement('span');
        levelCheckboxSpan.classList.add('levelCheckboxSpan');
        levelCheckbox.type = 'checkbox';
        levelCheckbox.value = 'level' + (i + 1) + '-' + levels[i];
        levelCheckbox.addEventListener('click', function (evt) {
            var checkboxes = $(controlPanelContainer).find('input[type="checkbox"]');
            var activeLevels = [];
            if (evt.currentTarget.checked) {
            	globalPebl.emitEvent(globalPebl.events.eventSelected, {
	            	name: evt.currentTarget.value,
	            	type: 'checkbox',
	            	target: id
	            });
            }

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    if (evt.currentTarget.checked && evt.currentTarget.value === 'level1-Select-All') {
                        if (checkboxes[i].value === 'level1-Select-All') {
                            activeLevels.push(checkboxes[i].value);
                        } else {
                            checkboxes[i].checked = false;
                        }
                    } else {
                        if (checkboxes[i].value === 'level1-Select-All') {
                            checkboxes[i].checked = false;
                        } else {
                            activeLevels.push(checkboxes[i].value);
                        }
                    }
                }
            }


            if (activeLevels.length > 0) {
                localStorage.setItem('contentMorphingControlPanel-' + id, JSON.stringify(activeLevels));
            } else {
                localStorage.removeItem('contentMorphingControlPanel-' + id);
            }

            contentMorphing.applyMorphingControlPanel(id);
        });
        if (whichLevels) {
            for (var level of whichLevels) {
                if (level === levelCheckbox.value)
                    levelCheckbox.checked = true;
            }
        }

        var levelLabel = document.createElement('span');
        levelLabel.classList.add('levelCheckboxLabel');
        if (i === 0) {
            levelLabel.textContent = 'See All Scenario Types';
        } else {
            levelLabel.textContent = levels[i];
        }

        levelCheckboxContainer.appendChild(levelCheckbox);
        levelCheckboxContainer.appendChild(levelCheckboxSpan);
        levelCheckboxContainer.appendChild(levelLabel);

        controlPanelContainer.appendChild(levelCheckboxContainer);
    }

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(controlPanelContainer, insertLocation);
    insertLocation.remove();
}

contentMorphing.applyMorphingControlPanel = function (id) {
    var whichLevels = localStorage.getItem('contentMorphingControlPanel-' + id);
    var elems = $('#' + id + '.adjustable-content').children();

    for (var elem of elems) {
        $(elem).hide();
    }

    if (whichLevels) {
        whichLevels = JSON.parse(whichLevels);
        var levelToDisplay = '';

        for (var level of whichLevels) {
            levelToDisplay += level;
        }

        var elem = $('#' + id + '.adjustable-content #' + levelToDisplay).parent();
        elem.show();

        $('#' + id + '.adjustable-content').addClass('active');
    } else {
        $('#' + id + '.adjustable-content').removeClass('active');
    }
}

//Takes an array with names of desired levels, and array with the content to be contained within those levels, optional parameters cassMapping, cassTarget, cassLevels[]
contentMorphing.createMorphing = function (insertID, levels, levelContent, id, cassMapping, cassTarget, cassLevels, controls, controller) {
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

    var wrapper = document.createElement('div');
    wrapper.classList.add('contentMorphingWrapper');

    adjustableContentDiv = document.createElement('div');
    adjustableContentDiv.classList.add('adjustable-content', 'ignore-cfi');
    adjustableContentDiv.id = id;

    wrapper.appendChild(adjustableContentDiv);

    levelOptionsDiv = document.createElement('div');
    levelOptionsDiv.classList.add('level-options');

    currentLevelDiv = document.createElement('div');
    currentLevelDiv.classList.add('current-level', 'set-level1');
    currentLevelDiv.addEventListener('click', contentMorphing.handleCurrentLevelClick);

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
        clickEvent.value = "globalPebl.extension.contentMorphing.setLevel('" + convertedValue + "', '" + id + "');";

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



    if (controls === 'true')
        adjustableContentDiv.appendChild(levelOptionsDiv);

    for (var i = 0; i < levelContent.length; i++) {
        var convertedValue = i + 1;
        var target = document.getElementById(levelContent[i]);
        var clone = target.cloneNode(true);
        levelContentDiv = document.createElement('div');
        levelContentDiv.classList.add('level' + convertedValue);

        levelContentDiv.appendChild(clone);
        adjustableContentDiv.appendChild(levelContentDiv);

        target.outerHTML = "";
        delete outerHTML;

        var morphingExperienced = function(elem, n) {
        	if (contentMorphing.isElementXPercentInViewport(elem, 1) && jQuery(elem).is(':visible')) {
        		globalPebl.emitEvent(globalPebl.events.eventExperienced, {
		        	target: id,
		        	type: "morphing",
		        	description: $('#' + id + '.adjustable-content .level' + n).text(),
		        	name: "Level - " + n
		        });
        	} else {
        		setTimeout(function() {
        			morphingExperienced(elem, n)
        		}, 1000);
        	}
        }

        setTimeout(function(levelContentDiv, n) {
        	return(function() {
        		morphingExperienced(levelContentDiv, n)
        	});
        }(levelContentDiv, convertedValue), 2000);
    }



    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(wrapper, insertLocation);

    if (controller === 'user') {
        adjustableContentDiv.classList.add('active');
        var elem = $('#' + id + '.adjustable-content .level1');
        setTimeout(function () {
            elem.show();
        }, 500);
    } else if (controller === 'controlPanel') {
        setTimeout(function () {
            contentMorphing.applyMorphingControlPanel(id);
        }, 500);
    }


    insertLocation.remove();
}

contentMorphing.handleCurrentLevelClick = function () {
    //console.log('Toggle level');
    $(this).next('ul').toggleClass('active');
}

contentMorphing.isLevelSet = function (n, sectionID) {
    return $("#" + sectionID + ".adjustable-content .level-options .current-level").hasClass('set-level' + n);
}

contentMorphing.setLevel = function (n, sectionID, programInvoked) {
    //    $("#"+sectionID+".adjustable-content .level-options .current-level").removeClass('set-level' + contentLevel);

    // if (contentMorphing.isLevelSet(n, sectionID))
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

    if (globalPebl != null) {
        if (!programInvoked) {
            $('#' + sectionID).addClass("userToggled");
            var cfi = "";
            // if (window.top.ReadiumSDK != null)
            //  cfi = window.top.ReadiumSDK.reader.getCfiForElement($("#" + sectionID));
            globalPebl.emitEvent(globalPebl.events.eventContentMorphed,
                {
                    target: sectionID,
                    type: "morphing",
                    description: $('#' + sectionID + '.adjustable-content .level' + n).text(),
                    name: "Level - " + n
                });
        }
    }
    //    console.log("#" + sectionID + ", Content Level: " + n);
}

contentMorphing.isElementXPercentInViewport = function(el, percentVisible) {
	if (typeof jQuery === "function" && el instanceof jQuery) {
	    el = el[0];
	}
	var rect = el.getBoundingClientRect();
	var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

	return !(
		Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1)) * 100)) < percentVisible ||
		Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
	)
};
