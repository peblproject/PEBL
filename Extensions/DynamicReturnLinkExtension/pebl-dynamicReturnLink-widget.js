var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var dynamicReturnLink = {};
if (globalPebl)
    globalPebl.extension.dynamicReturnLink = dynamicReturnLink;

jQuery(document).ready(function() {
    dynamicReturnLink.loadDynamicLinks();
    dynamicReturnLink.bindOutgoingLinks();
});

dynamicReturnLink.loadDynamicLinks = function() {
    var link = localStorage.getItem('dynamicReturnLink');
    jQuery('a.dynamicReturnLink').each(function() {
        if (link) {
            this.href = link;
            jQuery(this).show();
            this.addEventListener('click', function(evt) {
                localStorage.removeItem('dynamicReturnLink');
                evt.currentTarget.removeEventListener('click', arguments.callee);
                dynamicReturnLink.loadDynamicLinks();
            });
        } else {
            jQuery(this).hide();
        }
        
    });
}

dynamicReturnLink.bindOutgoingLinks = function() {
    jQuery('a').each(function() {
        if (this.hasAttribute('data-dynamicReturnLink')) {
            var link = this.getAttribute('data-dynamicReturnLink');
            this.addEventListener('click', function(evt) {
                localStorage.setItem('dynamicReturnLink', link);
                dynamicReturnLink.loadDynamicLinks();
            });
        }
    });
}

