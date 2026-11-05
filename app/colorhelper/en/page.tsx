import { redirect } from "next/navigation";

export default function EnglishRedirect() {
  redirect("/?lang=en");
}
