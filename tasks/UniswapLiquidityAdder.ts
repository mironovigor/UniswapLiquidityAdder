import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

const token1Address = ''
const token2Address = ''
const uniswapLiquidityAdderAddress = '';


task('addLiquidity', 'addLiquidity for myToken pair')
    .addParam('token1Amount', 'Token1 amount')
    .addParam('token2Amount', 'Token2 amount')
	.setAction(async ({ token, spender, value}, { ethers }) => {
        const token1 = await ethers.getContractAt('MyToken', token1Address);
        const token2 = await ethers.getContractAt('MyToken', token2Address);
        const [deployer] = await ethers.getSigners();

        const token1Amount = await token1.balanceOf(deployer.address);
        const token2Amount = await token2.balanceOf(deployer.address);

        const liquidityAdderContract = await ethers.getContractAt('UniswapLiquidityAdder', uniswapLiquidityAdderAddress);

        await token1.approve(uniswapLiquidityAdderAddress, token1Amount);
        await token2.approve(uniswapLiquidityAdderAddress, token2Amount);
        
        const contractTx: ContractTransaction = await liquidityAdderContract.addLiquidity(token1Amount, token2Amount);

        const contractReceipt: ContractReceipt = await contractTx.wait();

        const event = contractReceipt.events?.find(event => event.event === 'AddedLiquidity');
                
        const pool: Address = event?.args!['pool'];
        const liquidityTokens: BigNumber = event?.args!['liquidityTokens'];     
        const token1A: BigNumber = event?.args!['token1Amount'];
        const token2A: BigNumber = event?.args!['token2Amount'];

    	  console.log(`pool: ${pool}`)
    	  console.log(`liquidityTokens: ${liquidityTokens}`)
    	  console.log(`token1Amount: ${token1A}`)
        console.log(`token2Amount: ${token2A}`)

    })

