// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

// contractは1つのconstructorしか持てない
// constructorは、スマートコントラクトの作成時に一度だけ実行され、contractの状態を初期化するために使用される
// constructorが実行された後、コードがブロックチェーンにデプロイされる
contract WavePortal {

    uint256 totalWaves; // 状態変数

    /* 乱数生成のための基盤となるシード（種）を作成 */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    /* 
     * 構造体の配列を格納するための変数wavesを宣言。
     * ユーザーが送ってきたすべての「👋（wave）」を保持が可能
     */
    Wave[] waves;

    // アドレスと数値を関連付ける
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        // 初期シード
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /*
     * _messageという文字列を要求するようにwave関数を更新。
     * _messageは、ユーザーがフロントエンドから送信するメッセージです。
     */
    function wave(string memory _message) public {
        // 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。
        require(
            lastWavedAt[msg.sender] + 30 minutes < block.timestamp,
            "Wait 30m"
        );
        // ユーザーの現在のタイムスタンプを更新する
        lastWavedAt[msg.sender] = block.timestamp;
        
        totalWaves += 1;
        // ｢👋(wave)｣を送ったユーザーのアドレスがターミナル上に表示される
        console.log("%s has waved!", msg.sender);  // msg.sender = 関数を呼び出した人のアドレス
        // 「👋（wave）」とメッセージを配列に格納。
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // ユーザーのための乱数を生成
        seed = (block.timestamp + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        /* ユーザーがETHを獲得する確率を50％に設定 */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            // 「👋（wave）」を送ってくれたユーザーに0.0001ETHを送る
            uint256 prizeAmount = 0.0001 ether;
            // ユーザーに送るETHの額が、コントラクトが持つ残高より下回っていることを確認
            require(
                // address(this).balanceはコントラクトが持つの資金の残高を示す
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money they the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        else {
            console.log("%s did not win.", msg.sender);
        }

        // コントラクト側でemitされたイベントに関する通知をフロントエンドで取得できるようにする。
        emit NewWave(msg.sender, block.timestamp, _message);        
    }

    /*
     * 構造体配列のwavesを返してくれるgetAllWavesという関数を追加。
     * これで、WEBアプリからwavesを取得することができる。
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}

/* view =
 * 読み取り専用の関数であり、呼び出した後に関数の中で定義された状態変数が変更されないようにする
 *
 * pure =
 * 関数の中で定義された状態変数を読み込んだり変更したりせず、関数に渡されたパラメータや関数に存在するローカル変数のみを使用して値を返す
*/