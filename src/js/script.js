
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

//host links



//var alchemyLink="https://cheezewizards-rinkeby.alchemyapi.io/wizards";
var alchemyLink="https://cheezewizards.alchemyapi.io/wizards";


// Messages to show to users

var BetInfo = "Waiting for the transaction to be confirmed.";

// when window is loaded calling alchemy api to get wizard details
$(window).on("load",function() {


	getwizdetails();
	// $("#loader").hide();
	
});


// variables to store data to insert details in table

var tableData="";
var active=0;
var totalPower =0;
var tableid=0;

var activeToUpdate=0;
var totalPowerToUpdate=0;

// method to insert wizard detials in table 

function inserwizintable(wizarray){        
	 $("#loader").show();

		var table_header = '<table id="wiztable'+tableid+'" class="table table-striped table-bordered" style="width:100%"><thead><tr><th>Wizard ID</th><th>Power</th>'
		+'<th>Total amount bet on Wizard (in ETH)</th><th>Number of Bettors on Wizard</th><th>Bet amount (in ETH)</th> <th></th> </tr> </thead><tbody id="textip">'
		+'</tbody></table>';               
																													

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
						// '+ wizarray[i].id +','+BetInfo+'

						// '+ wizarray[i].id +'
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

	$("#table_container").html("");
	
	$("#table_container").append(table_header);
	$("#textip").html("");
	$("#textip").append(tableData);

	wiztabel_height = $(window).height()-$(".navbar").height()-$(".details_container").height()-30 -170-10;
	// console.log("wiztable",wiztabel_height);
	tableData="";

$("#total_wiz").text("Number of Wizards at the Start of Tournament: "+wizarray.length);
$("#active_wiz").text("Number of Remaining Wizards in the Tournament: "+active);
$("#total_power").text("Total Power of Wizards: "+totalPower);
activeToUpdate=active;
totalPowerToUpdate=totalPower;

setTable(wiztabel_height);
tableid++;    
active=0;
totalPower =0;

}


function setTable(wiztabel_height){
	var datatableid='#wiztable'+tableid;
	$(datatableid).DataTable( {
		 
		scrollY: wiztabel_height

	} );

	var datatablewrapperid= datatableid+'_wrapper';
	$(datatablewrapperid).css("margin-top", "10px");
 $("#loader").hide();
		
}

// function to update total price pool value in topbar according to emitted value

function updatePrizePool(pricePool){

	var priceAmount = parseFloat((pricePool/1000)*0.9).toFixed(3);

	$("#total_prize").text("Total Prize Pool: "+priceAmount);

}

// function to fetch wizard details from alchemy api

function getwizdetails(){
$("#loader").show();

  
   $.ajax({

	url: alchemyLink,
	beforeSend: function(xhr) { 
		xhr.setRequestHeader("x-api-token", apiToken); 
		xhr.setRequestHeader("x-email",apiEmail);
		xhr.setRequestHeader("contentType","application/json");
	},
	type: 'GET',
	contentType: 'application/json',
	success: function (data) {
		$("#loader").show();

		inserwizintable(data.wizards);
		wizarray=data.wizards;

		// console.log(data.wizards.length,"length");
		
$("#loader").hide();

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
		// console.log("bet",bet,"bet_value",bet_value);
		

		App.placeBetOnWizard(web3.eth.accounts[0],wizid,bet_value,parseInt(wizPower/1000000000000),totalPowerToUpdate,wizarray.length,activeToUpdate,{from: App.account,value: web3.toWei(bet,'ether')});
	}
	// showNotification(wizid);

}


function popWinner(winingWizard,winingAmount,winnerAddress){

	var innerText='<tr><th style="padding:24px">Wizard ID</th><th class="text-center" style="padding:24px">Better Address</th><th class="text-center" style="padding:24px">Prize Amount</th></tr><tr><td class="text-center">'+winingWizard+'</td><td class="text-center">'+winnerAddress+'</td><td class="text-center">'+winingAmount+'</td></tr>';
	$("#winner_details").append(innerText);
	$("#showWinner_btn").click();

}


function updatetable(emitteddetails){
	// console.log(emitteddetails,"emited");
	
}




$(document).on('load',function(){
	$('[data-toggle="tooltip"]').tooltip();
});


function resetTable(){

	getwizdetails();
	
}




function myFunction(){
	  $("#userNotificationText").html('');
	  $("#notificationinfo").hide();
	  // console.log("hit");
}
//To get the tournament status:





// To detect change in network and account


	var account1 = web3.eth.accounts[0];
	var accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account1) {
	account1 = web3.eth.accounts[0];
	location.reload();
  }
}, 100);








