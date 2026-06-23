// src/ts/darkMode.ts
// ボタンを押した時の切り替え（セーブ）
export function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById("darkToggle");
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "on");
        if (btn)
            btn.textContent = "ライトモード";
    }
    else {
        localStorage.setItem("darkMode", "off");
        if (btn)
            btn.textContent = "ダークモード";
    }
}
// ページが開いた瞬間の自動復元（ロード）
export function initDarkMode() {
    const body = document.body;
    const btn = document.getElementById("darkToggle");
    const savedMode = localStorage.getItem("darkMode");
    // 先に「bodyの見た目」だけを絶対に適用する（ボタンの有無に関係なく！）
    if (savedMode === "on") {
        body.classList.add("dark");
    }
    else {
        body.classList.remove("dark");
    }
    // ボタンが存在するときだけ、ボタンの文字を合わせる
    if (btn) {
        if (savedMode === "on") {
            btn.textContent = "ライトモード";
        }
        else {
            btn.textContent = "ダークモード";
        }
    }
}
