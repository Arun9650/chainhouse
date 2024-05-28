import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import Image from "next/image";
import { useContractRead } from "wagmi";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import { readContract } from "@wagmi/core";

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [landsData, setLandsData] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        setLandsData(landsData);
      };

      fetchLandInfo();
    }
  }, [data.data]);

  return (
    <Layout>
      <div className=" flex gap-8 rounded-xl ">
        {landsData && (
          <div className=" flex gap-8 rounded-xl ">
            {landsData.length === 0 && (
              <div>
                <h1>No data found</h1>
              </div>
            )}
          </div>
        )}

        {landsData.map((land, index) => (
          <div key={index}>
            <Image
              src={`https://copper-rear-chickadee-886.mypinata.cloud/ipfs/${land[7]}`}
              alt="alt"
              width={400}
              height={300}
              className="rounded-xl"
              // fallbackSrc="/images/placeholder.jpeg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.jpeg";
              }}
            />
            <div>
              {mounted && (
                <>
                  <h1>{land[1].toString()} Sq. m.</h1>
                  <h1>
                    {land[2]}, {land[3]}
                  </h1>
                  <h1>pid : {land[5].toString()}</h1>
                  <h1>Survey No. {land[6].toString()}</h1>
                  <h1>Price: $ {land[4].toString()} </h1>
                </>
              )}
              <h1>View Verified Land Document </h1>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Index;
