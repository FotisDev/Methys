'use client'
import { LogoutAction } from "@/_lib/backend/logoutAction/action";
import { createSupabaseBrowserClient } from "@/_lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function LogoutButton({className = ""}:{className?:string}){
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    
    const handleLogout = async()=>{
        setLoading(true);
        try{
            await supabase.auth.signOut();
            
            await LogoutAction();
            
            router.push("/");
            router.refresh();
        } catch (error){
            console.error("logout failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
        onClick={handleLogout}
        disabled={loading}
        className={`bg-default-cold hover:bg-default-yellow text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading? 'Logging out...':"Logout"}
        </button>
    );
}
