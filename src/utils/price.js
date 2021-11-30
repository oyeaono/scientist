/*
 * swapExactTokensForTokens -> 指定卖出代币数量，得到另一种代币
 * swapTokensForExactTokens -> 指定买进代币数量，卖出另一种代币
 * swapExactETHForTokens -> 指定卖出ETH数量，得到另一种ERC20代币
 * swapTokensForExactETH -> 指定买进ETH数量，卖出另一种ERC20代币
 * swapExactTokensForETH -> 指定卖出ERC20代币数量，得到ETH
 * swapETHForExactTokens -> 指定买进ERC20代币数量，卖出ETH
 * .decimals -> 获取精度
 * .allowance -> 获取approve上限(钱包地址，Router地址)
 * */
import { ethers } from "ethers";
import abi from "../abi/abi.json";
import BigNumber from "bignumber.js";

export class Run {
  constructor(option) {
    this.option = option;

    // provider
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.VUE_APP_BSC_URL,
      {
        name: process.env.VUE_APP_BSC_NETWORK_NAME,
        chainId: Number(process.env.VUE_APP_BSC_NETWORK_CHAINID),
      }
    );

    // wallet
    this.wallet = new ethers.Wallet(this.option.privateKey, this.provider);

    // Factory合约 -> (factory地址)
    this.contractFactory = new ethers.Contract(
      process.env.VUE_APP_BSC_FACTORY,
      abi.factory,
      this.wallet
    );

    // Router01合约 -> (Router地址)
    this.contractRouter01 = new ethers.Contract(
      process.env.VUE_APP_BSC_ROUTER,
      abi.Router01,
      this.wallet
    );

    // Router02合约 -> (Router地址)
    this.contractRouter02 = new ethers.Contract(
      process.env.VUE_APP_BSC_ROUTER,
      abi.Router02,
      this.wallet
    );

    // Pair合约 -> (币地址)
    this.contractCoin = new ethers.Contract(
      this.option.contractAddress,
      abi.pair,
      this.wallet
    );

    // Pair合约 -> (wbnb地址)
    this.contractWBNB = new ethers.Contract(
      process.env.VUE_APP_BNB,
      abi.pair,
      this.wallet
    );
  }

  // 调pair合约 -> pair地址
  pair = async () => {
    return await this.contractFactory.getPair(
      this.option.contractAddress,
      process.env.VUE_APP_BNB
    );
  };

  // approve上限
  allowance = async () => {
    return await this.contractCoin.allowance(
      this.wallet.address,
      this.option.contractAddress
    );
  };

  // 币的精度
  decimals = async () => {
    return await this.contractCoin.decimals();
  };

  // 名
  name = async () => {
    return await this.contractCoin.name();
  };
}

// 获取实时价格
export const realTimePrice = async (option) => {
  const run = new Run(option);

  // 调pair合约 -> pair余额
  let coinBalance = await run.contractCoin.balanceOf(run.pair());
  const len = await run.decimals();

  // 1e18 -> 精度，不同币不一样精度
  if (len < 18) {
    coinBalance = new BigNumber(coinBalance._hex).div(Math.pow(10, len));
  } else {
    coinBalance = new BigNumber(coinBalance._hex).div(1e18);
  }

  let wbnbBalance = await run.contractWBNB.balanceOf(run.pair());

  wbnbBalance = new BigNumber(wbnbBalance._hex).div(1e18);

  return {
    params: wbnbBalance.div(coinBalance),
    value: (wbnbBalance.toString() / coinBalance.toString()).toFixed(8),
    coinValue: coinBalance.toString(),
    bnbValue: wbnbBalance.toString(),
  };
};

// 获取钱包币余额
export const coinBalance = async (option) => {
  const run = new Run(option);

  let balance = await run.contractCoin.balanceOf(run.wallet.address);
  const len = await run.decimals();
  if (len < 18) {
    balance = new BigNumber(balance._hex).div(Math.pow(10, len));
  } else {
    balance = new BigNumber(balance._hex).div(1e18);
  }

  return {
    params: balance,
    value: balance.toString(),
  };
};

