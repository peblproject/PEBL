//Accepts single image path, or array of image paths
function createFigure(img, title, caption) {
	var figure,
		image,
		imageElement,
		figureCaption,
		span,
		paragraph,
		scripts,
		insertLocation;

	figure = document.createElement('figure');

	if (img.constructor === Array) {
		for (image in img) {
			imageElement = document.createElement('img');
			imageElement.src = img[image];
			figure.appendChild(imageElement);
		}
	} else {
		imageElement = document.createElement('img');
		imageElement.src = img;
		figure.appendChild(imageElement);
	}

	figureCaption = document.createElement('figcaption');

	span = document.createElement('span');
	span.classList.add('fig');
	span.innerHTML = title;

	paragraph = document.createElement('p');
	paragraph.innerHTML = caption;

	figureCaption.appendChild(span);
	figureCaption.appendChild(paragraph);

	figure.appendChild(figureCaption);

	scripts = document.getElementsByTagName('script');
    insertLocation = scripts[scripts.length - 1];

    insertLocation.parentNode.insertBefore(figure, insertLocation);
    insertLocation.remove();
}