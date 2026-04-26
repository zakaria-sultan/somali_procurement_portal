"use client";

import { ListItem } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { Gapcursor } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  IndentDecrease,
  IndentIncrease,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Table2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tableDimInputClass =
  "h-8 w-11 shrink-0 rounded-md border border-border bg-background px-1 text-center text-xs font-medium tabular-nums text-foreground shadow-none outline-none transition-colors [color-scheme:light] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-muted/40 dark:text-foreground";

/** Lets users step out of a nested list (toward the next top-level number) with Ctrl/Cmd+Enter. */
const ListItemWithLiftShortcut = ListItem.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Mod-Enter": () => this.editor.commands.liftListItem("listItem"),
    };
  },
});

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-8 px-2"
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}

function clampTableDimension(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(20, Math.max(1, Math.floor(n)));
}

export function TenderRichTextEditor({
  name,
  defaultHtml,
  placeholder,
  minHeightClassName = "min-h-[200px]",
  className,
  /** When true (description field only), enables tables + insert controls. */
  enableTables = false,
}: {
  name: string;
  defaultHtml: string;
  placeholder: string;
  minHeightClassName?: string;
  className?: string;
  enableTables?: boolean;
}) {
  const [html, setHtml] = useState(defaultHtml);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  useEffect(() => {
    setHtml(defaultHtml);
  }, [defaultHtml]);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        listItem: false,
      }),
      ListItemWithLiftShortcut,
      Gapcursor,
      Placeholder.configure({ placeholder }),
      ...(enableTables
        ? [
            TableKit.configure({
              table: { resizable: false },
            }),
          ]
        : []),
    ],
    [enableTables, placeholder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: defaultHtml || undefined,
    editorProps: {
      attributes: {
        class: cn(
          "tender-rich-body prose prose-sm dark:prose-invert max-w-none px-3 py-2 outline-none",
          enableTables && "tender-rich-body--tables",
          "[&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol_ol]:list-[lower-alpha] [&_ol_ol]:pl-6 [&_ol_ol_ol]:list-[lower-roman]",
          "[&_ul_ul]:list-[circle] [&_ul_ul]:pl-6 [&_ul_ul_ul]:list-[square]",
          "[&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold",
          "[&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-offset-1 [&_.ProseMirror-selectednode]:outline-ring/60",
          minHeightClassName
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML());
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/40",
          minHeightClassName,
          className
        )}
      />
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <input type="hidden" name={name} value={html} readOnly />
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        {enableTables ? (
          <div
            className="ml-0.5 flex flex-wrap items-end gap-1.5 border-l border-border pl-1.5"
            title="Choose size, then click the table icon to insert at the cursor"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Rows
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) =>
                  setTableRows(clampTableDimension(Number.parseInt(e.target.value, 10)))
                }
                className={tableDimInputClass}
                aria-label="Number of table rows"
              />
            </div>
            <span
              className="pb-2 text-xs font-medium text-muted-foreground"
              aria-hidden
            >
              ×
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Cols
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={tableCols}
                onChange={(e) =>
                  setTableCols(clampTableDimension(Number.parseInt(e.target.value, 10)))
                }
                className={tableDimInputClass}
                aria-label="Number of table columns"
              />
            </div>
            <ToolbarButton
              label={`Insert ${tableRows}×${tableCols} table at cursor`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({
                    rows: tableRows,
                    cols: tableCols,
                    withHeaderRow: true,
                  })
                  .run()
              }
            >
              <Table2 className="size-4" />
            </ToolbarButton>
            {editor.isActive("table") ? (
              <ToolbarButton
                label="Delete table"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                <Trash2 className="size-4" />
              </ToolbarButton>
            ) : null}
          </div>
        ) : null}
        <ToolbarButton
          label="Indent list (nested)"
          disabled={!editor.can().sinkListItem("listItem")}
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        >
          <IndentIncrease className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Outdent list (Shift+Tab or Ctrl+Enter for next main number)"
          disabled={!editor.can().liftListItem("listItem")}
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        >
          <IndentDecrease className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
