import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import {watchAccount} from '@wagmi/core';
const Header = () => {

  
  return (
    <div className="w-full   px-4 py-5 mx-auto md:px-24 lg:px-8 bg-gray-200">
        <div className="relative flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Company"
              title="Company"
              className="inline-flex items-center mr-8"
            >
            <Image src="/logo-cropped.svg" className='' width={50} height={50} alt="logo"/>
          {" "}
              <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                ChainHouse
              </span>
            </Link>
            <ul className="flex items-center hidden space-x-8 lg:flex">
              <li>
                <Link
                  href="/"
                  aria-label="Our product"
                  title="Our product"
                  className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-gray-900"
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  aria-label="Our product"
                  title="Our product"
                  className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-gray-900"
                >
                  Buy
                </Link>
              </li>
             
            </ul>
          </div>
          <ul className=" items-center hidden space-x-8 lg:flex">
            <li>
              <Link
                href="/"
                aria-label="Sign in"
                title="Sign in"
                className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-gray-900"
              >
                <ConnectButton />
              </Link>
            </li>
            
          </ul>
          <div className="lg:hidden">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 text-gray-600">
                <path
                  fill="currentColor"
                  d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
                ></path>
                <path
                  fill="currentColor"
                  d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
                ></path>
                <path
                  fill="currentColor"
                  d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
  )
}

export default Header