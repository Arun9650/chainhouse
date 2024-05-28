import React, { useEffect, useState } from "react";
import Layout from "../../components/LayoutLandInspector";
import Link from "next/link";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import { prepareWriteContract, writeContract, readContracts, waitForTransaction} from "@wagmi/core";
import { shortenAddress } from "../../utils";
import { Button } from "../../components/components/ui/button";
import toast from "react-hot-toast";

const SellerProfile = () => {
  const [mounted, setMounted] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const {data : sellerList} = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSellers",
  });



  

  const verify = async (SellerAddress) => {
    try {
     setLoadingVerify(true);
      const { request } = await prepareWriteContract({
        address: ContractAddress,
        abi: abi,
        functionName: "verifySeller",
        args: [SellerAddress],
      });
  
      const { hash } = await writeContract(request);
  
      const txwait =  await waitForTransaction({hash});
  
      console.log("🚀 ~ verify ~ hash:", hash);
  
      await toast.promise(
        txwait,
        {
          loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
        }
      ) 
      setLoadingVerify(false);
    } catch (error) {
      setLoadingVerify(false);
      console.log("🚀 ~ verify ~ error:", error);
      if(error.shortMessage == 'User rejected the request.'){
        toast.error('Transaction rejected by user');
      }
      
      else{
        toast.error(error.shortMessage);
      }
      
    }

  };

  const reject = async (SellerAddress) => {
    setLoadingReject(true);
    try {
      const { request } = await prepareWriteContract({
        address: ContractAddress,
        abi: abi,
        functionName: "rejectSeller",
        args: [SellerAddress],
      });
  
      const { hash } = await writeContract(request);
  
      const txwait =  await waitForTransaction({hash});
  
      console.log("🚀 ~ verify ~ hash:", hash);
  
      await toast.promise(
        txwait,
        {
          loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
        }
      )
      setLoadingReject(false);
    } catch (error) {
      setLoadingReject(false)
      console.log("🚀 ~ reject ~ error:", error);

      if(error.shortMessage == 'User rejected the request.'){
        toast.error('Transaction rejected by user');
      }
      
      else if(error.shortMessage){
        toast.error(error.shortMessage);

      }

      else{
        toast.error(error);
      }
      
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (sellerList) {
      const buyerInfo = async () => {
        if (sellerList) {
          const arrayLength = sellerList.length;
          const dynamicArray = Array.from({ length: arrayLength }, (v, i) => i);

          const array = dynamicArray.map((element, index) => {
            const data = readContracts({
              contracts: [
                {
                  address: ContractAddress,
                  abi: abi,
                  functionName: "getSellerDetails",
                  args: [sellerList[index]],
                },
                {
                  address: ContractAddress,
                  abi: abi,
                  functionName: "isSellerVerified",
                  args: [sellerList[index]],
                },
              ],
            });

            return data;
          });

          const data = await Promise.all(array);

          const updatedData = data.map((buyer, index) => {
            return [...buyer, sellerList[index]];
          });
          // setBuyerData(updatedData);

          const updatedArray = updatedData.map((subArray) => {
            // Extract the result array from the first object
            const resultArray = subArray[0].result;

            // Extract the result property from the second object
            const isVerified = subArray[1].result;

            // Get the last element in the sub-array
            const address = subArray[2];

            // Create a new object with the updated result array
            const updatedObject = {
              result: [...resultArray, isVerified, address],
            };

            // Return the updated sub-array
            return [updatedObject];
          });

          setSellerData(updatedArray);
        }
      };

      buyerInfo();

    }
  }, [ sellerList]);



  return (
    <Layout>
       <table className="w-full ">
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Aadhar Card No</th>
        <th>PAN Card No</th>
        <th>Owned Lands</th>
        <th>Aadhar Card Image</th>
        <th>Is Verified</th>
        <th>Address</th>
        <th>verify</th>
        <th>reject</th>
      </tr>
    </thead>
    <tbody>
  {mounted &&
    sellerData.map((item, index) => {
      const result = item[0].result;

      return (
        <tr key={index}>
          <td className="text-center">{result[0]}</td>
          <td className="text-center">{Number(result[1])}</td>
          <td className="text-center">{result[2]}</td>
          <td className="text-center">{result[3]}</td>
          <td className="text-center">{result[4]}</td>
          <td className="text-center"><Link href={`https://ipfs.io/ipfs/${result[5]}`} target="_blank">Click here</Link></td>
          <td className="text-center">{result[6] ? 'Yes' : 'No'}</td>
          <td className="text-center">{shortenAddress(result[7])}</td>
          <td className="text-center">
            <Button onClick={() => verify(result[7])}>
              {
                loadingVerify ? ( <div className="flex items-center justify-between gap-4">
                  <svg className="animate-spin h-5 w-5  text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
                </div> ) : "Verify"
              }
            </Button>
          </td>
          <td className="text-center">
            <Button  onClick={() => reject(result[7])}>
            {
                loadingReject ? ( <div className="flex items-center justify-between gap-4">
                  <svg className="animate-spin h-5 w-5  text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
                </div> ) : "Reject"
              }
            </Button>
          </td>
        </tr>
      );
    })}
</tbody>
  </table>
    </Layout>
  );
};

export default SellerProfile;
