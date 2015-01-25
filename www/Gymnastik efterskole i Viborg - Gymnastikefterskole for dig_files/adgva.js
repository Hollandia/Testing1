if (typeof jQuery != 'undefined') {
  jQuery(document).ready(function($) {
    var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
    var baseHref = '';
    if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');
 
    jQuery('a').on('click', function(event) {
      var el = jQuery(this);
      var track = true;
      var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";
      var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
      if (!href.match(/^javascript:/i)) {
        var elEv = []; elEv.value=0, elEv.non_i=false;
        if (href.match(/^mailto\:/i)) {
          elEv.category = "email";
          elEv.action = "click";
          elEv.label = href.replace(/^mailto\:/i, '');
          elEv.loc = href;
        }
        else if (href.match(filetypes)) {
          var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
          elEv.category = "download";
          elEv.action = "click-" + extension[0];
          elEv.label = href.replace(/ /g,"-");
          elEv.loc = baseHref + href;
        }
        else if (href.match(/^https?\:/i) && !isThisDomain) {
          elEv.category = "external";
          elEv.action = "click";
          elEv.label = href.replace(/^https?\:\/\//i, '');
          elEv.non_i = true;
          elEv.loc = href;
        }
        else if (href.match(/^tel\:/i)) {
          elEv.category = "telephone";
          elEv.action = "click";
          elEv.label = href.replace(/^tel\:/i, '');
          elEv.loc = href;
        }
        else track = false;
 
        if (track) {
          ga('send','event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), elEv.value, elEv.non_i);
          if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
            setTimeout(function() { location.href = elEv.loc; }, 400);
            return false;
      }
    }
      }
    });

    // Kontakt form
    jQuery('input.wpcf7-submit').on('click', function() {
      ga('send', 'event', 'input', 'Send', 'kontakt');
    });
});
}

// YOUTUBE PLAYER TRACKING START

// This code loads the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady(event) {
  var videoCount = 0;
  jQuery('.youtube-video iframe').each(function(){
  videoCount++;

  player = new YT.Player('youtubeiframe'+videoCount, {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
});
}

// youtube tracking 
var pauseFlag = false;
function onPlayerReady(event) {
   // do nothing, no tracking needed
}

function onPlayerStateChange(event) {
    // track when user clicks to Play
    if (event.data == YT.PlayerState.PLAYING) {
        ga('send','event', 'Videos', 'Play', player.getVideoUrl());
        pauseFlag = true;
    }
    // track when user clicks to Pause
    if (event.data == YT.PlayerState.PAUSED && pauseFlag) {
        ga('send','event', 'Videos', 'Pause', player.getVideoUrl());
        pauseFlag = false;
    }
    // track when video ends
    if (event.data == YT.PlayerState.ENDED) {
        ga('send','event', 'Videos', 'Finished', player.getVideoUrl());
    }
}
// YOUTUBE PLAYER TRACKING SLUT