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

public class StudentSummary {

    public Array<Annotation> annotations;
    public Array<SharedAnnotation> sharedAnnotations;
    public Array<Question> questions;
    public Array<Quiz> quizzes;
    public Array<Action> actions;
    public Array<Navigation> navigations;
    public Array<Session> sessions;
    public Array<Message> messages;

    public Map<String, DiscussionSummary> discussionSummaries;
    public Array<QuizSummary> quizSummaries;
    public Map<String, ActivitySummary> activitySummaries;

    public String actor;
    
    public float timePerBook;
    public float timePerSession;
    public float timePerSection;

    public StudentSummary() {
	clear();
    }
    
    private <T extends TimeSeriesData> void addToActivitySummary(T tsd) {
	String parentActivity = tsd.parentActivity;
	ActivitySummary summary = activitySummaries.$get(parentActivity);
	if (summary == null) {
	    summary = new ActivitySummary(parentActivity);
	    activitySummaries.$put(parentActivity, summary);
	}
	summary.addTimeSeriesData(tsd);
    }

    private void fillQuestions(Array<Question> questions) {
	for (int qI = 0; qI < questions.$length(); qI++) {
	    Question question = questions.$get(qI);
	    boolean added = false;
	    for (int i = 0; i < quizSummaries.$length() && !added; i++)
		added = quizSummaries.$get(i).addQuestion(question);
	    if (!added) {
		QuizSummary attempt = new QuizSummary();
		attempt.addQuestion(question);
		quizSummaries.push(attempt);
	    }
	}
    }
    
    public void buildDiscussionSummaries() {
	for (int i = 0; i < messages.$length(); i++) {
	    Message message = (Message)messages.$get(i);
	    if (discussionSummaries.$get(message.thread) == null)
	        discussionSummaries.$put(message.thread, new DiscussionSummary());
	    discussionSummaries.$get(message.thread).addMessage(message);
	}	
    }
    
    public void buildQuizSummaries() {
	quizSummaries = JSCollections.$array();
	for (int qI = 0; qI < quizzes.$length(); qI++) {
	    Quiz quiz = quizzes.$get(qI);
	    QuizSummary attempt = new QuizSummary();
	    attempt.setQuiz(quiz);
	    quizSummaries.push(attempt);
	}
	fillQuestions(questions);
    }

    public void addAnnotation(Annotation annotation) {
	if (actor == null)
	    actor = annotation.actorId;
	annotations.push(annotation);
	addToActivitySummary(annotation);
    }

    public void addAction(Action action) {
	if (actor == null)
	    actor = action.actorId;
        actions.push(action);
	addToActivitySummary(action);
    }
    
    public void addSharedAnnotation(SharedAnnotation annotation) {
	if (actor == null)
	    actor = annotation.actorId;
	sharedAnnotations.push(annotation);
	addToActivitySummary(annotation);
    }

    public void addQuestion(Question question) {
	if (actor == null)
	    actor = question.actorId;
	questions.push(question);
    }

    public void addQuiz(Quiz quiz) {
	if (actor == null)
	    actor = quiz.actorId;
	quizzes.push(quiz);
    }

    public void addSession(Session session) {
	if (actor == null)
	    actor = session.actorId;
	sessions.push(session);
	addToActivitySummary(session);
    }

    public void addNavigation(Navigation navigation) {
	if (actor == null)
	    actor = navigation.actorId;
	navigations.push(navigation);
	addToActivitySummary(navigation);
    }

    public void addMessage(Message message) {
	messages.push(message);
    }
    
    private <T extends TimeSeriesData> void appendNewRecords(Array<T> store, Array<T> tsd) {
	for (int i = 0; i < tsd.$length(); i++)
	    store.push(tsd.$get(i));
	TimeSeriesData.sort((Array<TimeSeriesData>)store, false);
    }
    
    private <T extends TimeSeriesData> void addNewTimeSeriesDataActivity(Array<T> store, Array<T> tsd) {
	appendNewRecords(store, tsd);
	
	for (int i = 0; i < store.$length(); i++) 
	    addToActivitySummary(store.$get(i));	
    }

    private <T extends TimeSeriesData> void addNewTimeSeriesDataQuiz(Array<T> store, Array<T> tsd) {
    	appendNewRecords(store, tsd);
	
	buildQuizSummaries();
    }

    private <T extends TimeSeriesData> void addNewTimeSeriesDataMessage(Array<T> store, Array<T> tsd) {
    	appendNewRecords(store, tsd);

	buildDiscussionSummaries();
    }
    
    public Map<String, ActivitySummary> buildActivitySummariesAnnotation(Array<Annotation> newAnnotations) {
	if ((actor == null) && (newAnnotations.$length() != 0))
	    actor = newAnnotations.$get(0).actorId;
	addNewTimeSeriesDataActivity(annotations, newAnnotations);
	return activitySummaries;
    }

