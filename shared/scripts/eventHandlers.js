function restrictCategoryScrolling() {
  const categoryContainer = document.getElementById("category-container");

  // Allow horizontal scrolling by default, only prevent vertical motion
  categoryContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touch.startX;
    const deltaY = touch.clientY - touch.startY;

    // Prevent vertical scrolling if there's any vertical movement
    if (Math.abs(deltaY) > 0) {
      e.preventDefault();
    }
  }, { passive: false });

  // Add long press to delete category
  categoryContainer.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("touchstart", (e) => {
      e.stopPropagation(); // Prevent touch event from bubbling up
      const categoryName = button.nextElementSibling.textContent; // Get category name from label
      const longPress = setTimeout(() => {
        if (confirm(`Delete category "${categoryName}"?`)) {
          removeCategory(categoryName); // Assumes removeCategory is globally accessible
        }
      }, 1000);
      button.addEventListener("touchend", () => clearTimeout(longPress));
      button.addEventListener("touchmove", () => clearTimeout(longPress)); // Cancel long press on move
    }, { passive: false });
  });
}

// Export the function to be used in index.html
if (typeof module !== "undefined" && module.exports) {
  module.exports = { restrictCategoryScrolling };
} else {
  window.restrictCategoryScrolling = restrictCategoryScrolling;
}