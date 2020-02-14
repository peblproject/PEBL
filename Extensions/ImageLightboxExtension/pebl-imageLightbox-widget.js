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