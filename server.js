// server.js （JSONファイル読み込み版）

const express = require("express");
const cors = require("cors");
const fs = require("fs"); // 🌟 Node.jsが最初から持っている「ファイルを読み書きする機能」
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// カラー提案API
app.get("/api/suggest-colors", (req, res) => {
  try {
    // 同一フォルダにある colors.json の場所を特定する
    const jsonPath = path.join(__dirname, "colors.json");

    // ファイルを「テキスト」として読み込む
    const fileData = fs.readFileSync(jsonPath, "utf-8");

    // 読み込んだテキストを、プログラムが扱える「JSONオブジェクト（配列）」に変換する
    const colorPalettes = JSON.parse(fileData);

    // 配列からランダムで1つのパレットを選ぶ
    const randomPalette =
      colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

    // 画面側に送り返す！
    res.json(randomPalette);
  } catch (error) {
    console.error("JSONファイルの読み込みに失敗しました:", error);
    res.status(500).json({ error: "サーバー側でデータが読み込めませんでした" });
  }
});

app.listen(PORT, () => {
  console.log(
    `JSON連動型カラー提案APIが http://localhost:${PORT} で起動しました！`,
  );
});
