"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Globe,
  Building,
  ExternalLink,
  Plus,
  Check,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Code2,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { addBookmark, isBookmarked, removeBookmark } from "@/lib/storage";
import { slideUp, fadeIn } from "@/lib/animations";

export default function ProfilePage() {
  const params = useParams();
  const handle = params?.handle;

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const fetchProfile = async () => {
    if (!handle) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/codeforces/user/${encodeURIComponent(handle)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load Codeforces profile.");
        return;
      }

      setProfile(data);
      setBookmarked(isBookmarked(data.handle));
    } catch (err) {
      console.error("Profile load error:", err);
      setError("Unable to reach Codeforces. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [handle]);

  const handleToggleBookmark = () => {
    if (!profile) return;
    if (bookmarked) {
      removeBookmark(profile.handle);
      setBookmarked(false);
    } else {
      addBookmark(profile);
      setBookmarked(true);
    }
  };

  return (
    <PageLayout
      title={profile ? profile.handle : "Solver Profile"}
      description={
        profile
          ? `Verified Codeforces account of ${profile.handle}. Add them to your workspace to follow their problem roadmaps.`
          : "Loading profile details from Codeforces..."
      }
      breadcrumbs={
        <div className="flex items-center gap-1.5">
          <Link href="/find-people" className="hover:text-[var(--text-primary)]">
            Find People
          </Link>
          <span>/</span>
          <span>{handle}</span>
        </div>
      }
      actions={
        profile && (
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant={bookmarked ? "secondary" : "primary"}
              size="sm"
              onClick={handleToggleBookmark}
              leftIcon={
                bookmarked ? (
                  <Check className="w-4 h-4 text-[var(--status-success)]" />
                ) : (
                  <Plus className="w-4 h-4" />
                )
              }
            >
              {bookmarked ? "In Workspace" : "Add to Workspace"}
            </Button>

            <Link href={`/tracker/${encodeURIComponent(profile.handle)}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Code2 className="w-3.5 h-3.5" />}
                rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
              >
                Open Tracker
              </Button>
            </Link>
          </div>
        )
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Loading Skeleton */}
        {isLoading && (
          <Card variant="primary">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <EmptyState
            icon={<AlertCircle className="w-5 h-5 text-[var(--status-error)]" />}
            title="Profile Unavailable"
            description={error}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchProfile}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry
              </Button>
            }
          />
        )}

        {/* Verified Profile Card */}
        {!isLoading && profile && (
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="space-y-6">
            <Card variant="primary">
              <CardHeader className="bg-[var(--bg-surface-secondary)]/30">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={profile.avatar}
                    fallback={profile.handle}
                    size="xl"
                    className="border-2 border-[var(--border-muted)] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                        {profile.handle}
                      </h2>
                      {profile.rating > 0 && (
                        <Badge rating={profile.rating}>
                          Rating {profile.rating}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 capitalize flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                      <span>{profile.rank}</span>
                      {profile.maxRating > 0 && (
                        <span className="text-[var(--text-muted)] font-mono">
                          (Max: {profile.maxRating} — {profile.maxRank})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {(profile.firstName || profile.lastName) && (
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)]">Full Name</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {[profile.firstName, profile.lastName].filter(Boolean).join(" ")}
                      </span>
                    </div>
                  )}

                  {profile.organization && (
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        Organization
                      </span>
                      <span className="font-medium text-[var(--text-primary)] truncate max-w-[180px]">
                        {profile.organization}
                      </span>
                    </div>
                  )}

                  {profile.country && (
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        Location
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {[profile.city, profile.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)]">Codeforces Profile</span>
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      codeforces.com/profile/{profile.handle} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-4 bg-[var(--bg-surface-secondary)]/20">
                <span className="text-xs text-[var(--text-muted)]">
                  {bookmarked ? "Bookmarked in your Workspace" : "Not yet added to workspace"}
                </span>

                <Link href={`/tracker/${encodeURIComponent(profile.handle)}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                    Open Problem Tracker
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
