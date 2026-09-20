export const COOKIE_KEYS = {
  PREFERRED_HOME_ROUTE: "preferred_home_route",
  LAST_CLASSIC_JOB_ID: "last_classic_job_id",
} as const;

export const ENTRY_ROUTES = {
  ACCESS_CARDS: "/photo-galleries/access-cards",
  CLASSIC: "/photo-galleries/classic",
} as const;

export type EntryRoute = (typeof ENTRY_ROUTES)[keyof typeof ENTRY_ROUTES];

export const DEFAULT_ENTRY_ROUTE: EntryRoute = ENTRY_ROUTES.ACCESS_CARDS;
