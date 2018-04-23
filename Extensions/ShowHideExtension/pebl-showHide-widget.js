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
        if (window.top.ReadiumSDK != null)
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

function createShowHide(buttonText1, buttonText2, id, cassMapping, cassTarget, cassLevel) {
    cassMapping = typeof cassMapping !== 'undefined' ? cassMapping : false;
    cassTarget = typeof cassTarget !== 'undefined' ? cassTarget : false;
    cassLevel = typeof cassLevel !== 'undefined' ? cassLevel : false;
    var button,
        scripts,
        insertLocation,
        handleButtonClick;

    button = document.createElement('button');
    button.id = id + 'Btn';
    button.otherId = id;
    button.classList.add('showHideButton');
    button.classList.add('hiding');
    button.buttonText1 = buttonText1;
    button.buttonText2 = buttonText2;
    button.addEventListener('click', toggleVisibility);
    //button.innerHTML = buttonText1;

    if (cassMapping !== false) {
        button.setAttribute('data-cassMapping', cassMapping);
    }
    if (cassTarget !== false) {
        button.setAttribute('data-cassTarget', cassTarget);
    }
    if (cassLevel !== false) {
        button.setAttribute('data-cassLevel', cassLevel);
    }

    scripts = document.getElementsByTagName('script');
    insertLocation = scripts[scripts.length - 1];

    insertLocation.parentNode.insertBefore(button, insertLocation);
    insertLocation.remove();

}