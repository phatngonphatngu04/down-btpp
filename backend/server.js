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

// --- Endpoint để lấy danh sách file từ Google Drive ---
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

// --- Endpoint Health Check để đánh thức server ---
// Endpoint này sẽ được một dịch vụ bên ngoài (như UptimeRobot, Cron-job.org) gọi định kỳ
// để giữ cho server của bạn không bị "ngủ" do không có hoạt động.
app.get('/api/health', (req, res) => {
    // Trả về một thông báo đơn giản để xác nhận server đang chạy
    res.status(200).json({ status: 'ok', message: 'Server is awake and healthy!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
