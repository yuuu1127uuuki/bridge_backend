const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const app = express();
const PORT = 8000;

let hostname = "localhost"
// let hostname = "192.168.11.45"

app.use(cors({
    origin: '*',
}))

// MongoDB接続
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// スキーマとモデルの定義
const locationSchema = new mongoose.Schema({

    _id: String,
    Date: Number,
    Inspector: String,
    Keisiki: String,
    Id: String,
    Name: String,
    Road: String,
    Rank: String,
    Tel: String,
});

const Location = mongoose.model('Location', locationSchema, 'chopsticks');
module.exports = Location;

// データを取得するエンドポイント
app.get('/getopendata', async (req, res) => {
    try {
        const data = await Location.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'データ取得に失敗しました' });
    }
});

app.delete('/deleteopendata/:_id', async (req, res) => {
    try {
        const _id = req.params;
        // console.log(_id)
        const deleteItem = await Location.findByIdAndDelete(_id);
        if (!deleteItem) {
            return res.status(404).json({ message: "データがありません" });
        }
        res.status(200).json({ message: "削除に成功しました", item: deleteItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データ取得に失敗しました' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
});
