"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <div className="container mx-auto py-12 max-w-3xl space-y-8">
      <Link href="/blog">
        <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <h1>Blog Post: {slug.replace(/-/g, ' ')}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground not-prose mb-8 border-b pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Feb 17, 2026
          </span>
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Admin
          </span>
        </div>

        <p>
          This is a placeholder for the blog post content. In a real application, 
          this content would be fetched from the backend API based on the slug: 
          <code>{slug}</code>.
        </p>
        
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
          ea commodo consequat.
        </p>

        <h2>Section Heading</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </article>
    </div>
  );
}
