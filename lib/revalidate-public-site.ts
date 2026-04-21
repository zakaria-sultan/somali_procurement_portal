import { revalidatePath } from "next/cache";

/** Invalidate marketing routes after content changes. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/tenders");
  revalidatePath("/marketplace");
  revalidatePath("/blogs");
}
