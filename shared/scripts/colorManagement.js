// /jiffy/shared/scripts/categoryManagement.js
import { setColor } from './colorManagement.js';

// In-memory category data
let categories = [
  { id: 1, name: "Home", color: "#1E3A8A" },
  { id: 2, name: "Life", color: "#3B82F6" },
  { id: 3, name: "Work", color: "#60A5FA" },
  { id: 4, name: "School", color: "#93C5FD" }
];

// Save categories to storage
export function saveCategories(newCategories) {
  console.log("saveCategories: Saving categories:", newCategories);
  if (!Array.isArray(newCategories)) {
    console.error("saveCategories: Invalid categories, expected an array");
    return false;
  }
  categories = newCategories;
  try {
    localStorage.setItem("jiffyCategories", JSON.stringify(newCategories));
    console.log("saveCategories: Categories saved to localStorage");
    newCategories.forEach(category => {
      if (category.name && category.color) {
        setColor(category.name, category.color);
      }
    });
    return true;
  } catch (error) {
    console.error("saveCategories: Error saving categories:", error);
    return false;
  }
}

// Load categories from storage
export function loadCategories() {
  console.log("loadCategories: Loading categories");
  try {
    const stored = localStorage.getItem("jiffyCategories");
    if (!stored) {
      console.log("loadCategories: No stored categories, returning defaults");
      return categories;
    }
    const loaded = JSON.parse(stored);
    if (!Array.isArray(loaded) || !loaded.every(cat => cat.id && cat.name && cat.color)) {
      console.warn("loadCategories: Invalid data in localStorage, resetting to default");
      localStorage.setItem("jiffyCategories", JSON.stringify(categories));
      return categories;
    }
    console.log("loadCategories: Loaded categories:", loaded);
    return loaded;
  } catch (error) {
    console.error("loadCategories: Error loading categories:", error);
    return categories;
  }
}

// Add a new category
export function addCategory(name, color) {
  console.log("addCategory: Adding category:", name, color);
  const newCategory = {
    id: categories.length + 1,
    name,
    color: color || "#1E3A8A"
  };
  categories.push(newCategory);
  setColor(name, newCategory.color);
  saveCategories(categories);
  return newCategory;
}

// Get all categories
export function getCategories() {
  console.log("getCategories: Returning categories:", categories);
  return categories;
}