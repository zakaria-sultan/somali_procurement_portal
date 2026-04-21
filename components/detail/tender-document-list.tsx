import { Download } from "lucide-react";

import type { TenderDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

function suggestedFilename(doc: TenderDocument): string | undefined {
  if (doc.downloadAs?.trim()) return doc.downloadAs.trim();
  const fromName = doc.name.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_");
  return fromName.length > 2 ? fromName : undefined;
}

export function TenderDocumentList({
  documents,
  className,
}: {
  documents: TenderDocument[];
  className?: string;
}) {
  return (
    <ul className={cn("mt-4 flex flex-col gap-2", className)}>
      {documents.map((doc) => {
        const download = suggestedFilename(doc);
        return (
          <li key={doc.name}>
            <a
              href={doc.href}
              download={download}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:text-primary/90 hover:underline"
            >
              <Download className="size-4 shrink-0 text-primary" aria-hidden />
              {doc.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
