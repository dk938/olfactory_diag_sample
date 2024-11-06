/**
 * Debug and Test Module for Quiz Application
 * デバッグモードの制御方法: DEBUG_ENABLED フラグで制御
 */

// 即時実行関数でスコープを分離
(function() {
    // デバッグモードの設定
    const DEBUG_ENABLED = false; // デフォルトはオフ
    let debugMode = DEBUG_ENABLED;
    let keySequence = '';
    const SECRET_CODE = '12345678';

    // キー入力を監視
    document.addEventListener('keydown', (e) => {
        keySequence += e.key;
        if (keySequence.length > SECRET_CODE.length) {
            keySequence = keySequence.slice(-SECRET_CODE.length);
        }

        if (keySequence === SECRET_CODE) {
            debugMode = !debugMode;
            keySequence = '';
            if (debugMode) {
                debugUI.show();
                debugUI.showTestUI();
            } else {
                debugUI.hide();
                debugUI.hideTestUI();
            }
        }
    });

    // スタイル定義
    const styles = `
        #debug-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            z-index: 9999;
            display: none;
        }

        #test-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: none;
            z-index: 10000;
        }

        #test-ui h3 {
            margin-top: 0;
        }

        #test-ui div {
            margin: 10px 0;
        }

        #test-ui button {
            margin: 5px;
            padding: 5px 10px;
        }

        .result-summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }

        .result-summary-table th,
        .result-summary-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        .result-summary-table th {
            background-color: #f5f5f5;
        }

        #test-status {
            margin-top: 20px;
            max-height: 400px;
            overflow-y: auto;
        }
    `;

    // UIコンポーネント
    const debugUI = {
        init() {
            // スタイルの追加
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);

            // デバッグパネルの作成
            const debugPanel = document.createElement('div');
            debugPanel.id = 'debug-panel';
            document.body.appendChild(debugPanel);

            // テストUIの作成
            const testUI = document.createElement('div');
            testUI.id = 'test-ui';
            testUI.innerHTML = `
                <h3>自動テスト設定</h3>
                <div>
                    <label>テスト間隔 (ms): <input type="number" id="test-interval" value="1000" min="100"></label>
                </div>
                <div>
                    <label>テストする言語:</label><br>
                    <input type="checkbox" id="test-ja" checked> 日本語
                    <input type="checkbox" id="test-en" checked> English
                    <input type="checkbox" id="test-fr" checked> French
                </div>
                <div>
                    <button onclick="window.debugTest.startTest()">テスト開始</button>
                    <button onclick="window.debugTest.stopTest()">テスト停止</button>
                </div>
                <div id="test-status"></div>
            `;
            document.body.appendChild(testUI);

            // デバッグモードが有効な場合は初期表示
            if (debugMode) {
                this.show();
                this.showTestUI();
            }
        },

        show() {
            document.getElementById('debug-panel').style.display = 'block';
        },

        hide() {
            document.getElementById('debug-panel').style.display = 'none';
        },

        update(info) {
            const testCase = window.debugTest.testCases[window.debugTest.currentTestCase] || {};
            const progress = ((window.debugTest.currentTestCase + 1) / window.debugTest.testCases.length * 100).toFixed(1);

            // デバッグパネルの内容を更新
            document.getElementById('debug-panel').innerHTML = `
                テスト進捗: ${isNaN(progress) ? '0.0' : progress}%<br>
                Test Case: ${window.debugTest.currentTestCase + 1}/${window.debugTest.testCases.length}<br>
                Language: ${testCase.language || '未設定'}<br>
                Answers: ${testCase.answers ? testCase.answers.join(',') : ''}
            `;
        },

        getTestProgress() {
            // テスト進捗を計算するロジックを実装
            const totalTestCases = window.debugTest.testCases.length;
            const currentTestCase = window.debugTest.currentTestCase;
            return totalTestCases > 0 ? ((currentTestCase / totalTestCases) * 100).toFixed(1) : 0;
        },

        showTestUI() {
            document.getElementById('test-ui').style.display = 'block';
        },

        hideTestUI() {
            document.getElementById('test-ui').style.display = 'none';
        },

        updateTestStatus(status) {
            // テスト結果サマリーのみを表示
            document.getElementById('test-status').innerHTML = status;
        }
    };

    // テスト実行モジュール
    const debugTest = {
        isRunning: false,
        testInterval: null,
        currentTestCase: 0,
        testCases: [],
        // 結果集計用のオブジェクト
        results: {
            ja: { balance: 0, active: 0, feminin: 0, harmony: 0 },
            en: { balance: 0, active: 0, feminin: 0, harmony: 0 },
            fr: { balance: 0, active: 0, feminin: 0, harmony: 0 }
        },

        resetResults() {
            this.results = {
                ja: { balance: 0, active: 0, feminin: 0, harmony: 0 },
                en: { balance: 0, active: 0, feminin: 0, harmony: 0 },
                fr: { balance: 0, active: 0, feminin: 0, harmony: 0 }
            };
        },

        generateTestCases() {
            const languages = [];
            if (document.getElementById('test-ja').checked) languages.push('ja');
            if (document.getElementById('test-en').checked) languages.push('en');
            if (document.getElementById('test-fr').checked) languages.push('fr');

            this.testCases = [];
            // 全ての可能な回答パターンを生成 (2^6 = 64 patterns)
            for (let i = 0; i < 64; i++) {
                for (const lang of languages) {
                    const answers = [];
                    for (let j = 0; j < 6; j++) {
                        answers.push((i & (1 << j)) ? 'B' : 'A');
                    }
                    this.testCases.push({ language: lang, answers });
                }
            }
        },

        async startTest() {
            this.resetResults(); // 結果をリセット
            this.generateTestCases();
            this.isRunning = true;
            this.currentTestCase = 0;
            debugUI.hideTestUI();

            const interval = parseInt(document.getElementById('test-interval').value) || 1000;
            this.runNextTestCase(interval);
        },

        // 現在のテストケースの結果を記録
        recordResult(language) {
            // 少し待ってから結果を取得（DOMの更新を待つため）
            setTimeout(() => {
                const finalTypeElement = document.getElementById('final-type');
                if (finalTypeElement) {
                    const finalType = finalTypeElement.innerText;

                    // 各言語での型名を考慮
                    const typeMap = {
                        ja: {
                            'バランス': 'balance',
                            'アクティブ': 'active',
                            'フェミニン': 'feminin',
                            'ハーモニー': 'harmony'
                        },
                        en: {
                            'Balance': 'balance',
                            'Active': 'active',
                            'Feminin': 'feminin',
                            'Harmony': 'harmony'
                        },
                        fr: {
                            'Équilibre': 'balance',
                            'Actif': 'active',
                            'Féminin': 'feminin',
                            'Harmonie': 'harmony'
                        }
                    };

                    // 現在の言語の型マッピングを取得
                    const currentTypeMap = typeMap[language];
                    let resultType = null;

                    // 型名を正規化
                    for (const [displayName, internalName] of Object.entries(currentTypeMap)) {
                        if (finalType.includes(displayName)) {
                            resultType = internalName;
                            break;
                        }
                    }

                    if (resultType && this.results[language]) {
                        this.results[language][resultType]++;
                        console.log(`Recorded result for ${language}: ${resultType}`);
                    }
                }
            }, 500); // 500ms待ってから結果を取得
        },

        // 結果表示の関数を修正
        generateResultSummary() {
            let summary = '<h3>テスト結果サマリー</h3>';
            summary += '<table class="result-summary-table">';
            summary += '<tr><th>言語</th><th>Balance</th><th>Active</th><th>Feminin</th><th>Harmony</th><th>合計</th></tr>';

            const languages = ['ja', 'en', 'fr'];
            const langNames = { ja: '日本語', en: 'English', fr: 'French' };

            // 結果が空かどうかをチェック
            let hasResults = false;
            languages.forEach(lang => {
                if (this.results[lang]) {
                    const total = Object.values(this.results[lang]).reduce((a, b) => a + b, 0);
                    if (total > 0) hasResults = true;
                }
            });

            if (!hasResults) {
                return '<h3>まだテスト結果がありません</h3>';
            }

            languages.forEach(lang => {
                if (this.results[lang]) {
                    const total = Object.values(this.results[lang]).reduce((a, b) => a + b, 0);
                    if (total > 0) {
                        const row = `<tr>
                            <td>${langNames[lang]}</td>
                            <td>${this.results[lang].balance} (${((this.results[lang].balance/total)*100).toFixed(1)}%)</td>
                            <td>${this.results[lang].active} (${((this.results[lang].active/total)*100).toFixed(1)}%)</td>
                            <td>${this.results[lang].feminin} (${((this.results[lang].feminin/total)*100).toFixed(1)}%)</td>
                            <td>${this.results[lang].harmony} (${((this.results[lang].harmony/total)*100).toFixed(1)}%)</td>
                            <td>${total}</td>
                        </tr>`;
                        summary += row;
                    }
                }
            });

            // 合計行を追加
            const totals = {
                balance: 0,
                active: 0,
                feminin: 0,
                harmony: 0
            };

            languages.forEach(lang => {
                if (this.results[lang]) {
                    totals.balance += this.results[lang].balance;
                    totals.active += this.results[lang].active;
                    totals.feminin += this.results[lang].feminin;
                    totals.harmony += this.results[lang].harmony;
                }
            });

            const grandTotal = totals.balance + totals.active + totals.feminin + totals.harmony;

            if (grandTotal > 0) {
                summary += `<tr style="font-weight: bold">
                    <td>全言語合計</td>
                    <td>${totals.balance} (${((totals.balance/grandTotal)*100).toFixed(1)}%)</td>
                    <td>${totals.active} (${((totals.active/grandTotal)*100).toFixed(1)}%)</td>
                    <td>${totals.feminin} (${((totals.feminin/grandTotal)*100).toFixed(1)}%)</td>
                    <td>${totals.harmony} (${((totals.harmony/grandTotal)*100).toFixed(1)}%)</td>
                    <td>${grandTotal}</td>
                </tr>`;
            }

            summary += '</table>';
            return summary;
        },

        // runNextTestCase 関数も修正
        async runNextTestCase(interval) {
            if (!this.isRunning || this.currentTestCase >= this.testCases.length) {
                if (this.currentTestCase >= this.testCases.length) {
                    debugUI.showTestUI();
                    const finalSummary = this.generateResultSummary();
                    debugUI.updateTestStatus(finalSummary);
                }
                this.stopTest();
                return;
            }

            const testCase = this.testCases[this.currentTestCase];

            // 言語変更
            window.changeLanguage(testCase.language);

            // クイズ開始
            window.startQuiz();

            // 回答を順番に選択
            for (let i = 0; i < testCase.answers.length; i++) {
                await new Promise(resolve => setTimeout(resolve, interval));
                window.selectOption(testCase.answers[i]);
            }

            // 結果を記録
            await new Promise(resolve => setTimeout(resolve, interval));
            this.recordResult(testCase.language);

            // デバッグ情報を更新
            debugUI.update();

            this.currentTestCase++;

            // 次のテストケースに進む
            this.testInterval = setTimeout(() => {
                window.restartQuiz();
                this.runNextTestCase(interval);
            }, interval * 3);
        },

        stopTest() {
            this.isRunning = false;
            if (this.testInterval) {
                clearTimeout(this.testInterval);
            }
            debugUI.showTestUI();
            const finalSummary = this.generateResultSummary();
            debugUI.updateTestStatus(finalSummary);
        }
    };

    // 既存の関数の拡張
    const originalShowQuestion = window.showQuestion;
    window.showQuestion = function(index) {
        originalShowQuestion(index);
        if (debugMode) {
            debugUI.update();
        }
    };

    const originalSelectOption = window.selectOption;
    window.selectOption = function(option) {
        originalSelectOption(option);
        if (debugMode) {
            debugUI.update();
        }
    };

    // デバッグテストモジュールをグローバルに公開
    window.debugTest = debugTest;

    // 初期化
    debugUI.init();
})();