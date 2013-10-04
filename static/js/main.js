(function ($) {
    $.noConflict();
    var d = document;
    var w = window;
    var $callersParents = $('.navbar-right li');
    var wheelPermitted = true;

    $.extend($.easing, {
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    });

    $('body').bind('mousewheel', function (event, delta, deltaX, deltaY) {
        var $rootElement = $('html');
        var onScroll = function () {
        };
        var scrollMe = function ($link, target) {
            $(d).unbind('scroll', onScroll);
            $callersParents.filter('.active').removeClass('active');
            $link.parent().addClass('active');
            $rootElement.stop().animate({
                scrollTop: $(target).offset().top
            }, 1000, 'easeOutExpo', function () {
                window.location.hash = (target);
                wheelPermitted = true;
                $(d).bind('scroll', onScroll);
            });
            $link.blur();
            return false;
        };
        var $target;
        if (wheelPermitted) {
            wheelPermitted = false;
            if (delta < 0) {
                $target = $callersParents.filter('.active').next().find('a');
            } else {
                $target = $callersParents.filter('.active').prev().find('a');
            }
            if ($target.length > 0) {
                scrollMe($target, $target.attr('href'));
            } else wheelPermitted = true;
        }
        return false;
    });
})(jQuery);