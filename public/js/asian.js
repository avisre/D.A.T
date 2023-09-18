// Explanation:
// This code is a JavaScript function that fetches daily stock price data for a list of stock symbols from the Alpha Vantage API and then displays this data on an HTML page. Here's a breakdown of what the code does step by step:


// Inside a `for` loop, the code iterates through each symbol in the `symbols` array:
//    - It uses the `fetch` function to make an HTTP request to Alpha Vantage's API to get the global quote for each symbol.
//    - It parses the response data as JSON.
//    - It calls the `createDailyPriceObj` function with the parsed data, the current symbol, and a callback function.
//    - Inside the callback function for `createDailyPriceObj`, if there is no error (`err` is null), it pushes the returned object (`obj`) into the `dataFetched` array.

// After all the fetch requests have been made and processed, the code updates the HTML content of specific elements with the fetched stock data:
//    - It sets the innerHTML of elements with IDs 'six', 'seven', 'eight', 'nine', and 'ten' to display the daily closing prices for different stock symbols in a formatted manner.

//  Finally, it returns the `dataFetched` array, which contains the fetched data for all the stock symbols.

// Note: To make this code work, you would need to have a webpage with elements having the specified IDs ('six', 'seven', 'eight', 'nine', 'ten'). Also, it uses the Alpha Vantage API to fetch stock data, so you need to make sure your API key is valid and that you are compliant with Alpha Vantage's terms of use.

 // Function to open and close navbar dynamically using mouseclick

const buttonToggle=document.getElementsByClassName('toggle-button')[0] 
const linkNavbar=document.getElementsByClassName('navbar-links')[0]

buttonToggle.addEventListener('click',()=>{
   linkNavbar.classList.toggle('active');
})

//  `createDailyPriceObj` function:
//    - This function takes three parameters: `data`, `symbol`, and `callback`.
//    - It checks if `data` is falsy (likely an error condition) and calls the `callback` function with an error if it is.
//    - It initializes an empty array `newData`.
//    - It pushes an object into `newData` with the `symbol` and the parsed and formatted daily closing price from the `data` object.
//    - Finally, it calls the `callback` function with `null` as the first argument (indicating no error) and `newData` as the second argument.


const createDailyPriceObj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};


const getDaily = async () => {
    const symbols = ['TCEHY', '600519.SS', 'BABA', '601288.SS', '601857.SS'];
    let dataFetched = [];

    // Inside a `for` loop, the code iterates through each symbol in the `symbols` array:
    //    - It uses the `fetch` function to make an HTTP request to Alpha Vantage's API to get the global quote for each symbol.
    //    - It parses the response data as JSON.
    //    - It calls the `createDailyPriceObj` function with the parsed data, the current symbol, and a callback function.
    //    - Inside the callback function for `createDailyPriceObj`, if there is no error (`err` is null), it pushes the returned object (`obj`) into the `dataFetched` array.

    // After all the fetch requests have been made and processed, the code updates the HTML content of specific elements with the fetched stock data:
    //    - It sets the innerHTML of elements with IDs 'six', 'seven', 'eight', 'nine', and 'ten' to display the daily closing prices for different stock symbols in a formatted manner.

    //  Finally, it returns the `dataFetched` array, which contains the fetched data for all the stock symbols.


    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);

                    dataFetched.push(...obj);
                });
            });
    }

    // console.log(dataFetched);

    document.getElementById('six').innerHTML += `<li> $${dataFetched[0].close}</li>`;
    document.getElementById('seven').innerHTML += `<li>  &#165;${dataFetched[1].close}</li>`;
    document.getElementById('eight').innerHTML += `<li> $${dataFetched[2].close}</li>`;
    document.getElementById('nine').innerHTML += `<li>  &#165;${dataFetched[3].close}</li>`;
    document.getElementById('ten').innerHTML += `<li>  &#165;${dataFetched[4].close}</li>`;

    return dataFetched;

};


