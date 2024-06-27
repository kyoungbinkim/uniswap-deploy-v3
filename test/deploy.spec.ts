require("dotenv").config();

import fs from 'fs'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

import UniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import { expect } from 'chai'
import { DEPLOY_V3_CORE_FACTORY } from '../src/steps/deploy-v3-core-factory'
import { asciiStringToBytes32 } from '../src/util/asciiStringToBytes32'
import deploy from '../src/deploy'


const ganache = require('ganache-cli')

const DUMMY_ADDRESS = '0x9999999999999999999999999999999999999999'

describe('deploy', async () => {
      let provider: Web3Provider
      let signer: JsonRpcSigner
      let ownerAddress: string
      let state: Object
      let WTHAddr: string  
      
      before('create provider', async () => {
            provider = new Web3Provider(ganache.provider())
            signer = provider.getSigner()
            ownerAddress = await signer.getAddress()
            WTHAddr = process.env.ETH_WETH_ADDR ?? DUMMY_ADDRESS
      })

      it('deploy V3 UniSwap', async () => {
            const deploy_ = await deploy({
                  signer: signer,
                  gasPrice: 0,
                  initialState: {},
                  onStateChange: async (st) => {
                        console.log('State changed:', st)
                        fs.writeFileSync('./contractAddress.json', JSON.stringify(st, null, 2))
                  },
                  weth9Address: WTHAddr,
                  nativeCurrencyLabelBytes: asciiStringToBytes32('ETH'),
                  v2CoreFactoryAddress: DUMMY_ADDRESS,
                  ownerAddress: ownerAddress,
            })

            for (let i = 0; i < 15; i++) {
                  await deploy_.next()
            }
      })
})