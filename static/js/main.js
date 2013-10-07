(function ($) {
    $.noConflict();
    var d = document;
    var w = window;
    var $callersParents = $('.navbar-right li');
    var wheelPermitted = true;

    $('body').bind('mousewheel', function (event, delta, deltaX, deltaY) {
        var $rootElement = $('html');
        var onScroll = function () {
        };
        var scrollMe = function ($link, target) {
            $(d).unbind('scroll', onScroll);
            $callersParents.filter('.active').removeClass('active');
            $link.parent().addClass('active');
            $rootElement.animate({
                    scrollTop: $(target).offset().top + 0
                }, 400, 'swing', function () {
                    window.location.hash = (target);
                    wheelPermitted = true;
                    $(d).bind('scroll', onScroll);
                }
            );
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

    $('li > a').click(function() {
        $('li').removeClass();
        $(this).parent().addClass('active');
    });
})(jQuery);