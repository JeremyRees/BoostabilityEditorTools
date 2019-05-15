if (!window.init) {
    window.init = true;

    function toggleTimer() {
        $('.help-block > button').click();
    }

    function insertLink() {
        var targetAddress = $('strong:contains("Customer URL")').parent().find('span.externalLink').html();

        $('a.cke_button[title="Link"]').get(0).click();
        setTimeout(function() {
            if (targetAddress.toLowerCase().indexOf('https') != -1) {
                $('label:contains("Protocol")').parent().find('select').val('https://');
            }
            $('label:contains("URL")').parent().find('input[type="text"]').val(targetAddress);
            setTimeout(function() {
                $('a.cke_dialog_ui_button[title="OK"]').get(0).click();
            }, 100);
        }, 100);
    }

    // May God have mercy on my soul for writing such nasty code; I'm working with what I've got.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.alertMessage) {
            alert(request.alertMessage);
            sendResponse({success:1});
            return;
        }

        if (request.command) {
            switch(request.command) {
                case 'toggle-timer':
                    toggleTimer();
                    break;
                case 'insert-link':
                    insertLink();
                    break;
                default:
                    break;
            }
            sendResponse({success:1});
            return;
        }

        if (request.review) {
            var script = document.createElement('script');
            script.textContent = `$('label:contains("Content Rating")').parent().find('img[alt="'+${request.imgAlt}+'"]').click().mouseover()`;
            (document.head||document.documentElement).appendChild(script);
            script.remove();

            $('label:contains("Reviewer Comments")').parent().find('iframe').contents().find('body').html('<p>'+request.review+'</p>');
            setTimeout(function() {
                $('label:contains("Reviewer Comments")').parent().find('iframe').contents().find('body').focus();
                setTimeout(function() {
                    $('input[name="contentTags"]').focus();
                }, 50);
            }, 50);

            sendResponse({success:1});
            return;
        }
    });

}
