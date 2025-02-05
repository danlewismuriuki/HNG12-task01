const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.get('/api/classify-number', async (req, res) => {
        const { number } = req.query;
        const num = parseInt(number);
        if (isNaN(num)) {
            return res.status(400).json({
                "number": number,
                "error": true
            });
        }
        const response = await axios.get(`http://numbersapi.com/${number}/math`);
        const fun_fact = response.data;

        let digit_sum = 0;
        for (let i = 0; i < number.length; i++) {
            if (!isNaN(number[i])) {
                digit_sum += parseInt(number[i]);
            }
        }

        function isPrime(number) {
            if (number < 2) return false;
            for (let i = 2; i <= Math.sqrt(number); i++) {
                if (number % i === 0) {
                    return false;
                }
            }
            return true;
        }

        function isPerfectNumber(number) {
            const num = parseInt(number);

            if (num <= 0) return false;
            let sum = 0;

            for (let i = 1; i <= Math.floor(num / 2); i++) {
                if (num % i === 0) {
                    sum += i;
                }
            }
            return sum === num;
        }

        function isArmstrong(number) {
            const num = Math.abs(parseInt(number));
            const digits = num.toString().split('');
            const numDigits = digits.length;
            const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), numDigits), 0);

            const isArmstrong = sum === num;
            const isOdd = num % 2 !== 0;
            const isEven = num % 2 === 0;

            if (isArmstrong) {
                if (isOdd) {
                    return ["armstrong", "odd"];
                } else if (isEven) {
                    return ["armstrong", "even"];
                }
            } else {
                return isOdd ? ["odd"] : ["even"];
            }
        }

        res.json({
            "number": number,
            "is_prime": isPrime(num),
            "is_perfect": isPerfectNumber(num),
            "properties": isArmstrong(num),
            "digit_sum": digit_sum,
            "fun_fact": fun_fact,
        });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
