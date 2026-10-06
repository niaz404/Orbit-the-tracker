"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck,
  User,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  getTrackerProgress,
  saveProblemProgress,
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "@/lib/storage";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";

export default function ProblemTrackerPage() {
  const params = useParams();
  const rawHandle = params?.handle;
  const handle = typeof rawHandle === "string" ? decodeURIComponent(rawHandle) : "";

  const [profile, setProfile] = useState(null);
  const [problems, setProblems] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookmarked, setBookmarked] = useState(false);

  // Pagination states: 15 problems per page by default
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Fetch solver profile & submissions
  const loadTrackerData = async () => {
    if (!handle) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch user profile
      const userRes = await fetch(`/api/codeforces/user/${encodeURIComponent(handle)}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setProfile(userData);
      }

      // 2. Fetch chronological, deduplicated, spoiler-free problem history
      const subsRes = await fetch(`/api/codeforces/submissions/${encodeURIComponent(handle)}`);
      const subsData = await subsRes.json();

      if (!subsRes.ok) {
        setError(subsData.error || "Failed to load problem history from Codeforces.");
        return;
      }

      setProblems(subsData.problems || []);
      
      // Load user's personal tracking progress
      const userProgress = getTrackerProgress(handle);
      setProgressMap(userProgress);
      setBookmarked(isBookmarked(handle));
    } catch (err) {
      console.error("Failed to load tracker:", err);
      setError("Unable to reach Codeforces API. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrackerData();
  }, [handle]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  // Update Problem Status
  const handleStatusChange = (problemId, newStatus) => {
    const updated = saveProblemProgress(handle, problemId, { status: newStatus });
    setProgressMap(updated);
  };

  // Update Time
  const handleTimeChange = (problemId, newTime) => {
    const updated = saveProblemProgress(handle, problemId, { time: newTime });
    setProgressMap(updated);
  };

  // Update Notes
  const handleNotesChange = (problemId, newNotes) => {
    const updated = saveProblemProgress(handle, problemId, { notes: newNotes });
    setProgressMap(updated);
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(handle);
      setBookmarked(false);
    } else {
      addBookmark(profile || { handle });
      setBookmarked(true);
    }
  };

  // Calculate Status Counts
  const stats = useMemo(() => {
    const total = problems.length;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    for (const p of problems) {
      const prog = progressMap[p.id]?.status || "not-started";
      if (prog === "done") completed++;
      else if (prog === "in-progress") inProgress++;
      else notStarted++;
    }

    return { total, completed, inProgress, notStarted };
  }, [problems, progressMap]);

  // Filter Problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const userStatus = progressMap[p.id]?.status || "not-started";

      if (!nameMatch) return false;
      if (statusFilter === "all") return true;
      return userStatus === statusFilter;
    });
  }, [problems, searchQuery, statusFilter, progressMap]);

  // Paginated Slice of Problems (15 per page)
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  return (
    <PageLayout
      title={`${handle}'s Problem Roadmap`}
      breadcrumbs={
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Link href="/workspace" className="hover:text-[var(--text-primary)] transition-colors">
            Workspace
          </Link>
          <span>/</span>
          <Link href={`/profile/${encodeURIComponent(handle)}`} className="hover:text-[var(--text-primary)] transition-colors">
            {handle}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium">Tracker</span>
        </div>
      }
      actions={
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant={bookmarked ? "secondary" : "primary"}
            size="sm"
            onClick={handleToggleBookmark}
            leftIcon={
              bookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <BookmarkPlus className="w-4 h-4" />
              )
            }
          >
            {bookmarked ? "In Workspace" : "Add to Workspace"}
          </Button>

          <Link href={`/profile/${encodeURIComponent(handle)}`}>
            <Button variant="outline" size="sm" leftIcon={<User className="w-3.5 h-3.5" />}>
              Profile
            </Button>
          </Link>

          {profile?.profileUrl && (
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block"
            >
              <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}>
                Codeforces
              </Button>
            </a>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Compact Filter / Search Bar directly above the Sheet */}
        {!isLoading && !error && problems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-[var(--border-subtle)] rounded-xl w-full sm:w-auto overflow-x-auto">
              {[
                { id: "all", label: `All (${stats.total})` },
                { id: "not-started", label: `Not Started (${stats.notStarted})` },
                { id: "in-progress", label: `In Progress (${stats.inProgress})` },
                { id: "done", label: `Done (${stats.completed})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    statusFilter === tab.id
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search within problems */}
            <div className="w-full sm:w-72">
              <SearchInput
                placeholder="Search problem title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <EmptyState
            icon={<AlertCircle className="w-5 h-5 text-[var(--status-error)]" />}
            title="Unable to Load Problem Tracker"
            description={error}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={loadTrackerData}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry
              </Button>
            }
          />
        )}

        {/* Empty History State */}
        {!isLoading && !error && problems.length === 0 && (
          <EmptyState
            icon={<Sparkles className="w-5 h-5 text-[var(--text-muted)]" />}
            title="No Solved Problems Found"
            description="This Codeforces profile has no public accepted submissions available to build a roadmap from."
            action={
              <Link href="/find-people">
                <Button variant="primary" size="sm">
                  Find Another Solver
                </Button>
              </Link>
            }
          />
        )}

        {/* Excel-like Spreadsheet Data Grid (15 problems per page) */}
        {!isLoading && !error && problems.length > 0 && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-3">
            <TableContainer className="border-[var(--border-muted)] shadow-xl">
              <TableHeader>
                <tr>
                  <TableHead className="w-14 text-center">#</TableHead>
                  <TableHead className="min-w-[280px]">Problem (External Link)</TableHead>
                  <TableHead className="w-36">My Status</TableHead>
                  <TableHead className="w-28">Time Spent</TableHead>
                  <TableHead className="min-w-[240px]">Personal Notes</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {paginatedProblems.length > 0 ? (
                  paginatedProblems.map((p, sliceIdx) => {
                    const globalIdx = (currentPage - 1) * pageSize + sliceIdx + 1;
                    const prog = progressMap[p.id] || {
                      status: "not-started",
                      time: "",
                      notes: "",
                    };
                    const isDone = prog.status === "done";
                    const isInProgress = prog.status === "in-progress";

                    return (
                      <TableRow
                        key={p.id}
                        isSelected={isDone}
                        className={cn(
                          "transition-colors group",
                          isDone && "bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12]",
                          isInProgress && "bg-amber-500/[0.08] hover:bg-amber-500/[0.12]"
                        )}
                      >
                        {/* 1. Sequence Number */}
                        <TableCell className="font-mono text-center text-[var(--text-muted)] text-xs">
                          {globalIdx}
                        </TableCell>

                        {/* 2. Problem Name Link (SPOILER-FREE) */}
                        <TableCell className="font-medium">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-primary)] hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 group/link"
                            title="Open problem on Codeforces (external link)"
                          >
                            <span className={cn(isDone && "line-through text-[var(--text-secondary)]")}>
                              {p.name}
                            </span>
                            <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover/link:text-indigo-300 shrink-0 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </TableCell>

                        {/* 3. My Status Selector */}
                        <TableCell>
                          <select
                            value={prog.status || "not-started"}
                            onChange={(e) => handleStatusChange(p.id, e.target.value)}
                            aria-label={`Status for ${p.name}`}
                            className={cn(
                              "text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer focus-ring outline-none w-full",
                              prog.status === "done" && "text-emerald-300 border-emerald-500/40 bg-emerald-500/15 font-semibold",
                              prog.status === "in-progress" && "text-amber-300 border-amber-500/40 bg-amber-500/15 font-semibold",
                              prog.status === "not-started" && "text-[var(--text-muted)] border-white/[0.08] bg-white/[0.04]"
                            )}
                          >
                            <option value="not-started" className="bg-[var(--bg-surface-elevated)]">Not Started</option>
                            <option value="in-progress" className="bg-[var(--bg-surface-elevated)]">In Progress</option>
                            <option value="done" className="bg-[var(--bg-surface-elevated)]">Done</option>
                          </select>
                        </TableCell>

                        {/* 4. Time Spent Input */}
                        <TableCell>
                          <input
                            type="text"
                            placeholder="e.g. 45m"
                            aria-label={`Time spent on ${p.name}`}
                            defaultValue={prog.time || ""}
                            onBlur={(e) => handleTimeChange(p.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-full text-xs font-mono px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] focus:border-indigo-500 rounded-xl focus-ring text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                          />
                        </TableCell>

                        {/* 5. Personal Notes Input */}
                        <TableCell>
                          <input
                            type="text"
                            placeholder="Add observations..."
                            aria-label={`Notes for ${p.name}`}
                            defaultValue={prog.notes || ""}
                            onBlur={(e) => handleNotesChange(p.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-full text-xs px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] focus:border-indigo-500 rounded-xl focus-ring text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-[var(--text-muted)]">
                      No problems match your current search or status filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableContainer>

            {/* Pagination Controls (15 per page) */}
            {filteredProblems.length > 0 && (
              <div className="p-2 rounded-2xl bg-white/[0.02] border border-[var(--border-subtle)]">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProblems.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[15, 30, 50, 100]}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
