// "use client";
// import { useState } from "react";
// import { UseFormSetValue, UseFormRegister } from "react-hook-form";
// import Image from "next/image";
// import myImageLoader from "@/app/aws-loader";

// type Props = {
//   register: UseFormRegister<any>;
//   setValue: UseFormSetValue<any>;
// };

// const ProductImageUpload = ({ register, setValue }: Props) => {
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setValue("imageFile", file, { shouldValidate: true });
//       const url = URL.createObjectURL(file);
//       setPreviewUrl((prev) => {
//         if (prev) URL.revokeObjectURL(prev);
//         return url;
//       });
//     }
//   };

//   return (
//     <div>
//       <label className="block mb-1 font-medium">Product Image</label>
//       <input
//         type="file"
//         accept="image/*"
//         {...register("imageFile")}
//         onChange={handleFileChange}
//         className="w-full"
//       />
//       {previewUrl && (
//         <Image
//           loader={myImageLoader}
//           src={previewUrl}
//           alt="Preview"
//           className="mt-4 w-64 rounded"
//           width={256}
//           height={256}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductImageUpload;
