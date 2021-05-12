const slider = window.slider('my-slider', {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: false,
    pauseOnHover: false,
    speed: 300,
    autoplaySpeed: 2000,
    beforeChange: function (currentSlide, nextSlide) {
        console.log('BEFORE CHANGE >>> current => ', currentSlide, ' | next => ', nextSlide);
    },
    afterChange: function (currentSlide, previousSlide) {
        console.log('AFTER CHANGE >>> current => ', currentSlide, ' | previous => ', previousSlide);
    }
});

console.log(slider);