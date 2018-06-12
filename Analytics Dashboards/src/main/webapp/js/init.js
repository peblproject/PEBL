(function($){
    $(function(){
	$('.button-collapse').sideNav();
    }); // end of document ready
})(jQuery); // end of jQuery name space



$("#slide-out li .waves-effect").on('click', function () {
    //get attribute over dataset due to iOS bugging out on dataset
    Dashboard.openBook(this.getAttribute("data-book").substring("pebl://".length));
    $("#BookName").text(this.innerText);
    $("#index-banner").slideDown();
    $("#mainContent").slideDown();
});

$("#slide-out-discussion li .waves-effect").on('click', function () {
    //get attribute over dataset due to iOS bugging out on dataset
    Dashboard.subscribeThread(this.getAttribute("data-discussion"));
    $("#userDiscussionPrompt").text(this.text);
    $("#userDiscussionThreadReply").val(this.getAttribute("data-discussion"));
    $("#userDiscussionPromptReply").text(this.text);
    $("#userDiscussionModalTrigger").show();
});

$("#discussionSubmit .modal-footer .waves-orange").on('click', function () {
    var message = $("#userDiscussionSubmission").val();
    $("#userDiscussionSubmission").val("");
    var thread = $("#userDiscussionThreadReply").val();
    var prompt = $("#userDiscussionPromptReply").text();
    Dashboard.postMessage(thread, prompt, message);
});

$("#discussionSubmit .modal-footer .waves-red").on('click', function () {
    
});

// $("#pushTargetSubmitButton").on('click', function() {
//     var url = document.getElementById('pushURL').value;
//     var target = document.getElementById('pushTarget').value;
//     var location = document.getElementById('pushLocation').value;
//     if (url !== '' && target !== '') {
//         Dashboard.pushContent(target, location, url);
//         document.getElementById('pushURL').value = '';
//         Materialize.toast('Document push successful', 4000);
//     } else {
//         window.alert('Please include both a Target and URL');
//     }
// });

var globalTsr;
var downloadQuizzes;
var downloadSharedAnnotations;
var downloadSessions;
var downloadNavigations;
var downloadActions;
var downloadQuestions;
var downloadAnnotations;
var downloadDiscussionSummaries;
var localChartMapping = {};
var activityRosterStudentOverride;
var studentActivityTimeDataArray = [];
window.Graphs = {};
window.Graphs.clearTeacherGraphs = function () {
    Object.keys(localChartMapping).forEach(function (id) {
	localChartMapping[id].destroy();
	//$("#" + id).remove();
    });
    localChartMapping = {};
    document.getElementById('teacherQuizSummary').innerHTML = "";
    document.getElementById('activityTimesLineChart').setAttribute('style', 'display:none');
    document.getElementById('progressDonutCharts').setAttribute('style', 'display:none');
    document.getElementById('quizDistributionChart').setAttribute('style', 'display:none');
};

window.Graphs.clearStudentGraphs = function () {
    Object.keys(localChartMapping).forEach(function (id) {
	localChartMapping[id].destroy();
	//$("#" + id).remove();
    });
    document.getElementById("myChart").setAttribute("style", "display:none; width:400px; height:400px;");
    localChartMapping = {};
};

