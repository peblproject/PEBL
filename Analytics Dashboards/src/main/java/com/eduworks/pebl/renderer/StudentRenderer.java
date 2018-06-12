package com.eduworks.pebl.renderer;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.jquery.GlobalJQuery;
import org.stjs.javascript.jquery.JQueryCore;

import com.eduworks.pebl.UIUtils;
import com.eduworks.pebl.adapter.Renderer;
import com.eduworks.pebl.external.Graphs;
import com.eduworks.pebl.model.Action;
import com.eduworks.pebl.model.Annotation;
import com.eduworks.pebl.model.Message;
import com.eduworks.pebl.model.Navigation;
import com.eduworks.pebl.model.Question;
import com.eduworks.pebl.model.Quiz;
import com.eduworks.pebl.model.Session;
import com.eduworks.pebl.model.SharedAnnotation;
import com.eduworks.pebl.model.TimeSeriesData;
import com.eduworks.pebl.summary.ActivitySummary;
import com.eduworks.pebl.summary.DiscussionSummary;
import com.eduworks.pebl.summary.QuizSummary;

public class StudentRenderer implements Renderer {

    private static final String EMPTY_ASSESSMENT_MESSAGE = "No Assessments Found<br/><div class=\"divider\"></div>";
    private static final String EMPTY_SECTION_MESSAGE = "No Sections Found<br/><div class=\"divider\"></div>";

    private boolean foundQuizzes;
    private boolean foundSections;

    public StudentRenderer() {
	GlobalJQuery.$("#userAssessments").html(EMPTY_ASSESSMENT_MESSAGE);
	GlobalJQuery.$(".timeCounts").html("0 min, 0 sec");
	GlobalJQuery.$("#bookSections").html(EMPTY_SECTION_MESSAGE);
	clearMessages();
	foundQuizzes = false;
	foundSections = false;
	Graphs.clearStudentGraphs();
    }
    
