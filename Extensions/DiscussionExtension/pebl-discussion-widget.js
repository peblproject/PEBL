var globalPebl = window.parent.PeBL;

$(document).ready(function() {
    
    //Find inDesign shortcodes and replace with actual pebl shortcodes
    $("body").children().each(function () {
        $(this).html( $(this).html().replace(/\[\[\[(type=”discussion”) (prompt=”.*?”) (button=”.*?”) (visibility=”.*?”) (postLimit=”.*?”) (notify=”.*?”)]]]/g, function(x) {
            var prompt = x.match(/prompt=”(.*?)”/);
            var button = x.match(/button=”(.*?)”/);

            var widgetCode = '<i class="discussion_discussionExtension" id="someID2" data-id="someID2" data-prompt="' + prompt[1] + '" data-buttonText="' + button[1] + '"></i>';
            return widgetCode;
        }) );
    });

    $('.discussion_discussionExtension').each(function() {
        var buttonText = $(this)[0].getAttribute('data-buttonText');
        var prompt = $(this)[0].getAttribute('data-prompt');
        var id = $(this)[0].getAttribute('data-id');
        var detailText = $(this)[0].hasAttribute('data-detailText') ? $(this)[0].getAttribute('data-detailText') : null;
        var insertID = $(this)[0].getAttribute('id');
        var sharing = $(this)[0].getAttribute('data-sharing') ? $(this)[0].getAttribute('data-sharing') : null;
        createDiscussion(insertID, buttonText, prompt, id, detailText, sharing);
    });

    $(document.body).on('click', '.chat', function(evt) {
        handleChatButtonClick(evt.currentTarget);
    });
});

function createDiscussion(insertID, buttonText, question, id, detailText, sharing) {
    var calloutDiv,
        chatButton,
        chatIcon,
        questionParagraph,
        insertLocation;

    calloutDiv = document.createElement('div');
    calloutDiv.classList.add('callout');

    chatButton = document.createElement('button');
    chatButton.classList.add('chat');
    chatButton.id = id;
    chatButton.innerHTML = buttonText;
    chatIcon = document.createElement('i');
    chatIcon.classList.add('fa', 'fa-comments');
    chatButton.appendChild(chatIcon);
    if (detailText)
        chatButton.setAttribute('detailText', detailText);
    if (sharing)
        chatButton.setAttribute('data-sharing', sharing);

    questionParagraph = document.createElement('p');
    questionParagraph.innerHTML = question;

    calloutDiv.appendChild(chatButton);
    calloutDiv.appendChild(questionParagraph);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
    insertLocation.remove();
}

function replyDiscussion(event) {
    console.log(event.currentTarget);
    replyClose();
    var parentPost = $(event.currentTarget).parent();
    var parentAuthor = parentPost.children('.userId');
    var parentId = parentPost.attr('id');
    
    var replyContainer = document.createElement('div');
    replyContainer.classList.add('replyContainer');

    var replyTextArea = document.createElement('textarea');
    replyTextArea.classList.add('replyTextArea');
    replyTextArea.placeholder = 'Reply to ' + parentAuthor.text();

    var replyCloseButton = document.createElement('button');
    replyCloseButton.classList.add('replyCloseButton');
    replyCloseButton.textContent = 'Cancel';
    replyCloseButton.addEventListener('click', replyClose);

    var replySubmitButton = document.createElement('button');
    replySubmitButton.classList.add('replySubmitButton');
    replySubmitButton.textContent = 'Submit';
    replySubmitButton.addEventListener('click', function(event) {
        replySubmit(event);
    });

    replyContainer.appendChild(replyTextArea);
    replyContainer.appendChild(replyCloseButton);
    replyContainer.appendChild(replySubmitButton);

    $(event.currentTarget).hide();
    $(event.currentTarget).after(replyContainer);

}

function replyClose() {
    $('.replyContainer').remove();
    $('.messageReplyButton').show();
}

function replySubmit(event) {
    console.log(event.currentTarget);
    var textarea = $(event.currentTarget).siblings('textarea');
    var thread = 'peblThread://' + $(event.currentTarget).parent().parent().attr('id');
    console.log(thread);
    var responseBox = $(event.currentTarget).parent().siblings('.chatReplies');
    var prompt = $(event.currentTarget).parent().siblings('.message').text();
    console.log(textarea.val());
    createSubThread(thread, prompt, textarea, responseBox);
    replyClose();
}