window.Graphs.showTeacherGraphs = function(tsr) {
    $('select').material_select();
    var studentActivityLoader = document.getElementById('studentActivityLoader');
    var classProgressLoader = document.getElementById('classProgressLoader');
    var quizStatisticsLoader = document.getElementById('quizStatisticsLoader');
    var questionAnalysisLoader = document.getElementById('questionAnalysisLoader');

    studentActivityLoader.setAttribute('style', '');
    classProgressLoader.setAttribute('style', '');
    quizStatisticsLoader.setAttribute('style', '');
    questionAnalysisLoader.setAttribute('style', '');

    setTimeout(function() {
        studentActivityLoader.setAttribute('style', 'display: none');
        classProgressLoader.setAttribute('style', 'display: none');
        quizStatisticsLoader.setAttribute('style', 'display: none');
        questionAnalysisLoader.setAttribute('style', 'display: none');
    }, 5000);

    globalTsr = tsr;
    var currentBook = window.Dashboard.pebl.activityManager.currentBook;
    var students = tsr.students;
    var numQuizzes = 0;
    var totalScore = 0;
    var scoresArray = [];
    var studentsArray = [];
    var totalScoreObject = {
        '0-10'  : 0,
        '11-20' : 0,
        '21-30' : 0,
        '31-40' : 0,
        '41-50' : 0,
        '51-60' : 0,
        '61-70' : 0,
        '71-80' : 0,
        '81-90' : 0,
        '91-100': 0
    };
    var totalScoreStudentsObject = {
        '0' : {},
        '1' : {},
        '2' : {},
        '3' : {},
        '4' : {},
        '5' : {},
        '6' : {},
        '7' : {},
        '8' : {},
        '9' : {}
    }
    var questionsDict = {};
    var maxScore;
    var minScore;
    var sessionsDict = {};
    var studentSessionsDict = {};
    var totalStudents = 0;
    var lessonProgressDict = {};
    downloadQuizzes = [];
    downloadSharedAnnotations = [];
    downloadSessions = [];
    downloadNavigations = [];
    downloadActions = [];
    downloadQuestions = [];
    downloadAnnotations = [];
    downloadDiscussionSummaries = [];

    //Should revisit this loop for performance optimizations, could get pretty slow.

    //Looping through each student
    Object.keys(students).forEach(function(key, index) {
        studentsArray.push(key);
        var quizSummaries = students[key].quizSummaries
        if (quizSummaries.length > 0) {
            //Looping through each quiz summary
            Object.keys(quizSummaries).forEach(function(key2, index2) {
                if (quizSummaries[key2].hasOwnProperty('details') && quizSummaries[key2].details.completion === true) {
                    downloadQuizzes.push(JSON.stringify(quizSummaries[key2].details));
                    var questions = quizSummaries[key2].questions;
                    var score = quizSummaries[key2].details.raw;
                    var actor = quizSummaries[key2].details.actorId;
                    numQuizzes++;
                    totalScore += score;
                    scoresArray.push(score);
                    if (score <= 10) {
                        totalScoreObject['0-10']++;
                        if (totalScoreStudentsObject['0'][actor] === undefined) {
                            totalScoreStudentsObject['0'][actor] = {};    
                        }
                        totalScoreStudentsObject['0'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 20) {
                        totalScoreObject['11-20']++;
                        if (totalScoreStudentsObject['1'][actor] === undefined) {
                            totalScoreStudentsObject['1'][actor] = {};    
                        }
                        totalScoreStudentsObject['1'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 30) {
                        totalScoreObject['21-30']++;
                        if (totalScoreStudentsObject['2'][actor] === undefined) {
                            totalScoreStudentsObject['2'][actor] = {};    
                        }
                        totalScoreStudentsObject['2'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 40) {
                        totalScoreObject['31-40']++;
                        if (totalScoreStudentsObject['3'][actor] === undefined) {
                            totalScoreStudentsObject['3'][actor] = {};    
                        }
                        totalScoreStudentsObject['3'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 50) {
                        totalScoreObject['41-50']++;
                        if (totalScoreStudentsObject['4'][actor] === undefined) {
                            totalScoreStudentsObject['4'][actor] = {};    
                        }
                        totalScoreStudentsObject['4'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 60) {
                        totalScoreObject['51-60']++;
                        if (totalScoreStudentsObject['5'][actor] === undefined) {
                            totalScoreStudentsObject['5'][actor] = {};    
                        }
                        totalScoreStudentsObject['5'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 70) {
                        totalScoreObject['61-70']++;
                        if (totalScoreStudentsObject['6'][actor] === undefined) {
                            totalScoreStudentsObject['6'][actor] = {};    
                        }
                        totalScoreStudentsObject['6'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 80) {
                        totalScoreObject['71-80']++;
                        if (totalScoreStudentsObject['7'][actor] === undefined) {
                            totalScoreStudentsObject['7'][actor] = {};    
                        }
                        totalScoreStudentsObject['7'][actor][key2] = quizSummaries[key2];
                    } else if (score <= 90) {
                        totalScoreObject['81-90']++;
                        if (totalScoreStudentsObject['8'][actor] === undefined) {
                            totalScoreStudentsObject['8'][actor] = {};    
                        }
                        totalScoreStudentsObject['8'][actor][key2] = quizSummaries[key2];
                    } else {
                        totalScoreObject['91-100']++;
                        if (totalScoreStudentsObject['9'][actor] === undefined) {
                            totalScoreStudentsObject['9'][actor] = {};    
                        }
                        totalScoreStudentsObject['9'][actor][key2] = quizSummaries[key2];
                    }

                    if (maxScore === undefined || score > maxScore) {
                        maxScore = score;
                    }
                    if (minScore === undefined || score < minScore) {
                        minScore = score;
                    }
                    //Looping through each quiz question
                    Object.keys(questions).forEach(function(key3, index3) {
                        downloadQuestions.push(JSON.stringify(questions[key3]));
                        var prompt = questions[key3].prompt;
                        var response = questions[key3].response;
                        if (questions[key3].success === true) {
                            response += '*';
                        }
                        if (questionsDict[prompt] === undefined) {
                            questionsDict[prompt] = {};
                            questionsDict[prompt][response] = 1;
                        } else {
                            if (questionsDict[prompt][response] === undefined) {
                                questionsDict[prompt][response] = 1;
                            } else {
                                questionsDict[prompt][response]++;
                            }
                        }
                    });
                }
            });
        }

        var sessions = students[key].sessions;
        if (sessions.length > 0) {
            //Looping through each session
            Object.keys(sessions).forEach(function(key4, index4) {
                downloadSessions.push(JSON.stringify(sessions[key4]));
                var hour;
                if (sessions[key4].type === 'initialized') {
                    hour = sessions[key4].timestamp.getHours();
                    if (sessionsDict[hour] === undefined) {
                        sessionsDict[hour] = 1;
                    } else {
                        sessionsDict[hour]++;
                    }
                }
            });
        }

        var activitySummaries = students[key].activitySummaries;
        Object.keys(activitySummaries).forEach(function(key5, index5) {
            var navigations = activitySummaries[key5].navigations;
            var currentActivity = activitySummaries[key5].activityName;
            console.log('key5' + key5);
            Object.keys(navigations).forEach(function(key6, index6) {
                downloadNavigations.push(JSON.stringify(navigations[key6]));
                if (navigations[key6].type === 'completed') {
                    var user = navigations[key6].actorId;
                    if (lessonProgressDict[currentActivity] === undefined) {
                        console.log('currentActivity: ' + currentActivity);
                        lessonProgressDict[currentActivity] = {};
                        lessonProgressDict[currentActivity][user] = 'completed';
                    } else {
                        lessonProgressDict[currentActivity][user] = 'completed';
                    }
                }
            });
        });

        var sharedAnnotations = students[key].sharedAnnotations;
        Object.keys(sharedAnnotations).forEach(function(key7, index7) {
            downloadSharedAnnotations.push(JSON.stringify(sharedAnnotations[key7]));
        });

        var studentActions = students[key].actions;
        Object.keys(studentActions).forEach(function(key8, index8) {
            downloadActions.push(JSON.stringify(studentActions[key8]));
        });

        var studentAnnotations = students[key].annotations;
        Object.keys(studentAnnotations).forEach(function(key9, index9) {
            downloadAnnotations.push(JSON.stringify(studentAnnotations[key9]));
        });


        totalStudents++;
    });

    //Create the donut charts for student progress
    document.getElementById('progressDonutCharts').setAttribute('style', '');
    var row1 = document.getElementById('row1');
    var row2 = document.getElementById('row2');
    var donutDiv = document.getElementById('progressDonutCharts');
    var donutContainer;
    if (row1 === null && row2 === null) {
        row1 = document.createElement('div');
        row1.classList.add('row');
        row1.id = 'row1';

        row2 = document.createElement('div');
        row2.classList.add('row');
        row2.id = 'row2';

        for (let i = 1; i < 9; i++) {
            donutContainer = document.createElement('div');
            donutContainer.id = 'donutContainer' + i;
            donutContainer.classList.add('col', 's3', 'card', 'card-no-shadow');
            if (i < 5) {
                row1.appendChild(donutContainer);
            } else {
                row2.appendChild(donutContainer);
            }
        }
        donutDiv.appendChild(row1);
        donutDiv.appendChild(row2);
    }
    
    Object.keys(lessonProgressDict).forEach(function(key, index) {
        var currentLesson = lessonProgressDict[key];
        var numberCompleted = Object.keys(currentLesson).length;
        var lessonNumber;
        
        switch (key) {
        case 'Lesson 1':
            lessonNumber = 1;
            break;
        case 'Lesson 2':
            lessonNumber = 2;
            break;
        case 'Lesson 3':
            lessonNumber = 3;
            break;
        case 'Lesson 4':
            lessonNumber = 4;
            break;
        case 'Lesson 5':
            lessonNumber = 5;
            break;
        case 'Lesson 6':
            lessonNumber = 6;
            break;
        case 'Lesson 7':
            lessonNumber = 7;
            break;
        case 'Lesson 8':
            lessonNumber = 8;
            break;
        default:
            break;
        }

        var donutCanvas = document.getElementById('donutCanvas' + lessonNumber);
        donutContainer = document.getElementById('donutContainer' + lessonNumber);
        var lessonProgressList = document.createElement('ul');
        lessonProgressList.id = 'lessonProgressList' + lessonNumber;
        lessonProgressList.classList.add('collection');
        var completedUsers = [];
        var incompleteUsers = [];

        Object.keys(currentLesson).forEach(function(key, index) {
            completedUsers.push(key);
        });

        for (let i in studentsArray) {
            if (completedUsers.indexOf(studentsArray[i]) === -1) {
                incompleteUsers.push(studentsArray[i]);
            }
        }


        for (let i in completedUsers) {
            var userIcon = document.createElement('i');
            userIcon.classList.add('small', 'material-icons');
            userIcon.textContent = 'perm_identity';
            var listElement = document.createElement('li');
            listElement.classList.add('collection-item');
            listElement.appendChild(userIcon);
            var span = document.createElement('span');
            span.textContent = completedUsers[i];
            listElement.appendChild(span);
            var badgeElement = document.createElement('span');
            badgeElement.classList.add('badge', 'orange-text', 'text-darken-4', 'badge-no-margin', 'badge-large');
            badgeElement.textContent = 'Complete';
            listElement.appendChild(badgeElement);
            lessonProgressList.appendChild(listElement);
        }

        for (let i in incompleteUsers) {
            var userIcon = document.createElement('i');
            userIcon.classList.add('small', 'material-icons');
            userIcon.textContent = 'perm_identity';
            var listElement = document.createElement('li');
            listElement.classList.add('collection-item');
            listElement.appendChild(userIcon);
            var span = document.createElement('span');
            span.textContent = incompleteUsers[i];
            listElement.appendChild(span);
            var badgeElement = document.createElement('span');
            badgeElement.classList.add('badge', 'orange-text', 'text-darken-4', 'badge-no-margin', 'badge-large');
            badgeElement.textContent = 'Incomplete';
            listElement.appendChild(badgeElement);
            lessonProgressList.appendChild(listElement);
        }

        if (donutCanvas === null) {
            donutCanvas = document.createElement('canvas');
            donutCanvas.id = 'donutCanvas' + lessonNumber;
            donutCanvas.classList.add('hoverable');
            var clickTarget = "$('#modal" + lessonNumber + "').modal('open');"
            donutCanvas.setAttribute('width', '100px');
            donutCanvas.setAttribute('height', '100px');
            donutCanvas.setAttribute('onclick', clickTarget);
            var lessonProgressListModal = document.createElement('div');
            lessonProgressListModal.id = 'modal' + lessonNumber;
            lessonProgressListModal.classList.add('modal', 'bottom-sheet');
            var modalContent = document.createElement('div');
            modalContent.id = 'modalContent' + lessonNumber;
            modalContent.classList.add('modal-content');
            var modalHeader = document.createElement('h4');
            modalHeader.textContent = 'Student Progress for Lesson ' + lessonNumber;
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(lessonProgressList);
            lessonProgressListModal.appendChild(modalContent);
            if (donutContainer) {
                donutContainer.appendChild(donutCanvas);
                donutContainer.appendChild(lessonProgressListModal);
            }

            $('.modal').modal();
        } else {
            var modalContent = document.getElementById('modalContent' + lessonNumber);
            var child = document.getElementById('lessonProgressList' + lessonNumber);
            modalContent.removeChild(child);
            modalContent.appendChild(lessonProgressList);
        }

        
	if (donutContainer && !document.getElementById(donutContainer.id)) {
            donutDiv.appendChild(donutContainer);
	}
        donutCanvas = document.getElementById('donutCanvas' + lessonNumber);
        var percentComplete = Math.round((numberCompleted / totalStudents) * 100);
        var donutChart = localChartMapping['donutContainer' + lessonNumber];
	if (donutChart == null) {
        if (percentComplete && donutCanvas) {
    	    donutChart = new Chart(donutCanvas, {
        	type: 'doughnut',
        	data: {
                    labels: ['Complete', 'Incomplete'],
                    datasets: [{
            		data: [percentComplete, 100 - percentComplete],
            		backgroundColor: [
                            '#ffb74d',
                            '#e0e0e0'
            		]
                    }]
        	},
        	options: {
                    tooltips: {
                        enabled: false
                    },
                    legend: {
                        display: false
                    },
                    title: {
            		display: true,
            		text: key
                    },
                    elements: {
                        center: {
                            text: percentComplete + '%',
                            color: '#ffb74d',
                            fontStyle: 'Roboto'
                        }
                    }
        	}
            });
    	    localChartMapping['donutContainer' + lessonNumber] = donutChart
        }
	} else {
	    donutChart.data.datasets[0].data[0] = percentComplete;
	    donutChart.data.datasets[0].data[1] = 100 - percentComplete;
        donutChart.options.elements.center.text = percentComplete + '%';
	    donutChart.update(100, true);
	}
    if (donutDiv.parentNode.classList.contains('active')) {
        donutDiv.setAttribute('style', 'display:block !important');
    } else {
        donutDiv.setAttribute('style', 'display:none');
    }
    });


    //Creates the student activity line graph
    var activityRosterStudent;
    var activityRosterDropdown = document.getElementById('slide-out-roster');
    // var pushTargetDropdown = document.getElementById('pushTarget');
    for (let i in studentsArray) {
        if (document.getElementById('activityRosterItem' + studentsArray[i]) === null) {
            var rosterItem = document.createElement('li');
            // var pushTargetItem = document.createElement('option');
            
            rosterItem.id = 'activityRosterItem' + studentsArray[i];
            
            var userIcon = document.createElement('i');
            userIcon.classList.add('small', 'material-icons');
            userIcon.textContent = 'perm_identity';
            
            var rosterItemContent = document.createElement('a');
            rosterItemContent.href = '#!';
            rosterItemContent.textContent = studentsArray[i];
            rosterItemContent.appendChild(userIcon);
            
            var rosterItemFunction = 'setActivityRosterStudent("' + studentsArray[i] + '");';
            rosterItemContent.setAttribute('onclick', rosterItemFunction);

            // pushTargetItem.value = studentsArray[i];
            // pushTargetItem.textContent = studentsArray[i];
           
            rosterItem.appendChild(rosterItemContent);
            activityRosterDropdown.appendChild(rosterItem);
            // pushTargetDropdown.appendChild(pushTargetItem);

        }
    }

    if (activityRosterStudentOverride === undefined) {
        activityRosterStudent = studentsArray[0];
    } else {
        activityRosterStudent = activityRosterStudentOverride;
    }

    if (activityRosterStudent !== undefined) {
        var studentSessions = students[activityRosterStudent].sessions;
        Object.keys(studentSessions).forEach(function(key, index) {
            var hour;
            if (studentSessions[key].type === 'initialized') {
                hour = studentSessions[key].timestamp.getHours();
                if (studentSessionsDict[hour] === undefined) {
                    studentSessionsDict[hour] = 1;
                } else {
                    studentSessionsDict[hour]++;
                }
            }
        });
    }

    document.getElementById('activityTimesLineChart').setAttribute('style', '');
    var timeLabelArray = ['0', '1', '2', '3', '4', '5', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    var activityTimeDataArray = [];
    studentActivityTimeDataArray = [];
    for (let i in timeLabelArray) {
        if (sessionsDict[timeLabelArray[i]] === undefined) {
            activityTimeDataArray.push(0);
        } else {
            activityTimeDataArray.push(parseInt(sessionsDict[timeLabelArray[i]]));
        }
        if (studentSessionsDict[timeLabelArray[i]] === undefined) {
            studentActivityTimeDataArray.push(0);
        } else {
            studentActivityTimeDataArray.push(parseInt(studentSessionsDict[timeLabelArray[i]]));
        }
    }

    var classSum = activityTimeDataArray.reduce((a, b) => a + b, 0);
    var studentSum = studentActivityTimeDataArray.reduce((a, b) => a + b, 0);

    for (let i in activityTimeDataArray) {
        if (activityTimeDataArray[i] !== 0) {
            activityTimeDataArray[i] = (activityTimeDataArray[i] / classSum) * 100;
        }
    }

    for (let i in studentActivityTimeDataArray) {
        if (studentActivityTimeDataArray[i] !== 0) {
            studentActivityTimeDataArray[i] = (studentActivityTimeDataArray[i] / studentSum) * 100;
        }
    }

    var activityTimeCtx = document.getElementById('activityTimesLineChart');
    var activityTimeLineChart = localChartMapping['activityTimesLineChart'];
    if (activityTimeLineChart == null) {
    	activityTimeLineChart = new Chart(activityTimeCtx, {
            type: 'line',
            data: {
                labels: timeLabelArray,
                datasets: [
                    {
			label: 'Percentage of Class Activity by Time of Day',
			data: activityTimeDataArray,
			borderColor: '#ffb74d'
                    },
                    {
			label: 'Percentage of ' + activityRosterStudent + ' Activity by Time of Day',
			data: studentActivityTimeDataArray,
			borderColor: '#29b6f6'
                    }
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            let x = Math.round(parseInt(tooltipItems.yLabel));
                            if (tooltipItems.datasetIndex === 0) {
                                return x + '% of class activity occured at ' + tooltipItems.xLabel;
                            } else {
                                return x + '% of ' + activityRosterStudent + ' activity occurred at ' + tooltipItems.xLabel;
                            }
                            
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Percentage'
                        },
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            callback: function(value) {
                                let parsedValue = parseInt(value);
                                if (parsedValue === 0) {
                                    return '12AM';
                                } else if (parsedValue < 12) {
                                    return value + 'AM';
                                } else if (parsedValue === 12) {
                                    return value + 'PM';
                                } else {
                                    return (parsedValue - 12) + 'PM';
                                }
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Time of Day (Hours)'
                        }
                    }]
                }
            }
    	});
    	localChartMapping['activityTimesLineChart'] = activityTimeLineChart;
    } else {
        for (let index = 0; index < activityTimeDataArray.length; index++) {
	    activityTimeLineChart.data.datasets[0].data[index] = activityTimeDataArray[index];
        }
        activityTimeLineChart.data.datasets[1].label = 'Percentage of ' + activityRosterStudent + ' Activity by Time of Day';
        for (let index = 0; index < studentActivityTimeDataArray.length; index++) {
            activityTimeLineChart.data.datasets[1].data[index] = studentActivityTimeDataArray[index];
        }
        
        activityTimeLineChart.update(100, true);
    }
    $('#activityTimesLineChart').css('width', $('#activityTimesWrapper').width());

    //Creates the graphs for each quiz question
    var quizSummaryParentDiv = document.getElementById('teacherQuizSummary');

    Object.keys(questionsDict).forEach(function(key, index) {
        var questionContainerDiv = document.createElement('div');
        questionContainerDiv.classList.add('questionContainer');
        var quizPromptElement = document.createElement('p');
        quizPromptElement.classList.add('quizPrompt');
        quizPromptElement.textContent = key;
        questionContainerDiv.appendChild(quizPromptElement);
        var graphCanvas = document.createElement('canvas');
        graphCanvas.id = 'canvas' + key;
        graphCanvas.setAttribute('width', '400px');
        graphCanvas.setAttribute('height', '100px');
        questionContainerDiv.appendChild(graphCanvas);
        questionContainerDiv.id = 'questionContainer' + key;

        var responseArray = [];
        var valuesArray = [];

        Object.keys(questionsDict[key]).forEach(function(key2, index2) {
            responseArray.push(key2);
            valuesArray.push(questionsDict[key][key2]);
        });
        var colorArray = [];
        for (let i in responseArray) {
            let str = responseArray[i];
            if (str[str.length - 1] === '*') {
                colorArray.push('#29b6f6');
            } else {
                colorArray.push('#9e9e9e');
            }
        }

	if (!document.getElementById(questionContainerDiv.id)) { 
            quizSummaryParentDiv.appendChild(questionContainerDiv);

            var quizCtx = document.getElementById('canvas' + key);
            var quizGraph = new Chart(quizCtx, {
        	type: 'horizontalBar',
        	data: {
                    labels: responseArray,
                    datasets: [{
            		label: 'Student Responses',
            		data: valuesArray,
            		backgroundColor: colorArray
                    }]
        	},
        	options: {
                    scales: {
                        xAxes: [{
                            ticks: {
        			beginAtZero: true,
        			stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of Responses'
                            }
                        }],
                        yAxes: [{
                            ticks: {
        			callback: function(value) {
                                    if (value.length > 20) {
                    			let str = value.substr(0, 20) + '...';
                    			return str;
                                    }
                                    return value;
        			}
                            }
                        }]
                    },
                    tooltips: {
            		enabled: true,
            		mode: 'label',
            		callbacks: {
                            title: function(tooltipItems, data) {
                		let idx = tooltipItems[0].index;
                                let str = data.labels[idx];
                		return str.match(/.{1,30}/g);
                            }
            		}
                    },
                    legend: {
                        display: false
                    }
        	}
            });
	    localChartMapping[questionContainerDiv.id] = quizGraph;
	} else {
	    var quizGraph = localChartMapping[questionContainerDiv.id];
	    for (var index = 0; index < valuesArray.length; index++)
	    	quizGraph.data.labels[index] = responseArray[index];
	    for (var index = 0; index < valuesArray.length; index++)
		quizGraph.data.datasets[0].data[index] = valuesArray[index];
            quizGraph.data.datasets[0].backgroundColor = colorArray;
	    quizGraph.update(100, true);
	}

    });

    //Quiz Score Distributions Chart
    var avgScore = totalScore / numQuizzes;
    var diffs = scoresArray.map(function(value) {
        var diff = value - avgScore;
        return diff;
    });
    var squareDiffs = scoresArray.map(function(value) {
        var diff = value - avgScore;
        var sqr = diff * diff;
        return sqr;
    });

    var sum = scoresArray.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    var avgSquareDiff = sum / scoresArray.length;

    var stdDev = Math.sqrt(avgSquareDiff);

    document.getElementById('averageScore').textContent = Math.round(avgScore);
    document.getElementById('standardDeviation').textContent = Math.round((stdDev + 0.00001) * 100) / 100;
    var quizGraphNumScores = [];

    Object.keys(totalScoreObject).forEach(function(key, index) {
        quizGraphNumScores.push(totalScoreObject[key]);
    });

    var barCtx = document.getElementById('quizDistributionChart');
    barCtx.setAttribute('style', '');
    var barGraph = localChartMapping['quizDistributionChart'];
    if (barGraph == null) {
        barGraph = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
                detailDataset: totalScoreStudentsObject,
                datasets: [{
                    label: 'Quiz Score Distribution',
                    data: quizGraphNumScores,
                    backgroundColor: [
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6',
                        '#29b6f6'
                    ]
                }]
            },
            options: {
                hover: {
                    onHover: function(e, elements) {
                        $(e.currentTarget).css('cursor', elements[0] ? 'pointer' : 'default');
                    }
                },
                onClick: function(event, array) {
                    var whichBar = array[0]._index;
                    var dataObject = array[0]._chart.config.data.detailDataset[whichBar.toString()];
                    var quizDetailContent = document.getElementById('studentQuizDetailContent');
                    var quizDetailCollection = document.getElementById('studentQuizDetailCollection');
                    var quizDetailContentHeader = document.getElementById('studentQuizDetailContentHeader');
                    if (quizDetailCollection) {
                        quizDetailContent.removeChild(quizDetailCollection);
                        quizDetailContent.removeChild(quizDetailContentHeader);
                    }
                    quizDetailContentHeader = document.createElement('h4');
                    quizDetailContentHeader.id = 'studentQuizDetailContentHeader';
                    quizDetailContentHeader.textContent = 'Showing quizzes with score ' + array[0]._chart.config.data.labels[whichBar];
                    quizDetailContent.appendChild(quizDetailContentHeader);
                    quizDetailCollection = document.createElement('ul');
                    quizDetailCollection.id = 'studentQuizDetailCollection';
                    quizDetailCollection.classList.add('collapsible');
                    quizDetailCollection.setAttribute('data-collapsible', 'accordion');
                    Object.keys(dataObject).forEach(function(key, index) {
                        var userObject = dataObject[key];
                        var quizDetailElement = document.createElement('li');
                        var quizDetailHeader = document.createElement('div');
                        quizDetailHeader.classList.add('collapsible-header', 'light-blue', 'lighten-1', 'white-text');
                        var userIcon = document.createElement('i');
                        userIcon.classList.add('small', 'material-icons');
                        userIcon.textContent = 'perm_identity';
                        quizDetailHeader.textContent = key;
                        quizDetailHeader.appendChild(userIcon);
                        var quizDetailBody = document.createElement('div');
                        quizDetailBody.classList.add('collapsible-body');
                        var nestedDetailCollection = document.createElement('ul');
                        nestedDetailCollection.classList.add('collapsible');
                        nestedDetailCollection.setAttribute('data-collapsible', 'accordion');
                        Object.keys(userObject).forEach(function(key2, index2) {
                            var nestedDetailElement = document.createElement('li');
                            var nestedDetailHeader = document.createElement('div');
                            nestedDetailHeader.classList.add('collapsible-header', 'light-blue', 'lighten-1', 'white-text');
                            var quizTimestamp = userObject[key2].details.timestamp;
                            var quizDate = quizTimestamp;
                            nestedDetailHeader.textContent = quizDate;
                            var nestedDetailBody = document.createElement('div');
                            nestedDetailBody.classList.add('collapsible-body');
                            nestedDetailBody.textContent = 'Score: ' + userObject[key2].details.raw;
                            nestedDetailElement.appendChild(nestedDetailHeader);
                            nestedDetailElement.appendChild(nestedDetailBody);
                            nestedDetailCollection.appendChild(nestedDetailElement);
                        });
                        quizDetailBody.appendChild(nestedDetailCollection);
                        quizDetailElement.appendChild(quizDetailHeader);
                        quizDetailElement.appendChild(quizDetailBody);
                        quizDetailCollection.appendChild(quizDetailElement);
                    });
                    quizDetailContent.appendChild(quizDetailCollection);
                    $('.collapsible').collapsible();
                    $('#studentQuizDetailModal').modal('open');
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data) {
                            return 'Scores in range ' + data.labels[tooltipItems[0].index];
                        },
                        label: function(tooltipItems, data) {
                            return tooltipItems.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        barPercentage: 0.95,
                        categoryPercentage: 1,
                        scaleLabel: {
                            display: true,
                            labelString: 'Score'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 4,
                            stepSize: 2
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Quizzes'
                        }
                    }]
                }
            }
        });
        localChartMapping['quizDistributionChart'] = barGraph;
    } else {
        barGraph.data.datasets[0].data = quizGraphNumScores;
        barGraph.data.detailDataset = totalScoreStudentsObject;
        barGraph.update(100, true);
    }

    $('#quizDistributionChart').css('width', $('#quizDistributionWrapper').width());

    //Creates the bar graph with average, max, and min quiz scores.
    
    // var barCtx = document.getElementById('barChart');
    // barCtx.setAttribute('style', '');
    // var barGraph = localChartMapping['barChart'];
    // if (barGraph == null) {
    // barGraph = new Chart(barCtx, {
    //         type: 'bar',
    //         data: {
    //             labels: ['Average Score', 'Highest Score', 'Lowest Score'],
    //             datasets: [{
    //                 label: 'Quiz statistics for: ' + currentBook,
    //                 data: [avgScore, maxScore, minScore],
    //                 backgroundColor: [
    //         			'#ffb74d',
    //         			'#29b6f6',
    //         			'#e53935'
    //                 ]
    //             }]
    //         },
    //         options: {
    //             tooltips: {
    //                 callbacks: {
    //                     label: function(tooltipItems, data) {
    //                         return Math.round(parseInt(tooltipItems.yLabel)) + '%';
    //                     }
    //                 }
    //             },
    //             scales: {
    //                 yAxes: [{
    //                     ticks: {
    //                         beginAtZero:true,
    //                         max:100
    //                     },
    //                     scaleLabel: {
    //                         display: true,
    //                         labelString: 'Percentage'
    //                     }
    //                 }]
    //             },
    //             legend: {
    //                 display: false
    //             }
    //         }
    // });
    // localChartMapping['barChart'] = barGraph;
    // } else {
    // 	barGraph.data.datasets[0].data[0] = avgScore;
    // 	barGraph.data.datasets[0].data[1] = maxScore;
    // 	barGraph.data.datasets[0].data[2] = minScore;
    // 	barGraph.update(100, true);
    // }
};

