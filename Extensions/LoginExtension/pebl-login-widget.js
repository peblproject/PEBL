

$(document).ready(function() {
    if (window.ReadiumSDK == null && window.top.ReadiumSDK == null) {
	PEBL.start(false, function(readypebl) {
	    pebl = readypebl;
	    if (!window.PEBLbuttonLogin)
		pebl.login(function() {
		    dosomething();
		});
	});
    }
});



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

    displayLRSSettings : function() {
    	document.getElementById('lightBoxContent').style.display = 'none';
    	document.getElementById('lightBoxContentSecondary').style.display = 'block';
    	var settingsObject = window.Lightbox.getLRSSettings();
    	$('#lrsURLInput').val(settingsObject.lrsURL);
    	$('#lrsPasswordInput').val(settingsObject.lrsPassword);
    	$('#lrsTokenInput').val(settingsObject.lrsToken);
      $('#lrsUsernameInput').val(settingsObject.lrsUsername);
    },

    closeLRSSettings : function() {
    	document.getElementById('lightBoxContentSecondary').style.display = 'none';
    	document.getElementById('lightBoxContent').style.display = 'block';
    },

    saveLRSSettings : function() {
    	var lrsURL = $('#lrsURLInput').val();
    	var lrsPassword = $('#lrsPasswordInput').val();
    	var lrsToken = $('#lrsTokenInput').val();
      var lrsUsername = $('#lrsUsernameInput').val();

    	var settingsObject = {
    		"lrsURL": lrsURL,
    		"lrsPassword": lrsPassword,
    		"lrsToken": lrsToken,
        "lrsUsername": lrsUsername
    	};
    	localStorage.setItem("LRSAuth", JSON.stringify(settingsObject));
    },

    initDefaultLRSSettings : function(reset) {
    	var lrsURL = "https://lrs.peblproject.com/data/xAPI/";
    	var lrsPassword = null;
    	var lrsToken = "NTYwNGUyMjk5NTU5NzQ2ZmE4NjMxN2RiMzAwYTU5NTIyNTBkZWM2OTo5YzI5ZjU0MTgyMDhiZmZiNmJkZjczZjcwNzNiNTdlNzA5OTQ2YTU1";
	var lrsUsername = null;
    	var currentSettings = window.Lightbox.getLRSSettings();

    	var settingsObject = {
    		"lrsURL": lrsURL,
    		"lrsPassword": lrsPassword,
    		"lrsToken": lrsToken,
        "lrsUsername": lrsUsername
    	};
    	if (reset || currentSettings == null)
    		localStorage.setItem("LRSAuth", JSON.stringify(settingsObject));
    },

    getLRSSettings : function() {
    	var settingsObject = localStorage.getItem("LRSAuth");
    	return JSON.parse(settingsObject);
    },

    getLRSURL : function(callback) {
    	var settingsObject = window.Lightbox.getLRSSettings();
    	callback(settingsObject.lrsURL);
    },

    getLRSPassword : function(callback) {
    	var settingsObject = window.Lightbox.getLRSSettings();
    	var lrsPassword;
    	if (settingsObject.lrsPassword != null && settingsObject.lrsPassword.length > 0)
    		lrsPassword = settingsObject.lrsPassword;
    	else
    		lrsPassword = null;
    	callback(lrsPassword);
    },

    getLRSToken : function(callback) {
    	var settingsObject = window.Lightbox.getLRSSettings();
    	var lrsToken;
    	if (settingsObject.lrsToken != null && settingsObject.lrsToken.length > 0)
    		lrsToken = settingsObject.lrsToken;
    	else
    		lrsToken = null;
    	callback(lrsToken);
    },

    getLRSUsername : function(callback) {
      var settingsObject = window.Lightbox.getLRSSettings();
      var lrsUsername;
      if (settingsObject.lrsUsername != null && settingsObject.lrsUsername.length > 0)
        lrsUsername = settingsObject.lrsUsername;
      else
        lrsUsername = null;
      callback(lrsUsername);
    },

    createLoginForm : function () {
	window.Lightbox.create("login", false);

	var lightBoxContent = document.getElementById('lightBoxContent');
	var lightBoxContentSecondary = document.getElementById('lightBoxContentSecondary');
	
	var selects = $('<br/>Select your username:<br/><br/><select id="loginUserNameSelector"><option>Learner</option><option>Learner1</option><option>Learner2</option><option>Learner3</option><option>Learner5</option><option>Learner7</option></select>');
	lightBoxContent.appendChild(selects[0]);
	lightBoxContent.appendChild(selects[1]);
	lightBoxContent.appendChild(selects[2]);
	lightBoxContent.appendChild(selects[3]);
	lightBoxContent.appendChild(selects[4]);

	var login = $('<br/><br/><input type="button" value="Login" id="loginUserNameSubmit" />');
	lightBoxContent.appendChild(login[0]);
	lightBoxContent.appendChild(login[1]);
	lightBoxContent.appendChild(login[2]);

	var lrsSettingsButton = $('<button id="lrsSettingsButton" onclick="window.Lightbox.displayLRSSettings();">LRS Settings</button>');
	lightBoxContent.appendChild(lrsSettingsButton[0]);

	var lrsSettingsHeader = $('<h4>Enter either a username and password, or a token.</h4>');
	var lrsURLInput = $('<p>LRS URL: <textarea id="lrsURLInput" rows="1" cols="50"></textarea></p>');
	var lrsUsernameInput = $('<p>LRS Username: <input type="text" id="lrsUsernameInput" size="30" /></p>');
	var lrsPasswordInput = $('<p>LRS Password: <input type="password" id="lrsPasswordInput" size="30" /></p><p>OR</p>');
	var lrsTokenInput = $('<p>LRS Token: <textarea type="text" rows="5" cols="50" id="lrsTokenInput"></textarea></p>');
	var lrsCancelButton = $('<button id="lrsCancelButton" onclick="window.Lightbox.closeLRSSettings();">Cancel</button>');
	var lrsSaveButton = $('<button id="lrsSaveButton" onclick="window.Lightbox.saveLRSSettings();window.Lightbox.closeLRSSettings();">Save</button>');
	var lrsDefaultButton = $('<button id="lrsDefaultButton" onclick="window.Lightbox.initDefaultLRSSettings(true);window.Lightbox.displayLRSSettings();">Load Defaults</button>');

	lightBoxContentSecondary.appendChild(lrsSettingsHeader[0]);
	lightBoxContentSecondary.appendChild(lrsURLInput[0]);
	lightBoxContentSecondary.appendChild(lrsUsernameInput[0]);
	lightBoxContentSecondary.appendChild(lrsPasswordInput[0]);
	lightBoxContentSecondary.appendChild(lrsPasswordInput[1]);
	lightBoxContentSecondary.appendChild(lrsTokenInput[0]);
	lightBoxContentSecondary.appendChild(lrsCancelButton[0]);
	lightBoxContentSecondary.appendChild(lrsSaveButton[0]);
	lightBoxContentSecondary.appendChild(lrsDefaultButton[0]);
    },

    createLoginButton : function (element) {
	var loginForm = $('<form action="https://people.extension.org/opie" method="GET">' +
 	'<input type="hidden" name="openid.identity" value="http://specs.openid.net/auth/2.0/identifier_select"/>' +
	'<input type="hidden" name="openid.claimed_id" value="http://specs.openid.net/auth/2.0/identifier_select"/>' + 
	'<input type="hidden" name="openid.mode" value="checkid_setup"/>' +
	'<input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0" />' +
	'<input type="hidden" name="openid.return_to" id="loginReturn" value="" />' +
	'<input id="openIDLoginButton" type="submit" value="Login" onclick="document.getElementById(\'loginReturn\').value = window.top.location.toString();" />' +
      '</form>');

	document.getElementById(element).appendChild(loginForm[0]);
    },

    createLoginFormWithFields : function () {
	window.Lightbox.create("login", false);

	var lightBoxContent = $(document.getElementById('lightBoxContent'));
	
	var username = $('<br/><span>Moodle Login Form</span><br/><input type="text" id="loginUserName" placeholder="Username" />');
	lightBoxContent.append(username);
	var password = $('<br/><input type="password" id="loginPassword" placeholder="Password" />');
	lightBoxContent.append(password);
	var error = $('<br/><span id="loginError" style="color:red;display:none;">Invalid username or password.</span>');
	lightBoxContent.append(error);
	
	var login = $('<br/><br/><input type="button" value="Login" id="loginUserNameSubmit" /><br/>');
	lightBoxContent.append(login);
    },
    
    create : function (lightBoxType, allowClickOut) {
	var lightBox,
        lightBoxContent,
        lightBoxContentSecondary,
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
	lightBoxContentSecondary = document.createElement('div');
	lightBoxContentSecondary.id = 'lightBoxContentSecondary';
	lightBoxContentSecondary.style.display = 'none';
	if (lightBoxType === 'image') {
            lightBoxContent.classList.add('lightBoxContentImage');
	}
	lightBoxContent.id = 'lightBoxContent';
	lightBox.appendChild(lightBoxContent);
	lightBox.appendChild(lightBoxContentSecondary);

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

