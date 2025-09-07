/**
 * Contact Integration for Gardenic Website
 * This file handles the dynamic display of contact information
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize contact section
  initContact();
  
  // Initialize footer form
  initFooterForm();
});

/**
 * Initialize contact section
 */
async function initContact() {
  try {
    // Fetch contact information from API
    const contactInfo = await fetchContact();
    
    // Display contact information
    if (contactInfo && contactInfo.length > 0) {
      displayContactInfo(contactInfo);
    } else {
      // No contact information found
    }
  } catch (error) {
    console.error('Error initializing contact:', error);
  }
}

/**
 * Display contact information in the contact section
 * @param {Array} contactInfo - Array of contact information objects
 */
function displayContactInfo(contactInfo) {
  // Process each type of contact information
  const address = contactInfo.find(item => item.type === 'address');
  const email = contactInfo.find(item => item.type === 'email');
  const phone = contactInfo.find(item => item.type === 'phone');
  
  // Update address if found
  if (address) {
    // Update footer address
    const addressElements = document.querySelectorAll('.footer-address p');
    addressElements.forEach(element => {
      element.textContent = address.value;
    });
    
    // Update contact page address
    const contactAddressElement = document.getElementById('contact-address');
    if (contactAddressElement) {
      contactAddressElement.textContent = address.value;
    }
  }
  
  // Update email if found
  if (email) {
    // Update footer email
    const emailElements = document.querySelectorAll('.footer-email p a');
    emailElements.forEach(element => {
      element.textContent = email.value;
      element.href = `mailto:${email.value}`;
    });
    
    // Update contact page email
    const contactEmailElement = document.getElementById('contact-email');
    if (contactEmailElement) {
      contactEmailElement.innerHTML = `<a href="mailto:${email.value}">${email.value}</a>`;
    }
  }
  
  // Update phone if found
  if (phone) {
    // Update footer phone
    const phoneElements = document.querySelectorAll('.footer-phone p a');
    phoneElements.forEach(element => {
      element.textContent = phone.value;
      element.href = `tel:${phone.value}`;
    });
    
    // Update contact page phone
    const contactPhoneElement = document.getElementById('contact-phone');
    if (contactPhoneElement) {
      contactPhoneElement.innerHTML = `<a href="tel:${phone.value}">${phone.value}</a>`;
    }
  }
  
  // Update contact form if it exists
  updateContactForm(email ? email.value : '');
}

/**
 * Update the contact form with the recipient email
 * @param {string} recipientEmail - The email address to send form submissions to
 */
function updateContactForm(recipientEmail) {
  const contactForm = document.getElementById('dreamit-form');
  
  if (contactForm) {
    // Add form submission handler
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Show loading indicator
      const submitButton = contactForm.querySelector('button[type="submit"]');
      let originalText = 'Send Message';
      if (submitButton) {
        originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
      }
      
      // Get form data
      const firstName = contactForm.querySelector('input[name="Your name"]').value;
      const lastName = contactForm.querySelector('input[name="Last Name"]').value;
      const email = contactForm.querySelector('input[name="Your Email"]').value;
      const phone = contactForm.querySelector('input[name="Subject"]').value;
      const message = contactForm.querySelector('textarea[name="message"]').value;
      
      // Create message object
      const messageData = {
        firstName,
        lastName,
        email,
        phone,
        message,
        recipientEmail: recipientEmail || ''
      };
      
      // Send message to API
      sendMessage(messageData)
        .then(response => {
          // Show success message
          alert('Your message has been sent successfully!');
          contactForm.reset();
        })
        .catch(error => {
          // Show error message
          alert('Failed to send message. Please try again later.');
          console.error('Error sending message:', error);
        })
        .finally(() => {
          // Reset button
          if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }
        });
    });
  }
}

/**
 * Initialize the footer subscription form
 */
function initFooterForm() {
  const footerForm = document.getElementById('footer-form');
  
  if (footerForm) {
    footerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Show loading indicator
      const submitButton = footerForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }
      
      // Get email from form
      const email = footerForm.querySelector('input[name="email"]').value;
      
      // Create message object for subscription
      const messageData = {
        email,
        type: 'subscription'
      };
      
      // Send message to API
      sendMessage(messageData)
        .then(response => {
          // Show success message
          alert('Thank you for subscribing!');
          footerForm.reset();
        })
        .catch(error => {
          // Show error message
          alert('Failed to subscribe. Please try again later.');
          console.error('Error sending subscription:', error);
        })
        .finally(() => {
          // Reset button
          if (submitButton) {
            submitButton.disabled = false;
          }
        });
    });
  }
}