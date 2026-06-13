(function() {
  "use strict";

  window.setupMoviePlayer = function(options) {
    var video = document.getElementById(options.videoId);
    var trigger = document.getElementById(options.triggerId);
    var cover = document.getElementById(options.coverId);
    var source = options.source;
    var hlsInstance = null;

    function attach() {
      if (!video || !source || video.getAttribute("data-ready") === "1") {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.setAttribute("data-ready", "1");
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        video.setAttribute("data-ready", "1");
        return;
      }
      video.src = source;
      video.setAttribute("data-ready", "1");
    }

    function play() {
      if (!video) {
        return;
      }
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      video.setAttribute("controls", "controls");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function() {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      }
    }

    if (trigger) {
      trigger.addEventListener("click", play);
    }
    if (cover) {
      cover.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function() {
        if (video.paused) {
          play();
        }
      });
    }
    window.addEventListener("beforeunload", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
