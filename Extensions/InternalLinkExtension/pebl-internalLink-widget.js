$(document).ready(function() {
    var temp,
        newValue,
        array;
    array = document.getElementsByClassName('internalLink');
    for (var element in array) {
        temp = array[element].innerHTML;
        newValue = temp + ' <img src="image/internal-link-icon.png" width="15px"></img>';
        array[element].innerHTML = newValue;
    }
});