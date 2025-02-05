const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios')

app.use(cors())
app.get('/api/classify-number/:id/', async (req, res) => {
    try {
        const { id } = req.params;
        const num = parseInt(id);
        if (isNaN(num)) {
            return res.status(400).json({
                "number": "alphabet",
                "error": true
            });
        }
        const response = await axios.get(`http://numbersapi.com/${id}/math`)
        const fun_fact = response.data

        let digit_sum = 0;
        for (let i = 0; i < id.length; i++) {
            if (!isNaN(id[i])) {
                digit_sum += parseInt(id[i]);
            }
        }

        function isPrime(id) {
                if (id < 2) return false;    
                for (let i = 2; i <= Math.sqrt(id); i++) { 
                    if (id % i === 0) {
                        return false;
                    }
                }
                return true;
        }
        function isPerfectNumber(id) {
            const number = parseInt(id);
        
            if (number <= 0) return false;
            let sum = 0;
        
            for (let i = 1; i <= Math.floor(number / 2); i++) {
                if (number % i === 0) {
                    sum += i;
                }
            }
            return sum === number;
        }
        
        function isArmstrong(id) {
            const number = parseInt(id);
            const digits = number.toString().split('');
            const numDigits = digits.length;
            const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), numDigits), 0);
        
            const isArmstrong = sum === number;
            const isOdd = number % 2 !== 0;
            const isEven = number % 2 === 0;
        
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
            "number": id,
            "is_prime": isPrime(id),
            "is_perfect":isPerfectNumber(id),
            "properties": (isArmstrong(id)),
            "digit_sum": digit_sum,
            "fun_fact": fun_fact,
       });
    
    } catch (error){
        res.status(500).json({ error: 'Failed to fetch external data' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});