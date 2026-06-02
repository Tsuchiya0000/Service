
// 保存済みパレット表示
const paletteList = document.getElementById("paletteList");
// 初期表示
render();
// パレット一覧表示
function render(){
    if(!paletteList) return;

    paletteList.innerHTML = "";

    const palettes = JSON.parse(localStorage.getItem("palettes")) || [];

    palettes.forEach((palette, index) => {
        const card = document.createElement("div");
        card.className = "paletteCard";

        const name = document.createElement("h3");
        name.textContent = palette.name;

        const colors = document.createElement("div");
        colors.className = "colorRow";

        palette.colors.forEach(color => {
            const dot = document.createElement("div");
            dot.className = "colorDot";
            dot.style.background = color;
            colors.appendChild(dot);
        });

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "見る";
        viewBtn.onclick = () => {
            localStorage.setItem("selectedPalette", index);
            location.href = "View.html";
        };

        const editBtn = document.createElement("button");
        editBtn.textContent = "編集";
        editBtn.onclick = () => {
            localStorage.setItem("editPalette", index);
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


// ファイル選択ボタン
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

// パレットインポート
if(importBtn && importFile){
    importBtn.addEventListener("click", () => {
        importFile.click();
    });

    importFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            try{
                const data = JSON.parse(reader.result);

                const newPalettes = Array.isArray(data) ? data : [data];

                let palettes = JSON.parse(localStorage.getItem("palettes")) || [];

                palettes.push(...newPalettes);

                localStorage.setItem("palettes", JSON.stringify(palettes));

                alert("インポート完了");

                render();
            }catch(err){
                alert("JSONが正しくない");
            }
        };

        reader.readAsText(file);
    });
}


// ダークモード
const darkToggle = document.getElementById("darkToggle");

// ダークモード切り替え
if(darkToggle){

    if(localStorage.getItem("darkMode") === "on"){
        document.body.classList.add("dark");
        darkToggle.textContent = "ライトモード";
    }

    darkToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("darkMode", "on");
            darkToggle.textContent = "ライトモード";
        }else{
            localStorage.setItem("darkMode", "off");
            darkToggle.textContent = "ダークモード";
        }
    });
}