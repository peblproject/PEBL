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

