"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import qrCodeService from "@/services/qr.service";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
      ))}
    </div>
  );
}

interface Review {
  id: string | number;
  name?: string;
  reviewer_name?: string;
  rating?: number;
  feedback?: string;
  message?: string;
  comment?: string;
  email?: string;
  created_at?: string;
}

export default function QRReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [reviews, setReviews]   = useState<Review[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await qrCodeService.getBusinessReviewFeedbacks(id, { page });
      const data = (res as { data?: { data?: Review[] } })?.data ?? res;
      setReviews(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      setTotal(data?.total ?? 0);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/dashboard/qrcodes/${id}/stats`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Back to Stats
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Business Reviews
          </h1>
          <p className="text-sm text-muted-foreground">
            Customer feedback for QR code #{id}
            {total > 0 && <span className="ml-1">({total} total)</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReviews} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Customer Feedbacks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No reviews yet for this QR code.
            </div>
          ) : (
            <div className="divide-y">
              {reviews.map((review, i) => (
                <div key={review.id ?? i} className="p-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{review.name ?? review.reviewer_name ?? "Anonymous"}</p>
                        {review.rating != null && <StarRating rating={Number(review.rating)} />}
                      </div>
                      {review.feedback || review.message || review.comment ? (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {review.feedback ?? review.message ?? review.comment}
                        </p>
                      ) : null}
                      {review.email && (
                        <p className="text-xs text-muted-foreground mt-1">{review.email}</p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
