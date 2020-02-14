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

var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);
if (!window.Configuration)
	window.Configuration = {}
window.Configuration.lrsUrl = ''; //TODO: CHANGE ME
window.Configuration.lrsCredential = ''; //TODO: CHANGE ME
window.Configuration.useLinkedIn = false;

var config = {};

globalPebl.extension.config = config;

// These functions run when the page is loaded.
config.onLoadFunctions = {

}
// Data Entry extension config
config.dataEntry = {
    
}
// lowStakes Quiz extension config
config.lowStakesQuiz = {
	
}

$(document).ready(function() {
    if (config.onLoadFunctions) {
        Object.values(config.onLoadFunctions).forEach(function(value) {
            if (typeof value === "function") {
                value();
            }
        });
    }
});