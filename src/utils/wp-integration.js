/**
 * WordPress integration utilities
 */

/**
 * Get WordPress preset value by slug
 * 
 * @param {string} type - Type of preset (color, font-size, etc.)
 * @param {string} slug - Preset slug
 * @returns {string} CSS custom property
 */
export const getWpPreset = (type, slug) => {
  return `var(--wp--preset--${type}--${slug})`;
};

/**
 * Generate WordPress alignment class names
 * 
 * @param {string} alignment - Alignment value
 * @returns {string} Class name
 */
export const getAlignmentClass = (alignment) => {
  if (!alignment) return '';
  return alignment === 'center' ? 'aligncenter' : `align${alignment}`;
};

/**
 * Generate WordPress color class names
 * 
 * @param {string} colorSlug - Color slug
 * @param {string} type - Type (background, text, border)
 * @returns {string} Class name
 */
export const getColorClass = (colorSlug, type = 'text') => {
  if (!colorSlug) return '';
  return `has-${colorSlug}-${type === 'background' ? 'background-' : ''}color`;
};

/**
 * Generate WordPress font size class name
 * 
 * @param {string} fontSize - Font size slug
 * @returns {string} Class name
 */
export const getFontSizeClass = (fontSize) => {
  if (!fontSize) return '';
  return `has-${fontSize}-font-size`;
};

/**
 * Combine WordPress and custom class names
 * 
 * @param {Array} classes - Array of class names
 * @returns {string} Combined class names
 */
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};