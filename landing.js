// landing.js

document.addEventListener("DOMContentLoaded", () => {
  const arrows = document.querySelectorAll(".scroll-arrows .arrow");

  // Animate arrows sequentially
  arrows.forEach((arrow, i) => {
    gsap.to(arrow, {
      opacity: 1,
      duration: 0.5,
      delay: i * 0.25,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  });
});
