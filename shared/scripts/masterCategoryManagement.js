// File: /jiffy/shared/scripts/masterCategoryManagement.js
// Purpose: Manages master category tab behavior on the Jiffy homepage.
// Highlights the active tab, stores selected tab in localStorage, and restores it on page load.

function initializeMasterCategoryTabs() {
  const masterButtons = document.querySelectorAll('.master-category-button');
  const ACTIVE_CLASS = 'active-master-tab';
  const STORAGE_KEY = 'activeMasterCategory';

  if (!masterButtons.length) {
    console.warn('masterCategoryManagement.js: No master category buttons found.');
    return;
  }

  // Apply active tab from storage (if any)
  const storedTab = localStorage.getItem(STORAGE_KEY);
  if (storedTab) {
    masterButtons.forEach(btn => {
      const isActive = btn.dataset.tab === storedTab;
      btn.classList.toggle(ACTIVE_CLASS, isActive);
    });
  }

  // Add click listeners to each tab
  masterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedTab = button.dataset.tab;

      // Store active tab
      localStorage.setItem(STORAGE_KEY, selectedTab);

      // Highlight active tab
      masterButtons.forEach(btn => {
        btn.classList.toggle(ACTIVE_CLASS, btn === button);
      });

      // (Optional: Trigger filtering or UI updates here)
      console.log(`Master tab changed to: ${selectedTab}`);
    });
  });
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
  initializeMasterCategoryTabs();
});
