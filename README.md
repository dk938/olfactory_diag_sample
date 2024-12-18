# プロジェクト概要

このプロジェクトは、ユーザーがアロマのパーソナルマッチングを行うためのクイズアプリケーションです。以下に、プロジェクト全体の機能と動作の概要を示します。

## 機能概要

1. **ユーザーインターフェース**:
   - アプリケーションは、開始画面、質問画面、結果画面の3つの主要な画面で構成されています。
   - ユーザーは言語を選択でき、英語、日本語、フランス語に対応しています。

2. **クイズの開始**:
   - ユーザーが「開始」ボタンをクリックすると、質問画面が表示され、最初の質問が表示されます。

3. **質問と回答**:
   - 各質問には2つの選択肢（AまたはB）があり、ユーザーは選択肢をクリックして回答します。
   - ユーザーは「次へ」ボタンをクリックして次の質問に進むことができます。

4. **結果の計算**:
   - ユーザーが全ての質問に回答すると、結果が計算され、ユーザーのタイプ（バランス、アクティブ、フ���ミニン、ハーモニー）が表示されます。
   - 結果に基づいて、関連するアロマの詳細情報が表示されます。

5. **デバッグ機能**:
   - デバッグモードがあり、特定のキーシーケンス（例: `12345678`）を入力することでデバッグ情報を表示できます。
   - デバッグ情報には、テストの進捗状況や結果のサマリーが含まれます。

6. **テスト機能**:
   - 自動テスト機能があり、ユーザーが選択した言語でテストを実行できます。
   - テストの結果は、各言語ごとに集計され、結果のサマリーが表示されます。

## 動作の流れ

1. **初期化**:
   - ページが読み込まれると、言語設定や質問の配列が初期化されます。

2. **クイズの開始**:
   - ユーザーが「開始」ボタンをクリックすると、質問画面が表示され、最初の質問が表示されます。

3. **質問の表示**:
   - `showQuestion`関数が呼び出され、現在の質問と選択肢が表示されます。

4. **回答の選択**:
   - ユーザーが選択肢をクリックすると、`selectOption`関数が呼び出され、選択された回答が記録されます。

5. **次の質問へ進む**:
   - ユーザーが「次へ」ボタンをクリ��クすると、`nextQuestion`関数が呼び出され、次の質問が表示されます。

6. **結果の表示**:
   - 全ての質問に回答した後、`showResult`関数が呼び出され、結果が計算されて表示されます。

7. **デバッグモードの切り替え**:
   - 特定のキーシーケンスを入力することで、デバッグモードをオン/オフできます。

このアプリケーションは、ユーザーが自分の性格や好みに基づいてアロマを選ぶ手助けをすることを目的としています。デバッグ機能やテスト機能により、開発者はアプリケーションの動作を確認しやすくなっています。