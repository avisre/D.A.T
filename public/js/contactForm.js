document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Collect the form data manually as an object
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Send the data as JSON
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the correct header for JSON
        },
        body: JSON.stringify(formData) // Convert the form data to JSON string
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');

        // Clear the form fields after successful submission
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message.');
    });
});
