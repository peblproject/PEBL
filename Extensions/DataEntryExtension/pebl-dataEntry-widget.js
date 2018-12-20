var globalPebl = window.top.PeBL;
var globalReadium = window.top.READIUM;

var dataEntry = {};

globalPebl.extension.dataEntry = dataEntry;

$(document).ready(function() {    
    $('.dataEntryExtension').each(function() {
        var prompt = $(this)[0].getAttribute('data-prompt');
        var id = $(this)[0].getAttribute('data-id');
        var insertID = $(this)[0].getAttribute('id');
        var forms = JSON.parse($(this)[0].getAttribute('data-forms'));
        var sharing = $(this)[0].getAttribute('data-sharing');
        var displayMode = $(this)[0].getAttribute('data-displayMode');
        dataEntry.createDataEntry(insertID, prompt, id, forms, sharing, displayMode);
    });
});

dataEntry.invalidFormActive = false;

dataEntry.activeEntries = {};

dataEntry.invalidForm = function() {
    //TODO
    if (!dataEntry.invalidFormActive) {
        dataEntry.invalidFormActive = true;
        window.alert('Fill out the entire form');
    }
}

dataEntry.createDataEntry = function(insertID, question, id, forms, sharing, displayMode) {
    globalPebl.user.getUser(function(userProfile) {
        globalPebl.utils.getGroupMemberships(function(groups) {
            var dataEntryID;

            //Thread is either group + id, user + id, or id
            if (sharing === 'team' && groups.length > 0) {
                dataEntryID = groups[0].groupName + '-' + id;
            } else if (sharing === 'private') {
                dataEntryID = userProfile.identity + '-' + id;
            } else {
                dataEntryID = id;
            }

            var newDataEntry = {};
            dataEntry.activeEntries[id] = newDataEntry;

            var calloutDiv = document.createElement('div');
            calloutDiv.classList.add('dataEntryCallout');

            var header = document.createElement('div');
            header.classList.add('dataEntryHeader');

            calloutDiv.appendChild(header);

            var formElement = document.createElement('form');
            //Prevent default form submit
            formElement.onsubmit = function() {
                return false;
            }


            var questionParagraph = document.createElement('p');
            questionParagraph.innerHTML = question;

            formElement.appendChild(questionParagraph);

            //Keep track of textareas and radio buttons that get added
            var textareas = new Set();
            var radios = new Set();
            var checkboxes = new Set();

            for (var i = 0; i < forms.length; i++) {
                var subID = dataEntryID + '_' + i;
                //Create textarea fields
                if (forms[i].type === 'text') {
                    var textResponses = $('<div id="' + dataEntry.comboID(subID, "responseBox") + '" class="textResponses" style="display:none;"><div><!--<a class="showMore">Show more...</a>--></div></div>');
                    var textInput = $('<div class="textInput" style="display:none;"><label id="textDetailText">' + forms[i].prompt + '</label><textarea data-responseBox="' + dataEntry.comboID(subID, "responseBox") + '" data-prompt="' + forms[i].prompt + '" required="required" oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + subID + '"></textarea></div>');
                    var text = $('<div class="textBox"></div>');
                    text.append(textInput);
                    text.append(textResponses);
                    
                    $(formElement).append(text);
                    textInput.slideDown();

                    textareas.add(subID);
                } else if (forms[i].type === 'table') {
                    //Create table fields
                    var tableContainer = document.createElement('div');
                    tableContainer.classList.add('dataEntryTableContainer');

                    if (forms[i].prompt) {
                        var tablePrompt = document.createElement('span');
                        tablePrompt.classList.add('dataEntryTablePrompt');
                        tablePrompt.textContent = forms[i].prompt;

                        tableContainer.appendChild(tablePrompt);
                    }
                    

                    var table = document.createElement('table');
                    //Add a class to the table of specified
                    if (forms[i].tableClass)
                        table.classList.add(forms[i].tableClass);

                    //Add a header row to the table if specified
                    if (forms[i].tableHeader) {
                        var tableHeader = document.createElement('thead');
                        for (var j = 0; j < forms[i].tableHeader.length; j++) {
                            var th = document.createElement('th');
                            th.textContent = forms[i].tableHeader[j];
                            tableHeader.appendChild(th);
                        }
                        table.appendChild(tableHeader);
                    }

                    for (var k = 0; k < forms[i].tableRows.length; k++) {
                        var tr = document.createElement('tr');
                        var th = document.createElement('th');
                        th.textContent = forms[i].tableRows[k].rowHeader;
                        tr.appendChild(th);
                        for (var l = 0; l < forms[i].tableRows[k].inputs.length; l++) {
                            var td = document.createElement('td');
                            if (forms[i].tableRows[k].inputs[l].type === "radio") {
                                var input = document.createElement('input');
                                input.type = 'radio';
                                input.setAttribute('prompt', forms[i].tableRows[k].rowHeader);
                                input.setAttribute('responseBox', dataEntry.comboID(subID, 'table_radio', k, l, 'responseBox'));
                                input.name = subID + '_table_radio_' + k;
                                input.value = forms[i].tableRows[k].inputs[l].value;
                                input.id = dataEntry.comboID(subID, 'table_radio', k, l);
                                input.setAttribute("required", "required");
                                input.oninvalid = dataEntry.invalidForm;
                                radios.add(input.name);

                                var responseBox = document.createElement('div');
                                responseBox.classList.add('radioResponses');
                                responseBox.id = dataEntry.comboID(subID, 'table_radio', k, l, 'responseBox');
                                responseBox.setAttribute('style', 'display: none');

                                td.appendChild(input);
                                td.appendChild(responseBox);
                            }
                            tr.appendChild(td)
                        }
                        table.appendChild(tr);
                    }

                    tableContainer.appendChild(table);
                    formElement.appendChild(tableContainer);
                } else if (forms[i].type === 'checkbox') {
                    var checkboxContainer = document.createElement('div');
                    checkboxContainer.classList.add('dataEntryCheckboxContainer');

                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = forms[i].prompt;
                    checkbox.id = subID;
                    checkbox.setAttribute('data-responseBox', dataEntry.comboID(subID, 'responseBox'));

                    var checkboxResponseContainer = document.createElement('div');
                    checkboxResponseContainer.classList.add('dataEntryCheckboxResponseContainer');
                    checkboxResponseContainer.id = dataEntry.comboID(subID, 'responseBox');


                    checkboxes.add(subID);

                    var textSpan = document.createElement('span');
                    textSpan.textContent = forms[i].prompt;

                    if (forms[i].input) {
                        if (forms[i].input.type === 'text') {
                            var input = document.createElement('input');
                            input.type = 'text';
                            input.id = dataEntry.comboID(subID, 'checkboxInput');
                            input.placeholder = forms[i].input.placeholder;
                            
                            textSpan.appendChild(input);
                            checkbox.setAttribute('data-moreInput', dataEntry.comboID(subID, 'checkboxInput'));
                        }
                    }

                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(checkboxResponseContainer);
                    checkboxContainer.appendChild(textSpan);

                    formElement.appendChild(checkboxContainer);
                }
            }

            var messageHandle = dataEntry.dataMessageHandler(dataEntryID);
            globalPebl.subscribeThread(dataEntryID, false, messageHandle);

            var formSubmit = $('<button class="dataEntryFormSubmit">Submit</button>');
            formSubmit.on('click', function() {
                dataEntry.invalidFormActive = false;
                var validForm = formElement.reportValidity();
                if (validForm) {
                    var messages = [];
                    //Submit the form
                    if (textareas.size > 0) {
                        var textareaArray = Array.from(textareas);
                        for (var i = 0; i < textareaArray.length; i++) {
                            var elem = document.getElementById(textareaArray[i]);
                            var val = elem.value;
                            var prompt = elem.getAttribute('data-prompt');
                            var responseBox = elem.getAttribute('data-responseBox');
                            var message = {
                                "prompt": prompt,
                                "thread": textareaArray[i],
                                "text": val,
                                "responseBox": responseBox,
                                "type": "text"
                            }
                            messages.push(message);
                            //dataEntry.createThread(textareaArray[i], prompt, elem, true);
                        }
                    }

                    if (radios.size > 0) {
                        var radioArray = Array.from(radios);
                        for (var j = 0; j < radioArray.length; j++) {
                            var val = $('input[name="' + radioArray[j] + '"]:checked').val();
                            var prompt = $('input[name="' + radioArray[j] + '"]:checked').attr('prompt');
                            var responseBox = $('input[name="' + radioArray[j] + '"]:checked').attr('responseBox');
                            //Content of the message is the value of the radio button
                            var message = {
                                "prompt" : prompt,
                                "thread" : radioArray[j],
                                "text" : val,
                                "responseBox": responseBox,
                                "type": "radio"
                            };
                            messages.push(message);
                            // globalPebl.emitEvent(globalPebl.events.newMessage,
                            //         message);
                        }
                    }

                    if (checkboxes.size > 0) {
                        var checkboxArray = Array.from(checkboxes);
                        for (var k = 0; k < checkboxArray.length; k++) {
                            var checkbox = document.getElementById(checkboxArray[k]);
                            var prompt = checkbox.value;
                            var thread = checkboxArray[k];
                            var responseBox = checkbox.getAttribute('data-responseBox');
                            var text;
                            if (checkbox.checked === true) {
                                if (checkbox.hasAttribute('data-moreInput'))
                                    text = prompt + document.getElementById(checkbox.getAttribute('data-moreInput')).value;
                                else
                                    text = prompt;
                            } else {
                                text = '';
                            }
                            var message = {
                                "prompt": prompt,
                                "thread": thread,
                                "text": text,
                                "responseBox": responseBox,
                                "type": "checkbox"
                            };
                            messages.push(message);
                            // globalPebl.emitEvent(globalPebl.events.newMessage,
                            //         message);
                        }
                    }

                    var finalMessage = {
                        "prompt": "DataEntry",
                        "thread": dataEntryID,
                        "text": JSON.stringify(messages)
                    }

                    globalPebl.emitEvent(globalPebl.events.newMessage,
                        finalMessage);

                    newDataEntry.viewMode();
                }
            });

            //toggle viewMode for this dataEntry
            newDataEntry.viewMode = function() {
                dataEntry.handleResize(function() {
                    $(calloutDiv).find('textarea').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('.textResponses').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('input[type=radio]').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('.radioResponses').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('input[type=checkbox]').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('.dataEntryCheckboxResponseContainer').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('.dataEntryFormSubmit').each(function() {
                        $(this).hide();
                    });
                });
            }

            //toggle editMode for this dataEntry
            newDataEntry.editMode = function() {
                dataEntry.handleResize(function() {
                    $(calloutDiv).find('textarea').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('.textResponses').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('input[type=radio]').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('.radioResponses').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('input[type=checkbox]').each(function() {
                        $(this).show();
                    });

                    $(calloutDiv).find('.dataEntryCheckboxResponseContainer').each(function() {
                        $(this).hide();
                    });

                    $(calloutDiv).find('.dataEntryFormSubmit').each(function() {
                        $(this).show();
                    });
                });
            }

            var viewModeButton = document.createElement('div');
            viewModeButton.classList.add('dataEntryViewModeButton');
            viewModeButton.addEventListener('click', function() {
                newDataEntry.viewMode();
            });

            var viewModeButtonIcon = document.createElement('i');
            viewModeButtonIcon.classList.add('fa', 'fa-eye');

            viewModeButton.appendChild(viewModeButtonIcon);

            var editModeButton = document.createElement('div');
            editModeButton.classList.add('dataEntryEditModeButton');
            editModeButton.addEventListener('click', function() {
                newDataEntry.editMode();
            });

            var editModeButtonIcon = document.createElement('i');
            editModeButtonIcon.classList.add('fa', 'fa-edit');

            editModeButton.appendChild(editModeButtonIcon);


            header.appendChild(viewModeButton);
            if (!displayMode || displayMode !== 'viewOnly')
                header.appendChild(editModeButton);

            $(formElement).append(formSubmit);
            calloutDiv.appendChild(formElement);

            var insertLocation = document.getElementById(insertID);

            insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
            insertLocation.remove();

            if (displayMode && displayMode === 'viewOnly')
                newDataEntry.viewMode();
        });
    });
}

//Message handler for standard textarea messages
dataEntry.messageHandler = function(message, userProfile) {
    if (!document.getElementById(message.id)) {          
        var mine = userProfile.identity == message.name;
        var userIcon = document.createElement('i');
        userIcon.classList.add('fa', 'fa-user');
        var userIdBox = $('<span class="userId"></span>');
        userIdBox.text(message.name);
        var timestampBox = $('<span class="timestamp"></span>');
        timestampBox.text(new Date(message.timestamp).toLocaleString());
        var textBox = $('<p class="message"></p>');
        textBox.text(message.text);
        var messageContainer = $('<div id="' + message.id  + '" class="' + (mine?"your ":"") + 'response"></div>');
        messageContainer.append($(userIcon));
        messageContainer.append(userIdBox);
        messageContainer.append(timestampBox);
        messageContainer.append(textBox);

        var responseBox = document.getElementById(message.responseBox);
        
        $(responseBox).prepend(messageContainer);
    }
}

dataEntry.checkboxMessageHandler = function(message, userProfile) {
    var mine = userProfile.identity == message.name;
    var checkbox = document.getElementById(message.thread);
    var responseBox = document.getElementById(message.responseBox);
    var text = message.text;
    //Additional input after the checkbox
    var temp = text.replace(message.prompt, '');
    //Fill the checkboxes for the user with current data
    if (mine) {
        if (!checkbox.hasAttribute('data-timestamp')) {
            //Not checked
            if (text === '') {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
                if (temp.length > 0)
                    document.getElementById(checkbox.getAttribute('data-moreInput')).value = temp;
            }
            checkbox.setAttribute('data-timestamp', message.timestamp);
        } else {
            var oldTimestamp = checkbox.getAttribute('data-timestamp');
            var newTimestamp = message.timestamp;
            if (new Date(newTimestamp) > new Date(oldTimestamp)) {
                if (text === '') {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                    if (temp.length > 0)
                        document.getElementById(checkbox.getAttribute('data-moreInput')).value = temp;
                }
                checkbox.setAttribute('data-timestamp', message.timestamp);
            } else {
                //don't update the checkbox
            }
        }
    }

    //Populate the viewmode list

    var checkboxViewElem = document.createElement('span');
    checkboxViewElem.id = dataEntry.comboID(message.thread, message.name);
    checkboxViewElem.setAttribute('data-timestamp', message.timestamp);
    checkboxViewElem.textContent = message.name;
    if (temp.length > 0)
        checkboxViewElem.textContent += ' - "' + temp + '"';

    var elem = document.getElementById(dataEntry.comboID(message.thread, message.name));
    //If it already exists
    if (elem) {
        var oldTimestamp = elem.getAttribute('data-timestamp');
        var newTimestamp = message.timestamp;
        if (new Date(newTimestamp) > new Date(oldTimestamp)) {
            //This is more recent, remove the old one
            $(elem).remove();
            if (text === '')
                checkboxViewElem.style.display = 'none';
            $(responseBox).append(checkboxViewElem);
        } else {
            //This is an old message, do nothing
        } 
    } else {
        $(responseBox).append(checkboxViewElem);
    }
}

//Message handler for radio button messages
dataEntry.radioMessageHandler = function(message, userProfile) {
    var mine = userProfile.identity == message.name;
    var elem = document.getElementById(dataEntry.comboID(message.thread, message.name));

    var messageContainer = document.createElement('div');
    messageContainer.id = dataEntry.comboID(message.thread, message.name);
    messageContainer.setAttribute('data-timestamp', message.timestamp);
    var messageSpan = document.createElement('span');
    messageSpan.textContent = message.name;

    var responseBox = document.getElementById(message.responseBox);

    messageContainer.appendChild(messageSpan);
    if (elem) {
        var oldTimestamp = elem.getAttribute('data-timestamp');
        var newTimestamp = message.timestamp;
        if (new Date(newTimestamp) > new Date(oldTimestamp)) {
            $(elem).remove();
            $(responseBox).append(messageContainer);
        } else {
            //don't add it
        }
    } else {
        $(responseBox).append(messageContainer);
    }
}

//Get the Combined Messages and hand them off to specific handlers
dataEntry.dataMessageHandler = function(thread) {
    return function (newMessages) {
        newMessages.sort(dataEntry.sortMessages);
        console.log(newMessages);
        globalPebl.user.getUser(function(userProfile) {
            if (userProfile) {
                for (var i = 0; i < newMessages.length; i++) {
                    var message = newMessages[i];
                    var messageArray = JSON.parse(message.text);
                    for (var j = 0; j < messageArray.length; j++) {
                        var embeddedMessage = messageArray[j];
                        embeddedMessage.timestamp = message.timestamp;
                        embeddedMessage.id = dataEntry.comboID(message.id, embeddedMessage.thread);
                        embeddedMessage.name = message.name;
                        if (embeddedMessage.type === 'text') {
                            dataEntry.messageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'radio') {
                            dataEntry.radioMessageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'checkbox') {
                            dataEntry.checkboxMessageHandler(embeddedMessage, userProfile);
                        }
                    }
                }
            }
        });
    }
}

dataEntry.createThread = function(thread, prompt, element, moreInput) {
    var chatInputBox = $(element).parent();
    var responseBox = chatInputBox.siblings('.chatResponses');
    var input = $(element).parent().find("textarea").val();
    if (input.trim() != "") {
        var message = {
            "prompt" : prompt,
            "thread" : thread,
            "text" : input
        };
        globalPebl.emitEvent(globalPebl.events.newMessage,
                             message);
    }
}

dataEntry.handleResize = function(callback) {
    $('#learnlet__watermark').hide();
    var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    callback();
    globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
    $('#learnlet__watermark').show();
}

dataEntry.sortMessages = function(a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}

dataEntry.comboID = function(...strings) {
    var newID = null;
    for (var string of strings) {
        if (newID === null)
            newID = string;
        else
            newID = newID + '_' + string;
    }

    return newID;
}
