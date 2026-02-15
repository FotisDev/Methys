import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Card = ({ children }: { children: React.ReactNode }) => {


 const [isDesktop, setIsDesktop] = useState(false);
 
   useEffect(() => {
     const checkScreenSize = () => {
       setIsDesktop(window.innerWidth >= 768); 
     };
 
     checkScreenSize();
     window.addEventListener("resize", checkScreenSize);
 
     return () => window.removeEventListener("resize", checkScreenSize);
   }, []);

   const baseStyle: React.CSSProperties = {
    padding: "14px",
    margin: "120px auto",
    // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
    // border: "0px solid #ddd",
    borderRadius: "18px",
    boxSizing: "border-box",
    width: "60%",
    height:"10%", 
    maxWidth: "1600px",
    backgroundColor: "#fff",
    
   }

   const hoverEffect = isDesktop
    ? {
    
        backgroundColor: "rgb(245, 158, 11)",
        color: "black",
        zIndex: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      
      }
    : {};
    return (
    <motion.div
      style={baseStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={hoverEffect}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
  };
  