import axios from "axios";

export default axios.create({
  baseURL: "https://illustrious-cup-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});
