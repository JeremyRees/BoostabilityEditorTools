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
    var review = THREE_STAR_REVIEW_BASE;
    if (code == 'j') {
        review += THREE_STAR_REVIEW_ADD_ONE + ".";
    } else if (code == 'k') {
        review += THREE_STAR_REVIEW_ADD_TWO + ".";
    } else if (code == 'jk') {
        review += THREE_STAR_REVIEW_ADD_ONE + " and " + THREE_STAR_REVIEW_ADD_TWO + ".";
    }

    return review;
}

function fourStarReview(code) {
    var compliment = FOUR_STAR_REVIEW_COMPLIMENTS[Math.floor(Math.random() * FOUR_STAR_REVIEW_COMPLIMENTS.length)];

    var review = compliment + FOUR_STAR_REVIEW_BASE;
    if (code == 'j') {
        review += FOUR_STAR_REVIEW_ADD_ONE + ".";
    } else if (code == 'k') {
        review += FOUR_STAR_REVIEW_ADD_TWO + ".";
    } else if (code == 'l') {
        review += FOUR_STAR_REVIEW_ADD_THREE + ".";
    } else if (code == 'jk') {
        review += FOUR_STAR_REVIEW_ADD_ONE + " and " + FOUR_STAR_REVIEW_ADD_TWO + ".";
    } else if (code == 'jl') {
        review += FOUR_STAR_REVIEW_ADD_ONE + " and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    } else if (code == 'kl') {
        review += FOUR_STAR_REVIEW_ADD_TWO + " and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    } else if (code == 'jkl') {
        review += FOUR_STAR_REVIEW_ADD_ONE + ", " + FOUR_STAR_REVIEW_ADD_TWO + ", and " + FOUR_STAR_REVIEW_ADD_THREE + ".";
    }

    return review;
}

function fiveStarReview(code) {
    var compliment = FIVE_STAR_REVIEW_COMPLIMENTS[Math.floor(Math.random() * FIVE_STAR_REVIEW_COMPLIMENTS.length)];
    var review = compliment + FIVE_STAR_REVIEW_BASE;
    return review;
}

// -----------------------
//////////////////////////
function inputReview(value) {
    var messageData;
    switch (value.charAt(0)) {
        case 'f':
            messageData = {
                review: threeStarReview(value.substring(1)),
                imgAlt: '3',
                imgTitle: 'regular'
            };
            break;
        case 'd':
            messageData = {
                review: fourStarReview(value.substring(1)),
                imgAlt: '4',
                imgTitle: 'good'
            };
            break;
        case 's':
            messageData = {
                review: fiveStarReview(value.substring(1)),
                imgAlt: '5',
                imgTitle: 'gorgeous'
            };
            break;
        default:
            break;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, messageData, function(response) {
            console.log(response);
        });
    });
}
