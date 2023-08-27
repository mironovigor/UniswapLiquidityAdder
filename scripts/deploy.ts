import {ethers, run, network} from 'hardhat'

const fAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const rAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

const delay = async (time: number) => {
	return new Promise((resolve: any) => {
		setInterval(() => {
			resolve()
		}, time)
	})
}

async function main() {
	const name = "MyToken";
	const symbol = "GRF";

	const MyToken = await ethers.getContractFactory("MyToken");
	const myToken1 = await MyToken.deploy(name, symbol);
	
	const myToken2 = await MyToken.deploy(name, symbol);
	console.log('start');
	await myToken1.deployed();
	await myToken2.deployed();

	console.log(
		`MyToken1 contract deployed to ${myToken1.address}`		
	);

	console.log(
		`MyToken2 contract deployed to ${myToken2.address}`		
	);

  	console.log('wait of delay...')
	await delay(15000) // delay 15 secons
	console.log('starting verify token...')
	
	const UniswapLiquidityAdder = await ethers.getContractFactory("UniswapLiquidityAdder")  			
  	const uniswapLiqAdder = await UniswapLiquidityAdder.deploy(rAddress, fAddress, myToken1.address, myToken2.address)
  	await uniswapLiqAdder.deployed()		
	console.log(
		`uniswapLiqAdder contract deployed to ${uniswapLiqAdder.address}`		
	);
	
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
 main();
