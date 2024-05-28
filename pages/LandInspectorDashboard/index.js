import React, { useEffect, useState } from "react";
import Layout from "../../components/LayoutLandInspector";
import { AiOutlineBank } from "react-icons/ai";
import {  FaUsers } from "react-icons/fa";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import Link from "next/link";

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);

  const { data } = useContractRead({
    address: ContractAddress,
    functionName: "getSellerCount",
    abi: abi,
  });

  const { data: data1 } = useContractRead({
    address: ContractAddress,
    functionName: "getBuyerCount",
    abi: abi,
  });

  const { data: requestCount } = useContractRead({
    address: ContractAddress,
    functionName: "requestCount",
    abi: abi,
  });
  console.log(requestCount);

  

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout>
      {mounted && (
        <>
          <div className="border z-50">
            <div className="grid grid-cols-3 gap-2">
              <div className="">
                <div className="flex flex-col items-center pb-3 z-50 gap-4 relative">
                  <div className="absolute    z-50  text-xl">
                    <FaUsers size={50} className="z-50"  />
                  </div>
                  <div className="mt-14 flex flex-col items-center justify-center">
                    <h1>Total Sellers</h1>
                    <p>{Number(data) || 0}</p>
                  </div>
                </div>

                <div className="w-full flex items-center flex-col  justify-center">
                  {/* <h2>Profile</h2> */}

                  <button className="border p-2 rounded-lg bg-blue-500 text-white">
                    <Link href={'/LandInspectorSellerProfile'}>
                    View Profile
                    </Link>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <AiOutlineBank size={50} />
                  <h1>Total Requests</h1>
                  <p>{ Number(requestCount)}</p>
                </div>
                <div>
                  {/* <h1>Land Transfer Requests</h1> */}
                  <button className="border p-2 rounded-lg bg-blue-500 text-white ">
                    <Link href={'/TransactionInfo'}>
                    {/* View at Land Transfer Requests */}
                    Approve Land Transactions
                    </Link>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between">
                <div className="flex flex-col items-center justify-center">
                  <FaUsers size={50} />
                  <h1>Total Buyer</h1>
                  <p>{Number(data1)}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {/* <h1> Request</h1> */}
                  <button className="border p-2 rounded-lg bg-blue-500 text-white ">
                    <Link href={'/LandInspectorBuyerProfile'}>
                    View at Requested Land
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
