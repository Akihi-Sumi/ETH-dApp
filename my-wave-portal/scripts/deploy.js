// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const main = async () => {
  const [deplyer] = await hre.ethers.getSigners()
  const accountBalance = await deplyer.getBalance()

  console.log("Deploying contracts with account: ", deplyer.address)
  console.log("Account balance: ", accountBalance.toString())

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")
  /* コントラクトに資金を提供できるようにする */
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.0001"),
  })

  await waveContract.deployed()

  console.log("WavePortal address: ", waveContract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()