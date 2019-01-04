var globalPebl = window.parent.PeBL;

var knowledgeNetwork = {};

globalPebl.extension.knowledgeNetwork = knowledgeNetwork;

knowledgeNetwork.frameIsReady = false;
knowledgeNetwork.searchTerms = [];

knowledgeNetwork.receiveMessage = function(event) {
	var data = event.data;
    var obj;
    try {
        obj = JSON.parse(data);
    } catch(e) {

    }

    if (data === 'ready') {
        knowledgeNetwork.frameIsReady = true;
    } else if (obj && obj.message === "pullResource") {
        knowledgeNetwork.pullResource(obj.target, obj.location, obj.url, obj.docType, obj.name, obj.externalURL);
    } else if (obj && obj.message === "iframeUpdate") {
        $('.registryFrame').css('height', obj.height);
    } else if (data === 'registryBackToTop') {
        $('#registryContainer > div')[0].scroll(0,0);
    }
}

knowledgeNetwork.pullResource = function(target, location, url, docType, name, externalURL)  {
    knowledgeNetwork.getCurrentPrefix(function(currentPrefix, currentSection) {
        globalPebl.storage.getCurrentBook(function(book) {
            var data = {
                target: target,
                location: location,
                card: currentPrefix,
                book: book,
                externalURL: externalURL,
                docType: docType,
                name: name,
                url: url
            }
            globalPebl.emitEvent(globalPebl.events.newReference, data);
        });
    });
}

knowledgeNetwork.getCurrentPrefix = function(callback) {
    var page = $('body')[0].baseURI.split('/').pop();
    globalPebl.utils.getToc(function(obj) {
        Object.keys(obj).forEach(function(section) {
            Object.keys(obj[section]).forEach(function(subsection) {
                if (obj[section][subsection].location && !obj[section][subsection].fake && obj[section][subsection].location == page) {
                    currentPrefix = obj[section][subsection].prefix;
                    currentSection = "Section" + obj[section].Section.prefix;
                    callback(currentPrefix, currentSection);
                    return;
                } else if (obj[section][subsection].pages) {
                    Object.keys(obj[section][subsection].pages).forEach(function(key) {
                        if (obj[section][subsection].pages[key].location && obj[section][subsection].pages[key].location == page) {
                            currentPrefix = obj[section][subsection].pages[key].prefix;
                            currentSection = "Section" + obj[section].Section.prefix;
                            callback(currentPrefix, currentSection);
                            return;
                        }
                   });
                }
            });
        });
    });
}

knowledgeNetwork.searchType = function(type) {
	var waitingForReady = setInterval(function() {
        if (knowledgeNetwork.frameIsReady) {
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
}

knowledgeNetwork.createRegistrySearch = function(element) {
	knowledgeNetwork.frameIsReady = false;
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
        if (knowledgeNetwork.frameIsReady) {
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

    window.addEventListener("message", knowledgeNetwork.receiveMessage, false);
}