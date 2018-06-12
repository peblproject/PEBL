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
import com.eduworks.pebl.renderer.StudentRenderer;
import com.eduworks.pebl.summary.StudentSummary;

public class StudentBindings implements Bindings {

    private StudentSummary ss;

    private PEBL pebl;
    private StudentRenderer renderer;

    
    public StudentBindings(DBHooks hooks, StudentRenderer renderer, PEBL pebl) {
	ss = new StudentSummary();
		this.renderer = renderer;
	this.pebl = pebl;

	clear();

	StudentBindings sb = this;
	hooks.sharedAnnotationHook = new Callback1<Array<SharedAnnotation>>() {
		public void $invoke(Array<SharedAnnotation> incoming) {
		    renderer.showActivitySummary(sb.ss.buildActivitySummariesSharedAnnotation(incoming));
		}
	    };

	hooks.mineAnnotationHook = new Callback1<Array<Annotation>>() {
		public void $invoke(Array<Annotation> incoming) {
		    renderer.showActivitySummary(sb.ss.buildActivitySummariesAnnotation(incoming));
		}
	    };

	hooks.mineQuestionHook = new Callback1<Array<Question>>() {
		public void $invoke(Array<Question> incoming) {
		    renderer.showQuizzes(sb.ss.buildQuizSummariesQuestion(incoming));
		}
	    };

	hooks.mineQuizHook = new Callback1<Array<Quiz>>() {
		public void $invoke(Array<Quiz> incoming) {
		    renderer.showQuizzes(sb.ss.buildQuizSummariesQuiz(incoming));
		}
	    };
	
	hooks.mineActionHook = new Callback1<Array<Action>>() {
		public void $invoke(Array<Action> incoming) {
		    renderer.showActivitySummary(sb.ss.buildActivitySummariesAction(incoming));
		}
	    };


	hooks.mineNavigationHook = new Callback1<Array<Navigation>>() {
		public void $invoke(Array<Navigation> incoming) {
		    renderer.showActivitySummary(sb.ss.buildActivitySummariesNavigation(incoming));
		}
	    };
	
	hooks.mineSessionHook = new Callback1<Array<Session>>() {
		public void $invoke(Array<Session> incoming) {
		    //used for getting time spent in books
		    sb.ss.buildActivitySummariesSession(incoming);
		    renderer.showTotalTime(sb.ss.timePerBook);
		    renderer.showAveragePerSession(sb.ss.timePerSession);
		    renderer.showAveragePerSection(sb.ss.timePerSection);
		}
	    };

	hooks.messageHook = new Callback2<String, Array<Message>>() {
		public void $invoke(String userId, Array<Message> incoming) {
		    renderer.showDiscussionSummary(userId, sb.ss.buildDiscussionSummariesMessage(incoming));
		}		
	    };
    }

    @Override
    public void enableDirectMessaging() {
        StudentBindings sb = this;
	// pebl.setDirectMessageHandler(new Callback1<Array<Message>>() {
	// 	public void $invoke(Array<Message> incoming) {
	// 	    // renderer.showDiscussionSummary(pebl.getUserName(),
	// 	    // 				   tb.ts.buildDiscussionSummariesMessage(incoming));
	// 	}
	//     });

	// pebl.activateDirectMessages();
    }
    
    public void clear() {
	ss.clear();
	clearMessages();
    }

    public void clearMessages() {
	ss.clearMessages();
    }
}