//   India

//  `createDailyPriceObjj` function:
//    - This function takes three parameters: `data`, `symbol`, and `callback`.
//    - It checks if `data` is falsy (likely an error condition) and calls the `callback` function with an error if it is.
//    - It initializes an empty array `newData`.
//    - It pushes an object into `newData` with the `symbol` and the parsed and formatted daily closing price from the `data` object.
//    - Finally, it calls the `callback` function with `null` as the first argument (indicating no error) and `newData` as the second argument.



const createDailyPriceObjj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};

//  `getDaily1` function:
//    - This is an asynchronous function that fetches daily stock price data for a list of symbols.
//    - It defines an array `symbols` containing a list of stock symbols.
//    - It initializes an empty array `dataFetched` to store the fetched data.

const getDaily1 = async () => {
    const symbols = ['RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'ICICIBANK.BSE', 'HINDUNILVR.BSE', 'TM'];
    let dataFetched = [];

    // Inside a `for` loop, the code iterates through each symbol in the `symbols` array:
    //    - It uses the `fetch` function to make an HTTP request to Alpha Vantage's API to get the global quote for each symbol.
    //    - It parses the response data as JSON.
    //    - It calls the `createDailyPriceObjj` function with the parsed data, the current symbol, and a callback function.
    //    - Inside the callback function for `createDailyPriceObjj`, if there is no error (`err` is null), it pushes the returned object (`obj`) into the `dataFetched` array.

    // After all the fetch requests have been made and processed, the code updates the HTML content of specific elements with the fetched stock data:
    //    - It sets the innerHTML of elements with IDs 'one', 'two', 'three', 'four', and 'five' to display the daily closing prices for different stock symbols in a formatted manner.

    //  Finally, it returns the `dataFetched` array, which contains the fetched data for all the stock symbols.


    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObjj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);
                    dataFetched.push(...obj);
                });
            });
    }

    // console.log(dataFetched);


    document.getElementById('one').innerHTML += `<li> &#8377;${dataFetched[0].close}</li>`;
    document.getElementById('two').innerHTML += `<li> &#8377;${dataFetched[1].close}</li>`;
    document.getElementById('three').innerHTML += `<li> &#8377;${dataFetched[2].close}</li>`;
    document.getElementById('four').innerHTML += `<li> &#8377;${dataFetched[3].close}</li>`;
    document.getElementById('five').innerHTML += `<li> &#8377;${dataFetched[4].close}</li>`;





    return dataFetched;
};

// code for japan fucntions same as above but with different parameters for code entry like diffenet code symbols and unique 
// names for different fucntions and ID's 
const createDailyPriceObjjj = (data, symbol, callback) => {
    if (!data) return callback(err);
    let newData = [];

    newData.push({
        symbol: symbol,
        close: parseFloat(data["Global Quote"]["05. price"]).toFixed(2),
    });

    return callback(null, newData);
};



const getDaily2 = async () => {
    const symbols = ['TM', 'SONY', 'KYCCF', 'NPPXF', 'MUFG'];
    let dataFetched = [];

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];

        await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=6VWT72JNHHLBF3MH`)
            .then((response) => response.json())
            .then((data) => {
                createDailyPriceObjjj(data, symbol, (err, obj) => {
                    if (err) return console.error(err);
                    dataFetched.push(...obj);
                });
            });
    }

    // console.log(dataFetched);


    document.getElementById('eleven').innerHTML += `<li> $${dataFetched[0].close}</li>`;
    document.getElementById('twelve').innerHTML += `<li> $${dataFetched[1].close}</li>`;
    document.getElementById('thirteen').innerHTML += `<li> $${dataFetched[2].close}</li>`;
    document.getElementById('fourteen').innerHTML += `<li> $${dataFetched[3].close}</li>`;
    document.getElementById('fifteen').innerHTML += `<li> $${dataFetched[4].close}</li>`;


    return dataFetched;
};
