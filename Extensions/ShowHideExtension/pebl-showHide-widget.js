var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var showHide = {};

globalPebl.extension.showHide = showHide;

showHide.toggleVisibility = function (event, programInvoked) {
    console.log(event);
    var id = event.currentTarget.getAttribute('otherId'),
        buttonText1 = event.currentTarget.getAttribute('buttonText1'),
        buttonText2 = event.currentTarget.getAttribute('buttonText2'),
        state;

    console.log(event.currentTarget);


    if ($('#' + id + ':visible').length == 0) {
        // var res = str.replace(buttonText1, buttonText2);
        // $('#' + id + 'Btn').html(res);
        $('#' + id + 'Btn')[0].classList.remove('hiding');
        if (buttonText2 != null) {
            $('#' + id + 'Btn').children('span').first().text(buttonText2);
        }
        $('#' + id + 'Btn').children('i').first()[0].classList.remove('fa-plus-circle');
        $('#' + id + 'Btn').children('i').first()[0].classList.add('fa-minus-circle');
        state = "showing";
    } else {
        // var res = str.replace(buttonText2, buttonText1);
        // $('#' + id + 'Btn').html(res);
        $('#' + id + 'Btn')[0].classList.add('hiding');
        if (buttonText1 != null) {
            $('#' + id + 'Btn').children('span').first().text(buttonText1);
        }
        $('#' + id + 'Btn').children('i').first()[0].classList.add('fa-plus-circle');
        $('#' + id + 'Btn').children('i').first()[0].classList.remove('fa-minus-circle');
        state = "hiding";
    }

    var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    $('#' + id).slideToggle(400, function () {
        //globalReadium.reader.plugins.highlights.redrawAnnotations();
        // setTimeout(function () {
        //     globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
        // }, 500);
    });


    if (globalPebl != null) {
        if (!programInvoked) {
            var target = document.getElementById(id + 'Btn').dataset.cassTarget;
            var cfi = "";
            $('#' + id).addClass("userToggled");
            // if (window.top.ReadiumSDK != null)
            //  cfi = window.top.ReadiumSDK.reader.getCfiForElement($("#" + target));
            globalPebl.emitEvent(globalPebl.events.eventPreferred, {
                target: target,
                type: state
            });
        }
    }
}

$(document).ready(function () {
    $('.showHide_showHideExtension').each(function () {
        var insertID = $(this)[0].getAttribute('id');
        var buttonText1 = $(this)[0].getAttribute('data-buttonText1');
        var buttonText2 = $(this)[0].getAttribute('data-buttonText2');
        var id = $(this)[0].getAttribute('data-id');
        var cassMapping = $(this)[0].hasAttribute('data-cassMapping') ? $(this)[0].getAttribute('data-cassMapping') : null;
        var cassTarget = $(this)[0].hasAttribute('data-cassTarget') ? $(this)[0].getAttribute('data-cassTarget') : null;
        var cassLevel = $(this)[0].hasAttribute('data-cassLevel') ? $(this)[0].getAttribute('data-cassLevel') : null;
        var isInline = false;
        if ($(this)[0].hasAttribute('data-displayBtnInline') && $(this)[0].getAttribute('data-displayBtnInline') == 'true') {
            isInline = true;
        }

        var defaultState = this.hasAttribute('data-defaultState') ? this.getAttribute('data-defaultState') : 'closed'
        showHide.createShowHide(insertID, buttonText1, buttonText2, id, isInline, cassMapping, cassTarget, cassLevel, defaultState);
    });
});

showHide.createShowHide = function (insertID, buttonText1, buttonText2, id, isInline, cassMapping, cassTarget, cassLevel, defaultState) {
    var button,
        buttonIcon,
        insertLocation,
        handleButtonClick;

    button = document.createElement('button');
    button.id = id + 'Btn';
    button.setAttribute('otherId', id);
    button.classList.add('showHideButton');
    if (defaultState === 'closed')
        button.classList.add('hiding');
    if (isInline == true) {
        button.classList.add('inline');
    }
    button.setAttribute('buttonText1', buttonText1);
    button.setAttribute('buttonText2', buttonText2);
    button.addEventListener('click', showHide.toggleVisibility);
    buttonIcon = document.createElement('i');
    buttonIcon.classList.add('fa');
    if (defaultState === 'closed') {
        buttonIcon.classList.add('fa-plus-circle');
    } else {
        buttonIcon.classList.add('fa-minus-circle');
    }
    button.appendChild(buttonIcon);

    if (buttonText1 != null && buttonText2 != null) {
        var buttonText = document.createElement('span');
        if (defaultState === 'closed') {
            buttonText.textContent = buttonText2;
        } else {
            buttonText.textContent = buttonText1;
        }
        button.classList.add('text');
        button.appendChild(buttonText);
    }

    if (cassMapping) {
        button.setAttribute('data-cassMapping', cassMapping);
    }
    if (cassTarget) {
        button.setAttribute('data-cassTarget', cassTarget);
    }
    if (cassLevel) {
        button.setAttribute('data-cassLevel', cassLevel);
    }

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(button, insertLocation);
    insertLocation.remove();

}