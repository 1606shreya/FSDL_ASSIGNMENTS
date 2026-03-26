import axios from 'axios';

async function testTranslation() {
    try {
        const res = await axios.post('http://localhost:5000/api/translate', {
            text: 'Dashboard',
            targetLang: 'mr'
        });
        console.log("Success:", res.data);
    } catch (error) {
        console.error("Axios Error:", error.message);
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Response Status:", error.response.status);
        }
    }
}
testTranslation();
