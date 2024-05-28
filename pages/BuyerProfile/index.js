import React from 'react'
import Layout from '../../components/layout'
import { useAccount, useContractRead } from 'wagmi';
import { ContractAddress } from '../../constants/ContractAddress';
import { abi } from '../../constants/ABIcontract';

const BuyerProfile = () => {

    const {address}  = useAccount();

    const data = useContractRead({
        address: ContractAddress,
        functionName: "getBuyerDetails",
        args: [address],
        abi: abi
        })

    const {data : isVerified} = useContractRead({
        address: ContractAddress,
        functionName: "isBuyer",
        args: [address],
        abi: abi
    })

    console.log(isVerified);

        if(!data.data){
            return (
              <Layout>
                You are not Buyer
                </Layout>
            )
          }

  return (
    <div>
         <div>
      <Layout>
        <div>
          <h1>Buyer Profile</h1>
          <div>
            <h2 >Verified :
              <span className={ `font-bold uppercase mx-2 ${isVerified  ? "text-green-600": "text-red-600" }`}>
                
               {(isVerified).toString()}
              </span>
               </h2>
            <h2>Name: {data.data?.[0]}</h2>
            <h2>Age: {(data.data?.[5])?.toString()}</h2>
            <h2>Email : {data.data?.[4]}</h2>
            <h2>City: {data.data?.[1]}</h2>
            <h2>AadharCardNo: {data.data?.[2]}</h2>
            <h2>PanNo: {data.data?.[6]}</h2>
            <h2>AadharCardImage: {data.data?.[3]}</h2>
          </div>
        </div>
      </Layout>
    </div>
    </div>
  )
}

export default BuyerProfile