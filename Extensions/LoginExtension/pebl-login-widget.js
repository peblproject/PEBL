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

document.addEventListener("eventLogout", function () {
    $('#loginButt span').removeClass("glyphicon-log-out");
    $('#loginButt span').addClass("glyphicon-log-in");
    $('#loginButt').attr("aria-label", "Login");
    $('#loginButt').attr("title", "Login");
    window.Lightbox.createLoginForm();
});

document.addEventListener("eventLogin", function () {
    $('#loginButt span').addClass("glyphicon-log-out");
    $('#loginButt span').removeClass("glyphicon-log-in");

    $('#loginButt').attr("title", "Logout");
    $('#loginButt').attr("aria-label", "Logout");
    if (window.PeBL)
        window.location.reload();
});

$(document).ready(function() {
    //window.Lightbox.linkedInLogin();
    if (window.PeBL) {
        if (window.Configuration.useLinkedIn) {
            window.Lightbox.linkedInLogin();
        } else {
            window.Lightbox.createLoginForm();
        }
        window.PeBL.network.activate();
    }
});

PeBL.extension.hardcodeLogin = {
    hookLoginButton: function (elementName, loginFn, logoutFn) {
        PeBL.user.getUser(function (userProfile) {
            if (!userProfile)
                Lightbox.createLoginForm();
            else {
                PeBL.emitEvent(PeBL.events.eventLoggedIn, userProfile);
                $('#loginButt span').addClass("glyphicon-log-out");
                $('#loginButt span').removeClass("glyphicon-log-in");
                $('#loginButt').attr("title", "Logout");
                $('#loginButt').attr("aria-label", "Logout");                
            }
        });
        
        $('#' + elementName).on("click", function () {
            PeBL.user.isLoggedIn(function (loggedIn) {
                if (loggedIn) {
                    PeBL.emitEvent(PeBL.events.eventLoggedOut);
                    if (loginFn)
                        loginFn();
                } else {
                    Lightbox.createLoginForm();
                    if (logoutFn)
                        logoutFn();
                }
            });
            return false;
        });
    }
};

