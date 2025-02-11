document.addEventListener('DOMContentLoaded', function() {
    // Example: Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('show');
    });

    // Example: Simple player controls
    const playButton = document.querySelector('.play-button');
    
    playButton.addEventListener('click', function() {
        playButton.classList.toggle('playing');
    });
});
