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
    event detailsOnLoad(uint wizardId,uint totalBetters,uint wizardTotalBet,uint totalBetAmountPlaced);
    // Address of the player and => the user info
    mapping (uint => bettor[]) getInfo;
   
    // address of the developer to receive developer commission.
    address payable developer = 0xb3e94487b8C4eF9169Ebc2b9672a3222b8df401f;
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
        bInfo.powerRation = calculatePowerRation(wizardSOT,wizardTOB);
        bInfo.wizardRatio = calculateWizardRation(wizardPower,tPWizards);
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
    function calculatePowerRation(uint wizardSOT,uint wizardTOB) public pure returns(uint){
        uint tpowerRatio = wizardTOB/wizardSOT;
        return tpowerRatio;
    }
   
    function calculateWizardRation(uint wizardPower,uint tPWizards) public pure returns(uint){
         uint twizardRatio = tPWizards/wizardPower;
       
        return twizardRatio;
       
    }
   
    function calculateStandardizedBet(uint betAmt,uint powerRatio,uint wizardRatio) public pure returns(uint){
       
        return betAmt*powerRatio*wizardRatio;
    }
   
    function calculateTotalBetAmoutnOnThisWizard(uint wizardId) public view returns(uint) {
        uint totalBetOnthisWizard;
        for (uint i = 0;i< getInfo[wizardId].length;i++){
         totalBetOnthisWizard += getInfo[wizardId][i].betAmt;
        }
        return totalBetOnthisWizard;
    }
   
    function distributePrizeMoney() public payable{
       
        uint total_ether = totalBetAmount; //
        //commision
        uint commision = (total_ether*10)/100;
        //Reward for players to split
        uint total_rewards = total_ether - commision;
       
        for (uint i=0;i< bettorInfo.length;i++){
            uint256 transferAmount = total_rewards*(bettorInfo[i].standardizedBet/bettorInfo[i].sSB);
            bettorInfo[i].player.transfer(transferAmount*10000000);
        }
        developer.transfer(commision*1000000000000000);
       
       
    }
   
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
   
   
}