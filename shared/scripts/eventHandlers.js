function restrictCategoryScrolling() {
  const categoryContainer = document.getElementById("category-container");

  // Track touch start position
  let touchStartY = 0;
  let touchStartX = 0;
  let isHorizontalSwipe = false;

  categoryContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
    isHorizontalSwipe = false; // Reset swipe direction
  }, { passive: true });

  // Determine swipe direction and allow horizontal scrolling
  categoryContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY);
    const deltaX = Math.abs(touch.clientX - touchStartX);

    // Determine the dominant swipe direction
    if (!isHorizontalSwipe && (deltaX > deltaY)) {
      isHorizontalSwipe = true; // Mark as horizontal swipe
    }

    // Prevent vertical scrolling if the swipe is not horizontal
    if (!isHorizontalSwipe && deltaY > 0) {
      e.preventDefault();
    }
  }, { passive: false });

  // Add long press to delete category
  categoryContainer.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Prevent default touch behavior
      const categoryName = button.nextElementSibling.textContent; // Get category name from label
      const longPress = setTimeout(() => {
        if (confirm(`Delete category "${categoryName}"?`)) {
          removeCategory(categoryName); // Assumes removeCategory is globally accessible
        }
      }, 1000);
      button.addEventListener("touchend", () => clearTimeout(longPress));
    });
  });
}

// Export the function to be used in index.html
if (typeof module !== "undefined" && module.exports) {
  module.exports = { restrictCategoryScrolling };
} else {
  window.restrictCategoryScrolling = restrictCategoryScrolling;
}