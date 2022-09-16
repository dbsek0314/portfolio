const Portfolio = (function () {
    let scrollTop = 0;
    let keyworkIndex = 1;
    let windowHeight = $(window).innerHeight();
    let $scrollWrapper;
    let $locomotive;

    function init() {
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        
        initScroll();
        initMotion();
        initNavigation();
    }

    // [NOTE] resize event
    function resizeHandler() {
        document.documentElement.style.setProperty('--app-width', document.documentElement.clientWidth+'px');
        document.documentElement.style.setProperty('--app-height', document.documentElement.clientHeight+'px');
        windowHeight = $(window).innerHeight();
        ScrollTrigger.update();
    }

    // [NOTE] init scrollWrapper scroll
    function initScroll() {
        $scrollWrapper = '.scroll_wrapper';
        $locomotive = new LocomotiveScroll({
            el: document.querySelector($scrollWrapper),
            smooth: true,
            // lerp: 0.08,
            multiplier: 0.3,
            scrollFromAnywhere: true,
        });
        
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ limitCallbacks: true  });

        $locomotive.scrollTo(0, 0, { duration: 0 });
        $locomotive.on('scroll', ScrollTrigger.update);
        ScrollTrigger.scrollerProxy($scrollWrapper, { 
            scrollTop: function(value) {
                return (arguments.length) ? $locomotive.scrollTo(value, 0, 0) : $locomotive.scroll.instance.scroll.y;
                },
            getBoundingClientRect: function() {
                return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                },
            pinType: function() {
                return document.querySelector($scrollWrapper).style.transform ? 'transform' : 'fixed';
            }
        });

        ScrollTrigger.addEventListener('refresh', function(){
            $locomotive.update();
        });

        $locomotive.on('scroll', function(e) {
            prevScrollTop = scrollTop;
            scrollTop = $locomotive.scroll.instance.scroll.y;
            
            scrollHandler(e);
        });

        ScrollTrigger.refresh();
    }

    // [NOTE] scroll event
    function scrollHandler(e) {
        $('section').each(function () {
            if ($(this).offset().top <= 0) {
                const thisSection = $(this).attr('id');
                $('.section_nav_list a').removeClass('active');
                $(`.section_nav_list a[href='#${thisSection}']`).addClass('active');
                
                if ($(this).hasClass('nav_white')) $('header').addClass('down_white');
                else $('header').removeClass('down_white');

                
            }
        })
    }

    // [NOTE] init animations
    function initMotion() {
        greeting();
        initMotionSectionLine();
        initMotionText();
        initMotionProject();
        initMotionAbout();
        initMotionInfo();
        initMotionKeywork();
    }
    
    // [NOTE] start animation
    function greeting() {
        $('#preloader').addClass('loaded');

        const typedTextSpan = $('.typed-text');
        const textArray = ['Hello', 'Yoong2'];
        const typingDelay = 100;
        const erasingDelay = 100;
        const newTextDelay = 1500; 
        let textArrayIndex = 0;
        let charIndex = 0;
        let currentIndex = 0;

        function type() {
            currentIndex++;

            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan[0].innerText += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan[0].innerText = textArray[textArrayIndex].substring(0, charIndex-1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if(textArrayIndex>=textArray.length) textArrayIndex=0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        if(textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    // [NOTE] section line animation
    function initMotionSectionLine() {
        $('.section_line').each(function (i, section) {
            const tlLine = gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start: 'top bottom',
                    end: `${windowHeight} ${windowHeight*0.9}`,
                    scrub: 1,
                    // markers: true
                }
            })
                tlLine.fromTo(this, { clipPath: 'polygon(0 40vh, 100% 0, 100% 100%, 0% 100%)' }, { clipPath: 'polygon(0 0vh, 100% 0, 100% 100%, 0% 100%)', duration: 1 })
                if ( $(this).prev().find('.section_about_character').length > 0 ) tlLine.fromTo($(this).prev().find('.section_about_character'), { y: 0 }, { y: '-30%', duration: 1 }, 0)
                if ( $(this).prev().find('.info_grid').length > 0 ) tlLine.fromTo($(this).prev().find('.info_grid'), { marginTop: 0 }, { marginTop: '-15%', duration: 1 }, 0)
                if ( $(this).prev().find('.video_canvas').length > 0 ) tlLine.fromTo($(this).prev().find('.video_canvas'), { marginTop: 0 }, { marginTop: '-15%', duration: 1 }, 0)
        })
    }
    
    // [NOTE] sticky text animation
	function initMotionText() {
        $('.sticky_text_area').each(function (i, section) {
			gsap.timeline( {scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    pin: $('.sticky_text_inner', section),
                    pinSpacing: false,
                    // markers: true,
                }
            })
				.to($('.sticky_text', section), {duration: .25})
				.fromTo($('.sticky_text', section), { autoAlpha: 0, y: '5vh' }, { autoAlpha: 1, y: '0vh', stagger: .2 })
				.to($('.sticky_text', section), { autoAlpha: 0, y: '-5vh', duration: 1.5 }, '+=1.5')
		});
    }

    // [NOTE] about
    function initMotionAbout() {
        $('.section_about').each(function () {
            gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: true,
                    pinSpacing: false,
                    scrub: 1,
                    // markers: true
                }
            })
                .fromTo($('.section_about_logo', this), { y: 0 }, { y: '50%', duration: 0.5 }, 0)
                .fromTo($('.section_about_logo', this), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0)
                .fromTo($('.section_about_imgs', this), { y: 0 }, { y: '-50vh' }, 0)
                .fromTo($('.section_about_title', this), { autoAlpha: 0 }, { autoAlpha: 1 })
                .fromTo($('.about_title_inner', this), { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1 })
                .fromTo($('.about_title_inner', this), { autoAlpha: 1 }, { autoAlpha: 0 }, 2)
                .fromTo($('.section_about_title', this), { autoAlpha: 1 }, { autoAlpha: 0, duration: 1 }, 2.5)
                .fromTo($('.section_about_inner', this), { backgroundColor: '#1E1E1E' }, { backgroundColor: '#5026a5', duration: 1 }, 2.5)
                .fromTo($('.section_about_imgs .section_about_character', this), { x: 0, height: '117.7777vh' }, { x: '-20%', height: '100.7777vh', duration: 1 }, 2.5)
                .fromTo($('.about_desc1', this), { marginTop: '50px', autoAlpha: 0 }, { marginTop: 0, autoAlpha: 1, duration: 1 }, 2.5)
                .fromTo($('.about_desc1', this), { autoAlpha: 1 }, { autoAlpha: 0 }, 3.5)
                .fromTo($('.about_desc2', this), { marginTop: '50px', autoAlpha: 0 }, { marginTop: 0, autoAlpha: 1 }, 4)
                .fromTo($('.section_about_imgs .character_img_eyeroll', this), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 5)
                .to($('.section_about_imgs .character_img_eyeroll', this), { autoAlpha: 1 }, 5.5)
                .fromTo($('.about_desc2', this), { autoAlpha: 1 }, { autoAlpha: 0 }, 6)
                .fromTo($('.about_desc3', this), { marginTop: '50px', autoAlpha: 0 }, { marginTop: 0, autoAlpha: 1 }, 7)
                .fromTo($('.section_about_imgs .character_img_wink', this), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 7)
                .fromTo($('.about_desc3', this), { autoAlpha: 1 }, { autoAlpha: 0 }, 8)
                .fromTo($('.about_desc4', this), { marginTop: '50px', autoAlpha: 0 }, { marginTop: 0, autoAlpha: 1 }, 8.5)
                .fromTo($('.section_about_imgs .character_img_like', this), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 8.5)
                .fromTo($('.about_desc4', this), { autoAlpha: 1 }, { autoAlpha: 0 }, 9.5)
                .fromTo($('.about_desc5', this), { marginTop: '50px', autoAlpha: 0 }, { marginTop: 0, autoAlpha: 1 }, 10)
                .to($('.about_desc5', this), { autoAlpha: 1 }, 12)
            
        })
    }

    // [NOTE] info
    function initMotionInfo() {
        $('.section_info').each(function () {
            gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start:'top bottom',
                    end: 'bottom bottom',
                    scrub: 1,
                    // markers: true
                }
            })
                    .fromTo($('.info_bg', this), { y: '20%' }, { y: '50%' })
        })
        
        $('.info_grid_text li').each( function() {
            gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start:'top bottom',
                    end: 'bottom 70%',
                    scrub: 1,
                    // markers: true,
                }
             })
                .fromTo($('.info_keywork span', this), { y: '100%' }, { y: 0, stagger: .08 }, '-=2')
         });
    }
    
    // [NOTE] thumbnail up animation
	function initMotionProject() {
        $('.section_project').each(function () {
            gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    // markers: true,
                }
            })
		});
	}
     
    // [NOTE] Keywork
    function initMotionKeywork() {   
        $('.section_keywork_inner').each(function (i) {
            keyworkIndex = i + 1;

            const thisVideo = $(`#keyworkVideo${keyworkIndex}`)[0];
            initVideoCanvas(thisVideo);
            preloadImages(thisVideo);
    
            gsap.timeline({
                scrollTrigger: {
                    scroller: $scrollWrapper,
                    trigger: this,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    pin: this,
                    pinSpacing: false,
                    onEnter: function(e) {
                        enterKeywork(e, thisVideo);
                    },
                    onEnterBack: function(e) {
                        enterKeywork(e, thisVideo);
                    },
                    // markers: true,
                }
            })
                .fromTo(thisVideo, { frame: 0 }, { frame: thisVideo._frame.to - thisVideo._frame.from, 
                    onUpdate: function () {
                        updateVideoFrame(thisVideo);
                    }
                })
        });
    }
    
    // [NOTE] init navigation
    function initNavigation() {
        // [NOTE] add sections offset
        let arrTarget = [];
        $('.section_nav a').each(function (i, target) {
            setTimeout(function () {
                const thisSection = $(target).attr('href').replace('#', '');   
                let sectionTop = $(`#${thisSection}`).offset().top;

                if (i !== 0) sectionTop = scrollTop + $(`#${thisSection}`).offset().top + (windowHeight * 0.5);
                if (thisSection === 'info') sectionTop = scrollTop + $(`#${thisSection}`).offset().top + (windowHeight * 0.1);
                if (thisSection === 'project') sectionTop = scrollTop + $(`#${thisSection}`).offset().top + (windowHeight * 0.1);

                arrTarget.push(sectionTop);
            }, 300)
        })

        // [NOTE] go to section
        $('.section_nav a').on('click', function () {
            const index = $(this).parent().index();
            $locomotive.scrollTo(arrTarget[index], { duration: 500 });
            return false;
        });
    }
            
    // [NOTE] video sequence - canvas / initVideoCanvas() ~ preloadImages()
    function initVideoCanvas(videoCanvas) {
        const thisVideoCanvas = $('canvas', videoCanvas)[0];
        const thisVideoWidth = thisVideoCanvas.width;
        const thisVideoHeight = thisVideoCanvas.height;
        thisVideoCanvas.width = thisVideoWidth;
        thisVideoCanvas.height = thisVideoHeight;

        videoCanvas._frame = {
            canvasCtx: thisVideoCanvas.getContext('2d'),
            from: videoCanvas.getAttribute('data-from'),
            to: videoCanvas.getAttribute('data-to'),
            filename: videoCanvas.getAttribute('data-filename'),
            folder: videoCanvas.getAttribute('data-folder')
        };

        videoCanvas._frame.strLen = videoCanvas._frame.from.toString().length;
        videoCanvas._frame.thisVideoImg = new Image();
        videoCanvas._frame.thisVideoImg.width = thisVideoWidth;
        videoCanvas._frame.thisVideoImg.height = thisVideoHeight;
        videoCanvas._frame.thisVideoImg.onload = function() {
            videoCanvas._frame.canvasCtx.drawImage(videoCanvas._frame.thisVideoImg, 0, 0);
        };

        videoCanvas._frame.thisVideoImg.src = getVideoFrameSrc(videoCanvas, videoCanvas._frame.from);
        videoCanvas.frame = 0;
    }

    function getVideoFrameSrc(video, currentFrame) {
        let index = `${currentFrame}`;
        index = index.slice(-video._frame.strLen);
        return `${video._frame.folder}${keyworkIndex}/${video._frame.filename+index}.jpg`;
    }
    
    function enterKeywork(e, thisVideo) {
        if (e.direction == 1) {
            updateVideoFrameFrom(thisVideo);
        } else {
            updateVideoFrameTo(thisVideo);
        }
    }

    function updateVideoFrame(video) {
        const currentFrame = Math.round(video.frame);
        if ( video.currentFrame != currentFrame ) {
            drawVideoFrame(video, currentFrame);
        }
    }

    function updateVideoFrameFrom(video) {
        drawVideoFrame(video, 0);
    }

    function updateVideoFrameTo(video) {
        drawVideoFrame(video, video._frame.to - video._frame.from);
    }

    function drawVideoFrame(video, currentFrame) {
        video.currentFrame = currentFrame;

        if (video._frame.images && video._frame.images[currentFrame]) {
            video._frame.canvasCtx.drawImage(video._frame.images[currentFrame], 0, 0);
        }
    }

    function preloadImages(video) {
        video._frame.images = [];
        for ( let i = video._frame.from; i <= video._frame.to; ++i ) {
            const thisVideoImg = new Image();
            thisVideoImg.src = getVideoFrameSrc(video, i);
            video._frame.images.push(thisVideoImg);
        }
    }

    return {
        init: init
    }
 })();

$(window).on('load', function () {
    Portfolio.init();
});