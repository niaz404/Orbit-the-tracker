"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Sparkles,
  Award,
  ArrowRight,
  Trash2,
  ExternalLink,
  Code2,
  CheckCircle2,
  Search,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/input";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal";
import { getBookmarks, removeBookmark, getWorkspaceStats } from "@/lib/storage";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";

export default function WorkspacePage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [statsMap, setStatsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadWorkspace = () => {
    const list = getBookmarks();
    setBookmarks(list);

    // Calculate stats for each solver
    const stats = {};
    for (const user of list) {
      stats[user.handle.toLowerCase()] = getWorkspaceStats(user.handle);
    }
    setStatsMap(stats);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWorkspace();

    const handleSync = () => loadWorkspace();
    window.addEventListener("codetrack_bookmarks_updated", handleSync);
    window.addEventListener("codetrack_progress_updated", handleSync);
    return () => {
      window.removeEventListener("codetrack_bookmarks_updated", handleSync);
      window.removeEventListener("codetrack_progress_updated", handleSync);
    };
  }, []);

  const confirmDelete = () => {
    if (deleteTarget) {
      removeBookmark(deleteTarget.handle);
      setDeleteTarget(null);
    }
  };

  const filteredBookmarks = bookmarks.filter((b) =>
    b.handle.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <PageLayout
      title="Workspace"
      description="Track your progress across bookmarked Codeforces problem solvers and follow their roadmaps."
      badge={
        <Badge variant={bookmarks.length > 0 ? "accent" : "default"}>
          {bookmarks.length} {bookmarks.length === 1 ? "Solver" : "Solvers"}
        </Badge>
      }
      actions={
        <Link href="/find-people">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Find People
          </Button>
        </Link>
      }
    >
      {/* Search Filter Bar if multiple bookmarks */}
      {!isLoading && bookmarks.length > 3 && (
        <div className="w-full sm:w-72 mb-4">
          <SearchInput
            placeholder="Filter solvers..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
      )}

      {/* Workspace Grid */}
      {!isLoading && filteredBookmarks.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredBookmarks.map((user) => {
              const userStats = statsMap[user.handle.toLowerCase()] || {
                total: 0,
                completed: 0,
                percentage: 0,
              };

              return (
                <motion.div
                  key={user.handle}
                  variants={staggerItem}
                  layout
                  className="h-full"
                >
                  <Card
                    variant="interactive"
                    className="h-full flex flex-col justify-between group hover:border-[var(--border-strong)] transition-all"
                  >
                    <Link
                      href={`/tracker/${encodeURIComponent(user.handle)}`}
                      className="block p-5 flex-1 space-y-4"
                    >
                      {/* Top Row: User Avatar & Basic Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar
                            src={user.avatar}
                            fallback={user.handle}
                            size="lg"
                            className="border border-[var(--border-muted)] shrink-0 group-hover:border-[var(--accent-border)] transition-colors"
                          />
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-text)] transition-colors truncate">
                              {user.handle}
                            </h3>
                            <p className="text-[11px] text-[var(--text-secondary)] capitalize truncate flex items-center gap-1">
                              <Award className="w-3 h-3 text-[var(--accent-text)]" />
                              <span>{user.rank || "unranked"}</span>
                            </p>
                          </div>
                        </div>

                        {user.rating > 0 && (
                          <Badge rating={user.rating} className="shrink-0">
                            {user.rating}
                          </Badge>
                        )}
                      </div>

                      {/* Middle: Stats Counters */}
                      <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success)]" />
                            Completed
                          </span>
                          <span className="font-mono font-medium text-[var(--text-primary)]">
                            {userStats.completed} Solved
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                            <span>Roadmap Progress</span>
                            <span className="font-mono font-medium text-[var(--accent-text)]">
                              {userStats.percentage}%
                            </span>
                          </div>
                          <Progress
                            value={userStats.completed}
                            max={userStats.total > 0 ? userStats.total : 100}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </Link>

                    {/* Bottom Action Footer */}
                    <CardFooter className="p-3 bg-[var(--bg-surface-secondary)]/30 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteTarget(user);
                        }}
                        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--status-error-bg)] transition-colors cursor-pointer text-xs flex items-center gap-1"
                        title="Remove solver from workspace"
                        aria-label={`Remove ${user.handle} from workspace`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Remove</span>
                      </button>

                      <Link
                        href={`/tracker/${encodeURIComponent(user.handle)}`}
                        className="text-xs font-medium text-[var(--accent-text)] hover:text-[var(--accent-hover)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Open Tracker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && bookmarks.length === 0 && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="py-12 sm:py-20">
          <EmptyState
            icon={<Sparkles className="w-5 h-5 text-[var(--accent-text)]" />}
            title="Your workspace is empty"
            description="Find a Codeforces problem solver and add them to your workspace to start learning from their problem-solving journey."
            action={
              <Link href="/find-people">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Find People
                </Button>
              </Link>
            }
          />
        </motion.div>
      )}

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        size="sm"
      >
        <ModalHeader onClose={() => setDeleteTarget(null)}>
          <ModalTitle>Remove from Workspace</ModalTitle>
          <ModalDescription>
            Are you sure you want to remove {deleteTarget?.handle} from your workspace?
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Your personal notes and time spent on problems will remain safely stored on your device if you add them back later.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </PageLayout>
  );
}
