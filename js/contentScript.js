
$(document).ready(function() {
});

// May God have mercy on my soul for writing such nasty code; I'm working with what I've got.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var script = document.createElement('script');
    script.textContent = `$('#cke_content').closest('.form-group').parent().find('img[alt="'+${request.imgAlt}+'"]').click().mouseover()`;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

    $('.cke_editor_content').eq(1).find('iframe').contents().find('body').html('<p>'+request.review+'</p>');
    setTimeout(function() {
        $('.cke_editor_content').eq(1).find('iframe').contents().find('body').focus();
        setTimeout(function() {
            $('#cke_content').find('iframe').contents().find('body').focus();
        }, 50);
    }, 50);

    sendResponse({success:1});
});
