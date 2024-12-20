const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const app = express();
const PORT = 8000;

let hostname = "localhost"
// let hostname = "bridge-backend-6wcu.onrender.com"

// let hostname = "192.168.11.45"

app.use(cors({
    origin: '*',
}))
app.use(express.json());

// MongoDB接続
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// スキーマとモデルの定義
const locationSchema = new mongoose.Schema({
    _id: { type: String },
    bridge: String,
    Inspector: String,
    Tel: String,
    Id: String,
    Name: String,
    Kana: String,
    Road: String,
    address: String,
    Keisiki: String,
    birth: String,
    length: Number,
    width: Number,
    HowUse: String,
    Date: Number,
    Rank: String,
    Schedule: String,
    New: String,
    Ho1: String,
    Ho2: String,
    Ho3: String,
    Ho4: String,
    Ho5: String,
    Record: String,
    Co: String,
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

app.post('/postopendata', async (req, res) => {
    try {

        const newData = new Location(req.body); // リクエストボディからデータを取得
        console.log("Received data:", req.body);
        const savedData = await newData.save(); // データベースに保存
        res.status(201).json({ message: "データの作成に成功しました", item: savedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '失敗しました' });
    }
});

app.put('/putopendata/:_id', async (req, res) => {
    try {
        const { _id } = req.params; // URLパラメータからIDを取得
        const updateData = req.body; // リクエストボディから更新データを取得

        // MongoDBで該当データを更新
        const updatedItem = await Location.findByIdAndUpdate(_id, updateData, {
            new: true, // 更新後のデータを返す
            runValidators: true // バリデーションを有効にする
        });

        if (!updatedItem) {
            return res.status(404).json({ message: "データが見つかりません" });
        }

        res.status(200).json({ message: "更新に成功しました", item: updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "データ更新に失敗しました" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
});
