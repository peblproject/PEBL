var globalPebl = window.parent.PeBL;

var discussion = {};
if (globalPebl)
    globalPebl.extension.discussion = discussion;

jQuery(document).ready(function () {

    //Find inDesign shortcodes and replace with actual pebl shortcodes
    // jQuery("body").children().each(function () {
    //     jQuery(this).html( jQuery(this).html().replace(/\[\[\[(type=”discussion”) (prompt=”.*?”) (button=”.*?”) (visibility=”.*?”) (postLimit=”.*?”) (notify=”.*?”)]]]/g, function(x) {
    //         var prompt = x.match(/prompt=”(.*?)”/);
    //         var button = x.match(/button=”(.*?)”/);

    //         var widgetCode = '<i class="discussion_discussionExtension" id="someID2" data-id="someID2" data-prompt="' + prompt[1] + '" data-buttonText="' + button[1] + '"></i>';
    //         return widgetCode;
    //     }) );
    // });

    jQuery('.discussion_discussionExtension, .peblExtension[data-peblextension="discussion"]').each(function() {    
        var buttonText = jQuery(this)[0].getAttribute('data-buttonText') || jQuery(this)[0].getAttribute('data-buttontext');
        var prompt = jQuery(this)[0].getAttribute('data-prompt');
        var id = jQuery(this)[0].getAttribute('data-id');
        var detailText = jQuery(this)[0].hasAttribute('data-detailText') ? jQuery(this)[0].getAttribute('data-detailText') : null;
        var insertID = jQuery(this)[0].getAttribute('id');
        var sharing = jQuery(this)[0].getAttribute('data-sharing') ? jQuery(this)[0].getAttribute('data-sharing') : null;
        discussion.createDiscussion(insertID, buttonText, prompt, id, detailText, sharing);
    });

    jQuery(document.body).on('click', '.chat', function (evt) {
        discussion.handleChatButtonClick(evt.currentTarget);
    });
});

