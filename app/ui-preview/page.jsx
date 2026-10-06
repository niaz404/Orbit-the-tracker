"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Palette,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Search,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Plus,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input, SearchInput } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";

export default function UIPreviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoProgress, setDemoProgress] = useState(65);

  return (
    <PageLayout
      title="UI Component Lab"
      description="Visual inspection lab for all reusable design system atoms, primitives, and interaction states."
      badge={<Badge variant="accent">Phase 2 Verification</Badge>}
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Test Modal Dialog
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Section 1: Buttons & Interactive Elements */}
        <Card variant="primary">
          <CardHeader>
            <CardTitle>1. Button Variants & Interactive States</CardTitle>
            <CardDescription>
              Keyboard accessible, responsive touch-down scale (`active:scale-[0.98]`), and loading state spinners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
                Style Variants
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="subtle">Subtle Indigo</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger / Destructive</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" isLoading>Loading State</Button>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
                Sizes & Icon Buttons
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="secondary" size="xs">Extra Small (xs)</Button>
                <Button variant="secondary" size="sm">Small (sm)</Button>
                <Button variant="secondary" size="md">Medium (md)</Button>
                <Button variant="secondary" size="lg">Large (lg)</Button>
                <Tooltip content="Quick action tooltip">
                  <Button variant="secondary" size="icon" title="Add item">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Form Inputs & Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="primary">
            <CardHeader>
              <CardTitle>2. Input & Search Controls</CardTitle>
              <CardDescription>
                Designed for handle lookup, query filtering, and form submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchInput placeholder="Search Codeforces handle (e.g. tourist)..." />
              <Input
                label="Problem Filter"
                placeholder="Filter by tag (dp, graphs, trees)..."
                helperText="Enter comma-separated problem tags."
              />
              <Input
                label="Validation Error State"
                defaultValue="invalid_cf_user_#"
                error="Username contains invalid characters."
              />
            </CardContent>
          </Card>

          {/* Section 3: Badges & Status Indicators */}
          <Card variant="primary">
            <CardHeader>
              <CardTitle>3. Badges, Ratings & Status Indicators</CardTitle>
              <CardDescription>
                Semantic problem verdicts, Codeforces rating tiers, and live sync markers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Problem Status Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge status="ac" dot />
                  <Badge status="done" dot />
                  <Badge status="in-progress" dot />
                  <Badge status="not-started" />
                  <Badge status="wa" dot />
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Codeforces Difficulty Badges
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge rating={800}>Newbie (800)</Badge>
                  <Badge rating={1300}>Pupil (1300)</Badge>
                  <Badge rating={1500}>Specialist (1500)</Badge>
                  <Badge rating={1700}>Expert (1700)</Badge>
                  <Badge rating={2000}>Candidate Master (2000)</Badge>
                  <Badge rating={2300}>Master (2300)</Badge>
                  <Badge rating={2600}>Grandmaster (2600)</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Live Status Dots
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <StatusIndicator status="active" pulse label="Connected" />
                  <StatusIndicator status="idle" label="Idle" />
                  <StatusIndicator status="syncing" label="Indexing CF Data" />
                  <StatusIndicator status="error" label="Rate Limited" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Avatars, Tooltips & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="primary">
            <CardHeader>
              <CardTitle>4. Avatars</CardTitle>
              <CardDescription>Different size standards with online indicators.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar fallback="XS" size="xs" />
              <Avatar fallback="SM" size="sm" status="online" />
              <Avatar fallback="MD" size="md" status="idle" />
              <Avatar fallback="LG" size="lg" status="online" />
              <Avatar fallback="XL" size="xl" />
            </CardContent>
          </Card>

          <Card variant="primary">
            <CardHeader>
              <CardTitle>5. Tooltip Micro-Interactions</CardTitle>
              <CardDescription>Hover over badges to view contextual hints.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <Tooltip content="Tooltip above element" position="top">
                <Button variant="secondary" size="sm">Top Tooltip</Button>
              </Tooltip>
              <Tooltip content="Tooltip below element" position="bottom">
                <Button variant="secondary" size="sm">Bottom Tooltip</Button>
              </Tooltip>
            </CardContent>
          </Card>

          <Card variant="primary">
            <CardHeader>
              <CardTitle>6. Progress Indicator</CardTitle>
              <CardDescription>Smooth animated progress bar for stats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={demoProgress} max={100} showLabel />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setDemoProgress((prev) => Math.max(0, prev - 15))}
                >
                  -15%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setDemoProgress((prev) => Math.min(100, prev + 15))}
                >
                  +15%
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: Skeletons & Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="primary">
            <CardHeader>
              <CardTitle>7. Skeleton Loading Shimmers</CardTitle>
              <CardDescription>Zero layout shift placeholders while fetching submissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card variant="primary">
            <CardHeader>
              <CardTitle>8. Empty State Primitive</CardTitle>
              <CardDescription>Standardized empty container with action slot.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Layers className="w-4 h-4" />}
                title="No Submissions Indexed"
                description="When problems are fetched, they will populate this matrix."
                action={
                  <Button variant="secondary" size="xs">
                    Trigger Sample Fetch
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          <ModalTitle>Add Codeforces Solver</ModalTitle>
          <ModalDescription>
            Add a public Codeforces handle to bookmark and sync problem solves.
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-3">
            <SearchInput placeholder="Enter handle (e.g. tourist, Benq)..." />
            <div className="p-3 rounded-md bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              This is a reusable modal primitive configured with Framer Motion scale-in and backdrop-blur animations.
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(false)}
          >
            Confirm & Track
          </Button>
        </ModalFooter>
      </Modal>
    </PageLayout>
  );
}
