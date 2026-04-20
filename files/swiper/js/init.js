const lazyImages = document.querySelectorAll('img[loading="lazy"]'); // Get all images with the loading="lazy" attribute
function addLoadedClass(image) { // Function to add class to image parent after it is loaded
   const parentElement = image.parentElement;
   if (image.complete) { // Check if the image is loaded
      parentElement.classList.add('loaded');
   } else {
      image.addEventListener('load', function() { // Add a load event to add the class after the image has loaded
         parentElement.classList.add('loaded');
      });
   }
}
lazyImages.forEach(addLoadedClass); // Loop through all the images and call the addLoadedClass function for each one

/* === */

/* FS blocks -> */
const fsBlocksSlider = document.querySelector('.fs__blocks-slider')
if (fsBlocksSlider) {
   new Swiper(fsBlocksSlider, {
      effect: 'slide',
      slidesPerView: 'auto',
      spaceBetween: 11,
      speed: 800,
      freeMode: true,
   });
}
/* <- FS blocks */

/* Directions -> */
const directionsSlider = document.querySelector('.directions-slider')
if (directionsSlider) {
   new Swiper(directionsSlider, {
      slidesPerView: '5',
      slidesPerGroup: 1,
      watchOverflow: true,
      spaceBetween: 18,
      grabCursor: true,
      effect: 'slide',
      loop: true,
      speed: 800,
      pagination: {
         el: '#directions-pagination',
         clickable: true,
      },
      autoplay: {
         delay: 5000,
         stopOnLastSlide: false,
         disableOnInteraction: false,
      },
      breakpoints: {
         0: {
            slidesPerView: '1',
            slidesPerGroup: 1,
         },
         401: {
            slidesPerView: '2',
            slidesPerGroup: 1,
         },
         601: {
            slidesPerView: '3',
            slidesPerGroup: 1,
         },
         861: {
            slidesPerView: '4',
            slidesPerGroup: 1,
         },
         1025: {
            slidesPerView: '5',
            slidesPerGroup: 1,
         }
      },
   });
}
/* <- Directions */

/* Top products -> */

let swiperInstances = []; // Array to store all Swiper instances

