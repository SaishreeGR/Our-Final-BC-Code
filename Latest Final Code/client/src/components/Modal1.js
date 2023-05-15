import { useEffect } from "react";
import "./Modal.css";

const Modal1=({setModalOpen1,contract})=>{
    const nosharing=async()=>{
        //fetching address which we gave ip so that we can share data with it
        const address=document.querySelector(".address").value;
        await contract.disallow(address)
    };
    useEffect(()=>{
        const noaccessList=async()=>{
            const addressList=await contract.shareAccess();//calling the shareAccess()
            let select=document.querySelector("#selectNumber");
            const options=addressList;

            for(let i=0;i<options.length;i++){
                let opt=options[i];
                let e1=document.createElement("option");
                e1.textContent=opt;
                e1.value=opt;
                select.appendChild(e1);
            }
        }
        contract && noaccessList();
    },[]);
    return<>
    <div className="modalBackground">
        <div className="modalContainer">
    <div className="title">Deny access to</div>
         <div className="body">
         <input type="text" className="address" placeholder="Enter address"></input></div>
         <form id="myForm">
            <select id="selectNumber">
                <option className="address">People with access</option>
            </select>
         </form>
         <div className="footer">
            <button onClick={()=>{setModalOpen1(false)}} id="cancelBtn">Cancel</button>
            <button onClick={()=>nosharing()}>Deny</button>
         </div>
    
         </div></div>
    </>
}
export default Modal1;