var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var hotword = {};
if (globalPebl)
    globalPebl.extension.hotword = hotword;

jQuery(document).ready(function() {
    //Find inDesign shortcodes and replace with actual pebl shortcodes
    // jQuery("body").children().each(function () {
    //     jQuery(this).html( jQuery(this).html().replace(/\[\[\[(type=”hotword”) (word=”.*?”) (description=”.*?”)]]]/g, function(x) {
    //         var hotword = x.match(/word=”(.*?)”/);
    //         var description = x.match(/description=”(.*?)”/);

    //         var widgetCode = '<i class="hotword_hotwordExtension" id="someID" data-hotword="' + hotword[1] + '" data-hotwordText="' + description[1] + '"></i>';
    //         return widgetCode;
    //     }) );
    // });
    jQuery(document.body).on('click', '.tooltip', function(event) {
        hotword.handleTooltipClick(event);
    });
    jQuery('.hotword_hotwordExtension, .peblExtension[data-peblextension="hotword"]').each(function() {
        var insertID = jQuery(this)[0].getAttribute('id');
        var hotwordMain = jQuery(this)[0].getAttribute('data-hotword');
        var hotwordText = jQuery(this)[0].getAttribute('data-hotwordText') || jQuery(this)[0].getAttribute('data-hotwordtext');
        hotword.createHotword(insertID, hotwordMain, hotwordText);
    });
});

hotword.createHotword = function(insertID, tooltip, tooltipText) {
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

hotword.offsetTop = function(elem) {
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
        hotword.offsetRight(elem, adjustTop, topStyleString);
    }, 10);

}

hotword.offsetRight = function(elem, adjustTop, topStyleString) {
    var adjustRight = false;
    var rightStyleString = null;

    var rect = elem[0].getBoundingClientRect();
    var w = jQuery(window).width();
    var marginLeft = parseInt(elem.css('marginLeft'));

    if (rect.right > w) {
        var offset = w - rect.right;
        elem.css('margin-left', offset);
        var newMarginLeft = -8 + (marginLeft - offset);
        rightStyleString = "margin-left: " + newMarginLeft + 'px;';
        adjustRight = true;
    }

    setTimeout(function() {
        hotword.offsetLeft(elem, adjustTop, topStyleString, adjustRight, rightStyleString);
    }, 10);
}

hotword.offsetLeft = function(elem, adjustTop, topStyleString, adjustRight, rightStyleString) {
    var adjustLeft = false;
    var leftStyleString = null;

    var rect = elem[0].getBoundingClientRect();
    var w = jQuery(window).width();
    var h = jQuery(window).height();
    var originalLeft = elem.css('left');

    var isPortrait = h > w ? true : false;
    
    if (rect.left < 0 || (!isPortrait && rect.left < w / 2 && rect.right > w / 2)) {
        elem.css('left', 0);
        var newMarginLeft = -8 + parseInt(originalLeft);
        leftStyleString = "margin-left: " + newMarginLeft + 'px;';
        
        adjustLeft = true;
    }

    setTimeout(function() {
        hotword.offsetArrow(elem, adjustTop, topStyleString, adjustRight, rightStyleString, adjustLeft, leftStyleString);
    }, 10);

}

hotword.offsetArrow = function(elem, adjustTop, topStyleString, adjustRight, rightStyleString, adjustLeft, leftStyleString) {

    var arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow"></div>');
    if (adjustTop && adjustLeft) {
        arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow" style="' + leftStyleString + topStyleString + '"></div>');
    } else if (adjustTop && adjustRight) {
        arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow" style="' + rightStyleString + topStyleString + '"></div>');
    } else if (adjustTop) {
        arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow" style="' + topStyleString + '"></div>');
    } else if (adjustLeft) {
        arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow" style="' + leftStyleString + '"></div>');
    } else if (adjustRight) {
        arrowElement = jQuery('<div id="tooltipArrow" class="tooltipArrow" style="' + rightStyleString + '"></div>');
    }
    elem.append(arrowElement);
}



// hide tooltips when clicking other areas
jQuery(document).mouseup(function (e) {
    var container = jQuery('.tooltip');
    if (!container.is(e.target) // if the target of the click isn't the container...
        &&
        container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        jQuery(".tooltip").removeClass('active');
    }
});

hotword.handleTooltipClick = function(event) {
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

    if (jQuery(elem).hasClass('active')) {
        jQuery(elem).removeClass('active');
        jQuery(elem).children('.tooltiptext').remove();
    } else {
        jQuery(elem).removeClass('active');
        jQuery(elem).addClass('active');

        var tooltipTextSpan = document.createElement('span');
        tooltipTextSpan.classList.add('tooltiptext');
	    var textBody = jQuery(elem).attr('definition');
        tooltipTextSpan.textContent = textBody;

        jQuery(elem).append(tooltipTextSpan);

        hotword.offsetTop(jQuery(tooltipTextSpan));

	globalPebl.emitEvent(globalPebl.events.eventPreferred, {
	    name: jQuery(elem).text(),
	    type: "hotword",
	    description: textBody
	});
    }
}
