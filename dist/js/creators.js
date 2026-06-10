// creators.ts
// TypeScriptのモジュールシステムを使用するために、空のエクスポートを追加
export {};
// HTML要素をすべて取得する（適切な型をあてはめる）
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const searchBox = document.getElementById("searchBox");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const tagList = document.getElementById("tagList");
// 初期表示
render();
renderTags();
// 検索クリアボタンの処理
if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
        if (searchBox) {
            searchBox.value = "";
            render();
        }
    });
}
// 追加ボタンの処理
if (addBtn) {
    addBtn.addEventListener("click", () => {
        // 各入力フォームの要素をその場で取得
        const nameEl = document.getElementById("name");
        const urlEl = document.getElementById("url");
        const tagEl = document.getElementById("tag");
        const memoEl = document.getElementById("memo");
        if (!nameEl || !urlEl || !tagEl || !memoEl)
            return;
        // カンマで区切って前後のスペースを取り、空文字を排除して配列にする（元のスマートなロジック！）
        const tagsArray = tagEl.value
            .split(",")
            .map(t => t.trim())
            .filter(t => t !== "");
        const creator = {
            name: nameEl.value,
            url: urlEl.value,
            tag: tagsArray,
            memo: memoEl.value
        };
        if (creator.name === "") {
            alert("名前を入力してね");
            return;
        }
        const localData = localStorage.getItem("creators");
        let creators = localData ? JSON.parse(localData) : [];
        creators.push(creator);
        localStorage.setItem("creators", JSON.stringify(creators));
        // フォームをクリア
        nameEl.value = "";
        urlEl.value = "";
        tagEl.value = "";
        memoEl.value = "";
        render();
        renderTags();
    });
}
// 一覧表示関数
function render() {
    if (!list || !searchBox)
        return;
    list.innerHTML = "";
    const localData = localStorage.getItem("creators");
    const creators = localData ? JSON.parse(localData) : [];
    const keyword = searchBox.value.toLowerCase();
    creators
        .filter((c) => {
        const name = c.name.toLowerCase();
        // 配列である tag を結合して文字列にしてから検索する
        const tags = Array.isArray(c.tag) ? c.tag.join(" ").toLowerCase() : "";
        return name.includes(keyword) || tags.includes(keyword);
    })
        .forEach((creator, index) => {
        const div = document.createElement("div");
        div.className = "card";
        const name = document.createElement("h3");
        name.textContent = creator.name;
        const tagWrap = document.createElement("div");
        if (Array.isArray(creator.tag)) {
            creator.tag.forEach((tag) => {
                const btn = document.createElement("button");
                btn.className = "tagButton";
                btn.textContent = tag;
                // タグクリックで検索
                btn.onclick = () => {
                    searchBox.value = tag;
                    render();
                };
                tagWrap.appendChild(btn);
            });
        }
        const memo = document.createElement("p");
        memo.className = "memo";
        memo.textContent = creator.memo || "メモなし";
        const openBtn = document.createElement("button");
        openBtn.textContent = "開く";
        openBtn.onclick = () => {
            window.open(creator.url, "_blank");
        };
        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.onclick = () => {
            const innerLocalData = localStorage.getItem("creators");
            let innerCreators = innerLocalData ? JSON.parse(innerLocalData) : [];
            innerCreators.splice(index, 1);
            localStorage.setItem("creators", JSON.stringify(innerCreators));
            render();
            renderTags();
        };
        div.appendChild(name);
        div.appendChild(tagWrap);
        div.appendChild(memo);
        div.appendChild(openBtn);
        div.appendChild(delBtn);
        list.appendChild(div);
    });
}
// タグ一覧自動生成関数
function renderTags() {
    if (!tagList)
        return;
    tagList.innerHTML = "";
    const localData = localStorage.getItem("creators");
    const creators = localData ? JSON.parse(localData) : [];
    let allTags = [];
    creators.forEach((c) => {
        if (Array.isArray(c.tag)) {
            allTags.push(...c.tag);
        }
    });
    const uniqueTags = [...new Set(allTags)];
    uniqueTags.forEach((tag) => {
        const btn = document.createElement("button");
        btn.className = "tagButton";
        btn.textContent = tag;
        // タグクリックで検索
        btn.onclick = () => {
            if (searchBox) {
                searchBox.value = tag;
                render();
            }
        };
        tagList.appendChild(btn);
    });
}
