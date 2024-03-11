document.addEventListener('DOMContentLoaded', () => {
    let staticImages = [];
    const maxStaticImages = 10;
    const imageWidthPercentage = 8; // First images cover 8% of the viewport width

    // Reference the audio element
    const clickSound = document.getElementById('clickSound');

    document.documentElement.addEventListener('click', function(event) {
        if (staticImages.length >= maxStaticImages) return;

        // Play the click sound
        clickSound.currentTime = 0; // Rewind to the start
        clickSound.play();

        const img = document.createElement('img');
        img.src = 'images/ollie.png'; // Adjust to your first image path
        img.classList.add('staticImage');
        img.style.position = 'fixed';
        img.style.width = `${window.innerWidth * (imageWidthPercentage / 100)}px`; // Proportional width
        img.style.height = 'auto'; // Maintain aspect ratio
        img.onload = function() {
            // Center the image on the click
            img.style.left = `${event.pageX - img.offsetWidth / 2}px`;
            img.style.top = `${event.pageY - img.offsetHeight / 2}px`;
        };
        document.body.appendChild(img); // Append to ensure onload triggers correctly
        staticImages.push({ element: img, x: event.pageX, y: event.pageY });

        // Initiate movement towards images if it's the first click
        if (!moving) {
            moveTowardsImages();
        }
    });

    // Moving image setup
    const movingImg = document.createElement('img');
    movingImg.src = 'images/colt.jpeg'; // Adjust to your moving image path
    movingImg.classList.add('movingImage');
    movingImg.style.position = 'fixed';
    movingImg.style.width = `${window.innerWidth * (imageWidthPercentage / 100)}px`; // Proportional width
    movingImg.style.height = 'auto'; // Maintain aspect ratio
    document.body.appendChild(movingImg);
    
    let moving = false; // Flag to control movement initiation

    function moveTowardsImages() {
        moving = true; // Flag the movement as active
        let targetIndex = 0; // Reset target index for a new movement cycle

        function move() {
            if (staticImages.length === 0) {
                moving = false; // Stop moving if no targets are left
                return;
            }

            // Ensure cycling through the targets
            if (targetIndex >= staticImages.length) {
                targetIndex = 0; // Loop back to the first target
            }

            const target = staticImages[targetIndex];
            const dx = target.x - movingImg.offsetLeft - movingImg.offsetWidth / 2;
            const dy = target.y - movingImg.offsetTop - movingImg.offsetHeight / 2;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);

            if (distance < 50) { // Adjust threshold as needed for "contact"
                target.element.remove(); // Remove the contacted image
                staticImages.splice(targetIndex, 1); // Remove from the tracking array
            } else {
                const speed = 2; // Adjust speed as needed
                movingImg.style.left = `${movingImg.offsetLeft + (dx / distance) * speed}px`;
                movingImg.style.top = `${movingImg.offsetTop + (dy / distance) * speed}px`;
                targetIndex++; // Move to the next target
            }

            requestAnimationFrame(move); // Continue the movement
        }

        move();
    }
});
