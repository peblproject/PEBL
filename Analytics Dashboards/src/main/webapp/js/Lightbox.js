/*
  function openDiscussionLightbox(question, chatButton) {
  var question,
  questionBox,
  questionBoxText,
  element,
  lightBoxContent;

  createLightBox('discussion');
  
  question = question;

  questionBox = document.createElement('div');
  questionBox.classList.add('discussionQuestionBox');
  questionBoxText = document.createElement('p');
  questionBoxText.classList.add('discussionQuestionBoxText');
  questionBoxText.innerHTML = question;
  questionBox.appendChild(questionBoxText);

  lightBoxContent = document.getElementById('lightBoxContent');
  lightBoxContent.appendChild(questionBox);

  //createDiscussionBox wants a jquery object
  element = $('.lightBoxContent');

  createDiscussionBox(element, chatButton);
  }


  function openImageLightBox(img) {
  var lightBoxContent,
  lightBox,
  imageElement,
  imageUrl;

  createLightBox('image');

  lightBoxContent = document.getElementById('lightBoxContent');
  lightBox = document.getElementById('lightBox');
  imageUrl = img;

  imageElement = document.createElement('img');
  imageElement.onload = function() {
  lightBox.style.width = this.width + 'px';
  lightBox.style.height = this.height + 'px';
  };
  imageElement.src = imageUrl;
  imageElement.id = 'imageInLightBox';
  imageElement.classList.add('imageInLightBox');



  lightBoxContent.appendChild(imageElement);

  }
*/
window.Lightbox = {
    close : function() {
	var lightBox = document.getElementById('lightBox');
	var dimOverlay = document.getElementById('dimOverlay');
	lightBox.parentNode.removeChild(lightBox);
	dimOverlay.parentNode.removeChild(dimOverlay);
    },

    addElement : function (element) {
	var lightBoxContent = document.getElementById('lightBoxContent');
	if (lightBoxContent != null)
	    lightBoxContent.appendChild(element);
    },

    clear : function () {
	var lightBoxContent = document.getElementById('lightBoxContent');
	if (lightBoxContent != null)
	    lightBoxContent.innerHTML = "";
    },

    createLoginForm : function () {
	window.Lightbox.create("login", false);

	var lightBoxContent = document.getElementById('lightBoxContent');
  var selects;
	if (window.location.pathname == "/interface/teacher.html")
    selects = $('<br/>Select your username:<br/><br/><select id="loginUserNameSelector"><option>MCSCT</option><option>EWS</option><option>MSTP</option><option>SNCOA</option><option>CDET</option><option>TBS</option><option>MCIS</option></select>');
  else
    selects = $('<br/>Select your username:<br/><br/><select id="loginUserNameSelector"><option>MCSCT1</option><option>MCSCT2</option><option>MCSCT3</option><option>MCSCT4</option><option>MCSCT5</option><option>EWS1</option><option>EWS2</option><option>EWS3</option><option>EWS4</option><option>EWS5</option><option>MSTP1</option><option>MSTP2</option><option>MSTP3</option><option>MSTP4</option><option>MSTP5</option><option>SNCOA1</option><option>SNCOA2</option><option>SNCOA3</option><option>SNCOA4</option><option>SNCOA5</option><option>CDET1</option><option>CDET2</option><option>CDET3</option><option>CDET4</option><option>CDET5</option><option>TBS1</option><option>TBS2</option><option>TBS3</option><option>TBS4</option><option>TBS5</option><option>MCIS1</option><option>MCIS2</option><option>MCIS3</option><option>MCIS4</option><option>MCIS5</option><option>Learner</option><option>Learner1</option><option>Learner2</option><option>Learner3</option><option>Learner5</option><option>Learner7</option></select>');
	lightBoxContent.appendChild(selects[0]);
	lightBoxContent.appendChild(selects[1]);
	lightBoxContent.appendChild(selects[2]);
	lightBoxContent.appendChild(selects[3]);
	lightBoxContent.appendChild(selects[4]);

	var login = $('<br/><br/><input type="button" value="Login" id="loginUserNameSubmit" />');
	lightBoxContent.appendChild(login[0]);
	lightBoxContent.appendChild(login[1]);
	lightBoxContent.appendChild(login[2]);
    },
    
    create : function (lightBoxType, allowClickOut) {
	var lightBox,
        lightBoxContent,
        dimOverlay;

	lightBox = document.createElement('div');
	lightBox.id = 'lightBox';
	if (lightBoxType === 'discussion') {
            lightBox.classList.add('lightBox');
	} else if (lightBoxType ==='image') {
            lightBox.classList.add('lightBoxImage');
	} else if (lightBoxType ==='login') {
	    lightBox.classList.add('lightBox');
	    lightBox.classList.add('lightBoxLoginForm');
	}
	
	lightBoxContent = document.createElement('div');
	lightBoxContent.classList.add('lightBoxContent');
	if (lightBoxType === 'image') {
            lightBoxContent.classList.add('lightBoxContentImage');
	}
	lightBoxContent.id = 'lightBoxContent';
	lightBox.appendChild(lightBoxContent);

	dimOverlay = document.createElement('div');
	dimOverlay.id = 'dimOverlay';
	dimOverlay.classList.add('dimOverlay');

	document.body.appendChild(dimOverlay);
	document.body.appendChild(lightBox);

	$('.dimOverlay').on('click', function() {
            if ($('#lightBox').is(':visible')) {
		if (allowClickOut)
		    window.Lightbox.close();
            }
	});
    }
}
