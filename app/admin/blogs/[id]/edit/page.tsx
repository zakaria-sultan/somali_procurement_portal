import { notFound } from "next/navigation";

import { EditBlogForm } from "@/components/admin/blog-admin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapBlogDetail } from "@/lib/db-map";
import prisma from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditBlogPage({ params }: Props) {
  const { id } = await params;
  const row = await prisma.blog.findUnique({ where: { id } });
  if (!row) notFound();
  const post = mapBlogDetail(row);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit article</CardTitle>
        <CardDescription>{post.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <EditBlogForm post={post} />
      </CardContent>
    </Card>
  );
}
