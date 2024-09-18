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

    document.getElementById('next-button').disabled = false;
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

    const upperType = upperCount >= 2 ? "上タイプ" : "下タイプ";
    const leftType = leftCount >= 2 ? "左タイプ" : "右タイプ";

    const finalType = `${leftType}${upperType}`;

    // 結果を画面に表示
    document.getElementById('final-type').innerText = finalType;


    // 4象限のマトリックスをハイライト
    highlightResultMatrix(upperType, leftType);

    // 回答結果を表に表示
    const answersRow = document.getElementById('answers-row');
    answersRow.innerHTML = `<td id="answer">${translations.answer}</td>` +
        selectedAnswers.map((answer, index) => `<td>${answer}</td>`).join('');
}

// マトリックスをハイライトする関数
function highlightResultMatrix(upperType, leftType) {
    const canvas = document.getElementById('result-matrix');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // グリッドを描画
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 75, 75);
    ctx.strokeRect(75, 0, 75, 75);
    ctx.strokeRect(0, 75, 75, 75);
    ctx.strokeRect(75, 75, 75, 75);

    // 結果をハイライト
    ctx.fillStyle = 'rgba(255, 235, 59, 0.5)';
    if (leftType === '左タイプ' && upperType === '上タイプ') ctx.fillRect(0, 0, 75, 75);
    if (leftType === '右タイプ' && upperType === '上タイプ') ctx.fillRect(75, 0, 75, 75);
    if (leftType === '左タイプ' && upperType === '下タイプ') ctx.fillRect(0, 75, 75, 75);
    if (leftType === '右タイプ' && upperType === '下タイプ') ctx.fillRect(75, 75, 75, 75);
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
    const introBold = document.getElementById('intro-text-bold');
    const introSmall = document.getElementById('intro-text-small');
    const startButton = document.getElementById('start-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const resultTitle = document.getElementById('result-title');
    const resultType = document.getElementById('result-type');
    const question = document.getElementById('question');
    const answer = document.getElementById('answer');
    const restart = document.getElementById('restart');

    if (introBold) introBold.innerText = translations.introBold; //あなたの体質にあった…
    if (introSmall) introSmall.innerText = translations.introSmall; //Produced by Ad-Naturam × 嗅覚反応分析
    if (startButton) startButton.innerText = translations.start; // スタートボタン
    if (prevButton) prevButton.innerText = translations.prev; // 戻るボタン
    if (nextButton) nextButton.innerText = translations.next; // 次へボタン
    if (resultTitle) resultTitle.innerText = translations.resultTitle; // 診断結果
    if (resultType) resultType.innerText = translations.resultType; // あなたのタイプは:
    if (question) question.innerText = translations.question; // 質問
    if (answer) answer.innerText = translations.answer; // 回答
    if (restart) restart.innerText = translations.restart; // 再スタート
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