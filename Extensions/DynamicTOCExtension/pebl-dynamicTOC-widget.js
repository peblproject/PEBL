var globalPebl = window.top.PeBL;

globalPebl.extension.dynamicTOC = {
	toc_sort: function(a, b) {
		var parts = {
	        a: a.split('-'),
	        b: b.split('-')
	    };

	    var a_compare;
	    var b_compare;
	    if (parts && parts.a && parts.a[1] && parts.a[1].includes('.')) {
	        a_compare = parts.a[1].split('.').pop();
	    } else {
	        return -1;
	    }

	    if (parts && parts.b && parts.b[1] && parts.b[1].includes('.')) {
	        b_compare = parts.b[1].split('.').pop();
	    } else {
	        return 1;
	    }

	    return parseFloat(a_compare) - parseFloat(b_compare);
	},

	createTOC: function(element) {
		globalPebl.utils.getToc(function(obj) {
	        var tocObject = obj;

	        var tocContainer = document.createElement('div');
	        tocContainer.id = 'tocContainer';
	        tocContainer.classList.add('tocContainer');

	        Object.keys(tocObject).forEach(function(sectionKey) {
	            //Sections
	            var tocSection = document.createElement('div');
	            tocSection.classList.add('tocSection');
	            var tocSectionPrefix = document.createElement('div');
	            tocSectionPrefix.classList.add('tocSectionPrefix');
	            var tocSectionPrefixText = document.createElement('a');
	            tocSectionPrefixText.classList.add('tocSectionPrefixText');
	            tocSectionPrefixText.textContent = tocObject[sectionKey].Section.prefix;
	            tocSectionPrefixText.href = tocObject[sectionKey].Section.location;
	            tocSectionPrefix.appendChild(tocSectionPrefixText);
	            var tocSectionTitle = document.createElement('div');
	            tocSectionTitle.classList.add('tocSectionTitle');
	            var tocSectionTitleTextWrapper = document.createElement('div');
	            tocSectionTitleTextWrapper.classList.add('tocSectionTitleTextWrapper');
	            var tocSectionTitleText = document.createElement('a');
	            tocSectionTitleText.classList.add('tocSectionTitleText');
	            tocSectionTitleText.textContent = tocObject[sectionKey].Section.title;
	            tocSectionTitleText.href = tocObject[sectionKey].Section.location;
	            tocSectionTitleTextWrapper.appendChild(tocSectionTitleText);
	            tocSectionTitle.appendChild(tocSectionPrefix);
	            tocSectionTitle.appendChild(tocSectionTitleTextWrapper);
	            tocSection.appendChild(tocSectionTitle);
	            Object.keys(tocObject[sectionKey]).sort(globalPebl.extension.dynamicTOC.toc_sort).forEach(function(pageKey) {
	                //Pages
	                if (pageKey === 'Section') {
	                    //Do nothing
	                } else if (pageKey.includes('Subsection')) {
	                    //Subsections
	                    var tocSubsectionPrefix = document.createElement('div');
	                    tocSubsectionPrefix.classList.add('tocSubsectionPrefix');
	                    var tocSubsectionPrefixText = document.createElement('span');
	                    tocSubsectionPrefixText.classList.add('tocSubsectionPrefixText');
	                    tocSubsectionPrefixText.textContent = tocObject[sectionKey][pageKey].prefix;

	                    tocSubsectionPrefix.appendChild(tocSubsectionPrefixText);

	                    var tocSubsectionTitle = document.createElement('div');
	                    tocSubsectionTitle.classList.add('tocSubsectionTitle');
	                    var tocSubsectionTitleTextWrapper = document.createElement('div');
	                    tocSubsectionTitleTextWrapper.classList.add('tocSubsectionTitleTextWrapper');
	                    if (tocObject[sectionKey][pageKey].skip !== undefined) {
	                        var tocSubsectionTitleText = document.createElement('a');
	                        tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
	                        tocSubsectionTitleText.textContent = tocObject[sectionKey][pageKey].title;
	                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
	                    } else {
	                        var tocSubsectionTitleText = document.createElement('a');
	                        tocSubsectionTitleText.classList.add('tocSubsectionTitleText');
	                        tocSubsectionTitleText.textContent = tocObject[sectionKey][pageKey].title;
	                        tocSubsectionTitleText.href = tocObject[sectionKey][pageKey].location;
	                    }
	                    

	                    tocSubsectionTitleTextWrapper.appendChild(tocSubsectionTitleText);
	                    tocSubsectionTitle.appendChild(tocSubsectionPrefix);
	                    tocSubsectionTitle.appendChild(tocSubsectionTitleTextWrapper);
	                    tocSection.appendChild(tocSubsectionTitle);

	                    //Add Dynamic content associated with a subsection
	                    var cardMatch = tocObject[sectionKey][pageKey].prefix;
	                    Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
	                        if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
	                            var tocPage = document.createElement('div');
	                            tocPage.classList.add('tocPage');

	                            var tocPageIconWrapper = document.createElement('div');
	                            tocPageIconWrapper.classList.add('tocPageIconWrapper');

	                            var tocPageIcon = document.createElement('i');
	                            tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-link');

	                            tocPageIconWrapper.appendChild(tocPageIcon);

	                            var tocPageTextWrapper = document.createElement('div');
	                            tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

	                            var tocPageText = document.createElement('a');
	                            tocPageText.classList.add('tocPageText');
	                            tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
	                            tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
	                            tocPageText.setAttribute('slide', dynamicKey);
	                            tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
	                            tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
	                            tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
	                            tocPageText.href = tocObject[sectionKey][pageKey].location;
	                            tocPageText.setAttribute('tocLink', 'true');
	                            tocPageText.addEventListener('click', function() {
	                                handleTocPageTextClick(event);
	                            });

	                            tocPageTextWrapper.appendChild(tocPageText);

	                            var tocPageDeleteButtonWrapper = document.createElement('div');
	                            tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

	                            var tocPageDeleteButton = document.createElement('span');
	                            tocPageDeleteButton.classList.add('tocPageDeleteButton');
	                            tocPageDeleteButton.innerHTML = '&#215;';
	                            tocPageDeleteButton.setAttribute('section-id', sectionKey);
	                            tocPageDeleteButton.setAttribute('document-id', dynamicKey);

	                            tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

	                            tocPage.appendChild(tocPageIconWrapper);
	                            tocPage.appendChild(tocPageTextWrapper);
	                            tocPage.appendChild(tocPageDeleteButtonWrapper);
	                            tocSection.appendChild(tocPage);
	                        }
	                    });


	                    Object.keys(tocObject[sectionKey][pageKey].pages).sort(globalPebl.extension.dynamicTOC.toc_sort).forEach(function(cardKey) {
	                        
	                        if (tocObject[sectionKey][pageKey].skip !== undefined) {
	                            
	                        } else {
	                            var tocPage = document.createElement('div');
	                            tocPage.classList.add('tocPage');
	                            tocPage.classList.add('header');

	                            var tocPagePrefixWrapper = document.createElement('div');
	                            tocPagePrefixWrapper.classList.add('tocPagePrefixWrapper');

	                            var tocPagePrefix = document.createElement('a');
	                            tocPagePrefix.classList.add('tocPagePrefix');
	                            tocPagePrefix.textContent = tocObject[sectionKey][pageKey].pages[cardKey].prefix;
	                            tocPagePrefix.href = tocObject[sectionKey][pageKey].pages[cardKey].location;

	                            tocPagePrefixWrapper.appendChild(tocPagePrefix);
	                            tocPage.appendChild(tocPagePrefixWrapper);

	                            var tocPageTextWrapper = document.createElement('div');
	                            tocPageTextWrapper.classList.add('tocPageTextWrapperWide');

	                            var tocPageText = document.createElement('a');
	                            tocPageText.classList.add('tocPageText');
	                            tocPageText.textContent = tocObject[sectionKey][pageKey].pages[cardKey].title;
	                            tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
	                            tocPageText.addEventListener('click', function() {
	                                handleTocPageTextClick(event);
	                            });

	                            tocPageTextWrapper.appendChild(tocPageText);

	                            tocPage.appendChild(tocPageTextWrapper);
	                            tocSection.appendChild(tocPage);

	                            var cardMatch = tocObject[sectionKey][pageKey].pages[cardKey].prefix;
	                            //Add any dynamic documents associated with subpages
	                            Object.keys(tocObject[sectionKey]).forEach(function(dynamicKey) {
	                                if (!dynamicKey.includes('Subsection') && tocObject[sectionKey][dynamicKey].card === cardMatch) {
	                                    var tocPage = document.createElement('div');
	                                    tocPage.classList.add('tocPage');

	                                    var tocPageIconWrapper = document.createElement('div');
	                                    tocPageIconWrapper.classList.add('tocPageIconWrapper');

	                                    var tocPageIcon = document.createElement('i');
	                                    tocPageIcon.classList.add('tocPageIcon', 'fa', 'fa-link');

	                                    tocPageIconWrapper.appendChild(tocPageIcon);

	                                    var tocPageTextWrapper = document.createElement('div');
	                                    tocPageTextWrapper.classList.add('tocPageTextWrapperDynamic');

	                                    var tocPageText = document.createElement('a');
	                                    tocPageText.classList.add('tocPageText');
	                                    tocPageText.setAttribute('style', 'color: rgb(115, 115, 115) !important;');
	                                    tocPageText.textContent = tocObject[sectionKey][dynamicKey].documentName;
	                                    tocPageText.setAttribute('slide', dynamicKey);
	                                    tocPageText.setAttribute('url', tocObject[sectionKey][dynamicKey].url);
	                                    tocPageText.setAttribute('docType', tocObject[sectionKey][dynamicKey].docType);
	                                    tocPageText.setAttribute('externalURL', tocObject[sectionKey][dynamicKey].externalURL);
	                                    tocPageText.href = tocObject[sectionKey][pageKey].pages[cardKey].location;
	                                    tocPageText.setAttribute('tocLink', 'true');
	                                    tocPageText.addEventListener('click', function() {
	                                        handleTocPageTextClick(event);
	                                    });

	                                    tocPageTextWrapper.appendChild(tocPageText);

	                                    var tocPageDeleteButtonWrapper = document.createElement('div');
	                                    tocPageDeleteButtonWrapper.classList.add('tocPageDeleteButtonWrapper');

	                                    var tocPageDeleteButton = document.createElement('span');
	                                    tocPageDeleteButton.classList.add('tocPageDeleteButton');
	                                    tocPageDeleteButton.innerHTML = '&#215;';
	                                    tocPageDeleteButton.setAttribute('section-id', sectionKey);
	                                    tocPageDeleteButton.setAttribute('document-id', dynamicKey);

	                                    tocPageDeleteButtonWrapper.appendChild(tocPageDeleteButton);

	                                    tocPage.appendChild(tocPageIconWrapper);
	                                    tocPage.appendChild(tocPageTextWrapper);
	                                    tocPage.appendChild(tocPageDeleteButtonWrapper);
	                                    tocSection.appendChild(tocPage);
	                                }
	                            });
	                        }
	                    });

	                } else {
	                    //Do nothing
	                    
	                }
	            });
	            tocContainer.appendChild(tocSection);
	        });
	        element.appendChild(tocContainer);
	        //document.getElementById('peblOverlay').appendChild(createOverlayCloseButton());
	        //Fix TOC scrolling, iOS sucks
	        setTimeout(function() {
	            $('.tocSection').attr('style', 'transform: translate3d(0px, 0px, 0px);');
	        }, 1000);
	    });
	}
}

