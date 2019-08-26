var globalPebl = window.parent.PeBL;
var globalReadium = window.parent.READIUM;

var dataEntry = {};
if (globalPebl)
    globalPebl.extension.dataEntry = dataEntry;

jQuery(document).ready(function () {
    dataEntry.insertExtensions();
});

//Prevents invalid form alert from appearing multiple times on a single submit
dataEntry.invalidFormActive = false;

//Each data entry has its own state variables and functions
dataEntry.activeEntries = {};

dataEntry.insertExtensions = function() {
    jQuery('.dataEntryExtension, .peblExtension[data-peblextension="dataentry"]').each(function() {        
        var prompt = jQuery(this)[0].getAttribute('data-prompt');        
        var id = jQuery(this)[0].getAttribute('data-id');        
        var insertID = jQuery(this)[0].getAttribute('id');        
        var forms = JSON.parse(jQuery(this)[0].getAttribute('data-forms'));        
        var sharing = jQuery(this)[0].getAttribute('data-sharing');        
        var displayMode = jQuery(this)[0].getAttribute('data-displayMode') || jQuery(this)[0].getAttribute('data-displaymode');        
        var polling = jQuery(this)[0].hasAttribute('data-polling') ? jQuery(this)[0].getAttribute('data-polling') : 'false';        
        var useConfig = jQuery(this)[0].hasAttribute('data-useConfig') ? jQuery(this)[0].getAttribute('data-useConfig') : 'false';        
        dataEntry.createDataEntry(insertID, prompt, id, forms, sharing, displayMode, polling, useConfig);        
    });        
}

dataEntry.createHeader = function (id, form, activeEntry) {
    var cssClass = '';
    if (form.cssClass) {
        cssClass = form.cssClass;
    }

    var header = document.createElement('div');
    header.classList.add('dataEntryHeaderEntry');
    if (cssClass.length > 1)
        header.classList.add(cssClass);

    var headerText = document.createElement('div');

    headerText.innerHTML = form.prompt;
    header.appendChild(headerText);

    return header;
}

dataEntry.createDropdownEntry = function (id, form, activeEntry) {
    var dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dataEntryDropdownContainer');

    var dropdownPrompt = document.createElement('span');
    dropdownPrompt.classList.add('dataEntryDropdownPrompt');
    dropdownPrompt.innerHTML = form.prompt;

    dropdownContainer.appendChild(dropdownPrompt);

    var dropdownWrapper = document.createElement('div');
    dropdownWrapper.classList.add('dropdownWrapper');
    dropdownContainer.appendChild(dropdownWrapper);

    var dropdownInput = document.createElement('select');
    dropdownInput.classList.add('edit');
    dropdownInput.id = id;
    dropdownInput.setAttribute('data-prompt', form.prompt);
    dropdownInput.setAttribute('data-responseBox', dataEntry.comboID(id, 'responseBox'));
    dropdownInput.setAttribute('data-responseBoxOfficial', dataEntry.comboID(id, 'responseBoxOfficial'));
    dropdownInput.setAttribute('data-responseBoxPrivate', dataEntry.comboID(id, 'responseBoxPrivate'));
    dropdownInput.setAttribute('data-responseBoxTeam', dataEntry.comboID(id, 'responseBoxTeam'));
    dropdownInput.setAttribute('data-responseBoxClass', dataEntry.comboID(id, 'responseBoxClass'));

    for (var option of form.options) {
        var optionElem = document.createElement('option');
        optionElem.value = option;
        optionElem.textContent = option;
        optionElem.title = option;
        dropdownInput.appendChild(optionElem);
    }

    dropdownWrapper.appendChild(dropdownInput);

    var dropdownResponses = document.createElement('div');
    dropdownResponses.classList.add('textResponses', 'unofficialView');
    dropdownResponses.id = dataEntry.comboID(id, 'responseBox');

    var dropdownOfficialResponses = document.createElement('div');
    dropdownOfficialResponses.classList.add('textResponses', 'officialView');
    dropdownOfficialResponses.id = dataEntry.comboID(id, 'responseBoxOfficial');

    var dropdownPrivateResponses = document.createElement('div');
    dropdownPrivateResponses.classList.add('textResponses', 'privateView');
    dropdownPrivateResponses.id = dataEntry.comboID(id, 'responseBoxPrivate');

    var dropdownTeamResponses = document.createElement('div');
    dropdownTeamResponses.classList.add('textResponses', 'teamView');
    dropdownTeamResponses.id = dataEntry.comboID(id, 'responseBoxTeam');

    var dropdownClassResponses = document.createElement('div');
    dropdownClassResponses.classList.add('textResponses', 'classView');
    dropdownClassResponses.id = dataEntry.comboID(id, 'responseBoxClass');

    dropdownContainer.appendChild(dropdownResponses);
    dropdownContainer.appendChild(dropdownOfficialResponses);
    dropdownContainer.appendChild(dropdownPrivateResponses);
    dropdownContainer.appendChild(dropdownTeamResponses);
    dropdownContainer.appendChild(dropdownClassResponses);

    activeEntry.dropdowns.add(id);

    return dropdownContainer;
}

