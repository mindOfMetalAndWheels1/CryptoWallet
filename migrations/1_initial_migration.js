const Migrations = artifacts.require("Migrations");
const PlutonTokenMock = artifacts.require("PlutonTokenMock");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(PlutonTokenMock);
  const tokenMock = await PlutonTokenMock.deployed()
  //Mint 1000 Pluton Tokens for the deployer
  await tokenMock.mint(
    '0x10cBb0619306346EFA7669C882f38dF3a5024907',
    '1000000000000000000000'
  )
};
