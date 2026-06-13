(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".nav-menu");

        if (menuButton && menu) {
            menuButton.addEventListener("click", function () {
                var open = menu.classList.toggle("open");
                menuButton.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var prev = carousel.querySelector(".hero-arrow.prev");
            var next = carousel.querySelector(".hero-arrow.next");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                    start();
                });
            });

            carousel.addEventListener("mouseenter", stop);
            carousel.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll(".site-search").forEach(function (input) {
            input.addEventListener("input", function () {
                var targetId = input.getAttribute("data-target");
                var target = targetId ? document.getElementById(targetId) : document;
                var scope = target || document;
                var query = input.value.trim().toLowerCase();

                scope.querySelectorAll(".movie-card, .rank-row").forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-tags") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ").toLowerCase();

                    card.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
                });
            });
        });

        document.querySelectorAll(".filter-chip").forEach(function (chip) {
            chip.addEventListener("click", function () {
                var value = chip.getAttribute("data-filter") || "all";
                var scope = chip.closest(".search-scope") || document;

                scope.querySelectorAll(".filter-chip").forEach(function (item) {
                    item.classList.toggle("active", item === chip);
                });

                scope.querySelectorAll(".movie-card").forEach(function (card) {
                    var tags = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-tags") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ");

                    card.classList.toggle("is-hidden", value !== "all" && tags.indexOf(value) === -1);
                });
            });
        });

        document.querySelectorAll(".video-player").forEach(function (player) {
            var video = player.querySelector("video");
            var poster = player.querySelector(".player-poster");
            var message = player.querySelector(".player-message");
            var source = player.getAttribute("data-src");
            var loaded = false;
            var hls = null;

            function fail() {
                player.classList.add("is-error");
                if (message) {
                    message.textContent = "视频暂时无法播放，请稍后再试";
                }
            }

            function load() {
                if (loaded || !video || !source) {
                    return;
                }

                loaded = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });

                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal) {
                            fail();
                        }
                    });
                    return;
                }

                fail();
            }

            function play() {
                load();

                if (!video) {
                    return;
                }

                var result = video.play();

                if (result && typeof result.catch === "function") {
                    result.catch(function () {});
                }
            }

            if (poster) {
                poster.addEventListener("click", play);
            }

            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        play();
                    }
                });

                video.addEventListener("play", function () {
                    player.classList.add("is-playing");
                });

                video.addEventListener("pause", function () {
                    if (!video.ended) {
                        player.classList.remove("is-playing");
                    }
                });

                video.addEventListener("error", fail);
            }

            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    });
})();