dataEntry.createMultipleChoiceEntry = function (id, form, activeEntry, useGraphView) {
    var multiChoiceContainer = document.createElement('div');
    multiChoiceContainer.classList.add('dataEntryMultiChoiceContainer');

    var multiChoicePrompt = document.createElement('div');
    multiChoicePrompt.classList.add('dataEntryMultiChoicePrompt');
    multiChoicePrompt.innerHTML = form.prompt;

    multiChoiceContainer.appendChild(multiChoicePrompt);

    var multiChoiceButtonsContainer = document.createElement('div');
    multiChoiceButtonsContainer.classList.add('dataEntryMultiChoiceButtonsContainer');
    multiChoiceButtonsContainer.id = id;

    var multiChoiceResponseContainer = document.createElement('div');
    multiChoiceResponseContainer.classList.add('dataEntryMultiChoiceResponseContainer');
    multiChoiceResponseContainer.id = dataEntry.comboID(id, 'responseBox');

    var multiChoiceResponseContainerGraph = document.createElement('div');        
    multiChoiceResponseContainerGraph.classList.add('dataEntryMultiChoiceResponseContainer');        
    multiChoiceResponseContainerGraph.id = dataEntry.comboID(id, 'responseBox', 'graph');

    var multiChoiceTeamResponseContainerGraph = document.createElement('div');
    multiChoiceTeamResponseContainerGraph.classList.add('dataEntryMultiChoiceResponseContainer');
    multiChoiceTeamResponseContainerGraph.id = dataEntry.comboID(id, 'responseBoxTeam', 'graph');

    var multiChoiceClassResponseContainerGraph = document.createElement('div');
    multiChoiceClassResponseContainerGraph.classList.add('dataEntryMultiChoiceResponseContainer');
    multiChoiceClassResponseContainerGraph.id = dataEntry.comboID(id, 'responseBoxClass', 'graph');

    var multiChoiceTeamResponseContainer = document.createElement('div');
    multiChoiceTeamResponseContainer.classList.add('textResponses', 'teamView');
    multiChoiceTeamResponseContainer.id = dataEntry.comboID(id, 'responseBoxTeam');

    var multiChoiceClassResponseContainer = document.createElement('div');
    multiChoiceClassResponseContainer.classList.add('textResponses', 'classView');
    multiChoiceClassResponseContainer.id = dataEntry.comboID(id, 'responseBoxClass');

    for (var i = 0; i < form.responses.length; i++) {
        var multiChoiceButton = document.createElement('button');
        multiChoiceButton.classList.add('dataEntryMultiChoiceButton', 'edit');
        multiChoiceButton.textContent = form.responses[i];
        multiChoiceButton.setAttribute('data-prompt', form.prompt);
        multiChoiceButton.setAttribute('data-index', i);
        multiChoiceButton.setAttribute('data-responseBox', dataEntry.comboID(id, 'responseBox'));
        multiChoiceButton.setAttribute('data-responseBoxGraph', dataEntry.comboID(id, 'responseBox', 'graph'));
        multiChoiceButton.setAttribute('data-responseBoxTeamGraph', dataEntry.comboID(id, 'responseBoxTeam', 'graph'));
        multiChoiceButton.setAttribute('data-responseBoxClassGraph', dataEntry.comboID(id, 'responseBoxClass', 'graph'));
        multiChoiceButton.setAttribute('data-responseBoxTeam', dataEntry.comboID(id, 'responseBoxTeam'));
        multiChoiceButton.setAttribute('data-responseBoxClass', dataEntry.comboID(id, 'responseBoxClass'));
        if (useGraphView && useGraphView === 'true') {
            multiChoiceButton.setAttribute('data-useGraphView', 'true');
        } else {
            multiChoiceButton.setAttribute('data-useGraphView', 'false');
        }
        multiChoiceButton.addEventListener('click', function () {
            jQuery(multiChoiceButtonsContainer).find('.dataEntryMultiChoiceButton').each(function () {
                jQuery(this).removeClass('active');
            });
            jQuery(this).addClass('active')
        });

        multiChoiceButtonsContainer.appendChild(multiChoiceButton);

        if (useGraphView && useGraphView === 'true') {
            var multiChoiceResponse = document.createElement('div');        
            multiChoiceResponse.classList.add('unofficialView', 'dataEntryMultiChoiceResponse');        
            multiChoiceResponse.setAttribute('data-index', i);        
            var multiChoiceResponseContent = document.createElement('div');        
            multiChoiceResponseContent.classList.add('dataEntryMultiChoiceResponseContent');        
            var multiChoiceResponseTextContainer = document.createElement('div');        
            multiChoiceResponseTextContainer.classList.add('dataEntryMultiChoiceResponseTextContainer');        
            var multiChoiceResponseText = document.createElement('span');        
            multiChoiceResponseText.textContent = form.responses[i];        
            multiChoiceResponseTextContainer.appendChild(multiChoiceResponseText);        
            var multiChoiceResponseGraphContainer = document.createElement('div');        
            multiChoiceResponseGraphContainer.classList.add('dataEntryMultiChoiceResponseGraphContainer');        
            var multiChoiceResponseGraphParentBar = document.createElement('div');        
            multiChoiceResponseGraphParentBar.classList.add('dataEntryMultiChoiceResponseGraphParentBar');        
            var multiChoiceResponseGraphFillBar = document.createElement('div');        
            multiChoiceResponseGraphFillBar.classList.add('dataEntryMultiChoiceResponseGraphFillBar');        
            multiChoiceResponseGraphParentBar.appendChild(multiChoiceResponseGraphFillBar);        
            multiChoiceResponseGraphContainer.appendChild(multiChoiceResponseGraphParentBar);        
            var multiChoiceResponseCount = document.createElement('span');        
            multiChoiceResponseCount.classList.add('dataEntryMultiChoiceResponseCount');        
                
            multiChoiceResponseContent.appendChild(multiChoiceResponseTextContainer);        
            multiChoiceResponseContent.appendChild(multiChoiceResponseGraphContainer);        
            multiChoiceResponseContent.appendChild(multiChoiceResponseCount);        
            multiChoiceResponse.appendChild(multiChoiceResponseContent);        
            multiChoiceResponseContainerGraph.appendChild(multiChoiceResponse);        

            // ---------------------------------

            var multiChoiceResponseTeam = document.createElement('div');
            multiChoiceResponseTeam.classList.add('teamView', 'dataEntryMultiChoiceResponse');
            multiChoiceResponseTeam.setAttribute('data-index', i);

            var multiChoiceResponseContentTeam = document.createElement('div');
            multiChoiceResponseContentTeam.classList.add('dataEntryMultiChoiceResponseContent');

            var multiChoiceResponseTextContainerTeam = document.createElement('div');
            multiChoiceResponseTextContainerTeam.classList.add('dataEntryMultiChoiceResponseTextContainer');

            var multiChoiceResponseTextTeam = document.createElement('span');
            multiChoiceResponseTextTeam.textContent = form.responses[i];

            multiChoiceResponseTextContainerTeam.appendChild(multiChoiceResponseTextTeam);

            var multiChoiceResponseGraphContainerTeam = document.createElement('div');
            multiChoiceResponseGraphContainerTeam.classList.add('dataEntryMultiChoiceResponseGraphContainer');

            var multiChoiceResponseGraphParentBarTeam = document.createElement('div');
            multiChoiceResponseGraphParentBarTeam.classList.add('dataEntryMultiChoiceResponseGraphParentBar');

            var multiChoiceResponseGraphFillBarTeam = document.createElement('div');
            multiChoiceResponseGraphFillBarTeam.classList.add('dataEntryMultiChoiceResponseGraphFillBar');

            multiChoiceResponseGraphParentBarTeam.appendChild(multiChoiceResponseGraphFillBarTeam);

            multiChoiceResponseGraphContainerTeam.appendChild(multiChoiceResponseGraphParentBarTeam);


            var multiChoiceResponseCountTeam = document.createElement('span');
            multiChoiceResponseCountTeam.classList.add('dataEntryMultiChoiceResponseCount');

            multiChoiceResponseContentTeam.appendChild(multiChoiceResponseTextContainerTeam);
            multiChoiceResponseContentTeam.appendChild(multiChoiceResponseGraphContainerTeam);
            multiChoiceResponseContentTeam.appendChild(multiChoiceResponseCountTeam);

            multiChoiceResponseTeam.appendChild(multiChoiceResponseContentTeam);

            multiChoiceTeamResponseContainerGraph.appendChild(multiChoiceResponseTeam);

            // ---------------------------------

            var multiChoiceResponseClass = document.createElement('div');
            multiChoiceResponseClass.classList.add('classView', 'dataEntryMultiChoiceResponse');
            multiChoiceResponseClass.setAttribute('data-index', i);

            var multiChoiceResponseContentClass = document.createElement('div');
            multiChoiceResponseContentClass.classList.add('dataEntryMultiChoiceResponseContent');

            var multiChoiceResponseTextContainerClass = document.createElement('div');
            multiChoiceResponseTextContainerClass.classList.add('dataEntryMultiChoiceResponseTextContainer');

            var multiChoiceResponseTextClass = document.createElement('span');
            multiChoiceResponseTextClass.textContent = form.responses[i];

            multiChoiceResponseTextContainerClass.appendChild(multiChoiceResponseTextClass);

            var multiChoiceResponseGraphContainerClass = document.createElement('div');
            multiChoiceResponseGraphContainerClass.classList.add('dataEntryMultiChoiceResponseGraphContainer');

            var multiChoiceResponseGraphParentBarClass = document.createElement('div');
            multiChoiceResponseGraphParentBarClass.classList.add('dataEntryMultiChoiceResponseGraphParentBar');

            var multiChoiceResponseGraphFillBarClass = document.createElement('div');
            multiChoiceResponseGraphFillBarClass.classList.add('dataEntryMultiChoiceResponseGraphFillBar');

            multiChoiceResponseGraphParentBarClass.appendChild(multiChoiceResponseGraphFillBarClass);

            multiChoiceResponseGraphContainerClass.appendChild(multiChoiceResponseGraphParentBarClass);


            var multiChoiceResponseCountClass = document.createElement('span');
            multiChoiceResponseCountClass.classList.add('dataEntryMultiChoiceResponseCount');

            multiChoiceResponseContentClass.appendChild(multiChoiceResponseTextContainerClass);
            multiChoiceResponseContentClass.appendChild(multiChoiceResponseGraphContainerClass);
            multiChoiceResponseContentClass.appendChild(multiChoiceResponseCountClass);

            multiChoiceResponseClass.appendChild(multiChoiceResponseContentClass);

            multiChoiceClassResponseContainerGraph.appendChild(multiChoiceResponseClass);
        }
    }

    multiChoiceContainer.appendChild(multiChoicePrompt);
    multiChoiceContainer.appendChild(multiChoiceButtonsContainer);
    multiChoiceContainer.appendChild(multiChoiceResponseContainer);
    multiChoiceContainer.appendChild(multiChoiceResponseContainerGraph);
    multiChoiceContainer.appendChild(multiChoiceTeamResponseContainerGraph);
    multiChoiceContainer.appendChild(multiChoiceClassResponseContainerGraph);
    multiChoiceContainer.appendChild(multiChoiceTeamResponseContainer);
    multiChoiceContainer.appendChild(multiChoiceClassResponseContainer);

    activeEntry.multiChoices.add(id);

    if (useGraphView && useGraphView === 'true') {
        var pollingInterval = function () {
            console.log('updating count');
            var totalCount = jQuery(multiChoiceResponseContainerGraph).find('.dataEntryMultiChoicePlaceholder').length;
            jQuery(multiChoiceResponseContainerGraph).children().each(function() {    
                var count = jQuery(this).children('.dataEntryMultiChoicePlaceholder').length;
                jQuery(this).find('.dataEntryMultiChoiceResponseCount').first().text(count);
                var width = count > 0 ? (count / totalCount) * 100 + '%' : '0%';
                jQuery(this).find('.dataEntryMultiChoiceResponseGraphFillBar').first().css('width', width);    
            });

            var totalCountTeam = jQuery(multiChoiceTeamResponseContainerGraph).find('.dataEntryMultiChoicePlaceholder').length;
            jQuery(multiChoiceTeamResponseContainerGraph).children().each(function () {
                var count = jQuery(this).children('.dataEntryMultiChoicePlaceholder').length;
                jQuery(this).find('.dataEntryMultiChoiceResponseCount').first().text(count);
                var width = count > 0 ? (count / totalCountTeam) * 100 + '%' : '0%';
                jQuery(this).find('.dataEntryMultiChoiceResponseGraphFillBar').first().css('width', width);
            });

            var totalCountClass = jQuery(multiChoiceClassResponseContainerGraph).find('.dataEntryMultiChoicePlaceholder').length;
            jQuery(multiChoiceClassResponseContainerGraph).children().each(function () {
                var count = jQuery(this).children('.dataEntryMultiChoicePlaceholder').length;
                jQuery(this).find('.dataEntryMultiChoiceResponseCount').first().text(count);
                var width = count > 0 ? (count / totalCountClass) * 100 + '%' : '0%';
                jQuery(this).find('.dataEntryMultiChoiceResponseGraphFillBar').first().css('width', width);
            });
        }

        //TODO: Do this better..
        window.updatePollingCount = setInterval(pollingInterval, 2000);
    }

    return multiChoiceContainer;
}

