// 質問の現在のインデックスを格納する変数
let currentQuestion = 0;

// 質問に対するユーザーの回答を格納する配列
let selectedAnswers = [];

// クイズを開始する関数
function startQuiz() {
    // 最初の画面を非表示にし、質問画面を表示
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'flex';
    showQuestion(0);
}

// 質問を表示する関数
function showQuestion(index) {
    document.getElementById('question-text').innerText = translations.questions[index];
    document.getElementById('option-a').querySelector('.option-text').innerText = translations.optionsA[index];
    document.getElementById('option-b').querySelector('.option-text').innerText = translations.optionsB[index];

    // プログレスバーの更新
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progress-bar-inner').style.width = progress + '%';

    // プログレスインジケーターの表示
    document.getElementById('progress-indicator').innerText = `${index + 1} / ${questions.length}`;

    // 前の質問に戻るボタンの有効/無効設定
    document.getElementById('prev-button').style.display = 'inline-block';
    document.getElementById('next-button').style.display = 'inline-block';
    document.getElementById('next-button').disabled = !selectedAnswers[index]; // 次へボタンの有効/無効

    // 選択肢の選択状態を初期化
    document.querySelectorAll('.option-box').forEach(function (element) {
        element.classList.remove('selected');
    });

    if (selectedAnswers[index]) {
        const selectedOption = document.getElementById('option-' + selectedAnswers[index].toLowerCase());
        if (selectedOption) selectedOption.classList.add('selected');
    }
}

// ユーザーが選択肢を選んだときの処理
function selectOption(option) {
    selectedAnswers[currentQuestion] = option;

    document.querySelectorAll('.option-box').forEach(function (element) {
        element.classList.remove('selected');
    });

    document.getElementById('option-' + option.toLowerCase()).classList.add('selected');

    setTimeout(() => {
        nextQuestion(); // 0.5秒後に次の問題に遷移
    }, 500);
}

// 前の質問に戻る関数
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    } else {
        restartQuiz();
    }
}

// 次の質問に進む関数
function nextQuestion() {
    if (currentQuestion < 5) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showResult();
    }
}

// 結果を表示する関数
function showResult() {
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    calculateResult();
}

// 結果を計算する関数
function calculateResult() {
    let upperCount = 0;
    let leftCount = 0;

    // 質問1,2,3の判定 (上/下タイプ)
    if (selectedAnswers[0] === 'A') upperCount++;
    if (selectedAnswers[1] === 'A') upperCount++;
    if (selectedAnswers[2] === 'A') upperCount++;

    // 質問4,5,6の判定 (左/右タイプ)
    if (selectedAnswers[3] === 'A') leftCount++;
    if (selectedAnswers[4] === 'A') leftCount++;
    if (selectedAnswers[5] === 'A') leftCount++;

    const upperType = upperCount >= 2 ? "upper" : "lower";
    const leftType = leftCount >= 2 ? "left" : "right";

    // combinationTypeを算出し、finalTypeにマッピング
    const combinationType = `${leftType}-${upperType}`;
    const typeMapping = {
        "left-upper": "balance",
        "left-lower": "feminin",
        "right-upper": "active",
        "right-lower": "harmony"
    };
    const finalTypeKey = typeMapping[combinationType]; // 変更点

    // finalTypeを翻訳して表示
    const finalType = translations[finalTypeKey]; // 変更点

    // 詳細リンクを設定
    const detailLinkText = document.getElementById('detail-link-text');
    detailLinkText.innerHTML = `<a href="${getLink(finalTypeKey)}" target="_blank">${translations.detailLink}</a>`; // 変更点

    // 結果を画面に表示
    document.getElementById('final-type').innerText = finalType;

    // 回答結果を表に表示
    const answersRow = document.getElementById('answers-row');
    answersRow.innerHTML = `<td id="answer">${translations.answer}</td>` +
        selectedAnswers.map((answer, index) => `<td>${answer}</td>`).join('');
}

// finalTypeKeyに基づいてリンクを取得する関数
function getLink(finalTypeKey) {
    const links = {
        "balance": "https://kusaba-aroma.my.canva.site/dagrbkbj8i8",
        "active": "https://kusaba-aroma.my.canva.site/dagrbmx3dws",
        "feminin": "https://kusaba-aroma.my.canva.site/dagrbqzzdok",
        "harmony": "https://kusaba-aroma.my.canva.site/dagrbkm8eew"
    };
    return links[finalTypeKey] || "#"; // デフォルトは#に設定
}

// クイズを再スタートする関数
function restartQuiz() {
    selectedAnswers = [];
    currentQuestion = 0;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('question-screen').style.display = 'none';
}

// 言語設定
let language = 'en'; // デフォルトを英語に設定
let translations; // 初期値を設定しない

// 質問の配列を定義
let questions = []; // 初期値を空の配列に設定

