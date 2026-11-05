import { redirect } from "next/navigation";

export default function PersonalColorHelperRedirect({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang ? `?lang=${searchParams.lang}` : "";
  redirect(`/${lang}`);
}