// 买入
export const buy = async (option) => {
  let amountOutMin;
  const run = new Run(option);

  const coinPrice = (await realTimePrice(option)).params;
  // 计算滑点
  if (option.slipPoint) {
    const real = option.amount * (1 - option.slipPoint * 0.01);
    amountOutMin =
      "0x" +
      new BigNumber(real)
        .times(1e18)
        .div(coinPrice)
        .integerValue()
        .toString(16);
  } else {
    amountOutMin =
      "0x" +
      new BigNumber(option.amount)
        .times(1e18)
        .div(coinPrice)
        .integerValue()
        .toString(16);
  }
  console.log("amountOutMin", amountOutMin);

  // 计算gas费
  const gas = option.gas ? (Number(option.gas) * 5).toString() : "5.0";
  console.log("gas", gas);

  // nonce
  let nonce = await run.wallet.getTransactionCount();
  console.log("nonce", nonce);

  // 最小代币数量: 输入 * (1 - 滑点)
  // path: [bnb, 币]
  // 接收地址
  // 最后期限
  // 输入
  if (option.batch) {
    // 抢开盘
    for (let i = 0; i < 64; i++) {
      await run.contractRouter01.swapExactETHForTokens(
        amountOutMin,
        [process.env.VUE_APP_BNB, option.contractAddress],
        run.wallet.address,
        new Date().getTime(),
        {
          value: ethers.utils.parseEther(option.amount),
          gasPrice: ethers.utils.parseUnits(gas, "gwei"),
          gasLimit: 1000000,
          nonce: nonce++,
        }
      );
    }
  } else {
    // 普通购买
    await run.contractRouter01.swapExactETHForTokens(
      amountOutMin,
      [process.env.VUE_APP_BNB, option.contractAddress],
      run.wallet.address,
      new Date().getTime(),
      {
        value: ethers.utils.parseEther(option.amount),
        gasPrice: ethers.utils.parseUnits(gas, "gwei"),
        gasLimit: 1000000,
        nonce: nonce++,
      }
    );
  }
};

// 卖出
export const sale = async (option) => {
  const run = new Run(option);

  // 币价
  const coinPrice = (await realTimePrice(option)).params;
  console.log("sale coinPrice", coinPrice, typeof coinPrice);

  // 币余额
  let amountIn = (await coinBalance(option)).params;
  console.log("sale tokenBalance", amountIn, typeof amountIn);

  // 输出
  const amountOutMin =
    "0x" +
    new BigNumber(amountIn)
      .times(coinPrice)
      .times(1e18)
      .times(1 - option.slipPoint * 0.01)
      .integerValue()
      .toString(16);
  console.log("sale amountOutMin", amountOutMin, typeof amountOutMin);

  // 输入
  amountIn = "0x" + amountIn.times(1e18).toString(16);
  console.log("sale tokenBalance1", amountIn, typeof amountIn);

  // 地址对
  const path = [option.contractAddress, process.env.VUE_APP_BNB];

  // 接收地址
  const addressTo = run.wallet.address;

  // gas费
  const gas = {
    gasPrice: ethers.utils.parseUnits("5.0", "gwei"),
    gasLimit: 1000000,
  };

  // approve -> Router拿走bnb(0xF... 极限最大数)
  await run.contractCoin.approve(
    process.env.VUE_APP_BSC_ROUTER,
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  );

  console.log("精度", (await run.decimals()).toString());
  console.log("上限", (await run.allowance()).toString());

  // 卖出
  // 卖出代币数量
  // 最小卖出eth金额
  // path: [币, bnb]
  // 接收地址
  // 最后期限
  // gas费
  const sale = await run.contractRouter01.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    addressTo,
    new Date().getTime(),
    gas
  );
  console.log("sale", sale);
};
