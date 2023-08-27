// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract UniswapLiquidityAdder {
    IUniswapV2Router02 public immutable uniswapRouter; // immutable for saving gaz
    IUniswapV2Factory public immutable uniFactory;
    IERC20 public immutable token1;  // токена1 
    IERC20 public immutable token2;  // токена2
        
    event LiquidityAdded(address indexed user, uint256 token1Amount, uint256 token2Amount, uint256 liquidityTokens, address pool);

    constructor(address _routerAddress, address _factoryAddress, address _token1, address _token2) {
        uniswapRouter = IUniswapV2Router02(_routerAddress);
        uniFactory    = IUniswapV2Factory(_factoryAddress);
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
    }

    // Метод для добавления ликвидности
    function addLiquidity(uint256 token1Amount, uint256 token2Amount) external {
        
        // Передача необходимых токенов контракту
        token1.transferFrom(msg.sender, address(this), token1Amount);
        token2.transferFrom(msg.sender, address(this), token2Amount);
        
        // Аппрув токенов для Uniswap
        token1.approve(address(uniswapRouter), token1Amount);
        token2.approve(address(uniswapRouter), token2Amount);
        
        // Вызов метода добавления ликвидности
        (uint256 liquidityTokens,,) = uniswapRouter.addLiquidity(
            address(token1), 
            address(token2),
            token1Amount,
            token2Amount,
            0,  // Минимальное количество ликвидности
            0,  // Минимальное количество ликвидности
            msg.sender,
            block.timestamp + 1 hours  // Дедлайн транзакции
        );
        address pool = uniFactory.getPair(address(token1), address(token2));

        // Вызов события
        emit LiquidityAdded(msg.sender, token1Amount, token2Amount, liquidityTokens, pool);
    }
}
