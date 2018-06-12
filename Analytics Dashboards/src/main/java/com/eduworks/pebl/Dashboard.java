package com.eduworks.pebl;

import org.stjs.javascript.Array;
import org.stjs.javascript.Date;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.jquery.GlobalJQuery;
import org.stjs.javascript.jquery.JQueryCore;

import com.eduworks.ec.date.EcDate;
import com.eduworks.pebl.adapter.Bindings;
import com.eduworks.pebl.adapter.Renderer;
import com.eduworks.pebl.bindings.DBHooks;
import com.eduworks.pebl.bindings.StudentBindings;
import com.eduworks.pebl.bindings.TeacherBindings;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.TimeSeriesData;
import com.eduworks.pebl.renderer.StudentRenderer;
import com.eduworks.pebl.renderer.TeacherRenderer;

public class Dashboard {

    public static PEBL pebl;
    public static DBHooks dbHooks;
    public static Bindings bindings;
    public static Renderer renderer;

    // public static void pushContent(String target, String location, String url) {
    // pebl.xapiGenerator.pushed(target, location, url);
    // }

    // public static void pullContent(String target, String location, String url) {
    // pebl.xapiGenerator.pulled(target, location, url);	
    // }

    public static void setLoggedInUser() {
	Element e = Global.window.document.getElementById("userName");
	e.innerHTML = pebl.userManager.getUser().getName();
	hideElements();	
    }

    public static void hideElements() {
    	Element div = Global.window.document.getElementById("noBookSelectedDiv");
	Element menuButton = Global.window.document.getElementById("fixedMenuButton");
	if (pebl.activityManager.getBook().equals("Dashboard")) {
	    div.setAttribute("style", "");
	    if (menuButton != null)
		menuButton.setAttribute("style", "display:none");
	    GlobalJQuery.$("#booksButton").attr("class", "slide-out-trigger btn waves-effect waves-light orange lighten-2 pulse");
	} else {
	    div.setAttribute("style","display:none");
	    if (menuButton != null)
		menuButton.setAttribute("style", "");
	    GlobalJQuery.$("#booksButton").attr("class", "slide-out-trigger btn waves-effect waves-light orange lighten-2");
	}
    }


    public static void postMessage(String thread, String prompt, String message) {
	Map<String, Object> msg = JSCollections.$map();
	msg.$put(Message.KEY_THREAD, thread);
	msg.$put(Message.KEY_PROMPT, prompt);
	msg.$put(Message.KEY_TEXT, message);
	msg.$put(Message.KEY_TIMESTAMP, EcDate.toISOString(new Date()));
	pebl.postMessage(msg);
    }

    public static void openBook(String book) {
	if (pebl.activityManager.getBook().equals(book))
	    return;
	
	dbHooks.stop();
	pebl.activityManager.openBook(book, new Callback1<Boolean>() {
		public void $invoke(Boolean sameBook) {
		    pebl.activityManager.unsubscribeAll();
		    bindings.clear();
		    //renderer.clear();
		    dbHooks.start();
		    hideElements();
		}
	    });
    }

    public static void subscribeThread(String thread) {
	if (pebl.activityManager.getThreads().$get(thread) == null) {
	    pebl.activityManager.unsubscribeAll();
	    renderer.clearMessages();
	    dbHooks.clearMessages();
	    bindings.clearMessages();
	    pebl.activityManager.subscribe(thread, new Callback1<Array<TimeSeriesData>>() {
		    public void $invoke(Array<TimeSeriesData> incoming) {
			//empty by design
		    }
		});
	}
    }
    
    public static void init(boolean teacher) {
	PEBL.start(teacher,
		   new Callback1<PEBL>() {
		       public void $invoke(PEBL readyPebl) {
			   pebl = readyPebl;
			   dbHooks = new DBHooks(pebl);
	
			   if (teacher) {
			       renderer = new TeacherRenderer();
			       bindings = new TeacherBindings(dbHooks, (TeacherRenderer)renderer, pebl);
			   } else {
			       renderer = new StudentRenderer();
			       bindings = new StudentBindings(dbHooks, (StudentRenderer)renderer, pebl);
			   }

			   pebl.activityManager.openBook("Dashboard",
							 new Callback1<Boolean>() {
							     public void $invoke(Boolean sameBook) {
								 pebl.activityManager.startParentActivity("peblDashboard://website");
								 pebl.login(new Callback0() {
									 public void $invoke() {
									     dbHooks.start();
									     bindings.clear();
									     bindings.enableDirectMessaging();
									     setLoggedInUser();
									 }
								     });
	
								 Element e = Global.window.document.getElementById("userLogout");
								 e.setAttribute("style","");
	
								 e.onclick = new Function1<DOMEvent, Boolean>() {
									 public Boolean $invoke(DOMEvent event) {
									     pebl.activityManager.openBook("Dashboard",
													   new Callback1<Boolean>() {
													       public void $invoke(Boolean sameBook) {
														   pebl.activityManager.startParentActivity("peblDashboard://website");
														   dbHooks.stop();
														   bindings.clear();
														   pebl.activityManager.unsubscribeAll();
														   setLoggedInUser();
														   renderer.clear();
														   pebl.logout();
													       }
													   });
									     return true;
									 }
								     };	
							     }
							 });

		       }
		   },
		   false);
    }
}

