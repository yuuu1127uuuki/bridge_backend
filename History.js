const mongoose = require('mongoose');

// Historyスキーマの定義
const historySchema = new mongoose.Schema({
    operation: {
        type: String,
        enum: ['POST', 'PUT', 'DELETE'],
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'History' // コレクション名を明示的に指定
});

const History = mongoose.model('History', historySchema);

// 操作をHistoryに記録する関数
const logHistory = async (operation, data) => {
    try {
        // Mongooseドキュメントを純粋なオブジェクトに変換
        let plainData = data.toObject ? data.toObject() : data;

        console.log(`Logging history: Operation=${operation}, Data=${JSON.stringify(plainData)}`);

        // Historyエントリを作成
        const historyEntry = new History({ operation, data: plainData });

        // 保存
        const savedEntry = await historyEntry.save();
        console.log('History logged successfully:', savedEntry);
    } catch (err) {
        console.error('Error logging history:', err);
    }
};

module.exports = { logHistory, History };