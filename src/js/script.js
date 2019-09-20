
// Script for BIG CHEEZE GAMBLE 


// Global variables to store wizardArray , Total price amount value

var wizarray;
var pricePool;
var tempTableDetailsArray=[];
var wiztabel_height=0;
var mybetsArray=[];

// alchemy api token and email
var apiToken="SWNXMHPV76I52TGX4vkmp3QkVgje5B8H78KNQthv";
var apiEmail="muthukumaresh@vijayasekar.com";


// when window is loaded calling alchemy api to get wizard details
$(window).on("load",function() {
	$("#loader").hide();
	getwizdetails();
	checkTournamentStatus();
});


// variables to store data to insert details in table

var tableData="";
var active=0;
var totalPower =0;

// method to insert wizard detials in table 

function inserwizintable(wizarray){

	for(var i=0;i<wizarray.length;i++){

		var tempValueset=false;

		for(j=0;j<tempTableDetailsArray.length;j++){

			if(tempTableDetailsArray[j].wizid==wizarray[i].id){

				// if (wizarray[i].power<=0||wizarray[i].eliminatedBlockNumber!=null){
					if (wizarray[i].eliminatedBlockNumber!=null){

						tableData =tableData +'<tr><td>'+wizarray[i].id+'</td><td>'+parseInt(wizarray[i].power/1000000000000)+'</td> <td id=amount'
						+wizarray[i].id+'>'+parseFloat(tempTableDetailsArray[j].betamount/1000).toFixed(3)+'</td><td id=noofbets'+wizarray[i].id+'>'
						+tempTableDetailsArray[j].bettersize+'</td><td><input type="number" min="0.001" max="1000" step="0.01" name="" id="'
						+ wizarray[i].id +'"></td> <td><button class="elim_place_bet_btn " data-toggle="tooltip" title="Eliminated Wizard!" style="cursor: not-allowed;">Bet</button></td> </tr>';
						tempValueset=true;

					}

					else{

						tableData =tableData +'<tr><td>'+wizarray[i].id+'</td><td>'+parseInt(wizarray[i].power/1000000000000)+'</td><td id=amount'
						+wizarray[i].id+'>'+parseFloat(tempTableDetailsArray[j].betamount/1000).toFixed(3)+'</td><td id=noofbets'+wizarray[i].id+'>'
						+tempTableDetailsArray[j].bettersize+'</td><td><input type="number" type="number"  min="0.001" max="1000" step="0.01" name="" id="'
						+ wizarray[i].id +'"></td> <td><button class="place_bet_btn"onclick="placebet('+ wizarray[i].id +')">Bet</button></td> </tr>';
						tempValueset=true;
					}

				}

			}
			if (wizarray[i].eliminatedBlockNumber!=null){
				// if (wizarray[i].power<=0||wizarray[i].eliminatedBlockNumber!=null){

					tableData =tableData +'<tr><td>'+wizarray[i].id+'</td><td>'+parseInt(wizarray[i].power/1000000000000)+'</td> <td id=amount'
					+wizarray[i].id+'>0</td><td id=noofbets'+wizarray[i].id+'>0</td><td><input type="number" min="0.001" max="1000" step="0.01" name="" id="'
					+ wizarray[i].id +'"></td> <td><button class="elim_place_bet_btn " data-toggle="tooltip" title="Eliminated Wizard!" style="cursor: not-allowed;">Bet</button></td> </tr>';

				}
				else{

					if(!tempValueset){
						tableData =tableData +'<tr><td>'+wizarray[i].id+'</td><td>'+parseInt(wizarray[i].power/1000000000000)+'</td> <td id=amount'
						+wizarray[i].id+'>0</td><td id=noofbets'+wizarray[i].id+'>0</td><td><input type="number" min="0.001" max="1000" step="0.01" name="" id="'
						+ wizarray[i].id +'"></td> <td><button class="place_bet_btn"onclick="placebet('+ wizarray[i].id +')">Bet</button></td> </tr>';
					}
				}
		// for removing wizard with zero power and eliminated 
		// if(wizarray[i].power>0 && wizarray[i].eliminatedBlockNumber==null){


		// add this new checking method after confirming wizards can be revived if tournament is in revive phase so need to check only eliminated block
		if(wizarray[i].eliminatedBlockNumber==null){

			active++;
			totalPower=totalPower+parseInt(wizarray[i].power/1000000000000);
		}

	}

	$("#textip").append(tableData);
	wiztabel_height = $(window).height()-$(".navbar").height()-$(".details_container").height()-30 -170;
	console.log("wiztable",wiztabel_height);

	$('#wiztable').DataTable( {
		scrollY: wiztabel_height


	} );

	// console.log("height",$(window).height());
	// console.log("height",$("#wiztable").height());
	// console.log("height",$(".navbar").height());
	// console.log("height",$(".details_container").height());



$("#total_wiz").text("Number of Wizards at the Start of Tournament: "+wizarray.length);
$("#active_wiz").text("Number of Remaining Wizards in the Tournament: "+active);
$("#total_power").text(" Total Power of Wizards: "+totalPower);

}


