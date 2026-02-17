"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BlogIndexPage() {
  const posts = [
    {
      slug: "welcome-to-karsaaz-qr",
      title: "Welcome to Karsaaz QR",
      excerpt: "Discover the power of dynamic QR codes and how they can transform your business.",
      date: "Feb 17, 2026",
    },
    {
      slug: "top-10-qr-code-uses",
      title: "Top 10 Creative Uses for QR Codes",
      excerpt: "From marketing to menus, explore the most innovative ways to use QR codes.",
      date: "Feb 10, 2026",
    },
  ];

  return (
    <div className="container mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-xl text-muted-foreground">Latest news, updates, and guides.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/post/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/blog/post/${post.slug}`} className="w-full">
                <Button variant="outline" className="w-full">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
