pragma solidity >=0.4.22 <0.6.0;
contract BigGamble {
   
    uint256 public numberOfBets;
    uint256 public totalBetAmountPlaced;
    struct bettor {
        uint selectedWizardId;
        address payable player;
        uint betAmt;
        uint wizardPower;
        uint betTimeStamp;
        uint powerRation;
        uint wizardRatio;
        uint standardizedBet;
        uint sSB;
       
    }
    bettor[] public bettorInfo;
    event detailsOnLoad(uint wizardId,uint totalBetters,uint wizardTotalBet,uint totalBetPlaced);
    event finalWinner(uint wizardId,uint transferAmount,address playerAddress);
    // Address of the player and => the user info
    mapping (uint => bettor[]) getInfo;
   
    // address of the developer to receive developer commission.
    address payable developer = 0x3D368Ece05FaD793f7794e0D79cA349b458271fB;
    constructor() public{
       
    }
   
    function checkPlayerExists(address playerAddress) public view returns(bool){
      for(uint256 i = 0; i < bettorInfo.length; i++){
         if(bettorInfo[i].player == playerAddress) return true;
      }
      return false;
   }
   
    function joinTournamentByBet(address payable userAddress,uint selectedWizard, uint betAmt,uint wizardPower,uint tPWizards,uint wizardSOT,uint wizardTOB) public payable{
       
       
        // Need to add wizard information..
        bettor memory bInfo = bettor(0,address(0),0,0,0,0,0,0,0);
        bInfo.player = userAddress;
        bInfo.betAmt = betAmt;
        totalBetAmountPlaced += betAmt;
        bInfo.selectedWizardId = selectedWizard;
        bInfo.wizardPower = wizardPower;
        bInfo.betTimeStamp = now;
        bInfo.powerRation = calculatePowerRatio(wizardPower,tPWizards);
        bInfo.wizardRatio = calculateWizardRatio(wizardSOT,wizardTOB);
        bInfo.standardizedBet = calculateStandardizedBet(betAmt,bInfo.powerRation,bInfo.wizardRatio);
        if (checkPlayerExists(userAddress)){
           
          bInfo.sSB += bInfo.standardizedBet;  
        }
        else{
           bInfo.sSB = 0;
           
        }
       
        getInfo[selectedWizard].push(bInfo);
        bettorInfo.push(bInfo);
        uint totalBetAmountOnThisWizard = calculateTotalBetAmoutnOnThisWizard(bInfo.selectedWizardId);

        emit detailsOnLoad(bInfo.selectedWizardId,bettorInfo.length,totalBetAmountOnThisWizard,totalBetAmountPlaced);

    }
    function calculateWizardRatio(uint wizardSOT,uint wizardTOB) public pure returns(uint){
        uint twizardRatio = wizardTOB/wizardSOT;
        return twizardRatio;
    }

    function calculatePowerRatio(uint wizardPower,uint tPWizards) public pure returns(uint){
         uint tpowerRatio = tPWizards/wizardPower;

        return tpowerRatio;

    }
   
    function calculateStandardizedBet(uint betAmt,uint powerRatio,uint wizardRatio) public pure returns(uint){
       
        return betAmt*powerRatio*wizardRatio;
    }
   
    function calculateTotalBetAmoutnOnThisWizard(uint wizardId) public view returns(uint) {
        uint totalBetOnthisWizard;
        for (uint i = 0;i< getInfo[wizardId].length-1;i++){
         totalBetOnthisWizard += getInfo[wizardId][i].betAmt;
        }
        return totalBetOnthisWizard;
    }

    function distributePrizeMoney(uint wizardId) public payable{

        uint total_ether = totalBetAmountPlaced; //
        //commision
        uint commision = (total_ether*10)/100;
        //Reward for players to split
        uint total_rewards = total_ether - commision;

        for (uint i=0;i< getInfo[wizardId].length-1;i++){
            uint256 transferAmount = total_rewards*(getInfo[wizardId][i].standardizedBet/getInfo[wizardId][i].sSB);
          getInfo[wizardId][i].player.transfer(transferAmount*10000000);
          emit finalWinner(wizardId,transferAmount,getInfo[wizardId][i].player);
        }
        developer.transfer(commision*1000000000000000);
       
       
    }
   
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
   
   
}