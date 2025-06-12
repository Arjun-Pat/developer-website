
gsap.registerPlugin(ScrollTrigger);

// Smooth scroll on nav item click
document.querySelectorAll('#navbar li').forEach(li => {
  li.addEventListener('click', () => {
    const targetId = li.getAttribute('data-target');
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// Toggle navbar layout based on scroll position
ScrollTrigger.create({
  trigger: "#about",
  start: "top center",
  onEnter: () => document.getElementById("navbar").classList.add("vertical"),
  onLeaveBack: () => document.getElementById("navbar").classList.remove("vertical")
});

// Set active nav item
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
