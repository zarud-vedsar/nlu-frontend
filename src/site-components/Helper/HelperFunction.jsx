import axios from "axios";

export const goBack = () => {
    window.history.back();
};
export const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
export const capitalizeEachLetter = (str) => {
    if (str) {
        // Split the string into words by spaces, capitalize each word, and join them back with spaces
        return str
            .split(' ') // Split the string into an array of words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
            .join(' '); // Join the words back into a single string
    }
    return str;
}
export const capitalizeAllLetters = (strLetter) => {
    if (strLetter) {
        // Convert the entire string to uppercase
        return strLetter.toUpperCase();
    }
    return strLetter;
};
export const extractGoogleDriveId = (url) => {
    const regex = /(?:drive\.google\.com\/.*?\/d\/)([^\/?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
export const productUnits = [
    "Piece (pcs)",
    "Pack (pkt)",
    "Box (bx)",
    "Case (cs)",
    "Carton (ctn)",
    "Bundle (bdl)",
    "Roll (rl)",
    "Kilogram (kg)",
    "Gram (g)",
    "Ton (tn)",
    "Liter (l)",
    "Milliliter (ml)",
    "Square Meter (sqm)",
    "Cubic Meter (cbm)",
    "Dozen (dz)",
    "Pair (pr)",
    "Set (set)"
];
export const googleDriveUrl = (fileid) => {
    return `https://drive.google.com/file/d/${fileid}/preview`;
}
export const indianStates = [
    // List of 28 States
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Karnataka",
    "Madhya Pradesh",
    "Maharashtra",
    "Odisha",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "West Bengal",
    "Punjab",
    "Himachal Pradesh",
    "Uttarakhand",
    "Jharkhand",
    "Kerala",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Sikkim",
    "Tripura",

    // List of 8 Union Territories
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Puducherry",
    "Andaman and Nicobar Islands",
    "Lakshadweep",
];
// date format indian
export const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date)) {
        return 'Invalid Date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month are 0 indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export const formatTime = (time) => {
    if (!time) return ''; // Handle empty values
    const [hour, minute] = time.split(':');
    let period = 'AM';
    let formattedHour = parseInt(hour, 10);
  
    if (formattedHour >= 12) {
      period = 'PM';
      if (formattedHour > 12) {
        formattedHour -= 12;
      }
    } else if (formattedHour === 0) {
      formattedHour = 12;
    }
  
    return `${formattedHour}:${minute} ${period}`;
  };
// POST request - Create
export const dataFetchingPost = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error("POST Error:", error);
        throw error.response?.data || error.message;
    }
};

// GET request - Read
export const dataFetchingGet = async (url, params = {}) => {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error("GET Error:", error);
        throw error.response?.data || error.message;
    }
};

// PUT request - Update (complete update)
export const dataFetchingPut = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        console.error("PUT Error:", error);
        throw error.response?.data || error.message;
    }
};

// PATCH request - Update (partial update)
export const dataFetchingPatch = async (url, data) => {
    try {
        const response = await axios.patch(url, data);
        return response.data;
    } catch (error) {
        console.error("PATCH Error:", error);
        throw error.response?.data || error.message;
    }
};

// DELETE request - Delete
export const dataFetchingDelete = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("DELETE Error:", error);
        throw error.response?.data || error.message;
    }
};
export const slugify = (text) => {
    return text
        .toString()                   // Convert to string
        .toLowerCase()                // Convert to lowercase
        .trim()                       // Trim whitespace
        .replace(/[\s\W-]+/g, '-')    // Replace spaces and non-word characters with hyphens
        .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}
