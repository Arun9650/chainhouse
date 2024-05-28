import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import { prepareWriteContract, writeContract, readContract, waitForTransaction } from "@wagmi/core";
import { parseEther, parseGwei } from "viem";
import { shortenAddress } from "../../utils";
import toast from "react-hot-toast";

const Payment = () => {

  const [landsData, setLandsData] = useState([]);
  console.log("🚀 ~ Payment ~ landsData:", landsData)


  const LandOwner = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getLandOwner",
    args: [1],
  });


  console.log('adsf',LandOwner.data);
  const IsLandVerified = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "checkLandVerified",
    args: [1],
  });

  const Price = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getPrice",
    args: [1],
  });


  const isPaid = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "isPaid",
    args: [1],
  });
  const value = Number(Price.data) * (0.0000052);

  const payment = async (sellerAddress, landId) => {
   console.log("🚀 ~ payment ~ landId:", landId)
   console.log("🚀 ~ payment ~ sellerAddress:", sellerAddress)
   try {
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "makePayment",
      args: [sellerAddress, landId],
      value: parseEther('0.0000001'),
    });

    const { hash } = await writeContract(request);
    const txhash = waitForTransaction({ hash: hash });
    console.log(txhash);
    await toast.promise(txhash, {
      loading: "Waiting for transaction to complete",
      success: "Transaction completed successfully",
      error: "Transaction failed",
    })
   } catch (error) {
    console.log(error);
    toast.error(error.shortMessage);
   }
  };

  const data = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getLandCount",
  });



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


        const Owner = dynamicArray.map((index) =>
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "landOwner",
            args: [index],
          })
        )

        const isPaid = dynamicArray.map((index) =>
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "checkPaymentReceived",
            args: [index],
          })
        )
        
        const isLandRequestedArray = await Promise.all(isLandRequested);
        const LandOwnerArray = await Promise.all(Owner);
        const isPaidArray = await Promise.all(isPaid);

        console.log(landsData)
        console.log(isLandRequestedArray)

        const combinedData = landsData.map((item, index) => {
          return {...item, isRequested: isLandRequestedArray[index], Owner: LandOwnerArray[index], isPaid: isPaidArray[index]};
        });
        
        console.log(combinedData);

        setLandsData(combinedData);
      };

      fetchLandInfo();
    }
  }, [data.data]);



  return (
    <Layout>
      <div>
        <h1 className="font-bold">Payment for Lands</h1>
      </div>
      <table className="w-full">
        <thead className="text-left">
          <tr>

          <th>Land Id</th>
          <th>Land Owner</th>
          <th>Price</th>
          <th>Make Payment</th>
          </tr>
        </thead>
        <tbody>
          {
            landsData.filter(land => land.isRequested).map((item, index) => {
              return (
                <tr key={index}>
                  <td>{Number(item[0])}</td>
                  <td>{shortenAddress(item.Owner)}</td>
                  <td>{Number(item[4])}</td>
                  <td>
                    <button
                      disabled={!item.isRequested}
                      onClick={() => payment(item.Owner, Number(item[0]))}
                      className="disabled:bg-gray-400 bg-blue-600 min-w-[120px]  p-3 rounded-lg text-white"
                    >
                      {item.isRequested ? "make payment" : "Make Payment"}
                    </button>
                  </td>
                </tr>
              );
            })}
          {/* <td>1</td>
          <td>{LandOwner?.data?.toString()}</td>
          <td>{Price.data?.toString()}</td>
          <td>
            <button
              disabled={!IsLandVerified.data || isPaid.data}
              onClick={() => payment()}
              className="disabled:bg-gray-400 bg-blue-600 min-w-[120px]  p-3 rounded-lg text-white"
            >
              {isPaid.data ?  "Paid" : (IsLandVerified.data ? "Make Payment" : "Land Not Verified")}
            </button>
          </td> */}
        </tbody>
      </table>
    </Layout>
  );
};

export default Payment;
