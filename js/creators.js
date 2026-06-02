
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const searchBox = document.getElementById("searchBox");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const tagList = document.getElementById("tagList");

// 初期表示
render();
renderTags();

// 検索クリア

clearSearchBtn.addEventListener("click", () => {
    searchBox.value = "";
    render();
});

// 追加ボタン
addBtn.addEventListener("click", () => {
    const creator = {
        name: document.getElementById("name").value,
        url: document.getElementById("url").value,
        tag: document.getElementById("tag").value
            .split(",")
            .map(t => t.trim())
            .filter(t => t !== ""),
        memo: document.getElementById("memo").value
    };

    if (creator.name === "") {
        alert("名前を入力してね");
        return;
    }

    let creators = JSON.parse(localStorage.getItem("creators")) || [];
    creators.push(creator);
    localStorage.setItem("creators", JSON.stringify(creators));

    render();
    renderTags();
});

//一覧表示
function render() {
    list.innerHTML = "";

    const creators = JSON.parse(localStorage.getItem("creators")) || [];
    const keyword = searchBox.value.toLowerCase();

    creators
        .filter(c => {
            const name = c.name.toLowerCase();
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
                creator.tag.forEach(tag => {
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
                let creators = JSON.parse(localStorage.getItem("creators")) || [];
                creators.splice(index, 1);
                localStorage.setItem("creators", JSON.stringify(creators));
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

// タグ一覧自動生成
function renderTags() {
    if (!tagList) return;

    tagList.innerHTML = "";

    const creators = JSON.parse(localStorage.getItem("creators")) || [];
    let allTags = [];

    creators.forEach(c => {
        if (Array.isArray(c.tag)) {
            allTags.push(...c.tag);
        }
    });

    const uniqueTags = [...new Set(allTags)];

    uniqueTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tagButton";
        btn.textContent = tag;

        // タグクリックで検索
        btn.onclick = () => {
            searchBox.value = tag;
            render();
        };

        tagList.appendChild(btn);
    });
}