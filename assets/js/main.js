const mySlider = window.slider('my-slider', {
    slidesToShow: 3,
    slidesToScroll: 2,
    infinite: false,
    autoplay: true,
    pauseOnHover: true,
    speed: 300,
    autoplaySpeed: 2000,
    beforeChange: function (){
        console.log('before change')
    },
    afterChange: function (){
        console.log('after change')
    },
});

console.log(mySlider)