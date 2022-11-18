// asyncとawait = awaitが先頭についている処理が終わるまで、他の処理を行わない(非同期処理)
const main = async () => {
    // WavePortalコントラクトをコンパイル -> コントラクトを扱うために必要なファイルがartifactsディレクトリの直下に生成
    // getContractFactory関数は、デプロイをサポートするライブラリのアドレスとWavePortalコントラクトの連携を行う
    // hre.ethersは、Hardhat プラグインの仕様
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")

    // コントラクトを実行するたびに、ブロックチェーンを新しくする
    // 0.01ETHをコントラクトに提供してデプロイする
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.01"),
    })
    await waveContract.deployed()
    console.log("Contract deployed to: ", waveContract.address)

    // デプロイ後、WavePortalコントラクトをデプロイした人のアドレス(＝ owner.address)をターミナルに出力
    // console.log("Contract deployed by:", waveContract.address)

    // let waveCount
    // // WavePortal.solに記載されたgetTotalWaves()を呼び出し、既存の｢👋(wave)｣の総数を取得
    // waveCount = await waveContract.getTotalWaves()
    // console.log(waveCount.toNumber())

    /* コントラクトの残高を取得し、結果を出力（0.01ETHであることを確認） */
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    )
    console.log(
        "Contract balance: ",
        hre.ethers.utils.formatEther(contractBalance)
    )

    // Waveし、トランザクションが完了するまで待機
    const waveTxn = await waveContract.wave("This is wave #1")
    await waveTxn.wait()
    // 2回目
    const waveTxn2 = await waveContract.wave("This is wave #2")
    await waveTxn2.wait();

    // const [_, randomPerson] = await hre.ethers.getSigners()

    // waveTxn = await waveContract.connect(randomPerson).wave("Another message!")
    // await waveTxn.wait()

    /* Waveした後のコントラクトの残高を取得し、結果を出力（0.0001ETH引かれていることを確認） */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log(
        "Contract balance: ",
        hre.ethers.utils.formatEther(contractBalance)
    )

    let allWaves = await waveContract.getAllWaves()
    console.log(allWaves)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()


// Hardhat Runtime Environment について
/// hardhatで始まるコマンドを実行するたびに、HREにアクセスしているので、hreをrun.jsにインポートする必要はない