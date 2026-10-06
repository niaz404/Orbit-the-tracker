"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Info,
  Save,
  Check,
  AlertTriangle,
  Copy,
  Key,
  Palette,
  Image as ImageIcon,
  Edit3,
  Lock,
  Unlock,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal";
import { ImageCropperModal, BORDER_COLOR_PRESETS } from "@/components/ui/image-cropper-modal";
import {
  getAccountProfile,
  saveAccountProfile,
  generateUniqueMigrationKey,
  exportAllData,
  importAllData,
  resetAllData,
} from "@/lib/storage";
import { slideUp } from "@/lib/animations";

const BANNER_PRESETS = [
  { id: "gradient:indigo-purple", name: "Aurora Violet", css: "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950" },
  { id: "gradient:cyan-blue", name: "Cyber Midnight", css: "bg-gradient-to-r from-cyan-950 via-blue-900 to-indigo-950" },
  { id: "gradient:emerald-teal", name: "Emerald Nebula", css: "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950" },
  { id: "gradient:rose-amber", name: "Solar Dusk", css: "bg-gradient-to-r from-rose-950 via-amber-950 to-purple-950" },
];

export default function SettingsPage() {
  const [account, setAccount] = useState({
    displayName: "Explorer",
    username: "",
    uniqueCode: "",
    avatarUrl: "",
    avatarBorderColor: "#6366f1",
    bannerUrl: "gradient:indigo-purple",
    bio: "Focusing on competitive programming and problem-solving roadmaps.",
    createdAt: new Date().toISOString(),
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("Explorer");
  const [bioInput, setBioInput] = useState("");
  const [selectedBorderColor, setSelectedBorderColor] = useState("#6366f1");
  const [selectedBanner, setSelectedBanner] = useState("gradient:indigo-purple");

  const [draftKey, setDraftKey] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Avatar and banner file inputs
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState("");
  const [resetError, setResetError] = useState("");

  // Import feedback
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 3000);
  };

  const loadData = () => {
    const acc = getAccountProfile();
    setAccount(acc);
    setDisplayNameInput(acc.displayName || "Explorer");
    setBioInput(acc.bio || "");
    setSelectedBorderColor(acc.avatarBorderColor || "#6366f1");
    setSelectedBanner(acc.bannerUrl || "gradient:indigo-purple");
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("orbit_account_updated", handleUpdate);
    return () => window.removeEventListener("orbit_account_updated", handleUpdate);
  }, []);

  const handleOpenEditModal = () => {
    setDisplayNameInput(account.displayName || "Explorer");
    setBioInput(account.bio || "");
    setSelectedBorderColor(account.avatarBorderColor || "#6366f1");
    setSelectedBanner(account.bannerUrl || "gradient:indigo-purple");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!displayNameInput.trim()) return;

    saveAccountProfile({
      displayName: displayNameInput.trim(),
      bio: bioInput.trim(),
      avatarBorderColor: selectedBorderColor,
      bannerUrl: selectedBanner,
    });

    setIsEditModalOpen(false);
    showToast("Profile details updated successfully!");
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
    showToast("Profile photo updated!");
  };

  const handleBannerFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bannerData = event.target?.result;
      setSelectedBanner(bannerData);
      saveAccountProfile({ bannerUrl: bannerData });
      showToast("Profile banner updated!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleGenerateKeyDraft = () => {
    setDraftKey(generateUniqueMigrationKey());
  };

  const handleConfirmAndLockKey = () => {
    if (!draftKey) return;
    saveAccountProfile({ uniqueCode: draftKey });
    setDraftKey(null);
    showToast("Migration Key locked and verified!");
  };

  const handleCopyCode = () => {
    if (account.uniqueCode && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(account.uniqueCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExport = () => {
    if (!account.uniqueCode) {
      setImportStatus({
        type: "error",
        message: "Please generate your Migration Key first to export data.",
      });
      return;
    }
    const res = exportAllData();
    if (res?.success) {
      setImportStatus({
        type: "success",
        message: `Backup exported: ${res.filename}`,
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
        message: "Please generate your Migration Key first before importing data.",
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
            message: `Restored ${res.count} solvers and your progress matrix.`,
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
      message: "Account reset to factory default.",
    });
    loadData();
  };

  const currentBannerClass = BANNER_PRESETS.find((b) => b.id === (account.bannerUrl || selectedBanner))?.css;

  return (
    <AppShell pageTitle="Settings">
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-6 pb-12"
      >
        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {isToastOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0e1220] border border-emerald-500/40 text-emerald-300 shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. LINKEDIN-STYLE CLEAN PROFILE CARD */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c0e17] overflow-hidden shadow-2xl relative">
          {/* Panoramic Banner Area */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-[#090b14] overflow-visible">
            {account.bannerUrl?.startsWith("data:") ? (
              <img
                src={account.bannerUrl}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${currentBannerClass || "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950"}`} />
            )}

            {/* Circular Banner Camera Button (Top Right of Banner) */}
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
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95 z-10"
              title="Change Banner Photo"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>

            {/* Avatar (50% Overlapping Banner & Card Body) */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-6 sm:left-10 z-20">
              <div className="relative group">
                <div
                  style={{
                    borderColor: account.avatarBorderColor || "#6366f1",
                    boxShadow: `0 0 24px ${(account.avatarBorderColor || "#6366f1")}40`,
                  }}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 overflow-hidden bg-[#0d101a] ring-4 ring-[#0c0e17] shadow-2xl flex items-center justify-center"
                >
                  {account.avatarUrl ? (
                    <img
                      src={account.avatarUrl}
                      alt={account.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-slate-300">
                      {(account.displayName || "E").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Floating Avatar Camera Button */}
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
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl border-2 border-[#0c0e17] cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Upload & Crop Avatar"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Body Area */}
          <div className="px-6 sm:px-10 pb-8 pt-20 sm:pt-24 relative bg-gradient-to-b from-[#0c0e17] to-[#080910]">
            {/* Top Right "Edit Profile" Button (LinkedIn Style) */}
            <div className="absolute top-4 sm:top-5 right-6 sm:right-10">
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

            {/* Profile Identity Details */}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {account.displayName || "Explorer"}
                </h1>

                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] flex-wrap pt-1.5">
                  <span className="font-mono text-indigo-300 text-xs">
                    @{account.username || "username"}
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

              {/* Bio text */}
              {account.bio ? (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
                  {account.bio}
                </p>
              ) : (
                <p className="text-xs text-[var(--text-muted)] italic pt-1">
                  No bio added yet. Click &quot;Edit Profile&quot; to share your competitive programming roadmap.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. UNIQUE CLOUD MIGRATION KEY CARD */}
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
                    <strong>Database Synchronization Notice:</strong> This permanent key (<span className="font-mono font-bold text-white">{account.uniqueCode}</span>) is linked to your account. When the full-stack database upgrade launches, this key will identify and import all your local progress.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    You have not activated a migration key yet. <strong>Export and Import features are disabled</strong> until a unique migration key is generated and confirmed.
                  </p>
                </div>

                {draftKey ? (
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

        {/* 3. EXPORT & IMPORT BACKUP */}
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

        {/* Import Feedback */}
        {importStatus && (
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
        )}

        {/* 4. DANGER ZONE - SAFE RESET */}
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
            Update your public display name, bio, and visual theme.
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSaveProfile}>
          <ModalContent className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                placeholder="e.g. Alex Rivera"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                required
              />
              <Input
                label="Username / Handle"
                placeholder="username"
                value={account.username || ""}
                disabled
                helperText="Username can be customized after cloud database & auth is implemented."
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

            {/* BANNER PRESETS */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preset Banner Backgrounds</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BANNER_PRESETS.map((b) => (
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
    </AppShell>
  );
}
