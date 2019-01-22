var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

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

//Prevents invalid form alert from appearing multiple times on a single submit
dataEntry.invalidFormActive = false;

//Each data entry has its own state variables and functions
dataEntry.activeEntries = {};

//Creates a textarea
dataEntry.createTextEntry = function(id, form, activeEntry) {
    var textResponses = $('<div id="' + dataEntry.comboID(id, "responseBox") + '" class="textResponses unofficialView"><div><!--<a class="showMore">Show more...</a>--></div></div>');
    var textOfficialResponses = $('<div id="' + dataEntry.comboID(id, "responseBoxOfficial") + '" class="textResponses officialView"><div><!--<a class="showMore">Show more...</a>--></div></div>')
    var textInput = $('<div class="textInput"><label id="textDetailText">' + form.prompt + '</label><textarea class="edit" data-responseBoxOfficial="' + dataEntry.comboID(id, "responseBoxOfficial") + '" data-responseBox="' + dataEntry.comboID(id, "responseBox") + '" data-prompt="' + form.prompt + '" required="required" oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + id + '"></textarea></div>');
    var text = $('<div class="textBox"></div>');
    text.append(textInput);
    text.append(textResponses);
    text.append(textOfficialResponses);

    //Add the id to the set, used when submitting
    activeEntry.textareas.add(id);

    return text;
}

//Creates a table of radio buttons
dataEntry.createRadioEntry = function(id, form, activeEntry) {
    var tableContainer = document.createElement('div');
    tableContainer.classList.add('dataEntryTableContainer');

    //If there is a prompt, add it
    if (form.prompt) {
        var tablePrompt = document.createElement('span');
        tablePrompt.classList.add('dataEntryTablePrompt');
        tablePrompt.textContent = form.prompt;

        tableContainer.appendChild(tablePrompt);
    }


    var table = document.createElement('table');
    //Add a class to the table of specified
    if (form.tableClass)
        table.classList.add(form.tableClass);

    //Add a header row to the table if specified
    if (form.tableHeader) {
        var tableHeader = document.createElement('thead');
        for (var j = 0; j < form.tableHeader.length; j++) {
            var th = document.createElement('th');
            th.textContent = form.tableHeader[j];
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
    }

    //Add each row to the table
    for (var k = 0; k < form.tableRows.length; k++) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        th.textContent = form.tableRows[k].rowHeader;
        tr.appendChild(th);
        //Add each input thats part of that row
        for (var l = 0; l < form.tableRows[k].inputs.length; l++) {
            var td = document.createElement('td');
            //Only radio buttons at this time
            if (form.tableRows[k].inputs[l].type === "radio") {
                var input = document.createElement('input');
                input.type = 'radio';
                input.classList.add('edit');
                input.setAttribute('prompt', form.tableRows[k].rowHeader);
                input.setAttribute('data-title', form.prompt)
                input.setAttribute('data-responseBox', dataEntry.comboID(id, 'table_radio', k, l, 'responseBox'));
                input.setAttribute('data-responseBoxOfficial', dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxOfficial'))
                input.name = id + '_table_radio_' + k;
                input.value = form.tableRows[k].inputs[l].value;
                input.id = dataEntry.comboID(id, 'table_radio', k, l);
                input.setAttribute("required", "required");
                input.oninvalid = dataEntry.invalidForm;
                //Add the radio group to the set, used when submitting.
                activeEntry.radios.add(input.name);

                //This is the viewmode container
                var responseBox = document.createElement('div');
                responseBox.classList.add('radioResponses', 'unofficialView');
                responseBox.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBox');

                //This is the official viewmode container
                var responseBoxOfficial = document.createElement('div');
                responseBoxOfficial.classList.add('radioResponses', 'officialView');
                responseBoxOfficial.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxOfficial');

                td.appendChild(input);
                td.appendChild(responseBox);
                td.appendChild(responseBoxOfficial);
            }
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);

    return tableContainer;
}

//Create a checkbox field
dataEntry.createCheckboxEntry = function(id, form, activeEntry) {
    var checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('dataEntryCheckboxContainer');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = form.prompt;
    checkbox.id = id;
    checkbox.classList.add('edit');
    checkbox.setAttribute('data-responseBox', dataEntry.comboID(id, 'responseBox'));
    checkbox.setAttribute('data-responseBoxOfficial', dataEntry.comboID(id, 'responseBoxOfficial'));

    //This is the viewmode container
    var checkboxResponseContainer = document.createElement('div');
    checkboxResponseContainer.classList.add('dataEntryCheckboxResponseContainer', 'unofficialView');
    checkboxResponseContainer.id = dataEntry.comboID(id, 'responseBox');

    //This is the official viewmode container
    var checkboxResponseContainerOfficial = document.createElement('div');
    checkboxResponseContainerOfficial.classList.add('dataEntryCheckboxResponseContainer', 'officialView');
    checkboxResponseContainerOfficial.id = dataEntry.comboID(id, 'responseBoxOfficial');

    //Add the id to the set, used when submitting.
    activeEntry.checkboxes.add(id);

    //The text to the right of the checkbox
    var textSpan = document.createElement('span');
    textSpan.textContent = form.prompt;

    //If specified, add an additional text input after the text, which gets appended to the full text.
    if (form.input) {
        if (form.input.type === 'text') {
            var input = document.createElement('input');
            input.type = 'text';
            input.classList.add('edit');
            input.id = dataEntry.comboID(id, 'checkboxInput');
            input.placeholder = form.input.placeholder;
            
            textSpan.appendChild(input);
            checkbox.setAttribute('data-moreInput', dataEntry.comboID(id, 'checkboxInput'));
        }
    }

    //If specified, clicking a checkbox opens a secondary form, related to that checkbox, that form is created here
    if (form.subForms) {
        (function(id) {
            var newSubFormDataEntry = {};
            dataEntry.activeEntries[dataEntry.comboID(id, 'subForm')] = newSubFormDataEntry;
            
            var subFormContainer = document.createElement('div');
            subFormContainer.classList.add('dataEntrySubFormCallout');
            subFormContainer.id = dataEntry.comboID(id, 'subForm');

            var subFormHeader = document.createElement('div');
            subFormHeader.classList.add('dataEntryHeader');

            var subFormElement = document.createElement('form');
            subFormElement.onsubmit = function() {
                return false;
            }

            var subFormPrompt = document.createElement('p');
            subFormPrompt.innerHTML = form.prompt;

            subFormElement.appendChild(subFormPrompt);

            subFormContainer.appendChild(subFormHeader);
            subFormContainer.appendChild(subFormElement);


            newSubFormDataEntry.textareas = new Set();

            for (var j = 0; j < form.subForms.length; j++) {
                if (form.subForms[j].type === 'text') {
                    var textResponses = $('<div id="' + dataEntry.comboID(id, 'subForm', j, "responseBox") + '" class="textResponses unofficialView"><div><!--<a class="showMore">Show more...</a>--></div></div>');
                    var textInput = $('<div class="textInput"><label id="textDetailText">' + form.subForms[j].prompt + '</label><textarea class="edit" data-responseBox="' + dataEntry.comboID(id, 'subForm', j, "responseBox") + '" data-prompt="' + form.subForms[j].prompt + '" required="required" oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + dataEntry.comboID(id, 'subForm', j) + '"></textarea></div>');
                    var text = $('<div class="textBox"></div>');
                    text.append(textInput);
                    text.append(textResponses);
                    
                    $(subFormElement).append(text);
                    textInput.slideDown();

                    newSubFormDataEntry.textareas.add(dataEntry.comboID(id, 'subForm', j));
                }
            }
            //toggle viewMode for this dataEntry
            newSubFormDataEntry.viewMode = function() {
                dataEntry.handleResize(function() {
                    $(subFormContainer).find('.edit').each(function() {
                        $(this).hide();
                    });

                    $(subFormContainer).find('.unofficialView').each(function() {
                        $(this).show();
                    });

                    $(subFormContainer).find('.officialView').each(function() {
                        $(this).hide();
                    });

                    $(subFormContainer).find('.dataEntryViewModeButton').each(function() {
                        $(this).addClass('active');
                    });

                    $(subFormContainer).find('.dataEntryEditModeButton').each(function() {
                        $(this).removeClass('active');
                    });
                });
            }

            //toggle editMode for this dataEntry
            newSubFormDataEntry.editMode = function() {
                dataEntry.handleResize(function() {
                    $(subFormContainer).find('.edit').each(function() {
                        $(this).show();
                    });

                    $(subFormContainer).find('.unofficialView').each(function() {
                        $(this).hide();
                    });

                    $(subFormContainer).find('.officialView').each(function() {
                        $(this).hide();
                    });

                    $(subFormContainer).find('.dataEntryViewModeButton').each(function() {
                        $(this).removeClass('active');
                    });

                    $(subFormContainer).find('.dataEntryEditModeButton').each(function() {
                        $(this).addClass('active');
                    });
                });
            }

            var viewModeButton = document.createElement('div');
            viewModeButton.classList.add('dataEntryViewModeButton');
            viewModeButton.addEventListener('click', function() {
                newSubFormDataEntry.viewMode();
            });

            var viewModeButtonIcon = document.createElement('span');
            viewModeButtonIcon.textContent = 'View';

            viewModeButton.appendChild(viewModeButtonIcon);

            var editModeButton = document.createElement('div');
            editModeButton.classList.add('dataEntryEditModeButton', 'active');
            editModeButton.addEventListener('click', function() {
                newSubFormDataEntry.editMode();
            });

            var editModeButtonIcon = document.createElement('span');
            editModeButtonIcon.textContent = 'Edit';

            editModeButton.appendChild(editModeButtonIcon);

            var closeButton = document.createElement('div');
            closeButton.classList.add('dataEntryCloseButton');
            closeButton.addEventListener('click', function() {
                $(document.getElementById(dataEntry.comboID(id, 'subForm'))).hide();
            });

            var closeButtonIcon = document.createElement('i');
            closeButtonIcon.classList.add('fa', 'fa-times');

            closeButton.appendChild(closeButtonIcon);


            subFormHeader.appendChild(viewModeButton);
            subFormHeader.appendChild(editModeButton);
            subFormHeader.appendChild(closeButton);

            var messageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(id, 'subForm'));
            globalPebl.subscribeThread(dataEntry.comboID(id, 'subForm'), false, messageHandle);

            var formFooter = document.createElement('div');
            formFooter.classList.add('dataEntryFooter');

            var subFormSubmit = $('<button class="dataEntryFormSubmit">Submit</button>');
            subFormSubmit.on('click', function() {
                dataEntry.invalidFormActive = false;
                var validForm = subFormElement.reportValidity();
                if (validForm) {
                    var messages = [];
                    //Submit the form
                    if (newSubFormDataEntry.textareas.size > 0) {
                        var subFormTextAreaArray = Array.from(newSubFormDataEntry.textareas);
                        for (var l = 0; l < subFormTextAreaArray.length; l++) {
                            var elem = document.getElementById(subFormTextAreaArray[l]);
                            var val = elem.value;
                            var prompt = elem.getAttribute('data-prompt');
                            var responseBox = elem.getAttribute('data-responseBox');
                            var message = {
                                "prompt": prompt,
                                "thread": subFormTextAreaArray[l],
                                "text": val,
                                "responseBox": responseBox,
                                "type": "text"
                            }
                            messages.push(message);
                        }
                    }

                    var finalMessage = {
                        "prompt": "DataEntry",
                        "thread": dataEntry.comboID(id, 'subForm'),
                        "text": JSON.stringify(messages)
                    }

                    globalPebl.emitEvent(globalPebl.events.newMessage,
                        finalMessage);

                    newSubFormDataEntry.viewMode();
                }
            });

            $(formFooter).append(subFormSubmit);

            subFormElement.appendChild(formFooter);

            checkbox.addEventListener('click', function(evt) {
                if (evt.currentTarget.checked === true) {
                    console.log('checked');
                    $(document.getElementById(dataEntry.comboID(id, 'subForm'))).show();
                } else {
                    console.log('not checked');
                }
            });

            document.body.appendChild(subFormContainer);
        })(id)
        
    }

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxResponseContainer);
    checkboxContainer.appendChild(checkboxResponseContainerOfficial);
    checkboxContainer.appendChild(textSpan);

    return checkboxContainer;
}

//Alerts the user to fill out all required fields in the form
dataEntry.invalidForm = function() {
    if (!dataEntry.invalidFormActive) {
        dataEntry.invalidFormActive = true;
        window.alert('Fill out the entire form');
    }
}

dataEntry.createDataEntry = function(insertID, question, id, forms, sharing, displayMode) {
    globalPebl.user.getUser(function(userProfile) {
        globalPebl.utils.getGroupMemberships(function(groups) {
            var dataEntryID;
            var standalone = false;
            var learnletLevel = dataEntry.getLearnletLevel(document.body.id);
            var learnlet = dataEntry.getLearnlet(document.body.id);
            var learnletTitle = dataEntry.getLearnletTitle();

            //Thread is either group + id, user + id, or id
            if (sharing === 'team') {
                if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID) {
                    dataEntryID = dataEntry.comboID(window.parent.extensionDashboard.programID, id);
                } else {
                    //User did not use the dashboard to launch the learnlet
                    standalone = true;
                    dataEntryID = dataEntry.comboID(userProfile.identity, id);
                    window.alert('This activity requires you to be part of a team. Consider relaunching this learnlet through the dashboard.');
                }
            } else if (sharing === 'private') {
                dataEntryID = dataEntry.comboID(userProfile.identity, id);
            } else {
                dataEntryID = id;
            }

            var newDataEntry = {};
            dataEntry.activeEntries[id] = newDataEntry;

            var calloutDiv = document.createElement('div');
            calloutDiv.classList.add('dataEntryCallout');

            var header = document.createElement('div');
            header.classList.add('dataEntryHeader');

            

            var formElement = document.createElement('form');
            //Prevent default form submit
            formElement.onsubmit = function() {
                return false;
            }


            var questionParagraph = document.createElement('p');
            questionParagraph.innerHTML = question;

            formElement.appendChild(questionParagraph);

            //Keep track of textareas and radio buttons that get added
            newDataEntry.textareas = new Set();
            newDataEntry.radios = new Set();
            newDataEntry.checkboxes = new Set();

            for (var i = 0; i < forms.length; i++) {
                var subID = dataEntry.comboID(dataEntryID, i);
                //Create textarea fields
                if (forms[i].type === 'text') {
                    $(formElement).append(dataEntry.createTextEntry(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'table') {
                    //Create table fields
                    formElement.appendChild(dataEntry.createRadioEntry(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'checkbox') {
                    formElement.appendChild(dataEntry.createCheckboxEntry(subID, forms[i], newDataEntry));
                }
            }

            var messageHandle = dataEntry.dataMessageHandler(dataEntryID);
            globalPebl.subscribeThread(dataEntryID, false, messageHandle);


            //Assuming we use the discussion mechanism for official submissions, will probably change later.
            var officialMessageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(dataEntryID, 'Official'));
            globalPebl.subscribeThread(dataEntry.comboID(dataEntryID, 'Official'), false, officialMessageHandle);

            var formFooter = document.createElement('div');
            formFooter.classList.add('dataEntryFooter');

            var formSubmitOfficial = $('<button class="dataEntryFormSubmitOfficial edit">Make it Official</button>');
            formSubmitOfficial.on('click', function() {
                var message = dataEntry.getFormData(formElement, newDataEntry, true);

                if (message != null) {
                    //Submit the official version
                    var finalMessage = {
                        "prompt": "DataEntryOfficial",
                        "thread": dataEntry.comboID(dataEntryID, 'Official'),
                        "text": JSON.stringify(message)
                    }
                    
                    globalPebl.emitEvent(globalPebl.events.newMessage,
                    finalMessage);

                    //TODO: Use a different xapi statement for this
                    if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID) {
                        var artifactPrompt = {
                            "prompt": question,
                            "learnlet": learnlet,
                            "learnletTitle": learnletTitle
                        }
                        var artifactMessage = {
                            "prompt": JSON.stringify(artifactPrompt),
                            "thread" : dataEntry.comboID(window.parent.extensionDashboard.programID, learnletLevel),
                            "text": JSON.stringify(message)
                        }

                        globalPebl.emitEvent(globalPebl.events.newMessage,
                        artifactMessage);
                    }

                    newDataEntry.officialMode();
                }
            });

            var formSubmit = $('<button class="dataEntryFormSubmit edit">Submit</button>');
            formSubmit.on('click', function() {
                var message = dataEntry.getFormData(formElement, newDataEntry, false);

                if (message != null) {
                    var finalMessage = {
                        "prompt": "DataEntry",
                        "thread": dataEntryID,
                        "text": JSON.stringify(message)
                    }

                    globalPebl.emitEvent(globalPebl.events.newMessage,
                    finalMessage);

                    newDataEntry.viewMode();
                }
            });

            newDataEntry.officialMode = function() {
                dataEntry.handleResize(function() {
                    $(calloutDiv).addClass('officialViewMode');
                    $(calloutDiv).removeClass('unofficialViewMode');
                    $(calloutDiv).removeClass('editMode');
                });
            }

            //toggle viewMode for this dataEntry
            newDataEntry.viewMode = function() {
                dataEntry.handleResize(function() {
                    $(calloutDiv).removeClass('officialViewMode');
                    $(calloutDiv).addClass('unofficialViewMode');
                    $(calloutDiv).removeClass('editMode');
                });
            }

            //toggle editMode for this dataEntry
            newDataEntry.editMode = function() {
                dataEntry.handleResize(function() {
                    $(calloutDiv).removeClass('officialViewMode');
                    $(calloutDiv).removeClass('unofficialViewMode');
                    $(calloutDiv).addClass('editMode');
                });
            }

            var viewModeButton = document.createElement('div');
            viewModeButton.classList.add('dataEntryViewModeButton');
            viewModeButton.addEventListener('click', function() {
                newDataEntry.viewMode();
            });

            var viewModeButtonIcon = document.createElement('span');
            viewModeButtonIcon.textContent = 'View';

            viewModeButton.appendChild(viewModeButtonIcon);

            var editModeButton = document.createElement('div');
            editModeButton.classList.add('dataEntryEditModeButton');
            editModeButton.addEventListener('click', function() {
                newDataEntry.editMode();
            });

            var editModeButtonIcon = document.createElement('span');
            editModeButtonIcon.textContent = 'Edit';

            editModeButton.appendChild(editModeButtonIcon);

            var officialModeButton = document.createElement('div');
            officialModeButton.classList.add('dataEntryOfficialModeButton');
            officialModeButton.addEventListener('click', function() {
                newDataEntry.officialMode();
            });

            var officialModeButtonIcon = document.createElement('span');
            officialModeButtonIcon.textContent = 'Official';

            officialModeButton.appendChild(officialModeButtonIcon);


            header.appendChild(viewModeButton);

            $(formFooter).append(formSubmit);

            //If viewmode is set to viewOnly, don't show the edit mode button
            if (!displayMode || displayMode !== 'viewOnly')
                header.appendChild(editModeButton);

            //If sharing is set to team and not in standalone mode, show the official submit / view buttons
            if (sharing === 'team' && !standalone) {
                header.appendChild(officialModeButton);
                //TODO: Add conditional to only append the the official submit button if user is team leader
                $(formFooter).append(formSubmitOfficial);
            }
            
            calloutDiv.appendChild(formElement);
            calloutDiv.appendChild(header);
            calloutDiv.appendChild(formFooter);

            var insertLocation = document.getElementById(insertID);

            insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
            insertLocation.remove();


            //Do not add the will-change: transform fix when in safari, it doesn't need it and it breaks the rendering when not scrollable
            if (!(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)))
                formElement.classList.add('fixScrolling');

            //Put the dataEntry into viewmode if specified.
            if (displayMode && displayMode === 'viewOnly')
                newDataEntry.viewMode();
            else
                newDataEntry.editMode();
        });
    });
}

//Message handler for standard textarea messages
dataEntry.messageHandler = function(message, userProfile) {
    var mine = userProfile.identity == message.name;
    var userIcon = document.createElement('i');
    userIcon.classList.add('fa', 'fa-user');
    var userIdBox = $('<span class="userId"></span>');
    userIdBox.text(message.name);
    var timestampBox = $('<span class="timestamp"></span>');
    timestampBox.text(new Date(message.timestamp).toLocaleString());
    var textBox = $('<p class="message"></p>');
    textBox.text(message.text);
    var messageContainer = $('<div data-timestamp="' + message.timestamp + '" id="' + dataEntry.comboID(message.name, message.thread) + '" class="' + (mine?"your ":"") + 'response"></div>');
    messageContainer.append($(userIcon));
    messageContainer.append(userIdBox);
    messageContainer.append(timestampBox);
    messageContainer.append(textBox);

    var responseBox = document.getElementById(message.responseBox);

    //Only show latest submission for each user
    var existingMessage = responseBox.querySelector('[id="' + dataEntry.comboID(message.name, message.thread) + '"]');
    if (existingMessage) {
        var newTimestamp = new Date(message.timestamp);
        var oldTimestamp = new Date(existingMessage.getAttribute('data-timestamp'));
        //Replace the existing message with the newer one
        if (newTimestamp > oldTimestamp) {
            $(existingMessage).remove();
            $(responseBox).prepend(messageContainer);
        } else {
            //Don't add it
        }
    } else {
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

    var elem = responseBox.querySelector('[id="' + dataEntry.comboID(message.thread, message.name) + '"]');
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
        if (text === '')
                checkboxViewElem.style.display = 'none';
        $(responseBox).append(checkboxViewElem);
    }
}

//Message handler for radio button messages
dataEntry.radioMessageHandler = function(message, userProfile) {
    var mine = userProfile.identity == message.name;
    

    var messageContainer = document.createElement('div');
    messageContainer.setAttribute('data-id', dataEntry.comboID(message.thread, message.name));
    messageContainer.setAttribute('data-timestamp', message.timestamp);
    var messageSpan = document.createElement('span');
    messageSpan.textContent = message.name;

    var responseBox = document.getElementById(message.responseBox);
    var elem = document.querySelector('[data-id="' + dataEntry.comboID(message.thread, message.name) + '"]');

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

dataEntry.getFormData = function(formElement, newDataEntry, isOfficial) {
    dataEntry.invalidFormActive = false;
    //Check if all required inputs have been completed
    var validForm = formElement.reportValidity();
    if (validForm) {
        var messages = [];
        //Submit the form
        if (newDataEntry.textareas.size > 0) {
            var textareaArray = Array.from(newDataEntry.textareas);
            for (var i = 0; i < textareaArray.length; i++) {
                var elem = document.getElementById(textareaArray[i]);
                var val = elem.value;
                var prompt = elem.getAttribute('data-prompt');
                var responseBox = isOfficial ? elem.getAttribute('data-responseBoxOfficial') : elem.getAttribute('data-responseBox');
                var message = {
                    "prompt": prompt,
                    "thread": textareaArray[i],
                    "text": val,
                    "responseBox": responseBox,
                    "type": "text"
                }
                messages.push(message);
            }
        }

        if (newDataEntry.radios.size > 0) {
            var radioArray = Array.from(newDataEntry.radios);
            for (var j = 0; j < radioArray.length; j++) {
                var val = $('input[name="' + radioArray[j] + '"]:checked').val();
                var title = $('input[name="' + radioArray[j] + '"]:checked').attr('data-title');
                var prompt = $('input[name="' + radioArray[j] + '"]:checked').attr('prompt');
                var responseBox = isOfficial ? $('input[name="' + radioArray[j] + '"]:checked').attr('data-responseBoxOfficial') : $('input[name="' + radioArray[j] + '"]:checked').attr('data-responseBox');
                //Content of the message is the value of the radio button
                var message = {
                    "prompt" : prompt,
                    "thread" : isOfficial ? dataEntry.comboID(radioArray[j], 'Official') : radioArray[j],
                    "text" : val,
                    "responseBox": responseBox,
                    "type": "radio",
                    "title": title
                };
                messages.push(message);
            }
        }

        if (newDataEntry.checkboxes.size > 0) {
            var checkboxArray = Array.from(newDataEntry.checkboxes);
            for (var k = 0; k < checkboxArray.length; k++) {
                var checkbox = document.getElementById(checkboxArray[k]);
                var prompt = checkbox.value;
                var thread = checkboxArray[k];
                var responseBox = isOfficial ? checkbox.getAttribute('data-responseBoxOfficial') : checkbox.getAttribute('data-responseBox');
                var text;
                //Content of the message is the value of the checkbox + any additional input if specified.
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
            }
        }

        return messages;
    } else {
        return null;
    }
}

//Call readium library function to keep user on the same page after content resizes.
dataEntry.handleResize = function(callback) {
    var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    callback();
    globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
}

dataEntry.sortMessages = function(a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}

//Combines any number of strings with _ between them
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

// TODO: super basic for now, make it work better later
dataEntry.getLearnletLevel = function(string) {
    return string.substr(0, 1);
}

dataEntry.getLearnlet = function(string) {
    return string.substr(2, 1);
}

dataEntry.getLearnletTitle = function() {
    return $('.chapterTitle')[0].textContent;
}
