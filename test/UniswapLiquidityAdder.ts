//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";


const NAME = "MyToken";
const SYMBOL = "GRF";
const SYMBOL2 = "GRD";

const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

describe("UniswapLiquidityAdder", function () {
  let MyToken;
  let tokenA: Contract;
  let tokenB: Contract;
  //let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, users: SignerWithAddress[];
  let contract: any;

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory('MyToken');

    tokenA = await MyToken.deploy(NAME, SYMBOL);
    await tokenA.deployed();

    tokenB = await MyToken.deploy(NAME, SYMBOL2);
    await tokenB.deployed();

    const UniswapLiquidityAdder = await ethers.getContractFactory('UniswapLiquidityAdder');
    contract = await UniswapLiquidityAdder.deploy(routerAddress, factoryAddress, tokenA.address, tokenB.address);
    await contract.deployed();


  });

  it('addLiquidity', async function () {
    const amountA = ethers.utils.parse  Ether('0.1');
    const amountB = ethers.utils.parseEther('0.2');

    await tokenA.approve(contract.address, amountA);
    await tokenB.approve(contract.address, amountB);

   
    const addLiquidityResult = await contract.addLiquidity(amountA, amountB);
    await addLiquidityResult.wait();

    let uniFactory    = await ethers.getContractAt('IUniswapV2Factory', factoryAddress);

    const pool = await uniFactory.getPair(tokenA.address, tokenB.address);

    expect(pool).not.to.be.null;

  });
});