function showStudentGraphsCallback(general, events, other, currentUser, currentBook) {
    var annotationShared = 0;
    var annotation = 0;
    var preferred = 0;
    var interacted = 0;
    var passed = 0;
    var failed = 0;
    var dictionary = {};
    var dictionary2 = {};
    for (let i in general) {
        if (general[i].verb.display["en-US"] === "shared") {
	    annotationShared++;
        }
    }
    for (let i in events) {
        let verb = events[i].verb.display["en-US"];
        switch(verb){
        case "failed":
	    failed++;
	    break;
        case "passed":
	    passed++;
	    break;
        case "preferred":
	    preferred++;
	    break;
        case "interacted":
	    interacted++;
	    break;
        default:
	    break;
        }
    }
    for (let i in other) {
        if (other[i].verb.display["en-US"]) {
            annotation++;
        }
    }
    var ctx = document.getElementById("myChart");
    ctx.setAttribute("style", "width:400px; height:400px;");
    
    var myChart = localChartMapping["myChart"];
    if (myChart == null) {
	myChart = new Chart(ctx, {
            type: 'bar',
            data: {
		labels: ["Highlights", "Highlights Shared", "Preferred","Quizzes Passed", "Quizzes Failed"],
		datasets: [{
                    label: "Statistics for: " + currentBook,
                    data: [annotation, annotationShared, preferred, passed, failed],
                    backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
			'rgba(255,99,132,1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
		}]
            },
            options: {
		scales: {
                    yAxes: [{
			ticks: {
                            beginAtZero:true
			}
                    }]
		}
            }
	});
	localChartMapping["myChart"] = myChart;
    } else {
	myChart.data.datasets[0].data[0] = annotation;
	myChart.data.datasets[0].data[1] = annotationShared;
	myChart.data.datasets[0].data[2] = preferred;
	myChart.data.datasets[0].data[3] = passed;
	myChart.data.datasets[0].data[4] = failed;
	myChart.update(100, true);
    }
};

