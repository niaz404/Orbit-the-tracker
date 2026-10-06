"use client";

import React from "react";
import { Tv, Sparkles, Clock, Layers } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function YtExtractorPage() {
  return (
    <PageLayout
      title="YT Playlist Extractor"
      description="Extract and organize YouTube playlist content."
      badge={<Badge variant="warning">In Roadmap</Badge>}
    >
      <div className="max-w-2xl mx-auto py-8 sm:py-14 space-y-6">
        <EmptyState
          icon={<Tv className="w-5 h-5 text-[var(--accent-text)]" />}
          title="Coming Soon"
          description="This feature will allow you to extract and organize YouTube playlist content directly into structured problem-solving sheets."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-xs flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Automated Extraction</span>
              </CardTitle>
              <CardDescription>
                Extract timestamps, problem links, and video solutions automatically from competitive programming playlists.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                <span>Workspace Sync</span>
              </CardTitle>
              <CardDescription>
                Directly map playlist videos to your workspace problem-solving matrix and track completion.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