//Creates a textarea
dataEntry.createTextEntry = function (id, form, activeEntry) {
    var requiredString = '';
    if (form.required && form.required === 'true') {
        requiredString = 'required="required"';
    }

    var placeholderString = '';
    if (form.placeholder) {
        placeholderString = 'placeholder="' + form.placeholder + '"';
    }

    var cssClass = '';
    if (form.cssClass) {
        cssClass = form.cssClass;
    }

    var textResponses = jQuery('<div id="' + dataEntry.comboID(id, "responseBox") + '" class="textResponses unofficialView"><p class="dataEntryTextResponseNoData">Nothing has been submitted yet.</p></div>');
    var textOfficialResponses = jQuery('<div id="' + dataEntry.comboID(id, "responseBoxOfficial") + '" class="textResponses officialView"><p class="dataEntryTextResponseNoData">Nothing has been submitted yet.</p></div>');
    var textPrivateResponses = jQuery('<div id="' + dataEntry.comboID(id, "responseBoxPrivate") + '" class="textResponses privateView"><p class="dataEntryTextResponseNoData">Nothing has been submitted yet.</p></div>');
    var textTeamResponses = jQuery('<div id="' + dataEntry.comboID(id, "responseBoxTeam") + '" class="textResponses teamView"><p class="dataEntryTextResponseNoData">Nothing has been submitted yet.</p></div>');
    var textClassResponses = jQuery('<div id="' + dataEntry.comboID(id, "responseBoxClass") + '" class="textResponses classView"><p class="dataEntryTextResponseNoData">Nothing has been submitted yet.</p></div>');
    var textInput = jQuery('<div class="textInput ' + cssClass + '"><label id="textDetailText">' + form.prompt + '</label><textarea ' + placeholderString + ' class="edit" data-responseBoxClass="' + dataEntry.comboID(id, "responseBoxClass") + '" data-responseBoxTeam="' + dataEntry.comboID(id, "responseBoxTeam") + '" data-responseBoxPrivate="' + dataEntry.comboID(id, "responseBoxPrivate") + '" data-responseBoxOfficial="' + dataEntry.comboID(id, "responseBoxOfficial") + '" data-responseBox="' + dataEntry.comboID(id, "responseBox") + '" data-prompt="' + form.prompt + '" ' + requiredString + ' oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + id + '"></textarea></div>');
    var text = jQuery('<div class="textBox"></div>');
    text.append(textInput);
    text.append(textResponses);
    text.append(textOfficialResponses);
    text.append(textPrivateResponses);
    text.append(textTeamResponses);
    text.append(textClassResponses);

    //Add the id to the set, used when submitting
    activeEntry.textareas.add(id);

    return text;
}

//Creates a table of radio buttons
dataEntry.createRadioEntry = function (id, form, activeEntry) {
    var tableContainer = document.createElement('div');
    tableContainer.classList.add('dataEntryTableContainer');

    //If there is a prompt, add it
    if (form.prompt) {
        var tablePrompt = document.createElement('div');
        tablePrompt.classList.add('dataEntryTablePrompt');
        tablePrompt.innerHTML = form.prompt;

        tableContainer.appendChild(tablePrompt);
    }


    var table = document.createElement('table');
    //Add a class to the table of specified
    if (form.tableClass)
        table.classList.add(form.tableClass);

    //Add a header row to the table if specified
    if (form.tableHeader) {
        var tableHeader = document.createElement('thead');
        for (var j = 0; j < form.tableHeader.length; j++) {
            var th = document.createElement('th');
            th.textContent = form.tableHeader[j];
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
    }

    //Add each row to the table
    for (var k = 0; k < form.tableRows.length; k++) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        th.textContent = form.tableRows[k].rowHeader;
        tr.appendChild(th);
        //Add each input thats part of that row
        for (var l = 0; l < form.tableRows[k].inputs.length; l++) {
            var td = document.createElement('td');
            //Only radio buttons at this time
            if (form.tableRows[k].inputs[l].type === "radio") {
                var input = document.createElement('input');
                input.type = 'radio';
                input.classList.add('edit');
                input.setAttribute('prompt', form.tableRows[k].rowHeader);
                input.setAttribute('data-title', form.prompt)
                input.setAttribute('data-responseBox', dataEntry.comboID(id, 'table_radio', k, l, 'responseBox'));
                input.setAttribute('data-responseBoxOfficial', dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxOfficial'));
                input.setAttribute('data-responseBoxPrivate', dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxPrivate'));
                input.setAttribute('data-responseBoxTeam', dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxTeam'));
                input.setAttribute('data-responseBoxClass', dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxClass'));
                input.name = id + '_table_radio_' + k;
                input.value = form.tableRows[k].inputs[l].value;
                input.id = dataEntry.comboID(id, 'table_radio', k, l);
                if (form.required && form.required === 'true')
                    input.setAttribute("required", "required");
                input.oninvalid = dataEntry.invalidForm;
                //Add the radio group to the set, used when submitting.
                activeEntry.radios.add(input.name);

                //This is the viewmode container
                var responseBox = document.createElement('div');
                responseBox.classList.add('radioResponses', 'unofficialView');
                responseBox.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBox');

                //This is the official viewmode container
                var responseBoxOfficial = document.createElement('div');
                responseBoxOfficial.classList.add('radioResponses', 'officialView');
                responseBoxOfficial.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxOfficial');

                var responseBoxPrivate = document.createElement('div');
                responseBoxPrivate.classList.add('radioResponses', 'privateView');
                responseBoxPrivate.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxPrivate');

                var responseBoxTeam = document.createElement('div');
                responseBoxTeam.classList.add('radioResponses', 'teamView');
                responseBoxTeam.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxTeam');

                var responseBoxClass = document.createElement('div');
                responseBoxClass.classList.add('radioResponses', 'classView');
                responseBoxClass.id = dataEntry.comboID(id, 'table_radio', k, l, 'responseBoxClass');

                td.appendChild(input);
                td.appendChild(responseBox);
                td.appendChild(responseBoxOfficial);
                td.appendChild(responseBoxPrivate);
                td.appendChild(responseBoxTeam);
                td.appendChild(responseBoxClass);
            }
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);

    return tableContainer;
}

//Create a checkbox field
dataEntry.createCheckboxEntry = function (id, form, activeEntry) {
    var checkboxContainer = document.createElement('div');
    var checkboxWrapper = document.createElement('label');
    checkboxContainer.classList.add('dataEntryCheckboxContainer');
    checkboxWrapper.classList.add('dataEntryCheckboxWrapper');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = form.prompt;
    checkbox.id = id;
    checkbox.classList.add('edit');
    checkbox.setAttribute('data-responseBox', dataEntry.comboID(id, 'responseBox'));
    checkbox.setAttribute('data-responseBoxOfficial', dataEntry.comboID(id, 'responseBoxOfficial'));
    checkbox.setAttribute('data-responseBoxPrivate', dataEntry.comboID(id, 'responseBoxPrivate'));
    checkbox.setAttribute('data-responseBoxTeam', dataEntry.comboID(id, 'responseBoxTeam'));
    checkbox.setAttribute('data-responseBoxClass', dataEntry.comboID(id, 'responseBoxClass'));

    var checkMark = document.createElement('span');
    checkMark.classList.add('checkmark');
    //This is the viewmode container
    var checkboxResponseContainer = document.createElement('div');
    checkboxResponseContainer.classList.add('dataEntryCheckboxResponseContainer', 'unofficialView');
    checkboxResponseContainer.id = dataEntry.comboID(id, 'responseBox');

    //This is the official viewmode container
    var checkboxResponseContainerOfficial = document.createElement('div');
    checkboxResponseContainerOfficial.classList.add('dataEntryCheckboxResponseContainer', 'officialView');
    checkboxResponseContainerOfficial.id = dataEntry.comboID(id, 'responseBoxOfficial');

    var checkboxResponseContainerPrivate = document.createElement('div');
    checkboxResponseContainerPrivate.classList.add('dataEntryCheckboxResponseContainer', 'privateView');
    checkboxResponseContainerPrivate.id = dataEntry.comboID(id, 'responseBoxPrivate');

    var checkboxResponseContainerTeam = document.createElement('div');
    checkboxResponseContainerTeam.classList.add('dataEntryCheckboxResponseContainer', 'teamView');
    checkboxResponseContainerTeam.id = dataEntry.comboID(id, 'responseBoxTeam');

    var checkboxResponseContainerClass = document.createElement('div');
    checkboxResponseContainerClass.classList.add('dataEntryCheckboxResponseContainer', 'classView');
    checkboxResponseContainerClass.id = dataEntry.comboID(id, 'responseBoxClass');

    //Add the id to the set, used when submitting.
    activeEntry.checkboxes.add(id);

    //The text to the right of the checkbox
    var textSpan = document.createElement('span');
    textSpan.innerHTML = form.prompt;

    //If specified, add an additional text input after the text, which gets appended to the full text.
    if (form.input) {
        if (form.input.type === 'text') {
            var input = document.createElement('input');
            input.type = 'text';
            input.classList.add('edit');
            input.id = dataEntry.comboID(id, 'checkboxInput');
            input.placeholder = form.input.placeholder;
            //Add a linebreak if specified
            if (form.input.inline && form.input.inline === "false") {
                var br = document.createElement('br');
                textSpan.appendChild(br);
            }
            textSpan.appendChild(input);
            checkbox.setAttribute('data-moreInput', dataEntry.comboID(id, 'checkboxInput'));
        }
    }

    //If specified, clicking a checkbox opens a secondary form, related to that checkbox, that form is created here
    if (form.subForms) {
        (function (id) {
            var newSubFormDataEntry = {};
            dataEntry.activeEntries[dataEntry.comboID(id, 'subForm')] = newSubFormDataEntry;

            var subFormContainer = document.createElement('div');
            subFormContainer.classList.add('dataEntrySubFormCallout');
            subFormContainer.id = dataEntry.comboID(id, 'subForm');

            var subFormHeader = document.createElement('div');
            subFormHeader.classList.add('dataEntryHeader');

            var subFormElement = document.createElement('form');
            subFormElement.onsubmit = function () {
                return false;
            }

            var subFormPrompt = document.createElement('p');
            subFormPrompt.innerHTML = form.prompt;

            subFormElement.appendChild(subFormPrompt);

            subFormContainer.appendChild(subFormHeader);
            subFormContainer.appendChild(subFormElement);


            newSubFormDataEntry.textareas = new Set();

            for (var j = 0; j < form.subForms.length; j++) {
                if (form.subForms[j].type === 'text') {
                    var textResponses = jQuery('<div id="' + dataEntry.comboID(id, 'subForm', j, "responseBox") + '" class="textResponses unofficialView"><div><!--<a class="showMore">Show more...</a>--></div></div>');
                    var textInput = jQuery('<div class="textInput"><label id="textDetailText">' + form.subForms[j].prompt + '</label><textarea class="edit" data-responseBox="' + dataEntry.comboID(id, 'subForm', j, "responseBox") + '" data-prompt="' + form.subForms[j].prompt + '" required="required" oninvalid="globalPebl.extension.dataEntry.invalidForm();" id="' + dataEntry.comboID(id, 'subForm', j) + '"></textarea></div>');
                    var text = jQuery('<div class="textBox"></div>');
                    text.append(textInput);
                    text.append(textResponses);

                    jQuery(subFormElement).append(text);
                    textInput.slideDown();

                    newSubFormDataEntry.textareas.add(dataEntry.comboID(id, 'subForm', j));
                }
            }
            //toggle viewMode for this dataEntry
            newSubFormDataEntry.viewMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(subFormContainer).find('.edit').each(function () {
                        jQuery(this).hide();
                    });

                    jQuery(subFormContainer).find('.unofficialView').each(function () {
                        jQuery(this).show();
                    });

                    jQuery(subFormContainer).find('.officialView').each(function () {
                        jQuery(this).hide();
                    });

                    jQuery(subFormContainer).find('.dataEntryViewModeButton').each(function () {
                        jQuery(this).addClass('active');
                    });

                    jQuery(subFormContainer).find('.dataEntryEditModeButton').each(function () {
                        jQuery(this).removeClass('active');
                    });
                });
            }

            //toggle editMode for this dataEntry
            newSubFormDataEntry.editMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(subFormContainer).find('.edit').each(function () {
                        jQuery(this).show();
                    });

                    jQuery(subFormContainer).find('.unofficialView').each(function () {
                        jQuery(this).hide();
                    });

                    jQuery(subFormContainer).find('.officialView').each(function () {
                        jQuery(this).hide();
                    });

                    jQuery(subFormContainer).find('.dataEntryViewModeButton').each(function () {
                        jQuery(this).removeClass('active');
                    });

                    jQuery(subFormContainer).find('.dataEntryEditModeButton').each(function () {
                        jQuery(this).addClass('active');
                    });
                });
            }

            var viewModeButton = document.createElement('div');
            viewModeButton.classList.add('dataEntryViewModeButton');
            viewModeButton.addEventListener('click', function () {
                newSubFormDataEntry.viewMode();
            });

            var viewModeButtonIcon = document.createElement('span');
            viewModeButtonIcon.textContent = 'View';

            viewModeButton.appendChild(viewModeButtonIcon);

            var editModeButton = document.createElement('div');
            editModeButton.classList.add('dataEntryEditModeButton', 'active');
            editModeButton.addEventListener('click', function () {
                newSubFormDataEntry.editMode();
            });

            var editModeButtonIcon = document.createElement('span');
            editModeButtonIcon.textContent = 'Edit';

            editModeButton.appendChild(editModeButtonIcon);

            var closeButton = document.createElement('div');
            closeButton.classList.add('dataEntryCloseButton');
            closeButton.addEventListener('click', function () {
                jQuery(document.getElementById(dataEntry.comboID(id, 'subForm'))).hide();
            });

            var closeButtonIcon = document.createElement('i');
            closeButtonIcon.classList.add('fa', 'fa-times');

            closeButton.appendChild(closeButtonIcon);


            subFormHeader.appendChild(viewModeButton);
            subFormHeader.appendChild(editModeButton);
            subFormHeader.appendChild(closeButton);

            var messageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(id, 'subForm'));
            if (globalPebl)
                globalPebl.subscribeThread(dataEntry.comboID(id, 'subForm'), false, messageHandle);

            var formFooter = document.createElement('div');
            formFooter.classList.add('dataEntryFooter');

            var subFormSubmit = jQuery('<button class="dataEntryFormSubmit">Submit</button>');
            subFormSubmit.on('click', function () {
                dataEntry.invalidFormActive = false;
                var validForm = subFormElement.reportValidity();
                if (validForm) {
                    var messages = [];
                    //Submit the form
                    if (newSubFormDataEntry.textareas.size > 0) {
                        var subFormTextAreaArray = Array.from(newSubFormDataEntry.textareas);
                        for (var l = 0; l < subFormTextAreaArray.length; l++) {
                            var elem = document.getElementById(subFormTextAreaArray[l]);
                            var val = elem.value;
                            var prompt = elem.getAttribute('data-prompt');
                            var responseBox = elem.getAttribute('data-responseBox');
                            var message = {
                                "prompt": prompt,
                                "thread": subFormTextAreaArray[l],
                                "text": val,
                                "responseBox": responseBox,
                                "type": "text"
                            }
                            messages.push(message);
                        }
                    }

                    var finalMessage = {
                        "prompt": "DataEntry",
                        "thread": dataEntry.comboID(id, 'subForm'),
                        "text": JSON.stringify(messages)
                    }
                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    newSubFormDataEntry.viewMode();
                }
            });

            jQuery(formFooter).append(subFormSubmit);

            subFormElement.appendChild(formFooter);

            checkbox.addEventListener('click', function (evt) {
                if (evt.currentTarget.checked === true) {
                    console.log('checked');
                    jQuery(document.getElementById(dataEntry.comboID(id, 'subForm'))).show();
                } else {
                    console.log('not checked');
                }
            });

            document.body.appendChild(subFormContainer);
        })(id)

    }

    checkboxContainer.appendChild(checkboxWrapper);
    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(checkMark);
    checkboxWrapper.appendChild(textSpan);
    checkboxWrapper.appendChild(checkboxResponseContainer);
    checkboxWrapper.appendChild(checkboxResponseContainerOfficial);
    checkboxWrapper.appendChild(checkboxResponseContainerPrivate);
    checkboxWrapper.appendChild(checkboxResponseContainerTeam);
    checkboxWrapper.appendChild(checkboxResponseContainerClass);

    return checkboxContainer;
}

