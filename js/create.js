
const editIndex = localStorage.getItem("editPalette");
const saveBtn =document.getElementById("localSaveBtn");
const exportBtn = document.getElementById("exportBtn");
const backBtn = document.getElementById("backBtn");

// 編集モードの場合は既存のパレットを読み込む
if (editIndex !== null) {
    const palettes = JSON.parse(localStorage.getItem("palettes")) || [];
    const palette = palettes[editIndex];

    // パレットが存在する場合はフォームに値をセット
    if (palette) {
        document.getElementById("paletteName").value =palette.name;
        document.getElementById("color1").value = palette.colors[0];
        document.getElementById("color2").value = palette.colors[1];
        document.getElementById("color3").value = palette.colors[2];
        document.getElementById("color4").value = palette.colors[3];
    }
}

// パレット取得
function getPalette() {
    return {
        name:
        // パレット名を取得
            document.getElementById("paletteName").value,
        
        // カラーコードを取得
        colors:[
            document.getElementById("color1").value,
            document.getElementById("color2").value,
            document.getElementById("color3").value,
            document.getElementById("color4").value
        
        ]
    };
}

// アプリに保存
saveBtn.addEventListener("click", () => {
        const palette = getPalette();

        // パレット名が空の場合は保存しない
        if (palette.name === "") {
            alert("パレット名を入力してください");
            return;
        }

        // 既存のパレットを取得
        let palettes = JSON.parse(localStorage.getItem("palettes")) || [];

        // 編集モード
        if (editIndex !== null) {
            // 対象のパレットを更新
            palettes[editIndex] = palette;

            // 編集モードが終わったので保存後に削除
            localStorage.removeItem("editPalette");
        
        } else {
            // 新規作成
            palettes.push(palette);
        }

        // 更新して保存
        localStorage.setItem("palettes",JSON.stringify(palettes));
        alert("保存しました");

        // ホームに戻る
        location.href = "Home.html";
    }
);

// JSON保存
exportBtn.addEventListener("click", () => {
        const palette = getPalette();
        const json = JSON.stringify(palette, null, 4);
        const blob =new Blob([json], {
                    type:
                        "application/json" 
                    }
                );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        // パレット名が空の場合は保存しない
        if (palette.name === "") {
            alert("パレット名を入力してください");
            return;
        }

        // ダウンロード
        a.href = url;
        a.download = `${palette.name}.json`;
        a.click();

        // URLを解放
        URL.revokeObjectURL(url);

        alert("JSONを保存しました");

    }
);

// 戻る
backBtn.addEventListener("click", () => {
        // 編集モードの場合は保存前に削除
        localStorage.removeItem("editPalette");
        
        // ホームに戻る
        location.href = "Home.html";
    
    }
);