    public void showQuizzes(Array<QuizSummary> quizzes) {
	//    <div>
	//     <h5>Lesson 1 chapter test <span class="badge orange-text text-darken-4">75%</span></h5>
	//     <strong>Missed 3 Questions</strong>
	//               <ol id="quizQuestions<QuizID">
	//                 <li>Question text here?</li>
	//                 <li>Question text here?</li>
	//                 <li>Question text here?</li>
	//               </ol>
	//     </div>
	// <div class="divider"></div>
	// </div>

	if ((quizzes.$length() > 0) && (!foundQuizzes)) {
	    foundQuizzes = true;
	    GlobalJQuery.$("#userAssessments").html("<div class=\"divider\"></div>");
	}

	boolean pending = false;
	
	boolean isFirstPass = false;
	for (int quizIndex = 0; quizIndex < quizzes.$length(); quizIndex++) {
	    JQueryCore block = GlobalJQuery.$("<div></div>");

	    QuizSummary quizSummary = quizzes.$get(quizIndex);
	    Quiz quiz = quizSummary.getDetails();
	    JQueryCore h5 = null;
	    if (quiz != null) {
		h5 = GlobalJQuery.$("#" + quiz.id);
		if (h5.length() == 0) {
		    isFirstPass = true;
		}
	    }
	    h5 = GlobalJQuery.$("<h5></h5>");
	    h5.attr("class", "expandable");
	    Map<String, Question> questions = quizSummary.getQuestions();
	    Map<String, Array> questionTexts = JSCollections.$map();
	    if (quiz == null) {
		block.attr("id", "blockPendingQuiz");
	    } else {
		block.attr("id", "block" + quiz.id);
	    }
	    
	    JQueryCore questionContainer = null;
	    if ((quiz != null) && (GlobalJQuery.$("#" + quiz.id).length() == 0)) {
		h5.text(quiz.quizName);
		h5.attr("id", quiz.id);
		

		JQueryCore score = GlobalJQuery.$("<span class=\"badge orange-text text-darken-4\"></span>");
		score.text(quiz.raw+"");
		h5.append(score);

		block.append(h5);
	    } else if ((quiz == null) && (GlobalJQuery.$("#pendingQuiz").length() == 0)) {
		h5.text("Pending");
		h5.attr("id", "pendingQuiz");

		JQueryCore score = GlobalJQuery.$("<span class=\"badge orange-text text-darken-4\">??</span>");
		h5.append(score);

		block.append(h5);

		

	    }

	    String questionContainerId = "quizQuestions";
	    if (quiz == null) {
		questionContainerId = questionContainerId + "PendingQuiz";
		pending = true;
	    } else {
		questionContainerId = questionContainerId + quiz.id;
	    }

	    questionContainer = GlobalJQuery.$("#" + questionContainerId);
	    
	    if (questionContainer.length() == 0) {
		questionContainer = GlobalJQuery.$("<ol></ol>");
		questionContainer.attr("id", questionContainerId);
		questionContainer.attr("style", "display:none;");
		block.append(questionContainer);
	    }
	    String previousQuestionId = null;
	    for (String key : questions) {
		Question question = questions.$get(key);
		JQueryCore questionLine = GlobalJQuery.$("#" + question.id);
		JQueryCore answerList = GlobalJQuery.$("<ol></ol>");
		if (questionLine.length() == 0) {
		    if (questionTexts.$get(question.prompt) != null) {
			Array answers = questionTexts.$get(question.prompt);
			int counter = 0;
			for (Object answer : answers) {
			    String answerText = answers.$get(counter).toString();
			    JQueryCore answerElement = GlobalJQuery.$("#" + previousQuestionId + "answer" + counter + "quiz" + quizIndex);
			    if (question.response == answerText) {
				if (question.success) {
				    answerElement.addClass("correctAnswer");
				} else {
				    answerElement.addClass("wrongAnswer");
				}
			    }
			    counter++;
			}
		    } else {
			questionTexts.$put(question.prompt, question.answers);

			questionLine = GlobalJQuery.$("<li></li>");
			questionLine.attr("id", question.id + quizIndex);
			questionLine.text(question.prompt);
				    
			answerList.attr("id", question.id + "answerList" + quizIndex);

			Array answers = questionTexts.$get(question.prompt);
			int counter = 0;
			for (Object answer : answers) {
			    JQueryCore answerElement = GlobalJQuery.$("<li></li>");
			    String answerText = answers.$get(counter).toString();
			    answerElement.text(answerText);
			    answerElement.attr("id", question.id + "answer" + counter + "quiz" + quizIndex);
			    if (question.response == answerText) {
				if (question.success) {
				    answerElement.attr("class", "correctAnswer");
				} else {
				    answerElement.attr("class", "wrongAnswer");
				}
			    }
			    answerList.append(answerElement);
			    counter++;
			}
				    
			questionLine.append(answerList);

			previousQuestionId = question.id;
				    
			questionContainer.append(questionLine);
		    }
		}
			
	    }

	    if (GlobalJQuery.$("#" + block.attr("id")).length() == 0) {
		block.append(GlobalJQuery.$("<div class=\"divider\"></div>"));
		GlobalJQuery.$("#userAssessments").append(block);
	    }

	    if (quiz != null && isFirstPass) {
	    	GlobalJQuery.$("#" + quiz.id).click(UIUtils.createCollapseClickHandler(questionContainerId));
	    } else if (quiz == null) {
	    	JQueryCore pendingHeader = GlobalJQuery.$("#pendingQuiz");
	    	JQueryCore pendingQuiz = GlobalJQuery.$("#quizQuestionsPendingQuiz");
	    	if (pendingHeader.length() > 0 && pendingQuiz.length() > 0) {
		    pendingHeader.click(UIUtils.createCollapseClickHandler("quizQuestionsPendingQuiz"));
	    	}
	    }
	}

	if (!pending)
	    GlobalJQuery.$("#blockPendingQuiz").remove();
	else
	    GlobalJQuery.$("#userAssessments").append(GlobalJQuery.$("#blockPendingQuiz"));
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
    
    public void showActivitySummary(Map<String, ActivitySummary> summaries) {
	// <h5>Sections Completed <span class="badge orange-text text-darken-4">82%</span></h5>
	// <strong>Missed 4 Sections</strong>
	// <ol>
	//     <li>Header or learning objective</li>
	//     <li>Another Header or learning objective</li>
	//     <li>Some title here</li>
	//     <li>Yet another one here</li>
	// </ol>
	boolean hasRecords = false;
	for (String key : summaries) {
	    hasRecords = true;
	    break;
	}
	
	if (hasRecords && !foundSections) {
	    foundSections = true;
	    GlobalJQuery.$("#bookSections").html("<div class=\"divider\"></div>");
	}
	
	for (String key : summaries) {
	    ActivitySummary activitySummary = summaries.$get(key);
	    
	    JQueryCore block = GlobalJQuery.$("<div></div>");
	    JQueryCore h5 = GlobalJQuery.$("#" + activitySummary.id);
	    if (h5.length() == 0)
		h5 = GlobalJQuery.$("<h5></h5>");
	    
	    block.attr("id", "block" + activitySummary.id);

	    String sectionContainerId = "bookSections" + activitySummary.id;
	    
	    JQueryCore sectionContainer = null;
	    if (GlobalJQuery.$("#" + activitySummary.id).length() == 0) {
		h5.text(activitySummary.activity);

		h5.addClass("expandable");
		
		h5.attr("id", activitySummary.id);	

		h5.click(UIUtils.createCollapseClickHandler(sectionContainerId));
		
		block.append(h5);
	    }

	    String activityString = "";
	    if (activitySummary.activityName != null)
		activityString = activitySummary.activityName;
	    if (activitySummary.activityDescription != null)
		activityString = activityString + " - " + activitySummary.activityDescription;
	    if (activityString != "")
		h5.text(activityString);
	    
	    sectionContainer = GlobalJQuery.$("#" + sectionContainerId);
	    
	    if (sectionContainer.length() == 0) {
		sectionContainer = GlobalJQuery.$("<ol></ol>");
		sectionContainer.attr("id", sectionContainerId);
		sectionContainer.attr("style", "display:none");
		block.append(sectionContainer);
	    }

	    if (GlobalJQuery.$("#" + block.attr("id")).length() == 0) {
		block.append(GlobalJQuery.$("<div class=\"divider\"></div>"));
		GlobalJQuery.$("#bookSections").append(block);
	    }
	    	    
	    Map<String, Navigation> navigations = activitySummary.getNavigations();
	    Map<String, Action> actions = activitySummary.getActions();
	    Map<String, Annotation> annotations = activitySummary.getAnnotations();
	    Map<String, Session> sessions = activitySummary.getSessions();
	    Map<String, SharedAnnotation> sharedAnnotations = activitySummary.getSharedAnnotations();

	    Array<TimeSeriesData> timeSeries = JSCollections.$array();
	    for (String navKey : navigations) {
	        timeSeries.push(navigations.$get(navKey));
	    }
	    for (String actionKey : actions) {
		timeSeries.push(actions.$get(actionKey));
	    }
	    for (String annotationKey : annotations) {
		timeSeries.push(annotations.$get(annotationKey));
	    }
	    for (String sharedAnnotationKey : sharedAnnotations) {
		timeSeries.push(sharedAnnotations.$get(sharedAnnotationKey));
	    }
	    for (String sessionKey : sessions) {
		timeSeries.push(sessions.$get(sessionKey));
	    }

	    TimeSeriesData.sort(timeSeries, false);

	    for (int timeIndex = 0; timeIndex < timeSeries.$length(); timeIndex++) {
		TimeSeriesData obj = timeSeries.$get(timeIndex);
		if (obj instanceof Action) {
		    Action a = (Action)obj;
		    
		    JQueryCore actionItem = GlobalJQuery.$("#" + a.id);
		    if (actionItem.length() == 0) {
		    	actionItem = GlobalJQuery.$("<li></li>");
		    	actionItem.attr("id", a.id);
		    	actionItem.text(a.type + " ");
			JQueryCore spanTimestamp = GlobalJQuery.$("<span class='timestamp'></span>");
			spanTimestamp.text(a.timestamp.toString());
		        actionItem.append(spanTimestamp);
		    }
		    sectionContainer.append(actionItem);
		} else if (obj instanceof Navigation) {
		    Navigation n = (Navigation)obj;

		    JQueryCore navigationItem = GlobalJQuery.$("#" + n.id);
		    if (navigationItem.length() == 0) {
		    	navigationItem = GlobalJQuery.$("<li></li>");
		    	navigationItem.attr("id", n.id);
		    	navigationItem.text(n.type + " ");
			JQueryCore spanTimestamp = GlobalJQuery.$("<span class='timestamp'></span>");
			spanTimestamp.text(n.timestamp.toString());
		        navigationItem.append(spanTimestamp);
		    }
		    sectionContainer.append(navigationItem);
		} else if (obj instanceof Annotation) {
		    Annotation a = (Annotation)obj;

		    String display = "";
		    if (a.type == Annotation.TYPE_BOOKMARK) {
			display = "Bookmark - ";
		    } else if (a.type == Annotation.TYPE_HIGHLIGHT) {
			display = "Highlight - ";
		    } else if (a.type == Annotation.TYPE_NOTE) {
			display = "Note - ";
		    }
		    
		    JQueryCore annotationItem = GlobalJQuery.$("#" + a.id);
		    if (annotationItem.length() == 0) {
			annotationItem = GlobalJQuery.$("<li></li>");
			annotationItem.attr("id", a.id);
			annotationItem.text(display + a.text + " ");
			JQueryCore spanTimestamp = GlobalJQuery.$("<span class='timestamp'></span>");
			spanTimestamp.text(a.timestamp.toString());
			annotationItem.append(spanTimestamp);
		    }
		    sectionContainer.append(annotationItem);
		} else if (obj instanceof SharedAnnotation) {
		    SharedAnnotation a = (SharedAnnotation)obj;
		    
		    String display = "";
		    if (a.type == Annotation.TYPE_BOOKMARK) {
			display = "Bookmark - ";
		    } else if (a.type == Annotation.TYPE_HIGHLIGHT) {
			display = "Highlight - ";
		    } else if (a.type == Annotation.TYPE_NOTE) {
			display = "Note - ";
		    }

		    JQueryCore annotationItem = GlobalJQuery.$("#" + a.id);
		    if (annotationItem.length() == 0) {
			annotationItem = GlobalJQuery.$("<li></li>");
			annotationItem.attr("id", a.id);
			annotationItem.text("Shared " + display + a.text + " ");
			JQueryCore spanTimestamp = GlobalJQuery.$("<span class='timestamp'></span>");
			spanTimestamp.text(a.timestamp.toString());
			annotationItem.append(spanTimestamp);
		    }
		    sectionContainer.append(annotationItem);
		} else if (obj instanceof Session) {
		    Session s = (Session)obj;

		    JQueryCore sessionItem = GlobalJQuery.$("#" + s.id);
		    if (sessionItem.length() == 0) {
			sessionItem = GlobalJQuery.$("<li></li>");
			sessionItem.attr("id", s.id);
			sessionItem.text(s.type + " ");
			JQueryCore spanTimestamp = GlobalJQuery.$("<span class='timestamp'></span>");
			spanTimestamp.text(s.timestamp.toString());
			sessionItem.append(spanTimestamp);
		    }

		    sectionContainer.append(sessionItem);
		}
	    }
	}
	Graphs.showStudentGraphs();
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
	clearMessages();
	foundQuizzes = false;
	foundSections = false;
	Graphs.clearStudentGraphs();
    }
}
