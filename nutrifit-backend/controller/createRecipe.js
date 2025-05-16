import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

import { fetch } from "undici";
var request = require("request");

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};


export async function fatSecretAccessToken(req, res) {
    const clientId = 'b7abcedb6e454f3390814c8b9c07dae7'
    const clientSecret = 'fdc6b074f9a046b5a98414f64e332ab6'

    var options = {
        method: 'POST',
        url: 'https://oauth.fatsecret.com/connect/token',
        method: 'POST',
        auth: {
            user: clientId,
            password: clientSecret
        },
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
            'grant_type': 'client_credentials',
            'scope' : 'basic'
        },
        json: true
    };

    request(options, function(error, response, body) {
        if(error) throw new Error(error);

        console.log(body);
    })
}


export async function findRecipe(req, res) {
    // Will change every day
    const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3NDc0MDE1ODgsImV4cCI6MTc0NzQ4Nzk4OCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJiN2FiY2VkYjZlNDU0ZjMzOTA4MTRjOGI5YzA3ZGFlNyIsInNjb3BlIjpbImJhc2ljIl19.IrDDgglskkOCch6x6oCVO1A8s0uj1VGDANtswKfsJJkTmBmhveN-3vXf32KOhwOuVb_2GBtSIGzhehXjTz9_B8Rc6pMPKXAVflyED3-8l9gIYklnZDYenPbW1aNMzuHZTWMvjhNLNEML9_-HmcZ0jqZM9mhzZEhOcE9cVlnzyjuspZiGeHpS_FqnUYazWf9kVIndR7H74OSe9z1XeX8_qMQpTHcvvAdYTYS5dp091dvSijif60UsOw2lhmNa0h266p6W242hEKLQzuR9pqB7a9P-cEktGDWeBRtot4LGgynBtqEfpUWTcgCdU8egmAsxQfeuXOBq40lJj4L2XAGJT2CnT5sdGCqzQaXX9ByDATIpEi2wSHnpgOS6nufmCkocqzl0fUkspsFfv--gf4EJ0gK6qZUDvWZRcRTZHsVjz3xBYLKw3Qbg82YG-IMkL0FOa2jm1xyJC1p0CkvJup94l-dzoVtm0W73DtVdfDznleSPmO6zh7znqvL1MVQs9TUYc4viEbIrhi8F557jrafNbl3lcksjWKwDCnl5hnzmDP0xb70s40jSu3iXgGiAumUxzacPr9FyK3_lhzBQbFwYqizCxRVo83mRmuhcph2fFBOOU4U9lGNHaEsSLQr5P35Q74SBCNwIU2cTbE9W5U_ageRCH6yP0rW9LRyQ47LUnh4'
    API_URL = 'https://platform.fatsecret.com/rest/recipes/search/v3'
    var options = {
        method: 'GET',
        url: API_URL,
        headers: {
            'content-type': 'application/json',
            'authorization': accessToken
        },
        json: true
    };
    const response = await fetch(options);
    conso
}

