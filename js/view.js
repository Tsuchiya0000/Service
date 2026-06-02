

const palettes = JSON.parse(localStorage.getItem("palettes")) || [];
const index = localStorage.getItem("selectedPalette");
const palette = palettes[index];

document.getElementById("paletteName").textContent = palette.name;

const colors = document.getElementById("colors");

// カラー情報の表示
palette.colors.forEach(color => {
    const container = document.createElement("div");
    const colorBox  = document.createElement("div");
    const colorCode = document.createElement("p");

    container.style.display   = "inline-block";
    container.style.margin    = "10px";
    container.style.textAlign = "center";

    colorBox.style.width      = "100px";
    colorBox.style.height     = "100px";
    colorBox.style.background = color;
    colorBox.style.border     = "1px solid #ccc";
    
    colorCode.textContent  = color;
    colorCode.style.cursor = "pointer";
    colorCode.onclick      = () => {
        // カラーコードをクリップボードにコピー
        navigator.clipboard.writeText(color);
        alert("カラーコードをコピーしました！");
    }

    container.appendChild(colorBox);
    container.appendChild(colorCode);
    colors.appendChild(container);
});

// 編集
document.getElementById("editBtn").addEventListener("click", () => {
    // 編集対象のパレットを保存    
    localStorage.setItem("editPalette", index);
        // 編集ページへ
        location.href = "Create.html";
    }
);

// 削除
document.getElementById("deleteBtn").addEventListener("click", () => {
        if (confirm("このパレットを削除しますか？")) {
            // パレット削除
            palettes.splice(index, 1);
            // 更新して保存
            localStorage.setItem("palettes",JSON.stringify(palettes));
            // ホームに戻る
            location.href = "Home.html";
        }
    }
);

// 戻る
document.getElementById("backBtn").addEventListener("click", () => {
        location.href = "Home.html";
    }
);