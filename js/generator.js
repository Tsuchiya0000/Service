const themes =
[
    "冒険",
    "学園",
    "未来都市",
    "魔法",
    "探偵"
];

const button =
    document.getElementById("generateBtn");

const result =
    document.getElementById("topicBox");

button.addEventListener("click", () =>
{
    const index =
        Math.floor(
            Math.random() * themes.length
        );

    result.textContent =
        themes[index];
});