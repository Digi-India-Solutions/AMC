import axios from "axios";
const serverURL = 'http://192.168.29.116:8000'

const currentDate = () => {
    var d = new Date()
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    var ct = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    return (cd + " " + ct)
}

const createDate = (date) => {
    var d = new Date(date)
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    var ct = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    return (cd + " " + ct)
}

const postData = async (url, body) => {
    try {
        const response = await axios.post(`${serverURL}/${url}`, body);
        return response.data;
    } catch (e) {
        console.log("Axios error:", e.message);

        if (e.response && e.response.data) {
            return e.response.data;
        } else {
            return { status: false, message: "Network or server error" };
        }
    }
};


const getData = async (url) => {
    try {
        var response = await axios.get(`${serverURL}/${url}`)
        var result = response.data

        return result
    }
    catch (e) {
        return e.response.data
    }
}



export { postData, serverURL, currentDate, getData, createDate }