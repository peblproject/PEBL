var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var carousel = {};

if (globalPebl)
    globalPebl.extension.carousel = carousel;

$(document).ready(function () {
    $('.carousel_carouselExtension, .peblExtension[data-peblextension="carousel"]').each(function() {
        var insertID = $(this)[0].getAttribute('id');
        var imagesArray = JSON.parse($(this)[0].getAttribute('data-images'));
        var captionsArray = JSON.parse($(this)[0].getAttribute('data-captions'));
        var zoomable = $(this)[0].hasAttribute('data-zoomable') ? $(this)[0].getAttribute('data-zoomable') : null;
        carousel.createCarousel(insertID, imagesArray, captionsArray, zoomable);
    });
});

carousel.animationInProgress = false;

carousel.createCarousel = function (insertID, imagesArray, captionsArray, zoomable) {
    // carousel outter wrapper to attach everything to before attaching to body
    var carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel_wrapper');

    var carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel_carouselContainer');
    carouselContainer.id = insertID;

    var carouselHeader = document.createElement('div');
    carouselHeader.classList.add('carousel_carouselHeader');

    var carouselBody = document.createElement('div');
    carouselBody.classList.add('carousel_carouselBody');

    var controlsContainer = document.createElement('div');
    controlsContainer.classList.add('carousel_controlsContainer');

    var leftButtonContainer = document.createElement('div');
    leftButtonContainer.classList.add('carousel_leftButtonContainer');

    var leftButton = document.createElement('button');
    leftButton.classList.add('carousel_leftButton');
    leftButton.addEventListener('click', function () {
        carousel.prevSlide($(this));
    });

    var leftButtonImage = document.createElement('i');
    leftButtonImage.classList.add('fa', 'fa-arrow-left', 'carousel_leftButtonImage');

    leftButton.appendChild(leftButtonImage);

    var rightButtonContainer = document.createElement('div');
    rightButtonContainer.classList.add('carousel_rightButtonContainer');

    var rightButton = document.createElement('button');
    rightButton.classList.add('carousel_rightButton');
    rightButton.addEventListener('click', function () {
        carousel.nextSlide($(this));
    });

    var rightButtonImage = document.createElement('i');
    rightButtonImage.classList.add('fa', 'fa-arrow-right', 'carousel_rightButtonImage');
    rightButton.appendChild(rightButtonImage);

    leftButtonContainer.appendChild(leftButton);
    rightButtonContainer.appendChild(rightButton);

    var dotsContainer = document.createElement('div');
    dotsContainer.classList.add('carousel_dotsContainer');

    controlsContainer.appendChild(leftButtonContainer);
    controlsContainer.appendChild(dotsContainer);
    controlsContainer.appendChild(rightButtonContainer);
    carouselHeader.appendChild(controlsContainer);
    carouselContainer.appendChild(carouselBody);
    carouselContainer.appendChild(carouselHeader);
    carouselWrapper.appendChild(carouselContainer);

    for (var i in imagesArray) {

        var dotWrapper = document.createElement('div');
        dotWrapper.classList.add('carousel_dotWrapper');
        var dot = document.createElement('button');
        dot.classList.add('carousel_dot');
        dot.setAttribute('data-position', i);

        dot.addEventListener('click', function () {
            carousel.goToSlide(this.getAttribute('data-position'));
        });

        var dotImage = document.createElement('i');
        if (i == 0)
            dotImage.classList.add('fa', 'fa-circle', 'carousel_dotImage');
        else
            dotImage.classList.add('far', 'fa-circle', 'carousel_dotImage');

        dot.appendChild(dotImage);
        dotWrapper.appendChild(dot);
        dotsContainer.appendChild(dotWrapper);

        var slide = document.createElement('div');
        var imageContainer = document.createElement('div');
        var image = document.createElement('img');

        slide.classList.add('carousel_slide');
        slide.setAttribute('data-position', i);
        imageContainer.classList.add('carousel_imageContainer');
        image.classList.add('carousel_image');
        if (zoomable && zoomable === 'true') {
            image.classList.add('zoomable');        
        }
        image.src = imagesArray[i];
        imageContainer.appendChild(image);
        slide.appendChild(imageContainer);

        if (captionsArray.length > 0) {
            var captionContainer = document.createElement('div');
            captionContainer.classList.add('carousel_captionContainer');

            var caption = document.createElement('span');
            caption.classList.add('carousel_caption');
            caption.textContent = captionsArray[i];

            captionContainer.appendChild(caption);

            slide.appendChild(captionContainer);
        } else {
            slide.classList.add('carousel_imageOnly');
        }

        carouselBody.appendChild(slide);
    }

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(carouselWrapper, insertLocation);
    insertLocation.remove();
}

