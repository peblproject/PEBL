function createImageLightBox() {
    var lightBox,
        lightBoxContent,
        dimOverlay;

    lightBox = document.createElement('div');
    lightBox.id = 'lightBox';
    lightBox.classList.add('lightBoxImage');
    
    lightBoxContent = document.createElement('div');
    lightBoxContent.classList.add('lightBoxContent');
    lightBoxContent.classList.add('lightBoxContentImage');
    lightBoxContent.id = 'lightBoxContent';
    lightBox.appendChild(lightBoxContent);

    dimOverlay = document.createElement('div');
    dimOverlay.id = 'dimOverlay';
    dimOverlay.classList.add('dimOverlay');

    document.body.appendChild(dimOverlay);
    document.body.appendChild(lightBox);

    $('.dimOverlay').on('click', function() {
        if ($('#lightBox').is(':visible')) {
            closeLightBox();
        }
    });
}

function openImageLightBox(img) {
    var lightBoxContent,
        lightBox,
        imageElement,
        imageUrl;

    createImageLightBox('image');

    lightBoxContent = document.getElementById('lightBoxContent');
    lightBox = document.getElementById('lightBox');
    imageUrl = img;

    imageElement = document.createElement('img');
    imageElement.onload = function() {
        lightBox.style.width = this.width + 'px';
        lightBox.style.height = this.height + 'px';
    }
    imageElement.src = imageUrl;
    imageElement.id = 'imageInLightBox';
    imageElement.classList.add('imageInLightBox');



    lightBoxContent.appendChild(imageElement);

}

function closeLightBox() {
    var lightBox = document.getElementById('lightBox');
    var dimOverlay = document.getElementById('dimOverlay');
    setTimeout(function() {
        dimOverlay.classList.add('overlayTransitionOut');
    }, 200);
    lightBox.parentNode.removeChild(lightBox);
    dimOverlay.parentNode.removeChild(dimOverlay);
}

$('img').on('click', function() {
    var element,
        img;

    element = $(this);
    img = element.prop('src');

    openImageLightBox(img);
});