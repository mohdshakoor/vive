"use server";

import { RegisterSchema} from "@/schemas";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";

export const register = async (values : z.infer<typeof RegisterSchema>) => {
   const validateFields = RegisterSchema.safeParse(values);

   if(!validateFields.success){
    return { error: "Invalid fields!"};
   }
    
   const {email,password,name} = validateFields.data;
   const hashedpassword = await bcrypt.hash(password,10)
    
   const existingUser = await getUserByEmail(email);                  

   if(existingUser){
      return {error: "Email already in use!"}
   }

   await db.user.create({
    data:{
      name,
      email,
      password:hashedpassword,
    },
   });

   // TODO: Send varification token

   return {success:"User created"};
};