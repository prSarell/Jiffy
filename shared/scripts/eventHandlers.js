document.addEventListener('DOMContentLoaded', () => {
  // Initialize Swiper
  const swiper = new Swiper('#scrollSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    centeredSlides: false,
    slideToClickedSlide: true,
    grabCursor: true
  });

  // Add console logging for debugging
  console.log("jiffy: Page loaded at", new Date());
  console.log("jiffy: Checking PWA setup...");
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log("jiffy: Running in standalone mode");
  } else {
    console.error("jiffy: NOT running in standalone mode");
  }
  console.log("jiffy: Checking swiper container...");
  const swiperContainer = document.getElementById("scrollSwiper");
  const swiperSlides = document.querySelectorAll(".swiper-slide");
  const headerPlaceholder = document.getElementById("placeholder-header");
  const paginationPlaceholder = document.getElementById("placeholder-pagination");
  if (swiperContainer) {
    console.log("jiffy: Swiper container found, bounding rect:", swiperContainer.getBoundingClientRect());
  } else {
    console.error("jiffy: Swiper container not found!");
  }
  if (swiperSlides.length > 0) {
    swiperSlides.forEach((slide, index) => {
      console.log(`jiffy: Swiper slide ${index + 1} found, bounding rect:`, slide.getBoundingClientRect());
    });
  } else {
    console.error("jiffy: Swiper slides not found!");
  }
  if (headerPlaceholder) {
    console.log("jiffy: Header placeholder found, bounding rect:", headerPlaceholder.getBoundingClientRect());
  } else {
    console.error("jiffy: Header placeholder not found!");
  }
  if (paginationPlaceholder) {
    console.log("jiffy: Pagination placeholder found, bounding rect:", paginationPlaceholder.getBoundingClientRect());
  } else {
    console.error("jiffy: Pagination placeholder not found!");
  }
});