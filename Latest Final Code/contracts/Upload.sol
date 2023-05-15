//we dont have any database and our smart contract is our db, bc is our db so we are dependent on this whatever information we have to upload it to smart contract
// SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 < 0.9.0;

contract Upload{
    //0xqwerty
    // which user has access(given by 0xqwerty) that will be stored
    struct Access{
      address user; // which this user 0xqwerty wants to share image
      bool access;//true or false
    }
    /* Mapping with array
    mapping(address=>string[])value;
    Each address will be an array(should be dynamic) with its images (url store-string), which is whatever image we are 
    upload to ipfs network that url link should be stored in sc */

    
    /* Mapping
    mapping(address=>Access[]) accessList;
    Access has two variables user, access (all this struct will be stored in array) 
    whomever 0xqwerty has given access will be maintained in the list and if we fetch in our sc we can find who has access */


    /* Nested Mapping
    mapping(address=>mapping(address=>bool))ownership;
    its like 2d array
    ownership[address1][address2]=true--> if address1 has given access to address2 it is true
    Both this(2d array form checking) and above(structure form checking) almost does same why two time - later in video*/

    mapping(address=>string[])value;
    mapping(address=>mapping(address=>bool))ownership;
    mapping(address=>Access[])accessList;
    mapping(address=>mapping(address=>bool))previousData;// stores previousdata info, we are using node js not any other server and bc is dependent on its previous so we are storing it in bc , if use node js we can store it in server but it is bc oriented so we need to store in bc-why later in video


    // function through which user adds url or image
    function add(address _user,string memory url) external{
       value[_user].push(url);//dynamic array so pushing the url 
    }

    // function to allow access
    function allow(address user) external{
        ownership[msg.sender][user]=true;

        /*  say initially we disallowed access and then if we want to allow access it adds the user which is already existing which shouldn't be 
        so this is where previousdata comes into picture*/

        if(previousData[msg.sender][user]){
            for(uint i=0;i<accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user==user){
                    accessList[msg.sender][i].access=true;
                }
            }
        }else{
            //at first previous data will be false so this runs and make previousdata to be true so that next time only access value gets updated and user is not pushed to array
            accessList[msg.sender].push(Access(user,true));
            previousData[msg.sender][user]=true;
        }

        //whomever we are given access that needs to be stored in AccessList
        // accessList[msg.sender].push(Access(user,true));--> written in else improvised-pushing the structure to array

    }

    // function to disallow
    function disallow(address user) public{
        ownership[msg.sender][user]=false;
        // we need to maintain this info also in accessList
        for(uint i=0;i<accessList[msg.sender].length;i++){
            if(accessList[msg.sender][i].user==user){
                accessList[msg.sender][i].access=false;
            }
            // we cant delete array element since its bc so we are giving access false
        }
    }

    // function to display the images 
    function display(address _user) external view returns(string[] memory){
      // first we need to check whether we have access to view data
      require(_user==msg.sender||ownership[_user][msg.sender],"You don't have access");
      return value[_user];//if true display data
    }

    //function for share access-->fetch the list whom we have shared with
    function shareAccess() public view returns(Access[] memory){
        return accessList[msg.sender];
    }
}

    /* Simple explanation:
    
    I want to give access to def ownership becomes true and previousdata is false initially so def got access which is in else part and previousdata is set to true
    
    Now I am andry with def so i want to disallow the access so we are finding def through loop and setting access as false
    
    And if we want to again give access this time previousdata will be true and simple access will be set to true
    
    Then we have display()*/


