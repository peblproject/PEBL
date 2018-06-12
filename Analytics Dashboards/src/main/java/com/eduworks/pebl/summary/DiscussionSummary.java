package com.eduworks.pebl.summary;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.TimeSeriesData;

public class DiscussionSummary {

    Map<String, Message> messages;
    
    public DiscussionSummary() {
	messages = JSCollections.$map();
    }

    public void addMessage(Message message) {
	messages.$put(message.id, message);
    }

    public Array<Message> getMessages() {
	Array<Message> sortedMessages = JSCollections.$array();
	for (String key : messages)
	    sortedMessages.push(messages.$get(key));
	return TimeSeriesData.sort(sortedMessages, true);
    }
}
