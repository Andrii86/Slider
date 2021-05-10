(function() {

    function createSliderArrow(content, className, handler) {
        const button = document.createElement('button');
        const text = document.createTextNode(content);
        button.classList.add(className);
        button.appendChild(text);
        button.addEventListener('click', handler);
        return button;
    }

    function createSliderTrackAndSlides(slides) {
        const newSlides = [];
        for (let i = 0; i < slides.length; i++) {
            const slideNode = document.createElement('div');
            slideNode.classList.add('slider-slide');
            slideNode.append(slides[i]);
            newSlides.push(slideNode);
        }
        const track = document.createElement('div');
        track.classList.add('slider-track');
        track.append(...newSlides);
        return track;
    }

    function cloneSlides(slides, count) {
        const clonedSlides = [...slides];
        const firstClone = slides.slice(Math.max(slides.length - 4, 0)).reverse();
        const lastClone = slides.slice(0, 4);
        for (let i = 0; i < count; i++) {
            const cloneFirst = firstClone[i].cloneNode();
            const cloneLast = lastClone[i].cloneNode();
            cloneFirst.classList.add(`clone_${i}`);
            cloneLast.classList.add(`clone_${i}`);
            clonedSlides.unshift(cloneFirst);
            clonedSlides.push(cloneLast);
        }
        return clonedSlides;
    }

    function createSliderListWrapper(children) {
        const list = document.createElement('div');
        list.classList.add('slider-list');
        list.append(children);
        return list;
    }

    function setSlideWidth(width) {
        const slides = document.getElementsByClassName('slider-slide');
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.width = `${width}px`;
        }
    }

    const Slider = (function () {

        function Slider(element, settings) {
            this.container = document.getElementById(element);
            this.defaultOptions = {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                autoplay: false,
                pauseOnHover: false,
                speed: 300,
                autoplaySpeed: 2000,
                beforeChange: function () {},
                afterChange: function () {}
            }
            this.init(settings);
        }

        return Slider;

    }());

    Slider.prototype.init = function (options) {
        const _ = this, slides = Array.from(_.container.children);
        _.interval;
        _.options = {...this.defaultOptions, ...options};
        _.current = 0;
        _.track = createSliderTrackAndSlides(slides);
        _.list = createSliderListWrapper(_.track);
        _.prevArrow = createSliderArrow('prev', 'slider-prev', function () {
            _.prev();
        });
        _.nextArrow = createSliderArrow('next', 'slider-next', function () {
            _.next();
        });
        _.container.append(_.prevArrow, _.list, _.nextArrow);
        if(_.options.pauseOnHover) {
            _.container.addEventListener('mouseenter', function () {
                if(_.options.autoplay) {
                    _.pause();
                }
            });
            _.container.addEventListener('mouseleave', function () {
                if(_.options.autoplay) {
                    _.play();
                }
            });
        }
        _.slideWidth = _.container.clientWidth / _.options.slidesToShow;
        setSlideWidth(_.slideWidth);
        if(_.options.autoplay) {
            _.play();
        }
    }

    Slider.prototype.play = function() {
        const _ = this;
        _.interval = window.setInterval(function () {
            if(_.current === _.track.children.length - 1) {
                _.goTo(0);
            } else {
                _.next();
            }
        }, _.options.autoplaySpeed + _.options.speed);
    };

    Slider.prototype.pause = function() {
        const _ = this;
        window.clearInterval(_.interval);
    }


    Slider.prototype.goTo = function(slide) {
        const _ = this;
        _.options.beforeChange();
        _.current = slide;
        _.track.style.transition = `all ${_.options.speed}ms linear`;
        _.track.style.transform = `translate3d(-${_.slideWidth * _.options.slidesToScroll * slide}px, 0, 0)`;
        window.setTimeout(_.options.afterChange, _.options.speed);
        console.log('GOTO');
    };

    Slider.prototype.prev = function() {
        const _ = this;
        _.goTo(Math.max(0, _.current - 1));
    };

    Slider.prototype.next = function() {
        const _ = this;
        _.goTo(Math.min(_.current + 1, _.track.children.length - 1));
    };

    Slider.prototype.currentSlide = function () {
        return this.current;
    }

    window.slider = function (element, options) {
        return new Slider(element, options);
    };
})()