window.Graphs.showStudentGraphs = function() {
    var currentUser = window.Dashboard.pebl.userManager.getUser().identity;
    var currentBook = window.Dashboard.pebl.activityManager.currentBook;
    var pebl = window.Dashboard.pebl;
    pebl.getGeneralAnnotations(currentBook,
			       function (sharedAnnotations) {
				   pebl.getEvents(currentBook,
						  function (events) {
						      pebl.getAnnotations(currentBook,
									  function (annotations) {
									      showStudentGraphsCallback(sharedAnnotations,
													events,
													annotations,
													currentUser,
													currentBook);
									  });
						  });

			       });
};

Chart.pluginService.register({
    beforeDraw: function (chart) {
	if (chart.config.options.elements.center) {
	    //Get ctx from string
	    var ctx = chart.chart.ctx;

	    //Get options from the center object in options
	    var centerConfig = chart.config.options.elements.center;
	    var fontStyle = centerConfig.fontStyle || 'Arial';
	    var txt = centerConfig.text;
	    var color = centerConfig.color || '#000';
	    var sidePadding = centerConfig.sidePadding || 20;
	    var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
	    //Start with a base font of 30px
	    ctx.font = "30px " + fontStyle;

	    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
	    var stringWidth = ctx.measureText(txt).width;
	    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

	    // Find out how much the font can grow in width.
	    var widthRatio = elementWidth / stringWidth;
	    var newFontSize = Math.floor(30 * widthRatio);
	    var elementHeight = (chart.innerRadius * 2);

	    // Pick a new font size so it will not be larger than the height of label.
	    var fontSizeToUse = Math.min(newFontSize, elementHeight);

	    //Set font settings to draw it correctly.
	    ctx.textAlign = 'center';
	    ctx.textBaseline = 'middle';
	    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
	    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
	    ctx.font = fontSizeToUse+"px " + fontStyle;
	    ctx.fillStyle = color;

	    //Draw text in center
	    ctx.fillText(txt, centerX, centerY);
	}
    }
});