// ページが読み込まれたときに初期化
window.onload = function() {
    translations = translationsEn; // リソースファイルの読み込み後に設定
    questions = translations.questions; // 質問をリソースから取得
    updateText();

    // 言語選択の初期値を設定
    document.getElementById('language-select').value = 'en';

    // DOM要素が存在するか確認してから質問を表示
    if (document.getElementById('question-screen')) {
        showQuestion(currentQuestion); // 初期の質問を表示
    }
};

// テキストを更新する関数
function updateText() {
    // 更新するテキストを設定
    document.getElementById('intro-text-bold').innerText = translations.introBold;
    document.getElementById('intro-text-small').innerText = translations.introSmall;
    document.getElementById('start-button').innerText = translations.start;
    document.getElementById('prev-button').innerText = translations.prev;
    document.getElementById('next-button').innerText = translations.next;
    document.getElementById('restart').innerText = translations.restart;
    document.getElementById('result-title').innerText = translations.resultTitle;
    document.getElementById('result-type').innerText = translations.resultType;

    // 質問と選択肢の更新
    const questions = translations.questions;
    const optionsA = translations.optionsA;
    const optionsB = translations.optionsB;

    document.querySelectorAll('.question-content p').forEach((element, index) => {
        if (index < questions.length) {
            element.innerText = questions[index];
        }
    });

    document.querySelectorAll('.option-box .option-text').forEach((element, index) => {
        if (index < optionsA.length) {
            element.innerText = optionsA[index];
        }
    });

    document.querySelectorAll('.option-box .option-text').forEach((element, index) => {
        if (index < optionsB.length) {
            element.innerText = optionsB[index];
        }
    });

    // タブのテキストを更新
    const tabTitles = [
        'balance-title', 'active-title', 'feminin-title', 'harmony-title'
    ];
    tabTitles.forEach(title => {
        document.getElementById(title).innerText = translations[title];
    });

    // 各タブの説明を更新
    const tabDescriptions = [
        'balance-description', 'active-description', 'feminin-description', 'harmony-description'
    ];
    tabDescriptions.forEach(description => {
        document.getElementById(description).innerText = translations[description];
    });

    // 各タブのトレンド、フレーバー、その他のフレーバーを更新
    const tabTrends = [
        'balance-trends', 'active-trends', 'feminin-trends', 'harmony-trends'
    ];
    tabTrends.forEach(trend => {
        document.getElementById(trend).innerText = translations[trend];
    });

    const tabFlavors = [
        'balance-flavor', 'active-flavor', 'feminin-flavor', 'harmony-flavor'
    ];
    tabFlavors.forEach(flavor => {
        document.getElementById(flavor).innerText = translations[flavor];
    });

    const tabFlavorDescriptions = [
        'balance-flavor-description', 'active-flavor-description', 'feminin-flavor-description', 'harmony-flavor-description'
    ];
    tabFlavorDescriptions.forEach(flavorDescription => {
        document.getElementById(flavorDescription).innerText = translations[flavorDescription];
    });

    const tabOtherFlavors = [
        'balance-other-flavours', 'active-other-flavours', 'feminin-other-flavours', 'harmony-other-flavours'
    ];
    tabOtherFlavors.forEach(otherFlavor => {
        document.getElementById(otherFlavor).innerText = translations[otherFlavor];
    });
}

// 言語を変更する関数
function changeLanguage(newLanguage) {
    language = newLanguage;
    switch (language) {
        case 'ja':
            translations = translationsJa;
            break;
        case 'fr':
            translations = translationsFr;
            break;
        case 'en':
            translations = translationsEn;
            break;
    }
    updateText(); // テキストを更新
    showQuestion(currentQuestion); // 質問を表示
}

// タブを表示する関数
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
        updateText(); // タブが表示されたときにテキストを更新
    }

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 結果を計算する関数
function calculateResult() {
    let upperCount = 0;
    let leftCount = 0;

    if (selectedAnswers[0] === 'A') upperCount++;
    if (selectedAnswers[1] === 'A') upperCount++;
    if (selectedAnswers[2] === 'A') upperCount++;

    if (selectedAnswers[3] === 'A') leftCount++;
    if (selectedAnswers[4] === 'A') leftCount++;
    if (selectedAnswers[5] === 'A') leftCount++;

    const upperType = upperCount >= 2 ? "upper" : "lower";
    const leftType = leftCount >= 2 ? "left" : "right";

    const combinationType = `${leftType}-${upperType}`;
    const typeMapping = {
        "left-upper": "balance",
        "left-lower": "feminin",
        "right-upper": "active",
        "right-lower": "harmony"
    };
    const finalTypeKey = typeMapping[combinationType];

    const finalType = translations[finalTypeKey];

    const detailLinkText = document.getElementById('detail-link-text');
    detailLinkText.innerHTML = `<a href="${getLink(finalTypeKey)}" target="_blank" rel="noopener noreferrer">${translations.detailLink}</a>`;

    document.getElementById('final-type').innerText = finalType;

    // 初期表示のタブを設定
    showTab(finalTypeKey);
}