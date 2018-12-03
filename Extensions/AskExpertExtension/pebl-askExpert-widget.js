var globalPebl = window.top.PeBL;

var askExpert = {};

globalPebl.extension.askExpert = askExpert;

askExpert.createAskExpert = function(element) {
		//clearUI();
	    //Create the askExpert page
	    var askContainer = document.createElement('div');
	    askContainer.id = 'askContainer';
	    askContainer.classList.add('askContainer');

	    var closeButton = document.createElement('i');
	    closeButton.classList.add('fa', 'fa-times', 'askExpertCloseButton');
	    closeButton.addEventListener('click', function() {
	    	$('#askContainer').remove();
	    });

	    askContainer.appendChild(closeButton);

	    var wrapper = document.createElement('div');
	    wrapper.classList.add('responsive-wrapper');
	    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

	    var askFrame = document.createElement('iframe');
	    askFrame.id = 'askFrame';
	    askFrame.classList.add('askFrame');
	    askFrame.src = 'https://ask.extension.org/ask';
	    wrapper.appendChild(askFrame);
	    askContainer.appendChild(wrapper);
	    element.appendChild(askContainer);
}