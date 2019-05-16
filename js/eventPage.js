// Initializing, saving, and loading settings
/////////////////////////////////////////////
chrome.runtime.onInstalled.addListener(function() {
    threeStarReviewChoice = 'f';
    fourStarReviewChoice = 'd';
    fiveStarReviewChoice = 's';

    reviewCriteriaOneFlag = 'j';
    reviewCriteriaTwoFlag = 'k';
    reviewCriteriaThreeFlag = 'l';

    fourStarCompliments = ["Good job.", "Good work.", "Great job.", "Great work."];
    fiveStarCompliments = ["Superb work!", "Excellent work!", "Outstanding work!"];
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.get([
        'bet_threeStarReviewChoice', 'bet_fourStarReviewChoice', 'bet_fiveStarReviewChoice',
        'bet_reviewCriteriaOneFlag', 'bet_reviewCriteriaTwoFlag', 'bet_reviewCriteriaThreeFlag',
        'bet_fourStarCompliments', 'bet_fiveStarCompliments'
    ], function(data) {
        threeStarReviewChoice = data.bet_threeStarReviewChoice;
        fourStarReviewChoice = data.bet_fourStarReviewChoice;
        fiveStarReviewChoice = data.bet_fiveStarReviewChoice;

        reviewCriteriaOneFlag = data.bet_reviewCriteriaOneFlag;
        reviewCriteriaTwoFlag = data.bet_reviewCriteriaTwoFlag;
        reviewCriteriaThreeFlag = data.bet_reviewCriteriaThreeFlag;

        fourStarCompliments = data.bet_fourStarCompliments;
        fiveStarCompliments = data.bet_fiveStarCompliments;
    });
});

// For syncing data with the settings page
function syncBackgroundPageReviewCode(reviewCodeSettings) {
    threeStarReviewChoice = reviewCodeSettings.starFlags.three;
    fourStarReviewChoice = reviewCodeSettings.starFlags.four;
    fiveStarReviewChoice = reviewCodeSettings.starFlags.five;

    reviewCriteriaOneFlag = reviewCodeSettings.criteriaFlags.one;
    reviewCriteriaTwoFlag = reviewCodeSettings.criteriaFlags.two;
    reviewCriteriaThreeFlag = reviewCodeSettings.criteriaFlags.three;

    chrome.storage.sync.set({
        'bet_threeStarReviewChoice': threeStarReviewChoice,
        'bet_fourStarReviewChoice': fourStarReviewChoice,
        'bet_fiveStarReviewChoice': fiveStarReviewChoice,
        'bet_reviewCriteriaOneFlag': reviewCriteriaOneFlag,
        'bet_reviewCriteriaTwoFlag': reviewCriteriaTwoFlag,
        'bet_reviewCriteriaThreeFlag': reviewCriteriaThreeFlag
    });
}
function syncBackgroundPageCompliments(compliments) {
    fourStarCompliments = compliments.four;
    fiveStarCompliments = compliments.five;

    chrome.storage.sync.set({
        'bet_fourStarCompliments': fourStarCompliments,
        'bet_fiveStarCompliments': fiveStarCompliments
    });
}


// Review message construction
//////////////////////////////
var THREE_STAR_REVIEW_BASE = "Thank you for your contribution. Your article has been accepted at 3 stars. For higher ratings in the future, please focus on improving your ";
var THREE_STAR_REVIEW_ADD_ONE = "examples";
var THREE_STAR_REVIEW_ADD_TWO = "flow";

var FOUR_STAR_REVIEW_BASE = " Your article has been accepted at 4 stars. In the future, please focus on ";
var FOUR_STAR_REVIEW_ADD_ONE = "taking a creative approach";
var FOUR_STAR_REVIEW_ADD_TWO = "proofreading";
var FOUR_STAR_REVIEW_ADD_THREE = "strengthening your authority and expertise";

var FIVE_STAR_REVIEW_BASE = " Your article has been accepted at 5 stars!";

function threeStarReview(code) {
    var includeAddOne = code.indexOf(reviewCriteriaOneFlag) != -1;
    var includeAddTwo = code.indexOf(reviewCriteriaTwoFlag) != -1;

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
    var compliment = fourStarCompliments[Math.floor(Math.random() * fourStarCompliments.length)];
    var includeAddOne = code.indexOf(reviewCriteriaOneFlag) != -1;
    var includeAddTwo = code.indexOf(reviewCriteriaTwoFlag) != -1;
    var includeAddThree = code.indexOf(reviewCriteriaThreeFlag) != -1;

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
    var compliment = fiveStarCompliments[Math.floor(Math.random() * fiveStarCompliments.length)];
    var review = compliment + FIVE_STAR_REVIEW_BASE;
    return review;
}

// Review code interpretation
/////////////////////////////
function inputReview(input, returnData = false) {
    input = input.toLowerCase();

    var alertMessage = validateInput(input);
    if (alertMessage) {
        if (returnData) return {alertMessage: alertMessage};

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                alertMessage: alertMessage
            });
        });
        return;
    }

    var messageData;
    switch (input.charAt(0)) {
        case threeStarReviewChoice:
            messageData = {
                review: threeStarReview(input),
                imgAlt: '3',
                imgTitle: 'regular'
            };
            break;
        case fourStarReviewChoice:
            messageData = {
                review: fourStarReview(input),
                imgAlt: '4',
                imgTitle: 'good'
            };
            break;
        case fiveStarReviewChoice:
            messageData = {
                review: fiveStarReview(),
                imgAlt: '5',
                imgTitle: 'gorgeous'
            };
            break;
        default:
            return;
    }

    if (returnData) return messageData;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, messageData, function(response) {
            console.log(response);
        });
    });
}

function validateInput(input) {
    switch(input.charAt(0)) {
        case threeStarReviewChoice:
            if (input.indexOf(reviewCriteriaOneFlag) == -1 && input.indexOf(reviewCriteriaTwoFlag) == -1) {
                return 'The given review code is invalid. A three-star review must include one or both of the flags '+reviewCriteriaOneFlag+' or '+reviewCriteriaTwoFlag+'.';
            }
            break;
        case fourStarReviewChoice:
            if (input.indexOf(reviewCriteriaOneFlag) == -1 && input.indexOf(reviewCriteriaTwoFlag) == -1 && input.indexOf(reviewCriteriaThreeFlag) == -1) {
                return 'The given review code is invalid. A four-star review must include a combination of the flags '+reviewCriteriaOneFlag+', '+reviewCriteriaTwoFlag+', or '+reviewCriteriaThreeFlag+'.';
            }
            break;
        case fiveStarReviewChoice:
            break;
        default:
            return 'The given review code is invalid. The first character must be either '+threeStarReviewChoice+' (3 stars), '+fourStarReviewChoice+' (4 stars), or '+fiveStarReviewChoice+' (5 stars).';
            break;
    }
    return null;
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
