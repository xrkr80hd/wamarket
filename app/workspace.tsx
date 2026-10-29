import { roleLabel, personalRecords } from "../lib/dashboard";
import LocationBadge from "./location-badge";
import SiteTour from "./site-tour";
import QuickNote from "./quick-note";
import NotificationCenter from "./notification-center";
import { openTextNote } from "../lib/text-notes";
import { sectionGuide, toolbarGuide } from "../lib/site-guide";
import { brandStyle, folderBrand } from "../lib/location-branding";
import QuickIdeas, { QuickIdeasNotice } from "./quick-ideas";
import { openQuickIdea, unreadIdeas } from "../lib/quick-ideas";
import DayPlanner from "./day-planner";
import ReviewFeedbackFeed from "./review-feed";
("use client");
import { apiFetch, apiJSON } from "../lib/api-response";
import { useState, useEffect, useRef } from "react";
import { quoteForDay, chicagoDate } from "../lib/daily-quotes";
import ProfilePhotoUploader from "./profile-photo-uploader";
import CampaignTodos from "./campaign-todos";
import HeroArtwork from "./hero-artwork";
import { withCampaignTasks } from "../lib/campaign-tasks";
import { dashboardDate } from "../lib/hero-season";
import MediaUploader from "./media-uploader";
import PersonalWorkspace from "./personal-workspace";
import Brainstorming from "./brainstorming";
import PhoneBook from "./phone-book";
import Messenger from "./messenger-inbox";
import Library from "./library";
import UniversalSelection from "./universal-selection";
import ArchiveRoom from "./archive-room";
import { ProfileAvatar } from "./local-accounts";
import VideoReview from "./video-review";
import ShotStudio from "./shot-studio";
import PreviewAdmin, { RoleOverview } from "./preview-admin";
import { Operations, DailyQuote } from "./operations";
import { PlanningCalendar, TaskBoard, Reports } from "./planning";
import { people, user, setUser, getState } from "../lib/preview-store";
import PageEditor, { BrandImage } from "./theme-workbench";
import { appearanceVariables } from "../lib/appearance";
import MediaDetails from "./media-details";
import AssetFolder from "./asset-folder";
import { mediaCategory } from "../lib/media";
import ContentWeek from "./content-week";
import TemplateStudio from "./template-studio";
import {
  LayoutDashboard,
  CalendarDays,
  FolderOpen,
  Image,
  Lightbulb,
  CheckCheck,
  Building2,
  Settings,
  Palette,
  Phone,
  MessageSquare,
  Sun,
  Moon,
  Plus,
  Search,
  ArrowUpRight,
  ChevronRight,
  Clock,
  X,
  Download,
  Sparkles,
  Menu,
  Archive,
  RefreshCw,
} from "lucide-react";
const stores = [
  "Walker CDJR",
  "Walker Toyota",
  "Walker Honda",
  "Walker Kia",
  "Walker Mazda",
  "Walker BMW",
  "Walker Mercedes-Benz",
  "Walker Pineville Used Cars",
  "Walker Big Lot",
  "Walker GMC",
].sort((a, b) => a.localeCompare(b));
const stages = [
  "Ideas",
  "Planning",
  "Production",
  "Review",
  "Revision",
  "Approved",
  "Scheduled",
  "Published",
  "Archived",
];
const nav = [
  ["Overview", LayoutDashboard],
  ["Quick Ideas", Lightbulb],
  ["Campaigns", FolderOpen],
  ["Content Calendar", CalendarDays],
  ["Video production", Image],
  ["Shot lists", Image],
  ["Media Vault", Image],
  ["Tasks", CheckCheck],
  ["Video review", CheckCheck],
  ["Review Queue", CheckCheck],
  ["Social planner", CalendarDays],
  ["Ideas library", Lightbulb],
  ["Dealerships", Building2],
  ["Past Events", Archive],
  ["Templates", Image],
  ["My Workspace", FolderOpen],
  ["Marketing Phone Book", Phone],
  ["Messenger", MessageSquare],
  ["IGNITION", Sparkles],
  ["Reports", LayoutDashboard],
  ["Page Editor", Palette],
  ["Team & Settings", Settings],
  ["Archive", Archive],
] as const;
const newRecord = (kind: string) => ({
  kind,
  title: "",
  status: kind === "event" ? "Proposed" : "Planning",
  tasks: [],
  comments: [],
  dealership: "Walker Automotive Group",
  owner: "",
  date: "",
  endDate: "",
  notes: "",
  category: "",
  recurrence: "One-time",
  channels: [],
});
export default function Workspace() {
  const [storePage, setStorePage] = useState(0);
  const pageRef = useRef("Overview");
  const [collapsed, setCollapsed] = useState(false),
    [reviewId, setReviewId] = useState("");
  useEffect(() => {
    const changed = () => load();
    const themePreview = (e: any) => setPrefs(e.detail);
    window.addEventListener("wam-theme-preview", themePreview);
    const openReview = (e: any) => {
      setReviewId(e.detail.videoId);
      setPage("Video review");
      setChatOpen(false);
      setMobile(false);
    };
    window.addEventListener("wam-change", changed);
    window.addEventListener("wam-cloud-hydrated", changed);
    window.addEventListener("wam-account-session", changed);
    window.addEventListener("wam-open-review", openReview);
    return () => {
      window.removeEventListener("wam-theme-preview", themePreview);
      window.removeEventListener("wam-change", changed);
      window.removeEventListener("wam-cloud-hydrated", changed);
      window.removeEventListener("wam-account-session", changed);
      window.removeEventListener("wam-open-review", openReview);
    };
  }, []);
  async function changeMode(mode: string) {
    const saved = getState().preferences[user().id] || {};
    const next = { ...prefs, theme: mode, appearance: {}, presetName: "" };
    setPrefs(next);
    window.dispatchEvent(new CustomEvent("wam-theme-mode", { detail: next }));
    try {
      await apiJSON(
        await apiFetch("/api/workspace", {
          method: "POST",
          body: JSON.stringify({
            action: "preferences",
            preferences: {
              ...saved,
              theme: mode,
              appearance: {},
              presetName: "",
            },
          }),
        }),
      );
    } catch (e: any) {
      setToast(e.message);
    }
  }
  const reviewVideo = (id: string) => {
    setReviewId(id);
    setPage("Video review");
    setMobile(false);
  };
  const [chatOpen, setChatOpen] = useState(false),
    [chatUnread, setChatUnread] = useState(0),
    [chatToast, setChatToast] = useState<any>(null);
  const [notificationFolder, setNotificationFolder] = useState("");
  const [notificationConversation, setNotificationConversation] = useState("");
  const [mediaType, setMediaType] = useState("All");
  const [mediaDetail, setMediaDetail] = useState<any>(null);
  const [draftMedia, setDraftMedia] = useState<File[]>([]),
    [checklistEditing, setChecklistEditing] = useState(false),
    [presenceState, setPresenceState] = useState("connecting"),
    [today, setToday] = useState(""),
    [avatarVersion, setAvatarVersion] = useState(Date.now()),
    [folder, setFolder] = useState(""),
    [studio, setStudio] = useState<any>(null),
    [archived, setArchived] = useState(false),
    [page, setPage] = useState("Overview"),
    [data, setData] = useState<any>({ records: [], members: [] }),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All"),
    [year, setYear] = useState("All"),
    [view, setView] = useState("Cards"),
    [edit, setEdit] = useState<any>(null),
    [detail, setDetail] = useState<any>(null),
    [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [mobile, setMobile] = useState(false),
    [month, setMonth] = useState("2026-10"),
    [comment, setComment] = useState(""),
    [prefs, setPrefs] = useState<any>({ theme: "light", accent: "#cd315e" }),
    [storeFilter, setStoreFilter] = useState("All"),
    [prompt, setPrompt] = useState("Plan a campaign");
  pageRef.current = page;
  async function load() {
    try {
      const r = await apiFetch("/api/workspace");
      let d: any = await apiJSON(r);
      if (!d.member || !Array.isArray(d.records))
        throw Error("Workspace data is unavailable. Refresh and try again.");
      if (
        d.member.role === "owner" &&
        !d.records.some((x: any) => x.id === "history-imported")
      ) {
        const init = await apiFetch("/api/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "import" }),
        });
        if (init.ok) {
          d = await apiJSON(await apiFetch("/api/workspace"));
        }
      }
      setData(d);
      if (pageRef.current !== "Page Editor")
        setPrefs(JSON.parse(d.member.preferences || "{}"));
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setToday(chicagoDate());
    const dayTimer = setInterval(() => setToday(chicagoDate()), 15000);
    load();
    const id = setInterval(load, 30000);
    return () => {
      clearInterval(id);
      clearInterval(dayTimer);
    };
  }, []);
  useEffect(() => {
    let stopped = false;
    async function heartbeat() {
      const online = navigator.onLine && document.visibilityState === "visible";
      if (!navigator.onLine) {
        setPresenceState("offline");
        return;
      }
      try {
        const response = await apiFetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat", online }),
        });
        const result: any = await apiJSON(response);
        if (!stopped)
          setPresenceState(
            response.ok && result.ok ? (online ? "online" : "away") : "offline",
          );
      } catch {
        if (!stopped) setPresenceState("offline");
      }
    }
    heartbeat();
    const timer = setInterval(heartbeat, 15000);
    document.addEventListener("visibilitychange", heartbeat);
    window.addEventListener("online", heartbeat);
    window.addEventListener("offline", heartbeat);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", heartbeat);
      window.removeEventListener("online", heartbeat);
      window.removeEventListener("offline", heartbeat);
    };
  }, []);
  useEffect(() => {
    if (detail && !checklistEditing) {
      const latest = data.records.find((r: any) => r.id === detail.id);
      if (latest) setDetail(JSON.parse(JSON.stringify(latest)));
    }
  }, [data.records, checklistEditing]);
  async function action(body: any) {
    setBusy(true);
    try {
      const r = await apiFetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d: any = await apiJSON(r);
      if (!r.ok) throw Error(d.error);
      await load();
      setToast(d.message || "Saved to workspace");
      setTimeout(() => setToast(""), 6000);
      return d.id || true;
    } catch (e: any) {
      setToast(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const rec = data.records.filter(
    (r: any) => !["system", "invite"].includes(r.kind),
  );
  const stores: string[] = rec.some((r: any) => r.kind === "dealership")
    ? rec
        .filter((r: any) => r.kind === "dealership" && !r.archived)
        .map((r: any) => r.title)
    : [
        "Walker CDJR",
        "Walker Toyota",
        "Walker Honda",
        "Walker Kia",
        "Walker Mazda",
        "Walker BMW",
        "Walker Mercedes-Benz",
        "Walker Pineville Used Cars",
        "Walker Big Lot",
        "Walker GMC",
      ];
  const active = rec.filter((r: any) =>
    archived ? !!r.archived : !r.archived,
  );
  const events = active.filter((r: any) => r.kind === "event");
  const projects = active.filter((r: any) => r.kind === "project");
  const assets = active.filter((r: any) => r.kind === "asset");
  const owner = data.member?.role === "owner";
  const tasks = active.flatMap((r: any) =>
    (r.tasks || []).map((t: any, i: number) => ({ ...t, record: r, index: i })),
  );
  const due = tasks
    .filter((t: any) => t.due && t.status !== "Complete")
    .sort((a: any, b: any) => a.due.localeCompare(b.due));
  const review = active.filter((r: any) => r.status === "Review");
  useEffect(() => {
    if (!edit) setDraftMedia([]);
  }, [edit]);
  function go(p: string) {
    if (p === "Messenger") setChatOpen(false);
    setView(p === "Media Vault" ? "Grid" : "Cards");
    setPage(p);
    setSearch("");
    setFilter("All");
    setStoreFilter("All");
    setArchived(false);
    setMobile(false);
  }
  function open(r: any) {
    if (r.kind === "asset") {
      setMediaDetail(JSON.parse(JSON.stringify(r)));
      return;
    }
    setChecklistEditing(false);
    setDetail(JSON.parse(JSON.stringify(r)));
    setComment("");
  }
  function download(value: any, name: string, type = "application/json") {
    const blob = new Blob(
      [typeof value === "string" ? value : JSON.stringify(value, null, 2)],
      { type },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function upload(
    files: FileList | File[] | null,
    project = "",
    parent = "",
    dealership = "",
    assetFolder = "",
  ) {
    if (!files) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        form.append(
          "dealership",
          dealership ||
            (storeFilter === "All" ? "Walker Automotive Group" : storeFilter),
        );
        form.append("project", project);
        form.append("folder", assetFolder);
        form.append("parent", parent);
        form.append("version", parent ? "Revision" : "Original");
        const r = await apiFetch("/api/files", { method: "POST", body: form });
        const d: any = await apiJSON(r);
        if (!r.ok) throw Error(d.error);
      }
      await load();
      setToast("Upload complete — open a file to name it");
      return true;
    } catch (e: any) {
      setToast(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  function duplicate(r: any) {
    setDetail(null);
    setEdit({
      ...r,
      id: undefined,
      title: r.title + " — New Edition",
      date: "",
      endDate: "",
      dateText: "",
      year: new Date().getFullYear() + 1,
      status: "Proposed",
      budget: "",
      results: "",
      notes: r.description || "",
      history: [],
      comments: [],
      sourceEvent: r.id,
      tasks: (r.tasks || []).map((t: any) => ({
        ...t,
        status: "To Do",
        assignee: "",
        due: "",
      })),
    });
  }
  const addKind =
    page === "Brainstorming"
      ? "idea"
      : page === "Content Planner"
        ? "content"
        : page === "Templates"
          ? "template"
          : page === "My Workspace"
            ? "link"
            : page === "Projects"
              ? "project"
              : "event";
  let items =
    page === "Projects"
      ? active.filter(
          (r: any) =>
            ["project", "folder"].includes(r.kind) &&
            (r.folder || "") === folder,
        )
      : page === "Media Vault"
        ? assets.filter(
            (a: any) =>
              !a.project &&
              !a.folder &&
              (mediaType === "All" || mediaCategory(a) === mediaType),
          )
        : page === "Review Queue"
          ? review
          : page === "Brainstorming"
            ? active.filter((r: any) => r.kind === "idea")
            : page === "Content Planner"
              ? active.filter((r: any) => r.kind === "content")
              : page === "Templates"
                ? active.filter((r: any) => r.kind === "template")
                : page === "My Workspace"
                  ? active.filter(
                      (r: any) => r.kind === "link" || r.kind === "workflow",
                    )
                  : events;
  if (page === "Past Events")
    items = items
      .sort((a: any, b: any) =>
        String(b.date || b.year || "").localeCompare(
          String(a.date || a.year || ""),
        ),
      )
      .filter(
        (r: any) => r.status !== "In Progress" && r.status !== "Proposed",
      );
  items = items
    .sort((a: any, b: any) =>
      String(b.date || b.year || "").localeCompare(
        String(a.date || a.year || ""),
      ),
    )
    .filter(
      (r: any) =>
        (!search ||
          JSON.stringify(r).toLowerCase().includes(search.toLowerCase())) &&
        (filter === "All" || r.status === filter) &&
        (year === "All" || String(r.year) === year) &&
        (storeFilter === "All" || r.dealership === storeFilter),
    );
  function onDate(e: any, date: string) {
    if (e.date === date) return true;
    if (!e.date || date < e.date || (e.endDate && date > e.endDate))
      return false;
    const start = new Date(e.date + "T12:00:00Z"),
      d = new Date(date + "T12:00:00Z");
    if (e.recurrence === "Weekly")
      return (d.getTime() - start.getTime()) % (7 * 86400000) === 0;
    if (e.recurrence === "Monthly")
      return d.getUTCDate() === start.getUTCDate();
    if (e.recurrence === "Annual")
      return (
        d.getUTCDate() === start.getUTCDate() &&
        d.getUTCMonth() === start.getUTCMonth()
      );
    return false;
  }
  const Badge = ({ status }: any) => (
    <span
      className={
        "badge " +
        (status === "Completed" || status === "Approved"
          ? "green"
          : status === "In Progress" || status === "Production"
            ? "pink"
            : status === "Review"
              ? "amber"
              : "")
      }
    >
      {status || "Draft"}
    </span>
  );
  const card = (r: any) => (
    <article
      className={"card record " + (r.title.includes("Gleaux") ? "gleaux" : "")}
      data-select-id={r.id}
      key={r.id}
      onClick={() => (r.kind === "folder" ? setFolder(r.id) : open(r))}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && open(r)}
    >
      <div className="cardtop">
        <span className="eyebrow">{r.dealership || r.category || r.kind}</span>
        <ArrowUpRight size={17} />
      </div>
      {r.kind === "asset" && r.type?.startsWith("image/") && (
        <img className="thumb" src={"/api/files?id=" + r.id} alt={r.title} />
      )}
      <h3>{r.title}</h3>
      {r.source && <small>{r.source}</small>}
      <p>
        {r.kind === "asset" && r.project
          ? rec.find((x: any) => x.id === r.project)?.title || "Campaign media"
          : r.dateText || r.date || r.category || ""}
      </p>
      <div className="cardbottom">
        <Badge status={r.status} />
        {r.kind === "folder" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              open(r);
            }}
          >
            Edit folder
          </button>
        )}
        <span>
          {r.tasks?.length
            ? `${r.tasks.filter((t: any) => t.status === "Complete").length}/${r.tasks.length} tasks`
            : r.owner || "Unassigned"}
        </span>
      </div>
    </article>
  );
  return (
    <div
      className={
        "app workspace-shell " +
        (prefs.theme === "dark" ? "dark" : "") +
        (collapsed ? " nav-collapsed" : "")
      }
      style={
        {
          ...appearanceVariables(prefs),
          fontFamily: prefs.font || "Arial, Helvetica, sans-serif",
          "--radius": (prefs.radius ?? 9) + "px",
          "--accent": prefs.appearance?.primaryBg || prefs.accent || "#cd315e",
        } as any
      }
    >
      <aside
        data-tour="navigation"
        className={mobile ? "sidebar show" : "sidebar"}
      >
        <div className="brand brand-logo-only">
          <BrandImage id={prefs.logo} />
        </div>
        <nav className="workspace-navigation">
          <div className="nav-group-label">Workspace</div>
          {nav
            .filter(([n]) =>
              [
                "Overview",
                "Quick Ideas",
                "Tasks",
                "Content Calendar",
                "Campaigns",
                "Media Vault",
                "Video review",
                "Messenger",
              ].includes(n),
            )
            .map(([n, I]) => (
              <button
                className={page === n ? "selected" : ""}
                onClick={() => go(n)}
                title={sectionGuide[n]?.summary || n}
                data-help={sectionGuide[n]?.summary}
                key={n}
              >
                <I size={16} />
                <span>
                  {n === "Media Vault"
                    ? "Assets"
                    : n === "Overview"
                      ? "Home"
                      : n === "Content Calendar"
                        ? "Calendar"
                        : n === "Video production"
                          ? "Production"
                          : n}
                </span>
                {n === "Quick Ideas" && unreadIdeas().length > 0 && (
                  <span className="count">{unreadIdeas().length}</span>
                )}
                {n === "Review Queue" && review.length > 0 && (
                  <span className="count">{review.length}</span>
                )}
              </button>
            ))}
          <details className="nav-group" key="Create">
            <summary>Create</summary>
            {nav
              .filter(([n]) =>
                [
                  "Video production",
                  "Shot lists",
                  "Social planner",
                  "Ideas library",
                  "Templates",
                ].includes(n),
              )
              .map(([n, I]) => (
                <button
                  className={page === n ? "selected" : ""}
                  onClick={() => go(n)}
                  title={sectionGuide[n]?.summary || n}
                  data-help={sectionGuide[n]?.summary}
                  key={n}
                >
                  <I size={16} />
                  <span>
                    {n === "Media Vault"
                      ? "Assets"
                      : n === "Overview"
                        ? "Home"
                        : n === "Content Calendar"
                          ? "Calendar"
                          : n === "Video production"
                            ? "Production"
                            : n}
                  </span>
                  {n === "Quick Ideas" && unreadIdeas().length > 0 && (
                    <span className="count">{unreadIdeas().length}</span>
                  )}
                  {n === "Review Queue" && review.length > 0 && (
                    <span className="count">{review.length}</span>
                  )}
                </button>
              ))}
          </details>
          <details className="nav-group" key="Organization">
            <summary>Organization</summary>
            {nav
              .filter(([n]) =>
                [
                  "Past Events",
                  "My Workspace",
                  "Marketing Phone Book",
                  "IGNITION",
                  "Reports",
                  "Review Queue",
                  "Archive",
                ].includes(n),
              )
              .map(([n, I]) => (
                <button
                  className={page === n ? "selected" : ""}
                  onClick={() => go(n)}
                  title={sectionGuide[n]?.summary || n}
                  data-help={sectionGuide[n]?.summary}
                  key={n}
                >
                  <I size={16} />
                  <span>
                    {n === "Media Vault"
                      ? "Assets"
                      : n === "Overview"
                        ? "Home"
                        : n === "Content Calendar"
                          ? "Calendar"
                          : n === "Video production"
                            ? "Production"
                            : n}
                  </span>
                  {n === "Quick Ideas" && unreadIdeas().length > 0 && (
                    <span className="count">{unreadIdeas().length}</span>
                  )}
                  {n === "Review Queue" && review.length > 0 && (
                    <span className="count">{review.length}</span>
                  )}
                </button>
              ))}
          </details>
          <details className="nav-group" key="Customize">
            <summary>Customize</summary>
            {nav
              .filter(([n]) => ["Page Editor", "Team & Settings"].includes(n))
              .map(([n, I]) => (
                <button
                  className={page === n ? "selected" : ""}
                  onClick={() => go(n)}
                  title={sectionGuide[n]?.summary || n}
                  data-help={sectionGuide[n]?.summary}
                  key={n}
                >
                  <I size={16} />
                  <span>
                    {n === "Media Vault"
                      ? "Assets"
                      : n === "Overview"
                        ? "Home"
                        : n === "Content Calendar"
                          ? "Calendar"
                          : n === "Video production"
                            ? "Production"
                            : n}
                  </span>
                  {n === "Quick Ideas" && unreadIdeas().length > 0 && (
                    <span className="count">{unreadIdeas().length}</span>
                  )}
                  {n === "Review Queue" && review.length > 0 && (
                    <span className="count">{review.length}</span>
                  )}
                </button>
              ))}
          </details>
        </nav>
        <div className="sidebar-bottom">
          <div className="avatars">
            <span>MH</span>
            <span>TR</span>
          </div>
          <b>One team. Every dealership.</b>
          <p>Walker Automotive Group</p>
        </div>
        <button className="profile" onClick={() => go("Team & Settings")}>
          <span className="profile-picture">
            <ProfileAvatar id={user().id} />
          </span>
          <span className="profile-copy">
            <b>{data.member ? data.member.name : user().name}</b>
            <span className="profile-role">
              {roleLabel(
                data.member?.role || user().role,
                data.member?.isAdmin || user().isAdmin,
              )}
            </span>
          </span>
          <Settings className="profile-settings" size={15} aria-hidden="true" />
        </button>
      </aside>
      <UniversalSelection />
      <main>
        <header>
          <button
            className="icon navigation-toggle"
            aria-label="Toggle navigation"
            data-help={toolbarGuide.navigation}
            onClick={() => {
              if (window.matchMedia("(max-width:800px)").matches)
                setMobile(!mobile);
              else setCollapsed(!collapsed);
            }}
          >
            <Menu size={20} />
          </button>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => {
                go("Overview");
                setDetail(null);
                setMediaDetail(null);
                setChatOpen(false);
              }}
            >
              Workspace
            </button>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">
              {page === "Overview"
                ? "Home"
                : page === "Media Vault" || page === "Dealerships"
                  ? "Assets"
                  : page}
            </span>
          </nav>
          <div className="header-right" data-tour="shortcuts">
            <SiteTour
              userId={loading ? undefined : user().id}
              userName={user().name}
              onNavigate={(next) => {
                setDetail(null);
                setMediaDetail(null);
                setChatOpen(false);
                go(next);
              }}
            />
            <NotificationCenter
              onOpen={(item) => {
                if (item.category === "message") {
                  setNotificationConversation(item.conversationId);
                  setChatOpen(true);
                  return;
                }
                const record = getState().records.find(
                  (r: any) => r.id === item.targetId,
                );
                if (item.targetKind === "note") {
                  openTextNote(item.targetId);
                  return;
                }
                if (item.targetKind === "folder") {
                  setNotificationFolder(
                    item.targetKind === "folder"
                      ? item.targetId
                      : record?.folder || item.folderId,
                  );
                  go("Media Vault");
                } else if (record) open(record);
                else go("Overview");
              }}
            />
            <QuickNote
              onSaved={() => {
                setToast("Note saved to its folder");
                setTimeout(() => setToast(""), 2500);
              }}
            />
            <button
              className="icon quick-idea-global"
              aria-label="Add quick idea"
              data-help={toolbarGuide.idea}
              title="Add quick idea"
              onClick={openQuickIdea}
            >
              <Lightbulb size={18} />
            </button>
            <button
              className="icon refresh-workspace"
              aria-label="Refresh workspace"
              data-help={toolbarGuide.refresh}
              title="Refresh workspace"
              onClick={async () => {
                await load();
                setToast("Workspace refreshed");
                setTimeout(() => setToast(""), 2500);
              }}
            >
              <RefreshCw size={17} />
            </button>
            <button
              className="icon messenger-header-button"
              aria-label="Open messenger"
              data-help={toolbarGuide.messenger}
              title="Messenger"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare size={18} />
              {chatUnread > 0 && (
                <span className="messenger-unread">{chatUnread}</span>
              )}
            </button>
            <button
              className="icon"
              aria-label="Use light mode"
              data-help={toolbarGuide.light}
              title="Light mode"
              aria-pressed={prefs.theme !== "dark"}
              disabled={busy}
              onClick={() => changeMode("light")}
            >
              <Sun size={18} />
            </button>
            <button
              className="icon"
              aria-label="Use dark mode"
              data-help={toolbarGuide.dark}
              title="Dark mode"
              aria-pressed={prefs.theme === "dark"}
              disabled={busy}
              onClick={() => changeMode("dark")}
            >
              <Moon size={18} />
            </button>
          </div>
        </header>
        <div className="content">
          <div className="pagehead" data-tour="page">
            <div>
              <div className="eyebrow">
                WALKER AUTOMOTIVE / CREATIVE OPERATIONS
              </div>
              <h1>
                {page === "Overview"
                  ? user().name + "’s Dashboard"
                  : page === "Media Vault"
                    ? "Assets"
                    : page}
              </h1>
              <p>
                {page === "Overview"
                  ? ""
                  : page === "Past Events"
                    ? "Section 24 · A growing history. A head start on what comes next."
                    : page === "Media Vault"
                      ? "Every store’s files, logos and graphics."
                      : page === "My Workspace"
                        ? "Your quick links, accounts, and daily checks."
                        : page === "Brainstorming"
                          ? "Quick notes and ideas to come back to."
                          : page === "Marketing Phone Book"
                            ? "People and businesses you and Travis work with."
                            : page === "Messenger"
                              ? "Messages, files, and project handoffs."
                              : page === "Page Editor"
                                ? "Your colors, buttons, and personal hero photos."
                                : "Plan together. Create with purpose. Keep everything connected."}
              </p>
            </div>
            {false && page === "Media Vault" && (
              <MediaUploader
                records={rec}
                onUploaded={async (success = true) => {
                  await load();
                  if (success)
                    setToast("Upload complete — open a file to name it");
                }}
                onAddEvent={(files: File[]) => {
                  setEdit(newRecord("event"));
                  setDraftMedia(files);
                }}
              />
            )}
            {page === "Overview" && (
              <time className="dashboard-date" dateTime={today}>
                {dashboardDate(today)}
              </time>
            )}
            {![
              "Quick Ideas",
              "Campaigns",
              "Content Calendar",
              "Video production",
              "Shot lists",
              "Tasks",
              "Social planner",
              "Ideas library",
              "Video review",
              "Reports",
              "Archive",
              "Overview",
              "Team & Settings",
              "IGNITION",
              "Dealerships",
              "Media Vault",
              "Review Queue",
              "My Workspace",
              "Brainstorming",
              "Marketing Phone Book",
              "Messenger",
              "Page Editor",
            ].includes(page) && (
              <button
                className="primary"
                onClick={() => setEdit({ ...newRecord(addKind), folder })}
              >
                <Plus size={17} />{" "}
                {page === "Overview"
                  ? "Add Event"
                  : "Add " +
                    (addKind === "link"
                      ? "Website"
                      : addKind[0].toUpperCase() + addKind.slice(1))}
              </button>
            )}
          </div>
          {toast && (
            <div className="toast" role="status">
              {toast}
              <button onClick={() => setToast("")}>
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="notice">
              {error}
              <button onClick={load}>Retry</button>
              <button onClick={() => window.location.reload()}>
                Reload workspace
              </button>
            </div>
          )}
          {loading && <p>Loading your workspace…</p>}
          {page === "Overview" && (
            <>
              <section className="hero">
                <div>
                  <div className="eyebrow">YOUR SHARED MARKETING STUDIO</div>
                  <h2 className="daily-quote">PINK OUT THE LOT!</h2>
                  <p className="quote-note">Pink Tags. Big Deals.</p>
                  <button onClick={() => go("Past Events")}>
                    Explore the event archive <ArrowUpRight size={17} />
                  </button>
                </div>
                <HeroArtwork
                  date={today}
                  preferences={prefs}
                  onSave={(preferences: any) =>
                    action({ action: "preferences", preferences })
                  }
                />
              </section>
              <section className="stats">
                {[
                  [projects.length, "Active projects"],
                  [
                    events.filter((e: any) => e.status === "In Progress")
                      .length,
                    "Live campaigns",
                  ],
                  [review.length, "Awaiting review"],
                  [assets.length, "Saved media"],
                ].map(([n, l]) => (
                  <div className="card stat" key={l}>
                    <small>{l}</small>
                    <strong>{n}</strong>
                    <span>Shared across your team</span>
                  </div>
                ))}
              </section>
              <DailyQuote />
              <QuickIdeasNotice onGo={() => go("Quick Ideas")} />
              <DayPlanner />
              <ReviewFeedbackFeed onReview={reviewVideo} />
              <RoleOverview onGo={go} onReview={reviewVideo} />
              <CampaignTodos
                records={personalRecords(rec, user())}
                action={action}
                onOpen={open}
                onCalendar={() => go("Content Calendar")}
              />
              <div className="dashboard-campaigns">
                <section>
                  <div className="sectionhead">
                    <h2>Campaigns in motion</h2>
                    <button onClick={() => go("Events & Calendar")}>
                      View all
                    </button>
                  </div>
                  {events
                    .filter((e: any) => e.status === "In Progress")
                    .slice(0, 2)
                    .map(card)}
                  {!events.length && (
                    <div className="card empty">
                      <Archive />
                      <h3>Your history is ready.</h3>
                      <p>
                        Import the 32 events and 314 reusable tasks from your
                        Section 24 upload.
                      </p>
                      <button
                        className="primary"
                        disabled={busy || !owner}
                        onClick={() => action({ action: "import" })}
                      >
                        Import Section 24
                      </button>
                    </div>
                  )}
                </section>
              </div>
              <div className="sectionhead">
                <h2>Across the Walker group</h2>
                <button onClick={() => go("Media Vault")}>
                  All dealerships <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="storegrid dashboard-storegrid">
                {stores.slice(storePage * 8, storePage * 8 + 8).map((s) => (
                  <button
                    className="store"
                    style={
                      brandStyle(
                        folderBrand({ kind: "dealership", title: s }),
                      ) as any
                    }
                    key={s}
                    onClick={() => {
                      go("Media Vault");
                      setStoreFilter(s);
                    }}
                  >
                    <LocationBadge record={{ kind: "dealership", title: s }} />
                    <h3>{s.replace("Walker ", "")}</h3>
                    <small>
                      Open media library <ArrowUpRight size={13} />
                    </small>
                  </button>
                ))}
              </div>
              <div className="store-pages" aria-label="Dealership pages">
                <button
                  disabled={storePage === 0}
                  onClick={() => setStorePage(storePage - 1)}
                >
                  ← Previous
                </button>
                <button
                  disabled={(storePage + 1) * 8 >= stores.length}
                  onClick={() => setStorePage(storePage + 1)}
                >
                  More dealerships →
                </button>
              </div>
            </>
          )}
          {[
            "Past Events",
            "Events & Calendar",
            "Projects",
            "Review Queue",
            "Content Planner",
            "Templates",
          ].includes(page) && (
            <>
              {page === "Past Events" && (
                <div className="notice">
                  <Archive size={18} />
                  <div>
                    <b>A partial historical collection, ready to grow.</b>
                    <p>
                      Unconfirmed events remain Needs Verification. Historical
                      checklist tasks start as Not Verified. Active campaigns
                      live in Events & Calendar.
                    </p>
                  </div>
                  {owner && (
                    <button
                      disabled={busy}
                      onClick={() => action({ action: "import" })}
                    >
                      Import Section 24
                    </button>
                  )}
                </div>
              )}
              {page === "Templates" && (
                <div className="notice">
                  Save reusable creative briefs and attach approved source
                  artwork. Open a saved template in Easy Mode to create
                  recognition graphics with real uploaded photos and logos.
                  Background removal is not connected.
                </div>
              )}
              {["Content Planner", "Events & Calendar"].includes(page) && (
                <>
                  <ContentWeek
                    records={rec}
                    members={data.members || []}
                    onSave={action}
                    onTask={action}
                    onOpen={open}
                  />
                  <p className="planner-publishing-note">
                    This calendar records the plan. Publish posts through your
                    social accounts.
                  </p>
                </>
              )}
              {page === "Projects" && (
                <div className="detailbar">
                  <button onClick={() => setFolder("")}>Projects / Root</button>
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                  >
                    <option value="">Root folder</option>
                    {active
                      .filter((r: any) => r.kind === "folder")
                      .map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => setEdit({ ...newRecord("folder"), folder })}
                  >
                    <Plus size={16} /> Add Folder
                  </button>
                </div>
              )}
              {page === "Media Vault" && (
                <div className="media-type-buttons">
                  {["All", "Audio", "Video", "Images"].map((t) => (
                    <button
                      key={t}
                      className={mediaType === t ? "chosen" : ""}
                      onClick={() => setMediaType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              <div className="toolbar">
                <button onClick={() => setArchived(!archived)}>
                  {archived ? "Show active" : "Show archive"}
                </button>
                <div className="search">
                  <Search size={16} />
                  <input
                    placeholder="Search your workspace…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                >
                  <option>All</option>
                  {stores.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  {[
                    "Completed",
                    "Needs Verification",
                    "In Progress",
                    "Proposed",
                    ...stages,
                  ].map((s, i) => (
                    <option key={s + i}>{s}</option>
                  ))}
                </select>
                {page === "Past Events" && (
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option>All</option>
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                )}
                <select value={view} onChange={(e) => setView(e.target.value)}>
                  {[
                    ...(page === "Media Vault"
                      ? ["Grid", "List"]
                      : ["Cards", "List"]),
                    ...(page === "Projects" ? ["Board"] : []),
                    ...(["Past Events", "Events & Calendar"].includes(page)
                      ? ["Calendar"]
                      : []),
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <button
                  className="icon"
                  title="Export JSON"
                  onClick={() => download(items, "walker-" + page + ".json")}
                >
                  <Download size={17} />
                </button>
              </div>
              {view === "Calendar" ? (
                <>
                  <div className="sectionhead">
                    <h2>Marketing calendar · America/Chicago</h2>
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    />
                  </div>
                  <div className="calendar">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <b key={d}>{d}</b>
                      ),
                    )}
                    {Array.from(
                      { length: new Date(month + "-01T12:00:00").getDay() },
                      (_, i) => (
                        <div key={"blank" + i} />
                      ),
                    )}
                    {Array.from(
                      {
                        length: new Date(
                          Number(month.slice(0, 4)),
                          Number(month.slice(5)),
                          0,
                        ).getDate(),
                      },
                      (_, i) => (
                        <div key={i}>
                          <span>{i + 1}</span>
                          {items
                            .filter((e: any) =>
                              onDate(
                                e,
                                month + "-" + String(i + 1).padStart(2, "0"),
                              ),
                            )
                            .map((e: any) => (
                              <button onClick={() => open(e)} key={e.id}>
                                {e.title}
                              </button>
                            ))}
                        </div>
                      ),
                    )}
                  </div>
                  <h3 className="sectionhead">Dates awaiting verification</h3>
                  <div className="grid">
                    {items.filter((e: any) => !e.date).map(card)}
                  </div>
                </>
              ) : view === "Board" ? (
                <div className="kanban">
                  {stages.map((s) => (
                    <section
                      key={s}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const r = items.find(
                          (x: any) =>
                            x.id === e.dataTransfer.getData("text/plain"),
                        );
                        if (r) action({ record: { ...r, status: s } });
                      }}
                    >
                      <h3>{s}</h3>
                      {items
                        .filter((r: any) => r.status === s)
                        .map((r: any) => (
                          <div
                            key={r.id}
                            draggable
                            onDragStart={(e) =>
                              e.dataTransfer.setData("text/plain", r.id)
                            }
                          >
                            {card(r)}
                          </div>
                        ))}
                    </section>
                  ))}
                </div>
              ) : view === "List" ? (
                <div className="card list">
                  {items.map((r: any) => (
                    <button key={r.id} onClick={() => open(r)}>
                      <div>
                        <b>{r.title}</b>
                        <small>
                          {r.dealership} ·{" "}
                          {r.date || r.dateText || "Date undecided"}
                        </small>
                      </div>
                      <Badge status={r.status} />
                      <ChevronRight size={17} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid">{items.map(card)}</div>
              )}
              {!items.length && (
                <div className="empty">
                  <FolderOpen />
                  <h3>Make space for the next good idea.</h3>
                  <p>
                    {page === "Past Events"
                      ? "Import the source history, or add an older event."
                      : "No matching records yet. Add one to start collaborating."}
                  </p>
                </div>
              )}
            </>
          )}
          <Messenger
            active={page === "Messenger"}
            requestedConversation={notificationConversation}
            floating={chatOpen && page !== "Messenger"}
            onClose={() => setChatOpen(false)}
            onExpand={() => go("Messenger")}
            member={data.member}
            records={rec}
            onUploaded={load}
            onUnread={setChatUnread}
            onIncoming={(message: any) => {
              setChatToast(message);
              setTimeout(() => setChatToast(null), 10000);
            }}
            onProject={open}
          />
          {page === "Page Editor" && (
            <PageEditor preferences={prefs} onSave={action} onReload={load} />
          )}
          {page === "My Workspace" && <PersonalWorkspace records={rec} />}
          {page === "Marketing Phone Book" && (
            <PhoneBook records={rec} onSave={action} />
          )}{" "}
          {page === "Brainstorming" && (
            <Brainstorming records={rec} onSave={action} />
          )}
          {false && page === "Dealerships" && (
            <>
              <div className="sectionhead">
                <p>Approved branding and media organized by location.</p>
                {owner && (
                  <button onClick={() => setEdit(newRecord("dealership"))}>
                    Add dealership
                  </button>
                )}
              </div>
              <div className="storegrid large">
                {stores.map((s, i) => (
                  <section key={s}>
                    <div className="sectionhead">
                      <h3>{s}</h3>
                      {owner && (
                        <button
                          onClick={() =>
                            open(
                              rec.find(
                                (r: any) =>
                                  r.kind === "dealership" && r.title === s,
                              ) || { ...newRecord("dealership"), title: s },
                            )
                          }
                        >
                          Customize
                        </button>
                      )}
                    </div>
                    <button
                      className="store"
                      onClick={() => {
                        go("Media Vault");
                        setStoreFilter(s);
                      }}
                    >
                      <LocationBadge
                        record={{ kind: "dealership", title: s }}
                      />
                      {rec.find(
                        (r: any) => r.kind === "dealership" && r.title === s,
                      )?.artwork ? (
                        <img
                          style={{
                            width: "100%",
                            height: 95,
                            objectFit: "contain",
                          }}
                          src={
                            "/api/files?id=" +
                            rec.find(
                              (r: any) =>
                                r.kind === "dealership" && r.title === s,
                            ).artwork
                          }
                          alt={s}
                        />
                      ) : (
                        <h2>{s.replace("Walker ", "")}</h2>
                      )}
                      <small>
                        {assets.filter((a: any) => a.dealership === s).length}{" "}
                        media files <ArrowUpRight size={17} />
                      </small>
                    </button>
                  </section>
                ))}
              </div>
            </>
          )}
          {[
            "Campaigns",
            "Video production",
            "Social planner",
            "Ideas library",
          ].includes(page) && (
            <Operations section={page} onReview={reviewVideo} />
          )}
          <QuickIdeas active={page === "Quick Ideas"} />
          {page === "Content Calendar" && (
            <PlanningCalendar
              onOpen={(r: any) => {
                go(
                  r.kind === "project"
                    ? "Campaigns"
                    : r.kind === "event"
                      ? "Past Events"
                      : r.kind === "video"
                        ? "Video production"
                        : r.kind === "todo"
                          ? "Tasks"
                          : "Social planner",
                );
                open(r);
              }}
            />
          )}
          {page === "Tasks" && <TaskBoard onReview={reviewVideo} />}
          {page === "Shot lists" && <ShotStudio />}
          {page === "Video review" && (
            <VideoReview
              key={reviewId + (sessionStorage.getItem("wam-seek") || "")}
              initial={reviewId}
            />
          )}
          {page === "Reports" && <Reports />}
          {page === "Archive" && <ArchiveRoom />}
          {page === "Media Vault" && (
            <Library initialFolder={notificationFolder} />
          )}
          {page === "Dealerships" && <Library />}
          {page === "Team & Settings" && <PreviewAdmin />}
          {page === "IGNITION" && (
            <div className="twocol">
              <div className="card panel">
                <Sparkles className="accent" />
                <h2>Captions, scripts & campaign briefs</h2>
                <p>
                  Choose what you need, copy the brief, and use it in ChatGPT.
                </p>
                <label>
                  What are you working on?
                  <select
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  >
                    {[
                      "Plan a campaign",
                      "Draft captions and scripts",
                      "Prepare weekly production overview",
                      "Repurpose approved content",
                      "Plan next year’s event",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <textarea
                  rows={8}
                  readOnly
                  value={`${prompt} for Walker Automotive Group. Ask me for the campaign, dealership, audience, offer details, and deadline you need. Use only confirmed company information; flag anything that needs verification. Give me clear draft copy and an actionable checklist. Keep sales promotions separate from charitable fundraising and include required disclosures when provided.`}
                />
                <div className="ignition-actions">
                  <button
                    className="primary"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `${prompt} for Walker Automotive Group. Ask me for the campaign, dealership, audience, offer details, and deadline you need. Use only confirmed company information; flag anything that needs verification. Give me clear draft copy and an actionable checklist. Keep sales promotions separate from charitable fundraising and include required disclosures when provided.`,
                        );
                        setToast("Brief copied — paste it into ChatGPT");
                      } catch {
                        setToast("Select and copy the brief from the text box");
                      }
                    }}
                  >
                    Copy brief
                  </button>
                  <a
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open ChatGPT <ArrowUpRight size={15} />
                  </a>
                </div>
                <p>
                  Save the finished copy in Content Planner. Upload finished
                  graphics and files in Media Vault.
                </p>
              </div>
              <div className="card panel">
                <h2>Ideas & drafts</h2>
                <p>Save a new idea or pick up a draft you already started.</p>
                <button
                  className="primary"
                  onClick={() => setEdit(newRecord("idea"))}
                >
                  <Plus size={16} /> Add idea
                </button>
                <div className="ignition-drafts">
                  {active
                    .filter((r: any) => ["idea", "content"].includes(r.kind))
                    .slice(0, 4)
                    .map(card)}
                  {!active.some((r: any) =>
                    ["idea", "content"].includes(r.kind),
                  ) && <p>No saved ideas or drafts yet.</p>}
                </div>
                <div className="ignition-actions">
                  <button onClick={() => go("Brainstorming")}>
                    Brainstorming
                  </button>
                  <button onClick={() => go("Content Planner")}>
                    Content Planner
                  </button>
                </div>
              </div>
            </div>
          )}
          {false && page === "Team & Settings" && (
            <div className="twocol">
              <section className="card panel">
                <h2>Your account</h2>
                <p>{data.member?.email}</p>
                <Badge status={owner ? "Owner" : "Coordinator"} />
                <h3>My profile photo</h3>
                <ProfilePhotoUploader
                  accent={prefs.accent}
                  theme={prefs.theme}
                  member={data.member}
                  version={avatarVersion}
                  onSaved={async () => {
                    setAvatarVersion(Date.now());
                    await load();
                    setToast("Your cropped profile photo is saved");
                  }}
                />
                <h3>Personalize your dashboard</h3>
                <label>
                  Appearance
                  <select
                    value={prefs.theme || "light"}
                    onChange={(e) =>
                      setPrefs({ ...prefs, theme: e.target.value })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <label>
                  Accent color
                  <input
                    type="color"
                    value={prefs.accent || "#cd315e"}
                    onChange={(e) =>
                      setPrefs({ ...prefs, accent: e.target.value })
                    }
                  />
                </label>
                <button
                  className="primary"
                  onClick={() =>
                    action({ action: "preferences", preferences: prefs })
                  }
                >
                  Save my preferences
                </button>
                <p>These preferences belong to your account only.</p>
                <a href="/signin-with-chatgpt?return_to=/" target="_top">
                  Sign in / register with ChatGPT
                </a>
              </section>
              <section className="card panel">
                <h3>Trav’s access &amp; sign-in</h3>
                <p>
                  Authorize his email, then grant the same email access through
                  this Site’s sharing settings. He signs in using his own
                  ChatGPT credentials; this site never stores his password.
                </p>
                <label>
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Trav’s work email"
                    disabled={!owner}
                  />
                </label>
                <button
                  className="primary"
                  disabled={!owner || busy || !email.trim()}
                  onClick={async () => {
                    if (await action({ action: "invite", email })) setEmail("");
                  }}
                >
                  {busy ? "Saving…" : "Authorize coordinator email"}
                </button>
                <section
                  className="access-status"
                  aria-label="Coordinator authorization status"
                >
                  <h3>Authorized coordinator emails</h3>
                  {owner ? (
                    data.records.filter((r: any) => r.kind === "invite")
                      .length ? (
                      data.records
                        .filter((r: any) => r.kind === "invite")
                        .map((r: any) => {
                          const account = data.members.find(
                            (m: any) =>
                              m.email.toLowerCase() === r.email.toLowerCase(),
                          );
                          return (
                            <article className="access-entry" key={r.id}>
                              <b>{r.email}</b>
                              <p>
                                <Badge status="Authorized in app" />
                              </p>
                              <p>
                                {account
                                  ? "✓ ChatGPT sign-in confirmed — " +
                                    account.name
                                  : "Awaiting first ChatGPT sign-in"}
                              </p>
                              {account?.seen_at && (
                                <small>
                                  Last active:{" "}
                                  {new Date(account.seen_at).toLocaleString(
                                    "en-US",
                                    { timeZone: "America/Chicago" },
                                  )}{" "}
                                  Central
                                </small>
                              )}
                              {r.authorizedAt && (
                                <small>
                                  Authorized:{" "}
                                  {new Date(r.authorizedAt).toLocaleString(
                                    "en-US",
                                    { timeZone: "America/Chicago" },
                                  )}{" "}
                                  Central
                                </small>
                              )}
                            </article>
                          );
                        })
                    ) : (
                      <p>No coordinator email has been authorized yet.</p>
                    )
                  ) : (
                    <p>Signed in with ChatGPT as {data.member?.email}.</p>
                  )}
                  <p>
                    <b>Site sharing is a separate step.</b> This form cannot
                    verify or change the Site’s sharing list. In Site sharing,
                    confirm the exact email above is allowed. Then send Trav the
                    site link and have him sign in using that same email. If he
                    has not signed in yet, the status above will stay pending.
                  </p>
                  <button disabled={busy} onClick={load}>
                    Refresh sign-in status
                  </button>
                  <a
                    className="button"
                    href="https://walker-marketing-suite.divinemug.chatgpt.site"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open team site link
                  </a>
                  <small>
                    Status refreshes automatically every 30 seconds. Sign-in
                    confirmation means this ChatGPT account has reached the
                    workspace; a separate ChatGPT plugin connection is not
                    verified here.
                  </small>
                </section>
                <p>
                  No invitation email is sent by this form. Email notifications,
                  Google Drive sync, and direct social publishing require
                  separate setup.
                </p>
                <details>
                  <summary>ChatGPT connection setup (optional)</summary>
                  <p>
                    Connecting lets your ChatGPT account read campaign records
                    and save drafts directly to this site.
                  </p>
                  <ol>
                    <li>
                      In ChatGPT Work, open Plugins → Personal → Created by you.
                    </li>
                    <li>
                      Find Walker Marketing Suite and choose Install or Connect.
                    </li>
                    <li>
                      Use your own account, then ask ChatGPT to list your
                      campaign records.
                    </li>
                  </ol>
                  <p>
                    Each teammate needs site access and a separate connection.
                    Until connected, use IGNITION’s Copy brief button.
                  </p>
                  <details>
                    <summary>Advanced: connection address</summary>
                    <code>
                      https://walker-marketing-suite.divinemug.chatgpt.site/mcp
                    </code>
                  </details>
                </details>
              </section>
            </div>
          )}
        </div>
        <footer>
          WALKER MARKETING SUITE{" "}
          <span>Shared work. Clear approvals. Original media.</span>
        </footer>
      </main>
      {edit && (
        <div className="overlay">
          <form
            className="modal"
            onSubmit={async (e) => {
              e.preventDefault();
              const record = withCampaignTasks(edit, edit.id ? edit : null);
              const id = await action({ record });
              if (!id) return;
              const savedId = typeof id === "string" ? id : edit.id;
              setEdit({ ...record, id: savedId });
              for (const file of draftMedia) {
                if (!(await upload([file], savedId, "", record.dealership)))
                  return;
                setDraftMedia((current) => current.filter((x) => x !== file));
              }
              setEdit(null);
              setDetail(null);
            }}
          >
            <div className="modalhead">
              <div>
                <small>SHARED WORKSPACE</small>
                <h2>
                  {edit.id ? "Edit" : "Add"} {edit.kind}
                </h2>
              </div>
              <button type="button" onClick={() => setEdit(null)}>
                <X />
              </button>
            </div>
            <div className="formgrid">
              {!edit.id && ["event", "project"].includes(edit.kind) && (
                <p className="full">
                  A production to-do checklist will be added when you save this
                  campaign. Assignments and suggested dates can be edited
                  afterward.
                </p>
              )}
              <label className="full">
                Name
                <input
                  required
                  value={edit.title}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                />
              </label>
              <label>
                Dealership
                <select
                  value={edit.dealership}
                  onChange={(e) =>
                    setEdit({ ...edit, dealership: e.target.value })
                  }
                >
                  <option>Walker Automotive Group</option>
                  {stores.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Owner / assignee
                <select
                  value={edit.owner}
                  onChange={(e) => setEdit({ ...edit, owner: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  <option>McKenzie</option>
                  <option>Trav</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={edit.status}
                  onChange={(e) => setEdit({ ...edit, status: e.target.value })}
                >
                  {[
                    "Proposed",
                    "Needs Verification",
                    "In Progress",
                    "Completed",
                    ...stages,
                    "Draft",
                    "Rejected",
                  ].map((s, i) => (
                    <option key={s + i}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <input
                  value={edit.category || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, category: e.target.value })
                  }
                />
              </label>
              <label>
                Start date
                <input
                  type="date"
                  value={edit.date || ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      date: e.target.value,
                      year: Number(e.target.value.slice(0, 4)),
                    })
                  }
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={edit.endDate || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, endDate: e.target.value })
                  }
                />
              </label>
              <label>
                Budget ($)
                <input
                  type="number"
                  min="0"
                  value={edit.budget || ""}
                  onChange={(e) => setEdit({ ...edit, budget: e.target.value })}
                />
              </label>
              <label>
                Recurrence
                <select
                  value={edit.recurrence || "One-time"}
                  onChange={(e) =>
                    setEdit({ ...edit, recurrence: e.target.value })
                  }
                >
                  {[
                    "One-time",
                    "Weekly",
                    "Monthly",
                    "Quarterly",
                    "Annual",
                    "As needed",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {edit.kind === "link" && (
                <label className="full">
                  Website URL
                  <input
                    type="url"
                    required
                    value={edit.url || ""}
                    onChange={(e) => setEdit({ ...edit, url: e.target.value })}
                  />
                </label>
              )}
              {edit.kind === "content" && (
                <>
                  <label>
                    Platform
                    <select
                      value={edit.platform || "Facebook"}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          platform: e.target.value,
                          channels: [e.target.value],
                        })
                      }
                    >
                      {[
                        "Facebook",
                        "Instagram",
                        "TikTok",
                        "YouTube",
                        "Google Business Profile",
                        "Website",
                        "Email",
                        "TV",
                        "Radio",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Approval
                    <select
                      disabled={!owner}
                      value={edit.approval || "Draft"}
                      onChange={(e) =>
                        setEdit({ ...edit, approval: e.target.value })
                      }
                    >
                      <option>Draft</option>
                      <option>Review</option>
                      <option>Approved</option>
                      <option>Revision</option>
                    </select>
                  </label>
                </>
              )}
              {edit.kind === "event" && (
                <>
                  <label>
                    Location
                    <input
                      value={edit.location || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, location: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Planning deadline
                    <input
                      type="date"
                      value={edit.deadline || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, deadline: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Information provider
                    <input
                      value={edit.provider || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, provider: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Approval owner
                    <input
                      value={edit.approver || "McKenzie"}
                      onChange={(e) =>
                        setEdit({ ...edit, approver: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Lead time (days)
                    <input
                      type="number"
                      min="0"
                      value={edit.leadTime || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, leadTime: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Required media
                    <input
                      value={edit.requiredMedia || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, requiredMedia: e.target.value })
                      }
                      placeholder="Photos, graphics, video, print…"
                    />
                  </label>
                  <label className="full">
                    Marketing channels
                    <input
                      value={
                        Array.isArray(edit.channels)
                          ? edit.channels.join(", ")
                          : edit.channels || ""
                      }
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          channels: e.target.value
                            .split(",")
                            .map((x) => x.trim()),
                        })
                      }
                    />
                  </label>
                </>
              )}
              {edit.kind === "asset" && (
                <label className="full">
                  Assign to campaign / event
                  <select
                    value={edit.project || ""}
                    onChange={(e) =>
                      setEdit({ ...edit, project: e.target.value })
                    }
                  >
                    <option value="">No campaign assigned</option>
                    {rec
                      .filter(
                        (r: any) =>
                          ["event", "project"].includes(r.kind) && !r.archived,
                      )
                      .map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {["project", "folder", "asset"].includes(edit.kind) && (
                <label className="full">
                  Parent folder
                  <select
                    value={edit.folder || ""}
                    onChange={(e) =>
                      setEdit({ ...edit, folder: e.target.value })
                    }
                  >
                    <option value="">Root</option>
                    {active
                      .filter(
                        (r: any) => r.kind === "folder" && r.id !== edit.id,
                      )
                      .map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {edit.kind === "dealership" && (
                <label className="full">
                  Custom card artwork
                  <select
                    value={edit.artwork || ""}
                    onChange={(e) =>
                      setEdit({ ...edit, artwork: e.target.value })
                    }
                  >
                    <option value="">Default lettering</option>
                    {assets
                      .filter((r: any) => r.type?.startsWith("image/"))
                      .map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {["event", "project"].includes(edit.kind) && (
                <label className="full event-media-input">
                  Event / campaign media
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    multiple
                    onChange={(e) =>
                      setDraftMedia(Array.from(e.target.files || []))
                    }
                  />
                  <small>
                    Images or video. These files save with this event and appear
                    in Media Vault.
                  </small>
                  {draftMedia.map((file, i) => (
                    <span className="queued-media-file" key={i}>
                      {file.name}
                      <button
                        type="button"
                        onClick={() =>
                          setDraftMedia(draftMedia.filter((_, j) => j !== i))
                        }
                        aria-label={"Remove " + file.name}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </label>
              )}
              <label className="full">
                Description / brief / caption
                <textarea
                  rows={5}
                  value={edit.notes || ""}
                  onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
                />
              </label>
              <label className="full">
                Results and lessons learned
                <textarea
                  rows={3}
                  value={edit.results || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, results: e.target.value })
                  }
                  placeholder="Verified outcomes only; leave unknown metrics blank"
                />
              </label>
            </div>
            <div className="modalactions">
              <button type="button" onClick={() => setEdit(null)}>
                Cancel
              </button>
              <button className="primary" disabled={busy}>
                Save {edit.kind}
              </button>
            </div>
          </form>
        </div>
      )}
      {chatToast && (
        <div className="message-toast" role="status">
          <button
            className="message-toast-open"
            onClick={() => {
              setChatOpen(true);
              setChatToast(null);
            }}
          >
            <MessageSquare size={18} />
            <span>
              <b>{chatToast.sender_name}</b>
              <small>{chatToast.text || "Sent an attachment"}</small>
            </span>
          </button>
          <button
            className="icon"
            aria-label="Dismiss message notification"
            onClick={() => setChatToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {mediaDetail && (
        <MediaDetails
          key={mediaDetail.id}
          asset={mediaDetail}
          records={rec}
          onSave={action}
          onClose={() => setMediaDetail(null)}
          onDeleted={load}
        />
      )}
      {detail && (
        <div className="overlay">
          <section className="modal wide">
            <div className="modalhead">
              <div>
                <small>
                  {detail.kind.toUpperCase()} / {detail.dealership}
                </small>
                <h2>{detail.title}</h2>
              </div>
              <button onClick={() => setDetail(null)}>
                <X />
              </button>
            </div>
            <div className="detailbar">
              <Badge status={detail.status} />
              <span>
                {detail.date || detail.dateText || "Date not confirmed"}
              </span>
              <button onClick={() => setEdit({ ...detail })}>
                Edit details
              </button>
              <button onClick={() => duplicate(detail)}>Plan this again</button>
              <button onClick={() => download(detail, detail.title + ".json")}>
                Export JSON
              </button>
              <button
                onClick={() =>
                  download(
                    `# ${detail.title}\n\n${detail.notes}\n\n${(detail.tasks || []).map((t: any) => `- [${t.status === "Complete" ? "x" : " "}] ${t.title} (${t.status})`).join("\n")}`,
                    detail.title + ".md",
                    "text/markdown",
                  )
                }
              >
                Markdown
              </button>
              <button onClick={() => window.print()}>Print / PDF</button>
            </div>
            {detail.kind === "template" && (
              <button className="primary" onClick={() => setStudio(detail)}>
                Open graphic studio
              </button>
            )}
            {detail.kind === "link" && (
              <a
                className="primary"
                href={detail.url}
                target="_blank"
                rel="noreferrer"
              >
                Open website <ArrowUpRight size={17} />
              </a>
            )}
            {detail.kind === "asset" && (
              <>
                <a
                  className="primary"
                  href={"/api/files?id=" + detail.id}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open / download original
                </a>
                {detail.type?.startsWith("image/") && (
                  <img
                    className="assetpreview"
                    src={"/api/files?id=" + detail.id}
                    alt={detail.title}
                  />
                )}
                <div className="detailbar">
                  <button
                    onClick={async () => {
                      const d = { ...detail, status: "Review" };
                      if (await action({ record: d })) setDetail(d);
                    }}
                  >
                    Submit for review
                  </button>
                  {owner &&
                    ["Approved", "Revision", "Rejected"].map((s) => (
                      <button
                        key={s}
                        onClick={async () => {
                          const d = { ...detail, status: s };
                          if (await action({ record: d })) setDetail(d);
                        }}
                      >
                        {s === "Revision" ? "Request revisions" : s}
                      </button>
                    ))}
                  <label className="button">
                    Upload new version
                    <input
                      type="file"
                      onChange={(e) =>
                        upload(e.target.files, detail.project, detail.id)
                      }
                    />
                  </label>
                </div>
              </>
            )}
            <div className="detailinfo">
              <p className="prewrap">
                {detail.notes || "Add a brief, context, or historical notes."}
              </p>
              {detail.results && (
                <>
                  <h3>Verified results</h3>
                  <p className="prewrap">{detail.results}</p>
                </>
              )}
            </div>
            {["project", "event", "folder"].includes(detail.kind) && (
              <AssetFolder
                folder={detail}
                assets={assets}
                onSave={action}
                onOpen={open}
                onUpload={upload}
              />
            )}
            {["project", "event"].includes(detail.kind) && (
              <>
                <div className="checklist-section-heading">
                  <h3>
                    {checklistEditing
                      ? "Edit checklist"
                      : "Production checklist"}{" "}
                    <small>{detail.tasks?.length || 0} tasks</small>
                  </h3>
                  <button
                    onClick={() => {
                      if (checklistEditing) {
                        const current = rec.find(
                          (r: any) => r.id === detail.id,
                        );
                        if (current)
                          setDetail(JSON.parse(JSON.stringify(current)));
                      }
                      setChecklistEditing(!checklistEditing);
                    }}
                  >
                    {checklistEditing ? "Cancel edit" : "Edit checklist"}
                  </button>
                </div>
                <p className="muted">
                  Historical tasks are Not Verified until confirmed.
                </p>
                {checklistEditing ? (
                  <div className="checklist-editor">
                    <div className="checklist">
                      {(detail.tasks || []).map((t: any, i: number) => (
                        <div className="task" key={i}>
                          <input
                            className="campaign-task-check"
                            type="checkbox"
                            aria-label={"Complete " + t.title}
                            checked={t.status === "Complete"}
                            onChange={(e) =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i
                                    ? {
                                        ...x,
                                        status: e.target.checked
                                          ? "Complete"
                                          : "To Do",
                                      }
                                    : x,
                                ),
                              })
                            }
                          />
                          <input
                            aria-label="Task title"
                            value={t.title}
                            onChange={(e) =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i ? { ...x, title: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <select
                            aria-label="Task status"
                            value={t.status}
                            onChange={(e) =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i
                                    ? { ...x, status: e.target.value }
                                    : x,
                                ),
                              })
                            }
                          >
                            {[
                              "Not Verified",
                              "To Do",
                              "In Progress",
                              "Complete",
                            ].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <select
                            aria-label="Task assignee"
                            value={t.assignee}
                            onChange={(e) =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i
                                    ? { ...x, assignee: e.target.value }
                                    : x,
                                ),
                              })
                            }
                          >
                            <option value="">Unassigned</option>
                            <option>McKenzie</option>
                            <option>Trav</option>
                          </select>
                          <input
                            aria-label="Task due date"
                            type="date"
                            value={t.due}
                            onChange={(e) =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i ? { ...x, due: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <button
                            aria-label="Remove task"
                            onClick={() =>
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.filter(
                                  (_: any, j: number) => j !== i,
                                ),
                              })
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setDetail({
                          ...detail,
                          tasks: [
                            ...(detail.tasks || []),
                            {
                              title: "New task",
                              status: "To Do",
                              assignee: "",
                              due: "",
                            },
                          ],
                        })
                      }
                    >
                      <Plus size={15} /> Add task
                    </button>
                    <button
                      className="primary"
                      disabled={busy}
                      onClick={async () => {
                        if (await action({ record: detail }))
                          setChecklistEditing(false);
                      }}
                    >
                      Save checklist
                    </button>
                    <button
                      disabled={!detail.date}
                      onClick={() => {
                        const base = new Date(detail.date + "T12:00:00Z");
                        const milestones = [
                          ["Brief and objectives", 21],
                          ["Creative production", 14],
                          ["Owner review and approval", 7],
                          ["Final materials and reminders", 2],
                          ["Post-event recap", -2],
                        ].map(([title, days]) => {
                          const d = new Date(base);
                          d.setUTCDate(d.getUTCDate() - Number(days));
                          return {
                            title,
                            status: "To Do",
                            assignee: days === 7 ? "McKenzie" : "Trav",
                            due: d.toISOString().slice(0, 10),
                          };
                        });
                        setDetail({
                          ...detail,
                          tasks: [...(detail.tasks || []), ...milestones],
                        });
                      }}
                    >
                      Suggest production milestones
                    </button>
                  </div>
                ) : (
                  <div className="campaign-checklist-view">
                    {(detail.tasks || []).map((t: any, i: number) => (
                      <div
                        className={
                          "campaign-checklist-item " +
                          (t.status === "Complete" ? "done" : "")
                        }
                        key={i}
                      >
                        <input
                          type="checkbox"
                          aria-label={"Complete " + t.title}
                          checked={t.status === "Complete"}
                          disabled={busy}
                          onChange={async (e) => {
                            const status = e.target.checked
                              ? "Complete"
                              : "To Do";
                            if (
                              await action({
                                action: "task",
                                recordId: detail.id,
                                index: i,
                                title: t.title,
                                status,
                                assignee: t.assignee || "",
                                due: t.due || "",
                                eventDate: t.eventDate || "",
                                urgency: t.urgency || "Auto",
                              })
                            )
                              setDetail({
                                ...detail,
                                tasks: detail.tasks.map((x: any, j: number) =>
                                  j === i ? { ...x, status } : x,
                                ),
                              });
                          }}
                        />
                        <div>
                          <b>{t.title}</b>
                          <small>
                            {t.assignee || "Unassigned"}
                            {t.due ? " · " + t.due : ""} · {t.status}
                          </small>
                          {t.notes && <p>{t.notes}</p>}
                        </div>
                      </div>
                    ))}
                    {!detail.tasks?.length && (
                      <p>No tasks yet. Use Edit checklist to add them.</p>
                    )}
                  </div>
                )}
              </>
            )}
            <h3>Team conversation</h3>
            {(detail.comments || []).map((c: any, i: number) => (
              <div className="comment" key={i}>
                <b>{c.by}</b>
                <small>{c.at}</small>
                <p>{c.text}</p>
              </div>
            ))}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Feedback, handoff notes, or the next creative idea…"
            />
            <button
              disabled={!comment.trim() || busy}
              onClick={async () => {
                const d = {
                  ...detail,
                  comments: [
                    ...(detail.comments || []),
                    {
                      text: comment,
                      by: data.member.name,
                      at: new Date().toISOString(),
                    },
                  ],
                };
                if (await action({ record: d })) {
                  setDetail(d);
                  setComment("");
                }
              }}
            >
              Post comment
            </button>
            <details>
              <summary>Activity and approval history</summary>
              {(detail.history || []).map((h: any, i: number) => (
                <p key={i}>
                  {h.at} · {h.by} · {h.action} · {h.status}
                </p>
              ))}
            </details>
            <div className="modalactions">
              <button
                className="danger"
                onClick={async () => {
                  if (
                    confirm(
                      detail.archived
                        ? "Restore this record?"
                        : "Archive this record? Original files will be preserved.",
                    )
                  ) {
                    await action({ action: "delete", id: detail.id });
                    setDetail(null);
                  }
                }}
              >
                {detail.archived ? "Restore" : "Archive"}
              </button>
              <button onClick={() => setDetail(null)}>Close</button>
            </div>
          </section>
        </div>
      )}
      {studio && (
        <TemplateStudio
          template={studio}
          onClose={() => setStudio(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
