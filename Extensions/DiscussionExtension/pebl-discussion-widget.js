$(document).ready(function() {
    $('.discussion_discussionExtension').each(function() {
        var buttonText = $(this)[0].getAttribute('data-buttonText');
        var prompt = $(this)[0].getAttribute('data-prompt');
        var id = $(this)[0].getAttribute('data-id');
        var detailText = $(this)[0].hasAttribute('data-detailText') ? $(this)[0].getAttribute('data-detailText') : null;
        var insertID = $(this)[0].getAttribute('id');
        createDiscussion(insertID, buttonText, prompt, id, detailText);
    });
});

function createDiscussion(insertID, buttonText, question, id, detailText) {
    var calloutDiv,
        chatButton,
        questionParagraph,
        insertLocation;

    calloutDiv = document.createElement('div');
    calloutDiv.classList.add('callout');

    chatButton = document.createElement('button');
    chatButton.classList.add('chat');
    chatButton.id = id;
    chatButton.innerHTML = buttonText;
    if (detailText)
        chatButton.setAttribute('detailText', detailText);
    chatButton.addEventListener('click', handleChatButtonClick);

    questionParagraph = document.createElement('p');
    questionParagraph.innerHTML = question;

    calloutDiv.appendChild(chatButton);
    calloutDiv.appendChild(questionParagraph);

    insertLocation = document.getElementById(insertID);

    insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
    insertLocation.remove();
}

function messageHandler(responseBox, thread) {
    return function (newMessages) {
    newMessages.sort(sortMessages);
    for (var i = 0; i < newMessages.length; i++) {
        var message = newMessages[i];
        if ($("#" + message.id).length == 0) {
	    var mine;
        if (window.top.pebl != null)
            mine = window.top.pebl.userManager.profile.identity == message.userId;
        else
            mine = pebl.userManager.profile.identity == message.userId;
        var userIdBox = $('<span class="userId"></span>');
        userIdBox.text(mine ? "You" : message.name);
        var timestampBox = $('<span class="timestamp"></span>');
        timestampBox.text(new Date(message.timestamp).toLocaleString());
        var textBox = $('<p class="message"></p>');
        textBox.text(message.text);
        var messageContainer = $('<div id="' + message.id  + '" class="' + (mine?"your ":"") + 'response"></div>');
        messageContainer.append(userIdBox);
        messageContainer.append(timestampBox);
        messageContainer.append(textBox);
        if (mine) {
            var messageDeleteButtonWrapper = document.createElement('div');
            messageDeleteButtonWrapper.classList.add('messageDeleteButtonWrapper');

            var messageDeleteButton = document.createElement('span');
            messageDeleteButton.classList.add('messageDeleteButton');
            messageDeleteButton.innerHTML = '&#215;';
            messageDeleteButton.setAttribute('messageID', message.id);
            messageDeleteButton.setAttribute('thread', thread);
            messageDeleteButton.addEventListener('click', function() {
                window.pebl.removeMessage(this.getAttribute('messageID'), this.getAttribute('thread'));
                $('#' + this.getAttribute('messageID')).remove();
            });

            messageDeleteButtonWrapper.appendChild(messageDeleteButton);
            messageContainer.append($(messageDeleteButtonWrapper));
        }
        responseBox.prepend(messageContainer);
        }
    }
    };
}

function createThread(thread, element, moreInput) {
    var chatInputBox = $(element).parent();
    var responseBox = chatInputBox.siblings('.chatResponses');
    var messageHandle = messageHandler(responseBox, thread);
    if (window.top.pebl != null)
        window.top.pebl.subscribeToDiscussion(thread, messageHandle);
    else
        pebl.subscribeToDiscussion(thread, messageHandle);
    var input = $(element).parent().find("textarea").val();
    var prompt = $(element).parent().parent().parent().children("p").text();
    if (input.trim() != "") {
    var message = {
        "prompt" : prompt,
        "timestamp" : new Date().toISOString(),
        "thread" : thread,
        "text" : input
    };
    if (window.top.pebl != null)
        window.top.pebl.postMessage(message);
    else
        pebl.postMessage(message);
    localStorage.setItem('peblThread-' + thread, 'true');
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
    var chatResponses = $('<div class="chatResponses" style="display:none;"><div><!--<a class="showMore">Show more...</a>--></div></div>');
    var chatInput = $('<div class="chatInput" style="display:none;"><label id="discussionDetailText">Submit your response to see what others said.</label><textarea id="discussionTextArea"></textarea><button class="discussionCloseButton">Cancel</button><button class="chatSubmit">Submit</button></div>');
    var chat = $('<div class="chatBox"></div>');
    chat.append(chatInput);
    chat.append(chatResponses);
    
    element.append(chat);
    if (chatButton.hasAttribute('detailText'))
        document.getElementById('discussionDetailText').textContent = chatButton.getAttribute('detailText');
    element.find(".chatInput").slideDown();

    //if User has already contributed, show responses
    if (localStorage.getItem('peblThread-' + chatButton.id) === 'true') {
        var responseBox = $('.chatResponses');
        var messageHandle = messageHandler(responseBox, chatButton.id);
        if (window.top.pebl != null)
            window.top.pebl.subscribeToDiscussion(chatButton.id, messageHandle);
        else
            pebl.subscribeToDiscussion(chatButton.id, messageHandle);
        responseBox.slideDown();
    }

    chatInput.on('click', 'button.chatSubmit', function () {
        createThread(chatButton.id, $(this), true);
    });

    chatInput.on('click', 'button.discussionCloseButton', function() {
        closeLightBox();
    });
}

function handleChatButtonClick() {
    $('#deviceInfo').text("Testing");
    $('#debugWindowResult').val(0);
    var element,
        question;
    element = $(this);
    question = element.parent().children('p:first').text();
    $('#debugWindowResult').val(1);
    if (window.top.pebl != null || pebl != null) {
        $('#debugWindowResult').val(2);
    if ((this.id != null) && (this.id != "")) {
        $('#debugWindowResult').val(3);
        if (element.parent().children(".chatBox").length == 0) {
            $('#debugWindowResult').val(4);
            openDiscussionLightbox(question, this);
            $('#debugWindowResult').val(5);
            $('#discussionTextArea').focus();
        }
    }
    }
}

function sortMessages(a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}
