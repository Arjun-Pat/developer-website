document.addEventListener("DOMContentLoaded", () => {
  const vs = document.querySelectorAll(".scroll-vs .v");

  const tl = gsap.timeline({
    delay: 10,        // Wait 10 seconds before starting
    repeat: -1,
    repeatDelay: 4   // Wait 3 seconds after each full cycle
  });

  // Animate IN (light up and drop) — top to bottom
  vs.forEach((v, i) => {
    tl.to(v, {
      opacity: 0.8,
      y: 6,
      duration: 0.2,
      ease: "power1.inOut"
    }, i * 0.2);
  });

  // Animate OUT (dim and rise) — top to bottom again
  vs.forEach((v, i) => {
    tl.to(v, {
      opacity: 0.05,
      y: 0,
      duration: 0.25,
      ease: "power1.inOut"
    }, (vs.length * 0.2) + i * 0.2); // starts after last .to()
  });
});
