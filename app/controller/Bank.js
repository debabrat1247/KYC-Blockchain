'use strict';

const Contract = require('../proxies/Contract');
const Provider = require('../proxies/Provider');

const provider = new Provider();
const contract = new Contract();
const web3 = provider.web3;
const instance = contract.initContract();
instance.options.gas = 500000;
module.exports = 
class Admin {
  constructor(){}
   addKycRequest = async (req, res) => {
     console.log("addKycRequest");
    try {
      const { user: { payload: { publicAddress } }, body: { customerId, customerDataHash } } = req;
      const customerIdInBytes32 = web3.utils.fromAscii(customerId);
      const result = await instance.methods.addKycRequest(customerIdInBytes32, customerDataHash).send({ from: publicAddress });

      return res.status('200').send({ message: 'Successfully added KYC request.' });

    } catch (err) {
      console.log('console err', err);
      return res.status(500).send({ message: err.message });
    }
  }

   getBankRequests = async (req, res) => {
    console.log("getBankRequests");
    try {
      console.log("inside getbankrequest1");
      const { user: { payload: { publicAddress: bankAddress } } } = req;
      
      console.log("inside getbankrequest2");
      const customers = await instance.methods.getRequestedCustomers(bankAddress).call({ from: bankAddress });
      console.log("inside getbankrequest3");
      const customerDetails = await Promise.all(
        customers
          .filter(customerId => customerId != '0x0000000000000000000000000000000000000000000000000000000000000000')
          .map(async customerId => {
            const customerData = await instance.methods.viewCustomerDetails(customerId).call({ from: bankAddress });
            const bankDetails = await instance.methods.getBankDetails(bankAddress).call({ from: bankAddress });

            return {
              customerId: customerData[0],
              bank: customerData[1],
              bankName: bankDetails[0],
              dataHash: customerData[2],
              isAllowed: customerData[3],
            };
          }));

      return res.status(200).json(customerDetails.filter(customer => customer.bank !== bankAddress));
    } catch (err) {
      console.log('console err', err);
      return res.status(500).json({ err });
    }
  };

   verifyCustomer = async (req, res) => {
    console.log("verifyCustomer");
    try {
      const { user: { payload: { publicAddress: bankAddress } }, query: { customerId, dataHash } } = req;
      const response = await instance.methods.addCustomer(customerId, dataHash).send({ from: bankAddress });

      return res.status(200).send({ message: 'Successfully added customer for verification process.' });
    } catch (err) {
      console.log('console err', err);
      return res.status(500).send({ message: err.message });
    }
  }

   getVerificationRequests = async (req, res) => {
    console.log("getVerificationRequests");
    try {
      const { user: { payload: { publicAddress: bankAddress } } } = req;
      console.log("getVerificationRequests1");
      const customers = await instance.methods.getPendingCustomers(bankAddress).call({ from: bankAddress });
      console.log(customers);
      console.log("getVerificationRequests2");
      const customerDetails = await Promise.all(customers.map(async customerId => {
        const customerData = await instance.methods.viewPedingCustomerDetails(customerId).call({ from: bankAddress });
        const bankDetails = await instance.methods.getBankDetails(bankAddress).call({ from: bankAddress });

        return {
          customerId: customerData[0],
          rating: customerData[2],
          upVotes: customerData[3],
          isVerified: customerData[5],
          bank: customerData[4],
          bankName: bankDetails[0],
        }
      }));
      console.log(customerDetails);
      return res.status(200).json(customerDetails.filter(customer => !customer.isVerified));
    } catch (err) {
      console.log('console err', err);
      return res.status(500).json({ err });
    }
  }

   getVerifiedCustomers = async (req, res) => {
    console.log("getVerifiedCustomers");
    try {
      const { user: { payload: { publicAddress: bankAddress } } } = req;
      const customers = await instance.methods.getVerifiedCustomers().call({ from: bankAddress });
      const customerDetails = await Promise.all(customers.map(async customerId => {
        const customerData = await instance.methods.viewPedingCustomerDetails(customerId).call({ from: bankAddress });

        return {
          customerId: customerData[0],
          rating: customerData[2],
          upVotes: customerData[3],
          isVerified: customerData[5],
        }
      }));

      return res.status(200).json(customerDetails.filter(customer => customer.isVerified));
    } catch (err) {
      console.log('console err', err);
      return res.status(500).json({ err });
    }
  }

   upVoteCustomer = async (req, res) => {
    console.log("upVoteCustomer");
    try {
      const { user: { payload: { publicAddress: bankAddress } }, query: { customerId } } = req;
      const data = await instance.methods.upVoteCustomer(customerId).send({ from: bankAddress });

      if (data.events['alreadyVoted']) {
        throw new Error(data.events["alreadyVoted"].returnValues.message);
      }

      return res.status('200').send({ message: 'Successfully voted customer' });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

   upVoteBank = async (req, res) => {
    console.log("upVoteBank");
    try {
      const { user: { payload: { publicAddress: bankAddress } }, query: { address } } = req;
      const data = await instance.methods.upVoteBank(address).send({ from: bankAddress });

      if (data.events['alreadyVoted']) {
        throw new Error(data.events["alreadyVoted"].returnValues.message);
      }

      return res.status('200').send({ message: 'Successfully voted bank' });
    } catch (err) {
      console.log('console err', err);
      return res.status(500).send({ message: err.message });
    }
  }


   getBanks = async (req, res) => {
    console.log("getBanks");
    try {
      const { user: { payload: { publicAddress } } } = req;
      const banks = await instance.methods.getAllBanks().call({ from: publicAddress });
      const banksDetails = await Promise.all(banks.map(async bankAddress => {
        const bankDetail = await instance.methods.getBankDetails(bankAddress).call({ from: publicAddress });

        return {
          name: bankDetail[0],
          address: bankDetail[1],
          rating: bankDetail[2],
          kycCount: bankDetail[3],
          regNumber: bankDetail[4]
        };
      }));

      return res.status(200).json(banksDetails);
    } catch (err) {
      console.log('console err', err);
      return res.status(500).json({ err });
    }
  }
}



