"use client"

import * as z from "zod";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { SettingsSchema } from "@/schemas";
import { 
  Card,
 CardContent,
 CardHeader
  
 } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useTransition ,useState} from "react";

import { 
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from "@/components/ui/select";

import {
Form,
FormField,
FormItem,
FormLabel,
FormDescription,
FormMessage,
FormControl
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";


const SettingsPage = () => {
  const user = useCurrentUser();

  const [error ,setError]  = useState<string | undefined>();
  const [success,setSuccess]  = useState<string | undefined>();

  const {update} = useSession();
  const [isPending , startTransition] = useTransition();

  const form  = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues:{
      password:undefined,
      newPassword:undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role:user?.role || undefined,
      isTwoFactorEnabled:user?.isTwoFactorEnabled || undefined,
    }
  })

   const onSubmit = (values:z.infer<typeof SettingsSchema>) =>{
    startTransition(() => {
    settings(values)
    .then((data)=>{
      if(data.error){
        setError(data.error);
      }
      if(data.success){
        update();
        setSuccess(data.success);
      }
    })
    .catch(() => setError("something went wrong!"))
    })
   }

  return (
  <Card className="w-[600PX]">
    <CardHeader>
      <p className="text-2xl font-semibold text-center">
        🛠️Settings
      </p>
    </CardHeader>
    <CardContent>
      <Form {...form}>
       <form 
        className="space-y-6" 
        onSubmit={form.handleSubmit(onSubmit)}
         >
<div className="space-y-4-">
       <FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
      <Input {...field}
      placeholder="john doe"
       disabled={isPending}
        />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )}
/>

{user?.isOAuth === false && (
  <>
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
      <Input {...field}
      placeholder="john.doe@example.com"
      type="email"
       disabled={isPending}
        />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
      <Input {...field}
      placeholder="******"
      type="password"
       disabled={isPending}
        />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="newPassword"
  render={({ field }) => (
    <FormItem>
      <FormLabel>NewPassword</FormLabel>
      <FormControl>
      <Input {...field}
      placeholder="******"
      type="password"
       disabled={isPending}
        />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )}
/>
</>
)}

<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <FormControl>
        <Select
          disabled={isPending}
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{user?.isOAuth === false && (
<FormField
  control={form.control}
  name="isTwoFactorEnabled"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between
     rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>Two Factor Authentication</FormLabel>
        <FormDescription>
          Enable two factor authentication for your account
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          disabled={isPending}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
)}


</div>
<FormError message={error} />
<FormSuccess message={success} />
<Button
disabled ={isPending}
type="submit">
  Save
</Button>
       </form>
      </Form>
    </CardContent>
  </Card>
    )
};

export default SettingsPage;
