import React, { useContext, useEffect, useState } from "react";
import { FaUsers, FaRegBell } from "react-icons/fa";
import { AiOutlineBank } from "react-icons/ai";
import { RoleContext } from "../context/RoleContext";
import { useAccount, useContractRead } from "wagmi";
import { abi } from "../constants/ABIcontract";
import { ContractAddress } from "../constants/ContractAddress";
import { useRouter } from "next/router";
import LandInfoTable from "./LandInfoTable";
import { FaLandmark } from "react-icons/fa6";

const DashboardComponents = () => {
  const { role } = useContext(RoleContext);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { address } = useAccount();

  const { data: sellersCount } = useContractRead({
    address: ContractAddress,
    functionName: "getSellerCount",
    abi: abi,
  });


  const { data: buyersCount } = useContractRead({
    address: ContractAddress,
    functionName: "getBuyerCount",
    abi: abi,
  });

  

  const { data: landsCount } = useContractRead({
    address: ContractAddress,
    functionName: "getLandCount",
    abi: abi,
  });

  const { data: requestsCount } = useContractRead({
    address: ContractAddress,
    functionName: "getRequestCount",
    abi: abi,
  });

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);


  return (
    <>
      {mounted ? (
        <>
          <div className="border z-50">
            <div className="grid grid-cols-3 gap-2">
              <div>
                {role === "Buyer" ? (
                  <>
                    <div className="flex flex-col items-center pb-3 z-50 gap-4 relative">
                      <div className="absolute border z-50 text-xl">
                        <FaUsers size={50} className="z-50" />
                      </div>
                      <div className="mt-14 flex flex-col items-center">
                        <h1>Total Sellers</h1>
                        <p>{Number(sellersCount)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      {/* <h2>Profile</h2> */}
                      <button className="border p-2 rounded-lg bg-blue-500 text-white">
                        View Profile
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center pb-3 z-50 gap-4 relative">
                      <div className="absolute  z-50 text-xl">
                        <FaUsers size={50} className="z-50" />
                      </div>
                      <div className="mt-14 flex flex-col items-center">
                        <h1>Total Buys</h1>
                        <p>{buyersCount?.toString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      {/* <h1>Wish to Add Land!</h1> */}
                      <button
                        onClick={() => router.push("/AddLand")}
                        className="border p-2 rounded-lg bg-blue-500 text-white"
                      >
                        Add Land
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex flex-col items-center">
                <FaLandmark size={50} />
                                  <h1>Register Lands Count</h1>
                  <p>{landsCount?.toString()}</p>
                </div>
                <div className="flex flex-col items-center">
                  {/* <h1>Profile</h1> */}
                  <button className="border p-2 rounded-lg bg-blue-500 text-white">
                    View Profile
                  </button>
                </div>
              </div>
              {role === "Buyer" ? (
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col items-center">
                    <FaRegBell size={50} />
                    <h1>Total Request</h1>
                    <p>{requestsCount?.toString()}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {/* <h1>Make Payment for Approved Land Request</h1> */}
                    <button className="border p-2 rounded-lg bg-blue-500 text-white">
                      Make Payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col items-center">
                    <FaRegBell size={50} />
                    <h1>Total Request</h1>
                    <p>{requestsCount?.toString()}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {/* <h1>Request</h1> */}
                    <button
                      onClick={() => router.push("/RequestLand")}
                      className="border p-2 rounded-lg bg-blue-500 text-white"
                    >
                      View Requested Land
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <LandInfoTable />
          </div>
        </>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
};

export default DashboardComponents;
