import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import {
  prepareWriteContract,
  writeContract,
  readContract,
  waitForTransaction,
} from "@wagmi/core";
import { shortenAddress } from "../../utils";
import toast from "react-hot-toast";

const RequestLand = () => {
  const [requestDetails, setRequestDetails] = useState([]);
  const [mounted, setMounted] = useState(false);
  console.log("🚀 ~ RequestLand ~ requestDetails:", requestDetails);

  const buyerId = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getBuyer",
    // args: [address],
  });

  const requestDetials = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getRequestDetails",
    args: [1],
  });
  const getRequestsCount = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getRequestCount",
    // args: [1],
  });

  console.log("🚀 ~ RequestLand ~ getRequestsCount:", getRequestsCount);

  useEffect(() => {
    if (getRequestsCount.data) {
      const arrayLength = Number(getRequestsCount.data);
      const dynamicArray = Array.from({ length: arrayLength }, (v, i) => i + 1);
      console.log("🚀 ~ useEffect ~ dynamicArray:", dynamicArray);

      const fetchLandInfo = async () => {
        const landPromises = dynamicArray.map((index) =>
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "getRequestDetails",
            args: [index],
          })
        );

        const landsData = await Promise.all(landPromises);
        console.log("🚀 ~ fetchLandInfo ~ landsData:", landsData);
        // setBuyerData(landsData,buyerAddresses.data[0]);
        // console.log(buyerData);
        // const updatedBuyerData = landsData.map((buyer, index) => {
        //     return [...buyer, buyerAddresses.data[index]];
        // });
        setRequestDetails(landsData);
      };

      setMounted(true);
      fetchLandInfo();
    }
  }, [getRequestsCount.data]);

  console.log("🚀 ~ RequestLand ~ requestDetials:", requestDetials);
  const sellerId = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSeller",
    // args: [address],
  });

  const approve = async (index) => {
    console.log("🚀 ~ approve ~ index:", index);
    try {
      const { request } = await prepareWriteContract({
        address: ContractAddress,
        abi: abi,
        functionName: "approveRequest",
        args: [index],
      });

      const { hash } = await writeContract(request);

      const txhash = waitForTransaction({ hash: hash });

      toast.promise(txhash, {
        loading: "Approving Request...",
        success: <b>Request Approved Successfully</b>,
        error: <b>Request Not Approved</b>,
      });
    } catch (error) {
      console.log("🚀 ~ approve ~ error:", error);
      if (error.shortMessage == "User rejected the request.") {
        toast.error(error.shortMessage);
      } else {
        toast.error(error);
      }
    }
  };

  // console.log('buyerId', buyerId);

  return (
    <Layout>
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th>#</th>
            <th>BuyerID</th>
            <th>Land ID</th>
            <th>Request Status</th>
            <th>Approve Request</th>
          </tr>
        </thead>
        <tbody>
          {requestDetails && requestDetails.length === 0 && (
            <tr>
              <td colSpan="5">No Request Found</td>
            </tr>
          )}
          {mounted &&
            requestDetails.map((item, index) => (
              <tr key={index}>
                <td>{shortenAddress(item[0])}</td>
                <td>{shortenAddress(item[1])}</td>
                <td>{Number(item[2])}</td>
                <td>{item[3] ? "True" : "False"}</td>
                <td className="flex ">
                  <button
                    className="px-5 p-3  bg-blue-500 rounded-md text-white flex "
                    onClick={() => approve(index)}
                  >
                    {item[3] ? "Approved" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default RequestLand;
