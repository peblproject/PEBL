package com.eduworks.pebl;

import org.stjs.javascript.dom.Element;
import org.stjs.javascript.jquery.Event;
import org.stjs.javascript.jquery.EventHandler;
import org.stjs.javascript.jquery.GlobalJQuery;
import org.stjs.javascript.jquery.JQueryCore;

public class UIUtils {

    public static EventHandler createCollapseClickHandler(String id) {
	return new EventHandler() {
	    @Override
	    public boolean onEvent(Event ev, Element THIS) {
		JQueryCore e = GlobalJQuery.$("#" + id);
		e.slideToggle(500);
		return false;
	    }
		    
	};
    }
}