carousel.prevSlide = function (elem) {
    console.log("carousel ", carousel);
    // get the count of div.carouself_dotWrappers
    if (!carousel.animationInProgress) {
        carousel.animationInProgress = true;
        var buttonLeft = elem.parent();
        var buttonChildren = buttonLeft.siblings('.carousel_dotsContainer').children();
        var totalSlides = buttonChildren.length;
        var currentSlideDot = buttonLeft.siblings('.carousel_dotsContainer').find('.fa.fa-circle').first().parent();
        var currentSlidePosition = parseInt(currentSlideDot.attr('data-position'));
        var newSlidePosition = currentSlidePosition == 0 ? totalSlides - 1 : currentSlidePosition - 1;
        var controlsContainer = buttonLeft.parent();
        var carouselHeader = controlsContainer.parent();
        var carouselBody = carouselHeader.prev();
        var currentSlide = carouselBody.children().first();
        var lastSlide = carouselBody.children().last()
        lastSlide[0].addEventListener('transitionend', function (e) {
            e.target.removeEventListener(e.type, arguments.callee);
            carouselBody.prepend(lastSlide);
            currentSlideDot.children().first().removeClass('fa').addClass('far');
            currentSlideDot.parent().parent().find('button[data-position="' + newSlidePosition + '"]').first().children().first().removeClass('far').addClass('fa');
            lastSlide.removeClass('carousel_animatePrev');
            carousel.animationInProgress = false;

        });
        lastSlide.addClass('carousel_animatePrev');
    }

}
carousel.nextSlide = function (elem) {
    if (!carousel.animationInProgress) {
        carousel.animationInProgress = true;
        var buttonRight = elem.parent();
        var buttonChildren = buttonRight.siblings('.carousel_dotsContainer').children();
        var totalSlides = buttonChildren.length;
        var currentSlideDot = buttonRight.siblings('.carousel_dotsContainer').find('.fa.fa-circle').first().parent();
        var currentSlidePosition = parseInt(currentSlideDot.attr('data-position'));
        var newSlidePosition = currentSlidePosition == totalSlides - 1 ? 0 : currentSlidePosition + 1;
        var controlsContainer = buttonRight.parent();
        var carouselHeader = controlsContainer.parent();
        var carouselBody = carouselHeader.prev();
        var currentSlide = carouselBody.children().first();
        var lastSlide = carouselBody.children().last();
        currentSlide[0].addEventListener('transitionend', function (e) {
            e.target.removeEventListener(e.type, arguments.callee);
            carouselBody.append(currentSlide);
            currentSlideDot.children().first().removeClass('fa').addClass('far');
            currentSlideDot.parent().parent().find('button[data-position="' + newSlidePosition + '"]').first().children().first().removeClass('far').addClass('fa');
            currentSlide.removeClass('carousel_animateNext');
            carousel.animationInProgress = false;
        });
        currentSlide.addClass('carousel_animateNext');
    }
}


carousel.goToSlide = function (n) {
    var slide = parseInt(n);
    console.log("Slide " + slide);
}