//Alerts the user to fill out all required fields in the form
dataEntry.invalidForm = function () {
    if (!dataEntry.invalidFormActive) {
        dataEntry.invalidFormActive = true;
        window.alert('Fill out the entire form');
    }
}

dataEntry.createDataEntry = function (insertID, question, id, forms, sharing, displayMode, polling, useConfig) {
    var programID = null;
    if (window.parent.extensionDashboard && window.parent.extensionDashboard.programID)
        programID = window.parent.extensionDashboard.programID;

    var makeDataEntry = function(insertID, question, id, forms, sharing, displayMode, polling, useConfig, userProfile, programID, group) {
        var dataEntryID;
            var variableSharing = false;
            // var learnletLevel = dataEntry.getLearnletLevel(document.body.id);
            // var learnlet = dataEntry.getLearnlet(document.body.id);
            // var learnletTitle = dataEntry.getLearnletTitle();

            //Thread is either group + id, user + id, or id
            if (sharing === 'team') {
                if (group) {
                    dataEntryID = dataEntry.comboID(group.membershipId, id);
                } else {
                    //User did not use the dashboard to launch the learnlet
                    dataEntryID = id;
                    window.alert('This activity requires you to be part of a team. Consider relaunching this learnlet through the dashboard.');
                }
            } else if (sharing === 'private') {
                dataEntryID = dataEntry.comboID(userProfile.identity, id);
            } else if (sharing === 'variable') {
                dataEntryID = id;
                //Handle it later...
                variableSharing = true;
            } else {
                dataEntryID = id;
            }

            var newDataEntry = {};
            dataEntry.activeEntries[id] = newDataEntry;

            var dataEntryWrapper = document.createElement('div');
            dataEntryWrapper.classList.add('dataEntryWrapper');

            var dataEntryCfiPlaceholderStart = document.createElement('p');
            dataEntryCfiPlaceholderStart.textContent = 'CFI';
            dataEntryCfiPlaceholderStart.classList.add('dataEntryCfiPlaceholder');
            dataEntryWrapper.appendChild(dataEntryCfiPlaceholderStart);

            var calloutDiv = document.createElement('div');
            calloutDiv.classList.add('dataEntryCallout');

            dataEntryWrapper.appendChild(calloutDiv);

            var dataEntryCfiPlaceholderEnd = document.createElement('p');
            dataEntryCfiPlaceholderEnd.textContent = 'CFI';
            dataEntryCfiPlaceholderEnd.classList.add('dataEntryCfiPlaceholder');
            dataEntryWrapper.appendChild(dataEntryCfiPlaceholderEnd);

            var header = document.createElement('div');
            header.classList.add('dataEntryHeader');



            var formElement = document.createElement('form');
            //Prevent default form submit
            formElement.onsubmit = function () {
                return false;
            }


            var questionParagraph = document.createElement('p');
            questionParagraph.classList.add('edit');
            questionParagraph.innerHTML = question;
            if (!question) {
                questionParagraph.style.display = 'none';
            }

            var teamViewParagraph = document.createElement('p');
            teamViewParagraph.classList.add('teamView');
            teamViewParagraph.textContent = 'View your team‘s responses below for this activity.';

            var classViewParagraph = document.createElement('p');
            classViewParagraph.classList.add('classView');
            classViewParagraph.textContent = 'View responses from the class below for this activity.';

            formElement.appendChild(questionParagraph);
            if (variableSharing) {
                formElement.appendChild(teamViewParagraph);
                formElement.appendChild(classViewParagraph);
            }

            //Keep track of textareas and radio buttons that get added
            newDataEntry.textareas = new Set();
            newDataEntry.radios = new Set();
            newDataEntry.checkboxes = new Set();
            newDataEntry.multiChoices = new Set();
            newDataEntry.dropdowns = new Set();

            for (var i = 0; i < forms.length; i++) {
                var subID = dataEntry.comboID(dataEntryID, i);
                //Create textarea fields
                if (forms[i].type === 'text') {
                    jQuery(formElement).append(dataEntry.createTextEntry(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'table') {
                    //Create table fields
                    formElement.appendChild(dataEntry.createRadioEntry(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'checkbox') {
                    formElement.appendChild(dataEntry.createCheckboxEntry(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'header') {
                    formElement.appendChild(dataEntry.createHeader(subID, forms[i], newDataEntry));
                } else if (forms[i].type === 'multipleChoice') {
                    formElement.appendChild(dataEntry.createMultipleChoiceEntry(subID, forms[i], newDataEntry, polling));
                } else if (forms[i].type === 'dropdown') {
                    formElement.appendChild(dataEntry.createDropdownEntry(subID, forms[i], newDataEntry));
                }
            }



            var formFooter = document.createElement('div');
            formFooter.classList.add('dataEntryFooter');

            //Submit the marked responses as the official submission, only visible to team leader in view tab.
            var submitMarkedResponsesOfficial = jQuery('<button class="dataEntryFormSubmitOfficial unofficialView">Make it Official</button>');
            submitMarkedResponsesOfficial.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, 'Official', true);

                if (message != null) {
                    //Submit the official version
                    var finalMessage = {
                        "prompt": "DataEntryOfficial",
                        "thread": dataEntry.comboID(dataEntryID, 'Official'),
                        "text": JSON.stringify(message)
                    }
                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    //TODO: Use a different xapi statement for this
                    if (group) {
                        var artifactPrompt = {
                            "prompt": question,
                            "learnlet": learnlet,
                            "learnletTitle": learnletTitle
                        }
                        var artifactMessage = {
                            "prompt": JSON.stringify(artifactPrompt),
                            "thread": dataEntry.comboID(group.membershipId, learnletLevel),
                            "text": JSON.stringify(message)
                        }

                        if (globalPebl)
                            globalPebl.emitEvent(globalPebl.events.newMessage,
                                artifactMessage);
                    }

                    // If useConfig is true, call the function defined in the config
                    if (useConfig && useConfig === 'true') {
                        if (globalPebl && globalPebl.extension.config && globalPebl.extension.config.dataEntry) {
                            var dataEntryConfig = globalPebl.extension.config.dataEntry;
                            if (dataEntryConfig.onSubmitOfficial && typeof dataEntryConfig.onSubmitOfficial === 'function') {
                                dataEntryConfig.onSubmitOfficial();
                            }
                        }
                    }

                    newDataEntry.officialMode();
                }
            });

            var formSubmitOfficial = jQuery('<button class="dataEntryFormSubmitOfficial edit">Make it Official</button>');
            formSubmitOfficial.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, 'Official');

                if (message != null) {
                    //Submit the official version
                    var finalMessage = {
                        "prompt": "DataEntryOfficial",
                        "thread": dataEntry.comboID(dataEntryID, 'Official'),
                        "text": JSON.stringify(message)
                    }

                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    //TODO: Use a different xapi statement for this
                    if (group) {
                        var artifactPrompt = {
                            "prompt": question,
                            "learnlet": learnlet,
                            "learnletTitle": learnletTitle
                        }
                        var artifactMessage = {
                            "prompt": JSON.stringify(artifactPrompt),
                            "thread": dataEntry.comboID(group.membershipId, learnletLevel),
                            "text": JSON.stringify(message)
                        }

                        if (globalPebl)
                            globalPebl.emitEvent(globalPebl.events.newMessage,
                                artifactMessage);
                    }

                    // If useConfig is true, call the function defined in the config
                    if (useConfig && useConfig === 'true') {
                        if (globalPebl && globalPebl.extension.config && globalPebl.extension.config.dataEntry) {
                            var dataEntryConfig = globalPebl.extension.config.dataEntry;
                            if (dataEntryConfig.onSubmitOfficial && typeof dataEntryConfig.onSubmitOfficial === 'function') {
                                dataEntryConfig.onSubmitOfficial();
                            }
                        }
                    }

                    newDataEntry.officialMode();
                }
            });

            var formSubmit = jQuery('<button class="dataEntryFormSubmit edit">Submit</button>');
            formSubmit.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, '');

                if (message != null) {
                    var finalMessage = {
                        "prompt": "DataEntry",
                        "thread": dataEntryID,
                        "text": JSON.stringify(message)
                    }

                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    // If useConfig is true, call the function defined in the config
                    if (useConfig && useConfig === 'true') {
                        if (globalPebl && globalPebl.extension.config && globalPebl.extension.config.dataEntry) {
                            var dataEntryConfig = globalPebl.extension.config.dataEntry;
                            if (dataEntryConfig.onSubmit && typeof dataEntryConfig.onSubmit === 'function') {
                                dataEntryConfig.onSubmit();
                            }
                        }
                    }

                    newDataEntry.viewMode();
                }
            });

            var variableFormSubmitPrivate = jQuery('<button class="edit">Submit Privately</button>');
            variableFormSubmitPrivate.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, 'Private');

                if (message != null) {
                    var finalMessage = {
                        "prompt": "PrivateDataEntry",
                        "thread": dataEntry.comboID(userProfile.identity, dataEntryID),
                        "text": JSON.stringify(message)
                    }
                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    newDataEntry.privateViewMode();
                }
            });

            var variableFormSubmitTeam = jQuery('<button class="edit">Submit to Team</button>');
            variableFormSubmitTeam.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, 'Team');

                if (message != null) {
                    var finalMessage = {
                        "prompt": "TeamDataEntry",
                        "thread": dataEntry.comboID(userProfile.currentClass, userProfile.currentTeam, dataEntryID),
                        "text": JSON.stringify(message)
                    }

                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    newDataEntry.teamViewMode();
                }
            });

            var variableFormSubmitClass = jQuery('<button class="edit">Submit to Class</button>');
            variableFormSubmitClass.on('click', function () {
                var message = dataEntry.getFormData(formElement, newDataEntry, 'Class');

                if (message != null) {
                    var finalMessage = {
                        "prompt": "ClassDataEntry",
                        "thread": dataEntry.comboID(userProfile.currentClass, dataEntryID),
                        "text": JSON.stringify(message)
                    }

                    if (globalPebl)
                        globalPebl.emitEvent(globalPebl.events.newMessage,
                            finalMessage);

                    newDataEntry.classViewMode();
                }
            });

            newDataEntry.privateViewMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).addClass('privateViewMode');
                    jQuery(calloutDiv).removeClass('teamViewMode');
                    jQuery(calloutDiv).removeClass('classViewMode');
                    jQuery(calloutDiv).removeClass('editMode');
                });
            }

            newDataEntry.teamViewMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).addClass('teamViewMode');
                    jQuery(calloutDiv).removeClass('privateViewMode');
                    jQuery(calloutDiv).removeClass('classViewMode');
                    jQuery(calloutDiv).removeClass('editMode');
                });
            }

            newDataEntry.classViewMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).addClass('classViewMode');
                    jQuery(calloutDiv).removeClass('teamViewMode');
                    jQuery(calloutDiv).removeClass('privateViewMode');
                    jQuery(calloutDiv).removeClass('editMode');
                });
            }

            newDataEntry.officialMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).addClass('officialViewMode');
                    jQuery(calloutDiv).removeClass('unofficialViewMode');
                    jQuery(calloutDiv).removeClass('editMode');
                });
            }

            //toggle viewMode for this dataEntry
            newDataEntry.viewMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).removeClass('officialViewMode');
                    jQuery(calloutDiv).addClass('unofficialViewMode');
                    jQuery(calloutDiv).removeClass('editMode');
                });
            }

            //toggle editMode for this dataEntry
            newDataEntry.editMode = function () {
                dataEntry.handleResize(function () {
                    jQuery(calloutDiv).removeClass('officialViewMode');
                    jQuery(calloutDiv).removeClass('unofficialViewMode');
                    jQuery(calloutDiv).removeClass('privateViewMode');
                    jQuery(calloutDiv).removeClass('teamViewMode');
                    jQuery(calloutDiv).removeClass('classViewMode');
                    jQuery(calloutDiv).addClass('editMode');
                });
            }

            // Poll and set the view of the data entry widget, only if its out of view of the user, otherwise it would be annoying having it switch views while using it
            // newDataEntry.setInitialView = setInterval(function() {
            //     if (!dataEntry.isElementInViewport(calloutDiv)) {
            //         if ((sharing === 'team' && group) && jQuery(calloutDiv).find('.officialView').children().not('.placeholder').not('.dataEntryTextResponseNoData').length > 0)
            //             newDataEntry.officialMode();
            //         else if (jQuery(calloutDiv).find('.unofficialView').children('[data-user="' + userProfile.identity + '"]').not('.placeholder').length > 0)
            //             newDataEntry.viewMode();
            //         else if (!displayMode || displayMode !== 'viewOnly')
            //             newDataEntry.editMode();
            //     }
            // }, 5000);

            var closeButton = document.createElement('div');
            closeButton.classList.add('dataEntryCloseButton');
            closeButton.addEventListener('click', function () {
                jQuery(calloutDiv).parent().remove();
                clearInterval(window.updatePollingCount);
            });

            closeButtonIcon = document.createElement('i');
            closeButtonIcon.classList.add('fa', 'fa-times');
            closeButton.appendChild(closeButtonIcon);

            var privateViewModeButton = document.createElement('div');
            privateViewModeButton.classList.add('dataEntryPrivateViewModeButton');
            privateViewModeButton.addEventListener('click', function () {
                newDataEntry.privateViewMode();
            });

            var privateViewModeButtonIcon = document.createElement('span');
            privateViewModeButtonIcon.textContent = 'View Private';
            privateViewModeButton.appendChild(privateViewModeButtonIcon);

            var teamViewModeButton = document.createElement('div');
            teamViewModeButton.classList.add('dataEntryTeamViewModeButton');
            teamViewModeButton.addEventListener('click', function () {
                newDataEntry.teamViewMode();
            });

            var teamViewModeButtonIcon = document.createElement('span');
            teamViewModeButtonIcon.textContent = 'View Team';
            teamViewModeButton.appendChild(teamViewModeButtonIcon);

            var classViewModeButton = document.createElement('div');
            classViewModeButton.classList.add('dataEntryClassViewModeButton');
            classViewModeButton.addEventListener('click', function () {
                newDataEntry.classViewMode();
            });

            var classViewModeButtonIcon = document.createElement('span');
            classViewModeButtonIcon.textContent = 'View Class';
            classViewModeButton.appendChild(classViewModeButtonIcon);

            var viewModeButton = document.createElement('div');
            viewModeButton.classList.add('dataEntryViewModeButton');
            viewModeButton.addEventListener('click', function () {
                newDataEntry.viewMode();
            });

            var viewModeButtonIcon = document.createElement('span');
            viewModeButtonIcon.textContent = 'View';

            viewModeButton.appendChild(viewModeButtonIcon);

            var editModeButton = document.createElement('div');
            editModeButton.classList.add('dataEntryEditModeButton');
            editModeButton.addEventListener('click', function () {
                newDataEntry.editMode();
            });

            var editModeButtonIcon = document.createElement('span');
            editModeButtonIcon.textContent = 'Edit';

            editModeButton.appendChild(editModeButtonIcon);

            var officialModeButton = document.createElement('div');
            officialModeButton.classList.add('dataEntryOfficialModeButton');
            officialModeButton.addEventListener('click', function () {
                newDataEntry.officialMode();
            });

            var officialModeButtonIcon = document.createElement('span');
            officialModeButtonIcon.textContent = 'Official';

            officialModeButton.appendChild(officialModeButtonIcon);





            //If viewmode is set to viewOnly, don't show the edit mode button
            if (!displayMode || displayMode !== 'viewOnly')
                header.appendChild(editModeButton);

            if (variableSharing) {
                //header.appendChild(privateViewModeButton);
                if (userProfile.currentTeam)
                    header.appendChild(teamViewModeButton);

                if (userProfile.currentClass)
                    header.appendChild(classViewModeButton);

                //jQuery(formFooter).append(variableFormSubmitPrivate);
                if (userProfile.currentTeam)
                    jQuery(formFooter).append(variableFormSubmitTeam);

                if (userProfile.currentClass)
                    jQuery(formFooter).append(variableFormSubmitClass);

                // var privateMessageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(userProfile.identity, dataEntryID));
                // globalPebl.subscribeThread(dataEntry.comboID(userProfile.identity, dataEntryID), false, privateMessageHandle);

                if (userProfile.currentTeam) {
                    var teamMessageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(userProfile.currentClass, userProfile.currentTeam, dataEntryID));
                    if (globalPebl)
                        globalPebl.subscribeThread(dataEntry.comboID(userProfile.currentClass, userProfile.currentTeam, dataEntryID), false, teamMessageHandle);
                }

                if (userProfile.currentClass) {
                    var classMessageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(userProfile.currentClass, dataEntryID));
                    if (globalPebl)
                        globalPebl.subscribeThread(dataEntry.comboID(userProfile.currentClass, dataEntryID), false, classMessageHandle);
                }
            } else {
                header.appendChild(viewModeButton);

                jQuery(formFooter).append(formSubmit);

                var messageHandle = dataEntry.dataMessageHandler(dataEntryID);
                if (globalPebl)
                    globalPebl.subscribeThread(dataEntryID, false, messageHandle);

                //Assuming we use the discussion mechanism for official submissions, will probably change later.
                var officialMessageHandle = dataEntry.dataMessageHandler(dataEntry.comboID(dataEntryID, 'Official'));
                if (globalPebl)
                    globalPebl.subscribeThread(dataEntry.comboID(dataEntryID, 'Official'), false, officialMessageHandle);
            }


            //If sharing is set to team and not in standalone mode, show the official submit / view buttons
            if (sharing === 'team' && group) {
                header.appendChild(officialModeButton);
                //TODO: Use the specific permission that lets you make official submissions
                if (group.role === 'owner') {
                    jQuery(formFooter).append(formSubmitOfficial);
                    // Don't show the inline make official in viewOnly mode
                    if (!displayMode || displayMode !== 'viewOnly') {
                        jQuery(formFooter).append(submitMarkedResponsesOfficial);
                        jQuery(formElement).addClass('showInlineMakeOfficial');
                    }
                }
            }

            // if (polling && polling === 'true')
            //     header.appendChild(closeButton);

            calloutDiv.appendChild(formElement);
            calloutDiv.appendChild(header);
            calloutDiv.appendChild(formFooter);

            var insertLocation = document.getElementById(insertID);

            insertLocation.parentNode.insertBefore(dataEntryWrapper, insertLocation);
            insertLocation.remove();


            //Do not add the will-change: transform fix when in safari, it doesn't need it and it breaks the rendering when not scrollable
            if (!(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)))
                formElement.classList.add('fixScrolling');

            //Put the dataEntry into viewmode if specified.
            if (displayMode && displayMode === 'viewOnly')
                newDataEntry.viewMode();
            else
                newDataEntry.editMode();
    }

    // Render it when no globalPebl present
    if (!globalPebl)
        makeDataEntry(insertID, question, id, forms, sharing, displayMode, polling, useConfig, null, null, null);
    else
        globalPebl.user.getUser(function(userProfile) {
            globalPebl.utils.getSpecificGroupMembership(programID, function(group) {
                makeDataEntry(insertID, question, id, forms, sharing, displayMode, polling, useConfig, userProfile, programID, group);
            });
        });
}

