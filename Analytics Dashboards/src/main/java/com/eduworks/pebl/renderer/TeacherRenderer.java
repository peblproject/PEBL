package com.eduworks.pebl.renderer;

import static com.eduworks.pebl.external.Graphs.showTeacherGraphs;
import static com.eduworks.pebl.external.Graphs.clearTeacherGraphs;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.jquery.GlobalJQuery;

import com.eduworks.pebl.adapter.Renderer;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.summary.DiscussionSummary;
import com.eduworks.pebl.summary.TeacherSummary;
import org.stjs.javascript.jquery.JQueryCore;

public class TeacherRenderer implements Renderer {

    private static final String EMPTY_ASSESSMENT_MESSAGE = "No Assessments Found<br/><div class=\"divider\"></div>";
    private static final String EMPTY_SECTION_MESSAGE = "No Sections Found<br/><div class=\"divider\"></div>";
    
    public TeacherRenderer() {
	GlobalJQuery.$("#userAssessments").html(EMPTY_ASSESSMENT_MESSAGE);
	GlobalJQuery.$(".timeCounts").html("0 min, 0 sec");
	GlobalJQuery.$("#bookSections").html(EMPTY_SECTION_MESSAGE);
	clearTeacherGraphs();
	clearMessages();
    }

    public void showEverything(TeacherSummary ts) {
	showTeacherGraphs(ts);
	showTotalTime(ts.getTotalTime());
	showAveragePerSession(ts.getAveragePerSession());
	showAveragePerSection(ts.getAveragePerSection());
    }

    public void showDiscussionSummary(String username, Map<String, DiscussionSummary> discussionSummary) {
	for (String thread : discussionSummary) {
	    DiscussionSummary ds = discussionSummary.$get(thread);
	    Array<Message> messages = ds.getMessages();
	    for (int i = 0; i < messages.$length(); i++) {
		Message msg = messages.$get(i);

		boolean mine = username.equals(msg.actorId);
		JQueryCore messageContainer = GlobalJQuery.$("#" + msg.id);
		if (messageContainer.length() == 0) {
		    messageContainer = GlobalJQuery.$("<div id=\"" + msg.id + "\" class=\"" + (mine?"your ":"") + "response\"></div>");
		
		    JQueryCore userIdBox = GlobalJQuery.$("<span class=\"userId\"></span>");
		    userIdBox.text(mine ? "You" : msg.actorId);
		    JQueryCore timestampBox = GlobalJQuery.$("<span class=\"timestamp\"></span>");
		    timestampBox.text(msg.timestamp.toString());
		    JQueryCore textBox = GlobalJQuery.$("<p class=\"message\"></p>");
		    textBox.text(msg.text);
		    messageContainer.append(userIdBox);
		    messageContainer.append(timestampBox);
		    messageContainer.append(textBox);
		}
		GlobalJQuery.$("#userDiscussions").append(messageContainer);
	    }
	}
    }
    
    public void showTotalTime(float totalTime) {
	double minutes = Math.floor(totalTime / 60.0f);
        double seconds = Math.ceil(totalTime % 60);
	GlobalJQuery.$("#totalTime").html(minutes + " min, " + seconds + " sec");
    }

    public void showAveragePerSession(float averageTime) {
	double minutes = Math.floor(averageTime / 60.0f);
        double seconds = Math.ceil(averageTime % 60);
	GlobalJQuery.$("#timePerSession").html(minutes + " min, " + seconds + " sec");
    }


    public void showAveragePerSection(float averageTime) {
	double minutes = Math.floor(averageTime / 60.0f);
        double seconds = Math.ceil(averageTime % 60);
	GlobalJQuery.$("#timePerSection").html(minutes + " min, " + seconds + " sec");
    }

    @Override
    public void clearMessages() {
	GlobalJQuery.$("#userDiscussions").html("<div class=\"divider\"></div>");
    }
    
    @Override
    public void clear() {
        GlobalJQuery.$("#mainContent").slideUp();
	GlobalJQuery.$("#index-banner").slideUp();
	GlobalJQuery.$("#userAssessments").html(EMPTY_ASSESSMENT_MESSAGE);
	GlobalJQuery.$(".timeCounts").html("0 min, 0 sec");
	GlobalJQuery.$("#bookSections").html(EMPTY_SECTION_MESSAGE);
	clearTeacherGraphs();
	clearMessages();
    }
}