function messageHandler(responseBox, thread, replyDisabled) {
    return function (newMessages) {
        newMessages.sort(sortMessages);
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
                        if (!replyDisabled) {
                            var messageReplyButton = document.createElement('a');
                            messageReplyButton.classList.add('messageReplyButton');
                            messageReplyButton.textContent = 'Reply';
                            messageReplyButton.href = '#!';
                            messageReplyButton.addEventListener('click', function(event) {
                                replyDiscussion(event);
				event.preventDefault();
                            });
                            messageContainer.append($(messageReplyButton));
                        }
                        var chatReplies = document.createElement('div');
                        chatReplies.classList.add('chatReplies');
                        messageContainer.append($(chatReplies));
                        // if (mine) {
                        //     var messageDeleteButtonWrapper = document.createElement('div');
                        //     messageDeleteButtonWrapper.classList.add('messageDeleteButtonWrapper');

                        //     var messageDeleteButton = document.createElement('span');
                        //     messageDeleteButton.classList.add('messageDeleteButton');
                        //     messageDeleteButton.innerHTML = '&#215;';
                        //     messageDeleteButton.setAttribute('messageID', message.id);
                        //     messageDeleteButton.setAttribute('thread', thread);
                        //     messageDeleteButton.addEventListener('click', function() {
                        //         window.pebl.removeMessage(this.getAttribute('messageID'), this.getAttribute('thread'));
                        //         $('#' + this.getAttribute('messageID')).remove();
                        //     });

                        //     messageDeleteButtonWrapper.appendChild(messageDeleteButton);
                        //     messageContainer.append($(messageDeleteButtonWrapper));
                        // }
                        responseBox.prepend(messageContainer);
                        var thread = 'peblThread://' + message.id;
                        var messageHandle = messageHandler($(chatReplies), thread);
                        globalPebl.subscribeThread(thread, false, messageHandle);
                    }
                }
            }
        });
    };
}

function createThread(thread, element, moreInput) {
    var chatInputBox = $(element).parent();
    var responseBox = chatInputBox.siblings('.chatResponses');
    var messageHandle = messageHandler(responseBox, thread);
    globalPebl.subscribeThread(thread, false, messageHandle);
    var input = $(element).parent().find("textarea").val();
    var prompt = $(element).parent().parent().parent().find("p").text();
    if (input.trim() != "") {
        var message = {
            "prompt" : prompt,
            "thread" : thread,
            "text" : input
        };
        globalPebl.emitEvent(globalPebl.events.newMessage,
                             message);
        if (!moreInput)
            chatInputBox.slideUp(400,
                                 function () {
                                     chatInputBox.remove();
                                 });
        else
            $(element).parent().find("textarea").val("");

        responseBox.slideDown();
    }
}

function createSubThread(thread, prompt, textarea, responseBox) {
    var messageHandle = messageHandler(responseBox, thread);
    var input = textarea.val();
    globalPebl.subscribeThread(thread, false, messageHandle);
    if (input.trim() != "") {
        var message = {
            "prompt": prompt,
            "thread": thread,
            "text": input
        };
        globalPebl.emitEvent(globalPebl.events.newMessage,
                             message);
        textarea.val("");
    }
}

function createDiscussionLightBox() {
    var lightBox,
        lightBoxContent,
        dimOverlay;

    lightBox = document.createElement('div');
    lightBox.id = 'lightBox';
    lightBox.classList.add('lightBox');
    
    lightBoxContent = document.createElement('div');
    lightBoxContent.classList.add('lightBoxContent');

    lightBoxContent.id = 'lightBoxContent';
    lightBox.appendChild(lightBoxContent);

    dimOverlay = document.createElement('div');
    dimOverlay.id = 'dimOverlay';
    dimOverlay.classList.add('dimOverlay');

    // document.body.appendChild(dimOverlay);
    document.body.appendChild(lightBox);

    // $('.dimOverlay').on('click', function() {
    //     if ($('#lightBox').is(':visible')) {
    //         closeLightBox();
    //     }
    // });
}

function openDiscussionLightbox(question, chatButton) {
    var questionBox,
        questionBoxText,
        element,
        lightBoxContent;

    createDiscussionLightBox();

    questionBox = document.createElement('div');
    questionBox.classList.add('discussionQuestionBox');
    questionBoxText = document.createElement('p');
    questionBoxText.classList.add('discussionQuestionBoxText');
    questionBoxText.innerHTML = question;
    questionBox.appendChild(questionBoxText);

    lightBoxContent = document.getElementById('lightBoxContent');
    $(lightBoxContent).append('<i class="fa fa-times discussionCloseButton"></i>');
    lightBoxContent.appendChild(questionBox);

    //createDiscussionBox wants a jquery object
    element = $('.lightBoxContent');

    createDiscussionBox(element, chatButton);
}

function closeLightBox() {
    var lightBox = document.getElementById('lightBox');
    // var dimOverlay = document.getElementById('dimOverlay');
    // setTimeout(function() {
    //     dimOverlay.classList.add('overlayTransitionOut');
    // }, 200);
    if (lightBox != null)
        lightBox.parentNode.removeChild(lightBox);
    // dimOverlay.parentNode.removeChild(dimOverlay);
}


