package com.eduworks.pebl.bindings;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

import com.eduworks.pebl.PEBL;
import com.eduworks.pebl.adapter.Bindings;
import com.eduworks.pebl.model.Action;
import com.eduworks.pebl.model.Annotation;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.Navigation;
import com.eduworks.pebl.model.Question;
import com.eduworks.pebl.model.Quiz;
import com.eduworks.pebl.model.Session;
import com.eduworks.pebl.model.SharedAnnotation;
import com.eduworks.pebl.renderer.TeacherRenderer;
import com.eduworks.pebl.summary.TeacherSummary;

public class TeacherBindings implements Bindings {

    private TeacherSummary ts;

    private PEBL pebl;
    private TeacherRenderer renderer;
    
    
    @Override
    public void clear() {
	ts.clear();
	clearMessages();
    }

    @Override
    public void clearMessages() {
	ts.clearMessages();
    }

    
    @Override
    public void enableDirectMessaging() {
	TeacherBindings tb = this;
	// pebl.setDirectMessageHandler(new Callback1<Array<Message>>() {
	// 	public void $invoke(Array<Message> incoming) {
	// 	    // renderer.showDiscussionSummary(pebl.getUserName(),
	// 	    // 				   tb.ts.buildDiscussionSummariesMessage(incoming));
	// 	}
	//     });

	// pebl.activateDirectMessages();
    }

    public TeacherBindings(DBHooks hooks, TeacherRenderer renderer, PEBL pebl) {
	ts = new TeacherSummary();
	this.renderer = renderer;
	this.pebl = pebl;
	clear();
	
	TeacherBindings self = this;
	hooks.sharedAnnotationHook = new Callback1<Array<SharedAnnotation>>() {
		public void $invoke(Array<SharedAnnotation> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };

	hooks.mineAnnotationHook = new Callback1<Array<Annotation>>() {
		public void $invoke(Array<Annotation> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };

	hooks.mineQuestionHook = new Callback1<Array<Question>>() {
		public void $invoke(Array<Question> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };

	hooks.mineQuizHook = new Callback1<Array<Quiz>>() {
		public void $invoke(Array<Quiz> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };
	
	hooks.mineActionHook = new Callback1<Array<Action>>() {
		public void $invoke(Array<Action> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };

	hooks.mineNavigationHook = new Callback1<Array<Navigation>>() {
		public void $invoke(Array<Navigation> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };
	
	hooks.mineSessionHook = new Callback1<Array<Session>>() {
		public void $invoke(Array<Session> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showEverything(self.ts);
		}
	    };

	hooks.messageHook = new Callback2<String, Array<Message>>() {
		public void $invoke(String userId, Array<Message> incoming) {
		    self.ts.addTimeSeriesData(incoming);
		    renderer.showDiscussionSummary(userId, self.ts.discussionSummaries);
		}
	    };
    }    
}
