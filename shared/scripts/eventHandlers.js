function setupScrollTest() {
  const scrollContainer = document.getElementById("scroll-container");
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"]; // Red, Green, Blue, Yellow, Magenta

  // Generate 5 colored circles
  colors.forEach(color => {
    const circle = document.createElement("div");
    circle.className = "scroll-circle";
    circle.style.backgroundColor = color;
    scrollContainer.appendChild(circle);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { setupScrollTest };
} else {
  window.setupScrollTest = setupScrollTest;
}