function restrictCategoryScrolling() {
  const categoryContainer = document.getElementById("category-container");

  // Track touch start position
  let touchStartY = 0;
  let touchStartX = 0;

  categoryContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
  }, { passive: true });

  // Prevent vertical scrolling on touchmove
  categoryContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY);
    const deltaX = Math.abs(touch.clientX - touchStartX);

    // If the vertical movement is greater than horizontal, prevent the event
    if (deltaY > deltaX) {
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