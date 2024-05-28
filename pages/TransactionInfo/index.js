import React, {useEffect, useState} from 'react'
import Layout from '../../components/LayoutLandInspector'
import { useAccount, useContractRead } from 'wagmi'
import { ContractAddress } from '../../constants/ContractAddress'
import { abi } from '../../constants/ABIcontract'
import {prepareWriteContract, writeContract, readContract, waitForTransaction} from '@wagmi/core'
import { shortenAddress } from '../../utils'
import toast from 'react-hot-toast'

const TransactionInfo = () => {

    const [landsData, setLandsData] = useState([]);
    console.log("🚀 ~ TransactionInfo ~ landsData:", landsData)

    const LandOwner = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getLandOwner",
        args:[1]
    })

    const Area = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getArea",
        args: [1],
    })

    const City = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getCity",
        args: [1],
    })
    const State = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getState",
        args: [1],
    })
    const Price = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getPrice",
        args: [1],
    })
    const PID = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getPID",
        args: [1],
    })

    const SurveyNumber = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getSurveyNumber",
        args: [1],
    })



    const buyerId = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getBuyer",
    })

    const {address} = useAccount();

    console.log(address);

    // const data = useContractRead({
    console.log("🚀 ~ TransactionInfo ~ buyerId:", buyerId)
    //     address: ContractAddress,
    //     abi: abi,
    //     functionName: "getRequestDetails",
    //     args: [1],
    // })

    const Ispaid = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "checkPaymentReceived",
        args: [4],
    })

    const data = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getLandCount",
    });
    console.log("🚀 ~ TransactionInfo ~ LandCount:", data)

    const verify = async (landId, buyerAddress) => {
        try {
            const {request} = await prepareWriteContract({
                address: ContractAddress,
                abi: abi,
                functionName: "transferLandOwnership",
                args: [landId, buyerAddress],
            })
    
            const {hash} = await writeContract(request);
            const txhash = waitForTransaction({ hash: hash });

            toast.promise(txhash, {
                loading: "Verifying transaction...",
                success: "Transaction completed successfully",
                error: "Transaction failed",
            })
        } catch (error) {
            console.log(error);
            toast.error(error.shortMessage);
            
        }
    }

    
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
            console.log("🚀 ~ fetchLandInfo ~ landsData:", landsData)
      
    
    
            const isLandRequested = dynamicArray.map((index) => 
              readContract({
                address: ContractAddress,
                abi: abi,
                functionName: "isLandRequestedMapping",
                args: [index],
              })
      
            )
    
            
            const isLandRequestedArray = await Promise.all(isLandRequested);


            const Owner = dynamicArray.map((index) => 
              readContract({
                address: ContractAddress,
                abi: abi,
                functionName: "landOwner",
                args: [index],
              })
      
            )
    
            
            const OwnerArray = await Promise.all(Owner);
            console.log("🚀 ~ fetchLandInfo ~ OwnerArray:", OwnerArray)
            
            console.log(landsData)
            console.log(isLandRequestedArray)
    
            const combinedData = landsData.map((item, index) => {
              return {...item, isRequested: isLandRequestedArray[index], Owner: OwnerArray[index]};
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
            <table className='w-full'>
                <thead className='text-left'>
                    <tr>

                    <th>
                        #
                    </th>
                    <th>Owner ID</th>
                    <th>Area</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Price</th>
                    <th>Property PID </th>
                    <th>Survey No.</th>
                    <th>Verify Land Tranfer</th>
                    </tr>
                </thead>
                <tbody>
                   {
                       landsData.filter(land => land.isRequested)?.map((item, index) => (
                            <tr key={index}>
                           <td>{(Number(item[0]))?.toString()}</td>
                    <td>{(shortenAddress(item.Owner))?.toString()}</td>
                    <td>{(item[1])?.toString()}</td>
                    <td>{(item[2])?.toString()}</td>
                    <td>{(item[3])?.toString()}</td>
                    <td>{(Number(item[4]))?.toString()}</td>
                    <td>{(Number(item[5]))?.toString()}</td>
                    <td>{(Number(item[6]))?.toString()}</td>
                    <td><button onClick={() => verify(Number(item[0]), address)} className='bg-blue-600 text-white p-4 rounded-lg'>Verify Transaction</button></td>
                    </tr>
                    ))
                   }
                </tbody>
            </table>

            {/* <div>
                <h1>Buyer : {buyerId[0]}</h1>
                <h1>Seller : {data?.data?.[0]}</h1>
                <h1>Land Id : {(data?.data?.[2])?.toString()}</h1>
                <h1>Paid : {(Ispaid?.data)?.toString()}</h1>
            </div> */}

        </div>
    </Layout>
  )
}

export default TransactionInfo