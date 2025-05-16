function setupCategories() {
  const categoryContainer = document.getElementById("category-container");
  const categories = [
    { name: "Home", color: "#1E3A8A" },
    { name: "Life", color: "#3B82F6" },
    { name: "Work", color: "#60A5FA" },
    { name: "School", color: "#93C5FD" }
  ];

  categoryContainer.innerHTML = ''; // Clear existing buttons
  categories.forEach(category => {
    const categoryItem = document.createElement("div");
    categoryItem.className = "category-item";

    const categoryButton = document.createElement("span");
    categoryButton.className = "category-button";
    categoryButton.style.backgroundColor = category.color;

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "category-label";
    categoryLabel.textContent = category.name;

    categoryItem.appendChild(categoryButton);
    categoryItem.appendChild(categoryLabel);
    categoryContainer.appendChild(categoryItem);
  });

  // Add long press to delete category
  categoryContainer.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("touchstart", (e) => {
      e.stopPropagation(); // Prevent touch event from bubbling up
      const categoryName = button.nextElementSibling.textContent; // Get category name from label
      const longPress = setTimeout(() => {
        if (confirm(`Delete category "${categoryName}"?`)) {
          button.parentElement.remove(); // Simplified for minimal setup
        }
      }, 1000);
      button.addEventListener("touchend", () => clearTimeout(longPress));
      button.addEventListener("touchmove", () => clearTimeout(longPress)); // Cancel long press on move
    }, { passive: false });
  });
}

// Export the function to be used in index.html
if (typeof module !== "undefined" && module.exports) {
  module.exports = { setupCategories };
} else {
  window.setupCategories = setupCategories;
}