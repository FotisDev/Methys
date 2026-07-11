import { getMainCategories } from "@/_lib/backend/CategoryById/action";
import DropDownMenuClient from "./DropDownMenuClient";

export default async function DropDownMenu() {
  const mainCategories = await getMainCategories();
  return <DropDownMenuClient mainCategories={mainCategories} />;
}
