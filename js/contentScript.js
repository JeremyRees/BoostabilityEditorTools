
$(document).ready(function() {
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var script = document.createElement('script');
    script.textContent = `$('#cke_content').closest('.form-group').parent().find('img[alt="'+${request.imgAlt}+'"]').click().mouseover()`;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

    $('.cke_editor_content').eq(1).find('iframe').contents().find('body').html('<p>'+request.review+'</p>');

    sendResponse({success:1});
});
