// 質問の現在のインデックスを格納する変数
let currentQuestion = 0;

// 質問に対するユーザーの回答を格納する配列
let selectedAnswers = [];

// クイズを開始する関数
function startQuiz() {
    // 最初の画面を非表示にし、質問画面を表示
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'flex'; // display: flexに設定
    showQuestion(0);
}

// 質問を表示する関数
function showQuestion(index) {
    const questions = [
        "旅行の計画を立てるとき、あなたはどちらを選びますか？",
        "女子会で、話題が自分の得意分野であるとき、あなたはどちらの態度を取りますか？",
        "チームでのディスカッションで、あなたはどちらの意見を支持しますか？",
        "重要な決断をする際に、どちらを優先しますか？",
        "知人や友人が問題を抱えていることに、すぐに気づけるタイプですか？",
        "友人や同僚と意見が食い違ったとき、あなたはどちらの姿勢を取りますか？"
    ];

    const optionsA = [
        "行ったことのない場所や新しい冒険を求める。",
        "積極的にその話題について話し、友達と意見を交わす。",
        "新しい視点を取り入れて、これまでにない解決策を提案する意見。",
        "知人や友人に相談して頼る。",
        "他人の意見や感情に気を遣っているので、比較的早く気づけると思う。",
        "対立を避け、自分の意見を抑える。"
    ];

    const optionsB = [
        "過去に訪れたことがあり、安心できる場所を選ぶ。",
        "まずは友達の意見を聞いてから、自分の考えを慎重にまとめる。",
        "これまでの実績に基づいて、リスクを避ける従来の方法を支持する意見。",
        "自分の経験や直感を優先する。",
        "自分の仕事に集中しているので、気づかないことが多いかもしれない。",
        "自分の意見を変えない。"
    ];

    document.getElementById('question-text').innerText = questions[index];
    document.getElementById('option-a').querySelector('.option-text').innerText = optionsA[index];
    document.getElementById('option-b').querySelector('.option-text').innerText = optionsB[index];

    // プログレスバーの更新
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progress-bar-inner').style.width = progress + '%';

    // 前の質問に戻るボタンの有効/無効設定
    document.getElementById('prev-button').style.display = index === 0 ? 'none' : 'inline-block';
    document.getElementById('next-button').style.display = 'inline-block'; // 次へボタンを表示

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
    document.getElementById('result-screen').style.display = 'flex'; // display: flexに設定
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
}

// クイズを再スタートする関数
function restartQuiz() {
    selectedAnswers = [];
    currentQuestion = 0;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex'; // display: flexに設定
}