// Review message construction
//////////////////////////////
var THREE_STAR_REVIEW_BASE = "Thank you for your contribution. Your article has been accepted at 3 stars. For higher ratings in the future, please focus on improving your ";
var THREE_STAR_REVIEW_ADD_ONE = "examples";
var THREE_STAR_REVIEW_ADD_TWO = "flow";

var FOUR_STAR_REVIEW_COMPLIMENTS = ["Good job", "Great job", "Good work", "Great work"];
var FOUR_STAR_REVIEW_BASE = ". Your article has been accepted at 4 stars. In the future, please focus on ";
var FOUR_STAR_REVIEW_ADD_ONE = "taking a creative approach";
var FOUR_STAR_REVIEW_ADD_TWO = "proofreading";
var FOUR_STAR_REVIEW_ADD_THREE = "strengthening your authority and expertise";

var FIVE_STAR_REVIEW_COMPLIMENTS = ["Superb work", "Excellent work", "Outstanding work"];
var FIVE_STAR_REVIEW_BASE = "! Your article has been accepted at 5 stars!";

function threeStarReview(code) {
    var includeAddOne = code.indexOf('j') != -1;
    var includeAddTwo = code.indexOf('k') != -1;

    var review = THREE_STAR_REVIEW_BASE;
    if (includeAddOne && includeAddTwo) {
        review += THREE_STAR_REVIEW_ADD_ONE + " and " + THREE_STAR_REVIEW_ADD_TWO + ".";
    }
    else if (includeAddOne) {
        review += THREE_STAR_REVIEW_ADD_ONE + ".";
    }
    else if (includeAddTwo) {
        review += THREE_STAR_REVIEW_ADD_TWO + ".";
    }

    return review;
}

function fourStarReview(code) {
    var compliment = FOUR_STAR_REVIEW_COMPLIMENTS[Math.floor(Math.random() * FOUR_STAR_REVIEW_COMPLIMENTS.length)];
    var includeAddOne = code.indexOf('j') != -1;
    var includeAddTwo = code.indexOf('k') != -1;
    var includeAddThree = code.indexOf('l') != -1;

    var review = compliment + FOUR_STAR_REVIEW_BASE;
    if (includeAddOne && includeAddTwo && includeAddThree) {
        review += FOUR_STAR_REVIEW_ADD_ONE + ", " + FOUR_STAR_REVIEW_ADD_TWO + ", and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    }
    else if (includeAddOne && includeAddTwo) {
        review += FOUR_STAR_REVIEW_ADD_ONE + " and " + FOUR_STAR_REVIEW_ADD_TWO + ".";
    }
    else if (includeAddOne && includeAddThree) {
        review += FOUR_STAR_REVIEW_ADD_ONE + " and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    }
    else if (includeAddTwo && includeAddThree) {
        review += FOUR_STAR_REVIEW_ADD_TWO + " and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    }
    else if (includeAddOne) {
        review += FOUR_STAR_REVIEW_ADD_ONE + ".";
    }
    else if (includeAddTwo) {
        review += FOUR_STAR_REVIEW_ADD_TWO + ".";
    }
    else if (includeAddThree) {
        review += FOUR_STAR_REVIEW_ADD_THREE + ".";
    }

    return review;
}

function fiveStarReview() {
    var compliment = FIVE_STAR_REVIEW_COMPLIMENTS[Math.floor(Math.random() * FIVE_STAR_REVIEW_COMPLIMENTS.length)];
    var review = compliment + FIVE_STAR_REVIEW_BASE;
    return review;
}

// Review code interpretation
/////////////////////////////
function inputReview(input) {
    if (!validateInput(input)) return;

    var messageData;
    switch (input.charAt(0)) {
        case 'f':
            messageData = {
                review: threeStarReview(input),
                imgAlt: '3',
                imgTitle: 'regular'
            };
            break;
        case 'd':
            messageData = {
                review: fourStarReview(input),
                imgAlt: '4',
                imgTitle: 'good'
            };
            break;
        case 's':
            messageData = {
                review: fiveStarReview(),
                imgAlt: '5',
                imgTitle: 'gorgeous'
            };
            break;
        default:
            return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, messageData, function(response) {
            console.log(response);
        });
    });
}

function validateInput(input) {
    var alertMessage = '';
    switch(input.charAt(0)) {
        case 'f':
            if (input.indexOf('j') == -1 && input.indexOf('k') == -1) {
                alertMessage = 'The given review code is invalid. A three-star review must include one or both of the flags j or k.';
            }
            break;
        case 'd':
            if (input.indexOf('j') == -1 && input.indexOf('k') == -1 && input.indexOf('l') == -1) {
                alertMessage = 'The given review code is invalid. A four-star review must include one or all of the flags j, k, or l.';
            }
            break;
        case 's':
            break;
        default:
            alertMessage = 'The given review code is invalid. The first character must be either f (3 stars), d (4 stars), or s (5 stars).';
            break;
    }

    if (alertMessage) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                alertMessage: alertMessage
            });
        });
        return false;
    }
    return true;
}

// Keyboard shortcuts
/////////////////////
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript({
        file: 'js/jquery.min.js'
    });
    chrome.tabs.executeScript({
        file: 'js/contentScript.js'
    });
    switch(command) {
        case 'toggle-timer':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: 'toggle-timer'
                });
            });
            break;
        case 'insert-link':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: 'insert-link'
                });
            });
            break;
        default:
            break;
    }
});
