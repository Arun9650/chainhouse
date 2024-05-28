import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { RoleContext } from "../context/RoleContext";
import dynamic from "next/dynamic";
import { ContractAddress } from "../constants/ContractAddress";
import { abi } from "../constants/ABIcontract";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {watchAccount} from '@wagmi/core'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "/components/components/ui/dialog.jsx";

import { Label } from "/components/components/ui/label.jsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "/components/components/ui/radio-group.jsx";
import Image from "next/image";
import Header from "../components/Header";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const radio1Ref = useRef();
  const radio2Ref = useRef();

  const {role, setRole } = useContext(RoleContext);

  const router = useRouter();

  const isLandInspector = useContractRead({
    abi: abi,
    address: ContractAddress,
    functionName: "landInspector",
    // args: [address],
  });
 
  const clickRadio1  = (e) => {
    e.preventDefault();
  
    radio1Ref.current.click();
  }
  
  const clickRadio2   = (e) => {
    e.preventDefault();
  
    radio2Ref.current.click();
  }

  const handleSelectRole = (e) => {
    e.preventDefault();
    
    setRole(e.target.value);

    if(e.target.value === 'Seller'){
      router.push('/RegisterSeller');
    }
    else if(e.target.value === 'Buyer'){
      router.push('/RegisterBuyer');
    }

  }
  

  useEffect(() => {
    if (isLandInspector.data === address) {
      router.push("/LandInspectorDashboard");
    }
  }, [address, isLandInspector, router]);


  



  return (
    <>
      

        <Header/>
      <div className="px-4  py-16 mx-auto w-full md:px-24 lg:px-8 lg:py-16 h-[60vh] flex items-center justify-center bg-gray-200">
        <div className="max-w-xl  sm:mx-auto lg:max-w-2xl">
          <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h2 className="max-w-2xl  bg-gray-200  mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                <span className="relative  inline-block">
                  <svg
                    viewBox="0 0 52 24"
                    fill="currentColor"
                    className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-[120px] lg:-mt-10 sm:block"
                  >
                    <defs>
                      <pattern
                        id="e77df901-b9d7-4b9b-822e-16b2d410795b"
                        x="0"
                        y="0"
                        width=".135"
                        height=".30"
                      >
                        <circle cx="1" cy="1" r=".7"></circle>
                      </pattern>
                    </defs>
                    <rect
                      fill="url(#e77df901-b9d7-4b9b-822e-16b2d410795b)"
                      width="52"
                      height="24"
                    ></rect>
                  </svg>
                </span>
                Register land ownership with the world&apos;s first
                blockchain-based platform.
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Say goodbye to fraudulent land transactions and hello to a
                trustworthy and efficient system for registering land ownership.
              </p>
            </div>
            <div>
              <Dialog>
                <DialogTrigger>
                  <div className="inline-flex z-50 disabled:bg-slate-200 cursor-pointer items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-200 focus:shadow-outline focus:outline-none">
                    Get in touch with us now!
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose role? </DialogTitle>
                    <DialogDescription>
                     select a value to continue
                    </DialogDescription>
                  </DialogHeader>
                  <RadioGroup  onClick={(e) => handleSelectRole(e)} className="grid grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Seller" ref={radio1Ref} id="r1" />
                      <Image src="/seller.png"  onClick={clickRadio1 } alt="h" width={80} height={80} />
                      <Label htmlFor="r1" >Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Buyer" ref={radio2Ref} id="r2" />
                      <Image src="/participant.png" onClick={clickRadio2}  alt="h" width={80} height={80} />
                      <Label htmlFor="r2">Buyer</Label>
                    </div>
                  </RadioGroup>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto bg-white w-full md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
            Secure, Transparent Land Registration Processes.
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            The Blockchain Solution for Land Ownership and Transfer.
          </p>
        </div>
        <div className="grid max-w-screen-lg gap-8 row-gap-10 mx-auto lg:grid-cols-2">
          <div className="flex flex-col max-w-md sm:mx-auto sm:flex-row">
            <div className="mr-4">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 52 52"
                  className="w-10 h-10 text-indigo-500"
                >
                  <polygon
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    points="29 13 14 29 25 29 23 39 38 23 27 23"
                  ></polygon>
                </svg>
              </div>
            </div>
            <div>
              <h6 className="mb-3 text-xl font-bold leading-5 text-gray-900">
                Secure Data Storage and Immutable Records.
              </h6>
              <p className="mb-3 text-sm text-gray-700">
                Record your land ownership on a blockchain that is unchangeable,
                so you can rest assured knowing your data will be safe from
                fraud or manipulation.
              </p>{" "}
              <Link
                href="/"
                aria-label=""
                className="inline-flex items-center font-semibold text-indigo-500 transition-colors duration-200 hover:text-indigo-500"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="flex flex-col max-w-md sm:mx-auto sm:flex-row">
            <div className="mr-4">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 52 52"
                  className="w-10 h-10 text-indigo-500"
                >
                  <polygon
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    points="29 13 14 29 25 29 23 39 38 23 27 23"
                  ></polygon>
                </svg>
              </div>
            </div>
            <div>
              <h6 className="mb-3 text-xl font-bold leading-5 text-gray-900">
                Streamlined Transactions with Smart Contracts.
              </h6>
              <p className="mb-3 text-sm text-gray-700">
                Automate the transfer of land titles through our automated smart
                contracts to simplify transactions, reduce paperwork and ensure
                transparency in every step of the process
              </p>{" "}
              <Link
                href="/"
                aria-label=""
                className="inline-flex items-center font-semibold text-indigo-500 transition-colors duration-200 hover:text-indigo-500"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto w-full md:px-24 lg:px-8 lg:py-20 bg-white">
        <div className="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
          <div className="relative lg:w-1/2">
            <img
              src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
              alt=""
              className="object-cover w-full lg:absolute h-80 lg:h-full"
            />
            <svg
              viewBox="0 0 20 104"
              fill="currentColor"
              className="absolute top-0 right-0 hidden h-full text-white lg:inline-block"
            >
              <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
            </svg>
          </div>
          <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
            <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
              Protect your land, and invest in it
            </h5>
            <p className="mb-5 text-gray-800">
              Property fraud is a serious issue that affects more than just the
              individual being scammed. With each instance of fraud, communities
              suffer as resources are wasted on projects built on unclaimed or
              improperly documented land. By investing in blockchain-based
              registration you can help us solve this problem for all people.
            </p>
            <div className="flex items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
              >
                Get started
              </button>{" "}
              <Link
                href="/"
                aria-label=""
                className="inline-flex items-center font-semibold transition-colors duration-200 text-indigo-500 hover:text-indigo-500"
              >
                Learn More
                <svg
                  fill="currentColor"
                  viewBox="0 0 12 12"
                  className="inline-block w-3 ml-2"
                >
                  <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto w-full md:px-24 lg:px-8 lg:py-20 bg-white">
        <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
              <svg viewBox="0 0 24 24" className="text-indigo-500 w-7 h-7">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points=" 8,5 8,1 16,1 16,5"
                  strokeLinejoin="round"
                ></polyline>
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points="9,15 1,15 1,5 23,5 23,15 15,15"
                  strokeLinejoin="round"
                ></polyline>
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points="22,18 22,23 2,23 2,18"
                  strokeLinejoin="round"
                ></polyline>
                <rect
                  x="9"
                  y="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  width="6"
                  height="4"
                  strokeLinejoin="round"
                ></rect>
              </svg>
            </div>
            <div className="max-w-xl mb-6">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                BlockReg Land - A Blockchain-Based Solution to a Century Old
                Problem
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                The title of the content block is &quot;BlockReg Land - A
                Blockchain-Based Solution to a Century Old Problem&quot;
              </p>
            </div>
            <div>
              <Link
                href="/"
                aria-label=""
                className="inline-flex items-center font-semibold transition-colors duration-200 text-indigo-500 hover:text-indigo-500"
              >
                Read more.{" "}
                <svg
                  fill="currentColor"
                  viewBox="0 0 12 12"
                  className="inline-block w-3 ml-2"
                >
                  <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"></path>
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center -mx-4 lg:pl-8">
            <div className="flex flex-col items-end px-3">
              <img
                src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                alt=""
                className="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
              />
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                alt=""
                className="object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40"
              />
            </div>
            <div className="px-3">
              <img
                src="https://images.pexels.com/photos/3182739/pexels-photo-3182739.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500"
                alt=""
                className="object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto w-full bg-white md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-6 row-gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="lg:py-6 lg:pr-16">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                    <svg
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      className="w-4 text-indigo-500"
                    >
                      <line
                        fill="none"
                        strokeMiterlimit="10"
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="22"
                      ></line>
                      <polyline
                        fill="none"
                        strokeMiterlimit="10"
                        points="19,15 12,22 5,15"
                      ></polyline>
                    </svg>
                  </div>
                </div>
                <div className="w-px h-full bg-gray-300"></div>
              </div>
              <div className="pt-1 pb-8">
                <p className="text-gray-900 mb-2 text-lg font-bold">
                  How BlockReg Land Works.
                </p>
                <p className="text-gray-700"></p>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                    <svg
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      className="w-4 text-indigo-500"
                    >
                      <line
                        fill="none"
                        strokeMiterlimit="10"
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="22"
                      ></line>
                      <polyline
                        fill="none"
                        strokeMiterlimit="10"
                        points="19,15 12,22 5,15"
                      ></polyline>
                    </svg>
                  </div>
                </div>
                <div className="w-px h-full bg-gray-300"></div>
              </div>
              <div className="pt-1 pb-8">
                <p className="text-gray-900 mb-2 text-lg font-bold">
                  Sign Up and Verify Identity
                </p>
                <p className="text-gray-700">
                  No need to go through a lengthy verification process, just
                  sign up with an email address. Once you&apos;ve verified your
                  identity, you&apos;ll be able to register land on the
                  blockchain.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                    <svg
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      className="w-4 text-indigo-500"
                    >
                      <line
                        fill="none"
                        strokeMiterlimit="10"
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="22"
                      ></line>
                      <polyline
                        fill="none"
                        strokeMiterlimit="10"
                        points="19,15 12,22 5,15"
                      ></polyline>
                    </svg>
                  </div>
                </div>
                <div className="w-px h-full bg-gray-300"></div>
              </div>
              <div className="pt-1 pb-8">
                <p className="text-gray-900 mb-2 text-lg font-bold">
                  Register Land
                </p>
                <p className="text-gray-700">
                  Registering land is simple - just input the necessary details
                  for each parcel of land in order to create a secure and
                  immutable record of ownership on the blockchain. You can also
                  utilize smart contracts to facilitate seamless transfer of
                  ownership between parties when needed.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-start justify-center w-10 h-10 border rounded-full">
                    <svg
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mt-2 w-6 text-indigo-500"
                    >
                      <polyline
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        points="6,12 10,16 18,8"
                      ></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pt-1 pb-8">
                <p className="text-gray-900 mb-2 text-lg font-bold">
                  Access Records
                </p>
                <p className="text-gray-700">
                  Once registered, all records are easily accessible via our
                  user-friendly interface so you never have to worry about
                  forgetting or losing important documents again!
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
              alt=""
              className="inset-0 object-cover object-bottom w-full rounded shadow-lg h-96 lg:absolute lg:h-full"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full h-full  bg-white">
        <div className="absolute hidden w-full bg-gray-100 lg:block h-96"></div>
        <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              Sell or buy land
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Anyone can register and sell their property on blockchain using
              ETH.
            </p>
          </div>
          <div className="grid max-w-screen-md gap-10 md:grid-cols-2 sm:mx-auto">
            <div>
              <div className="p-8 bg-gray-900 rounded">
                <div className="mb-4 text-center">
                  <p className="text-xl font-medium tracking-wide text-white">
                    Starter Plan
                  </p>
                  <div className="flex items-center justify-center">
                    <p className="mr-2 text-5xl font-semibold text-white lg:text-6xl">
                      $39
                    </p>
                    <p className="text-lg text-gray-500">/ month</p>
                  </div>
                </div>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      10 deploys per day
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      10 GB of storage
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">3 domains</p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      SSL Certificates
                    </p>
                  </li>
                </ul>{" "}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
                >
                  Get Now
                </button>
              </div>
              <div className="w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75"></div>
              <div className="w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50"></div>
              <div className="w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25"></div>
            </div>
            <div>
              <div className="p-8 bg-gray-900 rounded">
                <div className="mb-4 text-center">
                  <p className="text-xl font-medium tracking-wide text-white">
                    Pro Plan
                  </p>
                  <div className="flex items-center justify-center">
                    <p className="mr-2 text-5xl font-semibold text-white lg:text-6xl">
                      $59
                    </p>
                    <p className="text-lg text-gray-500">/ month</p>
                  </div>
                </div>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      100 deploys per day
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      50 GB of storage
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      Unlimited domains
                    </p>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-100"
                      >
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          points="6,12 10,16 18,8"
                        ></polyline>
                        <circle
                          cx="12"
                          cy="12"
                          fill="none"
                          r="11"
                          stroke="currentColor"
                        ></circle>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-300">
                      SSL Certificates
                    </p>
                  </li>
                </ul>{" "}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
                >
                  Get Now
                </button>
              </div>
              <div className="w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75"></div>
              <div className="w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50"></div>
              <div className="w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 px-4 pt-16 mx-auto w-full border-opacity-10 md:px-24 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link
              href="/"
              aria-label="Go home"
              title="Company"
              className="inline-flex items-center"
            >
              <svg
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeWidth="2"
                strokeLinecap="round"
                strokeMiterlimit="10"
                stroke="currentColor"
                fill="none`"
                className="w-8 text-indigo-500"
              >
                <rect x="3" y="1" width="7" height="12"></rect>
                <rect x="3" y="17" width="7" height="6"></rect>
                <rect x="14" y="1" width="7" height="6"></rect>
                <rect x="14" y="11" width="7" height="12"></rect>
              </svg>{" "}
              <span className="ml-2 text-xl font-bold tracking-wide text-gray-900 uppercase">
                Company
              </span>
            </Link>
            <div className="mt-6 lg:max-w-sm">
              <p className="text-sm text-gray-900">
                Register your land with us, using blockchain technology.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-base font-bold tracking-wide text-gray-900">
              Contacts
            </p>
            <div className="flex">
              <p className="mr-1 text-gray-900">Phone:</p>{" "}
              <a
                href="tel:850-123-5021"
                aria-label="Our phone"
                title="Our phone"
                className="transition-colors duration-300 text-indigo-500 hover:text-deep-purple-800"
              >
                850-123-5021
              </a>
            </div>
            <div className="flex">
              <p className="mr-1 text-gray-900">Email:</p>{" "}
              <a
                href="mailto:info@lorem.mail"
                aria-label="Our email"
                title="Our email"
                className="transition-colors duration-300 text-indigo-500 hover:text-deep-purple-800"
              >
                info@lorem.mail
              </a>
            </div>
            <div className="flex">
              <p className="mr-1 text-gray-900">Address:</p>{" "}
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Our address"
                title="Our address"
                className="transition-colors duration-300 text-indigo-500 hover:text-deep-purple-800"
              >
                312 Lovely Street, NY
              </a>
            </div>
          </div>
          <div>
            <span className="text-base font-bold tracking-wide text-gray-900">
              Social
            </span>
            <div className="flex items-center mt-1 space-x-3">
              <Link
                href="/"
                className="text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                  <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"></path>
                </svg>
              </Link>{" "}
              <Link
                href="/"
                className="text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                  <circle cx="15" cy="15" r="4"></circle>
                  <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                </svg>
              </Link>{" "}
              <Link
                href="/"
                className="text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                  <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
          <p className="text-sm text-gray-700">
            © Copyright 2020 Company. All rights reserved.
          </p>
          <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <li>
              <Link
                href="/"
                className="text-sm text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                F.A.Q
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-sm text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-sm text-gray-700 transition-colors duration-300 hover:text-indigo-500"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
