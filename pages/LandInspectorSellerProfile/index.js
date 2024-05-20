import React, { useEffect, useState } from "react";
import Layout from "../../components/LayoutLandInspector";
import Link from "next/link";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { shortenAddress } from "../../utils";

const SellerProfile = () => {
  const [mounted, setMounted] = useState(false);

  const data = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSeller",
  });

  const { data: data1 } = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSellerDetails",
    args: [data?.data?.[0]],
  });

  console.log("data", data1);

  const verifyBuyer = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "isVerified",
    args: [data?.data?.[0]],
    watch: true,
  });

  const verify = async () => {
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "verifySeller",
      args: [data?.data?.[0]],
    });

    const { hash } = await writeContract(request);
  };

  const reject = async () => {
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "rejectSeller",
      args: [data?.data?.[0]],
    });

    const { hash } = await writeContract(request);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (data?.data == "") {
    return <Layout>No Seller</Layout>;
  }

  return (
    <Layout>
      <table className="table-auto w-full">
        <thead className="">
          <tr className="text-left">
            <th>Account Address</th>
            <th>Name</th>
            <th>Age</th>
            <th>Aadhar Number</th>
            <th>Pan Number</th>
            <th>Aadhar Card Document</th>
            <th>Verification Status</th>
            <th>Verify Seller</th>
            <th>Reject Seller</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {mounted && (
              <>
                {" "}
                <td>{shortenAddress(data.data?.[0])}</td>
                <td>{data1?.[0]}</td>
                <td>{Number(data1?.[1])}</td>
                <td>{data1?.[2]}</td>
                <td>{data1?.[3]}</td>
                <td>
                  <Link
                    href={data1?.[3] === undefined ? "" : data1?.[3]}
                    target="_black"
                    className="text-sky-600"
                  >
                    Click Here
                  </Link>
                </td>
                <td>{verifyBuyer?.data?.toString()}</td>
                
              
              </>
            )}
            <td>
              <button
                onClick={() => verify()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                verify
              </button>
            </td>
            <td>
              <button
                onClick={() => reject()}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
};

export default SellerProfile;
