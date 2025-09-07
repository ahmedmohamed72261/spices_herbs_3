/**
 * Products Integration for Gardenic Website
 * This file integrates products data into the website
 */

// Wait for window load to ensure all scripts are loaded
window.addEventListener('load', async function() {
  // Initialize products in the Recent Work section on index.html
  initializeRecentWorkSection();
  
  // Initialize products page if we're on products.html
  if (window.location.pathname.includes('products.html')) {
    initializeProductsPage();
  }
  
  // Initialize product details page if we're on product-details.html
  if (window.location.pathname.includes('product-details.html')) {
    initializeProductDetailsPage();
  }
});

/**
 * Initialize the Recent Work section on the homepage
 */
async function initializeRecentWorkSection() {
  try {
    // Find the Recent Work section in index.html
    const recentWorkSection = document.getElementById('recent-work-section');
    if (!recentWorkSection) return;
    
    // Get the container for products
    const productsContainer = document.getElementById('recent-products-container');
    if (!productsContainer) return;
    
    // Fetch products
    const products = await fetchProducts();
    
    // Display only the first 6 products
    const displayProducts = products.slice(0, 6);
    
    // Clear existing content
    productsContainer.innerHTML = '';
    
    // Add products to the container
    displayProducts.forEach(product => {
      const productCol = document.createElement('div');
      productCol.className = 'col-lg-4 col-md-6 my-5';
      
      productCol.innerHTML = `
        <div class="protfolio-single-box">
          <div class="protfolio-thumb">
            <img src="${product.image}" alt="${product.name}">
            <div class="protfolio-icon">
              <a href="product-details.html?id=${product._id}"><img src="assets/images/work-icon.png" alt="work icon"></a>
            </div>
          </div>
          <div class="protfolio-content">
            <div class="protfolio-title">
              <h3><a href="product-details.html?id=${product._id}">${product.name}</a></h3>
            </div>
            <div class="protfolio-description">
              <p>${product.category.name} - ${formatDate(product.createdAt)}</p>
            </div>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(productCol);
    });
    
  } catch (error) {
    console.error('Error initializing Recent Work section:', error);
  }
}

/**
 * Initialize the Products page
 */
async function initializeProductsPage() {
  try {
    // Get the container for categories
    const categoriesContainer = document.getElementById('category-filters');
    if (!categoriesContainer) return;
    
    // Get the container for products
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // Fetch categories
    const categories = await fetchCategories();
    
    // Clear existing categories
    categoriesContainer.innerHTML = '<li class="nav-item"><button class="nav-link active" data-filter="*">All Products</button></li>';
    
    // Add categories to the container
    categories.forEach(category => {
      const categoryItem = document.createElement('li');
      categoryItem.className = 'nav-item';
      
      const categoryButton = document.createElement('button');
      categoryButton.className = 'nav-link';
      categoryButton.setAttribute('data-filter', `.${category.slug}`);
      categoryButton.textContent = `${category.name} (${category.productCount || 0})`;
      
      categoryItem.appendChild(categoryButton);
      categoriesContainer.appendChild(categoryItem);
    });
    
    // Categories loaded successfully
    
    // Fetch products
    const products = await fetchProducts();
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Add products to the container
    products.forEach(product => {
      // Add product to container
      
      const productElement = document.createElement('div');
      // Make sure the category slug is properly added as a class
      if (product.category && product.category.slug) {
        productElement.className = `col-lg-4 col-md-6 my-5 ${product.category.slug}`;
      } else {
        // Product has invalid category - use a default class without logging error
        productElement.className = 'col-lg-4 col-md-6 my-5';
      }
      
      productElement.innerHTML = `
        <div class="protfolio-single-box">
          <div class="protfolio-thumb">
            <img src="${product.image}" alt="${product.name}">
            <div class="protfolio-icon">
              <a href="product-details.html?id=${product.id}"><img src="assets/images/work-icon.png" alt="work icon"></a>
            </div>
          </div>
          <div class="protfolio-content">
            <div class="protfolio-title">
              <h3><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
            </div>
            <div class="protfolio-description">
              <p>${product.category?.name || 'Uncategorized'} - ${formatDate(product.createdAt)}</p>
            </div>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(productElement);
    });
    
    // Initialize isotope filtering after all products are added
    initIsotope();
    
    function initIsotope() {
      // Check if Isotope is already initialized
      if (productsContainer.isotope) {
        // If already initialized, just refresh the layout
        productsContainer.isotope.layout();
        return;
      }
      
      // Make sure Isotope is available
      if (typeof Isotope === 'undefined') {
        // Wait for Isotope to load
        setTimeout(initIsotope, 500);
        return;
      }
      
      // Initialize Isotope
      const iso = new Isotope(productsContainer, {
        itemSelector: '.col-lg-4',
        layoutMode: 'fitRows'
      });
      
      // Store isotope instance on the container
      productsContainer.isotope = iso;
      
      // Filter items on button click
      categoriesContainer.addEventListener('click', function(event) {
        // Check if the clicked element is a button with nav-link class
        if (!event.target.matches('button.nav-link')) return;
  
        const filterValue = event.target.getAttribute('data-filter');
        
        // Clear any existing filters first
        iso.arrange({ filter: '*' });
        // Then apply the new filter
        iso.arrange({ filter: filterValue });
        
        // Update active class
        const buttons = categoriesContainer.querySelectorAll('button.nav-link');
        buttons.forEach(button => button.classList.remove('active'));
        event.target.classList.add('active');
      });
      
      // Trigger a layout after a short delay to ensure images are loaded
      setTimeout(() => {
        iso.layout();
      }, 500);
    }
    
  } catch (error) {
    // Error initializing Products page
  }
}

