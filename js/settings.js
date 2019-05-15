var settingsObj = {
    'reviewCode': {
        'starFlags': {
            'three': '',
            'four': '',
            'five': ''
        },
        'criteriaFlags': {
            'one': '',
            'two': '',
            'three': ''
        },
        'sync': function() {}
    },
    'compliments': {
        'four': [],
        'five': [],
        'sync': function() {}
    }
};

var inputReview;


$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bkg) {
        settingsObj.reviewCode.starFlags.three = bkg.threeStarReviewChoice;
        settingsObj.reviewCode.starFlags.four = bkg.fourStarReviewChoice;
        settingsObj.reviewCode.starFlags.five = bkg.fiveStarReviewChoice;

        settingsObj.reviewCode.criteriaFlags.one = bkg.reviewCriteriaOneFlag;
        settingsObj.reviewCode.criteriaFlags.two = bkg.reviewCriteriaTwoFlag;
        settingsObj.reviewCode.criteriaFlags.three = bkg.reviewCriteriaThreeFlag;

        settingsObj.compliments.four = bkg.fourStarCompliments;
        settingsObj.compliments.five = bkg.fiveStarCompliments;

        settingsObj.reviewCode.sync = function() {bkg.syncBackgroundPageReviewCode(this);};
        settingsObj.compliments.sync = function() {bkg.syncBackgroundPageCompliments(this);};

        inputReview = bkg.inputReview;

        documentReady();
    });
});


function documentReady() {

    setReviewGrid();

    ['four', 'five'].forEach(function(s) {
        settingsObj.compliments[s].forEach(function(c) {
            createComplimentHTML(c, s);
        });
    });



    $('#saveCode').click(function() {
        reviewCodeInputToLowerCase();
        if (!validateReviewCodeInput()) return;

        settingsObj.reviewCode.starFlags.three = $('#threeStarChoice').val();
        settingsObj.reviewCode.starFlags.four = $('#fourStarChoice').val();
        settingsObj.reviewCode.starFlags.five = $('#fiveStarChoice').val();
        settingsObj.reviewCode.criteriaFlags.one = $('#criteriaOneFlag').val();
        settingsObj.reviewCode.criteriaFlags.two = $('#criteriaTwoFlag').val();
        settingsObj.reviewCode.criteriaFlags.three = $('#criteriaThreeFlag').val();

        settingsObj.reviewCode.sync();
    });

    $('#resetCode').click(function() {
        setReviewGrid();
    });


    $('#reviewTestIn').on('keypress', function(e) {
        var code = e.keyCode || e.which;
        if (code==13) {
            var data = inputReview($(this).val(), true);
            if (data.alertMessage) {
                alert(data.alertMessage);
            }
            else if (data.review) {
                $('#reviewTestOut').val(data.review);
            }
        }
    });


    $('#complimentsGrid').on('click', '.remove-button', function() {
        var stars = $(this).attr('stars');
        var index = settingsObj.compliments[stars].indexOf($(this).attr('compliment'));
        settingsObj.compliments[stars].splice(index, 1);
        settingsObj.compliments.sync();

        $(this).parent().parent().remove();
    });

    $('.add-button').click(function() {
        var stars = $(this).attr('stars');
        var c = $('#'+stars+'StarComplimentInput').val();

        if (c.charAt(0) < 'A' || c.charAt(0) > 'Z' || !['.', '!', ';', '?', ','].includes(c.charAt(c.length-1))) {
            alert('Your compliments need to begin with a capital letter and end with punctuation. '+
                  'Otherwise, the reviews generated will have typos.');
            return;
        }

        settingsObj.compliments[stars].push(c);
        settingsObj.compliments.sync();

        createComplimentHTML(c, stars);
        $('#'+stars+'StarComplimentInput').val('');
    });

    ['four', 'five'].forEach(function(s) {
        $('#'+s+'StarComplimentInput').on('keypress', function(e) {
            var code = e.keyCode || e.which;
            if (code==13) {
                $(this).parent().find('.add-button').click();
            }
        });
    });

}


function reviewCodeInputToLowerCase() {
    $('#reviewCodeGrid').find('.singleChar').each(function() {
        $(this).val($(this).val().toLowerCase());
    });
}

function validateReviewCodeInput() {
    var valid = true;
    var arrUsed = [];
    $('#reviewCodeGrid').find('.singleChar').each(function() {
        var val = $(this).val();
        var errorMessage = null;

        if (val.length > 1) {
            errorMessage = 'Only one character can be entered in each field.';
        }

        if (!val) {
            errorMessage = 'Every field is required';
        }

        if (arrUsed.includes(val)) {
            errorMessage = 'Each option must be unique';
        }

        if (errorMessage) {
            $(this).focus();
            alert(errorMessage);
            valid = false;
            return false;
        }

        arrUsed.push(val);
    });
    return valid;
}

function setReviewGrid() {
    $('#threeStarChoice').val(settingsObj.reviewCode.starFlags.three);
    $('#fourStarChoice').val(settingsObj.reviewCode.starFlags.four);
    $('#fiveStarChoice').val(settingsObj.reviewCode.starFlags.five);

    $('#criteriaOneFlag').val(settingsObj.reviewCode.criteriaFlags.one);
    $('#criteriaTwoFlag').val(settingsObj.reviewCode.criteriaFlags.two);
    $('#criteriaThreeFlag').val(settingsObj.reviewCode.criteriaFlags.three);
}

function createComplimentHTML(complimentText, stars) {
    $('#'+stars+'StarCompliments').find('.columnTail').before(
        '<tr><td>'+complimentText+
            '<button class="remove-button btn btn-danger float-right" compliment="'+complimentText+'" stars="'+stars+'">X</button>'+
        '</td></tr>'
    );
}
