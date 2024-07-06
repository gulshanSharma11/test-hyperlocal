import React from 'react';

const CategoryDropdown = ({ categories, selectedCategory, handleCategoryChange }) => (
  <div className="dropdown">
    <label htmlFor="category-select">Choose a category:</label>
    <select
      id="category-select"
      value={selectedCategory}
      onChange={handleCategoryChange}
      aria-label="Select Category"
    >
      {categories.map((category) => (
        <option key={category.cat_id} value={category.cat_id.toString()}>
          {category.cat}
        </option>
      ))}
    </select>
  </div>
);

export default CategoryDropdown;
