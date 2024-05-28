import React, { useState } from "react";
import Layout from "../../components/layout";
import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";
import { ContractAddress } from "../../constants/ContractAddress";
import { abi } from "../../constants/ABIcontract";
import { set, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/components/ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
  area: z.number().positive({ message: "Area must be a positive number." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  price: z.number().min(2, { message: "Price must be at least 2 characters." }),
  propertyPID: z.number().min(2, { message: "Property PID must be at least 2 characters." }),
  physicalSurveyNo: z.number().min(2, { message: "Physical Survey No. must be at least 2 characters." }),
  landImage: z.string().min(2, { message: "Land Image must be at least 2 characters." }),
  adharCardImage: z.string().min(2, { message: "Adhar Card Image must be at least 2 characters." }),


});

const AddLand = () => {
  const [landImageLoading, setLandImageLoading] = useState(false);
  const [adharCardImageLoading, setAdharCardImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: null,
      city: "",
      state: "",
      price: null,
      propertyPID: null,
      physicalSurveyNo: null,
      landImage: "",
      adharCardImage: "",
    },
  });



 

  const uploadFile = async (fileToUpload, name) => {
    console.log("🚀 ~ uploadFile ~ name:", name);
    console.log("fileToUpload", fileToUpload);
    try {
      if (name === "landImage") {
        setLandImageLoading(true);
      } else if (name === "adharCardImage") {
        setAdharCardImageLoading(true);
      }
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();

      console.log(ipfsHash);
      if (ipfsHash) {
        if (name === "landImage") {
          setLandImageLoading(false);
          form.setValue(name, ipfsHash);
        } else if (name === "adharCardImage") {
          form.setValue(name, ipfsHash);
          setAdharCardImageLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    }
  };




  const onSubmit = async (value) => {
    console.log("🚀 ~ handleSubmit ~ value:", value)
    try {
      setLoading(true);
        const { request } = await prepareWriteContract({
          address: ContractAddress,
          abi: abi,
          functionName: "addLand",
          args: [
            value.area,
            value.city,
            value.state,
            value.price,
            value.propertyPID,
            value.physicalSurveyNo,
            value.landImage,
            value.adharCardImage,
          ],
        });

        const { hash } = await writeContract(request);

        console.log("hash", hash);

        const txWait =  waitForTransaction({ hash:  hash });

        console.log("txWait", txWait);

         await toast.promise(txWait, {
          loading: "Waiting for transaction to complete",
          success: "Transaction completed successfully",
          error: "Transaction failed",
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.shortMessage) {
        const match = error.shortMessage.match(/reason:\n\s*(.*)/);
        toast.error(match[1].trim());
      } 
      else {
        toast.error(error);
      }
    }
  };

  return (
    <Layout>
      <div className="p-3 pt-0">
        <h1 className="font-bold  text-xl">Add Land</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6  md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (in sqm.)</FormLabel>
                  <FormControl>
                    <Input id="area" type='number' placeholder="area" {...field}  onChange={(e) => {
                                const value = e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined;
                                if (!isNaN(value) || value === undefined) {
                                  field.onChange(value);
                                }
                              }}  />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input id="city" placeholder="city" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input id="state" placeholder="state" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input id="price" placeholder="price" {...field}  onChange={(e) => {
                                const value = e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined;
                                if (!isNaN(value) || value === undefined) {
                                  field.onChange(value);
                                }
                              }}/>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyPID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property PID Number</FormLabel>
                  <FormControl>
                    <Input type="number" id="propertyPID" placeholder="propertyPID" {...field} onChange={(e) => {
                                const value = e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined;
                                if (!isNaN(value) || value === undefined) {
                                  field.onChange(value);
                                }
                              }}  />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physicalSurveyNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Survey Number</FormLabel>
                  <FormControl>
                    <Input type='number' id="physicalSurveyNo" placeholder="Survey Number" {...field} onChange={(e) => {
                                const value = e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined;
                                if (!isNaN(value) || value === undefined) {
                                  field.onChange(value);
                                }
                              }} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="relative">

            <FormField
              control={form.control}
              name="landImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insert Land image</FormLabel>
                  <FormControl>
                    <Input onChange={(e) => uploadFile(e.target.files[0], "landImage")}  type="file" id="landImage" placeholder="landImage"  />
                  </FormControl>
                </FormItem>
              )}
              />
            {
              landImageLoading && <span className="pl-2 text-yellow-500 ">
              {" "}
              Please wait, file is uploading...{" "}
            </span>
            }
            </div>

            <div>

            <FormField
              control={form.control}
              name="adharCardImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insert Adhar card document</FormLabel>
                  <FormControl>
                    <Input onChange={(e) => uploadFile(e.target.files[0], "adharCardImage")}  type="file" id="adharCardImage" placeholder="adharCardImage"  />
                  </FormControl>
                </FormItem>
                
              )}
            />
            {
              adharCardImageLoading && <span className="pl-2 text-yellow-500 ">
              {" "}
              Please wait, file is uploading...{" "}
              </span>
            }
           
              </div>
           

            <Button disabled={adharCardImageLoading || landImageLoading || loading} type="submit" className="col-span-full">
              { loading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>

      </div>
    </Layout>
  );
};

export default AddLand;
