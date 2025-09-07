/**
 * Certificates Integration for Gardenic Website
 * This file handles the dynamic display of certificates
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize certificates section
  initCertificates();
});

/**
 * Initialize certificates section
 */
async function initCertificates() {
  try {
    // Fetch certificates from API
    const certificates = await fetchCertificates();
    
    // Display certificates
    if (certificates && certificates.length > 0) {
      displayCertificates(certificates);
    } else {
      // No certificates found
    }
  } catch (error) {
    console.error('Error initializing certificates:', error);
  }
}

/**
 * Display certificates in the portfolio section
 * @param {Array} certificates - Array of certificate objects
 */
function displayCertificates(certificates) {
  // Get the container for certificates
  const certificatesContainer = document.querySelector('.image_load');
  
  if (!certificatesContainer) {
    console.error('Certificates container not found');
    return;
  }
  
  // Clear existing content
  certificatesContainer.innerHTML = '';
  
  // Filter active certificates
  const activeCertificates = certificates.filter(cert => cert.isActive);
  
  // Generate HTML for each certificate
  activeCertificates.forEach(certificate => {
    const certificateElement = document.createElement('div');
    certificateElement.className = 'col-md-4 grid-item position-static';
    
    // Determine category class based on certificate category
    let categoryClass = '';
    switch(certificate.category) {
      case 'driveways':
        categoryClass = 'physics';
        break;
      case 'in_progress':
        categoryClass = 'chemistry';
        break;
      case 'pathway':
        categoryClass = 'math';
        break;
      case 'portfolio':
        categoryClass = 'english';
        break;
      default:
        categoryClass = '';
    }
    
    if (categoryClass) {
      certificateElement.classList.add(categoryClass);
    }
    
    certificateElement.innerHTML = `
      <div class="protfolio-single-box">
        <div class="protfolio-thumb">
          <img src="${certificate.image}" alt="${certificate.name}">
          <div class="protfolio-icon">
            <a class="portfolio-icon venobox vbox-item" data-gall="myportfolio" href="${certificate.image}">
              <img src="assets/images/work-icon.png" alt="work icon">
            </a>
          </div>
        </div>
        <div class="protfolio-content">
          <div class="protfolio-title">
            <h3><a href="#">${certificate.name}</a></h3>
          </div>
          <div class="protfolio-description">
            <p>${certificate.description}</p>
          </div>
        </div>
      </div>
    `;
    
    certificatesContainer.appendChild(certificateElement);
  });
  
  // Initialize Venobox for lightbox functionality
  if (typeof $.fn.venobox !== 'undefined') {
    $('.venobox').venobox({
      border: '10px',
      titleattr: 'data-title',
      numeratio: true,
      infinigall: true
    });
  }
  
  // Initialize Isotope for filtering
  if (typeof Isotope !== 'undefined') {
    // Initialize Isotope after images are loaded
    const iso = new Isotope('.image_load', {
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        columnWidth: '.grid-item'
      }
    });
    
    // Filter items on button click
    $('.menu-filtering li').on('click', function() {
      const filterValue = $(this).attr('data-filter');
      iso.arrange({ filter: filterValue });
      
      // Add active class to current filter button
      $('.menu-filtering li').removeClass('current_menu_item');
      $(this).addClass('current_menu_item');
    });
  }
}