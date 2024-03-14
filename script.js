document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');

    const characters = [
        { src: 'images/colt.jpeg', id: 'Colt', name: 'Colt' },
        { src: 'images/scrappy.png', id: 'Scrappy', name: 'Scrappy' },
        { src: 'images/zelda.png', id: 'Zelda', name: 'Zelda' },
        { src: 'images/texas.png', id: 'Texas', name: 'Texas' },
        { src: 'images/bruno.png', id: 'Bruno', name: 'Bruno' }
    ];
    let selectedCharacter = characters[0].src;

    // Add title for character selection
    const title = document.createElement('h2');
    title.textContent = "Select Your Character";
    title.style.textAlign = "center";
    startScreen.appendChild(title);

    // Create character selection options
    const characterSelection = document.createElement('div');
    characterSelection.id = 'characterSelection';
    startScreen.appendChild(characterSelection);

    characters.forEach(character => {
        const characterContainer = document.createElement('div');
        characterContainer.classList.add('characterContainer');
    
        const img = document.createElement('img');
        img.src = character.src;
        img.id = character.id;
        img.classList.add('characterOption');
        img.title = character.name; // Simple tooltip
    
        const nameTag = document.createElement('div');
        nameTag.textContent = character.name;
        nameTag.classList.add('nameTag', 'hide'); // Initially hidden

        img.addEventListener('click', function() {
            selectedCharacter = character.src; // Update selected character
            document.querySelectorAll('.characterContainer').forEach(container => {
                container.classList.remove('selected'); // Remove 'selected' from all containers
            });
            characterContainer.classList.add('selected'); // Add 'selected' to clicked character's container
        });
    
        img.addEventListener('mouseenter', function() {
            nameTag.classList.remove('hide'); // Show name tag on hover
        });
    
        img.addEventListener('mouseleave', function() {
            nameTag.classList.add('hide'); // Hide name tag when not hovering
        });
    
        characterContainer.appendChild(img);
        characterContainer.appendChild(nameTag);
        characterSelection.appendChild(characterContainer);
    });    

    const playButton = document.getElementById('playButton');
    startScreen.appendChild(playButton);
    playButton.addEventListener('click', function() {
        event.stopPropagation();
        startScreen.style.display = 'none'; // Hide the start screen
        initializeGame(selectedCharacter); // Start the game
    });

    startScreen.style.backgroundImage = "url('images/background.jpg')"; // Adjust with the correct path
    startScreen.style.backgroundSize = "cover";
    startScreen.style.backgroundPosition = "center";
    startScreen.style.backgroundRepeat = "no-repeat";
});

function initializeGame(selectedCharacter) {
    let staticImages = [];
    let widthIncrement = 8;
    const maxStaticImages = 7;

    const clickSound = document.getElementById('clickSound');
    const pewSound = document.getElementById('pewSound');

    function createFlyingColt(x, y) {
        const flyingColt = document.createElement('img');
        flyingColt.src = 'images/colt.jpeg'; // Make sure the path is correct
        flyingColt.classList.add('flyingColt');
        flyingColt.style.position = 'fixed';
        flyingColt.style.left = `${x}px`;
        flyingColt.style.top = `${y}px`;
        document.body.appendChild(flyingColt);
        

        const flyOffScreen = () => {
            const currentX = parseInt(flyingColt.style.left, 10);
            flyingColt.style.left = `${currentX + 10}px`; // Adjust speed if necessary

            if (currentX > window.innerWidth) {
                document.body.removeChild(flyingColt); // Remove the Colt once it's off-screen
            } else {
                requestAnimationFrame(flyOffScreen); // Continue flying off-screen
            }
        };

        flyOffScreen(); // Start flying off-screen
    }

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

    movingImg.src = selectedCharacter; // Use the selected character image
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
            let lastPosition = movingImg.getBoundingClientRect().left;

            // Always target the first image in the list
            const target = staticImages[0].getBoundingClientRect();
            const movingRect = movingImg.getBoundingClientRect();
            const dx = target.left + (target.width / 2) - (movingRect.left + (movingRect.width / 2));
            const dy = target.top + (target.height / 2) - (movingRect.top + (movingRect.height / 2));
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) { // Adjust this value based on your needs
                // Find the center position of the target image for the starting point of the flying Colt
                const targetCenterX = staticImages[0].offsetLeft + (staticImages[0].offsetWidth / 2);
                const targetCenterY = staticImages[0].offsetTop + (staticImages[0].offsetHeight / 2);

                document.body.removeChild(staticImages[0]); // Delete the targeted image
                staticImages.shift(); // Remove the first element from the array
                widthIncrement += 5;
                movingImg.style.width = `${widthIncrement}%`; // Apply new width

                createFlyingColt(targetCenterX, targetCenterY);
                pewSound.currentTime = 0;
                pewSound.play();
            } else {
                const newPosition = movingRect.left + (dx / distance) * speed;

                // Move towards the target
                movingImg.style.left = `${movingRect.left + (dx / distance) * speed}px`;
                movingImg.style.top = `${movingRect.top + (dy / distance) * speed}px`;

                // Determine direction and apply appropriate class only if needed
                if (newPosition > lastPosition && !movingImg.classList.contains('facingRight')) {
                    movingImg.classList.remove('facingLeft');
                    movingImg.classList.add('facingRight');
                } else if (newPosition < lastPosition && !movingImg.classList.contains('facingLeft')) {
                    movingImg.classList.remove('facingRight');
                    movingImg.classList.add('facingLeft');
                }

                lastPosition = newPosition; // Update the last known position
            }

            requestAnimationFrame(move); // Continue moving towards the current target
        };

        move(); // Start the movement process
    }

    moveTowardsImages(); // Begin targeting and moving towards the static images
}