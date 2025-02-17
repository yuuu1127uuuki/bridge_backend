const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { logHistory, History } = require("./History");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

let hostname = "localhost";
// let hostname = "bridge-backend-6wcu.onrender.com"

// let hostname = "192.168.11.45"

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());

// MongoDB接続
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

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
    Date1: Number,
    Rank1: String,
    Date2: Number,
    Rank2: String,
    Date3: Number,
    Rank3: String,
    Date4: Number,
    Rank4: String,
    Date5: Number,
    Rank5: String,
    Date6: Number,
    Rank6: String,
    Date7: Number,
    Rank7: String,
    Date8: Number,
    Rank8: String,
    Date9: Number,
    Rank9: String,
    Date10: Number,
    Rank10: String,
    Date11: Number,
    Rank11: String,
    Date12: Number,
    Rank12: String,
    Date13: Number,
    Rank13: String,
    Date14: Number,
    Rank14: String,
    Date15: Number,
    Rank15: String,
    Date16: Number,
    Rank16: String,
    Date17: Number,
    Rank17: String,
    Date18: Number,
    Rank18: String,
    Date19: Number,
    Rank19: String,
    Date20: Number,
    Rank20: String,
});

const Location = mongoose.model("Location", locationSchema, "chopsticks");
module.exports = Location;

// データを取得するエンドポイント
app.get("/getopendata", async (req, res) => {
    try {
        const data = await Location.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "データ取得に失敗しました" });
    }
});

app.delete("/deleteopendata/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const deleteItem = await Location.findById(_id);
        if (!deleteItem) {
            return res.status(404).json({ message: "データがありません" });
        }
        await logHistory("DELETE", deleteItem);
        await Location.findByIdAndDelete(_id);
        res.status(200).json({ message: "削除に成功しました", item: deleteItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "データ取得に失敗しました" });
    }
});

app.post("/postopendata", async (req, res) => {
    try {
        // 既存の_idのデータ確認
        const existingData = await Location.findById(req.body._id);
        if (existingData) {
            return res.status(409).json({});
        }
        const newData = new Location(req.body);
        console.log("Received data:", req.body);
        const savedData = await newData.save();
        await logHistory("POST", savedData);
        res
            .status(201)
            .json({ message: "データの作成に成功しました", item: savedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "失敗しました" });
    }
});

app.put("/putopendata/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const updateData = req.body;

        const existingData = await Location.findById(_id);
        if (!existingData) {
            return res.status(404).json({ message: "データが見つかりません" });
        }

        console.log("Calling logHistory for PUT operation");
        await logHistory("PUT", existingData);
        console.log("logHistory called");

        // Shift Date and Rank fields
        existingData.Date5 = existingData.Date4;
        existingData.Rank5 = existingData.Rank4;
        existingData.Date4 = existingData.Date3;
        existingData.Rank4 = existingData.Rank3;
        existingData.Date3 = existingData.Date2;
        existingData.Rank3 = existingData.Rank2;
        existingData.Date2 = existingData.Date1;
        existingData.Rank2 = existingData.Rank1;
        existingData.Date1 = existingData.Date;
        existingData.Rank1 = existingData.Rank;

        // Update with new data
        existingData.Date = updateData.Date;
        existingData.Rank = updateData.Rank;

        // Update other fields
        Object.keys(updateData).forEach((key) => {
            if (key !== "Date" && key !== "Rank") {
                existingData[key] = updateData[key];
            }
        });

        const updatedData = await existingData.save();
        res
            .status(200)
            .json({ message: "データの更新に成功しました", item: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "更新に失敗しました" });
    }
});

// Historyデータを取得するエンドポイント
app.get("/gethistory", async (req, res) => {
    try {
        const historyData = await History.find().sort({ timestamp: -1 }); // 最新順に取得
        res.json(historyData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "履歴の取得に失敗しました" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
