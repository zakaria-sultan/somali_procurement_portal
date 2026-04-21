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
          Upload PDF or Word attachments, add requirements in one block, and
          set contact details in the form — no raw JSON.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewTenderForm />
      </CardContent>
    </Card>
  );
}
