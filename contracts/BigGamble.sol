pragma solidity >=0.4.22 <0.6.0;
contract BigGamble{

    bool public prizeDistributed = false;
 
    uint256 public numberOfBets;
    uint256 public ethToWei = 1000000000000000000;
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
    bettor[] private bettorInfo;
    
    struct winnerDetails {
        bool claimStatus;
        address payable winnerAddress;
        uint winningAmt;
    }
   // winnerDetails[] public winnerDets;
    mapping (address => winnerDetails) private winnerInfo;
    address[] private winnerAddresses;
    event detailsOnLoad(uint wizardId,uint totalBetters,uint wizardTotalBet,uint totalBetPlaced,address player, uint betAmountOnwizard);

    event finalWinner(uint wizardId,uint transferAmount,address playerAddress);
   
    event returnValue(uint remainder,uint quotient);
    // Address of the player and => the user info
    mapping (uint => bettor[]) private getInfo;

    event throwWizardInfo(uint wizardId,uint wizardTotalBet);
    // address of the developer to receive developer commission.
    address payable private developer = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C;
    constructor() public{
       
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) 
    {
    uint256 c = a * b;
    require(a == 0 || c / a == b);
    return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) 
    {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    require(b>0);
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) 
    {
    assert(b <= a);
    return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) 
    {
    uint256 c = a + b;
    require(c >= a);
    return c;
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
        bInfo.powerRation = percent(tPWizards,wizardPower,2);
        bInfo.wizardRatio = percent(wizardTOB,wizardSOT,2);
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

        emit detailsOnLoad(bInfo.selectedWizardId,getInfo[selectedWizard].length,totalBetAmountOnThisWizard,totalBetAmountPlaced,bInfo.player,bInfo.betAmt);

    }
    function calculateWizardRatio(uint wizardSOT,uint wizardTOB) public pure returns(uint){
        uint twizardRatio = div(wizardTOB,wizardSOT);
        return twizardRatio;
    }

    function getDivided(uint numerator, uint denominator) public {
       uint quotient  = numerator / denominator;
       uint remainder = numerator - denominator * quotient;
        emit returnValue(remainder,quotient);
    }

    function percent(uint numerator, uint denominator, uint precision) public pure returns(uint quotient) {

         // caution, check safe-to-multiply here
	uint256 pre = add(precision,1);
//	require(pre > 0);
	uint256 mulNo = 10;
	uint256 Exponentiation= mulNo**uint256(pre);
	uint _numerator  = mul(numerator,Exponentiation);
        // with rounding of last digit
	uint256 div_numerator = div(_numerator , denominator);
	uint256 add_number = add(div_numerator,5);
	uint _quotient =  div(add_number,10);
       // uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }

    function calculatePowerRatio(uint wizardPower,uint tPWizards) public pure returns(uint){
         uint tpowerRatio = div(tPWizards,wizardPower);
        return tpowerRatio;
    }
   
    function calculateStandardizedBet(uint betAmt,uint powerRatio,uint wizardRatio) public pure returns(uint){
       
     //  uint256 result = mod()
         uint256 Ratio = mul(powerRatio,wizardRatio);
	 return mul(betAmt,Ratio);
    }
   
   
    function calculateTotalBetAmoutnOnThisWizard(uint wizardId) public view returns(uint) {
        uint totalBetOnthisWizard;
        for (uint i = 0;i< getInfo[wizardId].length;i++){
         totalBetOnthisWizard += getInfo[wizardId][i].betAmt;
        }
        return totalBetOnthisWizard;
    }
   function calculateSsbFromTournamentWinningWizard(uint wizardId) public view returns(uint) {
       
       uint sumOfAllSsb;
       for (uint i=0;i< getInfo[wizardId].length;i++){
          sumOfAllSsb += getInfo[wizardId][i].standardizedBet;
       }
       return sumOfAllSsb;
   }
   /*
   function returnTournamentWinnerAddress(uint256 wizardId) public view returns(address[] memory , uint[] memory, bool[] memory){
    
    uint sumOfAllSsb = calculateSsbFromTournamentWinningWizard(wizardId);
    uint total_ether = totalBetAmountPlaced*ethToWei; //
        //commision
        uint commision = (total_ether*10)/100;
        //Reward for players to split
        uint total_rewards = total_ether - commision;
    
    address[] memory addrs = new address[](getInfo[wizardId].length);
    uint[] memory winningAmt = new uint[](getInfo[wizardId].length);
    bool[] memory claimStatusChk = new bool[](getInfo[wizardId].length);
    
    for (uint i=0;i<getInfo[wizardId].length;i++){
            require(getInfo[wizardId][i].standardizedBet > 0);
            uint256 getActualAmt = percent(getInfo[wizardId][i].standardizedBet,sumOfAllSsb,2);
            uint256 transferAmount = total_rewards*getActualAmt/100;
            addrs[i] = getInfo[wizardId][i].player;
            winningAmt[i] = transferAmount;
            claimStatusChk[i] = winnerInfo[addrs[i]].claimStatus;
    //      getInfo[wizardId][i].player.transfer(transferAmount);
       //   emit finalWinner(wizardId,transferAmount,getInfo[wizardId][i].player);
        }
    return (addrs, winningAmt, claimStatusChk);
       
   }
   
   function withdrawFunds(uint winningAmt,uint userbalance, address payable winnerPlayerAdrs) public onlyOwner payable returns(bool success) {   
    require(userbalance >= winningAmt); // guards up front
    // balances[msg.sender] -= amount;         // optimistic accounting
    winnerPlayerAdrs.transfer(winningAmt);            // transfer
    winnerInfo[msg.sender].claimStatus = true;
    winnerInfo[msg.sender].winnerAddress = msg.sender;
    winnerAddresses.push(msg.sender);
    return true;
}
*/
    function getContractBalance() public returns(uint256)
    {
        uint256 contractbalval = address(this).balance;//retuns wei
        if(contractbalval>0){
            developer.transfer(contractbalval);
            return contractbalval;
        }else{
            return 0;
        }
    }


    function distributePrizeMoney(uint256 wizardId) public payable{
     require(developer == msg.sender);
     uint sumOfAllSsb = calculateSsbFromTournamentWinningWizard(wizardId);   
    if (getInfo[wizardId].length == 0){
         uint total_ether = totalBetAmountPlaced*1000000000000000000;
        developer.transfer(total_ether);
        prizeDistributed = true;
    }
    else{
         if (!prizeDistributed){
             
        // uint sumOfAllSsb = calculateSsbFromTournamentWinningWizard(wizardId);
        uint total_ether = totalBetAmountPlaced*1000000000000000000; //
        //commision
        uint commision = (total_ether*10)/100;
        //Reward for players to split
        uint total_rewards = total_ether - commision;

        for (uint i=0;i<getInfo[wizardId].length;i++){
            require(getInfo[wizardId][i].standardizedBet > 0);
            uint256 getActualAmt = percent(getInfo[wizardId][i].standardizedBet,sumOfAllSsb,2);
            uint256 transferAmount = total_rewards*getActualAmt/100;
          getInfo[wizardId][i].player.transfer(transferAmount);
          emit finalWinner(wizardId,transferAmount,getInfo[wizardId][i].player);
        }
        developer.transfer(commision);
        
        prizeDistributed = true;
      }
    }
       
    }
   
    function getAllInfoOfAUser(address playerAddress) public 
	{   
       for (uint i = 0;i< bettorInfo.length;i++){
        if (bettorInfo[i].player == playerAddress) {
            emit throwWizardInfo(bettorInfo[i].selectedWizardId,calculateTotalBetAmoutnOnThisWizard(bettorInfo[i].selectedWizardId));
        }
       }
   }

   
}
