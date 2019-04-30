var globalPebl = window.top.PeBL;

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