// Function for initializing sliders
function initSliders() {
   const sliders = document.querySelectorAll('.top-products-slider');

   sliders.forEach(slider => {
      const wrapper = slider.querySelector('.top-products__items');
      const slides = slider.querySelectorAll('.top-products__item');

      // Add classes for Swiper
      if (wrapper && !wrapper.classList.contains('swiper-wrapper')) {
         wrapper.classList.add('swiper-wrapper');
      }

      slides.forEach(slide => {
         if (!slide.classList.contains('swiper-slide')) {
            slide.classList.add('swiper-slide');
         }
      });

      // Check if the instance already exists
      const existingInstance = swiperInstances.find(instance => instance.el === slider);
      if (!existingInstance) {
         const newSwiper = new Swiper(slider, {
            pagination: {
               el: '#top-products-slider-pagination',
               clickable: true,
            },
            watchOverflow: true,
            spaceBetween: 40,
            loop: true,
            speed: 800,
            effect: 'fade',
            autoHeight: true,
            slidesPerView: 1,
            preloadImages: false,
            lazy: {
               loadOnTransitionStart: false,
               loadPrewNext: false,
            },
            autoplay: {
               delay: 8000,
               stopOnLastSlide: false,
               disableOnInteraction: false,
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
         });

         swiperInstances.push(newSwiper);
      }
   });
}

// Function to destroy sliders and remove classes
function destroySliders() {
   swiperInstances.forEach(swiper => {
      swiper.destroy(true, true);
   });
   swiperInstances = []; // Clear the sliders array

   const sliders = document.querySelectorAll('.top-products-slider');

   sliders.forEach(slider => {
      const wrapper = slider.querySelector('.top-products__items');
      const slides = slider.querySelectorAll('.top-products__item');

      // Remove Swiper classes
      if (wrapper && wrapper.classList.contains('swiper-wrapper')) {
         wrapper.classList.remove('swiper-wrapper');
      }

      slides.forEach(slide => {
         if (slide.classList.contains('swiper-slide')) {
            slide.classList.remove('swiper-slide');
         }
      });
   });
}

// Function to control sliders depending on screen width
function toggleSliders() {
   if (window.innerWidth <= 640) {
      initSliders();
   } else {
      destroySliders();
   }
}

// Launch on page load
toggleSliders();

// Track window size changes
window.addEventListener('resize', toggleSliders);

// Track screen orientation changes
window.addEventListener('orientationchange', toggleSliders);

/* <- Top products */

/* What think Agro Took -> */
const whatThinkAgroTookSlider = document.querySelector('.what-think-agro-took-slider')
if (whatThinkAgroTookSlider) {
   new Swiper(whatThinkAgroTookSlider, {
      effect: 'slide',
      centeredSlides: true,
      slidesPerView: '3',
      slidesPerGroup: 1,
      spaceBetween: 50,
      loop: true,
      centeredSlides: true,
      speed: 800,
      pagination: {
         el: '#what-think-agro-took-pagination',
         clickable: true,
      },
      autoplay: {
         delay: 4000,
         stopOnLastSlide: true,
         disableOnInteraction: false,
      },
      breakpoints: {
         0: {
            autoHeight: true,
            spaceBetween: 30,
            slidesPerView: '1',
            autoplay: false,
         },
         641: {
            autoHeight: false,
            spaceBetween: 35,
            slidesPerView: '3',
            autoplay: false,
         },
         860: {
            spaceBetween: 50,
            autoplay: false,
         },
         1025: {
            autoplay: {
               delay: 4000,
               stopOnLastSlide: true,
               disableOnInteraction: false,
            },
            spaceBetween: 50,
         },
      },
   });
}
/* <- What think Agro Took */

/* blocks-with-picture-slider -> */

const blocksWithPictureSlider = document.querySelector('.blocks-with-picture-slider')
if (blocksWithPictureSlider) {
   new Swiper(blocksWithPictureSlider, {
      slidesPerView: '2',
      slidesPerGroup: 1,
      watchOverflow: true,
      spaceBetween: 12,
      grabCursor: true,
      effect: 'slide',
      /*mousewheel: {
         releaseOnEdges: true,
         sensitivity: 1,
         eventsTarget: ".blocks-with-picture-slider",
      },*/
      pagination: {
         el: '#blocks-with-picture-slider-pagination',
         clickable: true,
      },
      autoplay: {
         delay: 5000,
         stopOnLastSlide: true,
         disableOnInteraction: false,
      },
      breakpoints: {
         0: {
            autoHeight: true,
            slidesPerView: '1',
            slidesPerGroup: 1,
            speed: 800,
         },
         992: {
            autoHeight: false,
            direction: "vertical",
            freeMode: true,
            speed: 3000,
            slidesPerView: '2',
            slidesPerGroup: 1,
         }
      },
   });
}

/* <- blocks-with-picture-slider */


/* how-agro-took-works-slider -> */

let swiperInstances3 = []; // Array to store all Swiper instances

// Function for initializing sliders
function initSliders3() {
   const sliders3 = document.querySelectorAll('.how-agro-took-works-slider');

   sliders3.forEach(slider3 => {
      if (!slider3) return; // Пропускаем, если slider не найден

      const wrapper3 = slider3.querySelector('.how-agro-took-works__items');
      const slides3 = slider3.querySelectorAll('.how-agro-took-works__item');

      // Проверяем, есть ли wrapper и slides
      if (!wrapper3 || slides3.length === 0) {
         //console.warn("Не удалось найти элементы для Swiper: ", slider);
         return;
      }

      // Add classes for Swiper
      if (!wrapper3.classList.contains('swiper-wrapper')) {
         wrapper3.classList.add('swiper-wrapper');
      }

      slides3.forEach(slide3 => {
         if (!slide3.classList.contains('swiper-slide')) {
            slide3.classList.add('swiper-slide');
         }
      });

      // Check if the instance already exists
      const existingInstance3 = swiperInstances3.find(instance => instance.el === slider3);
      if (!existingInstance3) {
         try {
            const newSwipers3 = new Swiper(slider3, {
               pagination: {
                  el: "#how-agro-took-works-slider-pagination",
                  clickable: true,
               },
               watchOverflow: true,
               spaceBetween: 40,
               loop: true,
               speed: 800,
               effect: 'fade',
               autoHeight: true,
               slidesPerView: 1,
               preloadImages: false,
               lazy: {
                  loadOnTransitionStart: false,
                  loadPrewNext: false,
               },
               watchSlidesProgress: true,
               watchSlidesVisibility: true,
               autoplay: {
                  delay: 8000,
                  stopOnLastSlide: false,
                  disableOnInteraction: false,
               },
            });

            swiperInstances3.push(newSwipers3);
         } catch (error) {
            //console.error("Ошибка инициализации Swiper:", error);
         }
      }
   });
}

// Function to destroy sliders and remove classes
function destroySliders3() {
   swiperInstances3.forEach(swiper3 => {
      swiper3.destroy(true, true);
   });
   swiperInstances3 = []; // Clear the sliders array

   const sliders3 = document.querySelectorAll('.how-agro-took-works-slider');

   sliders3.forEach(slider3 => {
      const wrapper3 = slider3.querySelector('.how-agro-took-works__items');
      const slides3 = slider3.querySelectorAll('.how-agro-took-works__item');

      // Remove Swiper classes
      if (wrapper3 && wrapper3.classList.contains('swiper-wrapper')) {
         wrapper3.classList.remove('swiper-wrapper');
      }

      slides3.forEach(slide3 => {
         if (slide3.classList.contains('swiper-slide')) {
            slide3.classList.remove('swiper-slide');
         }
      });
   });
}

// Function to control sliders depending on screen width
function toggleSliders3() {
   if (window.innerWidth <= 640) {
      initSliders3();
   } else {
      destroySliders3();
   }
}

// Launch on page load
toggleSliders3();

// Track window size changes
window.addEventListener('resize', toggleSliders3);

// Track screen orientation changes
window.addEventListener('orientationchange', toggleSliders3);

/* <- how-agro-took-works-slider */


/* news-slider -> */

let swiperInstances2 = []; // Array to store all Swiper instances

// Function for initializing sliders
function initSliders2() {
   const sliders2 = document.querySelectorAll('.news-slider');

   sliders2.forEach(slider2 => {
      if (!slider2) return; // Пропускаем, если slider не найден

      const wrapper2 = slider2.querySelector('.news__items');
      const slides2 = slider2.querySelectorAll('.news__item');

      // Check if there is a wrapper and slides
      if (!wrapper2 || slides2.length === 0) {
         //console.warn("Не удалось найти элементы для Swiper: ", slider);
         return;
      }

      // Add classes for Swiper
      if (!wrapper2.classList.contains('swiper-wrapper')) {
         wrapper2.classList.add('swiper-wrapper');
      }

      slides2.forEach(slide2 => {
         if (!slide2.classList.contains('swiper-slide')) {
            slide2.classList.add('swiper-slide');
         }
      });

      // Check if the instance already exists
      const existingInstance2 = swiperInstances2.find(instance => instance.el === slider2);
      if (!existingInstance2) {
         try {
            const newSwipers2 = new Swiper(slider2, {
               pagination: {
                  el: "#news-slider-pagination",
                  clickable: true,
               },
               watchOverflow: true,
               spaceBetween: 40,
               loop: true,
               speed: 800,
               effect: 'fade',
               autoHeight: true,
               slidesPerView: 1,
               preloadImages: false,
               lazy: {
                  loadOnTransitionStart: false,
                  loadPrewNext: false,
               },
               watchSlidesProgress: true,
               watchSlidesVisibility: true,
               autoplay: {
                  delay: 8000,
                  stopOnLastSlide: false,
                  disableOnInteraction: false,
               },
            });

            swiperInstances2.push(newSwipers2);
         } catch (error) {
            //console.error("Ошибка инициализации Swiper:", error);
         }
      }
   });
}

// Function to destroy sliders and remove classes
function destroySliders2() {
   swiperInstances2.forEach(swiper2 => {
      swiper2.destroy(true, true);
   });
   swiperInstances2 = []; // Clear the sliders array

   const sliders2 = document.querySelectorAll('.news-slider');

   sliders2.forEach(slider => {
      const wrapper2 = slider.querySelector('.news__items');
      const slides2 = slider.querySelectorAll('.news__item');

      // Remove Swiper classes
      if (wrapper2 && wrapper2.classList.contains('swiper-wrapper')) {
         wrapper2.classList.remove('swiper-wrapper');
      }

      slides2.forEach(slide2 => {
         if (slide2.classList.contains('swiper-slide')) {
            slide2.classList.remove('swiper-slide');
         }
      });
   });
}

// Function to control sliders depending on screen width
function toggleSliders2() {
   if (window.innerWidth <= 640) {
      initSliders2();
   } else {
      destroySliders2();
   }
}

// Launch on page load
toggleSliders2();

// Track window size changes
window.addEventListener('resize', toggleSliders2);

// Track screen orientation changes
window.addEventListener('orientationchange', toggleSliders2);

/* <- news-slider */

/* preview-slider -> */
let swiper = new Swiper(".preview-bottom-slider", {
   loop: true,
   spaceBetween: 3,
   slidesPerView: 6,
   watchSlidesProgress: true,
   preloadImages: false,
   lazy: {
      loadOnTransitionStart: false,
      loadPrewNext: false,
   },
   watchSlidesProgress: true,
   watchSlidesVisibility: true,
   watchOverflow: true,
   breakpoints: {
      0: {
         slidesPerView: 3,
      },
      401: {
         slidesPerView: 4,
      },
      481: {
         slidesPerView: 5,
      },
      576: {
         slidesPerView: 6,
      }
   },
});
let swiper2 = new Swiper(".preview-slider", {
   loop: true,
   spaceBetween: 1,
   effect: 'fade',
   fadeEffect: {
      crossFade: true
   },
   navigation: {
     nextEl: ".swiper-button-next",
     prevEl: ".swiper-button-prev",
   },
   preloadImages: false,
   lazy: {
      loadOnTransitionStart: false,
      loadPrewNext: false,
   },
   watchSlidesProgress: true,
   watchSlidesVisibility: true,
   thumbs: {
     swiper: swiper,
   },
   watchOverflow: true,
});
/* <- preview-slider */