const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Để đọc API key từ biến môi trường

const app = express();
const PORT = process.env.PORT || 3000;

// Lấy API Key từ biến môi trường trên Render, không lưu trong code
const API_KEY = process.env.GOOGLE_API_KEY; 
const FOLDER_ID = '1-iSQUVPz1Gl9imiXWHecvrAmw7UtiHHm';

// Cho phép frontend (từ GitHub Pages) gọi đến backend này
app.use(cors()); 
app.use(express.json());

// Tạo một endpoint để frontend gọi đến
app.get('/api/files', async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const url = `https://www.googleapis.com/drive/v3/files`;

    try {
        const response = await axios.get(url, {
            params: {
                q: `'${FOLDER_ID}' in parents and trashed = false`,
                fields: 'files(id, name)',
                orderBy: 'name',
                pageSize: 1000,
                key: API_KEY // API Key được dùng an toàn ở đây
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Google Drive API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch files from Google Drive.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