// function to update total price pool value in topbar according to emitted value

function updatePrizePool(pricePool){

	var priceAmount = parseFloat((pricePool/1000)*0.9).toFixed(3);

	$("#total_prize").text("Total Prize Pool: "+priceAmount);

}

// function to fetch wizard details from alchemy api

function getwizdetails(){


	

   //     var walletAddress ="0xc92a2167a1f788a468665e292ea4038d7a9928dd";

   $("#loader").show();
   $.ajax({

   	url: "https://cheezewizards-rinkeby.alchemyapi.io/wizards",
   	beforeSend: function(xhr) { 
   		xhr.setRequestHeader("x-api-token", apiToken); 
   		xhr.setRequestHeader("x-email",apiEmail);
   		xhr.setRequestHeader("contentType","application/json");
   	},
   	type: 'GET',
   	contentType: 'application/json',
   	success: function (data) {

   		inserwizintable(data.wizards);
   		wizarray=data.wizards;
   		$("#loader").hide();

   		console.log(data.wizards.length,"length");


   	},

   	error: function(){
   		$("#loader").hide();
   		alert("Cannot get data");
   	}
   });

}

function roundUp(num, precision) {
	precision = Math.pow(10, precision)
	return Math.ceil(num * precision) / precision
}


// method to place bet on wizard

function placebet(wizid){

	var wizPower=0;

	var bet = $('#'+wizid).val();

	for(var i=0;i<wizarray.length;i++){
		if(wizarray[i].id==wizid){
			wizPower=wizarray[i].power;

		}

	}

	if(bet===""||bet==0){

		App.snackbarCall("Please enter a bet amount.")

	}
	else{
		var bet_value = bet*1000;
		console.log("bet",bet,"bet_value",bet_value);

		App.placeBetOnWizard(web3.eth.accounts[0],wizid,bet_value,totalPower,wizarray.length,active,parseInt(wizPower/1000000000000),{from: App.account,value: web3.toWei(bet,'ether')});
	}


}


function popWinner(winingWizard,winingAmount,winnerAddress){

	var innerText='<tr><th style="padding:24px">Wizard ID</th><th class="text-center" style="padding:24px">Better Address</th><th class="text-center" style="padding:24px">Prize Amount</th></tr><tr><td class="text-center">'+winingWizard+'</td><td class="text-center">'+winnerAddress+'</td><td class="text-center">'+winingAmount+'</td></tr>';
	$("#winner_details").append(innerText);
	$("#showWinner_btn").click();


}


function updatetable(emitteddetails){
	console.log(emitteddetails,"emited");

 // 	for(var i=0;i<emitteddetails.length;i++){

 //  debugger

 //  		var amountid= "#amount"+emitteddetails.wizid;

 //  		var noofbettersid="#noofbets"+emitteddetails.wizid;

 //  		console.log($(amountid));
	// var x= 	$(amountid).text(emitteddetails.betamount);
	// 	$(noofbettersid).text(emitteddetails.bettersize);

	
}



	// call prize distribution function if there  is only one wizard with power greater than zero.
   		
   		


function checkTournamentStatus(){

 $.ajax({

   	url: "https://cheezewizards-rinkeby.alchemyapi.io/wizards?minpower=100000",
   	beforeSend: function(xhr) { 
   		xhr.setRequestHeader("x-api-token", apiToken); 
   		xhr.setRequestHeader("x-email",apiEmail);
   		xhr.setRequestHeader("contentType","application/json");
   	},
   	type: 'GET',
   	contentType: 'application/json',
   	success: function (data) {
   		wizarray=data.wizards;
   		console.log(data.wizards.length,"length in status");

		// change this to lenght is equal to one
   		if(data.wizards.length==1){
   			distributePrize(data);
   			App.distribute(data.wizards.id);
   		}


   	},

   	// error: function(){
   	
   	// 	alert("Cannot get data");
   	// }
   });

}

// function updateMyBets(){
// var innerText='<tr><th style="padding:24px">Wizard ID</th><th class="text-center" style="padding:24px">Better Address</th><th class="text-center" style="padding:24px">Prize Amount</th></tr><tr><td class="text-center">'+winingWizard+'</td><td class="text-center">'+winnerAddress+'</td><td class="text-center">'+winingAmount+'</td></tr>';
	

// }

// setTimeout(function(){

// 	$('#wiztable').DataTable( {
// 		scrollY: wiztabel_height


// 	} 
// 	); 


// }, 2000);



$(document).on('load',function(){
	$('[data-toggle="tooltip"]').tooltip();
});
