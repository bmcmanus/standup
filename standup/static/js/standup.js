$(function() {
    fixTimezones();

    setInterval(function() {
        if ($('.star-of-david').length < 50) {
            createSnowflakes();
        }
    }, 500);

    /* Authenticatication for Persona */
    $('#login').click(function(ev) {
        ev.preventDefault();
        navigator.id.request();
    });

    $('#logout').click(function(ev) {
        ev.preventDefault();
        navigator.id.logout();
    });

    navigator.id.watch({
        loggedInEmail: currentUser,
        onlogin: function(assertion) {
            $.ajax({
                type: 'POST',
                url: '/authenticate',
                data: { assertion: assertion },
                success: function(res, status, xhr) {
                    window.location.reload();
                },
                error: function(res, status, xhr) {
                    console.log('Login failure:' + res.status + ': ' + res.statusText);

                    // Remove any old notices
                    $('.notice.sign-in-error').remove();

                    var message = $('<div></div>');
                    message.addClass('notice error dismissable sign-in-error');
                    message.html('We were unable to sign you in. Please try again.');

                    message.on('click', function() {
                      $(this).fadeOut(600, function() {
                        $(this).remove();
                      });
                    });

                    message.hide();
                    $('#main-notices').prepend(message);

                    message.fadeOut(0, function() {
                      message.fadeIn(400);
                    });
                }
            });
        },
        onlogout: function() {
            $.ajax({
                type: 'POST',
                url: '/logout',
                success: function(res, status, xhr) {
                    window.location.reload();
                },
                error: function(res, status, xhr) {
                    console.log('Logout failure: ' + res.status + ': ' + res.statusText);
                }
            });
        }
    });
});

/* Find all datetime objects and modify them to match the user's current
 * timezone. */
function fixTimezones() {
    $('time').each(function(elem) {
        var $t = $(this);

        var utc_dt_str = $t.attr('datetime');
        var local_dt = new Date(utc_dt_str);

        var hours = local_dt.getHours();
        var minutes = local_dt.getMinutes();
        var ampm = 'am';
        if (hours > 12) {
            hours -= 12;
            ampm = 'pm';
        }
        if (minutes < 10) { // single digit
            minutes = '0' + minutes;
        }
        $t.text(hours + ':' + minutes + ' ' + ampm);
    });
}

function random(upper, lower) {
    if (!lower) {
        lower = 0;
    }
    return Math.floor(Math.random() * (upper - lower) + 1) + lower;
}

function createSnowflakes() {
    var flake = $('<div class="star-of-david"></div>');
    flake.css('left', random(100) + '%');
    flake.css('fontSize', random(300, 80) + '%');
    flake.css('opacity', random(10, 5) * 0.1);
    $('body').prepend(flake);
    flake.animate({
        top: '100%'
    }, random(16000, 36000), 'linear', function() {
        $(this).remove();
    });
}
