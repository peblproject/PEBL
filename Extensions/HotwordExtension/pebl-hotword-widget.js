function createHotword(tooltip, tooltipText) {
    var tooltipSpan,
        tooltipTextSpan,
        scripts,
        insertLocation;

    tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('tooltip');
    tooltipSpan.textContent = tooltip;
    tooltipSpan.setAttribute('definition', tooltipText);

    scripts = document.getElementsByTagName('script');
    insertLocation = scripts[scripts.length - 1];

    insertLocation.parentNode.insertBefore(tooltipSpan, insertLocation);
    insertLocation.remove();
    $('.tooltip').off();
    $('.tooltip').on('click', handleTooltipClick);
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

function handleTooltipClick() {
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

    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).children('.tooltiptext').remove();
    } else {
        $('.tooltip').removeClass('active');
        $(this).addClass('active');

        var tooltipTextSpan = document.createElement('span');
        tooltipTextSpan.classList.add('tooltiptext');
        tooltipTextSpan.textContent = $(this).attr('definition');


        $(this).append(tooltipTextSpan);

        tip = $(this).children('.tooltiptext');
        
        tip.removeAttr('style'); // reset offsets
        tip.css('margin', 0); // reset
        originalMarginLeft = tip.css('margin-left');
        originalLeft = tip.css('left');
        rect = tip[0].getBoundingClientRect();
        w = $(window).width();
        h = $(window).height();
        //Determine how device is oriented
        if (h > w) {
            isPortrait = true;
        }
        //console.log(rect);
        //console.log(w);
        tooltiptextHeight = tip.height();
        elemRect = this.getBoundingClientRect();
        
        if (rect.right > w) {
            offset = w - rect.right;
            tip.css('margin-left', offset);
            newMarginLeft = -8 + (originalMarginLeft - offset);
            rightStyleString = "margin-left: " + newMarginLeft + 'px;';
            adjustRight = true;
            //console.log('offset left: ' + offset);
        }
        if (rect.left < 0 || (!isPortrait && rect.left < w / 2 && rect.right > w / 2)) {
            tip.css('left', 0);
            newMarginLeft = -8 + parseInt(originalLeft);
            leftStyleString = "margin-left: " + newMarginLeft + 'px;';
            
            adjustLeft = true;
            //console.log('offset right: ' + offset);
        }
        if (tooltiptextHeight > elemRect.top || rect.top < 0) {
            tip.css('bottom', 'inherit');
            newMarginTop = (-4 - tip.innerHeight());
            topStyleString = "border-top-width: 0px;border-bottom-width: 8px;border-bottom-style: solid;border-bottom-color: rgb(85, 85, 85);margin-top: " + newMarginTop + "px;";
            adjustTop = true;
            //console.log('offset top: ' + offset);
        }

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
        } else {
            arrowElement = $('<div id="tooltipArrow" class="tooltipArrow"></div>');
        }

        tip.append(arrowElement);
        
    }
    if (window.top.ReadiumSDK != null)
            window.top.ReadiumSDK.reader.plugins.highlights.redrawAnnotations();
}