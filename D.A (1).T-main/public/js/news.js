// Define a function called toggleNews
const buttonToggle=document.getElementsByClassName('toggle-button')[0] 
const linkNavbar=document.getElementsByClassName('navbar-links')[0]

buttonToggle.addEventListener('click',()=>{
   linkNavbar.classList.toggle('active');
})
function toggleNews() {
    // Find the HTML element with the class 'news' and store it in the 'newsContainer' variable
    const newsContainer = document.querySelector('.news');

    // Toggle the 'active' class on the 'newsContainer' element to show/hide news content
    newsContainer.classList.toggle('active');

    // Check if the 'newsContainer' element has the 'active' class
    if (newsContainer.classList.contains('active')) {
        // If it has the 'active' class, call the 'getStockMarketNews' function to fetch news
        getStockMarketNews();
    }
};

// Define a function called getStockMarketNews
function getStockMarketNews() {
    // Define the API URL for fetching stock market news from Alpha Vantage
    const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=6VWT72JNHHLBF3MH`;

    // Fetch data from the 'apiUrl' using the Fetch API
    fetch(apiUrl)
        // Parse the response as JSON
        .then(response => response.json())
        // Process the data once it's retrieved
        .then(data => {
            // Find the HTML element with the id 'news-container' and store it in the 'newsContainer' variable
            const newsContainer = document.getElementById('news-container');

            // Clear any previous content inside the 'newsContainer' element
            newsContainer.innerHTML = "";

            // Loop through the first 5 news articles in the 'data' object
            for (let i = 0; i < 5; i++) {
                // Get the current article from the 'data' object
                const article = data.feed[i];

                // Create HTML elements for displaying article details
                const articleTitle = document.createElement('h3');
                const articleLink = document.createElement('a');
                const articleTime = document.createElement('p');
                const articleAuthors = document.createElement('p');
                const articleSummary = document.createElement('p');
                const articleImage = document.createElement('img');
                const articleSource = document.createElement('p');

                // Set the content for the article elements based on the data
                articleTitle.textContent = article.title;
                articleLink.textContent = "Read More";
                articleLink.href = article.url;
                const timestamp = article.time_published;
                const date = timestamp.slice(0, 4) + "/" + timestamp.slice(4, 6) + "/" + timestamp.slice(6, 8);
                const time = timestamp.slice(9, 11) + ":" + timestamp.slice(11, 13);
                articleTime.textContent = `Published:${date}`;
                articleAuthors.textContent = `Authors: ${article.authors.join(', ')}`;
                articleSummary.textContent = article.summary;
                articleImage.src = article.banner_image;
                articleSource.textContent = `Source: ${article.source}`;

                // Append the article elements to the 'newsContainer' element
                newsContainer.appendChild(articleTitle);
                newsContainer.appendChild(articleImage);
                newsContainer.appendChild(articleSummary);
                newsContainer.appendChild(articleLink);
                newsContainer.appendChild(articleTime);
                newsContainer.appendChild(articleAuthors);
                newsContainer.appendChild(articleSource);

                // Add a horizontal line for separation between articles
                newsContainer.appendChild(document.createElement('hr'));
            }
        })
        // Handle any errors that occur during the fetch operation
        .catch(error => {
            console.error("Error fetching stock news:", error);
        });
}

// Call the 'getStockMarketNews' function when the script is loaded to initially fetch and display the first 5 articles
