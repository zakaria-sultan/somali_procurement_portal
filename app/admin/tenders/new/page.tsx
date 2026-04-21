import { NewTenderForm } from "@/components/admin/tender-admin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminNewTenderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New tender</CardTitle>
        <CardDescription>
          Upload PDF, Word, or ZIP documents; use the rich-text fields for
          requirements and how to apply; set buyer contact below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewTenderForm />
      </CardContent>
    </Card>
  );
}
