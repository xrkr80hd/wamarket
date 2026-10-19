export const sectionGuide: Record<
  string,
  { title: string; summary: string; action: string }
> = {
  Overview: {
    title: "Home",
    summary:
      "Your team's starting point: active projects, campaigns, items awaiting review, saved media, daily planning, and recent video feedback.",
    action:
      "Use the dashboard to see what needs attention, then open the relevant section.",
  },
  "Quick Ideas": {
    title: "Quick Ideas",
    summary:
      "Capture an idea while it is fresh and share it with the team. The badge shows unread ideas.",
    action: "Use the lightbulb in the top bar to add an idea from anywhere.",
  },
  Campaigns: {
    title: "Campaigns",
    summary:
      "Organize marketing projects by dealership, owner, date, and workflow status, with related tasks and notes.",
    action:
      "Create a campaign or open an existing card to review its details and next steps.",
  },
  "Content Calendar": {
    title: "Calendar",
    summary:
      "See dated campaigns, events, videos, content, and tasks together. Switch between Month, Week, and Agenda and filter by location or person.",
    action:
      "Tap a date to inspect its items or plan something new. Drag a dated item to reschedule it.",
  },
  "Video production": {
    title: "Production",
    summary:
      "Track video projects from planning through production and review. Keep each video's brief, owner, shoot date, tasks, and versions together.",
    action:
      "Open a video project to review its production details or send it into video review.",
  },
  "Shot lists": {
    title: "Shot lists",
    summary:
      "Plan the individual shots for a video: framing, camera movement, subject, location, people, vehicles, equipment, and references.",
    action:
      "Choose a video project first, then add shots. Export JSON or use Print / PDF for a shoot-day copy.",
  },
  "Media Vault": {
    title: "Assets",
    summary:
      "Store and organize images, video, and audio. Media can stay unassigned in the asset pool until it belongs to a project or other item.",
    action:
      "Upload or drop files, open an asset for details, and assign it when ready. Use the selection circles or long-press for bulk actions.",
  },
  Tasks: {
    title: "Tasks",
    summary:
      "Track assignments, deadlines, and progress so everyone knows who is responsible for the next step.",
    action:
      "Filter the task board, open a task, and update its owner, due date, or status.",
  },
  "Video review": {
    title: "Video review",
    summary:
      "Watch video versions and leave precise feedback at a time or time range. Reviewers can track revisions and make approval decisions when their role allows it.",
    action:
      "Select a video and version, pause at the relevant moment, and add a clear note describing the change needed.",
  },
  "Review Queue": {
    title: "Review Queue",
    summary:
      "Find records currently marked Review in one place, so items waiting for a decision are easier to spot.",
    action:
      "Open a record to inspect its details. Use Video review for playback and timestamped feedback.",
  },
  "Social planner": {
    title: "Social planner",
    summary:
      "Prepare social content with dates, channels, ownership, notes, and workflow status.",
    action:
      "Plan the post here and publish through the actual social account. A Scheduled or Published label records the team's status.",
  },
  "Ideas library": {
    title: "Ideas library",
    summary:
      "Keep longer-lived creative concepts organized by dealership, owner, and status for future marketing work.",
    action:
      "Add an idea, search existing concepts, or open a card to develop its notes.",
  },
  Dealerships: {
    title: "Dealerships",
    summary:
      "Browse the media library by Walker location to find branding and assets for the right dealership.",
    action: "Choose a dealership and inspect its folders and files.",
  },
  "Past Events": {
    title: "Past Events",
    summary:
      "Look back at historical events, checklists, and supporting details when planning the next event. Some imported history still needs verification.",
    action:
      "Search or filter by dealership, year, or status, then open an event to review its checklist.",
  },
  Templates: {
    title: "Templates",
    summary:
      "Save reusable creative briefs and attach approved source artwork. Saved templates can be opened in Easy Mode for recognition graphics.",
    action:
      "Open a template and use real uploaded photos and logos. Background removal is not connected.",
  },
  "My Workspace": {
    title: "My Workspace",
    summary:
      "Keep your personal work links, accounts, and daily checks close at hand.",
    action:
      "Use this area for the shortcuts and reminders you return to often.",
  },
  "Marketing Phone Book": {
    title: "Marketing Phone Book",
    summary:
      "Keep the people and businesses the marketing team works with in one searchable place.",
    action: "Find a contact or add and update their details.",
  },
  Messenger: {
    title: "Messenger",
    summary:
      "Message teammates, share files, and hand off project work. The chat icon in the top bar shows the unread message count.",
    action:
      "Choose a conversation to read or send messages. The top-bar icon opens chat without leaving your current section.",
  },
  IGNITION: {
    title: "IGNITION",
    summary:
      "Prepare a starting brief for campaigns, captions, scripts, weekly production plans, or repurposing approved content.",
    action:
      "Choose a brief, copy it, and paste it into ChatGPT to develop the draft.",
  },
  Reports: {
    title: "Reports",
    summary:
      "Review task totals, the campaign and production pipeline, recent activity, and content by dealership.",
    action:
      "Use these workspace counts to spot outstanding work. They include sample or unverified records and are not connected social analytics.",
  },
  "Page Editor": {
    title: "Page Editor",
    summary:
      "Customize the workspace's appearance, including colors, buttons, and personal hero photos.",
    action:
      "Preview your changes and use the page's save controls when you want to keep them.",
  },
  "Team & Settings": {
    title: "Team & Settings",
    summary:
      "Manage your profile and preferences. Account and team administration controls depend on your access level.",
    action:
      "Check your profile and notification preferences here; authorized administrators can manage team access.",
  },
  Archive: {
    title: "Archive",
    summary: "Find archived work and recover items you need again.",
    action:
      "Search the archive, inspect an item, and use Restore to bring it back.",
  },
};

export const toolbarGuide = {
  navigation:
    "Show or hide the navigation. On a phone, this opens the menu of workspace sections.",
  idea: "Capture a quick idea without leaving the page you are working on.",
  refresh: "Reload the workspace's current data to check for updates.",
  messenger:
    "Open team chat alongside your work. The number is your unread message count.",
  light: "Switch your workspace to light mode.",
  dark: "Switch your workspace to dark mode.",
};

export const guideSteps = [
  {
    title: "Welcome to WAM",
    summary:
      "McKenzie, this is Walker's shared marketing workspace. This tour shows where work is planned, created, reviewed, and organized.",
    action:
      "Choose Next to look around, or use Jump to a section. You can close and restart the tour anytime.",
    target: "page",
    page: "Overview",
  },
  {
    title: "Find your way around",
    summary:
      "The sidebar opens each workspace section. Expand Create, Organization, and Customize for more tools. Hover over a menu item or focus it with the keyboard for a quick explanation.",
    action: "On mobile, tap the menu icon to see the navigation.",
    target: "navigation",
  },
  {
    title: "Your everyday shortcuts",
    summary:
      "The top bar has quick idea capture, refresh, team chat with an unread count, and light/dark appearance controls.",
    action:
      "Hover over each control for help. Site tour is always available here when you want another walkthrough.",
    target: "shortcuts",
  },
  ...Object.entries(sectionGuide).map(([page, copy]) => ({
    ...copy,
    page,
    target: "page",
  })),
  {
    title: "Select, organize, and keep moving",
    summary:
      "On supported cards and assets, hover to reveal a selection circle, or long-press on a phone. The selection toolbar offers the actions available for those items.",
    action:
      "A typical workflow: capture an idea → plan a campaign and tasks → organize assets → review the video → track the social plan. Close the tour to try it, and restart it anytime from Site tour.",
    target: "page",
    page: "Overview",
  },
];
