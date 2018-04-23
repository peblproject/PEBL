function debug(msg) {
    if ($("#debugArea").length > 0)
    $("#debugArea").text(msg + "\n" + $("#debugArea").text());
}

// jumps to section title in link after page renders
function goToAnchor() {
    hash = document.location.hash;
    if (hash != "") {
        setTimeout(function () {
            if (location.hash) {
                window.scrollTo(0, 0);
                window.location.href = hash;
            }
        }, 1);
    } else {
        return false;
    }
}

$(document).ready(function() {
    $('#CompleteTrigger')
});