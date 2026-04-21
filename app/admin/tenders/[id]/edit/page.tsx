import { notFound } from "next/navigation";

import { EditTenderForm } from "@/components/admin/tender-admin-form";
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
        <EditTenderForm
          tender={tender}
          postedAt={row.postedDate}
          expiresAt={row.expiryDate}
        />
      </CardContent>
    </Card>
  );
}
