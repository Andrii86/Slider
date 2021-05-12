(function() {
    const Slider = (function () {

        function cloneSlides(slides, count) {
            const slidesArray = Array.from(slides);
            const slidesCount = slidesArray.length;
            const firstSlidesArray = slidesArray.slice(
                slidesCount - count,
                slidesCount,
            ).reverse();
            const lastSlidesArray = slidesArray.slice(0, count);
            for (let i = 0; i < count; i++) {
                const cloneFirst = firstSlidesArray[i].cloneNode(true);
                const cloneLast = lastSlidesArray[i].cloneNode(true);
                cloneFirst.classList.add(`cloned_${i}`);
                cloneLast.classList.add(`cloned_${i}`);
                slidesArray.unshift(cloneFirst);
                slidesArray.push(cloneLast);
            }
            return slidesArray;
        }

        function createSliderArrow(content, className, handler) {
            const button = document.createElement('button');
            const text = document.createTextNode(content);
            button.classList.add(className)
            button.appendChild(text);
            button.addEventListener('click', handler);
            return button;
        }

        function createSliderTrackAndSlides(slides, count) {
            const newSlides = [];
            for (let i = 0; i < slides.length; i++) {
                const slideNode = document.createElement('div');
                slideNode.classList.add('slider-slide');
                slideNode.append(slides[i]);
                newSlides.push(slideNode);
            }
            const clonedSlides = cloneSlides(newSlides, count);
            const track = document.createElement('div');
            track.classList.add('slider-track');
            track.append(...clonedSlides);
            return track;
        }

        function createSliderListWrapper(children) {
            const list = document.createElement('div');
            list.classList.add('slider-list');
            list.append(children);
            return list;
        }

        function setSlidesWidth(slides, width) {
            Array.from(slides).forEach(slide => {
                slide.style.width = `${width}px`;
            })
        }

        function addTransition() {
            this.track.style.transition = `all ${this.options.speed}ms linear`;
        }

        function removeTransition() {
            this.track.style.transition = 'none';
        }

        function moveTrack() {
            this.track.style.transform = `translate3d(${-this.slideWidth * this.current}px, 0, 0)`;
        }

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

        Slider.prototype.init = function (options) {
            const _ = this;
            _.container.classList.add('slider-wrapper');
            _.slides = Array.from(_.container.children);
            _.isAnimating = false;
            _.interval;
            _.options = {...this.defaultOptions, ...options};
            _.current = 0;
            const cloneCount = _.options.slidesToShow + (_.options.slidesToShow - _.slides.length % _.options.slidesToShow);
            _.track = createSliderTrackAndSlides(_.slides, cloneCount);
            _.slideWidth = _.container.clientWidth / _.options.slidesToShow;
            _.track.style.marginLeft = `-${_.slideWidth * cloneCount}px`;
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
            setSlidesWidth(_.track.children, _.slideWidth);
            if(_.options.autoplay) {
                _.play();
            }
        }

        Slider.prototype.play = function() {
            const _ = this;
            window.clearInterval(_.interval);
            _.interval = window.setInterval(function () {
                if(!_.options.infinite && _.current >= _.slides.length - _.options.slidesToShow) {
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

        Slider.prototype.goTo = function (slide) {
            const _ = this, previousSlide = _.current;
            if(slide === _.current || _.isAnimating) {
                return;
            }
            _.options.beforeChange(_.current, slide);
            _.current = slide;
            _.isAnimating = true;
            addTransition.call(_);
            moveTrack.call(_);
            window.setTimeout(function () {
                _.options.afterChange(_.current, previousSlide);
                _.isAnimating = false;
                if (_.current >= _.slides.length) {
                    _.current = _.current - _.slides.length;
                    removeTransition.call(_);
                    moveTrack.call(_);
                }
                if (_.current <= -_.options.slidesToShow) {
                    _.current = _.slides.length + _.current;
                    removeTransition.call(_);
                    moveTrack.call(_);
                }
            }, _.options.speed);
        }

        Slider.prototype.prev = function() {
            const _ = this;
            const nextSlide = _.options.infinite
                ? _.current - _.options.slidesToScroll
                : Math.max(_.current - _.options.slidesToScroll, 0);
            _.goTo(nextSlide);
        };

        Slider.prototype.next = function() {
            const _ = this;
            const nextSlide = _.options.infinite
                ? _.current + _.options.slidesToScroll
                : Math.min(_.slides.length - _.options.slidesToScroll, _.current + _.options.slidesToScroll);
            _.goTo(nextSlide);
        };

        Slider.prototype.currentSlide = function () {
            return this.current;
        }

        return Slider;

    }());

    window.slider = function (element, options) {
        return new Slider(element, options);
    };
})()