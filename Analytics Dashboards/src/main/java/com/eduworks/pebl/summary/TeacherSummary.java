package com.eduworks.pebl.summary;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

import com.eduworks.pebl.model.Action;
import com.eduworks.pebl.model.Annotation;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.Navigation;
import com.eduworks.pebl.model.Question;
import com.eduworks.pebl.model.Quiz;
import com.eduworks.pebl.model.Session;
import com.eduworks.pebl.model.SharedAnnotation;
import com.eduworks.pebl.model.TimeSeriesData;

public class TeacherSummary {

    public Array<Message> messages;
    public Map<String, DiscussionSummary> discussionSummaries;
    
    public Map<String, StudentSummary> students;

    public float timePerBook;
    public float timePerSection;
    public float timePerSession;
    
    public TeacherSummary() {
	clear();
    }

    public float getTotalTime() {
	float time = 0;
	for (String key : students) {
	    StudentSummary ss = students.$get(key);
	    ss.findTotalTime(TimeSeriesData.sort(ss.sessions, false));
	    time += ss.timePerBook;
	}
	timePerBook = time;
	return time;
    }

    public float getAveragePerSession() {
	float time = 0;
	for (String key : students) {
	    StudentSummary ss = students.$get(key);
	    ss.findAverageSessionTime(TimeSeriesData.sort(ss.sessions, false));
	    time += ss.timePerSession;
	}	
	timePerSession = time;
	return time;
    }

    public float getAveragePerSection() {
	float time = 0;
	for (String key : students) {
	    StudentSummary ss = students.$get(key);
	    ss.findAverageSectionTime(TimeSeriesData.sort(ss.sessions, false));
	    time += ss.timePerSection;
	}
	timePerSection = time;
	return time;
    }
    
    public <T extends TimeSeriesData> void addTimeSeriesData(Array<T> newRecords) {
	for (int i = 0; i < newRecords.$length(); i++) {
	    T record = newRecords.$get(i);
	    if (students.$get(record.actorId) == null)
		students.$put(record.actorId, new StudentSummary());
	    StudentSummary ss = students.$get(record.actorId);
	    if (record instanceof SharedAnnotation)
		ss.addSharedAnnotation((SharedAnnotation)record);
	    else if (record instanceof Annotation)
		ss.addAnnotation((Annotation)record);
	    else if (record instanceof Navigation)
		ss.addNavigation((Navigation)record);
	    else if (record instanceof Session)
		ss.addSession((Session)record);
	    else if (record instanceof Action)
		ss.addAction((Action)record);
	    else if (record instanceof Question)
		ss.addQuestion((Question)record);
	    else if (record instanceof Quiz)
		ss.addQuiz((Quiz)record);
	    else if (record instanceof Message) {
		Message m = (Message)record;
		if (m.direct)
		    ss.addMessage(m);
		else
		    messages.push(m);
	    }
	}
	for (String key : students) {
	    StudentSummary ss = students.$get(key);
	    ss.buildQuizSummaries();
	    ss.buildDiscussionSummaries();
	}
	buildDiscussionSummaries();
    }

    public void buildDiscussionSummaries() {
	for (int i = 0; i < messages.$length(); i++) {
	    Message message = (Message)messages.$get(i);
	    if (discussionSummaries.$get(message.thread) == null)
	        discussionSummaries.$put(message.thread, new DiscussionSummary());
	    discussionSummaries.$get(message.thread).addMessage(message);
	}	
    }
    
    public void clear() {
	students = JSCollections.$map();

	timePerBook = 0;
	timePerSession = 0;
	timePerSection = 0;
	
	clearMessages();
    }

    public void clearMessages() {
	messages = JSCollections.$array();
	discussionSummaries = JSCollections.$map();
    }
}
