// view.ts

// TypeScriptのモジュールシステムを使用するために、空のエクスポートを追加
export {};

// パレットデータの構造（型）を定義する
interface Palette {
  name: string;
  colors: string[];
}

// ローカルストレージからパレット一覧を取得
const localData = localStorage.getItem("palettes");
const palettes: Palette[] = localData ? JSON.parse(localData) : [];

// 選択されたインデックスを取得して数値化
const indexStr = localStorage.getItem("selectedPalette");
const index = indexStr !== null ? parseInt(indexStr, 10) : null;

// インデックスが正常で、パレットが存在するかチェック
if (index !== null && palettes[index]) {
  const palette = palettes[index];

  // パレット名を表示
  const paletteNameEl = document.getElementById("paletteName");
  if (paletteNameEl) {
    paletteNameEl.textContent = palette.name;
  }

  const colorsContainer = document.getElementById("colors");

  if (colorsContainer) {
    // カラー情報の表示
    palette.colors.forEach((color: string) => {
      const container = document.createElement("div");
      const colorBox = document.createElement("div");
      const colorCode = document.createElement("p");

      container.style.display = "inline-block";
      container.style.margin = "10px";
      container.style.textAlign = "center";

      colorBox.style.width = "100px";
      colorBox.style.height = "100px";
      colorBox.style.background = color;
      colorBox.style.border = "1px solid #ccc";

      colorCode.textContent = color;
      colorCode.style.cursor = "pointer";

      // カラーコードをクリップボードにコピー
      colorCode.onclick = () => {
        navigator.clipboard
          .writeText(color)
          .then(() => {
            alert("カラーコードをコピーしました！");
          })
          .catch(() => {
            alert("コピーに失敗しました");
          });
      };

      container.appendChild(colorBox);
      container.appendChild(colorCode);
      colorsContainer.appendChild(container);
    });
  }
}

// 各種ボタンのエレメントを取得してイベントを設定
const editBtn = document.getElementById("editBtn") as HTMLButtonElement | null;
const deleteBtn = document.getElementById(
  "deleteBtn",
) as HTMLButtonElement | null;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement | null;

// 編集ボタン
if (editBtn && index !== null) {
  editBtn.addEventListener("click", () => {
    // 編集対象のパレットのインデックスを保存
    localStorage.setItem("editPalette", index.toString());
    // 編集ページへ
    location.href = "Create.html";
  });
}

// 削除ボタン
if (deleteBtn && index !== null) {
  deleteBtn.addEventListener("click", () => {
    if (confirm("このパレットを削除しますか？")) {
      // パレット削除
      palettes.splice(index, 1);
      // 更新して保存
      localStorage.setItem("palettes", JSON.stringify(palettes));
      // ホームに戻る
      location.href = "Home.html";
    }
  });
}

// 戻るボタン
if (backBtn) {
  backBtn.addEventListener("click", () => {
    location.href = "Home.html";
  });
}
