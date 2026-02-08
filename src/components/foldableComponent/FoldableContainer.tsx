"use client";



interface FoldableContainerProps {
  title: string;
  children: React.ReactNode;

}

export default function FoldableContainer({
  children,
}: FoldableContainerProps) {

  return (
    <div className="flex flex-col gap-3">
        {children}  
    </div>
  );
}
