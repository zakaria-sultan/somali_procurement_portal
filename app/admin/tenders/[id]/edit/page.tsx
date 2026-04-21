import { notFound } from "next/navigation";

import { EditTenderFormLazy } from "@/components/admin/tender-admin-lazy-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapTenderDetail } from "@/lib/db-map";
import prisma from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditTenderPage({ params }: Props) {
  const { id } = await params;
  const row = await prisma.tender.findUnique({ where: { id } });
  if (!row) notFound();
  const tender = mapTenderDetail(row);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit tender</CardTitle>
        <CardDescription>{tender.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <EditTenderFormLazy
          tender={tender}
          postedAtIso={row.postedDate.toISOString()}
          expiresAtIso={row.expiryDate.toISOString()}
        />
      </CardContent>
    </Card>
  );
}