dataEntry.dropdownMessageHandler = function (message, userProfile) {
    console.log('dropdown');
    console.log(message);

}

dataEntry.multiChoiceMessageHandler = function (message, userProfile) {
    var mine = userProfile.name == message.name;
    console.log(message);

    var hiddenPlaceholder = document.createElement('span');
    hiddenPlaceholder.style.display = 'none';
    hiddenPlaceholder.id = dataEntry.comboID(message.name, message.thread);
    hiddenPlaceholder.setAttribute('data-timestamp', message.timestamp);
    hiddenPlaceholder.setAttribute('data-user', message.name);
    hiddenPlaceholder.classList.add('dataEntryMultiChoicePlaceholder');

    var responseBox = document.getElementById(message.responseBox);
    var specificResponseBox = jQuery(responseBox).find('div[data-index="' + message.index + '"]')[0];

    var existingMessage = responseBox.querySelector('[id="' + dataEntry.comboID(message.name, message.thread) + '"]');
    if (existingMessage) {
        var newTimestamp = new Date(message.timestamp);
        var oldTimestamp = new Date(existingMessage.getAttribute('data-timestamp'));
        if (newTimestamp > oldTimestamp) {
            jQuery(existingMessage).remove();
            jQuery(specificResponseBox).prepend(hiddenPlaceholder);
        } else {
            //Don't add it
        }
    } else {
        jQuery(specificResponseBox).prepend(hiddenPlaceholder);
    }
}

