"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock,
  Unlock,
  ShieldCheck,
  X,
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
  generateUniqueMigrationKey,
  exportAllData,
  importAllData,
  resetAllData,
  getBookmarks,
} from "@/lib/storage";
import { slideUp, fadeIn } from "@/lib/animations";

const BANNER_GRADIENTS = [
  { id: "gradient:indigo-purple", name: "Aurora Violet", css: "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950" },
  { id: "gradient:cyan-blue", name: "Cyber Midnight", css: "bg-gradient-to-r from-cyan-950 via-blue-900 to-indigo-950" },
  { id: "gradient:emerald-teal", name: "Emerald Nebula", css: "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950" },
  { id: "gradient:rose-amber", name: "Solar Dusk", css: "bg-gradient-to-r from-rose-950 via-amber-950 to-purple-950" },
];

export default function SettingsPage() {
  const [account, setAccount] = useState({
    displayName: "Explorer",
    username: "orbit_user",
    uniqueCode: "",
    avatarUrl: "",
    avatarBorderColor: "#6366f1",
    bannerUrl: "gradient:indigo-purple",
    bio: "Focusing on competitive programming and problem-solving roadmaps.",
    createdAt: new Date().toISOString(),
  });

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("Explorer");
  const [usernameInput, setUsernameInput] = useState("orbit_user");
  const [bioInput, setBioInput] = useState("");
  const [selectedBorderColor, setSelectedBorderColor] = useState("#6366f1");
  const [selectedBanner, setSelectedBanner] = useState("gradient:indigo-purple");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Key Generation State
  const [draftKey, setDraftKey] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Stats
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

  // Open Edit Profile Modal
  const handleOpenEditModal = () => {
    setDisplayNameInput(account.displayName || "Explorer");
    setUsernameInput(account.username || "orbit_user");
    setBioInput(account.bio || "");
    setSelectedBorderColor(account.avatarBorderColor || "#6366f1");
    setSelectedBanner(account.bannerUrl || "gradient:indigo-purple");
    setIsEditModalOpen(true);
  };

  // Save Profile from Edit Modal
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

    setIsEditModalOpen(false);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Avatar Upload Handlers
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
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Banner Upload Handler
  const handleBannerFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bannerData = event.target?.result;
      setSelectedBanner(bannerData);
      saveAccountProfile({ bannerUrl: bannerData });
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Migration Key Generation & Lock Flow
  const handleGenerateKeyDraft = () => {
    const newKey = generateUniqueMigrationKey();
    setDraftKey(newKey);
  };

  const handleConfirmAndLockKey = () => {
    if (!draftKey) return;
    saveAccountProfile({ uniqueCode: draftKey });
    setDraftKey(null);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleCopyCode = () => {
    if (account.uniqueCode && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(account.uniqueCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Export / Import
  const handleExport = () => {
    if (!account.uniqueCode) {
      setImportStatus({
        type: "error",
        message: "Please generate and confirm your Migration Key before exporting.",
      });
      return;
    }
    const res = exportAllData();
    if (res?.success) {
      setImportStatus({
        type: "success",
        message: `Exported backup "${res.filename}" securely stamped with your key.`,
      });
    } else {
      setImportStatus({
        type: "error",
        message: res?.error || "Export failed.",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!account.uniqueCode) {
      setImportStatus({
        type: "error",
        message: "Please generate and confirm your Migration Key before importing.",
      });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const res = importAllData(text);
        if (res.success) {
          setImportStatus({
            type: "success",
            message: `Successfully restored ${res.count} solvers and your progress matrix.`,
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
      message: "Account and local storage successfully reset to default.",
    });
    loadData();
  };

  const currentBannerClass = BANNER_GRADIENTS.find((b) => b.id === (account.bannerUrl || selectedBanner))?.css;

  return (
    <PageLayout
      title="User Profile & Settings"
      description="Manage your profile identity, custom photo banner, and secure migration authentication."
      badge={
        account.uniqueCode ? (
          <Badge variant="accent">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Key Verified
          </Badge>
        ) : (
          <Badge variant="neutral">Key Setup Pending</Badge>
        )
      }
    >
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-8 pb-12"
      >
        {/* TOAST FEEDBACK */}
        <AnimatePresence>
          {isSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0e1220] border border-emerald-500/40 text-emerald-300 shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Profile changes saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: LINKEDIN-STYLE CLEAN PROFILE DISPLAY CARD */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c0e17] overflow-hidden shadow-2xl relative">
          {/* Panoramic Banner Area (Top) */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-[#090b14] overflow-hidden group">
            {account.bannerUrl?.startsWith("data:") ? (
              <img
                src={account.bannerUrl}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${currentBannerClass || "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950"}`} />
            )}

            {/* Banner Edit Circular Button (LinkedIn style top-right) */}
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
              className="absolute top-4 right-4 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95 group/btn"
              title="Change Banner Photo"
              aria-label="Change banner"
            >
              <Camera className="w-4 h-4 text-white group-hover/btn:text-cyan-300 transition-colors" />
            </button>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 sm:px-10 pb-8 relative bg-gradient-to-b from-[#0c0e17] to-[#080910]">
            {/* Top Row: Overlapping Avatar on Left + Clean Edit Button on Right */}
            <div className="flex items-start justify-between -mt-16 sm:-mt-20 md:-mt-24 mb-3 relative z-20">
              {/* Overlapping Avatar: 55% in Banner, 45% in Card */}
              <div className="relative inline-block group shrink-0">
                <div className="rounded-full bg-[#0c0e17] p-1 sm:p-1.5 shadow-2xl ring-4 sm:ring-6 ring-[#0c0e17]">
                  <Avatar
                    src={account.avatarUrl}
                    fallback={account.displayName}
                    size="4xl"
                    borderColor={account.avatarBorderColor || "#6366f1"}
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
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 sm:p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl border-2 border-[#0c0e17] cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Upload & Crop Avatar"
                  aria-label="Upload photo"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Action Buttons in Top-Right of Card Body (LinkedIn style) */}
              <div className="pt-2 sm:pt-4 flex items-center gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenEditModal}
                  leftIcon={<Edit3 className="w-4 h-4 text-indigo-300" />}
                  className="shadow-md"
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Profile Identity & Details Display */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {account.displayName || "Explorer"}
                  </h1>
                  <Badge variant="accent" dot>Active Solver</Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] flex-wrap pt-1.5">
                  <span className="font-mono font-bold text-indigo-300 text-sm">
                    @{account.username || "orbit_user"}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{bookmarkCount} Bookmarked Solvers</span>
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    {account.uniqueCode ? (
                      <span className="font-mono text-cyan-300 font-semibold">{account.uniqueCode}</span>
                    ) : (
                      <span className="text-amber-400 font-medium">Migration Key Not Generated</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Bio / Headline text */}
              {account.bio ? (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
                  {account.bio}
                </p>
              ) : (
                <p className="text-xs text-[var(--text-muted)] italic pt-1">
                  No bio added yet. Click &quot;Edit Profile&quot; to add your competitive programming goals.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: UNIQUE MIGRATION KEY GENERATION & ACTIVATION CARD */}
        <Card
          variant="primary"
          className={
            account.uniqueCode
              ? "border-indigo-500/30 bg-indigo-500/[0.03]"
              : "border-amber-500/30 bg-amber-500/[0.02]"
          }
        >
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    account.uniqueCode
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className={account.uniqueCode ? "text-indigo-200" : "text-amber-200"}>
                    {account.uniqueCode ? "Unique Cloud Migration Key" : "Generate Cloud Migration Key"}
                  </CardTitle>
                  <CardDescription>
                    {account.uniqueCode
                      ? "Your permanent authentication key for cloud database synchronization and backup validation."
                      : "Generate your unique token to authenticate your account and unlock workspace import/export."}
                  </CardDescription>
                </div>
              </div>

              <Badge variant={account.uniqueCode ? "accent" : "warning"}>
                {account.uniqueCode ? (
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Key Locked & Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Not Activated
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {account.uniqueCode ? (
              /* ALREADY GENERATED & LOCKED STATE */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#090b14] border border-indigo-500/30">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block uppercase tracking-wider font-semibold">
                      Permanent Migration Key
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
                    {copiedCode ? "Copied Key" : "Copy Key"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Database Synchronization Notice:</strong> This permanent key (<span className="font-mono font-bold text-white">{account.uniqueCode}</span>) is linked to your account. When the full-stack database upgrade launches, this key will identify and import all your local progress. <strong>Keep this key safe!</strong>
                  </p>
                </div>
              </div>
            ) : (
              /* NOT GENERATED STATE — GENERATION & CONFIRMATION FLOW */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    You have not activated a migration key yet. <strong>Export and Import features are disabled</strong> until a unique migration key is generated and confirmed.
                  </p>
                </div>

                {draftKey ? (
                  /* DRAFT KEY CONFIRMATION BOX */
                  <div className="p-5 rounded-2xl bg-[#090b14] border-2 border-indigo-500/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider">
                        Generated Migration Key Preview:
                      </span>
                      <Badge variant="accent">New Token</Badge>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-center">
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">
                        {draftKey}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      <strong>Important:</strong> Clicking <strong>&quot;Confirm & Lock Key&quot;</strong> will permanently bind this token to your account. Once locked, the generation button will disappear and this key becomes your permanent authentication token.
                    </div>

                    <div className="flex items-center gap-3 justify-end pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setDraftKey(null)}
                      >
                        Discard / Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirmAndLockKey}
                        leftIcon={<Check className="w-4 h-4 text-emerald-300" />}
                      >
                        Confirm & Lock Key
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* INITIAL GENERATE BUTTON */
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#090b14] border border-white/[0.08]">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Ready to activate your token?</h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Our algorithm will generate a unique cryptographically secured token for you.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGenerateKeyDraft}
                      leftIcon={<Sparkles className="w-4 h-4 text-cyan-300" />}
                    >
                      Generate Migration Key
                    </Button>
                  </div>
                )}
              </div>
            )}
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
              {!account.uniqueCode && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Requires an active Migration Key</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                disabled={!account.uniqueCode}
                onClick={handleExport}
                leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
                className="w-full"
              >
                {account.uniqueCode ? "Export Database-Ready JSON" : "Locked (Generate Key First)"}
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
              {!account.uniqueCode && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Requires an active Migration Key</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                disabled={!account.uniqueCode}
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="w-4 h-4 text-cyan-400" />}
                className="w-full"
              >
                {account.uniqueCode ? "Select Backup File" : "Locked (Generate Key First)"}
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

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
      >
        <ModalHeader onClose={() => setIsEditModalOpen(false)}>
          <ModalTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <span>Edit Profile Details</span>
          </ModalTitle>
          <ModalDescription>
            Update your public display name, handle, bio, and visual theme.
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSaveProfile}>
          <ModalContent className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Avatar Border Ring Color</span>
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
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
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
          </ModalContent>

          <ModalFooter>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* AVATAR CROP & DRAG MODAL */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={tempImageSrc}
        initialBorderColor={account.avatarBorderColor || "#6366f1"}
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
