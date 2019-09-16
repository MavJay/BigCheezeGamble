App = {

 // web3Provider: null,
 //  contracts: {},
 //  account: '0x0',
 //  maininstance:{},
 //  switched:false,

 //  init: async function() {
 //    console.log("app init")
 //    //return await App.initWeb3();
 //    window.addEventListener('load', async () => {
 //      // Modern dapp browsers...
 //      if (window.ethereum) {
 //        window.web3 = new Web3(ethereum);
 //        try {
 //          // Request account access if needed
 //          await ethereum.enable();
 //          // Acccounts now exposed
 //          return await App.initWeb3();
 //        } catch (error) {
 //          // User denied account access...
 //        }
 //      }
 //      // Legacy dapp browsers...
 //      else if (window.web3) {

 //        window.web3 = new Web3(web3.currentProvider);
 //        // Acccounts always exposed
 //        return await App.initWeb3();
 //      }
 //      // Non-dapp browsers...
 //      else {
 //        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
 //      }
 //    });
 //  },
 //  initWeb3: async function() {
 //    if (typeof web3 !== 'undefined') {
 //      // If a web3 instance is already provided by Meta Mask.
 //      if (window.web3.currentProvider.constructor.name == "MetamaskInpageProvider"){
 //        App.web3Provider = web3.currentProvider;
 //        web3 = new Web3(web3.currentProvider);
 //      }
 //      else if (window.web3.currentProvider.constructor.name == "DapperLegacyProvider"){
 //          App.web3Provider = web3.currentProvider;
 //          web3 = new Web3(web3.currentProvider);
 //       }
 //      else{
 //        App.web3Provider = web3.currentProvider;
 //        web3 = new Web3(web3.currentProvider);
 //      }
 //    } else {
 //      // Specify default instance if no web3 instance provided
 //      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
 //      web3 = new Web3(App.web3Provider);
 //    }
 //    // web3 has to be injected/present
 //    if (web3) {
 //      if (web3.eth.accounts.length) {
 //        // if not locked, get account
 //        const account = web3.eth.accounts[0];
 //        web3.eth.defaultAccount = web3.eth.accounts[0];
 //        return account;
 //      }
 //        // updates UI, state, pull data
 //      } else {
 //        // locked. update UI. Ask user to unlock.
 //      }
    
 //    //Detecting network of metamask connenction
 //    web3.version.getNetwork((err, netId) => {
 //      switch (netId) {
 //        case "1":
 //        console.log('This is mainnet')
 //        break
 //        case "2":
 //        console.log('This is the deprecated Morden test network.')
 //        $(".metamask-info").text("Please switch to Mainnet");
 //        break
 //        case "3":
 //        console.log('This is the ropsten test network.')
 //        $(".metamask-info").text("Please switch to Mainnet");
 //        break
 //        default:
 //        console.log('This is local network or unknown network')
 //        $(".metamask-info").text("Please switch to Mainnet");
 //      }

 //    })
 //    return App.initContract();
 //  },

 web3Provider: null,
  contracts: {},
  account: '0x0',
  maininstance:{},
  switched:false,
  init: async function() {
    //return await App.initWeb3();
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          return await App.initWeb3();
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {

        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        return await App.initWeb3();
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    });
  },
  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      if (window.web3.currentProvider.constructor.name == "MetamaskInpageProvider"){
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      }else{
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      }
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    // web3 has to be injected/present
    if (web3) {
      if (web3.eth.accounts.length) {
        let account = getAccount();
        let accountInterval = setInterval(() => {
          if (getAccount() !== account) {
            App.switched = true;
            account = getAccount();
            $("#place-bet").off('click');
            $('#live-pills-tabContent .live-bet ul li').remove();
            $('.history-table tbody tr:not(:last-child)').remove();
              $('#live-pills-tabContent .live-bet label .players-count').text('0');
            App.contracts.sample = {};
            App.maininstance = {};
            //location.reload();
            return App.initContract();
          }
        }, 1000);
        // if not locked, get account
        let network = getNetwork();
        let networkInterval = setInterval(() => {
          if (getNetwork() !== network) {
            if(getNetwork() != 1){
              //alert(network)
              $(".metamask-info").text("Please switch to Mainnet");
            }else{
              $(".metamask-info").text("");
              $("#place-bet").off('click');
              $('#live-pills-tabContent .live-bet ul li').remove();
              $('.history-table tbody tr:not(:last-child)').remove();
                $('#live-pills-tabContent .live-bet label .players-count').text('0');
              App.contracts.sample = {};
              App.maininstance = {};
              //location.reload();
              return App.initContract();
            }
          }
        },1000);
        function getNetwork(){
          const network = web3.version.network;
          return network;
        }

        function getAccount(){
        const account = web3.eth.accounts[0];
        return account;
      }
        // updates UI, state, pull data
      } else {
        // locked. update UI. Ask user to unlock.
      }
    }
    //Detecting network of metamask connenction
    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
        console.log('This is mainnet')
        break
        case "2":
        console.log('This is the deprecated Morden test network.')
        $(".metamask-info").text("Please switch to Mainnet");
        break
        case "3":
        console.log('This is the ropsten test network.')
        $(".metamask-info").text("Please switch to Mainnet");
        break
        default:
        console.log('This is local network or unknown network')
        $(".metamask-info").text("Please switch to Mainnet");
      }

    })
    return App.initContract();
  },

 snackbarCall:function(text){
    Snackbar.show({text: text,pos: 'bottom-center',actionText: 'OK',actionTextColor: "var(--text-c1)"});
  },


  initContract: function() {
    debugger
    $.getJSON("BigGamble.json", function(Tournament) {
      console.log(Tournament)
      //  Instantiate a new truffle contract from the artifact
      App.contracts.Sample = TruffleContract(Tournament);
      //  Connect provider to interact with contract
      App.contracts.Sample.setProvider(App.web3Provider);

      return App.render();

    });

    // return App.bindEvents();
  },


  render: function(){

    web3.eth.getCoinbase(function(error,account){
      debugger
      if(error === null){
        if(account !== null){
          App.account = account;
          web3.eth.getBalance(account, function (error, wei) {
            if (!error) {
              //web3.fromWei(eth.getBalance(eth.coinbase));
              var balance = web3.fromWei(wei, 'ether');
              App.eth_balance = balance;
              console.log(balance + " ETH");
            }
          });

          // Game logic /////

          // Load contract data
          App.contracts.Sample.deployed().then(function(instance) {
            maininstance = instance;

              var bet=3;

             maininstance.joinTournamentByBet(web3.eth.accounts[0],1111,0.1,70,300,32,31,{from: App.account,value: web3.toWei(bet,'ether')});
             // console.log("render");

          ///   var contractinfo = instance.detailsOnLoad({},{fromBlock: 0, toBlock: 'latest'});
            // maininstance.checkPlayerExists(web3.eth.accounts[0]).then(function(bool){

            //   console.log(bool);

            // });
         //   console.log(contractinfo);


          // var balance =  maininstance.getBalance();
          // console.log("contract balance",balance);


          // using the callback


// maininstance.getPastEvents('detailsOnLoad', {
  
//     fromBlock: 0,
//     toBlock: 'latest'
// }, function(error, events){ console.log(events); })
// .then(function(events){
//     console.log(events) // same results as the optional callback above
// });


      var instructorEvent = maininstance.detailsOnLoad();

      instructorEvent.watch(function(error, result){
            if (!error)
                {
                    $("#loader").hide();
                    console.log(result.args.wizardId);
                } else {
                    $("#loader").hide();
                    console.log(error);
                }
        });

          });
        }else{
          $('#account-error').show()
          $('#account-error').text("Please connect your wallet!");
        }
      }

    });
  },
  snackbarCall:function(text){
    Snackbar.show({text: text,pos: 'bottom-center',actionText: 'OK',actionTextColor: "var(--text-c1)"});
  },




  // joinTournament:function(playerAddress,wizardId,joiningFee,affinityType){
  //   debugger
  //     App.maininstance.checkPlayerExists(playerAddress).then(function(bool){
  //       if(!bool){
  //         App.snackbarCall("Please confirm your transaction");
  //          maininstance.joinTournament(playerAddress,wizardId,joiningFee,affinityType,{from: App.account,value: web3.toWei(joiningFee,'ether')}).then(function(acc,error){
  //           if(!error){
  //               $(".metamask-info p").text("Bet submitted! Waiting for player to place a bet.");
  //               App.snackbarCall("You have joined the tournament");
  //           }else{
  //             $(".metamask-info p").text("Something went wrong!");
  //             console.error(error);
  //           }

  //         }).catch(function(err){
  //           if(err.message.includes("User denied transaction signature")){
  //             $(".metamask-info p").text("You rejected last transaction in metamask");
  //           }else{
  //             $(".metamask-info p").text("Something went wrong. Please check your metamask for detailed error");
  //           }

  //         });
  //       } else {
  //       App.snackbarCall("Already joined the tournament");
  //       }
  //     });
  // },


};


// $(function() {
 
// });

console.log("appjs")
 App.init();