window.Lightbox = {
    close : function() {
    var lightBox = document.getElementById('lightBox');
    var dimOverlay = document.getElementById('dimOverlay');
    if (lightBox)
        lightBox.parentNode.removeChild(lightBox);
    if (dimOverlay)
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
        var lrsURL = window.Configuration.lrsUrl;
        var lrsPassword = null;
        var lrsToken = window.Configuration.lrsCredential;
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
    return settingsObject;
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
        PeBL.user.isLoggedIn(function(isLoggedIn) {
            if (!isLoggedIn) {
                window.Lightbox.create("login", false);

                var lightBoxContent = document.getElementById('lightBoxContent');
                var lightBoxContentSecondary = document.getElementById('lightBoxContentSecondary');

                if (window.Configuration.useLinkedIn) {
                    var linkedInButton = document.createElement('button');
                    linkedInButton.classList.add('linkedInButton');
                    linkedInButton.textContent = 'Sign in with LinkedIn';
                    linkedInButton.addEventListener('click', function() {
                        var urlParams = new URLSearchParams(window.location.search);
                        if (urlParams.get('epub'))
                            window.localStorage.setItem('loginRedirect', window.location.href);

                        window.Lightbox.linkedInSignIn();
                    });

                    lightBoxContent.appendChild(linkedInButton);
                }
                
                if (!window.Configuration.useLinkedIn) {
                    var selects = $('<br/>Select your username:<br/><br/><select id="loginUserNameSelector"><option>Learner</option><option>Learner1</option><option>Learner2</option><option>Learner3</option><option>Learner5</option><option>Learner7</option></select>');
                    lightBoxContent.appendChild(selects[0]);
                    lightBoxContent.appendChild(selects[1]);
                    lightBoxContent.appendChild(selects[2]);
                    lightBoxContent.appendChild(selects[3]);
                    lightBoxContent.appendChild(selects[4]);

                    var classSelect = $('<br/><br/><p>Class ID: <input type="text" id="loginClassSelect"></input></p>');
                    $(lightBoxContent).append(classSelect);

                    var teamSelect = $('<br/><br/><p>Team: <input type="text" id="loginTeamSelect"></input></p>');
                    $(lightBoxContent).append(teamSelect);

                    var login = $('<br/><br/><input type="button" value="Login" id="loginUserNameSubmit" />');
                    lightBoxContent.appendChild(login[0]);
                    lightBoxContent.appendChild(login[1]);
                    lightBoxContent.appendChild(login[2]);

                    $("#loginUserNameSubmit").click(function () {
                        var currentTeam = null;
                        if ($('#loginTeamSelect').length > 0) {
                            if ($('#loginTeamSelect').val().trim().length > 0)
                                currentTeam = $('#loginTeamSelect').val();
                        }
                        var currentClass = null;
                        if ($('#loginClassSelect').length > 0) {
                            if ($('#loginClassSelect').val().trim().length > 0) {
                                currentClass = $('#loginClassSelect').val();
                            }
                        }
                        var identity = $("#loginUserNameSelector").val();
                        if (currentClass)
                            identity += ('-' + currentClass);
                        PeBL.emitEvent(PeBL.events.eventLoggedIn,
                               {
                                   identity : identity,
                                   endpoints : [
                                   {
                                           url: window.Configuration.lrsUrl,
                                           token: window.Configuration.lrsCredential
                                   }
                                   ],
                                               registryEndpoint : {
                                       url: "https://peblproject.com/registry/api/downloadContent?guid="
                                   },
                                   currentTeam: currentTeam,
                                   currentClass: currentClass
                               });
                        Lightbox.close();
                    });

                    // var lrsSettingsButton = $('<button id="lrsSettingsButton" onclick="window.Lightbox.displayLRSSettings();">LRS Settings</button>');
                    // lightBoxContent.appendChild(lrsSettingsButton[0]);

                    // var lrsSettingsHeader = $('<h4>Enter either a username and password, or a token.</h4>');
                    // var lrsURLInput = $('<p>LRS URL: <textarea id="lrsURLInput" rows="1" cols="50"></textarea></p>');
                    // var lrsUsernameInput = $('<p>LRS Username: <input type="text" id="lrsUsernameInput" size="30" /></p>');
                    // var lrsPasswordInput = $('<p>LRS Password: <input type="password" id="lrsPasswordInput" size="30" /></p><p>OR</p>');
                    // var lrsTokenInput = $('<p>LRS Token: <textarea type="text" rows="5" cols="50" id="lrsTokenInput"></textarea></p>');
                    // var lrsCancelButton = $('<button id="lrsCancelButton" onclick="window.Lightbox.closeLRSSettings();">Cancel</button>');
                    // var lrsSaveButton = $('<button id="lrsSaveButton" onclick="window.Lightbox.saveLRSSettings();window.Lightbox.closeLRSSettings();">Save</button>');
                    // var lrsDefaultButton = $('<button id="lrsDefaultButton" onclick="window.Lightbox.initDefaultLRSSettings(true);window.Lightbox.displayLRSSettings();">Load Defaults</button>');

                    // lightBoxContentSecondary.appendChild(lrsSettingsHeader[0]);
                    // lightBoxContentSecondary.appendChild(lrsURLInput[0]);
                    // lightBoxContentSecondary.appendChild(lrsUsernameInput[0]);
                    // lightBoxContentSecondary.appendChild(lrsPasswordInput[0]);
                    // lightBoxContentSecondary.appendChild(lrsPasswordInput[1]);
                    // lightBoxContentSecondary.appendChild(lrsTokenInput[0]);
                    // lightBoxContentSecondary.appendChild(lrsCancelButton[0]);
                    // lightBoxContentSecondary.appendChild(lrsSaveButton[0]);
                    // lightBoxContentSecondary.appendChild(lrsDefaultButton[0]);
                }
            }
        });
    },

    uuidv4: function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    buildLinkedInAuthCodeUrl: function (scope, clientId, redirectUri, state) {
        return 'https://www.linkedin.com/oauth/v2/authorization?scope=' + scope + '&' +
            'response_type=code&' +
            'client_id=' + clientId + '&' +
            'redirect_uri=' + redirectUri + '&' +
            'state=' + state;
    },
    apiGetAuthToken: function (clientId, scope, redirectUri) {
        var state = window.Lightbox.uuidv4();
        localStorage.setItem('linkedInOauthState', state);
        window.location.replace(window.Lightbox.buildLinkedInAuthCodeUrl(scope,
            clientId,
            redirectUri,
            state));
    },
    apiGetAccessToken: function (application, authToken, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            console.log('success', xhr);
            if (success) {
                success(JSON.parse(xhr.response));
                localStorage.removeItem('linkedInOauthState');
            }
        });
        xhr.addEventListener('error', function (e) {
            console.log('error', xhr);
            if (failure) {
                failure(e);
                localStorage.removeItem('linkedInOauthState');
            }
        });
        xhr.open('GET',
            window.Configuration.OAuthURL +
            'oauth2/' + application + '/linkedin?authToken=' + authToken + '&d=' + Date.now());
        xhr.send();
    },
    apiGetProfile: function (accessToken, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            console.log('success', xhr);
            if (success) {
                success(JSON.parse(xhr.response), accessToken);
            }
        });
        xhr.addEventListener('error', function (e) {
            console.log('error', xhr);
            if (failure) {
                failure(e);
            }
        });
        xhr.open('GET', window.Configuration.OAuthURL + 'pebl/linkedin/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),address,organizations,phoneNumbers)');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    },
    apiGetOtherProfile: function (accessToken, userId, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            console.log('success', xhr);
            if (success) {
                success(JSON.parse(xhr.response), accessToken);
            }
        });
        xhr.addEventListener('error', function (e) {
            console.log('error', xhr);
            if (failure) {
                failure(e);
            }
        });
        xhr.open('GET', window.Configuration.OAuthURL + 'pebl/linkedin/people/(id:{' + userId + '})');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    },

    linkedInSignIn: function () {
        window.Lightbox.apiGetAuthToken(window.Configuration.OAuthToken,
            'r_liteprofile',
            location.origin);
    },

    linkedInLogin : function() {
        var self = this;
        window.PeBL.user.isLoggedIn(function (loggedIn) {
            if (loggedIn) {

            } else {
                var urlParams = new URLSearchParams(window.location.search);
                var authToken = urlParams.get('code');
                var stateToken = urlParams.get('state');

                if (authToken && stateToken) {
                    if (localStorage.getItem('linkedInOauthState') === stateToken) {
                        localStorage.removeItem('linkedInOauthState');
                        var loginUser = function (profile, accessToken) {
                            var name = profile.firstName.localized['en_US'] + ' ' +
                                profile.lastName.localized['en_US'];
                            var profilePictures = null;
                            if (profile.profilePicture && profile.profilePicture['displayImage~']) {
                                profilePictures = profile.profilePicture['displayImage~'].elements;
                            }

                            var imageToUse = null;
                            if (profilePictures) {
                                imageToUse = profilePictures[0].identifiers[0].identifier;
                            }

                            var userProfile = {
                                identity: profile.id,
                                name: name,
                                preferredName: name,
                                firstName: profile.firstName.localized['en_US'],
                                lastName: profile.lastName.localized['en_US'],
                                avatar: imageToUse,
                                homePage: 'acct:LinkedIn',
                                endpoints: [{
                                    url: window.Configuration.lrsUrl,
                                    token: window.Configuration.lrsCredential
                                }],
                                registryEndpoint: {
                                    url: 'https://peblproject.com/registry/api/downloadContent?guid='
                                },
                                metadata: {
                                    linkedInToken: accessToken
                                }
                            };
                            window.PeBL.emitEvent(window.PeBL.events.eventLoggedIn, userProfile);
                            window.Lightbox.close();
                            var loginRedirect = localStorage.getItem('loginRedirect');
                            if (loginRedirect) {
                                localStorage.removeItem('loginRedirect');
                                window.location.href = loginRedirect;
                            }
                        };

                        window.Lightbox.apiGetAccessToken('pebl',
                            authToken,
                            function (authObj) {
                                window.Lightbox.apiGetProfile(authObj.access_token,
                                    loginUser,
                                    function (error) {
                                        console.log(error);
                                    });
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                }
            }
        });
    },

    openIDLogin : function () {

    var loginButton = $('<input type="submit" value="Login" />');
    
    var loginFrame = $('#loginIFrame');
    if (loginFrame.length == 0) {
        loginFrame = $('<iframe id="loginIFrame" src="about:blank" style="width:100%;margin-bottom:20px;margin-top:30px;height:550px"></iframe>');
        lf = loginFrame;

        loginFrame.off();
        loginFrame.on("load", function (x) {
        var src = window.top.location.protocol + "//" + window.top.location.host;
        var iFrameLocation = loginFrame[0].contentWindow.location;

        if ((iFrameLocation.protocol + "//" + iFrameLocation.host) == src) {            
            var query = iFrameLocation.toString();

            $(document.body).append(loginFrame);
            
            window.Lightbox.close($(document.getElementById('lightBoxContent')));            
            var username = null;
            
            if (query.indexOf("?") != -1) {
            var keyValues = query.substring(query.indexOf("?")+1).split("&");               
            
            for (var i = 0; i < keyValues.length; i++) {
                var kv = keyValues[i].split("=");
                if ((kv[0] == "openid.identity") || (kv[0] == "openid_identity")) {
                username = decodeURIComponent(kv[1]);
                }
            }       
            }
            pebl.loginAsUser(username, "", function (x) {

            });
        }
        });
        
        $(document.body).append(loginFrame);
    } else {
        loginFrame[0].src = "";
    }

    var lightBoxContent = $(document.getElementById('lightBoxContent'));
    if (lightBoxContent.length == 0) {
        window.Lightbox.create("login", false);
        lightBoxContent = $(document.getElementById('lightBoxContent'));
    }
    
    var loginStart = $("#loginRefresh");
    if (loginStart.length == 0)
        loginStart = $('<input id="loginRefresh" type="button" style="margin-top:20px" value="Return To Login Screen" />');
    loginStart.off();
    loginStart.on("click", function () {
        Lightbox.openIDLogin();
    });

    lightBoxContent.append(loginStart);    
    lightBoxContent.append(loginFrame);
    var loginForm = $('#loginFormSubmit');
    if (loginForm.length == 0) {
        loginForm = $('<form id="loginFormSubmit" action="https://people.extension.org/opie" method="GET">' +
               '<input type="hidden" name="openid.identity" value="http://specs.openid.net/auth/2.0/identifier_select"/>' +
              '<input type="hidden" name="openid.claimed_id" value="http://specs.openid.net/auth/2.0/identifier_select"/>' +  
              '<input type="hidden" name="openid.mode" value="checkid_setup"/>' +
              '<input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0" />' +
              '<input type="hidden" name="openid.return_to" id="returnValue" value="" />' +
              '</form>');
        
        $(loginFrame[0].contentDocument.body).append(loginForm);
        loginFrame[0].contentDocument.getElementById("returnValue").value = window.top.location.protocol + "//" + window.top.location.host;
    }
    
    loginFrame[0].contentDocument.getElementById("loginFormSubmit").submit();       
    },
    
    createLoginButton : function (element) {
    var loginButton = $('<input type="submit" value="Login" />');
    
    var loginFrame = $('#loginIFrame');
    var loginFunction;
    var logoutFunction;
    if (loginFrame.length == 0) {
        loginFrame = $('<iframe id="loginIFrame" src="about:blank" style="width:100%;margin-bottom:20px;margin-top:30px;height:550px"></iframe>');

        lf = loginFrame;       
        
        $(document.body).append(loginFrame);
    } else {
        loginFrame[0].src = "";
    }

    loginFrame.off();
    loginFrame.on("load", function (x) {
        var src = window.top.location.protocol + "//" + window.top.location.host;
        var iFrameLocation = loginFrame[0].contentWindow.location;

        if ((iFrameLocation.protocol + "//" + iFrameLocation.host) == src) {            
        var query = iFrameLocation.toString();

        $(document.body).append(loginFrame);
        
        window.Lightbox.close($(document.getElementById('lightBoxContent')));            

        var username = null;
        
        if (query.indexOf("?") != -1) {
            var keyValues = query.substring(query.indexOf("?")+1).split("&");                          
            
            for (var i = 0; i < keyValues.length; i++) {
            var kv = keyValues[i].split("=");
            if ((kv[0] == "openid.identity") || (kv[0] == "openid_identity")) {
                username = decodeURIComponent(kv[1]);
            }
            }       
        }
        pebl.loginAsUser(username, "", logoutFunction);
        }
    });

    logoutFunction = function () {
        loginButton.off();
        loginButton.val("Logout");
        loginButton.on("click", function () {
        loginButton.val("Login");
        loginButton.off();
        loginButton.on("click", loginFunction);
        pebl.logout();
        });
    }
    
    loginFunction = function (){
        var lightBoxContent = $(document.getElementById('lightBoxContent'));
        if (lightBoxContent.length == 0) {
        window.Lightbox.create("login", true);
        lightBoxContent = $(document.getElementById('lightBoxContent'));
        }
        var loginStart = $('#loginRefresh');
        if (loginStart.length == 0)
        loginStart = $('<input id="loginRefresh" type="button" style="margin-top:20px" value="Return To Login Screen" />');
        loginStart.off();
        loginStart.on("click", function () {
        Lightbox.openIDLogin();
        });

        lightBoxContent.append(loginStart);
        lightBoxContent.append(loginFrame);
        var loginForm = $('#loginFormSubmit');
        if (loginForm.length == 0) {
        loginForm = $('<form id="loginFormSubmit" action="https://people.extension.org/opie" method="GET">' +
                   '<input type="hidden" name="openid.identity" value="http://specs.openid.net/auth/2.0/identifier_select"/>' +
                  '<input type="hidden" name="openid.claimed_id" value="http://specs.openid.net/auth/2.0/identifier_select"/>' +  
                  '<input type="hidden" name="openid.mode" value="checkid_setup"/>' +
                  '<input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0" />' +
                  '<input type="hidden" name="openid.return_to" id="returnValue" value="" />' +
                  '</form>');
        
        $(loginFrame[0].contentDocument.body).append(loginForm);
        loginFrame[0].contentDocument.getElementById("returnValue").value = window.top.location.protocol + "//" + window.top.location.host;
        }

        loginFrame[0].contentDocument.getElementById("loginFormSubmit").submit();
    };

    loginButton.off();
    if (window.pebl && !pebl.userManager.loggedIn()) {    
        loginButton.on("click", loginFunction);
        
        $('#' + element).append(loginButton);
    } else {
        logoutFunction()
        
        $('#' + element).append(loginButton);
    }
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

function dosomething() {
    window.pebl.openBook(window.ReadiumInterop.getEmbeddedBookName(), function() {
    window.pebl.initializeToc(window.staticTOC);
    });
}

function useOpenIDLoginButton(elementName) {
    window.PEBLbuttonLogin = true;
    
    Lightbox.createLoginButton(elementName);
}



// Lightbox.initDefaultLRSSettings();
