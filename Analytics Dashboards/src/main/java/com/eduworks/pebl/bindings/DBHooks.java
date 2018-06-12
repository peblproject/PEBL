package com.eduworks.pebl.bindings;

import org.stjs.javascript.Array;
import org.stjs.javascript.Date;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.TimeoutHandler;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

import com.eduworks.ec.date.EcDate;
import com.eduworks.pebl.PEBL;
import com.eduworks.pebl.external.xapi.XAPIStatement;
import com.eduworks.pebl.model.Action;
import com.eduworks.pebl.model.Annotation;
import com.eduworks.pebl.model.Endpoint;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.Navigation;
import com.eduworks.pebl.model.Question;
import com.eduworks.pebl.model.Quiz;
import com.eduworks.pebl.model.Session;
import com.eduworks.pebl.model.SharedAnnotation;
import com.eduworks.pebl.model.UserProfile;

public class DBHooks {

    private TimeoutHandler checkInterval;
    
    private PEBL pebl;

    public Callback1<Array<SharedAnnotation>> sharedAnnotationHook;
    public Callback1<Array<Annotation>> mineAnnotationHook;
    public Callback1<Array<Question>> mineQuestionHook;
    public Callback1<Array<Quiz>> mineQuizHook;
    public Callback1<Array<Action>> mineActionHook;
    public Callback1<Array<Session>> mineSessionHook;
    public Callback1<Array<Navigation>> mineNavigationHook;
    public Callback2<String, Array<Message>> messageHook;
    
    private Map<String, Map<String, String>> endpointsSharedSynced;
    private Map<String, Map<String, String>> endpointsMineSynced;

    private Map<String, Map<String, String>> endpointsThreadsSynced;
    
    public DBHooks(PEBL pebl) {
	this.pebl = pebl;
	endpointsSharedSynced = JSCollections.$map();
	endpointsMineSynced = JSCollections.$map();

	endpointsThreadsSynced = JSCollections.$map();
    }

    public void start() {
	DBHooks db = this;
	checkInterval = Global.setInterval(new Callback0() {
		public void $invoke() {
		    db.checkNewRecords();
		}
	    }, 2000);
	checkNewRecords();
    }

    public void stop() {
	if (checkInterval != null) {
	    Global.clearInterval(checkInterval);
	    checkInterval = null;
	}
	clearSyncTimes();
    }

    public void clearSyncTimes() {
	endpointsSharedSynced = JSCollections.$map();
	endpointsMineSynced = JSCollections.$map();

	clearMessages();
    }

    public void clearMessages() {
	endpointsThreadsSynced = JSCollections.$map();
    }

    public Callback1<Array<XAPIStatement>> handleNewMesssages(Date filterDate, String url, String thread) {
	DBHooks self = this;
	return new Callback1<Array<XAPIStatement>>() {
	    public void $invoke(Array<XAPIStatement> rawMessages) {
		Date newestSyncDate = filterDate;
		Array<Message> messages = JSCollections.$array();
		for (int i = 0; i < rawMessages.$length(); i++) {
		    XAPIStatement xapi = rawMessages.$get(i);
		    Date tempSyncDate = new Date((String)xapi.$get("stored"));
		    if (tempSyncDate.getTime() > filterDate.getTime()) {
			if (tempSyncDate.getTime() > newestSyncDate.getTime())
			    newestSyncDate = tempSyncDate;
			messages.push(new Message(xapi));
		    }
		}
			
		if ((messages.$length() > 0) && (self.messageHook != null)) {
		    newestSyncDate.setTime((int)newestSyncDate.getTime()+1);
		    self.endpointsThreadsSynced.$get(url).$put(thread, EcDate.toISOString(newestSyncDate));
		    self.messageHook.$invoke(self.pebl.userManager.getUser().getIdentity(), messages);
		}		    
	    }
	};
    }

    public Callback1<Array<XAPIStatement>> handleSharedAnnotations(Date filterDate, String url, String book) {
	DBHooks self = this;
	return new Callback1<Array<XAPIStatement>>() {
	    public void $invoke(Array<XAPIStatement> rawAnnotations) {
		Date newestSyncDate = filterDate;
		Array<SharedAnnotation> annotations = JSCollections.$array();
		for (int i = 0; i < rawAnnotations.$length(); i++) {
		    XAPIStatement xapi = rawAnnotations.$get(i);
		    Date tempSyncDate = new Date((String)xapi.$get("stored"));
		    if (tempSyncDate.getTime() > filterDate.getTime()) {
			if (tempSyncDate.getTime() > newestSyncDate.getTime())
			    newestSyncDate = tempSyncDate;
			annotations.push(new SharedAnnotation(xapi));
		    }
		}
			
		if ((annotations.$length() > 0) && (self.sharedAnnotationHook != null)) {
		    newestSyncDate.setTime((int)newestSyncDate.getTime()+1);
		    self.endpointsSharedSynced.$get(url).$put(book, EcDate.toISOString(newestSyncDate));
		    self.sharedAnnotationHook.$invoke(annotations);
		}
	    }
	};
    }

