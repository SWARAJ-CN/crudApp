import axios from "axios";
import toast from "react-hot-toast";

const CommonAPI = async (method, url, data) => {
    try {
        const response = await axios({
            method,
            url,
            data,
        }); 
        return response;
    } catch (error) {
        console.log("API Error Log:", error);
        toast.error('ᯤ Try to reconnect.');
        throw error;
    }
}

export default CommonAPI;