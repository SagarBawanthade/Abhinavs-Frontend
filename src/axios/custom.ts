import axios from "axios";

const customFetch = axios.create({
    baseURL: "https://abhinasv-s-backend.onrender.com/",
    headers: {
        Accept: "application/json"
    }
})

export default customFetch;