    public Callback1<Array<XAPIStatement>> handleEvents(Date filterDate, String url, String book) {
	DBHooks self = this;
	return new Callback1<Array<XAPIStatement>>() {
	    public void $invoke(Array<XAPIStatement> rawEvents) {
		Date newestSyncDate = filterDate;
		Array<Quiz> quizzes = JSCollections.$array();
		Array<Question> questions = JSCollections.$array();
		Array<Action> actions = JSCollections.$array();
		Array<Session> sessions = JSCollections.$array();
		Array<Navigation> navigations = JSCollections.$array();
		for (int i = 0; i < rawEvents.$length(); i++) {
		    XAPIStatement xapi = rawEvents.$get(i);
		    Date tempSyncDate = new Date((String)xapi.$get("stored"));
		    if (tempSyncDate.getTime() > filterDate.getTime()) {
			if (tempSyncDate.getTime() > newestSyncDate.getTime())
			    newestSyncDate = tempSyncDate;
			if (Quiz.is(xapi))
			    quizzes.push(new Quiz(xapi));
			else if (Question.is(xapi))
			    questions.push(new Question(xapi));
			else if (Session.is(xapi))
			    sessions.push(new Session(xapi));
			else if (Action.is(xapi))
			    actions.push(new Action(xapi));
			else if (Navigation.is(xapi))
			    navigations.push(new Navigation(xapi));
		    }
		}

		if (self.mineAnnotationHook != null) {
		    boolean updateTime = false;
		    if (quizzes.$length() != 0) {
			self.mineQuizHook.$invoke(quizzes);
			updateTime = true;
		    }

		    if (questions.$length() != 0) {
			self.mineQuestionHook.$invoke(questions);
			updateTime = true;
		    }

		    if (actions.$length() != 0) {
			self.mineActionHook.$invoke(actions);
			updateTime = true;
		    }

		    if (sessions.$length() != 0) {
			self.mineSessionHook.$invoke(sessions);
			updateTime = true;
		    }
		    
		    if (navigations.$length() != 0) {
			self.mineNavigationHook.$invoke(navigations);
			updateTime = true;
		    }

		    if (updateTime) {
			newestSyncDate.setTime((int)newestSyncDate.getTime()+1);
			self.endpointsMineSynced.$get(url).$put(book, EcDate.toISOString(newestSyncDate));	
		    }
		}
	    }
	};
    }
    
    public void checkNewRecords() {
    DBHooks self = this;
	UserProfile user = pebl.userManager.getUser();
        Map<String, Endpoint> endpoints = pebl.userManager.getUser().getLrsUrls();

	for (String url : endpoints) {

	    Endpoint endpoint = endpoints.$get(url);
	    String book = pebl.activityManager.getBook();

	    for (String thread : pebl.activityManager.getThreads()) {
		if (endpointsThreadsSynced.$get(url)==null)
		    endpointsThreadsSynced.$put(url, JSCollections.$map());
		String tempLastSynced = (String)endpointsThreadsSynced.$get(url).$get(thread);
		if (tempLastSynced == null)
		    tempLastSynced = "2017-04-05T21:07:49-07:00";
		String lastSyncedTimestamp = endpoint.lastSyncedThreads.$get(thread);
		if (tempLastSynced != lastSyncedTimestamp) {
		    Date filterDate = new Date(tempLastSynced);
		    
		    pebl.storage.getMessages(user,
					     thread,
					     handleNewMesssages(filterDate, url, thread));
		}
	    }
	    
	    if (endpointsSharedSynced.$get(url)==null)
		endpointsSharedSynced.$put(url, JSCollections.$map());
	    String tempLastSynced = (String)endpointsSharedSynced.$get(url).$get(book);
	    if (tempLastSynced == null)
		tempLastSynced = "2017-04-05T21:07:49-07:00";
	    String lastSyncedTimestamp = endpoint.lastSyncedBooksShared.$get(book);
	    if (tempLastSynced != lastSyncedTimestamp) {
		Date filterDate = new Date(tempLastSynced);
		
		pebl.storage.getGeneralAnnotations(user,
						   book,
						   handleSharedAnnotations(filterDate, url, book));
	    }

	    if (endpointsMineSynced.$get(url)==null)
	        endpointsMineSynced.$put(url, JSCollections.$map());
	    tempLastSynced = (String)endpointsMineSynced.$get(url).$get(book);
	    if (tempLastSynced == null)
		tempLastSynced = "2017-04-05T21:07:49-07:00";
	    lastSyncedTimestamp = endpoint.lastSyncedBooksMine.$get(book);
	    Date filterDate = new Date(tempLastSynced);
	    if (tempLastSynced != lastSyncedTimestamp) {
			
		pebl.storage.getAnnotations(user,
					    book,
					    new Callback1<Array<XAPIStatement>>() {
						public void $invoke(Array<XAPIStatement> rawAnnotations) {
						    Date newestSyncDate = filterDate;
						    Array<Annotation> annotations = JSCollections.$array();
						    for (int i = 0; i < rawAnnotations.$length(); i++) {
							XAPIStatement xapi = rawAnnotations.$get(i);
							Date tempSyncDate = new Date((String)xapi.$get("stored"));
							if (tempSyncDate.getTime() > filterDate.getTime()) {
							    if (tempSyncDate.getTime() > newestSyncDate.getTime())
								newestSyncDate = tempSyncDate;
							    annotations.push(new Annotation(xapi));
							}
						    }
						    if ((annotations.$length() > 0) && (self.mineAnnotationHook != null)) {
							    newestSyncDate.setTime((int)newestSyncDate.getTime()+1);
							    self.mineAnnotationHook.$invoke(annotations);
							}
						}
					    });
					
		pebl.storage.getEvents(user,
				       book,
				       handleEvents(filterDate, url, book));
		
	    }
	}
	    
    }

}
