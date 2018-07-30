function toggleVisibility(event, programInvoked) {
    console.log(event);
    var id = event.target.otherId,
        buttonText1 = event.target.buttonText1,
        buttonText2 = event.target.buttonText2,
        str = document.getElementById(id + 'Btn').innerHTML,
        state;



    if ($('#' + id + ':visible').length == 0) {
        // var res = str.replace(buttonText1, buttonText2);
        // $('#' + id + 'Btn').html(res);
        $('#' + id + 'Btn')[0].classList.remove('hiding');
    state = "showing";
    } else {
        // var res = str.replace(buttonText2, buttonText1);
        // $('#' + id + 'Btn').html(res);
        $('#' + id + 'Btn')[0].classList.add('hiding');
    state = "hiding";
    }
    $('#' + id).slideToggle(400, function () {
        if (window.top.ReadiumSDK != null && window.top.ReadiumSDK.reader.plugins.highlights != null)
            window.top.ReadiumSDK.reader.plugins.highlights.redrawAnnotations();
    });

    
    if (window.top.pebl != null) {
        if (!programInvoked) {
            var target = document.getElementById(id + 'Btn').dataset.cassTarget;
            var cfi = "";
        $('#' + id).addClass("userToggled");
            // if (window.top.ReadiumSDK != null)
            //  cfi = window.top.ReadiumSDK.reader.getCfiForElement($("#" + target));
            window.top.pebl.eventPreferred(cfi, state);
        }
    }   
}

$(document).ready(function() {
    $('.showHide_showHideExtension').each(function() {
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
        createShowHide(insertID, buttonText1, buttonText2, id, isInline,cassMapping, cassTarget, cassLevel);
    });
});

function createShowHide(insertID, buttonText1, buttonText2, id, isInline, cassMapping, cassTarget, cassLevel) {
    var button,
        insertLocation,
        handleButtonClick;

    button = document.createElement('button');
    button.id = id + 'Btn';
    button.otherId = id;
    button.classList.add('showHideButton');
    button.classList.add('hiding');
    if (isInline == true) {
        button.classList.add('inline');
    }
    button.buttonText1 = buttonText1;
    button.buttonText2 = buttonText2;
    button.addEventListener('click', toggleVisibility);
    //button.innerHTML = buttonText1;

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