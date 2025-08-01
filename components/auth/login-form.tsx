"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl =searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
 ? " Email already in use with different provider! "
 : "";

  const [showTwoFactor,setShowTwoFactor] = useState(false);
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values , callbackUrl)
      .then((data)=>{
       if (data?.success){
        form.reset();
        setSuccess(data.success);
       }

       if (data?.success) {
        form.reset();
        setSuccess(data.success);
       }

       if (data?.twoFactor){
        setShowTwoFactor(true);
       }
      }).catch(()=> setError("something went wrong"))
    });
  };

  return (
    <CardWrapper
      headerLabel="welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
         onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Two Factor Code </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled ={isPending}
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            )}
            {!showTwoFactor && (
              <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled ={isPending}
                      placeholder="john.doe@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> password </FormLabel>
                  <FormControl>
                    <Input 
                    {...field}
                    disabled ={isPending}
                     placeholder="******" 
                     type="password" 
                     />
                  </FormControl>
                  <Button
                  size="sm"
                  variant= "link"
                  asChild
                  className="px-0"
                  >
                  <Link href="/auth/reset">
                  forgot password?
                  </Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            </>
            )}
          </div>

          <FormError message={error || urlError } />
          <FormSuccess message={success} />
          <Button 
          disabled ={isPending}
          type="submit" 
          className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
