var globalPebl = (window.parent && window.parent.PeBL) ? window.parent.PeBL : (window.PeBL ? window.PeBL : null);

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