//Message handler for standard textarea messages
dataEntry.messageHandler = function (message, userProfile) {
    var mine = userProfile.name == message.name;
    var userIcon = document.createElement('i');
    userIcon.classList.add('fa', 'fa-user');
    var userIdBox = jQuery('<span class="userId"></span>');
    var userName = message.name;
    if (message.originalUser)
        userName += ' via ' + message.originalUser;
    userIdBox.text(userName);
    var timestampBox = jQuery('<span class="timestamp"></span>');
    timestampBox.text(new Date(message.timestamp).toLocaleString());
    var textBox = jQuery('<p class="message"></p>');
    textBox.text(message.text);
    var messageContainer = jQuery('<div data-user="' + message.name + '" data-timestamp="' + message.timestamp + '" id="' + dataEntry.comboID(message.name, message.thread) + '" class="' + (mine ? "your " : "") + 'response"></div>');
    if (message.text === '') {
        messageContainer.css('display', 'none');
        messageContainer[0].classList.add('placeholder');
    }

    var makeOfficialWrapper = document.createElement('div');
    makeOfficialWrapper.classList.add('unofficialView');
    var makeOfficialContainer = document.createElement('div');
    makeOfficialContainer.classList.add('inlineMakeOfficialContainer');

    var makeOfficialSpan = document.createElement('span');
    makeOfficialSpan.textContent = 'Official';

    var makeOfficialButton = document.createElement('input');
    makeOfficialButton.type = 'radio';
    makeOfficialButton.name = message.thread;
    makeOfficialButton.setAttribute('data-type', 'text');
    makeOfficialButton.setAttribute('data-message', message.text);
    makeOfficialButton.setAttribute('data-prompt', message.prompt);
    makeOfficialButton.setAttribute('data-responseBoxOfficial', message.responseBox + 'Official');
    makeOfficialButton.setAttribute('data-user', message.name);

    makeOfficialContainer.appendChild(makeOfficialButton);
    makeOfficialContainer.appendChild(makeOfficialSpan);

    makeOfficialWrapper.appendChild(makeOfficialContainer);

    messageContainer.append(jQuery(userIcon));
    messageContainer.append(userIdBox);
    messageContainer.append(timestampBox);
    messageContainer.append(textBox);
    messageContainer.append(makeOfficialWrapper);

    var responseBox = document.getElementById(message.responseBox);

    //Only show latest submission for each user
    if (responseBox) {
        var existingMessage = responseBox.querySelector('[id="' + dataEntry.comboID(message.name, message.thread) + '"]');
        if (existingMessage) {
            var newTimestamp = new Date(message.timestamp);
            var oldTimestamp = new Date(existingMessage.getAttribute('data-timestamp'));
            //Replace the existing message with the newer one
            if (newTimestamp > oldTimestamp) {
                jQuery(existingMessage).remove();
                jQuery(responseBox).prepend(messageContainer);
            } else {
                //Don't add it
            }
        } else {
            jQuery(responseBox).prepend(messageContainer);
        }
    }
}

