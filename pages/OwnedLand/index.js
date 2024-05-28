import React from 'react'
import Layout from '../../components/layout'
import { ContractAddress } from '../../constants/ContractAddress'
import { abi } from '../../constants/ABIcontract'
import { useContractRead } from 'wagmi'

const OwnedLand = () => {


    const LandOwner = useContractRead({
        address: ContractAddress,
        abi: abi,
        functionName: "landOwner",
        args:[0]
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


    console.log(LandOwner.data);

  return (
    <Layout>
        <h1>Owned Land</h1>
        <table className='w-full'>
            <thead className='text-left'>
                <th>#</th>
                <th>Land ID</th>
                <th>Land Owner</th>
                <th>Area</th>
                <th>City</th>
                <th>State</th>
                <th>PID</th>
                <th>Survey Number</th>
            </thead>
            <tbody>
                <td>1</td>
                <td>1</td>
                <td>{(LandOwner?.data)?.toString()}</td>
                <td>{(Area?.data)?.toString()}</td>
                <td>{(City?.data)?.toString()}</td>
                <td>{(State?.data)?.toString()}</td>
                {/* <td>100000</td> */}
                <td>{(PID?.data)?.toString()}</td>
                <td>{(SurveyNumber?.data)?.toString()}</td>
                {/* <td>0x1234567890</td> */}
            </tbody>
        </table>
    </Layout>
  )
}

export default OwnedLand