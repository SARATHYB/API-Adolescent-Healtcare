document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);

        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none'; // Hide all sections
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block'; // Show the clicked section
        }

        // Optionally scroll to the section
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    });
});

// Initially hide all sections except the dashboard
document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
});
document.getElementById('dashboard').style.display = 'block'; // Show dashboard by default