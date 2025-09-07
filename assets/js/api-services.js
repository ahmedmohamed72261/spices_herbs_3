/**
 * API Services for Gardenic Website
 * This file contains functions to fetch data from the backend API
 */

const API_BASE_URL = 'https://kingdom-spices-herbs-backend-dashbo.vercel.app/api';

/**
 * Fetch categories from the API
 * @returns {Promise<Array>} Array of categories
 */
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(category => ({
        id: category._id,
        name: category.name,
        productCount: category.productCount,
        slug: category.slug
      }));
    } else {
      console.error('Error fetching categories:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch products from the API
 * @param {Object} options - Options for filtering products
 * @param {string} options.categoryId - Filter by category ID
 * @returns {Promise<Array>} Array of products
 */
async function fetchProducts(options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (data.success) {
      let products = data.data.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
        category: {
          id: product.category._id,
          name: product.category.name,
          slug: product.category.slug
        },
        createdAt: new Date(product.createdAt),
        inStock: product.inStock
      }));
      
      // Filter by category if specified
      if (options.categoryId) {
        products = products.filter(product => product.category.id === options.categoryId);
      }
      
      return products;
    } else {
      console.error('Error fetching products:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a specific product by ID
 * @param {string} id - The product ID
 * @returns {Promise<Object>} - The product data
 */
async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch product');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Format date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Whether the copy was successful
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Fetch certificates from the API
 * @returns {Promise<Array>} Array of certificates
 */
async function fetchCertificates() {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(certificate => ({
        id: certificate._id,
        name: certificate.name,
        description: certificate.description,
        image: certificate.image,
        isActive: certificate.isActive,
        category: certificate.category
      }));
    } else {
      console.error('Error fetching certificates:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}

/**
 * Fetch team members from the API
 * @returns {Promise<Array>} Array of team members
 */
async function fetchTeam() {
  try {
    const response = await fetch(`${API_BASE_URL}/team`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(member => ({
        id: member._id,
        name: member.name,
        position: member.position,
        image: member.image,
        email: member.email,
        phone: member.phone,
        whatsapp: member.whatsapp,
        isActive: member.isActive
      }));
    } else {
      console.error('Error fetching team:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

/**
 * Fetch contact information from the API
 * @returns {Promise<Array>} Array of contact information
 */
async function fetchContact() {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(item => ({
        id: item._id,
        type: item.type,
        label: item.label,
        value: item.value
      }));
    } else {
      console.error('Error fetching contact info:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return [];
  }
}

/**
 * Send a message to the API
 * @param {Object} messageData - The message data to send
 * @returns {Promise<Object>} The response from the API
 */
async function sendMessage(messageData) {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to send message');
    }
    
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}