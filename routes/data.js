var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/main.controller');

/* GET data listing. */
router.get('/', async function(req, res, next){
   try {
      const loginResponse = await login();
      const accessTokenResponse = await getAccessToken(loginResponse.data.refresh_token);
      const userAccountsResponse = await recursiveGetAccounts(accessTokenResponse.data.access_token);

      await Promise.all(userAccountsResponse.map( async(account) => {
            try {
                   const transactions = await recursiveGetTransactions(accessTokenResponse.data.access_token, account.acc_number);
                   account.transactions = transactions;
                   return account;
            } catch(e){
               return account;
            }
         })
      );

      return res.send(userAccountsResponse);
   } catch (err) {
      return res.send(err);
   }
});

async function login(){
   const loginResponse = await AuthController.login();
   return loginResponse;
}

async function getAccessToken(refresh_token){
   const accessTokenResponse = await AuthController.getAccessToken(refresh_token);
   return accessTokenResponse;
}

async function recursiveGetAccounts(access_token){
   const accounts = [];
   let userAccountsResponse = await AuthController.getRecursiveData(access_token, `${process.env.API_HOST}:${process.env.API_PORT}/accounts`);
   accounts.push(...userAccountsResponse.data.account);
   while(userAccountsResponse.data.link !== null && userAccountsResponse.data.link.next !== null){
      userAccountsResponse = await AuthController.getRecursiveData(access_token, `${process.env.API_HOST}:${process.env.API_PORT}${userAccountsResponse.data.link.next}`);
      accounts.push(...userAccountsResponse.data.account);
   }
   return accounts;
}

async function recursiveGetTransactions(access_token, acc_number){
   const transactions = [];
   let accountTransactionsResponse = await AuthController.getRecursiveData(access_token, `${process.env.API_HOST}:${process.env.API_PORT}/accounts/${acc_number}/transactions`);
   
   transactions.push(...accountTransactionsResponse.data.transactions);
   while(accountTransactionsResponse.data.link !== null && accountTransactionsResponse.data.link.next !== null){
      accountTransactionsResponse = await AuthController.getRecursiveData(access_token, `${process.env.API_HOST}:${process.env.API_PORT}${accountTransactionsResponse.data.link.next}`);
      transactions.push(...accountTransactionsResponse.data.transactions);
   }
   return transactions;
}

module.exports = router;
