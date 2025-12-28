'use client'
import { LogoutAction } from "@/_lib/backend/logoutAction/action";
import { useState} from 'react';


export default function LogoutButton({className = ""}:{className?:string}){
    const [loading, setLoading] = useState(false);
    
    const handleLogout = async()=>{
        setLoading(true);
        try{
            await LogoutAction();
        } catch (error){
            console.error("logout failed",error);
            setLoading(false);
        }
    };

    return (
        <button
        onClick={handleLogout}
        disabled={loading}
        className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading? 'Logging out...':"Logout"}
        </button>
    );
}