discussion.createDiscussion = function (insertID, buttonText, question, id, detailText, sharing) {
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

discussion.createDiscussionLightBox = function (question, chatButton) {
    globalPebl.user.getUser(function (userProfile) {
        var private = false;
        var thread = chatButton.id;
        if (chatButton.hasAttribute('data-sharing')) {
            var sharing = chatButton.getAttribute('data-sharing');
            if (sharing === 'team') {
                if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID) {
                    thread = discussion.comboID(window.parent.extensionDashboard.programID, thread);
                } else if (userProfile.currentTeam) {
                    thread = discussion.comboID(userProfile.currentTeam, thread);
                } else {
                    //Leave the thread as is
                }
            } else if (sharing === 'class') {
                if (userProfile.currentClass) {
                    thread = discussion.comboID(userProfile.currentClass, thread);
                }
            } else if (sharing === 'private') {
                private = true;
                thread = discussion.comboID(userProfile.identity, thread);
            }
        }

        var lightBox = document.createElement('div');
        lightBox.id = 'pebl__discussion--lightbox';
        lightBox.classList.add('pebl__discussion--lightbox');

        var lightBoxContent = document.createElement('div');
        lightBoxContent.classList.add('pebl__discussion--lightbox__content');

        var discussionHeader = document.createElement('div');
        discussionHeader.classList.add('pebl__discussion--lightbox__header');

        var promptContainer = document.createElement('div');
        promptContainer.classList.add('discussionPromptContainer');

        var prompt = document.createElement('span');
        prompt.classList.add('discussionPrompt');
        prompt.innerHTML = question;

        promptContainer.appendChild(prompt);

        var lightBoxCloseButtonContainer = document.createElement('div');
        lightBoxCloseButtonContainer.classList.add('discussionLightboxCloseButtonContainer');

        var lightBoxCloseButton = document.createElement('i');
        lightBoxCloseButton.classList.add('fa', 'fa-times');
        lightBoxCloseButton.addEventListener('click', function () {
            jQuery(lightBox).remove();
        });

        lightBoxCloseButtonContainer.appendChild(lightBoxCloseButton);

        discussionHeader.appendChild(promptContainer);
        discussionHeader.appendChild(lightBoxCloseButtonContainer);


        var discussionInputBody = document.createElement('div');
        discussionInputBody.classList.add('discussionInputBody');

        var discussionDetailTextContainer = document.createElement('div');
        discussionDetailTextContainer.classList.add('discussionDetailTextContainer');

        var discussionDetailText = document.createElement('span');
        discussionDetailText.classList.add('discussionDetailText');
        if (chatButton.hasAttribute('detailText'))
            discussionDetailText.textContent = chatButton.getAttribute('detailText');

        discussionDetailTextContainer.appendChild(discussionDetailText);

        var discussionTextAreaContainer = document.createElement('div');
        discussionTextAreaContainer.classList.add('discussionTextAreaContainer');

        var discussionTextArea = document.createElement('textarea');
        discussionTextArea.classList.add('pebl__discussion--lightbox__textarea');

        discussionTextAreaContainer.appendChild(discussionTextArea);

        var discussionButtonContainer = document.createElement('div');
        discussionButtonContainer.classList.add('discussionButtonContainer');

        var discussionSubmitButton = document.createElement('button');
        discussionSubmitButton.classList.add('discussionSubmitButton');
        discussionSubmitButton.textContent = 'Submit';


        discussionButtonContainer.appendChild(discussionSubmitButton);

        discussionInputBody.appendChild(discussionDetailTextContainer);
        discussionInputBody.appendChild(discussionTextAreaContainer);
        discussionInputBody.appendChild(discussionButtonContainer);


        var discussionResponseBody = document.createElement('div');
        discussionResponseBody.classList.add('discussionResponseBody');

        discussionSubmitButton.addEventListener('click', function () {
            discussion.createThread(thread, jQuery(discussionTextArea).val(), question, discussionTextArea, discussionResponseBody);
        });

        var messageHandle = discussion.messageHandler(discussionResponseBody, thread, private);
        globalPebl.subscribeThread(thread, false, messageHandle);

        lightBoxContent.appendChild(discussionHeader);
        lightBoxContent.appendChild(discussionInputBody);
        lightBoxContent.appendChild(discussionResponseBody);

        lightBox.appendChild(lightBoxContent);
        document.body.appendChild(lightBox);
        discussionTextArea.focus();
    });
}

discussion.messageHandler = function (responseBox, thread, replyDisabled) {
    return function (newMessages) {
        newMessages.sort(discussion.sortMessages);
        globalPebl.user.getUser(function (userProfile) {
            if (userProfile) {
                for (var i = 0; i < newMessages.length; i++) {
                    var message = newMessages[i];
                    if (jQuery("#" + message.id).length == 0) {
                        var mine = userProfile.identity == message.actor.account.name;
                        var userIdBox = jQuery('<span class="userId"></span>');
                        userIdBox.text(message.name);
                        var timestampBox = jQuery('<span class="timestamp"></span>');
                        timestampBox.text(new Date(message.timestamp).toLocaleString());
                        var textBox = jQuery('<p class="message"></p>');
                        textBox.text(message.text);
                        var messageContainer = jQuery('<div id="' + message.id + '" class="' + (mine ? "your " : "") + 'response"></div>');
                        messageContainer.append(userIdBox);
                        messageContainer.append(timestampBox);
                        messageContainer.append(textBox);
                        if (!replyDisabled) {
                            var messageReplyButton = document.createElement('a');
                            messageReplyButton.classList.add('messageReplyButton');
                            messageReplyButton.textContent = 'Reply';
                            messageReplyButton.addEventListener('click', function (event) {
                                event.preventDefault();
                                discussion.replyDiscussion(event);
                            });
                            messageContainer.append(jQuery(messageReplyButton));
                        }
                        var chatReplies = document.createElement('div');
                        chatReplies.classList.add('chatReplies');
                        messageContainer.append(jQuery(chatReplies));
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
                        //         jQuery('#' + this.getAttribute('messageID')).remove();
                        //     });

                        //     messageDeleteButtonWrapper.appendChild(messageDeleteButton);
                        //     messageContainer.append(jQuery(messageDeleteButtonWrapper));
                        // }
                        jQuery(responseBox).prepend(messageContainer);
                        var thread = message.id;
                        var messageHandle = discussion.messageHandler(jQuery(chatReplies), thread);
                        globalPebl.subscribeThread(thread, false, messageHandle);
                    }
                }
            }
        });
    };
}

