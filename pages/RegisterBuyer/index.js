import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useWalletClient,
} from "wagmi";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "/components/components/ui/form.jsx";
import { abi } from "../../constants/ABIcontract";
import RegisterToBlockchain from "../../components/SellerRegisterBlockchain";
import { ContractAddress } from "../../constants/ContractAddress";
import Layout from "../../components/layout";
import Header from "../../components/Header";
import BuyerRegisterBlockchain from "../../components/BuyerRegisterBlockchain";
import {waitForTransaction, prepareWriteContract , writeContract} from '@wagmi/core'
import { Form } from "../../components/components/ui/form";
import { Input } from "/components/components/ui/input.jsx";
import { Button } from "../../components/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  age: z.number().positive({
    message: "Age must be a positive number.",
  }),
  aadharCardNo: z.string().min(12, {
    message: "Aadhar Card No. must be at least 12 characters.",
  }),
  panCardNo: z.string().min(10, {
    message: "Pan Card No. must be at least 10 characters.",
  }),
  ownedLands: z.string(),
  aadharCardImage: z.string(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

});


const Index = () => {

  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const {address} = useAccount();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      age: "", // Provide appropriate default values for other fields
      aadharCardNo: "",
      panCardNo: "",
      ownedLands: "1",
      aadharCardImage: "",
      email: "",
    },
  });


  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");


  const [mounted, setMounted] = useState(false);


  const [SellerData, setSellerData] = useState({
    name: "",
    age: "",
    city: "",
    email: "",
    AadharCardNo: "",
    PanNo: "",
    AadharCardImage: "" || cid,
    email: "",
  });

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      console.log(ipfsHash);
      setCid(ipfsHash);
      setUploading(false);
      setSellerData({ ...SellerData, AadharCardImage: ipfsHash });
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setSellerData({ ...SellerData, [e.target.name]: e.target.value });
  };


  const {data: BuyerData} = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: 'getBuyer',
    // args: [address],
  })



  
  const isAddressInBuyerData = (address, buyerData) => {
    // Check if buyerData is not null or undefined
    if (buyerData) {
      // Check if the address exists in buyerData
      return buyerData.includes(address);
    }
    // If buyerData is null or undefined, return false
    return false;
  }

  const onSubmit = async ({
    username,
    age,
    aadharCardNo,
    panCardNo,
    ownedLands,
    aadharCardImage,
    email
  }) => {
   
  
    console.log(username, age, aadharCardNo, panCardNo, ownedLands, SellerData.AadharCardImage, email);

   
    if(BuyerData){
      isAddressInBuyerData(address, BuyerData);

      toast.error('User already registered');
      router.push('/Dashboard');
      return;
    }

     
      try {
        const { request } = await prepareWriteContract({
          address: ContractAddress,
          abi: abi,
          functionName: "registerBuyer",
          args: [
            username,
            age,
            aadharCardNo,
            panCardNo,
            ownedLands,
            SellerData.AadharCardImage,
            email,
          ],
        });

        const {hash} = await writeContract(request);

        const txWait =  waitForTransaction({
          hash: hash,
        });
     
        const result = await toast.promise(txWait, {
          loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
        });
    
        

        if (result.status == 'success') {
          router.push("/Dashboard");
        }
      } catch (error) {
        console.log(error);
        if (error.shortMessage) {
          const match = error.shortMessage.match(/reason:\n\s*(.*)/);
          toast.error(match[1].trim());
        } 
        else {
          toast.error(error.shortMessage);
        }
      }    
  };

  const { data: getBuyer} = useContractRead({
    address: ContractAddress,
    functionName: "getBuyer",
    abi: abi,
    // args: [address],
  });



  const {data : isBuyer} = useContractRead({
    address: ContractAddress,
    functionName: "isBuyer",
    abi: abi,
    args: [address],
  })


  useEffect(() => {
    if(isBuyer){
      router.push('/Dashboard');
    }
  },[isBuyer])

  useEffect(() => {
    if (getBuyer) {
      if(BuyerData){
        
      const isAddressInBuyer =  isAddressInBuyerData(address, BuyerData);
        console.log("🚀 ~ useEffect ~ isAddressInBuyer:", isAddressInBuyer)
        if(isAddressInBuyer){
          toast.error('User already registered');
        router.push('/Dashboard');
        }
      }
    }
  }, [getBuyer, address, BuyerData, router]);

  return (
    <div className="min-h-screen flex flex-col h-screen ">
      <Header />

      <section className="bg-white flex flex-grow h-full   dark:bg-gray-900 ">
        <div className=" flex-grow h-full">
          <div className="flex justify-center   flex-grow h-full    ">
            <div className="hidden bg-cover lg:block lg:w-2/5 bg-[url(/register-image.png)] "></div>

            <div className="flex items-center w-full max-w-3xl pt-0 p-8 mx-auto lg:px-12 lg:w-3/5">
              <div className="w-full">
                <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                  Get your free account now.
                </h1>

                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Let’s get you all set up so you can verify your personal
                  account and begin setting up your profile.
                </p>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="18"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined;
                                if (!isNaN(value) || value === undefined) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aadharCardNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Card No.</FormLabel>
                          <FormControl>
                            <Input placeholder="XXXX XXXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="panCardNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pan Card No.</FormLabel>
                          <FormControl>
                            <Input placeholder="XXXXX0000X " {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownedLands"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>owned Land</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="aadharCardImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AadharCardImage</FormLabel>
                            <FormControl>
                              <input
                                type="file"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChangeFile}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {uploading && (
                        <span className="pl-2 text-yellow-500">
                          {" "}
                          Please wait file is uploading...{" "}
                        </span>
                      )}
                    </div>

                        <div>
                        <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                        </div>

                    <Button
                      disabled={uploading}
                      type="submit"
                      className="col-span-full"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
