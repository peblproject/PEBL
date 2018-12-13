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
        dataEntry.createDataEntry(insertID, prompt, id, forms);
    });
});

dataEntry.activeEntries = {};

dataEntry.invalidForm = function() {
    //TODO
    window.alert('Fill out the entire form');
}

dataEntry.createDataEntry = function(insertID, question, id, forms) {
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

    for (var i = 0; i < forms.length; i++) {
        var subID = id + '_' + i;
        //Create textarea fields
        if (forms[i].type === 'text') {
            var textResponses = $('<div class="textResponses" style="display:none;"><div><!--<a class="showMore">Show more...</a>--></div></div>');
            var textInput = $('<div class="textInput" style="display:none;"><label id="textDetailText">' + forms[i].prompt + '</label><textarea data-prompt="' + forms[i].prompt + '" required="required" oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + subID + '"></textarea></div>');
            var text = $('<div class="textBox"></div>');
            text.append(textInput);
            text.append(textResponses);
            
            $(formElement).append(text);
            textInput.slideDown();

            var messageHandle = dataEntry.messageHandler(textResponses, subID);
            globalPebl.subscribeThread(subID, false, messageHandle);
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
                        input.name = subID + '_table_radio_' + k;
                        input.value = forms[i].tableRows[k].inputs[l].value;
                        input.id = subID + '_table_radio_' + k + '_' + l;
                        input.setAttribute("required", "required");
                        input.oninvalid = dataEntry.invalidForm;
                        radios.add(input.name);

                        var responseBox = document.createElement('div');
                        responseBox.classList.add('radioResponses');
                        responseBox.setAttribute('style', 'display: none');

                        var messageHandle = dataEntry.radioMessageHandler(responseBox, input.name, input.value);
                        globalPebl.subscribeThread(input.name, false, messageHandle);
                        td.appendChild(input);
                        td.appendChild(responseBox);
                    }
                    tr.appendChild(td)
                }
                table.appendChild(tr);
            }

            tableContainer.appendChild(table);
            formElement.appendChild(tableContainer);
        }
    }

    var formSubmit = $('<button class="dataEntryFormSubmit">Submit</button>');
    formSubmit.on('click', function() {
        var validForm = formElement.reportValidity();
        if (validForm) {
            //Submit the form
            if (textareas.size > 0) {
                var textareaArray = Array.from(textareas);
                for (var i = 0; i < textareaArray.length; i++) {
                    var elem = document.getElementById(textareaArray[i]);
                    var prompt = elem.getAttribute('data-prompt');
                    dataEntry.createThread(textareaArray[i], prompt, elem, true);
                }
            }

            if (radios.size > 0) {
                var radioArray = Array.from(radios);
                for (var j = 0; j < radioArray.length; j++) {
                    var val = $('input[name=' + radioArray[j] + ']:checked').val();
                    //Content of the message is the value of the radio button
                    var message = {
                        "prompt" : "test",
                        "thread" : radioArray[j],
                        "text" : val
                    };
                    globalPebl.emitEvent(globalPebl.events.newMessage,
                            message);
                }
            }
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

            $(calloutDiv).find('input').each(function() {
                $(this).hide();
            });

            $(calloutDiv).find('.radioResponses').each(function() {
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

            $(calloutDiv).find('input').each(function() {
                $(this).show();
            });

            $(calloutDiv).find('.radioResponses').each(function() {
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
    header.appendChild(editModeButton);

    $(formElement).append(formSubmit);
    calloutDiv.appendChild(formElement);

    var insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
    insertLocation.remove();
}

//Message handler for standard textarea messages
dataEntry.messageHandler = function(responseBox, thread) {
    return function (newMessages) {
        newMessages.sort(dataEntry.sortMessages);
        globalPebl.user.getUser(function (userProfile) {
            if (userProfile) {
                for (var i = 0; i < newMessages.length; i++) {
                    var message = newMessages[i];
                    if ($("#" + message.id).length == 0) {          
                        var mine = userProfile.identity == message.name;;
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
                        
                        responseBox.prepend(messageContainer);
                    }
                }
            }
        });
    };
}

//Message handler for radio button messages
dataEntry.radioMessageHandler = function(responseBox, thread, value) {
    return function (newMessages) {
        newMessages.sort(dataEntry.sortMessages);
        globalPebl.user.getUser(function(userProfile) {
            if (userProfile) {
                for (var i = 0; i < newMessages.length; i++) {
                    var message = newMessages[i];
                    if (message.text === value) {
                        var elem = $('#' + message.thread + '_' + message.name);

                        var messageContainer = document.createElement('div');
                        messageContainer.id = message.thread + '_' + message.name;
                        messageContainer.setAttribute('data-timestamp', message.timestamp);
                        var messageSpan = document.createElement('span');
                        messageSpan.textContent = message.name;

                        messageContainer.appendChild(messageSpan);
                        if (elem.length) {
                            var oldTimestamp = elem.attr('data-timestamp');
                            var newTimestamp = message.timestamp;
                            if (new Date(newTimestamp) > new Date(oldTimestamp)) {
                                $('#' + message.thread + '_' + message.name).remove();
                                responseBox.append(messageContainer);
                            } else {
                                //don't add it
                            }
                        } else {
                            responseBox.append(messageContainer);
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
