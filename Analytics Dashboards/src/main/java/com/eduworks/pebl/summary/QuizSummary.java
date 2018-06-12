package com.eduworks.pebl.summary;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

import com.eduworks.pebl.model.Question;
import com.eduworks.pebl.model.Quiz;

public class QuizSummary {

    private Map<String, Question> questions;
    private Quiz details;
    
    public QuizSummary() {
	questions = JSCollections.$map();
    }

    public boolean addQuestion(Question q) {
	if ((details == null) || (details.timestamp.getTime() > q.timestamp.getTime())) {
	    questions.$put(q.id, q);
	    return true;
	}
	return false;
    }

    public Map<String, Question> getQuestions() {
	return questions;
    }

    public Quiz getDetails() {
	return details;
    }
    
    public void setQuiz(Quiz quiz) {
	details = quiz;
    }

    public double getTime() {
	if (details != null)
	    return details.timestamp.getTime();
	return -1;
    }

    public String getId() {
	if (details != null)
	    return details.id;
	return null;	
    }
}
