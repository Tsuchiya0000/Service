// home.ts
import { toggleDarkMode } from "./darkMode.js";
// TypeScriptのモジュールシステムを使用するために、空のエクスポートを追加
export {};
// 保存済みパレット表示の要素
const paletteList = document.getElementById("paletteList");
// 初期表示
render();
// パレット一覧表示
function render() {
    // 返り値がない関数なので : void をつける
    if (!paletteList)
        return;
    paletteList.innerHTML = "";
    // localStorageから取得したデータを「Palette型の配列」として扱う
    const localData = localStorage.getItem("palettes");
    const palettes = localData ? JSON.parse(localData) : [];
    palettes.forEach((palette, index) => {
        const card = document.createElement("div");
        card.className = "paletteCard";
        const name = document.createElement("h3");
        name.textContent = palette.name;
        const colors = document.createElement("div");
        colors.className = "colorRow";
        palette.colors.forEach((color) => {
            const dot = document.createElement("div");
            dot.className = "colorDot";
            dot.style.background = color;
            colors.appendChild(dot);
        });
        const viewBtn = document.createElement("button");
        viewBtn.textContent = "見る";
        viewBtn.onclick = () => {
            localStorage.setItem("selectedPalette", index.toString()); // 数値は文字列にして保存
            location.href = "View.html";
        };
        const editBtn = document.createElement("button");
        editBtn.textContent = "編集";
        editBtn.onclick = () => {
            localStorage.setItem("editPalette", index.toString());
            location.href = "Create.html";
        };
        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.onclick = () => {
            palettes.splice(index, 1);
            localStorage.setItem("palettes", JSON.stringify(palettes));
            render();
        };
        card.appendChild(name);
        card.appendChild(colors);
        card.appendChild(viewBtn);
        card.appendChild(editBtn);
        card.appendChild(delBtn);
        paletteList.appendChild(card);
    });
}
// ファイル選択ボタン（それぞれ適切な要素の型を指定する）
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
// パレットインポート
if (importBtn && importFile) {
    importBtn.addEventListener("click", () => {
        importFile.click();
    });
    // イベントオブジェクト「e」に適切な型をつける
    importFile.addEventListener("change", (e) => {
        const target = e.target;
        const file = target.files?.[0]; // 選択されたファイル（存在しない可能性を考慮して ? をつける）
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                // reader.resultが文字列であることを保証する
                const resultText = reader.result;
                const data = JSON.parse(resultText);
                // インポートされたデータがPaletteの配列か、単一のPaletteかチェック
                const newPalettes = Array.isArray(data) ? data : [data];
                const localData = localStorage.getItem("palettes");
                let palettes = localData ? JSON.parse(localData) : [];
                palettes.push(...newPalettes);
                localStorage.setItem("palettes", JSON.stringify(palettes));
                alert("インポート完了");
                render();
            }
            catch (err) {
                alert("JSONが正しくない");
            }
        };
        reader.readAsText(file);
    });
}
// ダークモード// ダークモード
const darkToggle = document.getElementById("darkToggle");
// ダークモード切り替え
if (darkToggle) {
    // 初回読み込み時のチェック
    if (localStorage.getItem("darkMode") === "on") {
        document.body.classList.add("dark");
        darkToggle.textContent = "ライトモードに切り替え";
    }
    // ボタンをクリックした時に外部関数を実行
    darkToggle.addEventListener("click", () => {
        toggleDarkMode();
        // モードの状態をlocalStorageに保存する処理だけここに残す
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("darkMode", "on");
        }
        else {
            localStorage.setItem("darkMode", "off");
        }
    });
}
// 履歴機能付きAPI
let imageHistory = [];
const dogBtn = document.getElementById("dogBtn");
const dogArea = document.getElementById("dogArea");
const historyArea = document.getElementById("historyArea");
function displayImage(url) {
    if (dogArea) {
        dogArea.innerHTML = `<img src="${url}" alt="インスピレーション" style="max-width: 100%; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">`;
    }
}
function updateHistoryButtons() {
    if (!historyArea) {
        return;
    }
    historyArea.innerHTML = "";
    imageHistory.forEach((url, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${index + 1}枚前`;
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            displayImage(url);
        });
        historyArea.appendChild(btn);
    });
}
if (dogBtn && dogArea && historyArea) {
    dogBtn.addEventListener("click", async () => {
        dogArea.innerHTML = "<p>通信中...（世界のアートを探しています）</p>";
        try {
            const randomId = Math.floor(Math.random() * 1000);
            const imageUrl = `https://picsum.photos/id/${randomId}/400/300`;
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error("画像が見つかりませんでした");
            }
            imageHistory.unshift(imageUrl);
            if (imageHistory.length > 5) {
                imageHistory.pop();
            }
            displayImage(imageUrl);
            updateHistoryButtons();
        }
        catch (error) {
            dogArea.innerHTML =
                "<p style='color: #666;'>もう一度ボタンを押してください！</p>";
            console.error("APIエラー:", error);
        }
    });
}
// idの名前をHTMLと合わせる
const colorSuggestBtn = document.getElementById("suggestColorBtn");
const colorSuggestArea = document.getElementById("suggestColorArea");
if (colorSuggestBtn && colorSuggestArea) {
    colorSuggestBtn.addEventListener("click", async () => {
        colorSuggestArea.innerHTML =
            "<p>通信中...（自作サーバーが配色を計算しています）</p>";
        try {
            let colorBoxesHTML = "";
            const response = await fetch("http://localhost:3000/api/suggest-colors");
            const data = await response.json();
            if (!response.ok) {
                throw new Error("通信エラー");
            }
            // 組みあわせる
            data.colors.forEach((color) => {
                colorBoxesHTML += `
                    <div style="text-align: center;">
                        <div style="width: 60px; height: 60px; background-color: ${color}; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 10px;"></div>
                        <span style="font-size: 12px; color: #666; font-family: monospace;">${color}</span>
                    </div>
                `;
            });
            // 画面を書き換える
            colorSuggestArea.innerHTML = `
                <div style="padding: 15px; text-align: center;">
                    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">おすすめテーマ：${data.theme}</p>
                    <div style="display: flex; justify-content: center;">
                        ${colorBoxesHTML}
                    </div>
                </div>
            `;
        }
        catch (error) {
            colorSuggestArea.innerHTML =
                "<p style='color: red;'>カラー提案APIとの通信に失敗しました。</p>";
            console.error("APIエラー:", error);
        }
    });
}
