import { NewMarketplaceForm } from "@/components/admin/marketplace-admin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminNewMarketplacePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New marketplace listing</CardTitle>
        <CardDescription>
          Upload an image or provide a direct HTTPS URL. Highlights and contact
          are JSON.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewMarketplaceForm />
      </CardContent>
    </Card>
  );
}
