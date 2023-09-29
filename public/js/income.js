

// Listen for a click event on an element with the id 'on' and execute functions when clicked
document.getElementById('on').addEventListener('click', function () {
    fetchAndPlotData(); // Fetch and plot stock price data
    fetchData(); // Fetch financial data
    getFinancialData(); // Fetch balance sheet data
})

// Listen for a click event on an element with the id 'on1' and execute functions when clicked
document.getElementById('on1').addEventListener('click', function () {
    clearInput(); // Clear input fields
    clearInput1(); // Clear input fields
    clearInput2(); // Clear input fields
})

 // Function to open and close navbar dynamically using mouseclick

 const buttonToggle=document.getElementsByClassName('toggle-button')[0] 
 const linkNavbar=document.getElementsByClassName('navbar-links')[0]
 
 buttonToggle.addEventListener('click',()=>{
    linkNavbar.classList.toggle('active');
 })

// Stock suggestion functionality



// fetchSuggestions(): This async function fetches stock symbols and company names based on user input
//  (company symbol search) using the Alpha Vantage API. It constructs an API request URL, makes a fetch request, 
//  processes the response data, and dynamically displays a list of suggestions as the user types in the input field.
async function fetchSuggestions(keyword) {

    const apiKey = '6VWT72JNHHLBF3MH';
    const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.bestMatches) {
            return data.bestMatches.slice(0, 2); // Limit to the first 2 suggestions
        }
    } catch (error) {
        console.error(error);
    }

    return [];
}
const userInput = document.getElementById('companySymbol'); // Get user input element
const suggestionsList = document.getElementById('suggestions'); // Get suggestion list element

// Event listener for user input changes
userInput.addEventListener('input', async () => {
    const inputText = userInput.value.trim(); // Get trimmed user input
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    if (inputText.length >= 2) {
        const suggestions = await fetchSuggestions(inputText); // Fetch stock suggestions
        suggestions.slice(0, 3).forEach((suggestion) => {
            // Display the first 3 suggestions in a list
            const listItem = document.createElement('li');
            listItem.textContent = `${suggestion['1. symbol']} - ${suggestion['2. name']}`;
            listItem.addEventListener('click', () => {
                userInput.value = suggestion['1. symbol']; // Fill input with selected suggestion
                suggestionsList.innerHTML = ''; // Clear suggestion list
            });
            suggestionsList.appendChild(listItem);
        });
    }
});

// Details of how code works explained in the cash, debt and common stock section only difference is
// in the name of functions and variables
const aiki = '6VWT72JNHHLBF3MH';

const apiUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&apikey=${aiki}`;

// let chart;
// Function to fetch revenue and profit data from alpha vantage api
function fetchData() {
    const companySymbolInput = document.getElementById('companySymbol');
    const companySymbol = companySymbolInput.value.toUpperCase();
    if (!companySymbol) {
        alert('Please enter a company symbol.');
        return;
    }

    const apiQuery = `${apiUrl}&symbol=${companySymbol}`;

    fetch(apiQuery)
        .then(response => response.json())
        .then(data => {
            if (data.annualReports && data.annualReports.length > 0) {
                const revenueData = data.annualReports.map(report => report.totalRevenue/1000000000 );
                const netProfitData = data.annualReports.map(report => report.netIncome/1000000000);

                createOrUpdateChart(data, revenueData, netProfitData);
            } else {
                alert('No financial data found for the specified company symbol.');
            }
        })
        .catch(error => {
            alert('Error fetching data:', error);
        });
}

// Function to create or update a chart displaying revenue and net profit data
function createOrUpdateChart(data, revenueData, netProfitData) {
    const ct = document.getElementById('stockChart1').getContext('2d');
    const years = data.annualReports.map(report => report.fiscalDateEnding.split('-')[0]);

    chart = new Chart(ct, {
        type: 'bar',
        data: {
            labels: years,

            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Net Profit',
                    data: netProfitData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title:{
                        display:true,
                        text:'USD (Billions)'
                    }

                }
            }
        }
    });
}

// Clear input fields and the chart
function clearInput2() {
    document.getElementById('priceChart').value = '';
    document.getElementById('priceChart').textContent = '';
    const ct = document.getElementById('stockChart1').getContext('2d');
    const existingChart = Chart.getChart(ct); // Get the existing chart instance

    if (existingChart) {
        existingChart.destroy(); // Destroy the existing chart if it exists
    }
}

// Functionality for fetching balance sheet data
// getFinancialData(): This function fetches balance sheet data for
//  a specified company symbol from the Alpha Vantage API.It constructs an API 
//  request URL, makes a fetch request, processes the response data(cash, long - term debt, 
//     and common stock shares), and then calls createBarChart() to create a bar chart displaying this financial data.
function getFinancialData() {
    const apiUrl = 'https://www.alphavantage.co/query?function=BALANCE_SHEET&apikey=6VWT72JNHHLBF3MH';

    const companySymbolInput = document.getElementById('companySymbol');
    const companySymbol = companySymbolInput.value.trim().toUpperCase();

    if (!companySymbol) {
        alert('Please enter a company symbol.');
        return;
    }

    const apiQuery = `${apiUrl}&symbol=${companySymbol}`;

    fetch(apiQuery)
        // fetches the api request 
        .then(response => {
            if (!response.ok) {
                // if response is not fine then it will throw an error
                throw new Error('Network response was not ok.');
            }
            // if the response is positive it will respond with json input from databasse of api
            return response.json();
        })
        .then(data => {
            if (data.annualReports && data.annualReports.length > 0) {
                const companyName = data.symbol;
                // data.symbol is used to retreive the stock symbol from the json response
                const cash = data.annualReports.map(report => report.cashAndShortTermInvestments/1000000000);
                // data.annualReports.map is used to map over api database response and retreive only the 
                //    cashAndShortTermInvestments   from the json response
                const longTermDebt = data.annualReports.map(report => report.longTermDebt/1000000000);
                // same functionality here  only difference is that it asks for long term debt
                const commonStockShares = data.annualReports.map(report => report.commonStockSharesOutstanding/1000000000);
                // same functionality here  only difference is that it asks for commonStockSharesOutstanding
                document.getElementById('companySymbolDisplay').textContent = `Company Symbol: ${companyName} (${companySymbol})`;
                // adds new data from api such as company name and company symbol
                createBarChart(data, cash, longTermDebt, commonStockShares);
                // creates a function which passes in all the parameters cash and other parameters we entered above
            } else {
                alert('No financial data found for the specified company symbol.');
            }
        })
        .catch(error => {
            alert('Error fetching data: ' + error.message);
        });
}

// createBarChart(): This function creates a bar chart displaying financial data such as total cash, long-term debt,
//  and common stock shares outstanding for multiple years. It uses the Chart.js library to create the bar chart.
function createBarChart(data, cash, longTermDebt, commonStockShares) {
    const ctx1 = document.getElementById('financialChart').getContext('2d');
    // This line retrieves a 2D drawing context (getContext('2d')) from a canvas element with the ID 'financialChart'. 
    // In Chart.js, the canvas element is used as the rendering surface for the chart.
    const years = data.annualReports.map(report => report.fiscalDateEnding.split('-')[0]);
    // : This line extracts the years from an array of annual reports. It assumes that the data object contains an
    //  array called annualReports, and for each report, it extracts the year from the fiscalDateEnding property (presumably in the format 'YYYY-MM-DD').

    window.chart = new Chart(ctx1, {

        // This line creates a new Chart.js chart instance using the canvas context 
        // (ctx1) and configures its properties. The chart will be of type 'bar', meaning it will display data as vertical bars

        type: 'bar',
        data: {
            // This block defines the data to be displayed in the chart. It includes three datasets: one for 'debt',common stocks available
            //  and
            //  another for 'cash'. Each dataset has data points, a label, and styling properties 
            //  (such as background color and border color).

            labels: years,

            // This specifies the labels (years) for the X-axis of the chart.


            datasets: [
                // An array containing three objects, each representing a dataset (one for total cash,one for longterm debt 
                //     and one for total common shares).
                {
                    label: 'Total cash',
                    // label for total cash parameter
                    data: cash,
                    // variable to collect cash data from api
                    backgroundColor: 'rgba(0, 179, 134, 1)',
                    // background color of cash bar
                    borderColor: 'rgba(255, 99, 132, 1)',
                    // color of cash bar
                    borderWidth: 1
                    // width of borders
                },
                {
                    label: 'longTermDebt',
                    data: longTermDebt,
                    backgroundColor: 'rgba(0, 128, 255, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Shares',
                    data: commonStockShares,
                    backgroundColor: 'rgba(204, 255, 0, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            // This section specifies various options that customize the appearance and behavior of the chart.

            scales: {
                // This sub-object configures the scales (axes) of the chart.
                y: {
                    beginAtZero: true,
                    title:{
                        display:true,
                        text:'USD (Billions)'
                    }
                }
            },
            plugins: {
                // This sub-object allows you to configure plugins for the chart. In this case, it's used to set the chart title.
                title: {
                    //  This specifies the title plugin configuration.
                    display: true,
                    //  This indicates that the chart title should be displayed.
                    text: 'Common Stock Shares Outstanding'
                    // This sets the text for the chart title, which will be displayed at the top of the chart.
                }
            }
        }
    });
}

// Clear input fields and the chart
function clearInput1() {
    document.getElementById('companySymbol').value = '';
    document.getElementById('companySymbolDisplay').textContent = '';
    const ctx1 = document.getElementById('financialChart').getContext('2d');
    const existingChart = Chart.getChart(ctx1); // Get the existing chart instance

    if (existingChart) {
        existingChart.destroy(); // Destroy the existing chart if it exists
    }
}

// Functionality for fetching and plotting stock price data made with information gleaned via
// // js, C. (2023). How To Create Custom Legend For Doughnut Chart In Chart JS 4 Part 8. [online] 
// www.youtube.com. Available at: https://www.youtube.com/watch?v=Fn2GBSMooW8 [Accessed 28 Aug. 2023]. 
async function fetchAndPlotData() {
    const key = '6VWT72JNHHLBF3MH';
    const stockSymbol = document.getElementById('companySymbol').value.toUpperCase();
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=${key}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const timeSeries = data['Monthly Time Series'];

        if (!timeSeries) {
            alert('Data not found for the given stock symbol. Please check the symbol or try again later.');
            return;
        }

        const dates = Object.keys(timeSeries).slice(0, 120); // Last 10 years (12 months * 10 years = 120 months)
        const stockPrices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

        const ctx = document.getElementById('stockChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${stockSymbol} Stock Price`,
                    data: stockPrices,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: `${stockSymbol} Stock Price (Last 10 Years)`
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Stock Price (USD)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        alert('Error fetching data. Please try again later.');
        console.error(error);
    }
}

// Clear input fields and the chart
function clearInput() {
    document.getElementById('priceChart').value = '';
    document.getElementById('priceChart').textContent = '';
    const ctx = document.getElementById('stockChart').getContext('2d');
    const existingChart = Chart.getChart(ctx); // Get the existing chart instance

    if (existingChart) {
        existingChart.destroy(); // Destroy the existing chart if it exists
    }
}
