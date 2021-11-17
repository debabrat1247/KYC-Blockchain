'use strict';

const Contract = require('../proxies/Contract');
const Provider = require('../proxies/Provider');

const provider = new Provider();
const contract = new Contract();
const web3 = provider.web3;
const instance = contract.initContract();
instance.options.gas = 500000;

module.exports = class Admin {
    constructor(){}
     addBank =  async (req, res) => {
      console.log("addBank");
    try {
      console.log("me from addbank");
      const { user: { payload: { publicAddress } }, body: { bankName, bankAddress, regNumber } } = req;
      const bankNameInBytes32 = web3.utils.fromAscii(bankName);
      const regNumberInBytes32 = web3.utils.fromAscii(regNumber);

      console.log('console ...', bankNameInBytes32, bankAddress, regNumberInBytes32);

      const data = await instance.methods.addBank(bankNameInBytes32, bankAddress, regNumberInBytes32).send({ from: publicAddress });

      return res.status(200).json({ message: 'Successfully added bank' });

    } catch (err) {
      console.log('console err', err);
      return res.status(500).send({ message: err.message });
    }
  }

  removeBank = async (req, res) => {
    console.log("removeBank");

    try {
      const { user: { payload: { publicAddress } }, body: { bankAddress } } = req;
      console.log('console req', publicAddress, bankAddress);

      const data =  await instance.methods.removeBank(bankAddress).send({ from: publicAddress });

      return res.status(200).send({ message: 'Successfully removed the bank' });
    } catch (err) {
      console.log('console err', err);
      return res.status(500).send({ message: err.message });
    }
  }
}

