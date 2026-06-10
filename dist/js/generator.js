// generator.ts
// TypeScriptのモジュールシステムを使用するために、空のエクスポートを追加
export {};
// 配列の型を定義（文字列の配列なので string[] になります）
const themes = [
    "冒険",
    "学園",
    "未来都市",
    "魔法",
    "探偵"
];
// ボタン要素と結果表示用の要素を取得
const button = document.getElementById("generateBtn");
// 結果表示用の要素もHTMLDivElementであることを明示的に指定
const result = document.getElementById("topicBox");
// ボタンがクリックされたときのイベントリスナーを追加
button.addEventListener("click", () => {
    // ランダムにテーマを選ぶ
    const index = Math.floor(Math.random() * themes.length);
    // 結果を表示
    result.textContent = themes[index] ?? "";
});
