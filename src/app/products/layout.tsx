export default function Layout({
  children,
  modal, // Προσθέτουμε το modal slot
}: {
  children: React.ReactNode;
  modal?: React.ReactNode; // Προαιρετικό
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}