setActivityRosterStudent = function(student) {
    activityRosterStudentOverride = student;
    window.Graphs.showTeacherGraphs(globalTsr);
}

printGraphs = function() {
    var studentActivitySection = document.getElementById('studentActivitySection');
    var classProgressSection = document.getElementById('classProgressSection');
    var quizStatisticsSection = document.getElementById('quizStatisticsSection');
    var questionSection = document.getElementById('questionSection');
    var discussionSection = document.getElementById('discussionSection');
    var menuButton = document.getElementById('fixedMenuButton');
    var navBar = document.getElementById('topNav');
    var footer = document.getElementById('footer');

    studentActivitySection.classList.add('active');
    studentActivitySection.children[0].classList.add('active');
    studentActivitySection.children[1].setAttribute('style','display: block');
    classProgressSection.classList.add('active');
    classProgressSection.children[0].classList.add('active');
    classProgressSection.children[1].setAttribute('style', 'display: block');
    quizStatisticsSection.classList.add('active');
    quizStatisticsSection.children[0].classList.add('active');
    quizStatisticsSection.children[1].setAttribute('style', 'display: block');
    questionSection.classList.add('active');
    questionSection.children[0].classList.add('active');
    questionSection.children[1].setAttribute('style', 'display: block');
    setTimeout(function() {
	window.print();
    }, 1000);
}

