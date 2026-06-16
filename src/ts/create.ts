// create.ts

// TypeScriptのモジュールシステムを使用するために、空のエクスポートを追加
export {};

// パレットデータの構造（型）を定義する
interface Palette {
  name: string;
  colors: string[];
}

// 編集モードのチェック
const editIndexStr = localStorage.getItem("editPalette");
// null と "null" の両方に対応するための安全なパース処理
const editIndex =
  editIndexStr !== null && editIndexStr !== "null"
    ? parseInt(editIndexStr, 10)
    : null;

// HTML要素を取得する（適切な型を指定）
const saveBtn = document.getElementById(
  "localSaveBtn",
) as HTMLButtonElement | null;
const exportBtn = document.getElementById(
  "exportBtn",
) as HTMLButtonElement | null;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement | null;

// 編集モードの場合は既存のパレットを読み込んでフォームにセット
if (editIndex !== null) {
  const localData = localStorage.getItem("palettes");
  const palettes: Palette[] = localData ? JSON.parse(localData) : [];
  const palette = palettes[editIndex];

  // パレットが存在する場合はフォームに値をセット
  if (palette) {
    const nameInput = document.getElementById(
      "paletteName",
    ) as HTMLInputElement | null;
    if (nameInput) {
      nameInput.value = palette.name;
    }

    // 4色分を安全にセット
    for (let i = 0; i < 4; i++) {
      const colorInput = document.getElementById(
        `color${i + 1}`,
      ) as HTMLInputElement | null;

      // ?? "" を後ろに足して、undefined 対策をする
      if (colorInput && palette.colors[i]) {
        colorInput.value = palette.colors[i] ?? "";
      }
    }
  }
}

// パレット取得関数（返り値が Palette 型であることを明示）
function getPalette(): Palette | null {
  const nameInput = document.getElementById(
    "paletteName",
  ) as HTMLInputElement | null;
  const c1 = document.getElementById("color1") as HTMLInputElement | null;
  const c2 = document.getElementById("color2") as HTMLInputElement | null;
  const c3 = document.getElementById("color3") as HTMLInputElement | null;
  const c4 = document.getElementById("color4") as HTMLInputElement | null;

  // もし要素が1つでも取得できなければnullを返す（安全対策）
  if (!nameInput || !c1 || !c2 || !c3 || !c4) return null;

  return {
    name: nameInput.value,
    colors: [c1.value, c2.value, c3.value, c4.value],
  };
}

// アプリに保存
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const palette = getPalette();
    if (!palette) return; // 安全対策

    // パレット名が空の場合は保存しない
    if (palette.name === "") {
      alert("パレット名を入力してください");
      return;
    }

    // 既存のパレットを取得
    const localData = localStorage.getItem("palettes");
    let palettes: Palette[] = localData ? JSON.parse(localData) : [];

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
    localStorage.setItem("palettes", JSON.stringify(palettes));
    alert("保存しました");

    // ホームに戻る
    location.href = "Home.html";
  });
}

// JSON保存
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const palette = getPalette();
    if (!palette) return; // 安全対策

    // パレット名が空の場合は保存しない
    if (palette.name === "") {
      alert("パレット名を入力してください");
      return;
    }

    const json = JSON.stringify(palette, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    // ダウンロード
    a.href = url;
    a.download = `${palette.name}.json`;
    a.click();

    // URLを解放
    URL.revokeObjectURL(url);

    alert("JSONを保存しました");
  });
}

// 戻るボタン
if (backBtn) {
  backBtn.addEventListener("click", () => {
    // 編集モードの場合は保存前に削除
    localStorage.removeItem("editPalette");

    // ホームに戻る
    location.href = "Home.html";
  });
}
