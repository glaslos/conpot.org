(function ($) {
    $.noConflict();
    var d = document;
    var w = window;
    stpo = {};
    var log = function (x) {
        if (typeof console != 'undefined') {
            console.log(x);
        }
    };
    $(document).ready(function () {
        stpo.mainNav();
        stpo.windowResize();
        stpo.tabs();
        stpo.laureats();
        stpo.email();
        stpo.jury();
        stpo.creations();
        stpo.previous_editions();
        Uzik.messages();
        if ($.browser.msie && (($.browser.version == 6) || ($.browser.version == 7))) {}
    });
    $.extend($.easing, {
        def: 'easeOutBounce',
        easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    });
    stpo.windowResize = function () {
        var $w = $(w);
        $w.bind('resize', function (event) {
            var $currentPanel = $(window.location.hash);
            if ($currentPanel.length > 0)
                $w.scrollTop($currentPanel.offset().top);
            Uzik.resize();
        });
        Uzik.resize();
    };
    stpo.mainNav = function () {
        var $callersParents = $('#main-nav li').not('.participate-link, #ajax-loader, #participate-link'),
            $callers = $callersParents.find('a'),
            $header = $('#header'),
            wheelPermitted = true,
            offsetTopValues = [],
            sections = [];
        if ($.browser.webkit) var $rootElement = $('body');
        else var $rootElement = $('html');
        $callersParents.eq(0).addClass('active');
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
        $callers.each(function () {
            var $this = $(this);
            if ($this.attr('href') == window.location.hash) {
                $callersParents.filter('.active').removeClass('active');
                $this.parent().addClass('active');
            }
            $this.bind('click touchstart', function () {
                var anchor = $this.attr('href');
                scrollMe($this, anchor);
            });
        });
        $('body').bind('mousewheel', function (event, delta) {
            if (wheelPermitted) {
                wheelPermitted = false;
                if (delta < 0) var $target = $callersParents.filter('.active').next().find('a');
                else var $target = $callersParents.filter('.active').prev().find('a'); if (($target.length > 0) && ($target.parent()[0].id != 'participate-link')) {
                    scrollMe($target, $target.attr('href'));
                } else wheelPermitted = true;
            }
            return false;
        });
        $(d).bind('keydown', function (e) {
            var $target = [];
            if ((e.keyCode == '40') || (e.keyCode == '34') || (e.keyCode == '32'))
                $target = $callersParents.filter('.active').next().find('a');
            else if ((e.keyCode == '38') || (e.keyCode == '33'))
                $target = $callersParents.filter('.active').prev().find('a');
            if (($target.length > 0) && ($target.parent()[0].id != 'participate-link')) {
                scrollMe($target, $target.attr('href'));
                return false;
            }
        });
        var docH = $(document).height(),
            callersLength = $callers.length;
        var resetSections = function () {
            offsetTopValues = [];
            sections = [];
            $callers.each(function () {
                var $this = $(this),
                    href = $this.attr('href');
                offsetTopValues.push(parseInt($(href).offset().top))
            });
            for (i = 0; i < callersLength; i++) {
                if (i == callersLength - 1) sections.push([offsetTopValues[i], docH]);
                else sections.push([offsetTopValues[i], offsetTopValues[i + 1]]);
            }
        };
        resetSections();
        $(w).bind('resize', resetSections);
        var onScroll = function () {
            var windowTop = $(w).scrollTop() + 100;
            for (var i in sections) {
                if ((parseInt(sections[i][0]) < parseInt(windowTop)) && (parseInt(windowTop) < parseInt(sections[i][1]))) {
                    $callersParents.filter('.active').removeClass('active');
                    $callersParents.eq(i).addClass('active');
                }
            }
        };
        $(d).bind('scroll', onScroll);
    };
    stpo.tabs = function () {
        var positionCarousel = function (target, animate) {
            var newPos = -target.index() * target.parent().find('.legende').width();
            newPos += $(w).width() / 2 - target.parent().find('.legende').width() / 2;
            if (animate) {
                target.parent().animate({
                    marginLeft: newPos + 'px'
                });
            } else {
                target.parent().css({
                    marginLeft: newPos + 'px'
                });
            }
        }
        var resizeCarousel = function (target) {
            $('.tab-system').each(function () {
                var $this = $(this),
                    rank = $this[0].id.split('tab-system-')[1],
                    $callers = $('.tab-caller-' + rank).find('li'),
                    $contents = $('.tab-content-' + rank);
                if ($contents.eq(0).hasClass('laureat')) {
                    var target = $($callers.find('a').attr('href'));
                    positionCarousel(target, false);
                }
            });
        }
        $('.tab-system').each(function () {
            var $this = $(this),
                rank = $this[0].id.split('tab-system-')[1],
                $callers = $('.tab-caller-' + rank).find('li'),
                $contents = $('.tab-content-' + rank);
            if ($this.parent()[0].id != 'p_previous-editions') {
                $callers.eq(0).addClass('active');
                $contents.eq(0).addClass('active');
            }
            if ($this.parent().hasClass('awards')) {
                $callers.each(function () {
                    var $this = $(this),
                        $target = $($this.find('a').attr('href'));
                    $this.bind('click touchstart', function () {
                        $callers.filter('.active').removeClass('active');
                        $this.addClass('active');
                        $contents.filter('.active').removeClass('active');
                        $target.addClass('active');
                        positionCarousel($target, true);
                        $this.find('a').blur();
                        return false;
                    });
                });
            } else {
                $callers.each(function () {
                    var $this = $(this),
                        $target = $($this.find('a').attr('href'));
                    $this.bind('click touchstart', function () {
                        $callers.filter('.active').removeClass('active');
                        $this.addClass('active');
                        $contents.filter('.active').removeClass('active');
                        $target.addClass('active');
                        $this.find('a').blur();
                        return false;
                    });
                });
            }
        });
        resizeCarousel();
        $(w).bind('resize', resizeCarousel);
    };
    stpo.laureats = function () {
        $('.laureats-list .laureat').each(function () {
            $(this).hover(function () {
                $(this).find('.legende').addClass('active');
            }, function () {
                $(this).find('.legende').removeClass('active');
            });
        });
    }
    stpo.email = function () {
        $('.email').each(function (i) {
            var $this = $(this);
            var myString = $this.html();
            var newString = myString.split('[AT]')[0] + '@' + myString.split('[AT]')[1].split('[DOT]')[0] + '.' + myString.split('[AT]')[1].split('[DOT]')[1];
            if ($this.parent().hasClass('picto')) {
                $this.html('<a href="mailto:' + newString + '" class="' + $this.parent()[0].className + '">' + newString + '</a>');
                $this.parent().removeClass('picto');
            } else
                $this.html('<a href="mailto:' + newString + '">' + newString + '</a>');
        });
    };
    stpo.jury = function () {
        var $target2 = $('#jury-02_target'),
            $target3 = $('#jury-03_target');
        $('.jury-link').each(function () {
            var $this = $(this),
                $target = $($this.attr('href')),
                $heading = $('#jury-heading');
            $this.bind('click touchstart', function () {
                if (($this.attr('href') == '#jury-02_target') || ($this.attr('href') == '#jury-03_target'))
                    $heading.addClass('covered');
                $target.fadeIn('150', function () {
                    $target.addClass('active');
                });
                return false;
            });
            $target.find('.close').bind('click touchstart', function () {
                $target.fadeOut('250', function () {
                    $target.removeClass('active');
                    if (!(($target2.hasClass('active')) || ($target3.hasClass('active'))))
                        $heading.removeClass('covered');
                });
                return false;
            });
        });
    };
    stpo.creations = function () {
        $('#p_creations .content li a.creation-link').each(function () {
            var $this = $(this),
                $target = $($this.attr('href'));
            $this.bind('hover', function () {
                if (!$target.hasClass('active'))
                    $target.addClass('active');
            });
        });
    };
    stpo.previous_editions = function () {
        var $previousPyramids = $('#previous-pyramids'),
            $previousDates = $('#previous-dates');
        $previousPyramids.find('li').each(function () {
            var $this = $(this),
                $brother = $('.tab-caller-01.nav').find('a[href=' + $this.find('a').attr('href') + ']').parent('li');
            $this.bind('click touchstart', function () {
                $brother.addClass('active');
            });
            $this.hover(function () {
                $brother.addClass('hover');
            }, function () {
                $brother.removeClass('hover');
            });
        });
        $previousDates.find('li').each(function () {
            var $this = $(this),
                $brother = $previousPyramids.find('a[href=' + $this.find('a').attr('href') + ']').parent('li');
            $this.hover(function () {
                $brother.addClass('hover');
            }, function () {
                $brother.removeClass('hover');
            });
        });
        $('.tab-caller-01').find('li').bind('click touchstart', function () {
            $previousPyramids.hide();
        });
        $('.previous-edition .link-back').bind('click touchstart', function () {
            $previousPyramids.fadeIn(500);
            $('.previous-edition').add($previousDates.find('li')).removeClass('active');
            return false;
        });
    };
})(jQuery);;
(function ($) {
    Uzik = {
        opts: {},
        init: function (el) {
            $page = this;
            $page.el = el;
            $page.$$ = $($page.el);
        },
        resize: function () {
            $MIN_TOP_POSITION = 10;
            $('#p_concept .content p').first().addClass('first');
            $('#p_concept .heading').css('margin-top', 0);
            $space = (($(window).height() - $('#header').height() - $('#p_concept .content').height() + parseInt($('#p_concept .content p.first').css('padding-top')) + parseInt($('#p_concept .content .txtC').css('margin-top'))) / 2);
            $top = $space > $MIN_TOP_POSITION ? $space : $MIN_TOP_POSITION;
            if ($space > $MIN_TOP_POSITION) {
                $('#p_concept .mp2013').stop().animate({
                    'top': -$top / 2
                }, 100);
                $('#p_concept .core .content').stop().animate({
                    'top': $top / 2
                }, 100);
                $('#p_concept .content p.first').css('padding-top', $top / 2);
                $('#p_concept .content .txtC').css('margin-top', $top / 2);
            } else {
                $('#p_concept .mp2013').stop().animate({
                    'top': -$top
                }, 100);
                $('#p_concept .core .content').stop().animate({
                    'top': $top
                }, 100);
                $('#p_concept .content p.frst').css('padding-top', 0);
                $('#p_concept .content .txtC').css('margin-top', 0);
            }
            if ($(window).width() > 1600) {
                var vs_home02_src = '/img/vs_home-02-big.png';
                if (vs_home02_src != $('#p_home .vs_02').attr('src')) {
                    var vs_home02 = new Image();
                    vs_home02.onload = function () {
                        $('#p_home .vs_02').attr('src', vs_home02_src);
                    }
                    vs_home02.src = vs_home02_src;
                }
            }
            $MIN_MARGIN_TOP = 10;
            var vs_partnershipsv2 = new Image();
            vs_partnershipsv2.onload = function () {
                $spaceP = $(window).height() - $('#header').height() - $('#p_partnerships .content .partnerships-links').height();
                $marginTop = $spaceP > 0 ? $('#header').height() + ($spaceP / 2) : $('#header').height() + $MIN_MARGIN_TOP;
                $('#p_partnerships .content .partnerships-links').stop().animate({
                    'margin-top': $marginTop
                }, 100);
            }
            vs_partnershipsv2.src = '/img/vs_partnershipsv2.png';
        },
        messages: function () {
            $('#p_ipad').bind('click touchstart', function (e) {
                $('body').removeClass('alertmsg');
            });
            $('a.nomsg').bind('click touchstart', function (e) {
                $('body').removeClass('alertmsg');
                e.preventDefault();
                return false;
            });
        }
    }
    $.fn.uzik = function () {
        return this.each(function () {
            Uzik.init(this);
        });
    }
})(jQuery);