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
    var linkText = localStorage.getItem('dynamicReturnLinkText');
    jQuery('a.dynamicReturnLink').each(function() {
        if (link && linkText) {
            this.href = link;
            this.textContent = linkText;
            jQuery(this).show();
            this.addEventListener('click', function(evt) {
                localStorage.removeItem('dynamicReturnLink');
                localStorage.removeItem('dynamicReturnLinkText');
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
        if (this.hasAttribute('data-dynamicReturnLink') && this.hasAttribute('data-dynamicReturnLinkText')) {
            var link = this.getAttribute('data-dynamicReturnLink');
            var linkText = this.getAttribute('data-dynamicReturnLinkText');
            this.addEventListener('click', function(evt) {
                localStorage.setItem('dynamicReturnLink', link);
                localStorage.setItem('dynamicReturnLinkText', linkText);
                dynamicReturnLink.loadDynamicLinks();
            });
        }
    });
}

