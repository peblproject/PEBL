function createDiscussion(buttonText, question, id, detailText) {
    var calloutDiv,
        chatButton,
        questionParagraph,
        scripts,
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

    scripts = document.getElementsByTagName('script');
    insertLocation = scripts[scripts.length - 1];

    insertLocation.parentNode.insertBefore(calloutDiv, insertLocation);
    insertLocation.remove();
}

function messageHandler(responseBox, thread) {
    return function (newMessages) {
    newMessages.sort(sortMessages);
    for (var i = 0; i < newMessages.length; i++) {
        var message = newMessages[i];
        if ($("#" + message.id).length == 0) {
        var mine = window.top.pebl.getUserName() == message.userId;
        var userIdBox = $('<span class="userId"></span>');
        userIdBox.text(mine ? "You" : message.userId);
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
            messageDeleteButton.onclick = function() {
                window.pebl.removeMessage(this.getAttribute('messageID'), this.getAttribute('thread'));
                $('#' + this.getAttribute('messageID')).remove();
            }

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
    window.top.pebl.subscribeToDiscussion(thread, messageHandle);
    var input = $(element).parent().find("textarea").val();
    var prompt = $(element).parent().parent().parent().children("p").text();
    if (input.trim() != "") {
    var message = {
        "prompt" : prompt,
        "timestamp" : new Date().toISOString(),
        "thread" : thread,
        "text" : input
    };
    window.top.pebl.postMessage(message);
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
        window.top.pebl.subscribeToDiscussion(chatButton.id, messageHandle);
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
    var element,
        question;
    element = $(this);
    question = element.parent().children('p:first').text();
    if (window.top.pebl != null) {
    if ((this.id != null) && (this.id != ""))
        if (element.parent().children(".chatBox").length == 0)
            openDiscussionLightbox(question, this);
            $('#discussionTextArea').focus();
    }
}

function sortMessages(a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}