const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5001;

// Replace with your actual Bearer token if different
const BEARER_TOKEN = "128|QxIdamLyUJSXmB1Ml67s6FLrr9MeAWIgvGR73eoH";

app.get("/api/shipping-orders", async (req, res) => {
  const apexUrl = "https://app.apextrading.com/api/v1/shipping-orders";
  try {
    const response = await axios.get(apexUrl, {
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Accept": "application/json"
      },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Proxy error:", error.response.status, error.response.data, error.response.headers);
      res.status(error.response.status).json({ error: error.message, details: error.response.data });
    } else {
      console.error("Proxy error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));
