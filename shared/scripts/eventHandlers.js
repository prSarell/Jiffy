function restrictCategoryScrolling() {
  const categoryContainer = document.getElementById("category-container");

  // Track touch start position
  let startX = 0;
  let startY = 0;

  categoryContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  }, { passive: true });

  // Allow horizontal scrolling while preventing vertical scrolling
  categoryContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    // If the swipe is primarily vertical, prevent it
    if (deltaY > deltaX) {
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