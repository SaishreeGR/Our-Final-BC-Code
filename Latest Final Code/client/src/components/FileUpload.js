import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./FileUpload.css";

// when we submit this gets called handleSubmit-through pinata submit our file
// retrieveFile help to retrieve the file
const FileUpload=({contract,account,provider})=>{


    const [file,setFile]=useState(null);
    const [fileName,setFileName]=useState("No file selected")

    //Encryption function using AES encryption
    const encryptFile=(file)=>{
        const reader=new FileReader();
        
        reader.onloadend=()=>{
            
            const fileData=reader.result;
            const encryptedData=CryptoJS.AES.encrypt(fileData,"encryption-key").toString();
            
            const encryptedFile=new File([encryptedData],file.name);
            
            setFile(encryptedFile);
        };
        reader.readAsDataURL(file);
    };
    //!account-if account is not there it won't run
    // functionality-we need to interact with pinata for that we need to install library axios(for uploading image)
    //whatever filename we uploaded it gets displayed so only below span code
    const handleSubmit=async(e)=>{
        e.preventDefault();//to prevent reload when we submit form
        if(file)
        //when we upload to pinata there is a chance of getting errors
        try {
            const formData=new FormData();//creating object and through this we ares sending file to Pinata
            formData.append("file",file);//key value pair--attaching file(appending file) 
            //below code makes sure that our image gets stored in pinata
            const resFile = await axios({//we use axios for connection
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                  pinata_api_key: `b22b0ab0607d724f1249`,
                  pinata_secret_api_key: `b0aace6abde3d4fdc84071ff256f6d5d2e8c43175d1ab9250fbec49a61f41c03`,
                  "Content-Type": "multipart/form-data",
                },
              });//the above code will store form data in IPFS using pinata as a service
              //Now we need to collect image hash

              const ImgHash=`ipfs://${resFile.data.IpfsHash}`;// to contain image hash, fetching from ipfs
              //const signer=contract.connect(provider.getSigner()); -storing imghash in bc by add(), as  we already have signer no need to redefine it
              contract.add(account,ImgHash);//add() in sc and passing connected account with imghash
              alert("Successfully file uploaded");
              //after uploading setting file to null so that we can upload another image
              setFileName("No file selected")
              setFile(null)

            
        } catch (e) {
            alert("Unable to upload file to Pinata");
        }
        
    }
    //fetches image data,functionality-image will be in png format so if it is in data format we can easily upload,retrieve and fetch filename also
    const retrieveFile=(e)=>{//capturing event(onchange-runs when we choose file)
        // e.target.files is an object that contains the details of files selected to be uploaded in a form.
        const data=e.target.files[0];//getting files data, files array of files object(which has many properties)
        // whatever file we are selecting we are getting its full information(name,last modified)
        // console.log(data);//to use this data pass it to handleSubmit
        // const reader=new window.FileReader();//help with filereading
        // reader.readAsArrayBuffer(data);//read contents of file
        // reader.onloadend=()=>{//after file read has completed
        //     setFile(e.target.files[0]);//setting the file
        // }
        encryptFile(data);//Encrypt the file before setting it
        setFileName(data.name);//setting filename by accessing file name
        e.preventDefault();//so that reload wont occur
        //if we are not specifying 0th index it is not performing operations like setfilename

    };
    
    
    
    return <div className="top">
    <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">Choose File</label>
        <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile}/>
        
        <span className="textArea">File:{fileName}</span>
        <button type="submit" className="upload" disabled={!file}>Upload File</button>
    
    
    </form>
    </div>
}
export default FileUpload;

/*If file comes it gets uploaded to ipfs through pinata and getting imagehash and calling function which needs two arguments


Our upload button is all time active even though we didn't select any image so disable it, until file is set it will be disabled only */