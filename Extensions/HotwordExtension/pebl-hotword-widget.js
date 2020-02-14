/*
Copyright 2020 Eduworks Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);
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
    jQuery('.hotword_hotwordExtension, .peblExtension[data-peblextension="hotword"], .peblExtension[data-peblExtension="hotword"]').each(function() {
        var insertID = jQuery(this)[0].getAttribute('id');
        var hotwordMain = jQuery(this)[0].getAttribute('data-hotword');
        var hotwordText = jQuery(this)[0].getAttribute('data-hotwordText') || jQuery(this)[0].getAttribute('data-hotwordtext');
        var hotwordClass = this.hasAttribute('data-hotwordClass') ? this.getAttribute('data-hotwordClass') : null;
        hotword.createHotword(insertID, hotwordMain, hotwordText, hotwordClass);
    });
});

hotword.createHotword = function(insertID, tooltip, tooltipText, tooltipClass) {
    var tooltipSpan,
        tooltipTextSpan,
        insertLocation;

    tooltipSpan = document.createElement('span');
    tooltipSpan.id = insertID;
    tooltipSpan.classList.add('tooltip');
    if (tooltipClass)
        tooltipSpan.classList.add(tooltipClass);
    tooltipSpan.textContent = tooltip.replace('&',' and ');
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

    if (tooltiptextHeight > (elemRect.top - 70) || rect.top < 0) {
        elem.css('bottom', 'inherit');
        var newMarginTop = (-4 - elem.innerHeight());
        topStyleString = "border-top-width: 0px;border-bottom-width: 8px;border-bottom-style: solid;border-bottom-color: var(--dark-cream);margin-top: " + newMarginTop + "px;";
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
    var h = jQuery(window).height();
    var marginLeft = parseInt(elem.css('marginLeft'));
    var isPortrait = h > w ? true : false;
    var columnGap = $('html').css('column-gap');

    if (rect.right > w) {
        var offset = w - rect.right;
        elem.css('margin-left', offset);
        var newMarginLeft = -8 + (marginLeft - offset);
        rightStyleString = "margin-left: " + newMarginLeft + 'px;';
        adjustRight = true;
    } else if ((!isPortrait && rect.right > w / 2 && rect.left < w / 2)) {
        var offset = (isPortrait ? w : w / 2) - rect.right - (isPortrait ? 0 : (columnGap ? parseInt(columnGap) : 0));
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
    var activeTooltips = jQuery('.tooltip.active');
    activeTooltips.each(function (i, elem) {
        globalPebl.emitEvent(globalPebl.events.eventHid, {
            name: elem.textContent,
            target: elem.id,
            type: 'hotword'
        });
    });
    jQuery(".tooltip").removeClass('active');
    jQuery(".tooltip").children().remove();
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

        globalPebl.emitEvent(globalPebl.events.eventHid, {
            name: elem.textContent,
            target: elem.id,
            type: 'hotword'
        });
    } else {
        jQuery(elem).removeClass('active');
        jQuery(elem).addClass('active');

        var tooltipTextSpan = document.createElement('span');
        tooltipTextSpan.classList.add('tooltiptext');
        var textBody = jQuery(elem).attr('definition');
        tooltipTextSpan.textContent = textBody.replace('&',' and ');

        jQuery(elem).append(tooltipTextSpan);

        hotword.offsetTop(jQuery(tooltipTextSpan));

        globalPebl.emitEvent(globalPebl.events.eventShowed, {
            name: elem.textContent,
            target: elem.id,
            type: 'hotword'
        });
    }
}
