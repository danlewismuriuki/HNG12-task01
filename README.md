Number Classifier API

Description

This is a simple Express.js API that classifies a given number based on various properties. It determines whether the number is:

Prime

Perfect

Armstrong (Narcissistic)

Odd or Even

Calculates the digit sum

Fetches a fun fact from the Numbers API

Features

Uses Express.js for routing

Fetches fun facts from Numbers API

Checks if a number is prime, perfect, or Armstrong

Determines if the number is odd or even

Computes the digit sum of the number

Installation

Clone this repository:

git clone https://github.com/your-username/number-classifier-api.git

Navigate into the project folder:

cd number-classifier-api

Install dependencies:

npm install

Usage

Start the server:

node server.js

Make a request to classify a number:

curl http://localhost:3000/api/classify-number/371/

Example response:

{
"number": 371,
"is_prime": false,
"is_perfect": false,
"properties": ["armstrong", "odd"],
"digit_sum": 11,
"fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}

API Endpoint

GET /api/classify-number/:id/

Path Parameter: id - The number to classify

Response: JSON object with number properties

Technologies Used

Node.js

Express.js

Axios

Numbers API

License

This project is open-source and available under the MIT License.
