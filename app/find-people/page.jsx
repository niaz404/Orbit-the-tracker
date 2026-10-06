"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Sparkles,
  ExternalLink,
  Check,
  Plus,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Award,
  Globe,
  Building,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge, getRatingTier } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { addBookmark, isBookmarked, removeBookmark } from "@/lib/storage";
import { slideUp, fadeIn } from "@/lib/animations";

export default function FindPeoplePage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState(null); // 'not_found' | 'network' | null
  const [errorMessage, setErrorMessage] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const handle = query.trim();
    if (!handle) return;

    setIsLoading(true);
    setErrorType(null);
    setErrorMessage("");
    setSearchResult(null);

    try {
      const res = await fetch(`/api/codeforces/user/${encodeURIComponent(handle)}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setErrorType("not_found");
          setErrorMessage(data.error || "We couldn't find a Codeforces user with that username.");
        } else {
          setErrorType("network");
          setErrorMessage(data.error || "We couldn't reach Codeforces right now. Please try again.");
        }
        return;
      }

      setSearchResult(data);
      setBookmarked(isBookmarked(data.handle));
    } catch (err) {
      console.error("Search failed:", err);
      setErrorType("network");
      setErrorMessage("We couldn't reach Codeforces right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = () => {
    if (!searchResult) return;
    if (bookmarked) {
      removeBookmark(searchResult.handle);
      setBookmarked(false);
    } else {
      addBookmark(searchResult);
      setBookmarked(true);
    }
  };

  return (
    <PageLayout
      title="Find People"
      description="Lookup skilled Codeforces handles, verify their profile, and add them to your workspace to follow their problem-solving path."
      badge={<Badge variant="accent">Codeforces Verified</Badge>}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Search Input Box */}
        <Card variant="primary">
          <CardContent className="p-4 sm:p-5">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <SearchInput
                  placeholder="Search Codeforces username (e.g. tourist, Benq, Radewoosh)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading || !query.trim()}
                isLoading={isLoading}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Search Handle
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card variant="primary">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Successful Profile Result */}
        {!isLoading && searchResult && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <Card variant="primary" className="border-[var(--border-muted)]">
              <CardHeader className="bg-[var(--bg-surface-secondary)]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={searchResult.avatar}
                      fallback={searchResult.handle}
                      size="xl"
                      className="border-2 border-[var(--border-muted)]"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                          {searchResult.handle}
                        </h2>
                        {searchResult.rating > 0 && (
                          <Badge rating={searchResult.rating}>
                            {searchResult.rating}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 capitalize flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                        <span>{searchResult.rank}</span>
                        {searchResult.maxRating > 0 && (
                          <span className="text-[var(--text-muted)] font-mono">
                            (Max: {searchResult.maxRating} - {searchResult.maxRank})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center gap-2">
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
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {(searchResult.firstName || searchResult.lastName) && (
                    <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)]">Real Name</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {[searchResult.firstName, searchResult.lastName].filter(Boolean).join(" ")}
                      </span>
                    </div>
                  )}

                  {searchResult.organization && (
                    <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Org
                      </span>
                      <span className="font-medium text-[var(--text-primary)] truncate max-w-[160px]">
                        {searchResult.organization}
                      </span>
                    </div>
                  )}

                  {searchResult.country && (
                    <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Location
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {[searchResult.city, searchResult.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)]">Codeforces URL</span>
                    <a
                      href={searchResult.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-4">
                <Link
                  href={`/profile/${encodeURIComponent(searchResult.handle)}`}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  View Full Profile →
                </Link>

                <Link href={`/tracker/${encodeURIComponent(searchResult.handle)}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  >
                    Open Problem Tracker
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Error State: User Not Found */}
        {!isLoading && errorType === "not_found" && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <EmptyState
              icon={<Users className="w-5 h-5 text-[var(--status-warning)]" />}
              title="User Not Found"
              description={errorMessage}
            />
          </motion.div>
        )}

        {/* Error State: Network / API Failure */}
        {!isLoading && errorType === "network" && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <EmptyState
              icon={<AlertCircle className="w-5 h-5 text-[var(--status-error)]" />}
              title="Something Went Wrong"
              description={errorMessage}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSearch}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Try Again
                </Button>
              }
            />
          </motion.div>
        )}

        {/* Initial Empty State */}
        {!isLoading && !searchResult && !errorType && (
          <div className="py-10">
            <EmptyState
              icon={<Search className="w-5 h-5 text-[var(--text-muted)]" />}
              title="Search a Codeforces Handle"
              description="Type any valid Codeforces handle above to verify their profile and start learning from their solved problems."
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
