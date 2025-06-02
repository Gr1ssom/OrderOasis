import axios from "axios";

const api = axios.create({
  baseURL: "https://app.apextrading.com/api/v1",
  headers: {
    'X-Api-Key': '128|QxIdamLyUJSXmB1Ml67s6FLrr9MeAWIgvGR73eoH',
    'Content-Type': 'application/json'
  }
});

export default api;
