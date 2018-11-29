$(document).ready(function() {
    //Find inDesign shortcodes and replace with actual pebl shortcodes
    $("body").children().each(function () {
        $(this).html( $(this).html().replace(/\[\[\[(type=”hotword”) (word=”.*?”) (description=”.*?”)]]]/g, function(x) {
            var hotword = x.match(/word=”(.*?)”/);
            var description = x.match(/description=”(.*?)”/);

            var widgetCode = '<i class="hotword_hotwordExtension" id="someID" data-hotword="' + hotword[1] + '" data-hotwordText="' + description[1] + '"></i>';
            return widgetCode;
        }) );
    });
    $(document.body).on('click', '.tooltip', function(event) {
        handleTooltipClick(event);
    });
    $('.hotword_hotwordExtension').each(function() {
        var insertID = $(this)[0].getAttribute('id');
        var hotword = $(this)[0].getAttribute('data-hotword');
        var hotwordText = $(this)[0].getAttribute('data-hotwordText');
        createHotword(insertID, hotword, hotwordText);
    });
});

function createHotword(insertID, tooltip, tooltipText) {
    var tooltipSpan,
        tooltipTextSpan,
        insertLocation;

    tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('tooltip');
    tooltipSpan.textContent = tooltip;
    tooltipSpan.setAttribute('definition', tooltipText);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(tooltipSpan, insertLocation);
    insertLocation.remove();
}

function hotword_offsetTop(elem) {
    elem.removeAttr('style');
    elem.css('margin', 0);

    var adjustTop = false;
    var topStyleString = null;

    var tooltiptextHeight = elem.height();
    var elemRect = elem.parent()[0].getBoundingClientRect();
    var rect = elem[0].getBoundingClientRect();

    if (tooltiptextHeight > elemRect.top || rect.top < 0) {
        elem.css('bottom', 'inherit');
        var newMarginTop = (-4 - elem.innerHeight());
        topStyleString = "border-top-width: 0px;border-bottom-width: 8px;border-bottom-style: solid;border-bottom-color: rgb(85, 85, 85);margin-top: " + newMarginTop + "px;";
        adjustTop = true;
    }

    setTimeout(function() {
        hotword_offsetRight(elem, adjustTop, topStyleString);
    }, 10);

}

function hotword_offsetRight(elem, adjustTop, topStyleString) {
    var adjustRight = false;
    var rightStyleString = null;

    var rect = elem[0].getBoundingClientRect();
    var w = $(window).width();
    var marginLeft = parseInt(elem.css('marginLeft'));

    if (rect.right > w) {
        var offset = w - rect.right;
        elem.css('margin-left', offset);
        var newMarginLeft = -8 + (marginLeft - offset);
        rightStyleString = "margin-left: " + newMarginLeft + 'px;';
        adjustRight = true;
    }

    setTimeout(function() {
        hotword_offsetLeft(elem, adjustTop, topStyleString, adjustRight, rightStyleString);
    }, 10);
}

function hotword_offsetLeft(elem, adjustTop, topStyleString, adjustRight, rightStyleString) {
    var adjustLeft = false;
    var leftStyleString = null;

    var rect = elem[0].getBoundingClientRect();
    var w = $(window).width();
    var h = $(window).height();
    var originalLeft = elem.css('left');

    var isPortrait = h > w ? true : false;
    
    if (rect.left < 0 || (!isPortrait && rect.left < w / 2 && rect.right > w / 2)) {
        elem.css('left', 0);
        var newMarginLeft = -8 + parseInt(originalLeft);
        leftStyleString = "margin-left: " + newMarginLeft + 'px;';
        
        adjustLeft = true;
    }

    setTimeout(function() {
        hotword_offsetArrow(elem, adjustTop, topStyleString, adjustRight, rightStyleString, adjustLeft, leftStyleString);
    }, 10);

}

function hotword_offsetArrow(elem, adjustTop, topStyleString, adjustRight, rightStyleString, adjustLeft, leftStyleString) {

    var arrowElement = $('<div id="tooltipArrow" class="tooltipArrow"></div>');
    if (adjustTop && adjustLeft) {
        arrowElement = $('<div id="tooltipArrow" class="tooltipArrow" style="' + leftStyleString + topStyleString + '"></div>');
    } else if (adjustTop && adjustRight) {
        arrowElement = $('<div id="tooltipArrow" class="tooltipArrow" style="' + rightStyleString + topStyleString + '"></div>');
    } else if (adjustTop) {
        arrowElement = $('<div id="tooltipArrow" class="tooltipArrow" style="' + topStyleString + '"></div>');
    } else if (adjustLeft) {
        arrowElement = $('<div id="tooltipArrow" class="tooltipArrow" style="' + leftStyleString + '"></div>');
    } else if (adjustRight) {
        arrowElement = $('<div id="tooltipArrow" class="tooltipArrow" style="' + rightStyleString + '"></div>');
    }
    elem.append(arrowElement);

    if (window.top.ReadiumSDK != null && window.top.ReadiumSDK.reader.plugins.highlights != null)
        window.top.ReadiumSDK.reader.plugins.highlights.redrawAnnotations();
}



// hide tooltips when clicking other areas
$(document).mouseup(function (e) {
    var container = $('.tooltip');
    if (!container.is(e.target) // if the target of the click isn't the container...
        &&
        container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $(".tooltip").removeClass('active');
    }
});

function handleTooltipClick(event) {
    var elem = event.currentTarget;
    var tip,
        originalMarginLeft,
        originalLeft,
        arrowElement,
        rect,
        w,
        h,
        isPortrait = false,
        tooltiptextHeight,
        elemRect,
        offset,
        newMarginLeft,
        newMarginTop,
        rightStyleString,
        leftStyleString,
        topStyleString,
        adjustLeft = false,
        adjustRight = false,
        adjustTop = false;

    if ($(elem).hasClass('active')) {
        $(elem).removeClass('active');
        $(elem).children('.tooltiptext').remove();
    } else {
        $(elem).removeClass('active');
        $(elem).addClass('active');

        var tooltipTextSpan = document.createElement('span');
        tooltipTextSpan.classList.add('tooltiptext');
	    var textBody = $(this).attr('definition');
        tooltipTextSpan.textContent = textBody;

        $(elem).append(tooltipTextSpan);

        hotword_offsetTop($(tooltipTextSpan));

	window.top.PeBL.emitEvent(window.top.PeBL.events.eventPreferred, {
	    name: $(this).text(),
	    type: "hotword",
	    description: textBody
	});
    }
}
