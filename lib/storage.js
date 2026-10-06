/**
 * Local Storage Persistence & Database-Ready Schema for Orbit
 *
 * Designed with a clean relational model for seamless future migration
 * into Prisma / PostgreSQL / MongoDB.
 *
 * Schemas:
 * - UserAccount: { id, displayName, username, uniqueCode, avatarUrl, avatarBorderColor, bannerUrl, bio, createdAt, updatedAt }
 * - Bookmark: { id, userId, handle, avatar, rating, rank, firstName, lastName, organization, lastKnownSolvedCount, createdAt }
 * - ProblemProgress: { id, userId, handle, problemId, status, time, notes, updatedAt }
 * - Notification: { id, userId, title, message, handle, type, timestamp, read }
 */

const BOOKMARKS_KEY = "orbit_bookmarks_v1";
const PROGRESS_PREFIX = "orbit_progress_v1_";
const ACCOUNT_KEY = "orbit_account_v1";
const NOTIFICATIONS_KEY = "orbit_notifications_v1";
const MAX_NOTIFICATIONS = 10;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// Generate a random 6-digit unique migration code e.g. "ORB-739201"
export function generateUniqueCode() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `ORB-${num}`;
}

// Generate UUID for future database IDs
export function generateId(prefix = "usr") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * --- USER ACCOUNT SCHEMA & APIS ---
 */

export function getDefaultAccount() {
  return {
    id: generateId("usr"),
    displayName: "Explorer",
    username: "orbit_user",
    uniqueCode: generateUniqueCode(),
    avatarUrl: "",
    avatarBorderColor: "#6366f1", // Neon Indigo default
    bannerUrl: "gradient:indigo-purple", // default sleek gradient
    bio: "Focusing on competitive programming and problem-solving roadmaps.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getAccountProfile() {
  if (!isBrowser()) return getDefaultAccount();
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) {
      const defaultAcc = getDefaultAccount();
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(defaultAcc));
      return defaultAcc;
    }
    const parsed = JSON.parse(raw);
    // Ensure all required fields exist
    return {
      id: parsed.id || generateId("usr"),
      displayName: parsed.displayName || parsed.name || "Explorer",
      username: parsed.username || (parsed.handle ? parsed.handle.replace(/^@/, "") : "orbit_user"),
      uniqueCode: parsed.uniqueCode || generateUniqueCode(),
      avatarUrl: parsed.avatarUrl || parsed.avatar || "",
      avatarBorderColor: parsed.avatarBorderColor || "#6366f1",
      bannerUrl: parsed.bannerUrl || "gradient:indigo-purple",
      bio: parsed.bio || "",
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Failed to read account profile:", err);
    return getDefaultAccount();
  }
}

export function saveAccountProfile(updates) {
  if (!isBrowser()) return getDefaultAccount();
  try {
    const current = getAccountProfile();
    const next = {
      ...current,
      ...updates,
      // Clean username (no spaces or @)
      username: (updates.username || current.username || "orbit_user").toLowerCase().replace(/[@\s]/g, ""),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("orbit_account_updated"));
    return next;
  } catch (err) {
    console.error("Failed to save account profile:", err);
    return getAccountProfile();
  }
}

/**
 * --- BOOKMARK STORAGE ---
 */

export function getBookmarks() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read bookmarks:", err);
    return [];
  }
}

export function isBookmarked(handle) {
  if (!handle || !isBrowser()) return false;
  const bookmarks = getBookmarks();
  return bookmarks.some(
    (b) => b.handle.toLowerCase() === handle.trim().toLowerCase()
  );
}

export function getBookmark(handle) {
  if (!handle || !isBrowser()) return null;
  const bookmarks = getBookmarks();
  return (
    bookmarks.find(
      (b) => b.handle.toLowerCase() === handle.trim().toLowerCase()
    ) || null
  );
}

export function addBookmark(profile) {
  if (!isBrowser() || !profile?.handle) return [];
  try {
    const bookmarks = getBookmarks();
    const cleanHandle = profile.handle.trim();

    const existingIndex = bookmarks.findIndex(
      (b) => b.handle.toLowerCase() === cleanHandle.toLowerCase()
    );

    const bookmarkData = {
      id: generateId("bmk"),
      handle: cleanHandle,
      avatar: profile.avatar || "",
      rating: profile.rating || 0,
      rank: profile.rank || "unranked",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      organization: profile.organization || "",
      lastKnownSolvedCount: profile.totalSolved || 0,
      addedAt: Date.now(),
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...bookmarks];
      updated[existingIndex] = { ...updated[existingIndex], ...bookmarkData };
    } else {
      updated = [bookmarkData, ...bookmarks];
      addNotification({
        title: "Solver Added to Workspace",
        message: `Bookmarked ${cleanHandle} to follow their problem-solving roadmap.`,
        handle: cleanHandle,
        type: "bookmark",
      });
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("orbit_bookmarks_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to save bookmark:", err);
    return getBookmarks();
  }
}

export function removeBookmark(handle) {
  if (!isBrowser() || !handle) return [];
  try {
    const bookmarks = getBookmarks();
    const cleanHandle = handle.trim().toLowerCase();
    const updated = bookmarks.filter(
      (b) => b.handle.toLowerCase() !== cleanHandle
    );

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("orbit_bookmarks_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to remove bookmark:", err);
    return getBookmarks();
  }
}

/**
 * --- TRACKER PROGRESS STORAGE ---
 */

