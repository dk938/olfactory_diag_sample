window.addEventListener('load', function() {
    const questions = [
        "旅行の計画を立てるとき、あなたはどちらを選びますか？|A: 行ったことのない場所や新しい冒険を求める。|B: 過去に訪れたことがあり、安心できる場所を選ぶ。",
        "女子会で、話題が自分の得意分野であるとき、あなたはどちらの態度を取りますか？|A: 積極的にその話題について話し、友達と意見を交わす。|B: まずは友達の意見を聞いてから、自分の考えを慎重にまとめる。",
        "チームでのディスカッションで、あなたはどちらの意見を支持しますか？|A: 新しい視点を取り入れて、これまでにない解決策を提案する意見。|B: これまでの実績に基づいて、リスクを避ける従来の方法を支持する意見。",
        "重要な決断をする際に、どちらを優先しますか？|A: 知人や友人に相談して頼る。|B: 自分の経験や直感を優先する。",
        "知人や友人が問題を抱えていることに、すぐに気づけるタイプですか？|A: 他人の意見や感情に気を遣っているので、比較的早く気づけると思う。|B: 自分の仕事に集中しているので、気づかないことが多いかもしれない。",
        "友人や同僚と意見が食い違ったとき、あなたはどちらの姿勢を取りますか？|A: 対立を避け、自分の意見を抑える。|B: 自分の意見を変えない。"
    ];

    let currentQuestionIndex = 0;
    let answers = [];

    window.startQuiz = function() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('question-screen').style.display = 'block';
        showQuestion();
    };

    function showQuestion() {
        const questionParts = questions[currentQuestionIndex].split('|');
        document.getElementById('question-number').innerText = `質問 ${currentQuestionIndex + 1} / ${questions.length}`;
        document.getElementById('question-text').innerText = questionParts[0]; // 質問の主文を表示
        document.getElementById('option-a').innerText = questionParts[1].slice(3); // Aのオプションテキストを表示
        document.getElementById('option-b').innerText = questionParts[2].slice(3); // Bのオプションテキストを表示

        const checkedOption = document.querySelector('input[name="answer"]:checked');
        if (checkedOption) {
            checkedOption.checked = false; // すでに選択されているラジオボタンをリセット
        }
        if (answers[currentQuestionIndex]) {
            document.querySelector(`input[name="answer"][value="${answers[currentQuestionIndex]}"]`).checked = true;
        }

        document.getElementById('next-button').disabled = true; // 次の質問ボタンを初期状態で無効に
    }

    window.previousQuestion = function() {
        selectAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    };

    window.nextQuestion = function() {
        selectAnswer();
        if (answers[currentQuestionIndex]) {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        } else {
            alert("質問に回答してください。");
        }
    };

    function selectAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            answers[currentQuestionIndex] = selectedOption.value;
        }
    }

    function showResults() {
        document.getElementById('question-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = "";

        // 判定ロジックの実装
        let upDownCountA = 0; // 質問1, 2, 3のAの数
        let leftRightCountA = 0; // 質問4, 5, 6のAの数

        // 質問1, 2, 3の集計
        for (let i = 0; i < 3; i++) {
            if (answers[i] === 'A') {
                upDownCountA++;
            }
        }

        // 質問4, 5, 6の集計
        for (let i = 3; i < 6; i++) {
            if (answers[i] === 'A') {
                leftRightCountA++;
            }
        }

        // 上下の判定
        const upDownType = upDownCountA > 1 ? '下タイプ' : '上タイプ';

        // 左右の判定
        const leftRightType = leftRightCountA > 1 ? '左タイプ' : '右タイプ';

        // 最終的なタイプの判定
        const finalType = leftRightType + upDownType;

        // 結果の表示
        resultContent.innerHTML += `<p>あなたのタイプは: ${finalType}</p>`;

        // 4象限マトリクスの描画
        drawResultMatrix(leftRightType, upDownType);

        // 判定根拠の表示
        resultContent.innerHTML += `<p>判定根拠:</p>`;
        resultContent.innerHTML += `<p>質問1, 2, 3で「A」が多いと「下タイプ」になり、Bが多いもしくは同数なら「上タイプ」になります。</p>`;
        resultContent.innerHTML += `<p>質問4, 5, 6で「A」が多いと「左タイプ」になり、Bが多いもしくは同数なら「右タイプ」になります。</p>`;
        resultContent.innerHTML += `<p>したがって、あなたのタイプは「${finalType}」です。</p>`;

        // 質問と回答の一覧表示
        questions.forEach((question, index) => {
            resultContent.innerHTML += `<p>質問 ${index + 1}: ${question.split('|')[0]}</p>`;
            resultContent.innerHTML += `<p>回答: ${answers[index]}</p>`;
        });
    }

    function drawResultMatrix(leftRightType, upDownType) {
        const canvas = document.getElementById('result-matrix');
        const ctx = canvas.getContext('2d');

        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // マトリクスの線を描画
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // タイトルを配置
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('左上', canvas.width / 4, canvas.height / 4);
        ctx.fillText('右上', (canvas.width * 3) / 4, canvas.height / 4);
        ctx.fillText('左下', canvas.width / 4, (canvas.height * 3) / 4);
        ctx.fillText('右下', (canvas.width * 3) / 4, (canvas.height * 3) / 4);

        // ユーザーの位置を表示
        let x = leftRightType === '左タイプ' ? canvas.width / 4 : (canvas.width * 3) / 4;
        let y = upDownType === '上タイプ' ? canvas.height / 4 : (canvas.height * 3) / 4;
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }

    window.restartQuiz = function() {
        currentQuestionIndex = 0;
        answers = [];
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
    };

    window.enableNextButton = function() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        document.getElementById('next-button').disabled = !selectedOption; // ラジオボタンが選択されていれば有効、そうでなければ無効
    };
});