    public Map<String, ActivitySummary> buildActivitySummariesSharedAnnotation(Array<SharedAnnotation> newSharedAnnotations) {
	if ((actor == null) && (newSharedAnnotations.$length() != 0))
	    actor = newSharedAnnotations.$get(0).actorId;
	addNewTimeSeriesDataActivity(sharedAnnotations, newSharedAnnotations);
	return activitySummaries;
    }

    public Map<String, ActivitySummary> buildActivitySummariesAction(Array<Action> newActions) {
	if ((actor == null) && (newActions.$length() != 0))
	    actor = newActions.$get(0).actorId;
	addNewTimeSeriesDataActivity(actions, newActions);
	return activitySummaries;	
    }

    public Map<String, ActivitySummary> buildActivitySummariesNavigation(Array<Navigation> newNavigations) {
	if ((actor == null) && (newNavigations.$length() != 0))
	    actor = newNavigations.$get(0).actorId;
	addNewTimeSeriesDataActivity(navigations, newNavigations);
	return activitySummaries;	
    }

    public Map<String, ActivitySummary> buildActivitySummariesSession(Array<Session> newSessions) {
	if ((actor == null) && (newSessions.$length() != 0))
	    actor = newSessions.$get(0).actorId;
	addNewTimeSeriesDataActivity(sessions, newSessions);
	findTotalTime(sessions);
	findAverageSectionTime(sessions);
	findAverageSessionTime(sessions);
	return activitySummaries;	
    }

    public Array<QuizSummary> buildQuizSummariesQuiz(Array<Quiz> newQuizzes) {
	if ((actor == null) && (newQuizzes.$length() != 0))
	    actor = newQuizzes.$get(0).actorId;
	addNewTimeSeriesDataQuiz(quizzes, newQuizzes);
	return quizSummaries;
    }
    
    public Array<QuizSummary> buildQuizSummariesQuestion(Array<Question> newQuestions) {	
	if ((actor == null) && (newQuestions.$length() != 0))
	    actor = newQuestions.$get(0).actorId;
	addNewTimeSeriesDataQuiz(questions, newQuestions);
	return quizSummaries;
    }

    public Map<String, DiscussionSummary> buildDiscussionSummariesMessage(Array<Message> newMessages) {
	addNewTimeSeriesDataMessage(messages, newMessages);
	return discussionSummaries;
    }
    
    public void findTotalTime(Array<Session> navs) {
	float totalTime = 0;
	Session start = null;
	for (int i = 0; i < navs.$length(); i++) {
	    Session nav = navs.$get(i);
	    if (nav.type.equals("entered")) {
		start = nav;
	    } else if (start != null) {
		if (nav.type.equals("exited")) {
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		}

		if (nav.type.equals("logged-out")) {
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		}

		if (nav.type.equals("logged-in")) {
		    start = nav;
		}
	    }
	}
	float time = totalTime / 1000.0f;
	timePerBook = time;
    }
    
    public void findAverageSessionTime(Array<Session> navs) {
	float totalTime = 0;
	float count = 0;
	Session start = null;
	for (int i = 0; i < navs.$length(); i++) {
	    Session nav = navs.$get(i);
	    if (nav.type.equals("entered")) {
		start = nav;
	    } else if (start != null) {
		if (nav.type.equals("exited")) {
		    count++;
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		}

		if (nav.type.equals("logged-out")) {
		    count++;
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		}

		if (nav.type.equals("logged-in")) {
		    start = nav;
		}

	    }
	}
	float result = 0;
	if (count != 0)
	    result = (totalTime / 1000.0f) / count;
	timePerSession = result;
    }

    public void findAverageSectionTime(Array<Session> navs) {
	float totalTime = 0;
	float count = 0;
	Session start = null;
	boolean loggedOut = false;
	for (int i = 0; i < navs.$length(); i++) {
	    Session nav = navs.$get(i);
	    if (nav.type.equals("initialized")) {
		start = nav;
	    } else if (start != null) {
		if (nav.type.equals("terminated")) {
		    count++;
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		}

		if (nav.type.equals("exited")) {
		    count++;
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		}

		if (nav.type.equals("entered")) {
		    start = nav;
		}

		if (nav.type.equals("logged-out")) {
		    count++;
		    totalTime += nav.timestamp.getTime() - start.timestamp.getTime();
		    start = null;
		    loggedOut = true;
		}

		if (nav.type.equals("logged-in") && loggedOut) {
		    start = nav;
		    loggedOut = false;
		}

	    }
	}
	float result = 0;
	if (count != 0)
	    result = (totalTime / 1000.0f) / count;
	timePerSection = result;
    }
    
    public void clear() {
	annotations = JSCollections.$array();
	sharedAnnotations = JSCollections.$array();
	questions = JSCollections.$array();
	quizzes = JSCollections.$array();
	actions = JSCollections.$array();
	sessions = JSCollections.$array();
	navigations = JSCollections.$array();
	quizSummaries = JSCollections.$array();
	activitySummaries = JSCollections.$map();

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
