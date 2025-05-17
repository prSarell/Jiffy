document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');

  // Prevent pinch-to-zoom and double-tap zoom on iPhone
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  // Enhance touch scrolling with momentum
  let isScrolling = false;
  let startX = 0;
  let scrollLeft = 0;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - scrollLeft;
    isScrolling = true;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX;
    scrollLeft = x - startX;
    scrollContainer.scrollLeft = scrollLeft;
  });

  scrollContainer.addEventListener('touchend', () => {
    isScrolling = false;
  });

  // Add console logging for debugging
  console.log("jiffy: Page loaded at", new Date());
  console.log("jiffy: Checking PWA setup...");
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log("jiffy: Running in standalone mode");
  } else {
    console.error("jiffy: NOT running in standalone mode");
  }
  console.log("jiffy: Checking scroll container...");
  const scrollItems = document.querySelectorAll(".scroll-item");
  if (scrollContainer) {
    console.log("jiffy: Scroll container found, bounding rect:", scrollContainer.getBoundingClientRect());
  } else {
    console.error("jiffy: Scroll container not found!");
  }
  if (scrollItems.length > 0) {
    scrollItems.forEach((item, index) => {
      console.log(`jiffy: Scroll item ${index + 1} found, bounding rect:`, item.getBoundingClientRect());
    });
  } else {
    console.error("jiffy: Scroll items not found!");
  }
});