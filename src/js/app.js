App = {
 
 web3Provider: null,
 contracts: {},
 account: '0x0',
 maininstance:{},
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
					try{
			$("#userNotificationText").html('<br><br> You should connect your wallet to access.');
			$("#notificationinfo").show();
					await ethereum.enable();
					// Acccounts now exposed
					return await App.initWeb3();
				}
				catch(error){

				}
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

				if (window.web3.currentProvider.constructor.name == "DapperLegacyProvider"){
					 App.web3Provider = web3.currentProvider;
					 web3 = new Web3(web3.currentProvider); 
				}
			else if (window.web3.currentProvider.constructor.name == "MetamaskInpageProvider"){
				App.web3Provider = web3.currentProvider;
				web3 = new Web3(web3.currentProvider);
			}else{
				App.web3Provider = web3.currentProvider;
				web3 = new Web3(web3.currentProvider);
			}
		} else {
			// Specify default instance if no web3 instance provided
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
			web3 = new Web3(App.web3Provider);
		}
		// web3 has to be injected/present
		if (web3) {
			if (web3.eth.accounts.length) {
				// if not locked, get account
				const account = web3.eth.accounts[0];


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
		$.getJSON("BigGamble.json", function(Gamble) {
			// console.log(Gamble)
			//  Instantiate a new truffle contract from the artifact
			App.contracts.Sample = TruffleContract(Gamble);
			//  Connect provider to interact with contract
			App.contracts.Sample.setProvider(App.web3Provider);

			return App.render();

		});

		// return App.bindEvents();
	},


	render: function(){

		web3.eth.getCoinbase(function(error,account){
			if(error === null){
				if(account !== null){
					App.account = account;
					web3.eth.getBalance(account, function (error, wei) {
						if (!error) {
							//web3.fromWei(eth.getBalance(eth.coinbase));
							var balance = web3.fromWei(wei, 'ether');
							App.eth_balance = balance;
							// console.log(balance + " ETH");

							
						}
					});

					// Game logic /////

					// Load contract data
					App.contracts.Sample.deployed().then(function(instance) {
						debugger
						maininstance = instance;
						//Check Player Valid  event detailsOnLoad(uint wizardId,uint totalBetters,uint wizardTotalBet,uint totalBetPlaced,address player, uint betAmountOnwizard);
						var detailsOnLoad = maininstance.detailsOnLoad({}, {fromBlock:'0', toBlock: 'latest'});
					 // App.getMyBets(account);
						if (detailsOnLoad != undefined){
							detailsOnLoad.watch(function(error, result){
								debugger
								try{
								var selectedWizard = result.args.wizardId.valueOf();
								var totalBetAmountPlaced = result.args.totalBetPlaced.valueOf();
								var totalNoOfBetPlaced = result.args.totalBetters.valueOf();
								var totalBetPlacedOnSelected = result.args.wizardTotalBet.valueOf();
								pricePool=totalBetAmountPlaced;
							}
							catch(error){
								console.log("emit error", error);

							}
							updatePrizePool(pricePool);

								var temp = {"wizid":result.args.wizardId.valueOf(),"betamount":result.args.wizardTotalBet.valueOf(),
														"bettersize":result.args.totalBetters.valueOf(),"betteraddress":result.args.player.valueOf(),
														"currentBet":result.args.betAmountOnwizard.valueOf()};
								
								var inserted =false;
								for(var i=0;i<tempTableDetailsArray.length;i++){
									if(temp.wizid==tempTableDetailsArray[i].wizid){
										tempTableDetailsArray[i].betamount=temp.betamount;
										tempTableDetailsArray[i].bettersize=temp.bettersize;
										inserted=true;
									}
								}
								if(account==temp.betteraddress){
									mybetsArray.push(temp);
								}

								if(!inserted){
								tempTableDetailsArray.push(temp);
								}
								// console.log(tempTableDetailsArray);
								// console.log("mybetarray", mybetsArray);

								updatetable(temp);
								resetTable();
						});
						}


						var finalWinner = maininstance.finalWinner({}, {fromBlock:'latest', toBlock: 'latest'});
								if (finalWinner != undefined){
							finalWinner.watch(function(error, result){
								var winingWizard = result.args.wizardId.valueOf();
								var winingAmount = result.args.transferAmount.valueOf();
								var winnerAddress = result.args.playerAddress.valueOf();

								popWinner(winingWizard,winingAmount,winnerAddress);
								 
						})
						}

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
	placeBetOnWizard:function(playerAddress,wizardId,betAmt,wizardPower,tPWizards,wizardSOT,wizardTOB){
	 

				debugger
				 
					 if (typeof maininstance !== 'undefined'&& typeof web3 !== 'undefined'){
						$("#userNotificationText").html('<br>'+BetInfo);
		$("#notificationinfo").show();

				App.snackbarCall("Please confirm your transaction");
		 var txHash  =   maininstance.joinTournamentByBet(playerAddress,wizardId,betAmt,wizardPower,tPWizards,wizardSOT,wizardTOB,
			{from: App.account,value: web3.toWei(betAmt/1000,'ether')}).then(function(acc,error){
					if(!error){
			
					

					console.log("acc",acc.receipt.transactionHash);

						$("#userNotificationText").html('<br><br><br><span>Transaction succeded.</span> <br><a href="https://rinkeby.etherscan.io/tx/'+acc.receipt.transactionHash+'" style="max-width="400px;">View your transaction in Etherscan </a>');
						$("#notificationinfo").show();
						// window.location.href = window.location.href;
						App.snackbarCall("You have placed the bet successfully");

					}else{
						App.snackbarCall("Something went wrong!");
						console.error(error);
					}

				}).catch(function(err){
				 
					if(err.message.includes("User denied transaction signature")){
						App.snackbarCall("You have rejected the last transaction.");
						 $("#userNotificationText").html('<br> <br>'+"You have rejected the last transaction.");
					}else{
						console.log(err.message)
						 $("#userNotificationText").html('<br> <br>'+"You have rejected last transaction.");
						App.snackbarCall("Something went wrong. Please check your wallet for detailed error");
					}

				});
	
			 console.log("transaction hash",txHash);
		 }

					 
else{
			App.init();
			$("#userNotificationText").html('<br><br> You should connect your wallet to access.');
			$("#notificationinfo").show();

		App.initAgain();

	 }
		 },

		 initAgain: async function() {
					await ethereum.enable();
					// Acccounts now exposed
					return await App.initWeb3();
				},

				distribute:function(wizid){

					maininstance.distributePrizeMoney(playerAddress).then(function(data,error){

						console.log("printing distribute",data,error);

					});
				},

		// claimPrize:function(){
  //         debugger
  //         var inputVal = document.getElementById("myInput").value;
  //         alert(inputVal)

  //         maininstance.distributePrizeMoney(parseInt(inputVal));
  //           // maininstance.distributePrizeMoney(parseInt(inputVal), function(acc,error){
  //           //   if(!error){
  //           //     debugger
  //           //   //  location.reload(true);
  //           //   console.log("success",acc,error);

  //           //   }else{
  //           //     console.log("error",acc,error);
  //           //   }

  //           // })
  //       },





	 };
 $( window ).on('load',function() {
	console.log("loaded",mybetsArray);

setTimeout(function(){
	var mybetText='<tr><th style="padding:24px">Wizard ID</th><th class="text-center" style="padding:24px">Bet Amount (in ETH)</th></tr>';

	for(var i=0;i<mybetsArray.length;i++){
		mybetText=mybetText+'<tr><td class="text-center">'+mybetsArray[i].wizid+'</td><td class="text-center">'+parseFloat(mybetsArray[i].currentBet/1000).toFixed(3)+'</td></tr>';
	}

 $("#my_bets").append(mybetText);

	 }, 3000);
});

	 $(function() {
		App.init();
	});
