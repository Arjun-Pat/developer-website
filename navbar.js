gsap.registerPlugin(ScrollTrigger);

const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const navList = navbar.querySelector("ul");

let isOpen = false;
let isInVerticalMode = false;

// Toggle open/collapse on hamburger click (top-right only)
menuToggle.addEventListener("click", () => {
  if (isInVerticalMode) return; // prevent toggle in vertical mode

  isOpen = !isOpen;
  navbar.classList.toggle("open", isOpen);
  navbar.classList.toggle("collapsed", !isOpen);
});

// Scroll-triggered layout behavior
ScrollTrigger.create({
  trigger: "#about",
  start: "top center",

  // Scroll DOWN
  onEnter: () => {
    isInVerticalMode = true;

    // Step 1: Collapse if open
    if (isOpen) {
      isOpen = false;
      navbar.classList.remove("open");
      navbar.classList.add("collapsed");
    }

    // Step 2: Wait for collapse, then move panel to vertical layout
    setTimeout(() => {
      navbar.classList.add("vertical");
      menuToggle.style.display = "flex"; // show hamburger as it rides down

      // Step 3: After move completes, hide hamburger and expand menu
      setTimeout(() => {
        menuToggle.style.display = "none";
        navbar.classList.remove("collapsed");
        navbar.classList.add("open");
      }, 300); // adjust this delay to match panel move
    }, 300); // delay to allow collapse
  },

  // Scroll UP
  onLeaveBack: () => {
    isInVerticalMode = false;
    isOpen = false;

    // Step 1: Collapse vertical menu
    navbar.classList.remove("open");
    navbar.classList.add("collapsed");

    // Step 2: Wait, then revert to top-right layout and show hamburger
    setTimeout(() => {
      navbar.classList.remove("vertical");
      menuToggle.style.display = "flex";
    }, 300);
  }
});

// Smooth scroll on nav item click
document.querySelectorAll('#navbar li').forEach(li => {
  li.addEventListener('click', () => {
    const targetId = li.getAttribute('data-target');
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });

    if (!isInVerticalMode) {
      isOpen = false;
      navbar.classList.remove("open");
      navbar.classList.add("collapsed");
    }
  });
});

// Highlight current section
const sections = document.querySelectorAll("section");
sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActive(section.id),
    onEnterBack: () => setActive(section.id)
  });
});

function setActive(id) {
  document.querySelectorAll('#navbar li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-target') === id);
  });
}
