import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_KEYS,
  ENTRY_ROUTES,
  DEFAULT_ENTRY_ROUTE,
  EntryRoute,
} from "@/common/constants/routes";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const savedRoute = cookieStore.get(COOKIE_KEYS.PREFERRED_HOME_ROUTE)?.value;

  const targetRoute: EntryRoute =
    savedRoute &&
    Object.values(ENTRY_ROUTES).includes(savedRoute as EntryRoute)
      ? (savedRoute as EntryRoute)
      : DEFAULT_ENTRY_ROUTE;

  if (targetRoute === ENTRY_ROUTES.CLASSIC) {
    const savedJobId = cookieStore.get(COOKIE_KEYS.LAST_CLASSIC_JOB_ID)?.value;
    if (savedJobId) {
      redirect(`/${locale}${targetRoute}?jobId=${savedJobId}`);
    }
  }

  redirect(`/${locale}${targetRoute}`);
}
