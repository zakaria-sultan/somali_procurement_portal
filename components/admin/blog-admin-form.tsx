"use client";

import { useActionState } from "react";

import {
  createBlogPost,
  updateBlogPost,
  type AdminActionState,
} from "@/app/actions/admin-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlogDetail } from "@/lib/types";

const initial: AdminActionState = { ok: true, message: "" };

export function NewBlogForm() {
  const [state, action] = useActionState(createBlogPost, initial);
  return <BlogFields action={action} state={state} />;
}

export function EditBlogForm({ post }: { post: BlogDetail }) {
  const [state, action] = useActionState(updateBlogPost, initial);
  return <BlogFields action={action} state={state} post={post} />;
}

function BlogFields({
  action,
  state,
  post,
}: {
  action: (payload: FormData) => void;
  state: AdminActionState;
  post?: BlogDetail;
}) {
  const contentDefault = post?.paragraphs.join("\n\n") ?? "";

  return (
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      {post?.imageUrl ? (
        <input type="hidden" name="imageUrl" value={post.imageUrl} />
      ) : null}
      {state.message && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={post?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            required
            defaultValue={post?.author}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            required
            defaultValue={post?.category}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="content">Content (paragraphs separated by blank lines)</Label>
          <Textarea
            id="content"
            name="content"
            required
            className="min-h-[200px] font-mono text-sm"
            defaultValue={contentDefault}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Cover image (optional, Vercel Blob)</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
        </div>
      </div>
      <Button type="submit" className="rounded-xl">
        {post ? "Save article" : "Publish article"}
      </Button>
    </form>
  );
}