dataEntry.checkboxMessageHandler = function (message, userProfile) {
    var mine = userProfile.name == message.name;
    var checkbox = document.getElementById(message.thread);
    var responseBox = document.getElementById(message.responseBox);
    var text = message.text;
    var userName = message.name;
    if (message.originalUser)
        userName += ' via ' + message.originalUser;
    //Additional input after the checkbox
    var temp = text.replace(message.prompt, '');
    //Fill the checkboxes for the user with current data
    if (mine) {
        if (!checkbox.hasAttribute('data-timestamp')) {
            //Not checked
            if (text === '') {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
                if (temp.length > 0)
                    document.getElementById(checkbox.getAttribute('data-moreInput')).value = temp;
            }
            checkbox.setAttribute('data-timestamp', message.timestamp);
        } else {
            var oldTimestamp = checkbox.getAttribute('data-timestamp');
            var newTimestamp = message.timestamp;
            if (new Date(newTimestamp) > new Date(oldTimestamp)) {
                if (text === '') {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                    if (temp.length > 0)
                        document.getElementById(checkbox.getAttribute('data-moreInput')).value = temp;
                }
                checkbox.setAttribute('data-timestamp', message.timestamp);
            } else {
                //don't update the checkbox
            }
        }
    }

    //Populate the viewmode list

    var userIcon = document.createElement('i');
    userIcon.classList.add('fa', 'fa-user');
    var userIdBox = jQuery('<span class="userId"></span>');
    var userName = message.name;
    if (message.originalUser)
        userName += ' via ' + message.originalUser;
    userIdBox.text(userName);
    var timestampBox = jQuery('<span class="timestamp"></span>');
    timestampBox.text(new Date(message.timestamp).toLocaleString());
    var textBox = jQuery('<p class="message"></p>');
    var messageContainer = jQuery('<div data-user="' + message.name + '" data-timestamp="' + message.timestamp + '" id="' + dataEntry.comboID(message.thread, message.name) + '" class="' + (mine ? "your " : "") + 'response"></div>');

    var makeOfficialWrapper = document.createElement('div');
    makeOfficialWrapper.classList.add('unofficialView');
    var makeOfficialContainer = document.createElement('div');
    makeOfficialContainer.classList.add('inlineMakeOfficialContainer');

    var makeOfficialSpan = document.createElement('span');
    makeOfficialSpan.textContent = 'Official';

    var makeOfficialButton = document.createElement('input');
    makeOfficialButton.type = 'radio';
    makeOfficialButton.name = message.thread;
    makeOfficialButton.setAttribute('data-type', 'checkbox');
    makeOfficialButton.setAttribute('data-message', message.text);
    makeOfficialButton.setAttribute('data-prompt', message.prompt);
    makeOfficialButton.setAttribute('data-responseBoxOfficial', message.responseBox + 'Official');
    makeOfficialButton.setAttribute('data-user', message.name);

    makeOfficialContainer.appendChild(makeOfficialButton);
    makeOfficialContainer.appendChild(makeOfficialSpan);

    makeOfficialWrapper.appendChild(makeOfficialContainer);

    if (temp.length > 0)
        textBox.text(temp);

    messageContainer.append(jQuery(userIcon));
    messageContainer.append(userIdBox);
    messageContainer.append(timestampBox);
    messageContainer.append(textBox);
    messageContainer.append(makeOfficialWrapper);

    var elem = responseBox.querySelector('[id="' + dataEntry.comboID(message.thread, message.name) + '"]');
    //If it already exists
    if (elem) {
        var oldTimestamp = elem.getAttribute('data-timestamp');
        var newTimestamp = message.timestamp;
        if (new Date(newTimestamp) > new Date(oldTimestamp)) {
            //This is more recent, remove the old one
            jQuery(elem).remove();
            if (text === '') {
                messageContainer.css('display', 'none');
                messageContainer[0].classList.add('placeholder');
            }
            jQuery(responseBox).append(messageContainer);
        } else {
            //This is an old message, do nothing
        }
    } else {
        if (text === '') {
            messageContainer.css('display', 'none');
            messageContainer[0].classList.add('placeholder');
        }
        jQuery(responseBox).append(messageContainer);
    }
}

//Message handler for radio button messages
dataEntry.radioMessageHandler = function (message, userProfile) {
    var mine = userProfile.name == message.name;

    var makeOfficialWrapper = document.createElement('div');
    makeOfficialWrapper.classList.add('unofficialView');
    var makeOfficialContainer = document.createElement('div');
    makeOfficialContainer.classList.add('inlineMakeOfficialContainer');

    var makeOfficialSpan = document.createElement('span');
    makeOfficialSpan.textContent = 'Official';

    var makeOfficialButton = document.createElement('input');
    makeOfficialButton.type = 'radio';
    makeOfficialButton.name = message.thread + 'Official';
    makeOfficialButton.setAttribute('data-type', 'radio');
    makeOfficialButton.setAttribute('data-message', message.text);
    makeOfficialButton.setAttribute('data-prompt', message.prompt);
    makeOfficialButton.setAttribute('data-responseBoxOfficial', message.responseBox + 'Official');
    makeOfficialButton.setAttribute('data-user', message.name);
    makeOfficialButton.setAttribute('data-title', message.title);

    makeOfficialContainer.appendChild(makeOfficialButton);
    makeOfficialContainer.appendChild(makeOfficialSpan);

    makeOfficialWrapper.appendChild(makeOfficialContainer);

    var messageContainer = document.createElement('div');
    messageContainer.setAttribute('data-id', dataEntry.comboID(message.thread, message.name));
    messageContainer.setAttribute('data-timestamp', message.timestamp);
    messageContainer.setAttribute('data-user', message.name);
    var messageSpan = document.createElement('span');
    messageSpan.textContent = message.name;
    if (message.originalUser)
        messageSpan.textContent += ' via ' + message.originalUser;

    var responseBox = document.getElementById(message.responseBox);
    var elem = document.querySelector('[data-id="' + dataEntry.comboID(message.thread, message.name) + '"]');

    messageContainer.appendChild(messageSpan);
    messageContainer.appendChild(makeOfficialWrapper);
    if (elem) {
        var oldTimestamp = elem.getAttribute('data-timestamp');
        var newTimestamp = message.timestamp;
        if (new Date(newTimestamp) > new Date(oldTimestamp)) {
            jQuery(elem).remove();
            jQuery(responseBox).append(messageContainer);
        } else {
            //don't add it
        }
    } else {
        jQuery(responseBox).append(messageContainer);
    }
}

