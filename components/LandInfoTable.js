import React, { useContext, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../constants/ContractAddress";
import { abi } from "../constants/ABIcontract";
import { useRouter } from "next/router";
import { RoleContext } from "../context/RoleContext";
import { prepareWriteContract, writeContract, readContract, waitForTransaction } from "@wagmi/core";
import toast from "react-hot-toast";

const LandInfoTable = () => {
  
  const { role } = useContext(RoleContext);

  const [landsData, setLandsData] = useState([]);
  console.log("🚀 ~ LandInfoTable ~ landsData:", landsData)
  const [loading, setLoading] = useState(new Array(landsData.length).fill(false));
  

  const router = useRouter();

  const data = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getLandCount",
  });


  const {data : isLandRequestedMapping} = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "isLandRequestedMapping",
    args: [1],
  })



  const {data : seller} = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSellers",
  })




  useEffect(() => {
    if (data.data) {
      const arrayLength = Number(data.data);
      const dynamicArray = Array.from({ length: arrayLength }, (v, i) => i + 1);

      const fetchLandInfo = async () => {
        const landPromises = dynamicArray.map((index) =>
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "lands",
            args: [index],
          })
        );

        const landsData = await Promise.all(landPromises);
  


        const isLandRequested = dynamicArray.map((index) => 
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "isLandRequestedMapping",
            args: [index],
          })
  
        )

        
        const isLandRequestedArray = await Promise.all(isLandRequested);
        
        console.log(landsData)
        console.log(isLandRequestedArray)

        const combinedData = landsData.map((item, index) => {
          return {...item, isRequested: isLandRequestedArray[index]};
        });
        
        console.log(combinedData);

        setLandsData(combinedData);
      };

      fetchLandInfo();
    }
  }, [data.data]);

  // console.log(landsData);




  const requestLand = async (land, index) => {
    console.log("🚀 ~ requestLand ~ land:", land)
    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });
    console.log("🚀 ~ requestLand ~ index:", index)
    try {
    
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "requestLand",
      args: [seller[0], Number(land)],
    });

    const { hash } = await writeContract(request);

    
    const txhash = waitForTransaction({hash: hash});

    console.log(txhash);

    toast.promise(txhash, {
      loading: "Waiting for transaction to complete",
      success: "Transaction completed successfully",
      error: "Transaction failed",
    })

    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });

  } catch (error) {

    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
    if(error.shortMessage === 'User rejected the request.'){
      toast.error('Transaction rejected by user');
    }
    else {
      toast.error(error.shortMessage);
    }
    console.log(error);
  }
  };

  if (!landsData) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className=" divide-y my-3">
        <h1 className="font-bold underline text-2xl mb-4">Land Info</h1>
        <table className="w-full divide-y ">
          <thead className="text-left h-16  ">
            <th>#</th>
            <th>Area</th>
            <th>City</th>
            <th>State</th>
            <th>Price</th>
            <th>Property PID</th>
            <th>Survey Number</th>
            {role === "Buyer" && (
              <>
                <th>Request Land </th>
              </>
            )}
          </thead>
          <tbody>
           
            {!landsData && <td>Loading...</td>}
            {landsData.length === 0 && <td>No records</td>}
            {landsData.length > 0 &&  landsData.map((land, index) => (
              <tr key={index}>
                <td>{land[0].toString()}</td>
                <td>{land[1].toString()}</td>
                <td>{land[2]}</td>
                <td>{land[3]}</td>
                <td>{land[4].toString()}</td>
                <td>{land[5].toString()}</td>
                <td>{land[6].toString()}</td>
                {role === "Buyer" && (
                  <>
                    <td>
                      <button
                        onClick={() => requestLand(land[0], index)}
                        className={` ${  land.isRequested ?  "bg-yellow-500" : "bg-blue-500"}  w-32 px-3 py-3 text-white rounded-xl`}
                      >
                        {land.isRequested ? "Requested" : (
                          <div>
                           {loading[index] ? "Loading..." : "Request Land"}
                          </div>
                        )}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

          </tbody>
          
        </table>
      </div>
      <div className="flex flex-col gap-6 mt-10 border w-60 rounded-lg p-3 bg-slate-50">
        <h1>View Images of all Lands!</h1>
        <button
          onClick={() => router.push("/AllImages")}
          className="bg-blue-600 w-32 px-3 py-3 text-white rounded-xl"
        >
          View Images
        </button>
      </div>
    </>
  );
};

export default LandInfoTable;
