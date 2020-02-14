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

var figure = {};
if (globalPebl)
	globalPebl.extension.figure = figure;

jQuery(document).ready(function() {
	jQuery('.figure_figureExtension, .peblExtension[data-peblextension="figure"], .peblExtension[data-peblExtension="figure"]').each(function() {
		var insertID = jQuery(this)[0].getAttribute('id');
		var img = JSON.parse(jQuery(this)[0].getAttribute('data-img'));
		var title = jQuery(this)[0].getAttribute('data-title');
		var caption = jQuery(this)[0].getAttribute('data-caption');
		var zoomable = jQuery(this)[0].hasAttribute('data-zoomable') ? jQuery(this)[0].getAttribute('data-zoomable') : null;
		figure.createFigure(insertID, img, title, caption, zoomable);
	});
});

//Accepts single image path, or array of image paths
figure.createFigure = function(insertID, img, title, caption, zoomable) {
	var figure,
		image,
		imageElement,
		figureCaption,
		span,
		paragraph,
		insertLocation;

	figure = document.createElement('figure');

	if (img.constructor === Array) {
		for (image in img) {
			imageElement = document.createElement('img');
			imageElement.src = img[image];
			if (zoomable && zoomable === 'true') {		
				imageElement.classList.add('zoomable');		
			}
			figure.appendChild(imageElement);
		}
	} else {
		imageElement = document.createElement('img');
		imageElement.src = img;
		if (zoomable && zoomable === 'true') {		
				imageElement.classList.add('zoomable');		
			}
		figure.appendChild(imageElement);
	}

	figureCaption = document.createElement('figcaption');

	span = document.createElement('span');
	span.classList.add('fig');
	span.innerHTML = title.replace('&',' and ');

	paragraph = document.createElement('p');
	paragraph.innerHTML = caption.replace('&',' and ');

	figureCaption.appendChild(span);
	figureCaption.appendChild(paragraph);

	figure.appendChild(figureCaption);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(figure, insertLocation);
    insertLocation.remove();
}