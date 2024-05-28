import React, { useState, useEffect } from 'react'
import Layout from '../../components/LayoutLandInspector'
import { useContractRead } from 'wagmi'
import { ContractAddress } from '../../constants/ContractAddress'
import { abi } from '../../constants/ABIcontract'
import Link from 'next/link'
import { prepareWriteContract, writeContract, readContract , waitForTransaction} from '@wagmi/core'
import toast from 'react-hot-toast'
import { shortenAddress } from '../../utils'

const VerifyLand = () => {


    const [landsData, setLandsData] = useState([]);
  const [loading, setLoading] = useState(new Array(landsData.length).fill(false));


  console.log(landsData)

    const data = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getLandCount",
      });
    
      const {data : seller} = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getSellers",
      })
    
    
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
    



    const Area = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getArea",
        args: [1],
    })



    const {data : requests} = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "requests",
        args: [1],
    })

    console.log(requests);
    const {data : requestCount} = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "requestCount",
    })


    console.log(requestCount);

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


    const OwnerID  = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getLandOwner",
        args: [1],
    })


    const LandImage = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getImage",
        args: [1],
    })

    const Document = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "getDocument",
        args: [1],
    })


    const verify = async (land,index) => {
       console.log("🚀 ~ verify ~ land:", land)
       try {
        setLoading(prevLoading => {
            const newLoading = [...prevLoading];
            newLoading[index] = true;
            return newLoading;
          });

        const {request} = await prepareWriteContract({
            address: ContractAddress,
            abi: abi,
            functionName: "verifyLand",
            args: [land],
        })

      const hash  =   await writeContract(request);

      const txhash  = waitForTransaction({hash: hash});

      toast.promise(txhash, {
        loading: "Waiting for transaction to complete",
        success: "Transaction completed successfully",
        error: "Transaction failed",
      });


        setLoading(prevLoading => {
            const newLoading = [...prevLoading];
            newLoading[index] = false;
            return newLoading;
          });

       } catch (error) {
        setLoading(prevLoading => {
            const newLoading = [...prevLoading];
            newLoading[index] = false;
            return newLoading;
          });
            toast.error(error.shortMessage);
            console.log(error);
       }    

    }


    const alreadyVerified = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "isLandVerified",
        args: [1],
    })

    console.log('alreadyVerified',alreadyVerified.data)


    if(alreadyVerified.data){
        return (
            <div>
                <Layout>
                    <h1 className='text-2xl text-center'>No New Land To Verified</h1>
                </Layout>
            </div>
        )
    }
    
  return (
    <div>
       <Layout>
       <table className='w-full divide-y ' >
            <thead className='text-left'>
                <th>#</th>
                <th>Area</th>
                <th>City</th>
                <th>State</th>
                <th>Price</th>
                <th>Property PID</th>
                <th>Survey Number</th>
                <th>Owner ID</th>
                <th>land Image</th>
                <th>Document </th>
                <th>Verify</th>
            </thead>
            <tbody>
            {landsData.map((land, index) => (
      <tr key={index}>
        <td>{Number(land[0])}</td>
        <td>{Number(land[1])}</td>
        <td>{land[2]}</td>
        <td>{land[3]}</td>
        <td>{(Number(land[4]))}</td>
        <td>{Number(land[5])}</td>
        <td>{Number(land[6])}</td>
        <td>{shortenAddress(land.Owner)}</td>
        <td><Link className='text-sky-400' target='_blank' href={`https://ipfs.io/ipfs/${land[7]}`}>Click Here</Link></td>
        <td><Link className='text-sky-400' target='_blank' href={`https://ipfs.io/ipfs/${land[8]}`}>Click Here</Link></td>
        <td><button onClick={() => verify(land[0], index)} className='bg-blue-600 p-4 py-3 rounded-xl text-white'>
        {loading[index] ? "Loading..." : "Verify  it "}</button></td>
      </tr>
    ))}
            </tbody>
        </table>
       </Layout>
    </div>
  )
}

export default VerifyLand