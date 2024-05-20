import Header from "../../components/Header";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "/components/components/ui/form.jsx";
import { Input } from "/components/components/ui/input.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../components/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/components/ui/button";
import { useEffect, useState } from "react";
import { prepareWriteContract, writeContract, waitForTransaction , readContract} from "@wagmi/core";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import toast from "react-hot-toast";
import { useRouter , } from "next/navigation";
import { useAccount, useContractRead } from "wagmi";

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
  aadharCardImage: z.string()
});

const RegisterSeller = () => {
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
    },
  });

  const uploadFile = async (fileToUpload) => {
    try {
      console.log(fileToUpload.name);
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      form.setValue("aadharCardImage", ipfsHash);
      console.log(ipfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleFileUpload = (e) => {
    uploadFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  // console.log(form.getValues().age);


  const { data, isError, isLoading } = useContractRead({
    address: ContractAddress,
    abi: abi,
    functionName: 'getSeller',
  })

  useEffect(() => {
   if(data){
    if(data[0] == address ){
      router.push('/Dashboard');
      
    }
   }

  },[data])


  const onSubmit = async ({
    username,
    age,
    aadharCardNo,
    panCardNo,
    ownedLands,
    aadharCardImage,
  }) => {



   try {
    const { request } = await prepareWriteContract({
      address: ContractAddress,
      abi: abi,
      functionName: "registerSeller",
      args: [
        username,
        age,
        aadharCardNo,
        panCardNo,
        ownedLands,
        aadharCardImage,
      ],
    });



    const { hash } = await writeContract(request);

    const txWait = waitForTransaction({
      hash: hash,
    });

    const result = await toast.promise(txWait, {
      loading: "Waiting for transaction to complete",
      success: "Transaction completed successfully",
      error: "Transaction failed",
    });

    if(result.status == 'success'){
      router.push('/Dashboard');
    }
 
   } catch (error) {
      console.log(error);
   }
  };

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
                                onChange={handleFileUpload}
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

export default RegisterSeller;