discussion.createThread = function (thread, input, prompt, textarea, responseBox) {
    var messageHandle = discussion.messageHandler(responseBox, thread);
    globalPebl.subscribeThread(thread, false, messageHandle);
    if (input.trim() != "") {
        var message = {
            "prompt": prompt,
            "thread": thread,
            "text": input
        };
        globalPebl.emitEvent(globalPebl.events.newMessage,
            message);
        jQuery(textarea).val("");
    }
}

discussion.createSubThread = function (thread, input, prompt, textarea, responseBox) {
    var messageHandle = discussion.messageHandler(responseBox, thread);
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



discussion.handleChatButtonClick = function (elem) {
    jQuery('.lightBox').remove();
    var element,
        question;
    if (elem)
        element = jQuery(elem);
    else
        element = jQuery(this);
    question = element.parent().children('p:first').text();
    if (globalPebl) {
        if ((element[0].id != null) && (element[0].id != "")) {
            if (element.parent().children(".chatBox").length == 0) {
                discussion.createDiscussionLightBox(question, element[0]);
            }
        }
    }
}

discussion.replyDiscussion = function (event) {
    discussion.replyClose();
    var parentPost = jQuery(event.currentTarget).parent();
    var parentAuthor = parentPost.children('.userId');
    var parentMessage = parentPost.children('.message').text();
    var parentId = parentPost.attr('id');
    var parentChatReplies = parentPost.children('.chatReplies');

    var replyContainer = document.createElement('div');
    replyContainer.classList.add('replyContainer');

    var replyTextArea = document.createElement('textarea');
    replyTextArea.classList.add('replyTextArea');
    replyTextArea.placeholder = 'Reply to ' + parentAuthor.text();

    var replyCloseButton = document.createElement('button');
    replyCloseButton.classList.add('replyCloseButton');
    replyCloseButton.textContent = 'Cancel';
    replyCloseButton.addEventListener('click', discussion.replyClose);

    var replySubmitButton = document.createElement('button');
    replySubmitButton.classList.add('replySubmitButton');
    replySubmitButton.textContent = 'Submit';
    replySubmitButton.addEventListener('click', function (event) {
        discussion.replySubmit(parentId, jQuery(replyTextArea).val(), parentMessage, jQuery(replyTextArea), parentChatReplies);
    });

    replyContainer.appendChild(replyTextArea);
    replyContainer.appendChild(replySubmitButton);
    replyContainer.appendChild(replyCloseButton);

    jQuery(event.currentTarget).hide();
    jQuery(event.currentTarget).after(replyContainer);

}

discussion.replyClose = function () {
    jQuery('.replyContainer').remove();
    jQuery('.messageReplyButton').show();
}

discussion.replySubmit = function (thread, input, prompt, textarea, responseBox) {
    discussion.createSubThread(thread, input, prompt, textarea, responseBox);
    discussion.replyClose();
}

discussion.sortMessages = function (a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}

//Combines any number of strings with _ between them
discussion.comboID = function (...strings) {
    var newID = null;
    for (var string of strings) {
        if (newID === null)
            newID = string;
        else
            newID = newID + '_' + string;
    }

    return newID;
}