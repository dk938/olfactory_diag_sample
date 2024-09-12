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
    const questions = [
        "1年の休日の過ごし方で多いのはどちらですか？",
        "リスクを伴う決断をする必要があるとき、どのように対応しますか？",
        "チームでのディスカッションで、あなたはどちらの意見を支持しますか？",
        "重要な決断をする際に、どちらを優先しますか？",
        "知人や友人が問題を抱えていることに、すぐに気づけるタイプですか？",
        "友人や同僚と意見が食い違ったとき、あなたはどちらの姿勢を取りますか？"
    ];

    const optionsA = [
        "なるべく外出、できれば旅行の計画を立てる。",
        "可能性に焦点を当て、前向きに考える",
        "リスクがあっても、これまでにない解決策を提案する意見を支持する。",
        "すぐに知人や友人に相談して、判断を委ねる。",
        "他人の意見や感情に気を遣っているので、比較的早く気づけると思う。",
        "対立を避け、自分の意見を抑える。"
    ];

    const optionsB = [
        "家で読書や映画鑑賞などゆっくりと過ごす。",
        "リスクを最小限に抑えることに焦点を当てる",
        "解決策であっても、リスクがあるなら従来の方法を支持する意見を支持する。",
        "あまり周りに相談せず、自分で考えて決断する。",
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
    answersRow.innerHTML = '<td>回答</td>' + selectedAnswers.map(answer => `<td>${answer}</td>`).join('');
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