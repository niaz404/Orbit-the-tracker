"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  FileJson,
  Sparkles,
  Info,
  Save,
  Check,
  AlertTriangle,
  Copy,
  ExternalLink,
  Key,
  Palette,
  Image as ImageIcon,
  Edit3,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal";
import { ImageCropperModal, BORDER_COLOR_PRESETS } from "@/components/ui/image-cropper-modal";
import {
  getAccountProfile,
  saveAccountProfile,
  exportAllData,
  importAllData,
  resetAllData,
  getBookmarks,
} from "@/lib/storage";
import { slideUp, fadeIn } from "@/lib/animations";

const BANNER_GRADIENTS = [
  { id: "gradient:indigo-purple", name: "Aurora Violet", css: "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950" },
  { id: "gradient:cyan-blue", name: "Cyberpunk Cyan", css: "bg-gradient-to-r from-cyan-950 via-blue-900 to-indigo-950" },
  { id: "gradient:emerald-teal", name: "Emerald Matrix", css: "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950" },
  { id: "gradient:rose-amber", name: "Solar Dusk", css: "bg-gradient-to-r from-rose-950 via-amber-950 to-purple-950" },
];

export default function SettingsPage() {
  const [account, setAccount] = useState({
    displayName: "Explorer",
    username: "orbit_user",
    uniqueCode: "ORB-100000",
    avatarUrl: "",
    avatarBorderColor: "#6366f1",
    bannerUrl: "gradient:indigo-purple",
    bio: "Focusing on competitive programming and problem-solving roadmaps.",
    createdAt: new Date().toISOString(),
  });

  const [displayNameInput, setDisplayNameInput] = useState("Explorer");
  const [usernameInput, setUsernameInput] = useState("orbit_user");
  const [bioInput, setBioInput] = useState("");
  const [selectedBorderColor, setSelectedBorderColor] = useState("#6366f1");
  const [selectedBanner, setSelectedBanner] = useState("gradient:indigo-purple");
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Image Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Reset Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState("");
  const [resetError, setResetError] = useState("");

  // Import feedback
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const loadData = () => {
    const acc = getAccountProfile();
    setAccount(acc);
    setDisplayNameInput(acc.displayName || "Explorer");
    setUsernameInput(acc.username || "orbit_user");
    setBioInput(acc.bio || "");
    setSelectedBorderColor(acc.avatarBorderColor || "#6366f1");
    setSelectedBanner(acc.bannerUrl || "gradient:indigo-purple");
    setBookmarkCount(getBookmarks().length);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("orbit_account_updated", handleUpdate);
    window.addEventListener("orbit_bookmarks_updated", handleUpdate);
    return () => {
      window.removeEventListener("orbit_account_updated", handleUpdate);
      window.removeEventListener("orbit_bookmarks_updated", handleUpdate);
    };
  }, []);

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!displayNameInput.trim()) return;

    saveAccountProfile({
      displayName: displayNameInput.trim(),
      username: usernameInput.trim() || "orbit_user",
      bio: bioInput.trim(),
      avatarBorderColor: selectedBorderColor,
      bannerUrl: selectedBanner,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImageSrc(event.target?.result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = ({ imageUrl, borderColor }) => {
    setSelectedBorderColor(borderColor);
    saveAccountProfile({
      avatarUrl: imageUrl,
      avatarBorderColor: borderColor,
    });
  };

  const handleBannerFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bannerData = event.target?.result;
      setSelectedBanner(bannerData);
      saveAccountProfile({ bannerUrl: bannerData });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(account.uniqueCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExport = () => {
    exportAllData();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const res = importAllData(text);
        if (res.success) {
          setImportStatus({
            type: "success",
            message: `Successfully imported ${res.count} solvers and your problem progress matrix.`,
          });
        } else {
          setImportStatus({
            type: "error",
            message: res.error || "Failed to parse backup file.",
          });
        }
      } catch (err) {
        setImportStatus({
          type: "error",
          message: "Invalid JSON backup file.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetConfirm = () => {
    if (resetConfirmInput.trim().toLowerCase() !== account.displayName.trim().toLowerCase()) {
      setResetError(`Please type "${account.displayName}" exactly to confirm.`);
      return;
    }

    resetAllData();
    setIsResetModalOpen(false);
    setResetConfirmInput("");
    setResetError("");
    setImportStatus({
      type: "success",
      message: "Account and local storage successfully wiped to factory default.",
    });
    loadData();
  };

  const currentBannerClass = BANNER_GRADIENTS.find((b) => b.id === selectedBanner)?.css;

  return (
    <PageLayout
      title="User Profile & Settings"
      description="Manage your profile identity, custom photo banner, and secure backup keys."
      badge={<Badge variant="accent">Cloud Migration Ready</Badge>}
    >
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* SECTION 1: LINKEDIN-STYLE PROFILE CARD WITH 50% OVERLAPPING AVATAR */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c0e17] overflow-hidden shadow-2xl relative">
          {/* Panoramic Banner Area (Top) */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 bg-[#090b14] overflow-hidden group">
            {selectedBanner.startsWith("data:") ? (
              <img
                src={selectedBanner}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${currentBannerClass || "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950"}`} />
            )}

            {/* Banner Camera Edit Trigger */}
            <input
              type="file"
              ref={bannerInputRef}
              accept="image/*"
              onChange={handleBannerFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="absolute top-4 right-4 p-2.5 px-3.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center gap-2 text-xs font-semibold shadow-2xl transition-all cursor-pointer hover:scale-105"
            >
              <Camera className="w-4 h-4 text-cyan-300" />
              <span>Change Banner</span>
            </button>
          </div>

          {/* Profile Card Body (Avatar 50% Overlapping Banner & 50% in Card) */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative bg-gradient-to-b from-[#0c0e17] to-[#080910]">
            {/* Top Row: Exactly 50% Overlapping Avatar on Left + Actions on Right */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-20 sm:-mt-24 md:-mt-24 mb-6 relative z-20">
              {/* Avatar (Large 4xl: half inside banner, half in card body) */}
              <div className="relative inline-block group shrink-0">
                <div className="p-1 sm:p-1.5 rounded-full bg-[#0c0e17] shadow-2xl ring-4 ring-[#0c0e17]">
                  <Avatar
                    src={account.avatarUrl}
                    fallback={displayNameInput}
                    size="4xl"
                    borderColor={selectedBorderColor}
                    className="shadow-2xl bg-[#090b14] block"
                  />
                </div>

                {/* Camera upload floating trigger */}
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2.5 sm:p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl border-2 border-[#0c0e17] cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Upload & Crop Avatar"
                  aria-label="Upload photo"
                >
                  <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>

              {/* Action Buttons on Right */}
              <div className="flex items-center gap-3 flex-wrap pt-2 sm:pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  leftIcon={<Camera className="w-4 h-4 text-indigo-300" />}
                >
                  Change Photo
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveProfile}
                  leftIcon={isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                >
                  {isSaved ? "Saved" : "Save Profile"}
                </Button>
              </div>
            </div>

            {/* LinkedIn-Style Identity Headline */}
            <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {displayNameInput || "Explorer"}
                </h1>
                <Badge variant="accent" dot>Active Solver</Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                <span className="font-mono font-semibold text-indigo-300 text-sm">
                  @{usernameInput.toLowerCase().replace(/[@\s]/g, "") || "orbit_user"}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{bookmarkCount} Bookmarked Solvers</span>
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono">{account.uniqueCode}</span>
                </span>
              </div>

              {bioInput && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
                  {bioInput}
                </p>
              )}
            </div>

            {/* EDITABLE PROFILE FORM */}
            <form onSubmit={handleSaveProfile} className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Display Name"
                  placeholder="e.g. Alex Rivera"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  required
                />
                <Input
                  label="Username / Handler"
                  placeholder="e.g. alex_dev"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  helperText={`Public handle: @${usernameInput.toLowerCase().replace(/[@\s]/g, "")}`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  About / Bio Headline
                </label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Share your problem-solving goals or learning roadmap..."
                  className="w-full text-xs p-3.5 bg-white/[0.04] border border-[var(--border-subtle)] hover:border-[var(--border-muted)] focus:border-indigo-500 rounded-xl focus-ring text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none"
                />
              </div>

              {/* AVATAR BORDER GLOW COLOR PICKER */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Avatar Border Glow Color</span>
                  </label>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {BORDER_COLOR_PRESETS.find((p) => p.value === selectedBorderColor)?.name || "Custom"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {BORDER_COLOR_PRESETS.map((preset) => {
                    const isSelected = selectedBorderColor === preset.value;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedBorderColor(preset.value)}
                        style={{ backgroundColor: preset.value }}
                        className={`w-8 h-8 rounded-full transition-all cursor-pointer relative shadow-md ${
                          isSelected
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#090b14]"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        title={preset.name}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BANNER GRADIENT PRESETS */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Preset Banner Backgrounds</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BANNER_GRADIENTS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBanner(b.id)}
                      className={`h-14 rounded-2xl border p-2.5 flex items-end text-[11px] font-bold text-white transition-all cursor-pointer ${b.css} ${
                        selectedBanner === b.id
                          ? "border-indigo-400 ring-2 ring-indigo-500/50 shadow-lg"
                          : "border-white/10 hover:border-white/30 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SECTION 2: UNIQUE MIGRATION CODE NUMBER & NOTICE CARD */}
        <Card variant="primary" className="border-indigo-500/30 bg-indigo-500/[0.03]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-indigo-200">Unique Cloud Migration Code</CardTitle>
                <CardDescription>
                  Your permanent identifier for cloud database synchronization.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#090b14] border border-indigo-500/30">
              <div>
                <span className="text-[11px] text-[var(--text-muted)] block uppercase tracking-wider font-semibold">
                  Personal Migration Key
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-indigo-300">
                  {account.uniqueCode}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
                leftIcon={copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              >
                {copiedCode ? "Copied Code" : "Copy Code"}
              </Button>
            </div>

            {/* PROMINENT DATABASE NOTICE */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong>Important Notice:</strong> We are currently building the full-stack database & authentication upgrade. This unique code number (<span className="font-mono font-bold text-white">{account.uniqueCode}</span>) will be used to automatically find and migrate your entire local problem progress and bookmarked roadmaps into your cloud account. <strong>Please keep and remember this code number until the database upgrade is deployed!</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: EXPORT & IMPORT BACKUP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Card */}
          <Card variant="primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Export Workspace</CardTitle>
                  <CardDescription>Download a complete JSON backup of your roadmaps.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[var(--text-secondary)]">
              <p>
                Export includes your profile, solver bookmarks, custom problem statuses (`Done`, `In Progress`), times, and notes.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Format: orbit_backup_username_ORB-XXXXXX.json</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
                className="w-full"
              >
                Export Database-Ready JSON
              </Button>
            </CardFooter>
          </Card>

          {/* Import Card */}
          <Card variant="primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Import Workspace</CardTitle>
                  <CardDescription>Restore or merge from an Orbit backup file.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[var(--text-secondary)]">
              <p>
                Upload an existing Orbit backup file to restore all your solver trackers and notes immediately.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
                Existing matching solvers will be safely merged without duplicates.
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="w-4 h-4 text-cyan-400" />}
                className="w-full"
              >
                Select Backup File
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Import Status Feedback */}
        {importStatus && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
                importStatus.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {importStatus.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          </motion.div>
        )}

        {/* SECTION 4: DANGER ZONE - SAFE RESET */}
        <Card variant="primary" className="border-rose-500/20 bg-rose-500/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-rose-300">Danger Zone: Reset Account</CardTitle>
                <CardDescription>
                  Permanently wipe all bookmarked solvers, problem notes, and tracking progress from this device.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-[var(--text-secondary)]">
            <p>
              Once reset, all local progress will be deleted. To prevent accidental wipes, a confirmation challenge is required.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setResetConfirmInput("");
                setResetError("");
                setIsResetModalOpen(true);
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Account Data...
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* AVATAR CROP & DRAG MODAL */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={tempImageSrc}
        initialBorderColor={selectedBorderColor}
        onCropComplete={handleCropComplete}
      />

      {/* SENSITIVE RESET CONFIRMATION MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        size="md"
      >
        <ModalHeader onClose={() => setIsResetModalOpen(false)}>
          <ModalTitle className="text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Confirm Factory Account Reset</span>
          </ModalTitle>
          <ModalDescription>
            This will permanently delete all your bookmarks, notes, and problem progress.
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 leading-relaxed">
              <strong>Warning:</strong> This action cannot be undone unless you have already exported a JSON backup.
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">
                To confirm, type your display name <span className="font-bold text-white font-mono bg-white/[0.08] px-1.5 py-0.5 rounded">&quot;{account.displayName}&quot;</span> below:
              </label>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={(e) => {
                  setResetConfirmInput(e.target.value);
                  setResetError("");
                }}
                placeholder={`Type "${account.displayName}"...`}
                className="w-full h-10 px-3.5 text-sm bg-white/[0.04] border border-rose-500/40 rounded-xl focus-ring text-white placeholder:text-[var(--text-muted)] font-mono"
                autoFocus
              />
              {resetError && (
                <p className="text-xs text-rose-400 font-medium">{resetError}</p>
              )}
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsResetModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={resetConfirmInput.trim().toLowerCase() !== account.displayName.trim().toLowerCase()}
            onClick={handleResetConfirm}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            I understand, Wipe Everything
          </Button>
        </ModalFooter>
      </Modal>
    </PageLayout>
  );
}
