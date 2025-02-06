// const express = require('express');
// const cors = require('cors');
// const app = express();
// const axios = require('axios');

// app.use(cors());
// app.get('/api/classify-number', async (req, res) => {
//         const { number } = req.query;
//         const num = parseInt(number);
//         if (isNaN(num)) {
//             return res.status(400).json({
//                 "error": true,
//                 "number": number
//             });
//         }
//         const response = await axios.get(`http://numbersapi.com/${number}/math`);
//         const fun_fact = response.data;

//         let digit_sum = 0;
//         for (let i = 0; i < number.length; i++) {
//             if (!isNaN(number[i])) {
//                 digit_sum += parseInt(number[i]);
//             }
//         }

//         function isPrime(number) {
//             if (number < 2) return false;
//             for (let i = 2; i <= Math.sqrt(number); i++) {
//                 if (number % i === 0) {
//                     return false;
//                 }
//             }
//             return true;
//         }

//         function isPerfectNumber(number) {
//             const num = parseInt(number);

//             if (num <= 0) return false;
//             let sum = 0;

//             for (let i = 1; i <= Math.floor(num / 2); i++) {
//                 if (num % i === 0) {
//                     sum += i;
//                 }
//             }
//             return sum === num;
//         }

//         function isArmstrong(number) {
//             const num = Math.abs(parseInt(number));
//             const digits = num.toString().split('');
//             const numDigits = digits.length;
//             const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), numDigits), 0);

//             const isArmstrong = sum === num;
//             const isOdd = num % 2 !== 0;
//             const isEven = num % 2 === 0;

//             if (isArmstrong) {
//                 if (isOdd) {
//                     return ["armstrong", "odd"];
//                 } else if (isEven) {
//                     return ["armstrong", "even"];
//                 }
//             } else {
//                 return isOdd ? ["odd"] : ["even"];
//             }
//         }

//         res.json({
//             "number": number,
//             "is_prime": isPrime(num),
//             "is_perfect": isPerfectNumber(num),
//             "properties": isArmstrong(num),
//             "digit_sum": digit_sum,
//             "fun_fact": fun_fact,
//         });
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const cache = new Map(); // Caching to store previously fetched results

app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;

    // Validate input: Must be a valid integer
    if (!/^-?\d+$/.test(number)) {
        return res.status(400).json({
            "number": number,
            "error": true
        });
    }

    const num = parseInt(number);

    // Check if result is already cached
    if (cache.has(num)) {
        return res.json(cache.get(num));
    }

    // Optimized digit sum calculation
    let digit_sum = [...number].reduce((sum, digit) => sum + (/\d/.test(digit) ? parseInt(digit) : 0), 0);

    // Prime number check
    const isPrime = (n) => {
        if (n < 2) return false;
        for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
            if (n % i === 0) return false;
        }
        return true;
    };

    // Perfect number check
    const isPerfectNumber = (n) => {
        if (n <= 0) return false;
        let sum = 1;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) {
                sum += i;
                if (i !== n / i) sum += n / i;
            }
        }
        return sum === n && n !== 1;
    };

    // Armstrong number and properties check
    const getProperties = (n) => {
        let properties = [];
        let digits = [...n.toString()].map(Number);
        let armstrongSum = digits.reduce((acc, d) => acc + d ** digits.length, 0);

        if (armstrongSum === n) properties.push("armstrong");
        properties.push(n % 2 === 0 ? "even" : "odd");

        return properties;
    };

    try {
        // Fetch fun fact asynchronously with timeout to avoid long waits
        const funFactPromise = axios.get(`http://numbersapi.com/${num}/math`, { timeout: 300 });

        // Run classification functions concurrently
        const [funFactResponse] = await Promise.all([funFactPromise]);

        const responseData = {
            "number": num,
            "is_prime": isPrime(num),
            "is_perfect": isPerfectNumber(num),
            "properties": getProperties(num),
            "digit_sum": digit_sum,
            "fun_fact": funFactResponse.data
        };

        // Store response in cache for future requests
        cache.set(num, responseData);

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ "error": true, "message": "Failed to fetch fun fact" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
