function restrictCategoryScrolling() {
  const categoryContainer = document.getElementById("category-container");

  // Track touch start position and scroll state
  let touchStartX = 0;
  let touchStartY = 0;
  let isScrolling = false;

  categoryContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isScrolling = false;
  }, { passive: true });

  categoryContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Determine if the swipe is primarily horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isScrolling = true;
      // Allow horizontal scrolling by not preventing the event
    } else {
      // Prevent vertical scrolling
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