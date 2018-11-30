var globalPebl = window.top.PeBL;

globalPebl.extension.knowledgeNetwork = {
	frameIsReady: false,
	searchTerms: [],

	receiveMessage: function(event) {
		var data = event.data;
	    var obj;
	    try {
	        obj = JSON.parse(data);
	    } catch(e) {

	    }

	    if (data === 'ready') {
	        globalPebl.extension.knowledgeNetwork.frameIsReady = true;
	    } else if (obj && obj.message === "pullResource") {
	        //pullResource(obj.target, obj.location, obj.url, obj.docType, obj.name, obj.externalURL);
	    } else if (obj && obj.message === "iframeUpdate") {
	        $('.registryFrame').css('height', obj.height);
	    } else if (data === 'registryBackToTop') {
	        $('#registryContainer > div')[0].scroll(0,0);
	    }
	},

	searchType: function(type) {
		var waitingForReady = setInterval(function() {
            if (globalPebl.extension.knowledgeNetwork.frameIsReady) {
                clearInterval(waitingForReady);
                var iframe = document.getElementById('registryFrame');
                var obj = {
                    "messageType": "Find",
                    "findType": [type],
                    "searchTerms": searchTerms
                }
                var message = JSON.stringify(obj);
                iframe.contentWindow.postMessage(message, '*');
            }
        }, 500);
	},

	pullResource: function(target, location, url, docType, name, externalURL)  {
		//TODO
	    // if (currentPrefix) {
	    //     globalPebl.storage.getCurrentBook(function(book) {
	    //         globalPebl.eventPulled(book, target, location, currentPrefix, url, docType, name, externalURL);
	    //     });
	    // } else {
	    //     setTimeout(function() {
	    //         pullResource(target, location, url, docType, name, externalURL);
	    //     }, 1000);
	    // }
	},

	createRegistrySearch: function(element) {
		globalPebl.extension.knowledgeNetwork.frameIsReady = false;
		var currentPage = window.location.pathname.split('/').pop().slice(0, -6).substring(5);
	    //clearUI();
	    //Create the registrySearch page
	    var registryContainer = document.createElement('div');
	    registryContainer.id = 'registryContainer';
	    registryContainer.classList.add('registryContainer');
	    registryContainer.setAttribute('style', 'overflow: auto;');

	   	var closeButton = document.createElement('i');
	    closeButton.classList.add('fa', 'fa-times', 'registryCloseButton');
	    closeButton.addEventListener('click', function() {
	    	$('#registryContainer').remove();
	    });

	    var wrapper = document.createElement('div');
	    wrapper.classList.add('responsive-wrapper');
	    wrapper.setAttribute('style', '-webkit-overflow-scrolling: touch; overflow: auto;');

	    var registryFrame = document.createElement('iframe');
	    registryFrame.id = 'registryFrame';
	    registryFrame.classList.add('registryFrame');
	    registryFrame.src = 'https://peblproject.com/registry/#welcome';
	    registryFrame.name = 'registryFrame';
	    registryFrame.setAttribute('scrolling', 'no');
	    wrapper.appendChild(registryFrame);

	    registryContainer.appendChild(closeButton);
	    registryContainer.appendChild(wrapper);
	    element.appendChild(registryContainer);

	    //Post Messages
	    var waitingForReady = setInterval(function() {
	        if (globalPebl.extension.knowledgeNetwork.frameIsReady) {
	        	globalPebl.user.getUser(function(user) {
	        		clearInterval(waitingForReady);
		            var iframe = document.getElementById('registryFrame');
		            var currentUser = user.identity;
		            var obj = {
		                "messageType": "Login",
		                "user": currentUser,
		                "currentPage": currentPage
		            }
		            var message = JSON.stringify(obj);
		            iframe.contentWindow.postMessage(message, '*');
		            //Script on registry page would login as that user
	        	});
	        }
	    }, 500);

	    window.addEventListener("message", globalPebl.extension.knowledgeNetwork.receiveMessage, false);
	}
}