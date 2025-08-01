"use client"

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card ,CardHeader,CardContent} from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const AdminPage = () => {
    const onServerActionClick = () =>{
        admin()
        .then((data)=>{
            if(data.error){
                toast.error(data.error);
            }
            if(data.success){
                toast.success(data.success);
            }
        })
    }

    const onApiRouteClick = () => {
        fetch("api/admin")
        .then((Response) =>{
            if(Response.ok) {
                toast.success("Allowed API Route!")
            }else{
                toast.success("Forbidden API Route!")
            }
        })
    }         

    return ( 
       <Card className="w-[600px]">
        <CardHeader className="text-2xl font-semibold text-center">
         <p>
            🔑Admin
         </p>
        </CardHeader>
        <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
           <FormSuccess
           message="You are allowed to see this content!"
           />
        </RoleGate>
        <div className="flex flex-row items-center justify-between
         rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only-api-Route
          </p>
          <Button onClick={onApiRouteClick}> 
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between
         rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only Server Action
          </p>
          <Button onClick={onServerActionClick}> 
            Click to test
          </Button>
        </div>

        </CardContent>
       </Card>
     );
}
 
export default AdminPage;