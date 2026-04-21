import { NewBlogForm } from "@/components/admin/blog-admin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminNewBlogPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New article</CardTitle>
        <CardDescription>
          Separate paragraphs with a blank line. Optional hero image uploads to
          Blob.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewBlogForm />
      </CardContent>
    </Card>
  );
}