//Get the Combined Messages and hand them off to specific handlers
dataEntry.dataMessageHandler = function (thread) {
    return function (newMessages) {
        newMessages.sort(dataEntry.sortMessages);
        console.log(newMessages);
        globalPebl.user.getUser(function (userProfile) {
            if (userProfile) {
                for (var i = 0; i < newMessages.length; i++) {
                    var message = newMessages[i];
                    var messageArray = JSON.parse(message.text);
                    for (var j = 0; j < messageArray.length; j++) {
                        var embeddedMessage = messageArray[j];
                        embeddedMessage.timestamp = message.timestamp;
                        embeddedMessage.id = dataEntry.comboID(message.id, embeddedMessage.thread);
                        embeddedMessage.name = message.name;
                        if (embeddedMessage.type === 'text') {
                            dataEntry.messageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'radio') {
                            dataEntry.radioMessageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'checkbox') {
                            dataEntry.checkboxMessageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'multipleChoice') {
                            if (embeddedMessage.useGraphView === 'true')
                                dataEntry.multiChoiceMessageHandler(embeddedMessage, userProfile);
                            else
                                dataEntry.messageHandler(embeddedMessage, userProfile);
                        } else if (embeddedMessage.type === 'dropdown') {
                            dataEntry.messageHandler(embeddedMessage, userProfile);
                        }
                    }
                }
            }
        });
    }
}

dataEntry.getFormData = function (formElement, newDataEntry, responseType, getMarkedResponses) {
    dataEntry.invalidFormActive = false;
    // Get text from the marked responses instead of the form
    if (getMarkedResponses) {
        var messages = [];

        jQuery(formElement).find('.inlineMakeOfficialContainer input[type="radio"]:checked').each(function () {
            var type = this.getAttribute('data-type');
            if (type === 'text') {
                var val = this.getAttribute('data-message');
                var prompt = this.getAttribute('data-prompt');
                var responseBox = this.getAttribute('data-responseBox' + responseType);
                var thread = this.name;
                var originalUser = this.getAttribute('data-user');
                var message = {
                    "prompt": prompt,
                    "thread": thread,
                    "text": val,
                    "responseBox": responseBox,
                    "type": type,
                    "originalUser": originalUser
                }
                messages.push(message);
            } else if (type === 'checkbox') {
                var prompt = this.getAttribute('data-prompt');
                var thread = this.name;
                var responseBox = this.getAttribute('data-responseBox' + responseType);
                var originalUser = this.getAttribute('data-user');
                var text;
                //Content of the message is the value of the checkbox + any additional input if specified.
                if (this.hasAttribute('data-moreInput'))
                    text = prompt + this.getAttribute('data-moreInput');
                else
                    text = prompt;

                var message = {
                    "prompt": prompt,
                    "thread": thread,
                    "text": text,
                    "responseBox": responseBox,
                    "type": type,
                    "originalUser": originalUser
                };
                messages.push(message);
            } else if (type === 'radio') {
                var prompt = this.getAttribute('data-prompt');
                var text = this.getAttribute('data-message');
                var thread = this.name;
                var responseBox = this.getAttribute('data-responseBox' + responseType);
                var originalUser = this.getAttribute('data-user');
                var title = this.getAttribute('data-title');
                var message = {
                    "prompt": prompt,
                    "thread": thread,
                    "text": text,
                    "responseBox": responseBox,
                    "type": "radio",
                    "title": title,
                    "originalUser": originalUser
                };
                messages.push(message);
            }
        });

        return messages;
    } else {
        //Check if all required inputs have been completed
        var validForm = formElement.reportValidity();
        if (validForm) {
            var messages = [];
            //Submit the form
            if (newDataEntry.dropdowns.size > 0) {
                var dropdownArray = Array.from(newDataEntry.dropdowns);
                for (var i = 0; i < dropdownArray.length; i++) {
                    var elem = jQuery('#' + dropdownArray[i]);
                    var val = elem.val();
                    var prompt = elem.attr('data-prompt');
                    var responseBox = elem.attr('data-responseBox' + responseType);
                    var message = {
                        "prompt": prompt,
                        "thread": dropdownArray[i],
                        "text": val,
                        "responseBox": responseBox,
                        "type": "dropdown"
                    }
                    messages.push(message);
                }
            }

            if (newDataEntry.multiChoices.size > 0) {
                var multiChoiceArray = Array.from(newDataEntry.multiChoices);
                for (var i = 0; i < multiChoiceArray.length; i++) {
                    var elem = jQuery('#' + multiChoiceArray[i]).find('button.active').first()[0];
                    var val = elem.textContent;
                    var useGraphView = elem.getAttribute('data-useGraphView');
                    var graph = '';
                    if (useGraphView === 'true')
                        graph = 'Graph';
                    var prompt = elem.getAttribute('data-prompt');
                    var responseBox = elem.getAttribute('data-responseBox' + responseType + graph);
                    var index = elem.getAttribute('data-index');



                    var message = {
                        "prompt": prompt,
                        "thread": multiChoiceArray[i],
                        "text": val,
                        "responseBox": responseBox,
                        "index": index,
                        "useGraphView": useGraphView,
                        "type": "multipleChoice"
                    }
                    messages.push(message);
                }
            }

            if (newDataEntry.textareas.size > 0) {
                var textareaArray = Array.from(newDataEntry.textareas);
                for (var i = 0; i < textareaArray.length; i++) {
                    var elem = document.getElementById(textareaArray[i]);
                    var val = elem.value;
                    var prompt = elem.getAttribute('data-prompt');
                    var responseBox = elem.getAttribute('data-responseBox' + responseType);
                    var message = {
                        "prompt": prompt,
                        "thread": textareaArray[i],
                        "text": val,
                        "responseBox": responseBox,
                        "type": "text"
                    }
                    messages.push(message);
                }
            }

            if (newDataEntry.radios.size > 0) {
                var radioArray = Array.from(newDataEntry.radios);
                for (var j = 0; j < radioArray.length; j++) {
                    var val = jQuery('input[name="' + radioArray[j] + '"]:checked').val();
                    var title = jQuery('input[name="' + radioArray[j] + '"]:checked').attr('data-title');
                    var prompt = jQuery('input[name="' + radioArray[j] + '"]:checked').attr('prompt');
                    var responseBox = jQuery('input[name="' + radioArray[j] + '"]:checked').attr('data-responseBox' + responseType);
                    //Content of the message is the value of the radio button
                    var message = {
                        "prompt": prompt,
                        "thread": dataEntry.comboID(radioArray[j], responseType),
                        "text": val,
                        "responseBox": responseBox,
                        "type": "radio",
                        "title": title
                    };
                    messages.push(message);
                }
            }

            if (newDataEntry.checkboxes.size > 0) {
                var checkboxArray = Array.from(newDataEntry.checkboxes);
                for (var k = 0; k < checkboxArray.length; k++) {
                    var checkbox = document.getElementById(checkboxArray[k]);
                    var prompt = checkbox.value;
                    var thread = checkboxArray[k];
                    var responseBox = checkbox.getAttribute('data-responseBox' + responseType);
                    var text;
                    //Content of the message is the value of the checkbox + any additional input if specified.
                    if (checkbox.checked === true) {
                        if (checkbox.hasAttribute('data-moreInput'))
                            text = prompt + document.getElementById(checkbox.getAttribute('data-moreInput')).value;
                        else
                            text = prompt;
                    } else {
                        text = '';
                    }
                    var message = {
                        "prompt": prompt,
                        "thread": thread,
                        "text": text,
                        "responseBox": responseBox,
                        "type": "checkbox"
                    };
                    messages.push(message);
                }
            }

            return messages;
        } else {
            return null;
        }
    }
}

//Call readium library function to keep user on the same page after content resizes.
dataEntry.handleResize = function (callback) {
    //var currentPage = JSON.parse(globalReadium.reader.bookmarkCurrentPage());
    callback();
    //globalReadium.reader.openSpineItemElementCfi(currentPage.idref, currentPage.contentCFI);
}

dataEntry.sortMessages = function (a, b) {
    var aDate = new Date(a.timestamp);
    var bDate = new Date(b.timestamp);
    var aTimestamp = aDate.getTime();
    var bTimestamp = bDate.getTime();

    return aTimestamp - bTimestamp;
}

//Combines any number of strings with _ between them
dataEntry.comboID = function (...strings) {
    var newID = null;
    for (var string of strings) {
        if (newID === null)
            newID = string;
        else
            newID = newID + '_' + string;
    }

    return newID;
}

// TODO: super basic for now, make it work better later
dataEntry.getLearnletLevel = function (string) {
    return string.substr(0, 1);
}

dataEntry.getLearnlet = function (string) {
    return string.substr(2, 1);
}

dataEntry.getLearnletTitle = function () {
    return jQuery('.chapterTitle')[0].textContent;
}

//From https://stackoverflow.com/a/7557433
dataEntry.isElementInViewport = function (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or jQuery(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or jQuery(window).width() */
    );
}