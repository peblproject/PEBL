package com.eduworks.pebl.summary;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

import com.eduworks.pebl.model.Action;
import com.eduworks.pebl.model.Annotation;
import com.eduworks.pebl.model.Navigation;
import com.eduworks.pebl.model.Session;
import com.eduworks.pebl.model.SharedAnnotation;
import com.eduworks.pebl.model.TimeSeriesData;

public class ActivitySummary {

    public final int id;
    public final String activity;
    public String activityName;
    public String activityDescription;
    
    private Map<String, Navigation> navigations;
    private Map<String, Action> actions;
    private Map<String, Session> sessions;
    private Map<String, Annotation> annotations;
    private Map<String, SharedAnnotation> sharedAnnotations;
    
    public ActivitySummary(String activity) {
	this.activity = activity;
	this.id = hashString(activity);
	actions = JSCollections.$map();
	sessions = JSCollections.$map();
	navigations = JSCollections.$map();
	annotations = JSCollections.$map();
	sharedAnnotations = JSCollections.$map();
    }

    public void addTimeSeriesData(TimeSeriesData data) {
	if (data instanceof Action)
	    actions.$put(data.id, (Action)data);
	else if (data instanceof Navigation)
	    navigations.$put(data.id, (Navigation)data);
	else if (data instanceof Annotation)
	    annotations.$put(data.id, (Annotation)data);
	else if (data instanceof SharedAnnotation)
	    sharedAnnotations.$put(data.id, (SharedAnnotation)data);
	else if (data instanceof Session) {
	    Session s = (Session)data;
	    sessions.$put(data.id, s);
	    if (s.activityName != null)
		activityName = s.activityName;
	    if (s.activityDescription != null)
		activityDescription = s.activityDescription;
	}
    }

    public Map<String, Navigation> getNavigations() {
	return navigations;
    }

    public Map<String, Action> getActions() {
	return actions;
    }

    public Map<String, Annotation> getAnnotations() {
	return annotations;
    }

    public Map<String, Session> getSessions() {
	return sessions;
    }
    
    public Map<String, SharedAnnotation> getSharedAnnotations() {
	return sharedAnnotations;
    }
    
    private int hashString(String s) {
	int hash = 0;
	for (int i = 0; i < s.length(); i++)
	    hash = ((hash << 7) ^ hash) + s.codePointAt(i);
	return hash;
    }

}
