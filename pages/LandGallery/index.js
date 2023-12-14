import React, {useState, useEffect} from 'react'
import Layout from '../../components/layout'
import Image from 'next/image'
import { useContractRead } from 'wagmi';
import { ContractAddress } from '../../constants/ContractAddress';
import { abi } from '../../constants/ABIcontract';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const image = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getImage",
    args: [1],
  });

  const Area = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getArea",
    args: [1],
  });

  const City = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getCity",
    args: [1],
  });

  const State = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getState",
    args: [1],
  });

  const PID = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getPID",
    args: [1],
  });

  const SurveyNumber = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getSurveyNumber",
    args: [1],
  });

  const Price = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: "getPrice",
    args: [1],
  });
  return (
    <Layout>

    <div className="border w-[400px] h-[300px] rounded-xl">
      <Image
        src={`https://ipfs.io/ipfs/${image?.data?.toString()}`}
        alt="alt"
        width={400}
        height={300}
      />
      <div>
        {mounted && (
          <>
            {" "}
            <h1>{Area?.data?.toString()} Sq. m.</h1>
            <h1>
              {City?.data}, {State?.data}
            </h1>
            <h1>pid : {PID?.data?.toString()}</h1>
            <h1>Survey No. {SurveyNumber?.data?.toString()}</h1>
            <h1>Price: $ {Price?.data?.toString()} </h1>
          </>
        )}
        <h1>View Verified Land Document </h1>
      </div>
    </div>
  </Layout>
  ) 
}

export default Index