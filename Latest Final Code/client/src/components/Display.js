import { useState } from "react";
import axios from 'axios';
import CryptoJS from "crypto-js";
import "./Display.css"

// whatever images are there it should display in list
// input is user specific which is what address data they need to see
// through button we call function by which we can get data
// when another account which don't have access call get data we get error:you don't have access so we write it in try catch block
const Display=({contract,account})=>{
    //to set data
    const [decryptedData,setDecryptedData]=useState([])// initialize with useState
    
    
    const fetchAndDecryptFile = async (url,encryptionKey) => {
      try {
        const response = await axios.get(url);
  
        if (response.status === 200) {
          const encryptedContent = response.data;
          
  
          const decryptedBytes = CryptoJS.AES.decrypt(
            encryptedContent,
            encryptionKey
          );
  
          const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
          console.log("Decrypted text:",decryptedText);
          return decryptedText;
          
        } else {
          console.log('Failed to fetch the file from IPFS.');
        }
      } catch (error) {
        console.log('Error fetching and decrypting the file:', error);
      }
    };
   
    const getdata=async()=>{
      let dataArray;// as display() returns array
      const Otheraddress=document.querySelector(".address").value;//fetching the address value which user has given input
      try{
      if(Otheraddress){
        //if Otheraddress is present then 
        dataArray=await contract.display(Otheraddress)//Iam calling address related data
        console.log(dataArray);
      }else{
        dataArray=await contract.display(account);//display connected account data 
      }
    }
    catch(e){
        alert("You don't have access");// as require throws error
    }
      //if url is not there
      const isEmpty= Object.keys(dataArray).length===0;
      if(!isEmpty){
        //if it is not empty
        const str= dataArray.toString();//values are in object form so converting to string
        const str_array=str.split(","); // as string will be concatenated so we are splitting it
        // console.log(str);-->ipfs://qweehdh,ipfs://gyjnb
        //                                0              1
        // console.log(str_array);['ipfs://qweehdh','ipfs://gyjnb']
        /* we are using hyperlink to display images, in react we need to provide key -i which is iterator
        https://gateway.pinata.cloud/ipfs/${item}-->default url to access ipfs
        ${item.substring(6)} why? as in link ipfs://qweehdh we only need qweehdh becoz in default url we are inside ipfs only*/
        
        const decryptedDataArray=[];
        for(let i=0;i<str_array.length;i++){
          const ipfsHash=str_array[i].substring(6);
          const url=`https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          const encryptionKey='encryption-key';

          const decryptedText=await fetchAndDecryptFile(url,encryptionKey);
          decryptedDataArray.push(decryptedText);
        }
        setDecryptedData(decryptedDataArray);
        
       
        openFilesInNewTab(decryptedDataArray);
        
      }else{
        alert("No image to display");
      }
    };

    const openFilesInNewTab = (files) => {
      const newTab = window.open("", "_blank");
      newTab.document.write(`
      <html>
      <head>
      <title>Decrypted Files</title>
      <style>
      .center-button{
              display:flex;
              justify-content:center;
              align-items:center;
              background-color:#f04d4d;
              color:#fff;
              border:none;
              padding:10px 20px;
              border-radius:5px;
              font-size:16px;
              cursor:pointer;
              margin-top:10px;
            }
            .center-button:hover{
              background-color:#e53e3e;
            }
            a{
              text-decoration:none;
            }
      </style>
      <body>
      <h1>Decrypted Files</h1>`);

      files.forEach((file, index) => {
        
        const base64Data = file;
        const decodedText = atob(base64Data.split(',')[1]);

        console.log(decodedText);

        const fileType='text/plain';
        const fileName=`Decrypted_File_${index+1}.txt`;
        const fileBlob =new Blob([decodedText],{type:fileType});
        const fileUrl=URL.createObjectURL(fileBlob);
        newTab.document.write(
          `<a href="${fileUrl}" classname="Link" target="_blank" download="${fileName}"><button class="center-button" onClick="window.open('${fileUrl}')">Open File ${index+1}</button>
          
          </a><br>
          `
        );
      });

      
      newTab.document.write(`</body></html>`);
      newTab.document.close();
    };
    
   
    
    
    
        
    //in below we have given {data} so all the images are set into this variable so it will display the images
    return(
   
    <>
    
    <input type="text" placeholder="Enter address" className="address"></input>
    <button className="center button" onClick={getdata}>Get Data</button>

    </>
    );
    
    
  };
    
    

export default Display;

/* we need to call display() in sc for that we need access to get data , fetch url from the users account */