import React, { useEffect, useState } from "react";
import Layout from "../../components/LayoutLandInspector";
import { useContractRead } from "wagmi";
import { abi } from "../../constants/ABIcontract";
import { ContractAddress } from "../../constants/ContractAddress";
import Link from "next/link";
import { prepareWriteContract, writeContract, readContract, readContracts } from "@wagmi/core";

const BuyerProfile = () => {



  const [buyerData, setBuyerData] = useState([]);
  console.log("🚀 ~ BuyerProfile ~ buyerData:", buyerData)

  const [mounted, setMounted] = useState(false);

    const data = useContractRead({
        address:ContractAddress,
        abi: abi,
        functionName: "getBuyersCount",
    })

    const buyerAddresses = useContractRead({

        address:ContractAddress,
        abi: abi,
        functionName: "getBuyer",
    })
    
    console.log(buyerAddresses.data);
    
  useEffect(() => {
    if (buyerAddresses.data) {
      const arrayLength = (buyerAddresses.data).length;
      console.log("🚀 ~ useEffect ~ arrayLength:", arrayLength)
      const dynamicArray = Array.from({ length: arrayLength }, (v, i) => i);
      const dynamicArray2 = Array.from({ length: arrayLength }, (v, i) => i);

      console.log(buyerAddresses.data[0]);
      const fetchLandInfo = async () => {
        const landPromises = dynamicArray.map((index) =>
          readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "getBuyerDetails",
            args: [buyerAddresses.data[index]],
          })
        );

        const landsData = await Promise.all(landPromises);
        console.log("🚀 ~ fetchLandInfo ~ landsData:", landsData)
        // setBuyerData(landsData,buyerAddresses.data[0]);
        console.log(buyerData)
        // const updatedBuyerData = landsData.map((buyer, index) => {
        //     return [...buyer, buyerAddresses.data[index]];
        // });



        // setBuyerData(updatedBuyerData);


        const isVerified = dynamicArray.map((index) => {
       const verifiedData =    readContract({
            address: ContractAddress,
            abi: abi,
            functionName: "isVerified",
            args: [buyerAddresses.data[index]],
          })

          console.log(verifiedData);

          // const arry = Promise.all(verifiedData);
          // console.log("🚀 ~ isVerified ~ arry:", arry)

          return (
            [...landsData, buyerAddresses.data[index]]
          )
        }
         
        );
        console.log("🚀 ~ isVerified ~ isVerified:", isVerified)

        const verifiedData = await Promise.all(isVerified);
        console.log("🚀 ~ fetchLandInfo ~ verifiedData:", verifiedData)


        const updatedVerifiedData = landsData.map((buyer, index) => {
            return [...buyer, verifiedData, buyerAddresses.data[index]];
        });

        setBuyerData(updatedVerifiedData);


      };



      const buyerInfo = async () => {

        if(buyerAddresses.data){

          const arrayLength = (buyerAddresses.data).length;
          console.log("🚀 ~ useEffect ~ arrayLength:", arrayLength)
          const dynamicArray = Array.from({ length: arrayLength }, (v, i) => i);



          const array  =  dynamicArray.map((element,index) => {
            const data = readContracts({
              contracts: [{
                address: ContractAddress,
                abi: abi,
                functionName: "getBuyerDetails",
                args: [buyerAddresses.data[index]],
              },
              {
                address: ContractAddress,
                abi: abi,
                functionName: "isVerified",
                args: [buyerAddresses.data[index]],
              },
            ]

              
            })

            return data
          })




          const data = await Promise.all(array);
          console.log("🚀 ~ buyerInfo ~ data:", data.length)

          const updatedData = data.map((buyer, index) => {
            return [...buyer, buyerAddresses.data[index]];
        });
          // setBuyerData(updatedData);
          


          const updatedArray = updatedData.map(subArray => {
            // Extract the result array from the first object
            const resultArray = subArray[0].result;
          
            // Extract the result property from the second object
            const isVerified = subArray[1].result;
          
            // Get the last element in the sub-array
            const address = subArray[2];
          
            // Create a new object with the updated result array
            const updatedObject = {
              result: [...resultArray, isVerified, address]
            };
          
            // Return the updated sub-array
            return [updatedObject];
          });




          setBuyerData(updatedArray);
        }
       

      }

      buyerInfo();



      // fetchLandInfo();



      

    }
  }, [data.data]);

    // console.log('data',data.data[0]);

    console.log("🚀 ~ BuyerProfile ~ data:", data)



    const {data: data1} = useContractRead({
        address:ContractAddress,
        abi: abi,
        functionName: "getBuyerDetails",
        args: [data?.data?.[0]],
        
    })
    


    const verify = async (address) => {
        const {request} = await prepareWriteContract({
            address: ContractAddress,
            abi: abi,
            functionName: "verifyBuyer",
            args: [address],
        })

        const {hash} = await writeContract(request);
    }

    const reject  = async () => {
        const {request} = await prepareWriteContract({
            address: ContractAddress,
            abi:abi,
            functionName: "rejectBuyer",
            args: [data?.data?.[0]],
        })

        const {hash} = await writeContract(request);
    }



    useEffect(() => {
      setMounted(true);
    },[])

  return (
    <Layout>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Phone</th>
          <th>Document ID</th>
          <th>Email</th>
          <th>Age</th>
          <th>Aadhar Number</th>
          <th>Verification Status</th>
          <th>Address</th>
          <th>Verify Buyer</th>
        <th>Reject Buyer</th>
        </tr>
      </thead>
      <tbody>
        {mounted && buyerData.map((item, index) => {
          const result = item[0].result;
          return (
            <tr key={index}>
              <td>{result[0]}</td>
              <td>{result[1]}</td>
              <td>{result[2]}</td>
              <td><Link href={result[3] || ""} target="_blank" className="text-sky-600">Click Here</Link></td>
              <td>{result[4]}</td>
              <td>{Number(result[5])}</td>
              <td>{result[6]}</td>
              <td>{result[7] ? 'Verified' : 'Not Verified'}</td>
              <td>{result[8]}</td>
              <td><button onClick={() => verify(result[8])} className="bg-blue-600 text-white px-5 py-2 rounded-lg">verify</button></td>
          <td><button onClick={() => reject(index)} className="bg-red-500 text-white px-5 py-2 rounded-lg">Reject</button></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </Layout>
  );
};

export default BuyerProfile;
