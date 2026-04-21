import { notFound } from "next/navigation";

import { EditMarketplaceForm } from "@/components/admin/marketplace-admin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapMarketplaceDetail } from "@/lib/db-map";
import prisma from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditMarketplacePage({ params }: Props) {
  const { id } = await params;
  const row = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!row) notFound();
  const item = mapMarketplaceDetail(row);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit listing</CardTitle>
        <CardDescription>{item.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <EditMarketplaceForm item={item} />
      </CardContent>
    </Card>
  );
}
