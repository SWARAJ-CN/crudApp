import axios from "axios";
import toast from "react-hot-toast";

const CommonAPI =  async (method, url, data)=>{
    try {
    const response = await axios({
        method,
        url,
        data,
    }); 
    return response

    } catch (error) {
       console.log(error);
       toast.error('ᯤ Try to reconnect.')
    }
}

export default CommonAPI