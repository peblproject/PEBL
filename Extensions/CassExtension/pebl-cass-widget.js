/*
Copyright 2020 Eduworks Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function checkCompetencies() {
    // if (window.top.PeBL != null) {
    //     window.top.PeBL.getCompetencies(function(competencies) {
    //         var elements = $("[data-cassMapping]");
    //         if (competencies != null) {
    //             elements.map(function (index) {
    //                 var element = elements[index];
    //                 var data = element.dataset;
    //                 /*
    //                  element.dataset doesn't work
    //                 */
    //                 var key = element.getAttribute("data-cassMapping");
    //                 var level = element.getAttribute("data-cassLevel") == "1" ? 0 : 1;
    //                 var target = element.getAttribute("data-cassTarget");
    //                 var competency;
    //                 for (var i in competencies) {
    //                     if (competencies[i].url == key) {
    //                         competency = competencies[i];
    //                         break;
    //                     }
    //                 }
    //                 if ((competency != null) && (competency.level == level)) {
    //                     var cfi = "";
    //                     // if (window.top.ReadiumSDK != null)
    //                     //     cfi = window.top.ReadiumSDK.reader.getCfiForElement($("#" + target));

    //                     var e = $("#" + target);
    //                     if (element.nodeName == "button") {
    //                         if (!e.is(":visible") && !e.hasClass("userToggled")) {
    //                             e.click(function(event) {
    //                                 event.preventDefault();
    //                                 toggleVisibility(event, true);
    //                             });
    //                             window.top.pebl.eventContentMorphed(competency.level, key, cfi);
    //                         }
    //                     } else {
    //                         if (!isLevelSet(level+1, target) && !e.hasClass("userToggled")) {
    //                             setLevel(level + 1, target, true);
    //                             window.top.pebl.eventContentMorphed(competency.level, key, cfi);
    //                         }
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // }
}

$().ready(function () {
    checkCompetencies();
    setInterval(checkCompetencies, 1000);
});
