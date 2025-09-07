/**
 * Team Integration for Gardenic Website
 * This file handles the dynamic display of team members
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize team section
  initTeam();
});

/**
 * Initialize team section
 */
async function initTeam() {
  try {
    // Fetch team members from API
    const teamMembers = await fetchTeam();
    
    // Display team members
    if (teamMembers && teamMembers.length > 0) {
      displayTeamMembers(teamMembers);
    } else {
      // No team members found
    }
  } catch (error) {
    console.error('Error initializing team:', error);
  }
}

/**
 * Display team members in the team section
 * @param {Array} teamMembers - Array of team member objects
 */
function displayTeamMembers(teamMembers) {
  // Get the container for team members
  const teamContainer = document.querySelector('.team-section .row:not(:first-child)');
  
  if (!teamContainer) {
    console.error('Team container not found');
    return;
  }
  
  // Clear existing content
  teamContainer.innerHTML = '';
  
  // Filter active team members
  const activeMembers = teamMembers.filter(member => member.isActive);
  
  // Generate HTML for each team member
  activeMembers.forEach(member => {
    const memberElement = document.createElement('div');
    memberElement.className = 'col-lg-4 col-md-6';
    
    memberElement.innerHTML = `
      <div class="single-team-box">
        <div class="team-thumb">
          <img src="${member.image}" alt="${member.name}">
          <!--team social icon-->
          <div class="team-social-icon">
            <ul class="social-icons">
              <li><a href="mailto:${member.email}"><i class="far fa-envelope"></i></a></li>
              <li><a href="tel:${member.phone}"><i class="fas fa-phone"></i></a></li>
              <li><a href="https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}"><i class="fab fa-whatsapp"></i></a></li>
            </ul>
          </div>
          <!--team content-->
          <div class="team-content">
            <div class="team-title">
              <h3><a href="#">${member.name}</a></h3>
              <p>${member.position}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    teamContainer.appendChild(memberElement);
  });
  
  // Initialize Owl Carousel if available
  if (typeof $.fn.owlCarousel !== 'undefined' && activeMembers.length > 3) {
    $(teamContainer).owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 3000,
      dots: true,
      nav: false,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        992: {
          items: 3
        }
      }
    });
  }
}