/**
 * Initialize the Product Details page
 */
async function initializeProductDetailsPage() {
  try {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      // No product ID provided
      return;
    }
    
    // Fetch the product
    const product = await fetchProductById(productId);
    
    if (!product) {
      // Product not found
      return;
    }
    
    // Update the page title
    document.title = `${product.name} - Gardenic`;
    
    // Update the breadcrumb
    const breadcrumbTitle = document.querySelector('.breadcumb-title h1');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = product.name;
    }
    
    const breadcrumbText = document.querySelector('.breadcumb-content-text span');
    if (breadcrumbText) {
      breadcrumbText.textContent = product.name;
    }
    
    // Update the product details
    const productName = document.getElementById('product-name');
    if (productName) {
      productName.textContent = product.name;
    }
    
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
      productDescription.textContent = product.description;
    }
    
    const productCategory = document.getElementById('product-category');
    if (productCategory) {
      productCategory.textContent = product.category.name;
    }
    
    const productDate = document.getElementById('product-date');
    if (productDate) {
      productDate.textContent = formatDate(product.createdAt);
    }
    
    const productImage = document.getElementById('product-image');
    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;
    }
    
    // Set up share button functionality
    const shareButton = document.getElementById('share-button');
    const shareMessage = document.getElementById('share-message');
    
    if (shareButton && shareMessage) {
      shareButton.addEventListener('click', async () => {
        const success = await copyToClipboard(window.location.href);
        
        if (success) {
          shareMessage.style.display = 'inline';
          
          // Hide the message after 3 seconds
          setTimeout(() => {
            shareMessage.style.display = 'none';
          }, 3000);
        }
      });
    }
    
     // === Load Related Projects (same category) ===
    const relatedContainer = document.querySelector('.portfolio-details-overview + .row');
    if (relatedContainer) {
      // Fetch all products
      const allProducts = await fetchProducts();

      // Get current product category safely (use slug if available, else name)
      const currentCategory = product.category?.slug || product.category?.name || product.category;

      // Filter products from the same category, exclude current one
      const relatedProducts = allProducts.filter(p => {
        const pCategory = p.category?.slug || p.category?.name || p.category;
        return pCategory === currentCategory && p._id !== product._id && p.id !== product.id;
      });

      // Take max 3 related products
      const displayRelated = relatedProducts.slice(0, 3);

      // Clear existing static items
      relatedContainer.innerHTML = '';

      // Render related products
      displayRelated.forEach(rp => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        col.innerHTML = `
          <div class="portfolio-details-thumb">
            <a href="product-details.html?id=${rp._id || rp.id}">
              <img src="${rp.image}" alt="${rp.name}">
            </a>
          </div>
        `;
        relatedContainer.appendChild(col);
      });

  // If none found
  if (displayRelated.length === 0) {
    relatedContainer.innerHTML = `<p>No related projects found.</p>`;
  }
}

    
  } catch (error) {
    // Error initializing Product Details page
  }
}