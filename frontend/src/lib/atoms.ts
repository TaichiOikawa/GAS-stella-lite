import { atom } from "jotai";

export const userIdAtom = atom<
  { userId: string; studentId: string } | null | undefined
>(undefined);
