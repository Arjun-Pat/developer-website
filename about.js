// about.js: JavaScript for About me Section

const icons = [ "AWS", "Azure", "Csharp", "C++", "Colab", "CSS", "Figma", "GCP", "Github", "Html", "Java", "JavaScript", "Jira", "Jupyter", "Python", "React", "Tableau", "VScode"];

const iconGrid = document.getElementById("icon-grid");
const tooltip = document.createElement("div");
tooltip.className = "icon-tooltip";
tooltip.style.display = "none";
document.body.appendChild(tooltip);

// Config: spacing
const radius = 60;
const iconSize = 52;
const cols = 3;

icons.forEach((name, i) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("tech-icon")

    const img = document.createElement("img");
    img.src = `assets/icons/${name}.png`;
    img.alt = name;

    wrapper.appendChild(img);
    iconGrid.appendChild(wrapper);

    const row = Math.floor(i / cols);
    const col = i % cols;

    const offsetX = (row % 2 === 0 ? 0 : radius * 0.5);
    const x = col * radius + offsetX;
    const y = row * (radius * 0.87); // 0.87 = sin(60deg)

    wrapper.style.left = `${x}px`;
    wrapper.style.top = `${y}px`;

    wrapper.addEventListener('mouseenter', () => {
        wrapper.style.zIndex = 100;
        wrapper.style.transform = 'scale(1.8)';
        tooltipTimeout = setTimeout(() => {
            tooltip.textContent = name;
            tooltip.style.display = "block";
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }, 2000); // show after 3s

    });

    wrapper.addEventListener("mousemove", (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });

    wrapper.addEventListener('mouseleave', () => {
        wrapper.style.zIndex = 1;
        wrapper.style.transform = 'scale(1)';
        clearTimeout(tooltipTimeout);
        tooltip.style.display = "none";
    });

      // Google search on click
    wrapper.addEventListener("click", () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, "_blank");
    });

    iconGrid.appendChild(wrapper);
});
