import { redirect } from "next/navigation";

export default function JapaneseRedirect() {
  redirect("/?lang=ja");
}
