const sendButton = document.getElementById('sendButton');
        const dataPacket = document.getElementById('dataPacket');
        const successMessage = document.getElementById('successMessage');
        const failureMessage = document.getElementById('failureMessage');
        const infoPopup = document.getElementById('infoPopup');
        const closePopup = document.getElementById('closePopup');

        sendButton.addEventListener('click', () => {
            // Move the data packet to the middle
            dataPacket.style.transition = 'transform 2s, opacity 2s';
            dataPacket.style.transform = 'translate(400px, 0)'; // Move to middle

            // Show info popup after the packet reaches the middle
            setTimeout(() => {
                infoPopup.style.display = 'block'; // Show the info popup

                // Get user input values
                const macSrc = document.getElementById('macSrc').value;
                const macDest = document.getElementById('macDest').value;
                const srcIP = document.getElementById('srcIP').value;
                const destIP = document.getElementById('destIP').value;
                const srcPort = document.getElementById('srcPort').value;
                const destPort = document.getElementById('destPort').value;

                // Dummy expected values (can be changed as per requirement)
                const expectedMacSrc = "00:1A:2B:3C:4D:5E";
                const expectedMacDest = "5E:4D:3C:2B:1A:00";
                const expectedSrcIP = "192.168.1.1";
                const expectedDestIP = "192.168.1.2";
                const expectedSrcPort = "8080";
                const expectedDestPort = "9090";

                // Check if the entered information matches the expected values
                const isValid = macSrc === expectedMacSrc &&
                    macDest === expectedMacDest &&
                    srcIP === expectedSrcIP &&
                    destIP === expectedDestIP &&
                    srcPort === expectedSrcPort &&
                    destPort === expectedDestPort;

                // Close the popup after 5 seconds
                setTimeout(() => {
                    infoPopup.style.display = 'none'; // Hide the popup

                    if (isValid) {
                        // Move the data packet 100px to the right
                        dataPacket.style.transform = 'translate(790px, -30px)'; // Move right by 100px
                        // Show success message
                        successMessage.style.display = 'block';
                    } else {
                        // Show failure message
                        failureMessage.style.display = 'block';
                    }
                }, 5000); // Hide popup after 5 seconds
            }, 2000); // Show popup after 2 seconds
        });

        // Close the popup manually
        closePopup.addEventListener('click', () => {
            infoPopup.style.display = 'none'; // Hide the popup
        });