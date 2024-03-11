document.addEventListener('DOMContentLoaded', () => {
    let staticImages = [];
    let widthIncrement = 8;
    const maxStaticImages = 7;

    document.body.style.backgroundImage = "url('images/background.jpg')"; // Adjust with the correct path
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    const clickSound = document.getElementById('clickSound');

    document.documentElement.addEventListener('click', function(event) {
        if (staticImages.length >= maxStaticImages) {
            // Only attempt to open the new tab once when the cap is reached
            if(staticImages.length === maxStaticImages) {
                window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0', '_blank');
            }
            return;
        }

        clickSound.currentTime = 0; // Reset audio to start
        clickSound.play(); // Play audio

        const img = document.createElement('img');
        img.src = 'images/ollie.png'; // Make sure the path is correct
        img.classList.add('staticImage');
        img.style.position = 'fixed';
        document.body.appendChild(img);
        img.onload = () => {
            img.style.left = `${event.pageX - img.offsetWidth / 2}px`;
            img.style.top = `${event.pageY - img.offsetHeight / 2}px`;
            staticImages.push(img); // Add the new image to the array
        };
    });

    // Initialize and style the moving image
    const movingImg = document.createElement('img');
    movingImg.src = 'images/colt.jpeg'; // Make sure the path is correct
    movingImg.classList.add('movingImage');
    movingImg.style.position = 'fixed';
    document.body.appendChild(movingImg);

    function moveTowardsImages() {
        const speed = 2; // Control the speed of the moving image

        const move = () => {
            if (staticImages.length === 0) {
                requestAnimationFrame(move); // Continue the animation frame loop even if no targets
                return;
            }

            // Always target the first image in the list
            const target = staticImages[0].getBoundingClientRect();
            const movingRect = movingImg.getBoundingClientRect();
            const dx = target.left + (target.width / 2) - (movingRect.left + (movingRect.width / 2));
            const dy = target.top + (target.height / 2) - (movingRect.top + (movingRect.height / 2));
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) { // Adjust this value based on your needs
                document.body.removeChild(staticImages[0]); // Delete the targeted image
                staticImages.shift(); // Remove the first element from the array
                widthIncrement += 5;
                movingImg.style.width = `${widthIncrement}%`; // Apply new width

            } else {
                // Move towards the target
                movingImg.style.left = `${movingRect.left + (dx / distance) * speed}px`;
                movingImg.style.top = `${movingRect.top + (dy / distance) * speed}px`;
            }

            requestAnimationFrame(move); // Continue moving towards the current target
        };

        move(); // Start the movement process
    }

    moveTowardsImages(); // Begin targeting and moving towards the static images
});
