$(document).ready(function() {
    $('#reviewCode').focus();

    chrome.tabs.executeScript({
        file: 'js/jquery.min.js'
    });
    chrome.tabs.executeScript({
        file: 'js/contentScript.js'
    });

    $('#reviewCode').on('keypress', function(e) {
        var code = e.keyCode || e.which;
        if (code==13) {
            var message = {"code": $('#reviewCode').val()};
            chrome.extension.getBackgroundPage().inputReview($('#reviewCode').val());
            window.close();
        }
    });
});
