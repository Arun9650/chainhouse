import React, { useContext, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../constants/ContractAddress";
import { abi } from "../constants/ABIcontract";
import { useRouter } from "next/router";
import { RoleContext } from "../context/RoleContext";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { getAddress } from "viem";

const LandInfoTable = () => {
  const { role } = useContext(RoleContext);

  const [landsData, setLandsData] = useState([]);

  const router = useRouter();

  const data = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getLandsCount",
  });
  console.log(Number(data.data));

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
        setLandsData(landsData);
      };

      fetchLandInfo();
    }
  }, [data.data]);

  console.log(landsData);

  const lands = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "lands",
    args: [1],
  });

  console.log(lands.data);

  const state = useContractRead({
    address: ContractAddress,
    functionName: "getState",
    args: [1],
    abi: abi,
  });

  const Area = useContractRead({
    address: ContractAddress,
    functionName: "getArea",
    args: [1],
    abi: abi,
  });

  const City = useContractRead({
    address: ContractAddress,
    functionName: "getCity",
    args: [1],
    abi: abi,
  });

  const Price = useContractRead({
    address: ContractAddress,
    functionName: "getPrice",
    args: [1],
    abi: abi,
  });

  const PID = useContractRead({
    address: ContractAddress,
    functionName: "getPID",
    args: [1],
    abi: abi,
  });

  const SurveyNumber = useContractRead({
    address: ContractAddress,
    functionName: "getSurveyNumber",
    args: [1],
    abi: abi,
  });

  const sellerId = useContractRead({
    address: ContractAddress,
    functionName: "getSeller",
    abi: abi,
  });


  const requestLand = async (index) => {
    console.log("🚀 ~ requestLand ~ index:", index)
    try {
    
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "requestLand",
      args: ['0x754aCB4D766809c791d5A71bDCb589F5951dC873', 1],
    });

    const { hash } = await writeContract(request);  
  } catch (error) {
    console.log(error);
  }
  };

  if (!state.data) {
    return (
      <div>
        <h1>Loading</h1>
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
            {landsData.map((land, index) => (
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
                        onClick={() => requestLand(land[0])}
                        className="bg-blue-600 w-32 px-3 py-3 text-white rounded-xl"
                      >
                        Request Land
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* </tr> */}
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