function createDiscussionBox(element, chatButton) {
    globalPebl.utils.getGroupMemberships(function(groups) {
        globalPebl.user.getUser(function(userProfile) {
            var chatResponses = $('<div class="chatResponses" style="display:none;"><div><!--<a class="showMore">Show more...</a>--></div></div>');
            var chatInput = $('<div class="chatInput" style="display:none;"><label id="discussionDetailText"></label><textarea id="discussionTextArea"></textarea><button class="chatSubmit">Submit</button></div>');
            var chat = $('<div class="chatBox"></div>');
            chat.append(chatInput);
            chat.append(chatResponses);
            
            element.append(chat);
            if (chatButton.hasAttribute('detailText'))
                document.getElementById('discussionDetailText').textContent = chatButton.getAttribute('detailText');
            element.find(".chatInput").slideDown();

            var thread = chatButton.id;
            if (chatButton.hasAttribute('data-sharing')) {
                var sharing = chatButton.getAttribute('data-sharing');
                //Assuming one group for now
                if (sharing === 'team') {
                    if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID) {
                        thread = comboID(window.parent.extensionDashboard.programID, thread);
                    } else {
                        thread = comboID(userProfile.identity, thread);
                        window.alert('This activity requires you to be part of a team. Consider relaunching this learnlet through the dashboard.');
                    }
                } else if (sharing === 'private') {
                    thread = comboID(userProfile.identity, thread);
                }
            }

            var responseBox = $('.chatResponses');
            var messageHandle = messageHandler(responseBox, thread);
            globalPebl.subscribeThread(thread, false, messageHandle);
            
            responseBox.slideDown();

            chatInput.on('click', 'button.chatSubmit', function () {
                createThread(thread, $(this), true);
            });

            element.on('click', 'i.discussionCloseButton', function() {
                closeLightBox();
            });
        });
    });
}

function handleChatButtonClick(elem) {
    $('.lightBox').remove();
    event.preventDefault();
    var element,
        question;
    if (elem)
        element = $(elem);
    else
        element = $(this);
    question = element.parent().children('p:first').text();
    if (globalPebl) {
        if ((element[0].id != null) && (element[0].id != "")) {
            if (element.parent().children(".chatBox").length == 0) {
                // if (globalPebl.userManager.isLoggedIn) {
                openDiscussionLightbox(question, element[0]);
                $('#discussionTextArea').focus();
                // } else if (window.Lightbox) {
                //     window.Lightbox.create('login', false);
                //     window.Lightbox.createLoginButton('lightBoxContent');
                // }
            }
        }
    }
}

function handleNoteButtonClick(elem) {
    $('.lightBox').remove();
    globalPebl.user.getUser(function(user) {
        var discussionId = user.identity + '-' + elem.id;

        createDiscussionLightBox();

        var questionBox,
            questionBoxText,
            notesCloseButton,
            element,
            lightBoxTitle,
            lightBoxContent;

        questionBox = document.createElement('div');
        questionBox.classList.add('discussionQuestionBox');
        questionBoxText = document.createElement('p');
        questionBoxText.classList.add('discussionQuestionBoxText');
        questionBoxText.textContent = 'Test Notes';
        questionBox.appendChild(questionBoxText);

        notesCloseButton = document.createElement('i');
        notesCloseButton.classList.add('fa', 'fa-times', 'discussionCloseButton');
        notesCloseButton.addEventListener('click', function() {
            closeLightBox();
        });

        lightBoxContent = document.getElementById('lightBoxContent');

        lightBoxContent.appendChild(notesCloseButton);
        lightBoxContent.appendChild(questionBox);

        var notesResponses = $('<div class="notesResponses" style="display:none;"><div id="discussionSpanContainer" style="text-align: center; margin-top: 10px; margin-bottom: 10px; display: none;"><span class="discussionSpan">You haven\'t added any notes yet.</span></div></div>');
        var notesInput = $('<div class="notesInput" style="display:none;"><textarea id="notesTextArea" placeholder="Add a note."></textarea><button class="notesSubmit">Add note</button></div>');
        var notes = $('<div class="notesBox"></div>');
        notes.append(notesInput);
        notes.append(notesResponses);
        lightBoxContent = $(lightBoxContent);
        lightBoxContent.append(notes);
        lightBoxContent.find(".notesInput").slideDown();

        $('#notesTextArea').focus();

        //Subscribe to thread without clicking submit
        var notesInputBox = $('button.notesSubmit').parent();
        var responseBox = notesInputBox.siblings('.notesResponses');
        var messageHandle = messageHandler(responseBox);
        globalPebl.subscribeThread(discussionId, false, messageHandle);
        responseBox.slideDown();

        notesInput.on('click', 'button.notesSubmit', function() {
            createThread(discussionId, $(this), true);
            globalPebl.subscribeThread(discussionId, false, messageHandle);
            responseBox.slideDown();
        });

        setTimeout(function() {
            $('#discussionSpanContainer').show();
        }, 2000);

        var checkDiscussionMessages = setInterval(function() {
            if (document.getElementsByClassName('notesResponses')[0].childElementCount > 1) {
                clearInterval(checkDiscussionMessages);
                $('#discussionSpanContainer').remove();
            }
        }, 1000);
    });
}

function sortMessages(a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}

//Combines any number of strings with _ between them
comboID = function(...strings) {
    var newID = null;
    for (var string of strings) {
        if (newID === null)
            newID = string;
        else
            newID = newID + '_' + string;
    }

    return newID;
}