displayDownloadOptions = function() {
    var downloadLinks = document.getElementById('downloadLinks');
    while (downloadLinks.firstChild) {
	downloadLinks.removeChild(downloadLinks.firstChild);
    }

    var actionsLink = document.createElement('a');
    actionsLink.textContent = 'Actions';
    actionsLink.classList.add('collection-item');
    createCsvLink(actionsLink, 'actions.csv', jsonToCsv(downloadActions));
    downloadLinks.appendChild(actionsLink);

    var navigationsLink = document.createElement('a');
    navigationsLink.textContent = 'Navigation Data';
    navigationsLink.classList.add('collection-item');
    createCsvLink(navigationsLink, 'navigations.csv', jsonToCsv(downloadNavigations));
    downloadLinks.appendChild(navigationsLink);

    var sessionsLink = document.createElement('a');
    sessionsLink.textContent = 'Session Data';
    sessionsLink.classList.add('collection-item');
    createCsvLink(sessionsLink, 'sessions.csv', jsonToCsv(downloadSessions));
    downloadLinks.appendChild(sessionsLink);

    var quizzesLink = document.createElement('a');
    quizzesLink.textContent = 'Quizzes';
    quizzesLink.classList.add('collection-item');
    createCsvLink(quizzesLink, 'quizzes.csv', jsonToCsv(downloadQuizzes));
    downloadLinks.appendChild(quizzesLink);

    var questionsLink = document.createElement('a');
    questionsLink.textContent = 'Questions';
    questionsLink.classList.add('collection-item');
    createCsvLink(questionsLink, 'questions.csv', jsonToCsv(downloadQuestions));
    downloadLinks.appendChild(questionsLink);

    var annotationsLink = document.createElement('a');
    annotationsLink.textContent = 'User Annotations';
    annotationsLink.classList.add('collection-item');
    createCsvLink(annotationsLink, 'annotations.csv', jsonToCsv(downloadAnnotations));
    downloadLinks.appendChild(annotationsLink);

    var sharesLink = document.createElement('a');
    sharesLink.textContent = 'Shared Annotations';
    sharesLink.classList.add('collection-item');
    createCsvLink(sharesLink, 'sharedAnnotations.csv', jsonToCsv(downloadSharedAnnotations));
    downloadLinks.appendChild(sharesLink);

    var allVerbsLink = document.createElement('a');
    allVerbsLink.textContent = 'All Verbs';
    allVerbsLink.classList.add('collection-item');
    var tempArray = downloadSessions.concat(downloadNavigations);
    var newTemp = tempArray.concat(downloadActions);
    createCsvLink(allVerbsLink, 'allVerbs.csv', jsonToCsv(newTemp));
    downloadLinks.appendChild(allVerbsLink);
    $('#downloadOptionsModal').modal('open');
}

createCsvLink = function(element, filename, data) {
    var textFile = null;
    var makeTextFile = function(text) {
	var data = new Blob([text], {type: 'text/plain'});
	if (textFile !== null) {
	    window.URL.revokeObjectURL(textFile);
	}
	textFile = window.URL.createObjectURL(data);

	return textFile;
    }
    element.setAttribute('href', makeTextFile(data));
    element.setAttribute('download', filename);
}

jsonToCsv = function(objArray) {
    var keys = Object.keys(JSON.parse(objArray[0]));
    var result = keys.join(',') + '\n';
    objArray.forEach(function(obj) {
	obj = JSON.parse(obj);
	keys.forEach(function(k, ix) {
	    if (ix) {
		result += ',';
	    }
	    result += '"' + obj[k] + '"';
	});
	result += '\n';
    });
    return result;
}