export function getTrackerProgress(handle) {
  if (!isBrowser() || !handle) return {};
  try {
    const key = `${PROGRESS_PREFIX}${handle.trim().toLowerCase()}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Failed to read tracker progress:", err);
    return {};
  }
}

export function saveProblemProgress(handle, problemId, updates) {
  if (!isBrowser() || !handle || !problemId) return {};
  try {
    const key = `${PROGRESS_PREFIX}${handle.trim().toLowerCase()}`;
    const current = getTrackerProgress(handle);

    const existingProblemData = current[problemId] || {
      status: "not-started",
      time: "",
      notes: "",
    };

    const updatedProblemData = {
      ...existingProblemData,
      ...updates,
      updatedAt: Date.now(),
    };

    const nextProgress = {
      ...current,
      [problemId]: updatedProblemData,
    };

    localStorage.setItem(key, JSON.stringify(nextProgress));
    window.dispatchEvent(new Event("orbit_progress_updated"));
    return nextProgress;
  } catch (err) {
    console.error("Failed to save problem progress:", err);
    return getTrackerProgress(handle);
  }
}

export function getWorkspaceStats(handle, totalProblemsCount = 0) {
  const progressMap = getTrackerProgress(handle);
  const entries = Object.values(progressMap);

  const completed = entries.filter((item) => item.status === "done").length;
  const inProgress = entries.filter((item) => item.status === "in-progress").length;

  const total = totalProblemsCount || entries.length || 0;
  const percentage =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return {
    total,
    completed,
    inProgress,
    percentage,
  };
}

/**
 * --- NOTIFICATIONS SYSTEM ---
 */

export function getNotifications() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read notifications:", err);
    return [];
  }
}

export function addNotification(notification) {
  if (!isBrowser()) return [];
  try {
    const current = getNotifications();
    const newNotif = {
      id: generateId("notif"),
      title: notification.title || "New Activity",
      message: notification.message || "",
      handle: notification.handle || null,
      type: notification.type || "info",
      timestamp: Date.now(),
      read: false,
    };

    const updated = [newNotif, ...current].slice(0, MAX_NOTIFICATIONS);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("orbit_notifications_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to add notification:", err);
    return getNotifications();
  }
}

export function markNotificationsRead() {
  if (!isBrowser()) return [];
  try {
    const current = getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("orbit_notifications_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to mark notifications read:", err);
    return getNotifications();
  }
}

export function clearNotifications() {
  if (!isBrowser()) return [];
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("orbit_notifications_updated"));
    return [];
  } catch (err) {
    console.error("Failed to clear notifications:", err);
    return [];
  }
}

/**
 * --- DATABASE-READY EXPORT, IMPORT & RESET ---
 */

export function exportAllData() {
  if (!isBrowser()) return null;
  try {
    const account = getAccountProfile();
    const bookmarks = getBookmarks();
    const progress = {};

    for (const b of bookmarks) {
      const p = getTrackerProgress(b.handle);
      if (Object.keys(p).length > 0) {
        progress[b.handle.toLowerCase()] = p;
      }
    }

    const payload = {
      app: "Orbit",
      version: "2.0-cloud-ready",
      exportedAt: new Date().toISOString(),
      uniqueMigrationCode: account.uniqueCode,
      schema: {
        users: [account],
        bookmarks: bookmarks.map((b) => ({ ...b, userId: account.id })),
        progressMatrix: progress,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = `orbit_backup_${account.username}_${account.uniqueCode}_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename, uniqueCode: account.uniqueCode };
  } catch (err) {
    console.error("Failed to export data:", err);
    return { success: false, error: err.message };
  }
}

export function importAllData(jsonString) {
  if (!isBrowser()) return { success: false, error: "Not in browser" };
  try {
    const parsed = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;

    if (!parsed || parsed.app !== "Orbit") {
      throw new Error("Invalid Orbit backup file format.");
    }

    // Handle v2.0 schema or legacy v1
    const account = parsed.schema?.users?.[0] || parsed.account;
    const bookmarks = parsed.schema?.bookmarks || parsed.bookmarks;
    const progress = parsed.schema?.progressMatrix || parsed.progress;

    if (account) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    }

    if (Array.isArray(bookmarks)) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }

    if (progress && typeof progress === "object") {
      for (const [handle, progMap] of Object.entries(progress)) {
        localStorage.setItem(`${PROGRESS_PREFIX}${handle.toLowerCase()}`, JSON.stringify(progMap));
      }
    }

    addNotification({
      title: "Backup Restored Successfully",
      message: `Restored ${bookmarks?.length || 0} solvers and tracking matrix.`,
      type: "success",
    });

    window.dispatchEvent(new Event("orbit_bookmarks_updated"));
    window.dispatchEvent(new Event("orbit_progress_updated"));
    window.dispatchEvent(new Event("orbit_account_updated"));

    return { success: true, count: bookmarks?.length || 0 };
  } catch (err) {
    console.error("Failed to import data:", err);
    return { success: false, error: err.message || "Invalid JSON structure" };
  }
}

export function resetAllData() {
  if (!isBrowser()) return false;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("orbit_") || k.startsWith("codetrack_"))) {
        keysToRemove.push(k);
      }
    }

    for (const k of keysToRemove) {
      localStorage.removeItem(k);
    }

    window.dispatchEvent(new Event("orbit_bookmarks_updated"));
    window.dispatchEvent(new Event("orbit_progress_updated"));
    window.dispatchEvent(new Event("orbit_account_updated"));
    window.dispatchEvent(new Event("orbit_notifications_updated"));

    return true;
  } catch (err) {
    console.error("Failed to reset data:", err);
    return false;
  }
}
