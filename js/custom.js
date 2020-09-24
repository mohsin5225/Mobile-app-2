let cardTransitionTime = 300;
let $card = $('.demo__card__top')
let $body = $('body')
let $last = false;
let $check = $('.check');
let $form = $('#form');


$check.click(markCheck);

function markCheck () {
    if($(this).parent().hasClass('check-show')){
        $(this).addClass('checked');
    }
}


$form.submit(formSubmit);

function formSubmit (e) {
    let one = document.querySelector('.one input').value;
    let two = document.querySelector('.two input').value;
    let three = document.querySelector('.three input').value;
    let four = document.querySelector('.four input').value;
    let five = document.querySelector('.five input').value;
    let six = document.querySelector('.six input').value;
    let seven = document.querySelector('.seven input').value;

    e.preventDefault();
    $('input[type="text"]').each(function() {
        if ($(this).val() == '') {   
            $(".alert").show();
        } else {
            $(".alert").hide();
        }
    });
}


// /* Flip functionality */
function flipCard() {


    $(this).parent().addClass('check-show')
    $(this).prev().prev().addClass('is-switched')
    window.setTimeout(function () {
        $card.children().children().toggleClass('is-active')
        if ($last) {
            $("#btn-start").hide();
            $("#btn-question").hide();
        } else {
            $("#btn-start").show();
            $("#btn-question").hide();
        }

    }, cardTransitionTime / 2)
}

// /* Swapping functionality */

$(document).ready(function () {

    var animating = false;
    var cardsCounter = 0;
    var numOfCards = 16;
    var decisionVal = 80;
    var pullDeltaX = 0;
    var deg = 0;
    var $card, $cardReject, $cardLike;

    function pullChange() {
        animating = true;
        deg = pullDeltaX / 10;
        $card.css("transform", "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)");

        var opacity = pullDeltaX / 100;
        var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
        var likeOpacity = (opacity <= 0) ? 0 : opacity;
        $cardReject.css("opacity", rejectOpacity);
        $cardLike.css("opacity", likeOpacity);
    }
    ;

    function release() {

        if (pullDeltaX >= decisionVal) {
            $card.addClass("to-right");
        } else if (pullDeltaX <= -decisionVal) {
            $card.addClass("to-left");
        }

        if (Math.abs(pullDeltaX) >= decisionVal) {
            $card.addClass("inactive");

            setTimeout(function () {
                $card.addClass("below").removeClass("inactive to-left to-right");
                cardsCounter++;
                if (cardsCounter === numOfCards) {
                    cardsCounter = 0;
                    $(".demo__card").removeClass("below");
                }
                $("#btn-question").show();
                $("#btn-start").hide();
            }, 300);
        }

        if (Math.abs(pullDeltaX) < decisionVal) {
            $card.addClass("reset");
        }

        setTimeout(function () {
            $card.attr("style", "").removeClass("reset")
                    .find(".demo__card__choice").attr("style", "");

            pullDeltaX = 0;
            animating = false;

        }, 300);
    }
    ;

    $(document).on("mousedown touchstart", ".demo__card:not(.inactive)", function (e) {
        if (animating)
            return;
        if ($(this).hasClass('last'))
        {
            $last = true;
        }
        if ($('#btn-question').is(":visible")) {
            $(".demo__card__drag").unbind('click').bind('click', flipCard);
        } else {
            $(".demo__card__drag").unbind('click');
            $card = $(this);
            $cardReject = $(".demo__card__choice.m--reject", $card);
            $cardLike = $(".demo__card__choice.m--like", $card);
            var startX = e.pageX || e.originalEvent.touches[0].pageX;

            $(document).on("mousemove touchmove", function (e) {
                var x = e.pageX || e.originalEvent.touches[0].pageX;
                pullDeltaX = (x - startX);
                if (!pullDeltaX)
                    return;
                pullChange();
            });

            $(document).on("mouseup touchend", function () {
                $(document).off("mousemove touchmove mouseup touchend");
                if (!pullDeltaX)
                    return; // prevents from rapid click events
                release();

            });
        }


    });

});