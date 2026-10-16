// app/quick-ideas.tsx
import { useEffect as useEffect2, useState as useState3, useRef as useRef2 } from "react";
import { Plus, X, Paperclip, ThumbsUp, ThumbsDown, Lightbulb, ArrowRight } from "lucide-react";

// lib/location-branding.ts
var locationBrands = [
  { match: /toyota/i, file: "toyota", accent: "#ec1832", secondary: "#f5f5f5" },
  { match: /gmc/i, file: "gmc", accent: "#d71d34", secondary: "#bfc5cc" },
  { match: /mazda/i, file: "mazda", accent: "#929eac", secondary: "#e5e9ef" },
  { match: /honda/i, file: "honda", accent: "#087eee", secondary: "#dcecff" },
  { match: /kia/i, file: "kia", accent: "#89939f", secondary: "#ffffff" },
  { match: /bmw|mercedes/i, file: "bmw-merc", accent: "#078ee9", secondary: "#bfc6d0" },
  { match: /cdjr|chrysler|dodge|jeep|ram/i, file: "cdjr", accent: "#e3212e", secondary: "#d9dfe5" },
  { match: /big.?lot/i, file: "big_lot", accent: "#df2333", secondary: "#1279e8" },
  { match: /used.?cars|pineville/i, file: "used_cars", accent: "#e42632", secondary: "#d8dce2" }
];
function folderBrand(record, records = []) {
  let r = record;
  const seen2 = /* @__PURE__ */ new Set();
  while (r && !seen2.has(r.id)) {
    seen2.add(r.id);
    const name = r.dealership || r.locationName || (r.kind === "dealership" || r.locationRoot ? r.title : "");
    const brand = locationBrands.find((b) => b.match.test(name || ""));
    if (brand) return brand;
    r = records.find((x) => x.id === r.folder);
  }
  return void 0;
}
function brandStyle(brand) {
  return brand ? { "--folder-accent": brand.accent, "--folder-secondary": brand.secondary } : void 0;
}

// app/location-badge.tsx
import { jsx } from "react/jsx-runtime";
function LocationBadge({ record, records = [], className = "" }) {
  const brand = folderBrand(record, records);
  return brand ? /* @__PURE__ */ jsx("img", { className: "location-badge " + className, src: "/location-badges/" + brand.file + ".png", alt: "", loading: "lazy", decoding: "async" }) : /* @__PURE__ */ jsx("span", { className: "shared-folder-icon", "aria-hidden": "true", children: "\u25B1" });
}

// app/operations.tsx
import { useState, useEffect } from "react";

// app/seed.json
var seed_default = [
  {
    id: "history-1",
    kind: "event",
    title: "Walker Kia Grand Opening \u2014 VIP Reception",
    dateText: "March 12, 2026 (planned date; verify completion)",
    year: 2026,
    category: "Grand Opening",
    dealership: "Walker Kia",
    status: "Needs Verification",
    notes: "**Date:** March 12, 2026 (planned date; verify completion)  \n**Category:** Grand Opening  \n**Location:** Walker Kia\n\n**Description:** Grand opening VIP reception involving community leaders, dealership leadership, local representatives, and special guests.\n\n**Reusable To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm event date, time, location, and budget.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate the VIP guest list with leadership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create and distribute invitations.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate Chamber of Commerce and community representatives.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm refreshments and hospitality.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare dealership signage and grand opening branding.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Organize dealership tours and presentation schedule.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare management talking points.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Assign photography and video coverage.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare social media announcements.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture event highlights.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish the post-event recap and thank-you content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Upload photography and event results to the archive.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-03-12",
    endDate: "",
    channels: [],
    description: "Grand opening VIP reception involving community leaders, dealership leadership, local representatives, and special guests."
  },
  {
    id: "history-2",
    kind: "event",
    title: "Walker Kia Grand Opening \u2014 Public Celebration",
    dateText: "March 14, 2026 (planned date; verify completion)",
    year: 2026,
    category: "Grand Opening",
    dealership: "Walker Kia",
    status: "Needs Verification",
    notes: "**Date:** March 14, 2026 (planned date; verify completion)  \n**Category:** Grand Opening\n\n**Reusable To-Do Checklist:**",
    tasks: [
      {
        title: "Finalize public celebration schedule.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm food trucks and vendors.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate approximately 150 promotional swag bags.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Organize giveaways and prize details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare grand opening Facebook graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create promotional email announcements.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Update the dealership website.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm advertising and media placements.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate parking, traffic, and customer flow.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare dealership specials and disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture photos, videos, and customer engagement.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish the event recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Record attendance and marketing results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-03-14",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-3",
    kind: "event",
    title: "LSUA Job Shadow Day",
    dateText: "February 25, 2026",
    year: 2026,
    category: "Education / Community Engagement",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** February 25, 2026  \n**Category:** Education / Community Engagement\n\n**Description:** Walker Automotive hosted LSUA students for career exposure involving Accounting, Human Resources, Marketing, and executive leadership.\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Coordinate with LSUA representatives.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm student attendance.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Assign departments and mentors.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create the daily itinerary.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate executive introductions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare visitor information and welcome materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Arrange photography and any required photo permissions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create a social media recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Thank participating staff and LSUA representatives.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive photos and program information.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-02-25",
    endDate: "",
    channels: [],
    description: "Walker Automotive hosted LSUA students for career exposure involving Accounting, Human Resources, Marketing, and executive leadership."
  },
  {
    id: "history-4",
    kind: "event",
    title: "LSUA AI Summit",
    dateText: "March 20, 2026",
    year: 2026,
    category: "Professional Development",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** March 20, 2026  \n**Category:** Professional Development  \n**Status:** Attendance to be verified\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm attendees and registration.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Review speakers and educational sessions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Identify relevant automotive marketing AI applications.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Document key insights and takeaways.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Share learning with dealership leadership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create an actionable AI improvement list.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Assign follow-up AI projects.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive relevant training materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-03-20",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-5",
    kind: "event",
    title: "Women in Automotive Recognition",
    dateText: "March 2026",
    year: 2026,
    category: "Employee Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** March 2026  \n**Category:** Employee Recognition\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Identify employees and departments to recognize.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect names and photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare employee spotlight graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Draft recognition captions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule social media content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm employee details before publishing.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Save graphics and photography for future campaigns.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-6",
    kind: "event",
    title: "Walker Automotive Easter Weekend Promotion",
    dateText: "April 3\u20134, 2026",
    year: 2026,
    category: "Holiday Marketing",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** April 3\u20134, 2026  \n**Category:** Holiday Marketing\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm dealership holiday hours.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create Easter-themed promotional graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify vehicle offers and promotional disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Update website messaging.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule Facebook and Instagram content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare dealership-specific messages as needed.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Remove expired holiday messaging after the campaign.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive final artwork.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-04-03",
    endDate: "2026-04-04",
    channels: [],
    description: ""
  },
  {
    id: "history-7",
    kind: "event",
    title: "Dragon Boat Races",
    dateText: "Early May 2026",
    year: 2026,
    category: "Community Event",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** Early May 2026  \n**Category:** Community Event\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm event participation and sponsorship.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate the employee team.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm registration and participant details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate team shirts or promotional materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create pre-event social media content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Assign an event photographer.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture team photos and race footage.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish a team appreciation post.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive event media and outcomes.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-8",
    kind: "event",
    title: "Walker Automotive's 41st Total Sale",
    dateText: "May 20\u201330, 2026",
    year: 2026,
    category: "Major Sales Event",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** May 20\u201330, 2026  \n**Category:** Major Sales Event\n\n**Description:** Group-wide sales promotion involving nine locations, eleven brands, and more than 500 advertised vehicles.\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm sale dates and participating dealerships.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Obtain vehicle specials from dealership managers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify pricing, availability, and financing disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create a consistent group-wide sales identity.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create Facebook and Instagram graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Produce promotional videos and reels.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Develop radio and television scripts where applicable.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Update website banners and landing pages.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate email marketing.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare salesperson sharing materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule countdown and final-days promotions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: 'Launch a "2 Days Left" promotional push.',
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm active specials remain accurate.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Remove expired offers after the event.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Review lead generation and sales performance.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create a post-campaign performance recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-05-20",
    endDate: "2026-05-30",
    channels: [],
    description: "Group-wide sales promotion involving nine locations, eleven brands, and more than 500 advertised vehicles."
  },
  {
    id: "history-9",
    kind: "event",
    title: "Class of 2026 Graduate Recognition",
    dateText: "May 2026",
    year: 2026,
    category: "Employee / Family Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** May 2026  \n**Category:** Employee / Family Recognition\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Request graduation submissions from employees.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect graduate names and photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm spelling and school information.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Design congratulations graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule social media recognition.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive approved artwork and images.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-10",
    kind: "event",
    title: "BBB Torch Awards Finalist Recognition",
    dateText: "June 2026",
    year: 2026,
    category: "Company Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** June 2026  \n**Category:** Company Recognition\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm award and finalist details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify approved award branding.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create an announcement graphic.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Draft social media and internal recognition messaging.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate leadership comments if appropriate.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Save media coverage and supporting documents.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive the recognition.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-11",
    kind: "event",
    title: "Coach Bachman Leadership Visit",
    dateText: "September 2026",
    year: 2026,
    category: "Leadership / Employee Development",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** September 2026  \n**Category:** Leadership / Employee Development\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm speaker schedule and audience.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate event logistics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare speaker introduction.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Arrange photography.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture approved leadership takeaways.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Write social media recognition post.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Thank the guest speaker.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Document relevant employee-development insights.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-12",
    kind: "event",
    title: "Pink Out Monday",
    dateText: "October 5, 2026",
    year: 2026,
    category: "Employee Engagement / Breast Cancer Awareness",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 5, 2026  \n**Category:** Employee Engagement / Breast Cancer Awareness\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Notify employees of pink-out participation.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Encourage participation across dealerships.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect dealership employee photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create branded pink-out graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare Facebook and Instagram captions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Tag participating dealerships where appropriate.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish employee recognition content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive photos by store.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-10-05",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-13",
    kind: "event",
    title: "Top Guns \u2014 Salesperson of the Month",
    dateText: "October 2026",
    year: 2026,
    category: "Employee Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2026  \n**Category:** Employee Recognition\n\n**Description:** Recognition campaign highlighting dealership salespeople of the month.\n\n**To-Do Checklist:**\n\nInclude historical winner details already discussed in ChatGPT where confirmed, including Toyota, Honda, Kia, CDJR, BMW, Big Lot, Pineville, and GMC/Mazda.\n\nWinners discussed: Toyota \u2014 Seth Jones; Honda \u2014 Lamuel Holmes and Luis Ramirez; Kia \u2014 Cheyanna Flanery; CDJR \u2014 Zane Malone; BMW \u2014 Austin Cooper (updated from Patrick Harrison); Big Lot \u2014 Larry Ficklin; Pineville \u2014 Dwayne Dupar; GMC/Mazda \u2014 Will Godfrey. Verify award period and approved photos before reusing.",
    tasks: [
      {
        title: "Request monthly winners from dealership management.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify winner names, store names, and titles.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect or verify employee photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create consistent Top Guns templates.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Produce individual dealership graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare group-wide recognition graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Send artwork for review.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish recognition posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive winners by month and dealership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: "Recognition campaign highlighting dealership salespeople of the month."
  },
  {
    id: "history-14",
    kind: "event",
    title: "Favorite Door Facebook Voting Contest",
    dateText: "October 2026",
    year: 2026,
    category: "Employee Engagement / Social Media Contest",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2026  \n**Category:** Employee Engagement / Social Media Contest\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Collect photos of all participating doors.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Label entries 1\u20136.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish contest rules.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Specify one vote per person.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish voting post.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect Facebook comments.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Count unique eligible voters.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify final vote totals.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Announce the winning entry.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive contest photos, vote totals, and results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-15",
    kind: "event",
    title: "Walker Service Team AED Training",
    dateText: "October 2026",
    year: 2026,
    category: "Safety / Employee Training",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2026  \n**Category:** Safety / Employee Training\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Coordinate with Cabrini training personnel.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm participating service employees.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule training time and location.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare training materials and equipment.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture approved training photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Draft employee safety recognition caption.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Thank Cabrini staff.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive any attendance or training records in the appropriate internal location.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-16",
    kind: "event",
    title: "Gleaux for the Girls \u2014 2026",
    dateText: "October 10, 2026",
    year: 2026,
    category: "Community Fundraiser / Breast Cancer Awareness",
    dealership: "Walker Toyota",
    status: "Completed",
    notes: "**Date:** October 10, 2026  \n**Location:** Walker Toyota  \n**Category:** Community Fundraiser / Breast Cancer Awareness  \n**Status:** Completed\n\n**Historical Results:**\n- More than 2,000 attendees.\n- More than 130 local breast cancer fighters and survivors.\n- Record-setting $124,000 raised.\n- Beneficiaries: local breast cancer patients at Cabrini Cancer Center and Breast Health Center.\n- Pink Toyota Tacoma raffle winner: Kelley Pears.\n- Pink golf cart winner: Ewell Gaspard.\n\n**To-Do Checklist:**\n\nPlanning and Coordination:\n\nMarketing and Promotion:\n\nPost-Event:\n\n---\n\n# 2026 CAMPAIGNS THAT ARE NOT YET COMPLETED\n\nStore these in the same management system, but do not label them completed past events until their end dates have passed and their results have been confirmed.",
    tasks: [
      {
        title: "Confirm event date and schedule.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate with organizers and Cabrini representatives.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm participating sponsors.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate vehicle raffle details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate golf cart raffle details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm event signage and locations.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare packet-pickup communications.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate volunteer assignments.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm photography and videography coverage.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create event announcement graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Develop countdown posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Produce event hype videos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish packet-pickup schedules.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create event-week Facebook content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare sponsor recognition posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate messaging across Walker pages.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare event-night social media content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect event photographs and video.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify attendance numbers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify total funds raised.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm raffle winners.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Recognize sponsors and volunteers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish a full event recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Share results with dealership leadership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Save historical results and creative assets.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create a duplicate planning template for next year's event.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-10-10",
    endDate: "",
    channels: [],
    results: "2,000+ attendees; 130+ breast cancer fighters and survivors; 24,000 raised for Cabrini Cancer Center and Breast Health Center. Pink Tacoma: Kelley Pears. Pink golf cart: Ewell Gaspard.",
    description: ""
  },
  {
    id: "history-17",
    kind: "event",
    title: "Pink Out the Lot \u2014 October Sales Campaign",
    dateText: "October 5\u201331, 2026",
    year: 2026,
    category: "Group-Wide Sales Campaign",
    dealership: "Walker Automotive Group",
    status: "In Progress",
    notes: "**Date:** October 5\u201331, 2026  \n**Category:** Group-Wide Sales Campaign  \n**Status:** In Progress as of October 12, 2026\n\n**Historical Planning Details:** Hot-pink sale tags, promotional graphics, email blasts, group-wide advertising, radio and television scripts, billboards, and website banners. The television planning budget discussed was $8,000.\n\n**To-Do Checklist:**\n\n**Important:** Keep this sales promotion separate from Gleaux for the Girls charitable fundraising. Do not imply that vehicle purchases generate charitable donations unless a specific approved offer states that.",
    tasks: [
      {
        title: "Confirm campaign goals, dates, and budget.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect participating dealership specials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify pricing, rebates, and OEM disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Finalize Pink Out branding and color scheme.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create pink sale tags for vehicle inventory.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create website banners for participating stores.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Produce Facebook launch graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create evergreen promotional graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare promotional email campaign.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Finalize 30-second television script.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Finalize radio script.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate television advertising schedule.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate billboard creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Send instructions and assets to dealership managers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule ongoing social media content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Promote remaining days of the campaign.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Track engagement, leads, and available campaign results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Remove expired promotional assets.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create a final marketing recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive the campaign after October 31.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2026-10-05",
    endDate: "2026-10-31",
    channels: [],
    description: "",
    tvPlanningBudget: 8e3
  },
  {
    id: "history-18",
    kind: "event",
    title: "October Dealership Monthly Specials",
    dateText: "October 2026",
    year: 2026,
    category: "Monthly Sales Promotions",
    dealership: "Walker Automotive Group",
    status: "In Progress",
    notes: "**Date:** October 2026  \n**Category:** Monthly Sales Promotions  \n**Status:** In Progress\n\n**Participating Stores Discussed:** GMC, Toyota, CDJR, Mazda, and additional dealerships as appropriate.\n\n**To-Do Checklist:**\n\n---\n\n# 2025 HISTORICAL EVENTS AND CAMPAIGNS",
    tasks: [
      {
        title: "Request monthly specials from every dealership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm vehicle model, year, stock number, and availability.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify MSRP, discounts, rates, terms, and disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Organize offers by dealership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Send approved specials to the marketing partner.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create monthly website banners.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create matching Facebook graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate email promotional campaigns.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify consistency across every advertising channel.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Track campaign performance.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Update or remove expired offers at month-end.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive final specials and materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-19",
    kind: "event",
    title: "Back-to-School \u2014 Mini Dealership Crew",
    dateText: "August 2025",
    year: 2025,
    category: "Employee / Family Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** August 2025  \n**Category:** Employee / Family Recognition\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Invite employee family submissions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect approved children's back-to-school photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify names and photo permissions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create branded graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish social media recognition.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive artwork and participation records.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-20",
    kind: "event",
    title: "Walker GMC September Sales Promotion",
    dateText: "September 2025",
    year: 2025,
    category: "Dealership Sales Promotion",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** September 2025  \n**Category:** Dealership Sales Promotion\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Collect approved GMC vehicle offers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify pricing and advertising disclosures.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm advertising budget.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare television commercial creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate television placement with the agency.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm campaign flight dates.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare supporting digital content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Review campaign results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive scripts, invoices, and approved creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-21",
    kind: "event",
    title: "Gleaux Week / Pink-Out Spirit Week",
    dateText: "October 2025",
    year: 2025,
    category: "Employee Engagement / Community Support",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2025  \n**Category:** Employee Engagement / Community Support\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Announce employee spirit-week activities.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Communicate participation details to stores.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate pink-themed outfits or activities.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect employee group photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create branded social media graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish dealership participation posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive photos by location.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-22",
    kind: "event",
    title: "Gleaux for the Girls \u2014 2025",
    dateText: "October 11, 2025",
    year: 2025,
    category: "Community Fundraising",
    dealership: "Walker Toyota",
    status: "Needs Verification",
    notes: "**Date:** October 11, 2025  \n**Location:** Walker Toyota  \n**Category:** Community Fundraising\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Coordinate event date and host location.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm sponsor and beneficiary details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate pink vehicle raffle promotion.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare event promotional materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish race-week reminders.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate staff involvement.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture event photography.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish recap and thank-you posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Record verified event results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive promotional materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "2025-10-11",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-23",
    kind: "event",
    title: "Pink-Out-A-Car Contest",
    dateText: "October 2025",
    year: 2025,
    category: "Employee / Community Contest",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2025  \n**Category:** Employee / Community Contest\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Define participation and judging rules.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Announce contest.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate participating teams or vehicles.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Document entries with photographs.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify winners.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Design winner announcement graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive contest images and outcome.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-24",
    kind: "event",
    title: "Walker Service Training Day",
    dateText: "October 2025",
    year: 2025,
    category: "Employee Training",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2025  \n**Category:** Employee Training\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm instructor and training agenda.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate employee attendance.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Arrange training space and materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture approved photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Draft training recognition post.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Thank training personnel.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive training recap.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-25",
    kind: "event",
    title: "We Buy Cars at Walker Automotive Campaign",
    dateText: "November 2025",
    year: 2025,
    category: "Advertising Campaign",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** November 2025  \n**Category:** Advertising Campaign\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Finalize vehicle acquisition messaging.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Define customer call to action.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Write television commercial script.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate creative production.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm media placement.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Develop supporting digital graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Review inquiries and campaign results.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive campaign materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-26",
    kind: "event",
    title: "Homeless Coalition Christmas Tree Decorating Contest",
    dateText: "November 2025",
    year: 2025,
    category: "Community Involvement / Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** November 2025  \n**Category:** Community Involvement / Recognition\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm event and organizer details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate participation or recognition.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Collect photographs.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify contest outcome.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare congratulations graphic.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Recognize Bri-Ann Carter's second consecutive win.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish social media post.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive recognition.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-27",
    kind: "event",
    title: "Walker CDJR Black Friday Sales Event",
    dateText: "November 2025",
    year: 2025,
    category: "Holiday Sales Event",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** November 2025  \n**Category:** Holiday Sales Event\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Confirm participating inventory and specials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify pricing and promotional disclaimers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create Black Friday graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare Facebook advertising content.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate email promotions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Update website banners.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm holiday operating hours.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule countdown posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Remove expired offers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Review event performance.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive campaign assets.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-28",
    kind: "event",
    title: "Walker Mazda Christmas Promotion",
    dateText: "December 2025",
    year: 2025,
    category: "Holiday Marketing",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** December 2025  \n**Category:** Holiday Marketing\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Plan dealership holiday creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate showroom and vehicle photography.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create Christmas promotional graphics.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare holiday captions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule social media posts.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Save campaign photography and creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-29",
    kind: "event",
    title: "Walker Automotive Group Christmas Campaign",
    dateText: "December 2025",
    year: 2025,
    category: "Group-Wide Holiday Marketing",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** December 2025  \n**Category:** Group-Wide Holiday Marketing\n\n**To-Do Checklist:**\n\n---\n\n# RECURRING ACTIVITIES AND INTERNAL INITIATIVES\n\nInclude the following in a related historical initiatives area, but do not represent them as individual one-day events unless a specific date is verified.",
    tasks: [
      {
        title: "Establish group-wide holiday messaging.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create holiday graphics using Walker branding.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare multiple-brand vehicle creative.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm holiday hours.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare Facebook and Instagram captions.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Schedule Christmas greetings.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Share assets with participating dealerships.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Archive final artwork.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-30",
    kind: "event",
    title: "Employee Spotlight Program",
    dateText: "",
    year: 2026,
    category: "Recognition",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Reusable To-Do Checklist:**",
    tasks: [
      {
        title: "Select employee or department.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Verify name, title, and dealership.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Obtain approved photos.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Gather recognition details.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare branded graphic.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Draft caption.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Confirm approval.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Publish and archive.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-31",
    kind: "event",
    title: "Marketing Content Coordinator Role Rollout",
    dateText: "October 2026",
    year: 2026,
    category: "Internal Marketing Initiative",
    dealership: "Walker Automotive Group",
    status: "Needs Verification",
    notes: "**Date:** October 2026  \n**Category:** Internal Marketing Initiative\n\n**To-Do Checklist:**",
    tasks: [
      {
        title: "Finalize role description.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Identify responsibilities and deliverables.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Introduce role to dealership managers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Explain benefits to all Walker locations.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Establish content request process.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create project tracker.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Define strict deadlines and approval requirements.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Establish regular project reviews.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Document future department priorities.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  },
  {
    id: "history-32",
    kind: "event",
    title: "Quarterly Leadership Training Program",
    dateText: "August 2026",
    year: 2026,
    category: "Proposed Internal Training Program",
    dealership: "Walker Automotive Group",
    status: "Proposed",
    notes: '**Discussed:** August 2026  \n**Category:** Proposed Internal Training Program  \n**Status:** Proposed / Completion Unverified\n\n**Planning Concept:** "Preparing the Forecast for 2027."\n\n**To-Do Checklist:**\n\nDo not publish this as a completed historical event until it is verified.\n\n---',
    tasks: [
      {
        title: "Confirm leadership approval.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Set training dates and frequency.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Establish budget.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Identify speakers.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Coordinate presentations and agenda.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Invite management participants.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Prepare event materials.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Capture training takeaways.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Gather feedback.",
        status: "Not Verified",
        assignee: "",
        due: ""
      },
      {
        title: "Create follow-up action items.",
        status: "Not Verified",
        assignee: "",
        due: ""
      }
    ],
    source: "Uploaded Section 24; partial historical collection",
    owner: "",
    budget: "",
    date: "",
    endDate: "",
    channels: [],
    description: ""
  }
];

// lib/theme-presets.ts
var themePresets = {
  "Walker Default": { theme: "light", accent: "#c81927", appearance: { pageBg: "#f1f2f3", cardBg: "#ffffff", sidebarBg: "#121212", sidebarText: "#ffffff", headerBg: "#ffffff", primaryBg: "#c81927", primaryText: "#ffffff", highlight: "#c81927", linkText: "#ac1220" } },
  "McKenzie Default": { theme: "light", accent: "#cd315e", appearance: { primaryBg: "#cd315e", primaryText: "#ffffff", highlight: "#cd315e", linkText: "#a7234a" } },
  "Travis Default": { theme: "light", accent: "#a74400", appearance: { pageBg: "#eef0f2", cardBg: "#ffffff", sidebarBg: "#e3e6e9", sidebarText: "#20262b", headerBg: "#ffffff", primaryBg: "#a74400", primaryText: "#ffffff", highlight: "#a74400", linkText: "#923b00" } },
  "Walker After Hours": { theme: "dark", accent: "#e53945", appearance: { pageBg: "#0e1013", cardBg: "#191d22", sidebarBg: "#090b0e", headerBg: "#13171c", primaryBg: "#e53945", primaryText: "#111111", linkText: "#ff929a", highlight: "#ff929a" } },
  "Travis After Hours": { theme: "dark", accent: "#b94c08", appearance: { pageBg: "#111519", cardBg: "#20262d", sidebarBg: "#171c22", headerBg: "#171c22", primaryBg: "#b94c08", primaryText: "#ffffff", linkText: "#ffb66b", highlight: "#ffb66b" } },
  "Graphite": { theme: "light", accent: "#37424d", appearance: { pageBg: "#eceff1", cardBg: "#ffffff", sidebarBg: "#29313a", sidebarText: "#f2f5f8", primaryBg: "#37424d", highlight: "#37424d", linkText: "#37424d" } },
  "Midnight Navy": { theme: "dark", accent: "#7cb4ee", appearance: { pageBg: "#0e1725", cardBg: "#1a293d", sidebarBg: "#101d30", headerBg: "#152237", primaryBg: "#7cb4ee", primaryText: "#0a1829", highlight: "#91c7ff", linkText: "#91c7ff" } },
  "Neutral Stone": { theme: "light", accent: "#555b52", appearance: { pageBg: "#f1f0eb", cardBg: "#ffffff", sidebarBg: "#e4e4dc", sidebarText: "#242b23", primaryBg: "#555b52", highlight: "#555b52", linkText: "#45503f" } },
  "Carbon": { theme: "dark", accent: "#bdc6cf", appearance: { pageBg: "#111315", cardBg: "#22262a", sidebarBg: "#181b1e", headerBg: "#1b1e22", primaryBg: "#bdc6cf", primaryText: "#15191d", highlight: "#d4dde6", linkText: "#d4dde6" } }
};
function defaultTheme(id) {
  return { ...themePresets[id === "travis" ? "Travis Default" : id === "mckenzie" ? "McKenzie Default" : "Walker Default"], font: "Arial, Helvetica, sans-serif", radius: 9 };
}

// lib/preview-store.ts
var people = [{ id: "mckenzie", name: "McKenzie", role: "owner", email: "mckenzie@preview.invalid" }, { id: "travis", name: "Travis", role: "coordinator", email: "travis@preview.invalid" }, { id: "lawrence", name: "Lawrence", role: "executive", email: "lawrence@preview.invalid" }];
if (typeof localStorage !== "undefined") {
  try {
    for (const p of JSON.parse(localStorage.getItem("wam-user-directory") || "[]")) {
      if (p.name === "Lawrence Searcy") p.name = "Lawrence";
      const i = people.findIndex((x) => x.id === p.id);
      if (i >= 0) people[i] = p;
      else people.push(p);
    }
  } catch {
  }
}
var locations = [["Walker Mazda", "1616A MacArthur Dr, Alexandria, LA 71301"], ["Walker Toyota", "5735 Coliseum Blvd, Alexandria, LA 71303"], ["Walker Mercedes-Benz", "6655 Coliseum Blvd, Alexandria, LA 71303"], ["Walker Kia", "6699 Coliseum Blvd, Alexandria, LA 71303"], ["Walker Honda", "6677 Coliseum Blvd, Alexandria, LA 71303"], ["Walker CDJR", "5757 Coliseum Blvd, Alexandria, LA 71303"], ["Walker BMW", "6655 Coliseum Blvd, Alexandria, LA 71303"], ["Walker GMC", "1616 MacArthur Dr, Alexandria, LA 71301"], ["Walker Automotive Used Cars \u2013 Pineville", "2250 Hwy 28 East, Pineville, LA 71360"], ["Walker Big Lot", "1616 MacArthur Dr, Alexandria, LA 71301"]];
var workflow = ["Idea", "Planned", "In Production", "Editing", "Review", "Approved", "Scheduled", "Published"];
var key = "wam-source-preview-v2";
var base = () => ({ records: [...seed_default.map((r) => ({ ...r, source: "Uploaded history \xB7 unverified" })), ...locations.flatMap(([title, address], i) => [{ id: "location-" + i, kind: "dealership", title, address, status: "Active", source: "https://www.walkerautomotive.com/dealers/" }, { id: "locfolder-" + i, kind: "folder", title, dealership: title, locationRoot: true, status: "Active" }]), { id: "history-imported", kind: "system", title: "Imported locally" }, { id: "pink-demo", kind: "project", title: "PINK OUT THE LOT!", notes: "Pink Tags. Big Deals.\nDemo October campaign \u2014 offers and dates require confirmation.", dealership: "Walker Automotive Group", dealerships: ["Walker CDJR", "Walker Toyota"], owner: "McKenzie", status: "In Production", date: "2026-10-19", endDate: "2026-10-31", tasks: [{ title: "Capture inventory B-roll", assignee: "Trav", status: "To Do", due: "2026-10-20", urgency: "High" }], comments: [], history: [], demo: true }, { id: "demo-video", kind: "video", title: "PINK OUT THE LOT! \u2014 CTV cut", project: "pink-demo", dealership: "Walker CDJR", status: "Editing", owner: "Travis", date: "2026-10-20", notes: "Pink Tags. Big Deals.", script: "Open on pink tags. Cut to inventory and team. End with approved offer and disclosures.", shots: [], versions: [], demo: true }, { id: "idea-demo", kind: "idea", title: "One question, one expert", notes: "Hook: What should I check before a road trip?\nScript: One service expert gives three useful checks.\nAssets: Service bay footage.\nNext: Confirm presenter and film a 25-second tip.", status: "Idea", demo: true }], preferences: {}, messages: [], conversations: [{ id: "team", title: "COLLAB chat", members: ["mckenzie", "travis", "lawrence"], type: "Group" }, { id: "private-mt", title: "McKenzie + Travis", members: ["mckenzie", "travis"], type: "Direct" }], personal: {}, read: {}, quotes: [], settings: { categories: ["Seasonal", "Service", "Community", "CTV"], assetTypes: ["Video", "Photo", "Logo", "Graphic", "Document"], statuses: workflow, notifications: true }, activity: [], annotations: [] });
function getState() {
  const raw = localStorage.getItem(key);
  if (raw) {
    const s2 = JSON.parse(raw, (k, v) => ["name", "sender_name", "owner", "assignee", "assigned", "author", "by", "createdBy", "updatedBy"].includes(k) && v === "Lawrence Searcy" ? "Lawrence" : v);
    if (!s2.themeDefaultsVersion) {
      s2.themePresets ||= {};
      for (const id of ["travis", "mckenzie", "lawrence"]) {
        const old = s2.preferences[id];
        if (old) s2.themePresets["Previous appearance \u2014 " + id] = old;
        const base2 = old?.theme === "dark" ? themePresets[id === "travis" ? "Travis After Hours" : "Walker After Hours"] : defaultTheme(id);
        s2.preferences[id] = { ...old, ...base2, logo: old?.logo || "", heroImages: old?.heroImages || [], avatar: old?.avatar || "", presetName: id === "travis" ? "Travis Default" : id === "mckenzie" ? "McKenzie Default" : "Walker Default" };
      }
      s2.themeDefaultsVersion = 1;
      localStorage.setItem(key, JSON.stringify(s2));
    }
    if (!s2.travisOrangeRevision) {
      const p = s2.preferences.travis;
      if (p && (!p.presetName || p.presetName.startsWith("Travis"))) {
        p.accent = p.theme === "dark" ? "#b94c08" : "#a74400";
        p.appearance = { ...p.appearance, primaryBg: p.accent, primaryText: "#ffffff", highlight: p.theme === "dark" ? "#f5ab68" : p.accent, linkText: p.theme === "dark" ? "#f5ab68" : "#923b00" };
      }
      s2.travisOrangeRevision = 1;
      localStorage.setItem(key, JSON.stringify(s2));
    }
    return s2;
  }
  const s = base();
  localStorage.setItem(key, JSON.stringify(s));
  return s;
}
function user() {
  if (!sessionStorage.getItem("wam-travis-default-v1")) {
    sessionStorage.setItem("wam-person", "travis");
    sessionStorage.setItem("wam-travis-default-v1", "applied");
  }
  return people.find((p) => p.id === sessionStorage.getItem("wam-person")) || people[1];
}
function setUser(id) {
  if (!people.some((p) => p.id === id)) throw Error("Unknown preview identity");
  sessionStorage.setItem("wam-travis-default-v1", "applied");
  sessionStorage.setItem("wam-person", id);
  window.dispatchEvent(new Event("wam-change"));
}
function mutate(fn, action = "") {
  const s = getState();
  fn(s);
  if (action) s.activity.unshift({ id: crypto.randomUUID(), at: (/* @__PURE__ */ new Date()).toISOString(), by: user().name, text: action });
  try {
    localStorage.setItem(key, JSON.stringify(s));
  } catch {
    throw Error("Browser storage is full. Export a backup before continuing.");
  }
  window.dispatchEvent(new Event("wam-change"));
  return s;
}
function member() {
  const s = getState(), id = user().id;
  return { ...user(), preferences: JSON.stringify(s.preferences[id] || defaultTheme(id)) };
}
function saveRecord(record) {
  if (user().role === "viewer") throw Error("Viewer accounts are read-only");
  if (!record?.title?.trim()) throw Error("Enter a title");
  if (record.endDate && record.date && record.endDate < record.date) throw Error("End date must follow start date");
  const id = record.id || crypto.randomUUID();
  mutate((s) => {
    const old = s.records.find((r2) => r2.id === id);
    if ((record.status === "Approved" || record.approval === "Approved") && user().role === "coordinator" && old?.status !== "Approved") throw Error("McKenzie or Lawrence must approve");
    const r = { ...record, id, updated: (/* @__PURE__ */ new Date()).toISOString(), history: [...old?.history || [], { at: (/* @__PURE__ */ new Date()).toISOString(), by: user().name, action: old ? "Updated" : "Created", status: record.status }] };
    s.records = old ? s.records.map((x) => x.id === id ? r : x) : [...s.records, r];
  }, "Saved " + record.title);
  return id;
}
function conversation(id, s = getState()) {
  const c = s.conversations.find((c2) => c2.id === id);
  if (!c || !c.members.includes(user().id)) throw Error("This conversation is private");
  return c;
}
var dbPromise;
function db() {
  return dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open("wam-local-files", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function putFile(id, file) {
  const d = await db();
  await new Promise((resolve, reject) => {
    const tx = d.transaction("files", "readwrite");
    tx.objectStore("files").put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function readFile(id) {
  const record = getState().records.find((r) => r.id === id);
  if (record?.privateConversation && ![record.privateConversation, ...record.sharedConversations || []].some((id2) => getState().conversations.some((c) => c.id === id2 && c.members.includes(user().id)))) throw Error("This file is private");
  const d = await db();
  return new Promise((resolve, reject) => {
    const r = d.transaction("files").objectStore("files").get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
var urls = /* @__PURE__ */ new Map();
async function fileURL(id) {
  if (!id) return "";
  const record = getState().records.find((r) => r.id === id);
  if (record?.privateConversation && ![record.privateConversation, ...record.sharedConversations || []].some((id2) => getState().conversations.some((c) => c.id === id2 && c.members.includes(user().id)))) throw Error("This file is private");
  const cacheKey = user().id + ":" + id;
  if (urls.has(cacheKey)) return urls.get(cacheKey);
  let b = await readFile(id);
  if (!b && sessionStorage.getItem("wam-local-auth") && getState().records.some((r) => r.kind === "quickidea" && r.attachments?.some((a) => a.id === id))) {
    const response = await fetch("/__local/quick-ideas/media?id=" + encodeURIComponent(id));
    if (response.ok) b = await response.blob();
    else throw Error("Quick Idea media is unavailable");
  }
  if (!b) return "";
  const u = URL.createObjectURL(b);
  urls.set(cacheKey, u);
  return u;
}
async function addAsset(file, meta = {}) {
  if (file.size > 500 * 1024 * 1024) throw Error("Preview limit: 500 MB per file");
  const id = crypto.randomUUID();
  await putFile(id, file);
  saveRecord({ id, kind: "asset", title: file.name, originalName: file.name, type: file.type || "application/octet-stream", size: file.size, status: "Draft", project: "", dealership: "", folder: "", tags: [], ...meta });
  return id;
}
function exportJSON(data, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}

// lib/daily-quotes.ts
var quotes = [
  "Bring the grit. Make the move. Let the work speak.",
  "You don\u2019t need permission to make today extraordinary.",
  "Big ideas mean nothing until you give them a deadline.",
  "Show up bold. Finish strong. Do it again tomorrow.",
  "Outwork your doubt. Your next breakthrough is waiting.",
  "Be the badass who turns \u201Csomeday\u201D into \u201Cdone.\u201D",
  "Your ambition deserves action. Give it some today.",
  "Create something today that yesterday\u2019s you would be proud of.",
  "No perfect timing. Just a clear plan and a hell of a lot of heart.",
  "You can be kind, creative, and an absolute force.",
  "Don\u2019t shrink the vision. Raise the standard.",
  "Progress has a sound: one more thing getting done.",
  "The boldest idea in the room still needs someone to build it.",
  "Let your discipline be louder than your excuses.",
  "You\u2019ve handled hard things. Today gets your best, too.",
  "Own the next move. Momentum follows action.",
  "Build the thing. Send the draft. Take the shot.",
  "You are allowed to be a masterpiece and a work in progress.",
  "Make it matter. Make it yours. Make it happen.",
  "Pressure is real. So is your ability to rise.",
  "Keep the fire. Find the focus. Finish the work.",
  "Small wins stack into a badass story.",
  "Today is a fresh chance to back yourself.",
  "Confidence grows every time you keep a promise to yourself.",
  "Great work starts when you stop negotiating with your potential.",
  "Your energy is valuable. Spend it on the work that matters.",
  "Bring your ideas. Bring your courage. Leave a mark.",
  "Don\u2019t wait to feel unstoppable. Start, and build the proof.",
  "When the plan gets messy, keep the purpose clear.",
  "Lead with heart. Execute with backbone.",
  "Your next chapter is built by the choices you make today.",
  "Turn the volume down on doubt and up on action."
];
function quoteForDay(date) {
  const n = Math.floor(Date.parse(date + "T12:00:00Z") / 864e5);
  return quotes[(n % quotes.length + quotes.length) % quotes.length];
}
function chicagoDate(now = /* @__PURE__ */ new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

// app/operations.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function useWorkspace() {
  const [s, set] = useState(getState);
  useEffect(() => {
    const update = () => set(getState());
    window.addEventListener("wam-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("wam-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return s;
}
function FilePreview({ id, type, controls = true }) {
  const [url, set] = useState("");
  useEffect(() => {
    let alive = true;
    fileURL(id).then((u) => {
      if (alive) set(u);
    });
    return () => {
      alive = false;
    };
  }, [id]);
  return !url ? /* @__PURE__ */ jsxs("div", { className: "file-placeholder", children: [
    type?.startsWith("video/") ? "\u25B6" : "\u25A7",
    /* @__PURE__ */ jsx2("small", { children: "No local file attached" })
  ] }) : type?.startsWith("image/") ? /* @__PURE__ */ jsx2("img", { className: "ops-preview", src: url, alt: "Asset preview" }) : type?.startsWith("video/") ? /* @__PURE__ */ jsx2("video", { className: "ops-preview", src: url, controls, preload: "metadata" }) : type?.startsWith("audio/") ? /* @__PURE__ */ jsx2("audio", { src: url, controls: true }) : /* @__PURE__ */ jsx2("a", { href: url, target: "_blank", rel: "noreferrer", children: "Open / download file \u2197" });
}
function DailyQuote() {
  const s = useWorkspace(), day = chicagoDate(), scheduled = s.quotes.find((q) => q.date === day);
  return /* @__PURE__ */ jsxs("section", { className: "quote-top", children: [
    /* @__PURE__ */ jsxs("span", { className: "eyebrow", children: [
      "QUOTE OF THE DAY \xB7 ",
      day
    ] }),
    /* @__PURE__ */ jsxs("blockquote", { children: [
      "\u201C",
      scheduled?.text || quoteForDay(day),
      "\u201D"
    ] }),
    /* @__PURE__ */ jsx2("small", { children: scheduled?.author || "Walker Suite \xB7 original motivational copy" })
  ] });
}
function RecordEditor({ record, onClose }) {
  const [d, set] = useState({ ...record }), [error, E] = useState("");
  const state = useWorkspace();
  const field = (key2, label, type = "text") => /* @__PURE__ */ jsxs("label", { children: [
    label,
    type === "textarea" ? /* @__PURE__ */ jsx2("textarea", { value: d[key2] || "", onChange: (e) => set({ ...d, [key2]: e.target.value }) }) : /* @__PURE__ */ jsx2("input", { type, value: d[key2] || "", onChange: (e) => set({ ...d, [key2]: e.target.value }) })
  ] });
  return /* @__PURE__ */ jsx2("div", { className: "overlay", children: /* @__PURE__ */ jsxs("form", { className: "modal wide record-editor", role: "dialog", "aria-modal": "true", "aria-label": "Record editor", onSubmit: (e) => {
    e.preventDefault();
    try {
      saveRecord(d);
      onClose();
    } catch (e2) {
      E(e2.message);
    }
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "modalhead", children: [
      /* @__PURE__ */ jsxs("h2", { children: [
        d.id ? "Edit" : "Create",
        " ",
        d.kind
      ] }),
      /* @__PURE__ */ jsx2("button", { type: "button", "aria-label": "Close", onClick: onClose, children: "\xD7" })
    ] }),
    /* @__PURE__ */ jsxs("details", { className: "editor-section", open: true, children: [
      /* @__PURE__ */ jsx2("summary", { children: "Basics" }),
      /* @__PURE__ */ jsxs("div", { className: "formgrid", children: [
        /* @__PURE__ */ jsxs("label", { className: "full", children: [
          "Name",
          /* @__PURE__ */ jsx2("input", { required: true, maxLength: 300, value: d.title || "", onChange: (e) => set({ ...d, title: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          "Status",
          /* @__PURE__ */ jsx2("select", { value: d.status || "Planned", onChange: (e) => set({ ...d, status: e.target.value }), children: [...new Set([...state.settings.statuses || workflow, "Draft", "Revision", "Completed", d.status].filter(Boolean))].map((x) => /* @__PURE__ */ jsx2("option", { children: x }, x)) })
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          "Owner",
          /* @__PURE__ */ jsx2("select", { value: d.owner || "Travis", onChange: (e) => set({ ...d, owner: e.target.value }), children: people.map((p) => /* @__PURE__ */ jsx2("option", { children: p.name }, p.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("details", { className: "editor-section", children: [
      /* @__PURE__ */ jsx2("summary", { children: "Schedule" }),
      /* @__PURE__ */ jsxs("div", { className: "formgrid", children: [
        field("date", "Start / shoot / publication date", "date"),
        field("endDate", "End date", "date"),
        field("deadline", "Deadline", "date"),
        /* @__PURE__ */ jsxs("label", { children: [
          "Recurrence",
          /* @__PURE__ */ jsxs("select", { value: d.recurrence || "One-time", onChange: (e) => set({ ...d, recurrence: e.target.value }), children: [
            /* @__PURE__ */ jsx2("option", { children: "One-time" }),
            /* @__PURE__ */ jsx2("option", { children: "Weekly" }),
            /* @__PURE__ */ jsx2("option", { children: "Monthly" }),
            /* @__PURE__ */ jsx2("option", { children: "Annual" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("details", { className: "editor-section", children: [
      /* @__PURE__ */ jsx2("summary", { children: "Locations & campaign" }),
      /* @__PURE__ */ jsxs("div", { className: "formgrid", children: [
        /* @__PURE__ */ jsxs("label", { children: [
          "Location (optional)",
          /* @__PURE__ */ jsxs("select", { value: d.dealership || "", onChange: (e) => set({ ...d, dealership: e.target.value }), children: [
            /* @__PURE__ */ jsx2("option", { value: "", children: "Unassigned / group-wide" }),
            locations.map(([n]) => /* @__PURE__ */ jsx2("option", { children: n }, n))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          "Campaign (optional)",
          /* @__PURE__ */ jsxs("select", { value: d.project || "", onChange: (e) => set({ ...d, project: e.target.value }), children: [
            /* @__PURE__ */ jsx2("option", { value: "", children: "No campaign" }),
            state.records.filter((r) => r.kind === "project" && !r.archived && r.id !== d.id).map((r) => /* @__PURE__ */ jsx2("option", { value: r.id, children: r.title }, r.id))
          ] })
        ] }),
        ["project", "video"].includes(d.kind) && /* @__PURE__ */ jsxs("fieldset", { className: "full location-picker", children: [
          /* @__PURE__ */ jsx2("legend", { children: "Additional locations" }),
          /* @__PURE__ */ jsx2("div", { className: "location-picker-grid", children: locations.map(([n]) => {
            const selected = (d.dealerships || []).includes(n);
            return /* @__PURE__ */ jsxs("button", { type: "button", className: "location-choice " + (selected ? "is-selected" : ""), "aria-pressed": selected, onClick: () => set({ ...d, dealerships: selected ? (d.dealerships || []).filter((x) => x !== n) : [...d.dealerships || [], n] }), children: [
              /* @__PURE__ */ jsx2(LocationBadge, { record: { kind: "dealership", title: n } }),
              /* @__PURE__ */ jsx2("span", { children: n.replace(/^Walker /, "").replace("Automotive Used Cars \u2013 Pineville", "Used Cars \xB7 Pineville") }),
              /* @__PURE__ */ jsx2("span", { className: "location-choice-check", "aria-hidden": "true", children: selected ? "\u2713" : "+" })
            ] }, n);
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("details", { className: "editor-section", children: [
      /* @__PURE__ */ jsx2("summary", { children: "Creative details" }),
      /* @__PURE__ */ jsxs("div", { className: "formgrid", children: [
        field("notes", "Brief / description / caption", "textarea"),
        field("objectives", "Objectives", "textarea"),
        ["video", "idea"].includes(d.kind) && /* @__PURE__ */ jsxs(Fragment, { children: [
          field("script", "Script / hook", "textarea"),
          field("equipment", "Equipment, people and vehicles"),
          field("rawFootage", "Raw footage / reference URL", "url")
        ] }),
        d.kind === "content" && /* @__PURE__ */ jsxs(Fragment, { children: [
          field("hashtags", "Hashtags"),
          /* @__PURE__ */ jsxs("label", { children: [
            "Platform",
            /* @__PURE__ */ jsx2("select", { value: d.platform || "Instagram", onChange: (e) => set({ ...d, platform: e.target.value }), children: ["Facebook", "Instagram", "TikTok", "YouTube", "Email", "Website"].map((x) => /* @__PURE__ */ jsx2("option", { children: x }, x)) })
          ] })
        ] }),
        d.kind === "dealership" && field("address", "Street address")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("details", { className: "editor-section", children: [
      /* @__PURE__ */ jsx2("summary", { children: "Organization" }),
      /* @__PURE__ */ jsxs("div", { className: "formgrid", children: [
        /* @__PURE__ */ jsxs("label", { children: [
          "Campaign category",
          /* @__PURE__ */ jsxs("select", { value: d.category || "", onChange: (e) => set({ ...d, category: e.target.value }), children: [
            /* @__PURE__ */ jsx2("option", { value: "", children: "No category" }),
            state.settings.categories.map((c) => /* @__PURE__ */ jsx2("option", { children: c }, c))
          ] })
        ] }),
        field("priority", "Priority"),
        /* @__PURE__ */ jsxs("label", { children: [
          "Folder (optional)",
          /* @__PURE__ */ jsxs("select", { value: d.folder || "", onChange: (e) => set({ ...d, folder: e.target.value }), children: [
            /* @__PURE__ */ jsx2("option", { value: "", children: "Central library / no folder" }),
            state.records.filter((r) => r.kind === "folder" && !r.archived && r.id !== d.id).map((r) => /* @__PURE__ */ jsxs("option", { value: r.id, children: [
              r.dealership && r.dealership !== r.title ? r.dealership + " / " : "",
              r.title
            ] }, r.id))
          ] })
        ] }),
        field("collaborators", "Collaborators / @mentions"),
        field("tags", "Tags (comma-separated)")
      ] })
    ] }),
    error && /* @__PURE__ */ jsx2("p", { className: "notice", role: "alert", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "modalactions", children: [
      /* @__PURE__ */ jsx2("button", { type: "button", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsx2("button", { className: "primary", children: "Save locally" })
    ] })
  ] }) });
}
function Operations({ section, onReview }) {
  const s = useWorkspace(), [edit, E] = useState(null), [loc, L] = useState(""), [q, Q] = useState(""), [picked, P] = useState(null), [sort, Sort] = useState("Newest");
  const kind = section === "Video production" ? "video" : section === "Ideas library" ? "idea" : section === "Social planner" ? "content" : "project";
  const rows = s.records.filter((r) => r.kind === kind && !r.archived && (!loc || r.dealership === loc || r.dealerships?.includes(loc)) && (!q || (r.title + " " + r.notes).toLowerCase().includes(q.toLowerCase())));
  rows.sort((a, b) => sort === "Name" ? a.title.localeCompare(b.title) : sort === "Date" ? String(a.date || "9999").localeCompare(String(b.date || "9999")) : String(b.updated || "").localeCompare(String(a.updated || "")));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsxs("select", { "aria-label": "Sort records", value: sort, onChange: (e) => Sort(e.target.value), children: [
        /* @__PURE__ */ jsx2("option", { children: "Newest" }),
        /* @__PURE__ */ jsx2("option", { children: "Name" }),
        /* @__PURE__ */ jsx2("option", { children: "Date" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "primary", onClick: () => E({ kind, title: "", status: "Planned", owner: user().name, tasks: [], shots: [], versions: [] }), children: [
        "\uFF0B New ",
        kind === "project" ? "campaign" : kind
      ] }),
      /* @__PURE__ */ jsx2("input", { placeholder: "Search\u2026", "aria-label": "Search records", value: q, onChange: (e) => Q(e.target.value) }),
      /* @__PURE__ */ jsx2(LocationSelect, { value: loc, onChange: L })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "ops-cards", children: rows.map((r) => /* @__PURE__ */ jsxs("article", { className: "card panel", "data-select-id": r.id, children: [
      /* @__PURE__ */ jsxs("span", { className: "eyebrow", children: [
        r.dealership || "Group-wide",
        " ",
        r.demo ? "\xB7 Demo" : ""
      ] }),
      /* @__PURE__ */ jsx2("h3", { children: r.title }),
      /* @__PURE__ */ jsx2("p", { children: r.notes?.slice(0, 170) }),
      /* @__PURE__ */ jsx2("span", { className: "badge", children: r.status }),
      /* @__PURE__ */ jsxs("p", { children: [
        r.owner || "Unassigned",
        " \xB7 ",
        r.date || "Date not set"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ops-actions", children: [
        /* @__PURE__ */ jsx2("button", { onClick: () => E(r), children: "Edit" }),
        /* @__PURE__ */ jsx2("button", { onClick: () => P(r), children: "Open workspace" }),
        kind === "video" && /* @__PURE__ */ jsx2("button", { onClick: () => onReview(r.id), children: "Review video" }),
        kind === "idea" && ["project", "video", "todo"].map((k) => /* @__PURE__ */ jsxs("button", { onClick: () => E({ ...r, id: void 0, kind: k, status: "Planned", sourceIdea: r.id }), children: [
          "Create ",
          k === "project" ? "campaign" : k
        ] }, k)),
        /* @__PURE__ */ jsx2("button", { onClick: () => {
          if (confirm("Archive this local record?")) saveRecord({ ...r, archived: true });
        }, children: "Archive" })
      ] })
    ] }, r.id)) }),
    !rows.length && /* @__PURE__ */ jsx2("div", { className: "card empty", children: "No matching records. Create one to get started." }),
    edit && /* @__PURE__ */ jsx2(RecordEditor, { record: edit, onClose: () => E(null) }),
    picked && /* @__PURE__ */ jsx2(ProjectDetails, { record: s.records.find((r) => r.id === picked.id), onClose: () => P(null), onReview })
  ] });
}
function LocationSelect({ value, onChange }) {
  return /* @__PURE__ */ jsxs("select", { "aria-label": "Location filter", value, onChange: (e) => onChange(e.target.value), children: [
    /* @__PURE__ */ jsx2("option", { value: "", children: "All locations" }),
    locations.map(([n]) => /* @__PURE__ */ jsx2("option", { children: n }, n))
  ] });
}
function ProjectDetails({ record: r, onClose, onReview }) {
  const s = useWorkspace(), [text, T] = useState("");
  return /* @__PURE__ */ jsx2("div", { className: "overlay", children: /* @__PURE__ */ jsxs("section", { className: "modal wide", role: "dialog", "aria-modal": "true", children: [
    /* @__PURE__ */ jsxs("div", { className: "modalhead", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("small", { children: [
          r.kind,
          " / ",
          r.dealership || "Group-wide"
        ] }),
        /* @__PURE__ */ jsx2("h2", { children: r.title })
      ] }),
      /* @__PURE__ */ jsx2("button", { onClick: onClose, "aria-label": "Close", children: "\xD7" })
    ] }),
    /* @__PURE__ */ jsx2("p", { className: "prewrap", children: r.notes }),
    /* @__PURE__ */ jsx2("p", { children: r.script }),
    r.kind === "video" && /* @__PURE__ */ jsx2("button", { className: "primary", onClick: () => {
      onReview(r.id);
      onClose();
    }, children: "Open video review" }),
    /* @__PURE__ */ jsx2("h3", { children: "Linked deliverables & assets" }),
    s.records.filter((x) => (x.project === r.id || x.associations?.some((a) => a.id === r.id)) && !x.archived).map((x) => /* @__PURE__ */ jsxs("p", { children: [
      x.kind,
      " \xB7 ",
      x.title,
      " \xB7 ",
      x.status
    ] }, x.id)),
    /* @__PURE__ */ jsx2("h3", { children: "Production checklist" }),
    (r.tasks || []).map((t, i) => /* @__PURE__ */ jsxs("label", { className: "ops-taskline", "data-select-kind": "task", "data-select-parent": r.id, "data-select-id": String(i), hidden: t.archived, children: [
      /* @__PURE__ */ jsx2("input", { type: "checkbox", checked: t.status === "Complete", onChange: (e) => saveRecord({ ...r, tasks: r.tasks.map((x, j) => j === i ? { ...x, status: e.target.checked ? "Complete" : "To Do" } : x) }) }),
      t.title,
      " ",
      /* @__PURE__ */ jsxs("small", { children: [
        t.assignee,
        " \xB7 ",
        t.due
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxs("form", { className: "ops-toolbar", onSubmit: (e) => {
      e.preventDefault();
      saveRecord({ ...r, tasks: [...r.tasks || [], { title: text, status: "To Do", assignee: "Trav" }] });
      T("");
    }, children: [
      /* @__PURE__ */ jsx2("input", { required: true, placeholder: "Add checklist item", value: text, onChange: (e) => T(e.target.value) }),
      /* @__PURE__ */ jsx2("button", { children: "Add task" })
    ] }),
    /* @__PURE__ */ jsx2(Comments, { record: r }),
    /* @__PURE__ */ jsxs("details", { children: [
      /* @__PURE__ */ jsx2("summary", { children: "Activity history" }),
      r.history?.map((h, i) => /* @__PURE__ */ jsxs("p", { children: [
        h.by,
        " \xB7 ",
        h.action,
        " \xB7 ",
        h.status,
        " \xB7 ",
        new Date(h.at).toLocaleString()
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ops-actions", children: [
      /* @__PURE__ */ jsx2("button", { onClick: () => exportJSON(r, r.title + ".json"), children: "Export record" }),
      /* @__PURE__ */ jsx2("button", { className: "danger", onClick: () => {
        if (confirm("Archive this record? Linked originals remain available.")) {
          saveRecord({ ...r, archived: true });
          onClose();
        }
      }, children: "Archive record" })
    ] })
  ] }) });
}
function Comments({ record: r }) {
  const [text, T] = useState("");
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx2("h3", { children: "Team notes & handoffs" }),
    (r.comments || []).map((c, i) => /* @__PURE__ */ jsxs("div", { className: "comment", hidden: c.archived, "data-select-kind": "comment", "data-select-parent": r.id, "data-select-id": String(i), children: [
      /* @__PURE__ */ jsx2("b", { children: c.by }),
      /* @__PURE__ */ jsx2("small", { children: c.at }),
      /* @__PURE__ */ jsx2("p", { children: c.text })
    ] }, i)),
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      saveRecord({ ...r, comments: [...r.comments || [], { text, by: user().name, at: (/* @__PURE__ */ new Date()).toISOString() }] });
      T("");
    }, children: [
      /* @__PURE__ */ jsx2("textarea", { required: true, placeholder: "Feedback, @mentions, or next steps\u2026", value: text, onChange: (e) => T(e.target.value) }),
      /* @__PURE__ */ jsx2("button", { disabled: !text.trim(), children: "Save note" })
    ] })
  ] });
}

// lib/local-session.ts
async function accountRequest(path, body, method = "POST") {
  const r = await fetch("/__local/" + path, { method: body === void 0 ? "GET" : method, credentials: "same-origin", headers: body === void 0 ? {} : { "Content-Type": "application/json" }, ...body === void 0 ? {} : { body: JSON.stringify(body) } });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Local account request failed");
  return data;
}
async function refreshLocalSession() {
  const data = await accountRequest("me");
  for (const p of [...data.users || [], data.user].filter(Boolean)) if (p.name === "Lawrence Searcy") p.name = "Lawrence";
  if (data.user) {
    const directory = data.users.filter((u) => u.active);
    for (const u of data.users.filter((u2) => !u2.active)) {
      const i = people.findIndex((p) => p.id === u.id);
      if (i >= 0) people.splice(i, 1);
    }
    for (const u of directory) {
      const index = people.findIndex((p) => p.id === u.id);
      if (index >= 0) people[index] = u;
      else people.push(u);
    }
    localStorage.setItem("wam-user-directory", JSON.stringify(directory));
    sessionStorage.setItem("wam-local-auth", data.user.id);
    setUser(data.user.id);
  } else sessionStorage.removeItem("wam-local-auth");
  window.dispatchEvent(new CustomEvent("wam-account-session", { detail: data }));
  return data;
}

// lib/quick-ideas.ts
var signed = () => !!sessionStorage.getItem("wam-local-auth");
function accept(record) {
  mutate((s) => {
    const i = s.records.findIndex((r) => r.id === record.id);
    if (i < 0) s.records.push(record);
    else s.records[i] = record;
    for (const a of record.attachments || []) if (!s.records.some((r) => r.id === a.id)) s.records.push({ ...a, kind: "asset", status: "Draft", quickIdea: record.id, source: "Quick Ideas", project: "", dealership: "", folder: "" });
  });
  return record;
}
async function refreshQuickIdeas() {
  if (!signed()) return;
  const result = await accountRequest("quick-ideas");
  if (result.records.some((r) => JSON.stringify(getState().records.find((x) => x.id === r.id)) !== JSON.stringify(r))) for (const r of result.records) accept(r);
}
async function uploadIdeaMedia(file) {
  if (file.size > 100 * 1024 * 1024) throw Error("Quick Idea files can be up to 100 MB each");
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/") || file.type === "image/svg+xml") throw Error("Choose a photo, screenshot or video");
  if (signed()) {
    const r = await fetch("/__local/quick-ideas/media", { method: "POST", headers: { "Content-Type": file.type, "X-File-Name": encodeURIComponent(file.name) }, body: file });
    const result = await r.json();
    if (!r.ok) throw Error(result.error || "Media upload failed");
    return result;
  }
  const id = await addAsset(file, { source: "Quick Ideas" });
  return { id, title: file.name, type: file.type, size: file.size };
}
async function quickIdeaAction(body) {
  if (user().role === "viewer") throw Error("Your role can view quick ideas only");
  if (signed()) {
    const result = await accountRequest("quick-ideas", body);
    return accept(result.record);
  }
  let r = getState().records.find((r2) => r2.id === body.id);
  if (body.action === "save") {
    if (!body.title?.trim()) throw Error("Give the idea a quick label");
    if (r && r.authorId !== user().id && user().role !== "owner" && !user().isAdmin) throw Error("Only the author or marketing lead can edit this idea");
    r = { ...r, id: r?.id || crypto.randomUUID(), kind: "quickidea", title: body.title.trim(), notes: body.notes || "", attachments: body.attachments || [], authorId: r?.authorId || user().id, author: r?.author || user().name, created: r?.created || (/* @__PURE__ */ new Date()).toISOString(), votes: r?.votes || {}, comments: r?.comments || [], updated: (/* @__PURE__ */ new Date()).toISOString() };
  } else {
    if (!r) throw Error("Idea not found");
    r = JSON.parse(JSON.stringify(r));
    if (body.action === "ack") {
      if (!["seen", "onit", ""].includes(body.value)) throw Error("Choose Seen or On it");
      r.acknowledgements ||= {};
      if (body.value) {
        r.acknowledgements[user().id] = { name: user().name, status: body.value, at: (/* @__PURE__ */ new Date()).toISOString() };
        r.seenBy ||= {};
        r.seenBy[user().id] = (/* @__PURE__ */ new Date()).toISOString();
      } else {
        delete r.acknowledgements[user().id];
        if (r.seenBy) delete r.seenBy[user().id];
      }
    } else if (body.action === "seen") {
      r.seenBy ||= {};
      if (body.value === false) delete r.seenBy[user().id];
      else r.seenBy[user().id] = (/* @__PURE__ */ new Date()).toISOString();
    } else if (body.action === "react") {
      if (![-1, 0, 1].includes(body.value)) throw Error("Choose a reaction");
      r.votes[user().id] = body.value;
    } else if (body.action === "comment") {
      if (!body.text?.trim()) throw Error("Write a note");
      r.comments.push({ id: crypto.randomUUID(), text: body.text.trim(), by: user().name, authorId: user().id, at: (/* @__PURE__ */ new Date()).toISOString() });
    } else if (body.action === "archive" || body.action === "restore") {
      if (r.authorId !== user().id && user().role !== "owner" && !user().isAdmin) throw Error("Only the author or marketing lead can archive this idea");
      r.archived = body.action === "archive";
    } else if (body.action === "delete-comment") {
      const c = r.comments.find((c2) => c2.id === body.commentId);
      if (!c || c.authorId !== user().id && user().role !== "owner" && !user().isAdmin) throw Error("You cannot remove that note");
      c.archived = true;
    } else throw Error("Unknown action");
  }
  return accept(r);
}
function unreadIdeas(state = getState()) {
  return state.records.filter((r) => r.kind === "quickidea" && !r.archived && r.authorId !== user().id && !r.seenBy?.[user().id]);
}
function openQuickIdea() {
  window.dispatchEvent(new Event("wam-quick-idea"));
}

// app/team-status.tsx
import { useState as useState2 } from "react";
import { Check, Hand } from "lucide-react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function TeamStatus({ record, annotation: annotation2 = false, taskIndex }) {
  const [error, E] = useState2(""), [busy, B] = useState2(false), item = taskIndex !== void 0 ? record.tasks[taskIndex] : record;
  const mine = item.acknowledgements?.[user().id]?.status;
  async function set(status2) {
    B(true);
    E("");
    try {
      const value = mine === status2 ? "" : status2;
      if (record.kind === "quickidea") await quickIdeaAction({ id: record.id, action: "ack", value });
      else {
        const acknowledgements = { ...item.acknowledgements };
        if (value) acknowledgements[user().id] = { name: user().name, status: value, at: (/* @__PURE__ */ new Date()).toISOString() };
        else delete acknowledgements[user().id];
        if (annotation2) mutate((s) => {
          const a = s.annotations.find((a2) => a2.id === record.id);
          if (a) a.acknowledgements = acknowledgements;
        });
        else saveRecord(taskIndex !== void 0 ? { ...record, tasks: record.tasks.map((t, i) => i === taskIndex ? { ...t, acknowledgements } : t) } : { ...record, acknowledgements });
      }
    } catch (e) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return /* @__PURE__ */ jsxs2("div", { className: "team-status", children: [
    /* @__PURE__ */ jsxs2("div", { className: "team-status-actions", children: [
      /* @__PURE__ */ jsxs2("button", { type: "button", disabled: busy || user().role === "viewer", "aria-pressed": mine === "seen", onClick: () => set("seen"), children: [
        /* @__PURE__ */ jsx3(Check, { size: 13 }),
        "Seen"
      ] }),
      /* @__PURE__ */ jsxs2("button", { type: "button", disabled: busy || user().role === "viewer", "aria-pressed": mine === "onit", onClick: () => set("onit"), children: [
        /* @__PURE__ */ jsx3(Hand, { size: 13 }),
        "On it"
      ] })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "team-acknowledgements", children: Object.entries(item.acknowledgements || {}).map(([id, a]) => /* @__PURE__ */ jsxs2("span", { className: a.status === "onit" ? "working" : "", children: [
      a.name,
      " \xB7 ",
      a.status === "onit" ? "On it" : "Seen"
    ] }, id)) }),
    error && /* @__PURE__ */ jsx3("small", { role: "alert", children: error })
  ] });
}

// app/quick-ideas.tsx
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function QuickIdeas({ active = false }) {
  const s = useWorkspace(), [compose, Compose] = useState3(false), [draft, Draft] = useState3({}), [files, Files] = useState3([]), [busy, B] = useState3(false), [error, E] = useState3(""), [query, Q] = useState3(""), [filter, F] = useState3("All"), [opened, Open] = useState3(""), [comment, C] = useState3(""), [sync, Sync] = useState3(""), [selected, Select] = useState3([]);
  const anchor = useRef2(-1), press = useRef2(), longPress = useRef2(false);
  const uploaded = useRef2(/* @__PURE__ */ new Map()), input = useRef2(null);
  useEffect2(() => {
    const start = () => {
      Draft({});
      Files([]);
      Compose(true);
      E("");
    }, open = (e) => {
      Open(e.detail);
      Compose(false);
    };
    window.addEventListener("wam-quick-idea", start);
    window.addEventListener("wam-open-quick-idea", open);
    let alive = true;
    const load = () => refreshQuickIdeas().then(() => {
      if (alive) Sync("");
    }).catch((e) => {
      if (alive) Sync("Can\u2019t refresh ideas: " + e.message);
    });
    void load();
    const timer = setInterval(load, 5e3);
    window.addEventListener("wam-account-session", load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("wam-quick-idea", start);
      window.removeEventListener("wam-open-quick-idea", open);
      window.removeEventListener("wam-account-session", load);
    };
  }, []);
  const ideas = s.records.filter((r) => r.kind === "quickidea" && !!r.archived === (filter === "Archived") && (!query || (r.title + " " + r.notes + " " + r.author).toLowerCase().includes(query.toLowerCase())) && (filter !== "New" || unreadIdeas(s).some((x) => x.id === r.id)) && (filter !== "On it" || r.acknowledgements?.[user().id]?.status === "onit")).sort((a, b) => b.created.localeCompare(a.created));
  const current = s.records.find((r) => r.id === opened), canManage = (r) => r.authorId === user().id || user().role === "owner" || user().isAdmin;
  function selectIdea(id, index, range = false) {
    Select((old) => range && anchor.current >= 0 ? [.../* @__PURE__ */ new Set([...old, ...ideas.slice(Math.min(index, anchor.current), Math.max(index, anchor.current) + 1).map((r) => r.id)])] : old.includes(id) ? old.filter((x) => x !== id) : [...old, id]);
    anchor.current = index;
  }
  async function bulk(action, value) {
    if ((action === "archive" || action === "restore") && !confirm((action === "archive" ? "Archive" : "Restore") + " " + selected.length + " idea(s)? Files will be kept.")) return;
    B(true);
    let done = 0;
    const failures = [];
    for (const id of selected) {
      try {
        await quickIdeaAction({ action, id, value });
        done++;
      } catch (e) {
        failures.push(e.message);
      }
    }
    E(done + " updated" + (failures.length ? " \xB7 " + failures.length + " failed: " + failures.join("; ") : ""));
    Select([]);
    B(false);
  }
  useEffect2(() => {
    Select([]);
  }, [query, filter]);
  async function act(body) {
    E("");
    B(true);
    try {
      return await quickIdeaAction(body);
    } catch (e) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  function addFiles(list) {
    const good = list.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (good.length !== list.length) E("Choose photos, screenshots or videos");
    Files((old) => [...old, ...good].slice(0, 12));
  }
  async function save(e) {
    e.preventDefault();
    B(true);
    E("");
    try {
      const attachments = [...draft.attachments || []];
      for (const file of files) {
        let media2 = uploaded.current.get(file);
        if (!media2) {
          media2 = await uploadIdeaMedia(file);
          uploaded.current.set(file, media2);
        }
        attachments.push(media2);
      }
      await quickIdeaAction({ action: "save", id: draft.id, title: draft.title, notes: draft.notes, attachments });
      Compose(false);
      Files([]);
      Draft({});
    } catch (e2) {
      E(e2.message);
    } finally {
      B(false);
    }
  }
  function media(r) {
    return r.attachments?.length ? /* @__PURE__ */ jsx4("div", { className: "quick-idea-media", children: r.attachments.map((a) => /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx4(FilePreview, { id: a.id, type: a.type }),
      /* @__PURE__ */ jsx4("button", { onClick: async () => {
        try {
          const url = await fileURL(a.id);
          if (!url) throw Error("File unavailable");
          window.open(url, "_blank");
        } catch (e) {
          E(e.message);
        }
      }, children: a.title })
    ] }, a.id)) }) : null;
  }
  function reactions(r) {
    return /* @__PURE__ */ jsxs3("div", { className: "idea-reactions", children: [
      [1, -1].map((value) => {
        const Icon = value === 1 ? ThumbsUp : ThumbsDown;
        return /* @__PURE__ */ jsxs3("button", { "aria-label": value === 1 ? "Like idea" : "Dislike idea", "aria-pressed": r.votes?.[user().id] === value, disabled: busy || user().role === "viewer", onClick: () => act({ action: "react", id: r.id, value: r.votes?.[user().id] === value ? 0 : value }), children: [
          /* @__PURE__ */ jsx4(Icon, { size: 14 }),
          Object.values(r.votes || {}).filter((v) => v === value).length
        ] }, value);
      }),
      /* @__PURE__ */ jsxs3("button", { onClick: () => {
        Open(r.id);
        C("");
        E("");
      }, children: [
        "Notes \xB7 ",
        r.comments?.filter((c) => !c.archived).length || 0
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs3(Fragment2, { children: [
    active && /* @__PURE__ */ jsxs3("div", { className: "quick-ideas-page", children: [
      /* @__PURE__ */ jsxs3("div", { className: "quick-ideas-toolbar", children: [
        /* @__PURE__ */ jsxs3("button", { className: "primary", disabled: user().role === "viewer", onClick: openQuickIdea, children: [
          /* @__PURE__ */ jsx4(Plus, { size: 15 }),
          "Add quick idea"
        ] }),
        /* @__PURE__ */ jsx4("input", { "aria-label": "Search quick ideas", placeholder: "Find an idea\u2026", value: query, onChange: (e) => Q(e.target.value) }),
        /* @__PURE__ */ jsx4("select", { "aria-label": "Quick ideas filter", value: filter, onChange: (e) => F(e.target.value), children: ["All", "New", "On it", "Archived"].map((x) => /* @__PURE__ */ jsx4("option", { children: x }, x)) })
      ] }),
      /* @__PURE__ */ jsx4("p", { className: "quick-ideas-intro", children: "A label, a note, a photo or a video. No dates or planning required." }),
      sync && /* @__PURE__ */ jsx4("p", { role: "status", children: sync }),
      error && !compose && /* @__PURE__ */ jsx4("p", { role: "alert", children: error }),
      /* @__PURE__ */ jsx4("div", { className: "quick-ideas-grid", children: ideas.map((r, index) => /* @__PURE__ */ jsxs3("article", { className: "quick-idea-card universal-selectable " + (selected.includes(r.id) ? "universal-selected" : ""), onPointerDown: (e) => {
        if (e.pointerType === "mouse" || e.target.closest("button,input,select,a,textarea")) return;
        longPress.current = false;
        press.current = setTimeout(() => {
          longPress.current = true;
          selectIdea(r.id, index);
        }, 550);
      }, onPointerUp: () => clearTimeout(press.current), onPointerMove: () => clearTimeout(press.current), onPointerCancel: () => clearTimeout(press.current), onClickCapture: (e) => {
        if (longPress.current) {
          e.preventDefault();
          e.stopPropagation();
          longPress.current = false;
        } else if (selected.length && !e.target.closest("button,input,select,a,textarea")) {
          e.preventDefault();
          e.stopPropagation();
          selectIdea(r.id, index, e.shiftKey);
        }
      }, children: [
        /* @__PURE__ */ jsx4("button", { type: "button", className: "selection-circle " + (selected.includes(r.id) ? "checked" : ""), "aria-label": "Select " + r.title, "aria-pressed": selected.includes(r.id), onClick: (e) => {
          e.stopPropagation();
          selectIdea(r.id, index, e.shiftKey);
        }, children: "\u2713" }),
        /* @__PURE__ */ jsxs3("div", { className: "quick-idea-heading", children: [
          /* @__PURE__ */ jsx4("button", { onClick: () => {
            Open(r.id);
            C("");
            E("");
          }, children: /* @__PURE__ */ jsx4("h2", { children: r.title }) }),
          /* @__PURE__ */ jsxs3("small", { children: [
            r.author,
            " \xB7 ",
            new Date(r.created).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          ] })
        ] }),
        r.notes && /* @__PURE__ */ jsx4("p", { className: "idea-note-preview", children: r.notes }),
        media(r),
        /* @__PURE__ */ jsx4(TeamStatus, { record: r }),
        reactions(r),
        canManage(r) && /* @__PURE__ */ jsxs3("details", { className: "idea-manage", children: [
          /* @__PURE__ */ jsx4("summary", { children: "More" }),
          /* @__PURE__ */ jsx4("button", { onClick: () => {
            Draft({ ...r });
            Files([]);
            Compose(true);
          }, children: "Edit idea" }),
          /* @__PURE__ */ jsx4("button", { disabled: busy, onClick: () => {
            if (confirm(r.archived ? "Restore this idea?" : "Archive this idea? Attached files will be kept.")) void act({ action: r.archived ? "restore" : "archive", id: r.id });
          }, children: r.archived ? "Restore" : "Archive" })
        ] })
      ] }, r.id)) }),
      !ideas.length && /* @__PURE__ */ jsxs3("div", { className: "quick-ideas-empty", children: [
        /* @__PURE__ */ jsx4(Lightbulb, { size: 24 }),
        /* @__PURE__ */ jsx4("h2", { children: filter === "All" ? "Have something in mind?" : "No ideas here yet" }),
        /* @__PURE__ */ jsx4("p", { children: "Drop a quick idea here and the team can pick it up." }),
        /* @__PURE__ */ jsx4("button", { onClick: openQuickIdea, children: "Add an idea" })
      ] })
    ] }),
    !!selected.length && active && /* @__PURE__ */ jsxs3("div", { className: "universal-bulkbar", role: "toolbar", "aria-label": "Selected quick ideas", children: [
      /* @__PURE__ */ jsxs3("b", { children: [
        selected.length,
        " selected"
      ] }),
      /* @__PURE__ */ jsx4("button", { disabled: busy, onClick: () => void bulk("ack", "seen"), children: "Seen" }),
      /* @__PURE__ */ jsx4("button", { disabled: busy, onClick: () => void bulk("ack", "onit"), children: "On it" }),
      /* @__PURE__ */ jsx4("button", { disabled: busy, onClick: () => void bulk(filter === "Archived" ? "restore" : "archive"), children: filter === "Archived" ? "Restore" : "Archive" }),
      /* @__PURE__ */ jsx4("button", { onClick: () => Select(ideas.map((r) => r.id)), children: "Select all" }),
      /* @__PURE__ */ jsx4("button", { onClick: () => Select([]), children: "Clear" })
    ] }),
    compose && /* @__PURE__ */ jsx4("div", { className: "overlay", children: /* @__PURE__ */ jsxs3("section", { className: "modal quick-idea-composer", role: "dialog", "aria-modal": "true", "aria-labelledby": "quick-idea-title", children: [
      /* @__PURE__ */ jsxs3("div", { className: "modalhead", children: [
        /* @__PURE__ */ jsx4("h2", { id: "quick-idea-title", children: draft.id ? "Edit idea" : "Quick idea" }),
        /* @__PURE__ */ jsx4("button", { disabled: busy, "aria-label": "Close quick idea", onClick: () => Compose(false), children: /* @__PURE__ */ jsx4(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs3("form", { onSubmit: save, onPaste: (e) => {
        const pasted = Array.from(e.clipboardData.files);
        if (pasted.length) {
          e.preventDefault();
          addFiles(pasted);
        }
      }, children: [
        /* @__PURE__ */ jsxs3("label", { children: [
          "Give it a quick label",
          /* @__PURE__ */ jsx4("input", { required: true, autoFocus: true, maxLength: 180, value: draft.title || "", onChange: (e) => Draft({ ...draft, title: e.target.value }), placeholder: "What caught your eye?" })
        ] }),
        /* @__PURE__ */ jsxs3("label", { children: [
          "Note ",
          /* @__PURE__ */ jsx4("small", { children: "optional" }),
          /* @__PURE__ */ jsx4("textarea", { rows: 3, maxLength: 4e3, value: draft.notes || "", onChange: (e) => Draft({ ...draft, notes: e.target.value }), placeholder: "Anything you want the team to know\u2026" })
        ] }),
        /* @__PURE__ */ jsx4("input", { ref: input, type: "file", accept: "image/*,video/*", multiple: true, hidden: true, onChange: (e) => {
          addFiles(Array.from(e.target.files || []));
          e.target.value = "";
        } }),
        /* @__PURE__ */ jsxs3("button", { type: "button", className: "quick-attach", disabled: busy, onClick: () => input.current?.click(), children: [
          /* @__PURE__ */ jsx4(Paperclip, { size: 16 }),
          "Add photo or video"
        ] }),
        /* @__PURE__ */ jsx4("small", { className: "quick-paste-hint", children: "You can also paste a screenshot here." }),
        /* @__PURE__ */ jsxs3("div", { className: "quick-attached-files", children: [
          (draft.attachments || []).map((a) => /* @__PURE__ */ jsxs3("div", { children: [
            /* @__PURE__ */ jsx4("span", { children: a.title }),
            /* @__PURE__ */ jsx4("button", { type: "button", "aria-label": "Remove " + a.title, onClick: () => Draft({ ...draft, attachments: draft.attachments.filter((x) => x.id !== a.id) }), children: /* @__PURE__ */ jsx4(X, { size: 14 }) })
          ] }, a.id)),
          files.map((f, i) => /* @__PURE__ */ jsxs3("div", { children: [
            /* @__PURE__ */ jsx4("span", { children: f.name }),
            /* @__PURE__ */ jsx4("button", { type: "button", disabled: busy, "aria-label": "Remove " + f.name, onClick: () => Files(files.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsx4(X, { size: 14 }) })
          ] }, i))
        ] }),
        error && /* @__PURE__ */ jsx4("p", { role: "alert", children: error }),
        /* @__PURE__ */ jsxs3("div", { className: "modalactions", children: [
          /* @__PURE__ */ jsx4("button", { type: "button", disabled: busy, onClick: () => Compose(false), children: "Cancel" }),
          /* @__PURE__ */ jsx4("button", { className: "primary", disabled: busy, children: busy ? "Saving\u2026" : draft.id ? "Save changes" : "Share idea" })
        ] })
      ] })
    ] }) }),
    current && !compose && /* @__PURE__ */ jsx4("div", { className: "overlay", children: /* @__PURE__ */ jsxs3("section", { className: "modal quick-idea-detail", role: "dialog", "aria-modal": "true", "aria-labelledby": "idea-detail-title", children: [
      /* @__PURE__ */ jsxs3("div", { className: "modalhead", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx4("h2", { id: "idea-detail-title", children: current.title }),
          /* @__PURE__ */ jsxs3("small", { children: [
            "From ",
            current.author
          ] })
        ] }),
        /* @__PURE__ */ jsx4("button", { "aria-label": "Close idea", onClick: () => Open(""), children: /* @__PURE__ */ jsx4(X, { size: 18 }) })
      ] }),
      current.notes && /* @__PURE__ */ jsx4("p", { className: "prewrap", children: current.notes }),
      media(current),
      /* @__PURE__ */ jsx4(TeamStatus, { record: current }),
      reactions(current),
      /* @__PURE__ */ jsx4("div", { className: "idea-comments", children: (current.comments || []).filter((c) => !c.archived).map((c) => /* @__PURE__ */ jsxs3("article", { children: [
        /* @__PURE__ */ jsx4("small", { children: c.by }),
        /* @__PURE__ */ jsx4("p", { children: c.text }),
        (c.authorId === user().id || user().role === "owner" || user().isAdmin) && /* @__PURE__ */ jsx4("button", { onClick: () => {
          if (confirm("Remove this note?")) void act({ id: current.id, action: "delete-comment", commentId: c.id });
        }, children: "Remove note" })
      ] }, c.id)) }),
      /* @__PURE__ */ jsxs3("form", { onSubmit: async (e) => {
        e.preventDefault();
        const result = await act({ id: current.id, action: "comment", text: comment });
        if (result) C("");
      }, children: [
        /* @__PURE__ */ jsxs3("label", { children: [
          "Add a note",
          /* @__PURE__ */ jsx4("textarea", { required: true, rows: 2, value: comment, onChange: (e) => C(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx4("button", { className: "primary", disabled: busy || !comment.trim(), children: "Add note" })
      ] }),
      error && /* @__PURE__ */ jsx4("p", { role: "alert", children: error })
    ] }) })
  ] });
}

// app/day-planner.tsx
import { useEffect as useEffect3 } from "react";

// lib/planner-sync.ts
var queueKey = "wam-planner-outbox";
var applying = false;
var running = false;
var seen = /* @__PURE__ */ new Map();
var isSharedPlan = (r) => ["todo", "event", "video", "content", "project"].includes(r.kind);
var fingerprint = (r) => JSON.stringify(r);
var plannerSyncStatus = "Demo \xB7 plans shared in this browser";
function status(value) {
  plannerSyncStatus = value;
  window.dispatchEvent(new Event("wam-planner-sync"));
}
function queue() {
  try {
    return JSON.parse(localStorage.getItem(queueKey) || "[]");
  } catch {
    return [];
  }
}
function snapshot() {
  seen = new Map(getState().records.filter((r) => isSharedPlan(r)).map((r) => [r.id, fingerprint(r)]));
}
async function syncPlanner() {
  if (running || !sessionStorage.getItem("wam-local-auth")) return;
  running = true;
  try {
    let jobs = queue();
    for (const job of jobs.filter((j) => j.account === sessionStorage.getItem("wam-local-auth"))) {
      status("Saving shared plans\u2026");
      const response = await accountRequest("day-plans", { record: job.record, revision: job.revision });
      const latest = queue();
      const match = latest.find((j) => j.record.id === job.record.id);
      if (match && fingerprint(match.record) === fingerprint(job.record)) localStorage.setItem(queueKey, JSON.stringify(latest.filter((j) => j !== match)));
      else if (match) {
        match.revision = response.revision;
        localStorage.setItem(queueKey, JSON.stringify(latest));
      }
    }
    const remote = await accountRequest("day-plans"), pending = new Set(queue().map((j) => j.record.id));
    applying = true;
    const local = getState();
    if (remote.records.some((r) => !pending.has(r.id) && fingerprint(local.records.find((x) => x.id === r.id)) !== fingerprint(r))) mutate((s) => {
      for (const r of remote.records) {
        if (pending.has(r.id)) continue;
        const i = s.records.findIndex((x) => x.id === r.id);
        if (i < 0) s.records.push(r);
        else s.records[i] = r;
      }
    });
    snapshot();
    status(pending.size ? "Changes queued \xB7 retrying" : "Shared plans saved on this computer");
  } catch (e) {
    status("Plan sync needs attention: " + e.message);
  } finally {
    applying = false;
    running = false;
  }
}
async function useSharedPlannerVersions() {
  const remote = await accountRequest("day-plans"), jobs = queue();
  const conflicts = jobs.filter((j) => j.account === sessionStorage.getItem("wam-local-auth") && remote.records.some((r) => r.id === j.record.id && r.plannerRevision !== j.revision));
  if (conflicts.length) {
    if (!confirm("Use the latest shared version of " + conflicts.length + " changed plan(s)? Your unsent drafts will be downloaded as a backup.")) return;
    const a = document.createElement("a"), url = URL.createObjectURL(new Blob([JSON.stringify(conflicts, null, 2)], { type: "application/json" }));
    a.href = url;
    a.download = "walker-unsent-plan-drafts.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    localStorage.setItem(queueKey, JSON.stringify(jobs.filter((j) => !conflicts.includes(j))));
  }
  await syncPlanner();
}

// app/day-planner.tsx
import { useState as useState4 } from "react";
import { ChevronLeft, ChevronRight, Plus as Plus2, CalendarDays, Clock3 } from "lucide-react";

// components/ui/button.tsx
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// components/ui/button.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx5(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// components/ui/input.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx6(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}

// lib/day-planner.ts
function personName(value) {
  const v = (value || "").trim();
  return /^(trav|travis)(\s|$)/i.test(v) ? "Travis" : /^mckenzie(\s|$)/i.test(v) ? "McKenzie" : v;
}
function occursOn(r, day) {
  if (!r.date) return false;
  if (r.date === day) return true;
  if (r.date > day || r.endDate && day > r.endDate) return false;
  const a = /* @__PURE__ */ new Date(r.date + "T12:00:00Z"), b = /* @__PURE__ */ new Date(day + "T12:00:00Z");
  if (r.recurrence === "Weekly") return a.getUTCDay() === b.getUTCDay();
  if (r.recurrence === "Monthly") return a.getUTCDate() === b.getUTCDate();
  if (r.recurrence === "Annual") return r.date.slice(5) === day.slice(5);
  return false;
}
function dayPlan(day, state = getState()) {
  const items = [];
  for (const r of state.records.filter((r2) => !r2.archived)) {
    if (["todo", "event", "video", "content"].includes(r.kind) && occursOn({ ...r, date: r.plannedDate || r.date }, day)) items.push({ ...r, ref: { kind: "record", id: r.id }, person: personName(r.owner || r.assignee), source: r.kind === "todo" ? "Day plan" : r.kind === "video" ? "Shoot / production" : r.kind === "content" ? "Publishing plan" : "Calendar", complete: ["Complete", "Completed", "Done", "Published"].includes(r.status) });
    if (["project", "event", "video"].includes(r.kind)) {
      for (const [t, i] of (r.tasks || []).map((t2, i2) => [t2, i2])) if (!t.archived && !t.annotationId && (t.plannedDate || t.due) === day) items.push({ ...t, id: r.id + ":" + i, ref: { kind: "task", parent: r.id, id: String(i) }, person: personName(t.assignee), source: r.title, complete: t.status === "Complete" });
    }
  }
  return items.sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")) || a.title.localeCompare(b.title));
}
function createDayTask(values) {
  if (!["owner", "coordinator"].includes(user().role)) throw Error("Your role can view day plans only");
  if (!values.title?.trim()) throw Error("Enter a task");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date || "")) throw Error("Choose a day");
  return saveRecord({ kind: "todo", title: values.title.trim(), date: values.date, plannedDate: values.date, time: values.time || "", owner: values.owner || user().name, notes: values.notes || "", status: "To Do", priority: values.priority || "Normal", createdBy: user().name, dayPlanner: true });
}
function completeDayTask(item, complete) {
  if (!["owner", "coordinator"].includes(user().role)) throw Error("Your role can view day plans only");
  if (item.ref.kind === "record") {
    const r = getState().records.find((r2) => r2.id === item.ref.id);
    saveRecord({ ...r, status: complete ? "Complete" : "To Do" });
  } else {
    const r = getState().records.find((r2) => r2.id === item.ref.parent);
    saveRecord({ ...r, tasks: r.tasks.map((t, i) => i === +item.ref.id ? { ...t, status: complete ? "Complete" : "To Do" } : t) });
  }
}

// app/day-planner.tsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function DayPlanner() {
  const s = useWorkspace(), [day, D] = useState4(chicagoDate()), [adding, A] = useState4(""), [title, T] = useState4(""), [time, Time] = useState4(""), [error, E] = useState4(""), [edit, Edit] = useState4(null);
  const [sync, Sync] = useState4(plannerSyncStatus);
  useEffect3(() => {
    const changed = () => Sync(plannerSyncStatus);
    window.addEventListener("wam-planner-sync", changed);
    return () => window.removeEventListener("wam-planner-sync", changed);
  }, []);
  const items = dayPlan(day, s), names = ["Travis", "McKenzie", ...new Set(items.map((i) => i.person).filter((p) => p && !["Travis", "McKenzie"].includes(p)))];
  function shift(n) {
    const d = /* @__PURE__ */ new Date(day + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    D(d.toISOString().slice(0, 10));
    A("");
  }
  function itemCard(i) {
    return /* @__PURE__ */ jsxs4("div", { className: "day-task " + (i.complete ? "is-done" : ""), "data-select-kind": i.ref.kind, "data-select-parent": i.ref.parent, "data-select-id": i.ref.id, children: [
      /* @__PURE__ */ jsx7("label", { className: "day-check", children: /* @__PURE__ */ jsx7("input", { type: "checkbox", checked: i.complete, disabled: ["viewer", "executive"].includes(user().role), "aria-label": "Complete " + i.title, onChange: (e) => {
        try {
          completeDayTask(i, e.target.checked);
        } catch (e2) {
          E(e2.message);
        }
      } }) }),
      /* @__PURE__ */ jsxs4("button", { className: "day-task-main", onClick: () => {
        if (i.ref.kind === "record") Edit(s.records.find((r) => r.id === i.ref.id));
        else Edit(s.records.find((r) => r.id === i.ref.parent));
      }, children: [
        /* @__PURE__ */ jsx7("b", { children: i.title }),
        /* @__PURE__ */ jsxs4("small", { children: [
          i.time && /* @__PURE__ */ jsxs4(Fragment3, { children: [
            /* @__PURE__ */ jsx7(Clock3, { size: 10 }),
            i.time,
            " \xB7 "
          ] }),
          i.source,
          i.createdBy ? " \xB7 Added by " + i.createdBy : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx7("span", { className: "day-task-state", children: i.complete ? "Done" : i.status || "Planned" })
    ] }, i.id);
  }
  return /* @__PURE__ */ jsxs4("details", { className: "day-planner", children: [
    /* @__PURE__ */ jsxs4("summary", { className: "planner-toggle", children: [
      /* @__PURE__ */ jsx7(CalendarDays, { size: 17 }),
      /* @__PURE__ */ jsx7("b", { children: "Day Planner" }),
      /* @__PURE__ */ jsxs4("span", { children: [
        items.filter((i) => !i.complete).length,
        " planned"
      ] }),
      /* @__PURE__ */ jsx7(ChevronRight, { className: "planner-toggle-arrow", size: 17 })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "planner-top", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx7("h2", { children: "Day Planner" }),
        /* @__PURE__ */ jsx7("span", { children: "What we\u2019re working on, together." })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "planner-date", children: [
        /* @__PURE__ */ jsx7(Button, { variant: "ghost", size: "icon-sm", "aria-label": "Previous day", onClick: () => shift(-1), children: /* @__PURE__ */ jsx7(ChevronLeft, { size: 16 }) }),
        /* @__PURE__ */ jsx7(Input, { "aria-label": "Day Planner date", type: "date", value: day, onChange: (e) => {
          if (e.target.value) D(e.target.value);
          A("");
        } }),
        /* @__PURE__ */ jsx7(Button, { variant: "ghost", size: "icon-sm", "aria-label": "Next day", onClick: () => shift(1), children: /* @__PURE__ */ jsx7(ChevronRight, { size: 16 }) }),
        /* @__PURE__ */ jsx7(Button, { variant: "outline", size: "sm", onClick: () => D(chicagoDate()), children: "Today" })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "day-planner-columns", children: names.map((name) => {
      const plan = items.filter((i) => i.person === name), complete = plan.filter((i) => i.complete).length;
      return /* @__PURE__ */ jsxs4("section", { className: "person-day", children: [
        /* @__PURE__ */ jsxs4("div", { className: "person-day-title", children: [
          /* @__PURE__ */ jsx7("span", { className: "person-initial " + (name === "Travis" ? "travis" : ""), children: name[0] }),
          /* @__PURE__ */ jsx7("b", { children: name }),
          /* @__PURE__ */ jsxs4("small", { children: [
            complete,
            "/",
            plan.length
          ] }),
          /* @__PURE__ */ jsx7(Button, { variant: "ghost", size: "icon-sm", "aria-label": "Add to " + name + " day plan", disabled: user().role === "viewer" || user().role === "executive", onClick: () => {
            A(adding === name ? "" : name);
            T("");
            Time("");
          }, children: /* @__PURE__ */ jsx7(Plus2, { size: 16 }) })
        ] }),
        plan.map(itemCard),
        !plan.length && /* @__PURE__ */ jsx7("div", { className: "day-empty", children: "No plans yet for this day." }),
        adding === name && /* @__PURE__ */ jsxs4("form", { className: "day-quick-add", onSubmit: (e) => {
          e.preventDefault();
          try {
            createDayTask({ title, date: day, time, owner: name });
            T("");
            A("");
            E("");
          } catch (e2) {
            E(e2.message);
          }
        }, children: [
          /* @__PURE__ */ jsx7(Input, { autoFocus: true, required: true, "aria-label": "Task for " + name, placeholder: "What\u2019s the plan?", value: title, onChange: (e) => T(e.target.value) }),
          /* @__PURE__ */ jsxs4("div", { children: [
            /* @__PURE__ */ jsx7(Input, { type: "time", "aria-label": "Optional planned time", value: time, onChange: (e) => Time(e.target.value) }),
            /* @__PURE__ */ jsx7(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => A(""), children: "Cancel" }),
            /* @__PURE__ */ jsx7(Button, { className: "primary", size: "sm", children: "Add plan" })
          ] })
        ] })
      ] }, name);
    }) }),
    items.some((i) => !i.person) && /* @__PURE__ */ jsxs4("details", { className: "unassigned-day", children: [
      /* @__PURE__ */ jsxs4("summary", { children: [
        "Unassigned calendar items \xB7 ",
        items.filter((i) => !i.person).length
      ] }),
      items.filter((i) => !i.person).map(itemCard)
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "day-planner-foot", children: [
      /* @__PURE__ */ jsx7(CalendarDays, { size: 13 }),
      /* @__PURE__ */ jsx7("span", { children: "Dated tasks and calendar entries appear here automatically." }),
      /* @__PURE__ */ jsx7("small", { role: "status", children: sync }),
      sync.includes("needs attention") && /* @__PURE__ */ jsx7(Button, { size: "sm", variant: "outline", onClick: () => useSharedPlannerVersions().catch((e) => E(e.message)), children: "Reload shared plans / retry" })
    ] }),
    error && /* @__PURE__ */ jsx7("p", { role: "alert", children: error }),
    edit && /* @__PURE__ */ jsx7(RecordEditor, { record: edit, onClose: () => Edit(null) })
  ] });
}

// lib/chat-media.ts
function ensureTeamChat() {
  const s = getState(), ids = people.filter((p) => p.active !== false).map((p) => p.id), team = s.conversations.find((c) => c.id === "team");
  if (!team || team.title !== "COLLAB chat" || JSON.stringify([...team.members].sort()) !== JSON.stringify([...ids].sort())) mutate((s2) => {
    const c = s2.conversations.find((c2) => c2.id === "team");
    if (c) {
      c.members = ids;
      c.title = "COLLAB chat";
    } else s2.conversations.unshift({ id: "team", title: "COLLAB chat", type: "Group", members: ids });
  });
}
function directChat(personId) {
  if (!people.some((p) => p.id === personId && p.active !== false) || personId === user().id) throw Error("Choose another team member");
  const s = getState(), members = [user().id, personId].sort(), found = s.conversations.find((c) => c.type === "Direct" && JSON.stringify([...c.members].sort()) === JSON.stringify(members));
  if (found) return found.id;
  const id = crypto.randomUUID();
  mutate((s2) => s2.conversations.push({ id, title: members.map((id2) => people.find((p) => p.id === id2)?.name).join(" + "), type: "Direct", members }));
  return id;
}
function canAccessAsset(a, s = getState()) {
  if (!a.privateConversation) return true;
  return [a.privateConversation, ...a.sharedConversations || []].some((id) => s.conversations.some((c) => c.id === id && c.members.includes(user().id)));
}
function sendChatMedia(conversationId, values) {
  const s = getState(), chat = conversation(conversationId, s), ids = [...new Set(values.assetIds || [])];
  for (const id of ids) {
    const asset = s.records.find((r) => r.id === id && r.kind === "asset");
    if (!asset || !canAccessAsset(asset, s)) throw Error("You do not have access to one of the selected files");
  }
  if (!values.text?.trim() && !ids.length) throw Error("Write a message or select media");
  const m = { id: crypto.randomUUID(), conversationId, text: values.text || "", replyTo: values.replyTo, attachments: ids, attachment_id: ids[0] || "", sender_id: user().id, sender_name: user().name, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  mutate((s2) => {
    s2.messages.push(m);
    for (const id of ids) {
      const a = s2.records.find((r) => r.id === id);
      a.chatOrigins ||= [];
      a.chatOrigins.push({ conversationId: chat.id, conversationTitle: chat.title, messageId: m.id, sentBy: user().name, sentAt: m.created_at });
      a.associations ||= [];
      if (!a.associations.some((x) => x.kind === "conversation" && x.id === chat.id)) a.associations.push({ id: chat.id, kind: "conversation", label: chat.title });
      if (a.privateConversation && a.privateConversation !== chat.id) a.sharedConversations = [.../* @__PURE__ */ new Set([...a.sharedConversations || [], chat.id])];
      delete a.chatUploadPending;
    }
  }, "Sent chat message and linked media");
  return m;
}

// checks/workflows.ts
import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import React2 from "react";

// lib/review-actions.ts
async function addVideoVersion(videoId, file) {
  const r = getState().records.find((r2) => r2.id === videoId && r2.kind === "video");
  if (!r) throw Error("Video project not found");
  if (!file.type.startsWith("video/")) throw Error("Choose a video file");
  const assetId2 = await addAsset(file);
  const v = { id: crypto.randomUUID(), assetId: assetId2, name: "Version " + ((r.versions || []).length + 1), createdBy: user().name, createdAt: (/* @__PURE__ */ new Date()).toISOString(), status: "Video Draft", reviews: [] };
  saveRecord({ ...r, status: "Editing", versions: [...r.versions || [], v] });
  return v;
}
function addAnnotation(videoId, versionId, values) {
  if (!values.text?.trim()) throw Error("Enter feedback");
  if (values.start < 0 || !Number.isFinite(values.start) || values.end !== null && values.end < values.start) throw Error("Invalid time range");
  const a = { ...values, id: crypto.randomUUID(), videoId, versionId, assigned: "travis", author: user().name, createdAt: (/* @__PURE__ */ new Date()).toISOString(), status: "Open", comments: [], history: [] };
  mutate((s) => {
    const r = s.records.find((r2) => r2.id === videoId);
    if (!r?.versions?.some((v) => v.id === versionId)) throw Error("Video version not found");
    s.annotations.push(a);
    r.status = "Revision";
    r.tasks ||= [];
    r.tasks.push({ title: `${values.type} at ${values.start}s \u2014 ${values.text}`, annotationId: a.id, assignee: "Trav", status: "To Do", urgency: values.priority, due: r.date || "" });
  }, "Added timestamped feedback");
  return a;
}
function setAnnotationStatus(id, status2) {
  if (!["Open", "In Progress", "Ready for Review", "Resolved", "Reopened"].includes(status2)) throw Error("Invalid status");
  mutate((s) => {
    const a = s.annotations.find((a2) => a2.id === id);
    if (!a) throw Error("Feedback not found");
    a.status = status2;
    a.history.push({ status: status2, by: user().name, at: (/* @__PURE__ */ new Date()).toISOString() });
    const r = s.records.find((r2) => r2.id === a.videoId);
    r.tasks = (r.tasks || []).map((t) => t.annotationId === id ? { ...t, status: status2 === "Resolved" ? "Complete" : "To Do" } : t);
  }, "Feedback " + status2);
}
function reviewVersion(videoId, versionId, status2) {
  const s = getState(), r = s.records.find((r2) => r2.id === videoId);
  if (!r) throw Error("Video not found");
  if (status2 === "Approved" && user().role === "coordinator") throw Error("McKenzie or Lawrence must approve");
  if (status2 === "Approved" && s.annotations.some((a) => a.videoId === videoId && a.versionId === versionId && !a.archived && a.status !== "Resolved")) throw Error("Resolve outstanding annotations before approval");
  if (!r.versions.some((v) => v.id === versionId)) throw Error("Version not found");
  saveRecord({ ...r, status: r.versions.at(-1).id === versionId ? status2 === "Approved" ? "Approved" : "Review" : r.status, versions: r.versions.map((v) => v.id === versionId ? { ...v, status: status2, reviews: [...v.reviews || [], { status: status2, by: user().name, at: (/* @__PURE__ */ new Date()).toISOString() }] } : v) });
}
function sendLocalMessage(conversationId, values) {
  conversation(conversationId);
  if (!values.text?.trim() && !values.attachment_id) throw Error("Enter a message or attachment");
  const m = { ...values, id: crypto.randomUUID(), conversationId, sender_id: user().id, sender_name: user().name, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  mutate((s) => s.messages.push(m), "Sent local demo message");
  return m;
}

// lib/item-actions.ts
function resolveItem(s, r) {
  if (r.kind === "personal") return s.personal[user().id]?.find((x) => x.id === r.id);
  if (r.kind === "annotation-comment") return s.annotations.find((x) => x.id === r.parent)?.comments?.[Number(r.id)];
  if (r.kind === "record") return s.records.find((x) => x.id === r.id);
  if (r.kind === "message") return s.messages.find((x) => x.id === r.id);
  if (r.kind === "annotation") return s.annotations.find((x) => x.id === r.id);
  if (r.kind === "shot") return s.records.find((x) => x.id === r.parent)?.shots?.find((x) => x.id === r.id);
  if (r.kind === "task") return s.records.find((x) => x.id === r.parent)?.tasks?.[Number(r.id)];
  if (r.kind === "comment") return s.records.find((x) => x.id === r.parent)?.comments?.[Number(r.id)];
  return null;
}
function canEdit(s, r, item) {
  if (!item) throw Error("Item is no longer available");
  if (user().role === "viewer") throw Error("Viewer accounts are read-only");
  if (r.kind === "message") {
    conversation(item.conversationId, s);
    if (item.sender_id !== user().id) throw Error("Only the sender may edit or remove this message");
  }
  if (r.kind === "personal" && r.parent !== user().id) throw Error("Private workspace access denied");
  if ((r.kind === "comment" || r.kind === "annotation-comment") && item.by !== user().name && user().role !== "owner") throw Error("Only the author or marketing lead may edit this comment");
  if (user().role === "executive" && ["shot", "task"].includes(r.kind)) throw Error("Production work belongs to the marketing team");
  if (user().role === "executive" && r.kind === "record" && !["asset", "video", "content"].includes(item.kind)) throw Error("Executive role reviews deliverables");
}
function updateItem(r, patch) {
  mutate((s) => {
    const item = resolveItem(s, r);
    canEdit(s, r, item);
    Object.assign(item, patch);
  }, "Edited " + r.kind);
}
function bulkItems(refs, action, values = {}) {
  const before = [], copies = [], successes = [], failures = [];
  mutate((s) => {
    for (const r of refs) {
      try {
        const item = resolveItem(s, r);
        canEdit(s, r, item);
        if (action === "duplicate" && !["record", "shot", "task", "personal"].includes(r.kind)) throw Error("Duplicate is unavailable for this item");
        before.push({ r, old: structuredClone(item) });
        if (action === "archive") item.archived = true;
        else if (action === "restore") item.archived = false;
        else if (action === "unassign") {
          if (r.kind === "record") {
            item.project = "";
            item.folder = "";
            item.dealership = "";
            item.associations = [];
            item.owner = "";
          } else {
            item.assigned = "";
            item.assignee = "";
          }
        } else if (action === "assign") {
          Object.assign(item, values);
          if (r.kind === "task" && values.owner) item.assignee = values.owner === "Travis" ? "Trav" : values.owner;
        } else if (action === "duplicate") {
          const copy = { ...structuredClone(item), id: crypto.randomUUID(), title: item.title ? item.title + " \u2014 Copy" : void 0, archived: false };
          if (copy.kind === "video") {
            copy.versions = [];
            copy.status = "Planned";
          }
          if (r.kind === "personal") s.personal[user().id].push(copy);
          else if (r.kind === "record") s.records.push(copy);
          else if (r.kind === "shot") s.records.find((x) => x.id === r.parent).shots.push(copy);
          else s.records.find((x) => x.id === r.parent).tasks.push(copy);
          copies.push({ ...r, id: copy.id });
        } else throw Error("Unsupported action");
        successes.push(item.title || item.text || r.id);
      } catch (e) {
        failures.push(r.kind + ": " + e.message);
      }
    }
  }, action + " selected items");
  return { successes, failures, undo: () => mutate((s) => {
    for (const r of copies) {
      if (r.kind === "personal") s.personal[user().id] = s.personal[user().id].filter((x) => x.id !== r.id);
      else if (r.kind === "record") s.records = s.records.filter((x) => x.id !== r.id);
      else {
        const parent = s.records.find((x) => x.id === r.parent);
        const key2 = r.kind === "shot" ? "shots" : "tasks";
        if (parent) parent[key2] = parent[key2].filter((x) => x.id !== r.id);
      }
    }
    for (const { r, old } of before) {
      const item = resolveItem(s, r);
      if (item) {
        for (const k of Object.keys(item)) delete item[k];
        Object.assign(item, old);
      }
    }
  }, "Undid bulk action") };
}

// lib/api-response.ts
async function apiFetch(url, init = {}) {
  try {
    const u = new URL(url, window.location.origin), s = getState(), b = typeof init.body === "string" ? JSON.parse(init.body) : {}, post = init.method && init.method !== "GET";
    let result = { ok: true };
    if (u.pathname === "/api/workspace") {
      if (!post) result = { member: member(), members: people, records: s.records.filter((r) => !r.privateConversation || [r.privateConversation, ...r.sharedConversations || []].some((id) => s.conversations.some((c) => c.id === id && c.members.includes(user().id)))) };
      else if (b.action === "import") {
      } else if (b.action === "preferences") mutate((s2) => s2.preferences[user().id] = b.preferences);
      else if (b.action === "task") {
        const r = s.records.find((r2) => r2.id === b.recordId);
        if (!r) throw Error("Campaign not found");
        const tasks = [...r.tasks || []];
        if (b.add) tasks.push({ ...b, title: b.title, status: "To Do" });
        else {
          if (!tasks[b.index] || tasks[b.index].title !== b.title) throw Error("Task changed; refresh");
          tasks[b.index] = { ...tasks[b.index], ...b, title: b.newTitle || b.title };
        }
        saveRecord({ ...r, tasks });
      } else if (b.action === "delete") {
        const r = s.records.find((r2) => r2.id === b.id);
        if (!r) throw Error("Record not found");
        saveRecord({ ...r, archived: !r.archived });
      } else if (b.action === "remove-contact") mutate((s2) => {
        const r = s2.records.find((r2) => r2.id === b.id);
        if (r) r.archived = true;
      });
      else if (b.action === "invite") throw Error("Production invitations are disabled. Use the preview identity selector.");
      else result.id = saveRecord(b.record);
    } else if (u.pathname === "/api/files" && post && init.body instanceof FormData) {
      const file = init.body.get("file");
      if (!file) throw Error("Choose a file");
      const meta = {};
      for (const k of ["project", "folder", "parent", "dealership", "version"]) if (init.body.get(k)) meta[k] = init.body.get(k);
      result.id = await addAsset(file, meta);
      result.asset = getState().records.find((r) => r.id === result.id);
    } else if (u.pathname === "/api/chat") {
      const cid = u.searchParams.get("conversation") || b.conversationId || "team";
      conversation(cid, s);
      if (!post) result = { messages: s.messages.filter((m) => m.conversationId === cid), people: people.map((p) => ({ ...p, online: false })), readAt: s.read[user().id + cid] };
      else if (b.action === "heartbeat") {
        if (b.read) mutate((s2) => s2.read[user().id + cid] = (/* @__PURE__ */ new Date()).toISOString());
      } else mutate((s2) => s2.messages.push({ id: b.id || crypto.randomUUID(), conversationId: cid, sender_id: user().id, sender_name: user().name, text: b.text, created_at: (/* @__PURE__ */ new Date()).toISOString(), thread_id: b.threadId, project_id: b.projectId, attachment_id: b.attachmentId }), "Sent local demo message");
    } else if (u.pathname === "/api/personal-workspace") {
      const entries = s.personal[user().id] || [];
      if (!post) result = { entries };
      else {
        if (b.password) throw Error("Do not store real passwords in this local preview");
        mutate((s2) => {
          const list = s2.personal[user().id] ||= [];
          const i = list.findIndex((x) => x.id === b.id);
          if (b.action === "delete") list[i].archived = true;
          else if (b.action === "check" && i >= 0) list[i].checkedDate = b.date;
          else if (b.action === "reveal") throw Error("Password storage is disabled in preview");
          else if (b.action === "project-task") {
            const r = s2.records.find((r2) => r2.id === b.projectId);
            r.tasks ||= [];
            r.tasks.push({ title: list[i].title, status: "To Do", assignee: user().name });
          } else if (i >= 0) list[i] = { ...list[i], ...b };
          else list.push({ ...b, id: crypto.randomUUID() });
        });
      }
    } else if (u.pathname === "/api/hero-images" || u.pathname === "/api/profile-photo") {
      if (init.body instanceof FormData) {
        const id = await addAsset(init.body.get("file"), { category: "Branding" });
        mutate((s2) => {
          s2.preferences[user().id] ||= {};
          if (u.pathname === "/api/hero-images") {
            s2.preferences[user().id].heroImages ||= [];
            s2.preferences[user().id].heroImages.push(id);
          } else s2.preferences[user().id].avatar = id;
        });
        result = { images: getState().preferences[user().id].heroImages || [] };
      } else if (init.method === "DELETE") {
        mutate((s2) => s2.preferences[user().id].heroImages = (s2.preferences[user().id].heroImages || []).filter((x) => x !== u.searchParams.get("image")));
        result = { images: getState().preferences[user().id].heroImages };
      }
    } else throw Error("This external integration is unavailable in the local preview");
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}

// lib/appearance.ts
var appearanceFields = [["pageBg", "Page background"], ["cardBg", "Cards and panels"], ["headerBg", "Header background"], ["sidebarBg", "Sidebar background"], ["inputBg", "Input background"], ["bodyText", "Body text"], ["inputText", "Input text"], ["sidebarText", "Sidebar text"], ["headerText", "Header text"], ["headingText", "Headings"], ["mutedText", "Secondary text"], ["linkText", "Links"], ["buttonBg", "Button background"], ["buttonText", "Button text"], ["primaryBg", "Primary button background"], ["primaryText", "Primary button text"], ["borderColor", "Borders"], ["highlight", "Highlights"]];
var hex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
function luminance(color) {
  const values = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function readable(fg, bg) {
  return contrast(fg, bg) >= 4.5 ? fg : contrast("#ffffff", bg) > contrast("#000000", bg) ? "#ffffff" : "#000000";
}
function appearance(prefs) {
  const dark = prefs?.theme === "dark";
  const accent = hex(prefs?.accent) ? prefs.accent : "#c81927";
  const defaults = dark ? { pageBg: "#171f27", cardBg: "#25313b", headerBg: "#26333e", sidebarBg: "#202c36", inputBg: "#1d2831", bodyText: "#edf2f7", headingText: "#ffffff", mutedText: "#c0cad5", linkText: accent, buttonBg: "#344555", buttonText: "#f5f8fc", primaryBg: accent, primaryText: "#ffffff", borderColor: "#536374", highlight: accent } : { pageBg: "#f5f5f3", cardBg: "#ffffff", headerBg: "#ffffff", sidebarBg: "#ffffff", inputBg: "#ffffff", bodyText: "#28323c", headingText: "#19232d", mutedText: "#5e6873", linkText: accent, buttonBg: "#f3f5f7", buttonText: "#27313b", primaryBg: accent, primaryText: "#ffffff", borderColor: "#d2d8de", highlight: accent };
  const value = { ...defaults };
  for (const [key2] of appearanceFields) if (hex(prefs?.appearance?.[key2])) value[key2] = prefs.appearance[key2];
  for (const key2 of ["bodyText", "headingText", "mutedText", "linkText"]) value[key2] = readable(value[key2], value.cardBg);
  value.inputText = readable(value.inputText || value.bodyText, value.inputBg);
  value.headerText = readable(value.headerText || value.bodyText, value.headerBg);
  value.sidebarText = readable(value.sidebarText || value.bodyText, value.sidebarBg);
  value.pageText = readable(value.bodyText, value.pageBg);
  value.pageHeading = readable(value.headingText, value.pageBg);
  value.pageMuted = readable(value.mutedText, value.pageBg);
  value.pageLink = readable(value.linkText, value.pageBg);
  value.buttonText = readable(value.buttonText, value.buttonBg);
  value.primaryText = readable(value.primaryText, value.primaryBg);
  return value;
}

// app/upload-queue.tsx
import { useRef as useRef3, useState as useState5 } from "react";

// lib/storage-adapter.ts
var localStorageAdapter = { kind: "Local demo \xB7 not in Google Drive", upload: addAsset, playback: fileURL, original: readFile };

// app/upload-queue.tsx
import { Fragment as Fragment4, jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function UploadQueue() {
  const [queue2, Q] = useState5([]), [busy, B] = useState5(false), [drag, D] = useState5(false);
  const input = useRef3(null), cancel = useRef3(false);
  function add(files) {
    if (!files) return;
    Q((old) => [...old, ...Array.from(files).map((file) => ({ id: crypto.randomUUID(), file, status: "Queued", error: "" }))]);
  }
  async function run() {
    B(true);
    cancel.current = false;
    for (const item of queue2.filter((x) => ["Queued", "Failed", "Cancelled"].includes(x.status))) {
      if (cancel.current) {
        Q((old) => old.map((x) => x.status === "Queued" ? { ...x, status: "Cancelled" } : x));
        break;
      }
      Q((old) => old.map((x) => x.id === item.id ? { ...x, status: "Saving", error: "" } : x));
      try {
        await localStorageAdapter.upload(item.file);
        Q((old) => old.map((x) => x.id === item.id ? { ...x, status: "Saved locally" } : x));
      } catch (e) {
        Q((old) => old.map((x) => x.id === item.id ? { ...x, status: "Failed", error: e.message } : x));
      }
    }
    B(false);
  }
  const done = queue2.filter((x) => x.status === "Saved locally").length;
  return /* @__PURE__ */ jsxs5("section", { className: "upload-zone " + (drag ? "dragover" : ""), onDragOver: (e) => {
    e.preventDefault();
    D(true);
  }, onDragLeave: () => D(false), onDrop: (e) => {
    e.preventDefault();
    D(false);
    add(e.dataTransfer.files);
  }, children: [
    /* @__PURE__ */ jsxs5("div", { className: "sectionhead", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx8("h3", { children: "Add files" }),
        /* @__PURE__ */ jsx8("p", { children: "Drop files here, or choose them from your device." })
      ] }),
      /* @__PURE__ */ jsx8("button", { className: "primary", disabled: busy, onClick: () => input.current?.click(), children: "Choose files" })
    ] }),
    /* @__PURE__ */ jsx8("input", { hidden: true, type: "file", ref: input, multiple: true, onChange: (e) => {
      add(e.target.files);
      e.target.value = "";
    } }),
    /* @__PURE__ */ jsx8("small", { children: "Saved on this device \xB7 Up to 500 MB per file" }),
    !!queue2.length && /* @__PURE__ */ jsxs5(Fragment4, { children: [
      /* @__PURE__ */ jsxs5("div", { className: "upload-progress", children: [
        /* @__PURE__ */ jsx8("progress", { max: queue2.length, value: done }),
        /* @__PURE__ */ jsxs5("small", { children: [
          Math.round(done / queue2.length * 100),
          "% of batch saved \xB7 ",
          done,
          "/",
          queue2.length
        ] })
      ] }),
      queue2.map((x) => /* @__PURE__ */ jsxs5("div", { className: "upload-row", children: [
        /* @__PURE__ */ jsx8("span", { children: x.file.name }),
        /* @__PURE__ */ jsx8("b", { children: x.status }),
        x.error && /* @__PURE__ */ jsx8("small", { role: "alert", children: x.error }),
        !busy && x.status !== "Saved locally" && /* @__PURE__ */ jsx8("button", { onClick: () => Q((q) => q.filter((i) => i.id !== x.id)), children: "Remove from queue" })
      ] }, x.id)),
      /* @__PURE__ */ jsxs5("div", { className: "ops-actions", children: [
        /* @__PURE__ */ jsx8("button", { className: "primary", disabled: busy || queue2.every((x) => x.status === "Saved locally"), onClick: run, children: busy ? "Saving\u2026" : "Upload / retry remaining" }),
        busy ? /* @__PURE__ */ jsx8("button", { onClick: () => {
          cancel.current = true;
        }, children: "Cancel after current file" }) : /* @__PURE__ */ jsx8("button", { onClick: () => Q((q) => q.filter((x) => x.status !== "Saved locally")), children: "Clear completed" })
      ] })
    ] })
  ] });
}

// app/asset-assignment.tsx
import { useState as useState6 } from "react";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
function AssetAssignment({ asset, onClose }) {
  const s = useWorkspace(), [links, L] = useState6(asset.associations || []), [q, Q] = useState6(""), [folder, F] = useState6(asset.folder || ""), [error, E] = useState6("");
  const targets = [...s.records.filter((r) => ["project", "video", "event", "todo", "folder", "dealership"].includes(r.kind) && !r.archived && r.id !== asset.id).map((r) => ({ id: r.id, label: r.title, kind: r.kind })), ...s.records.filter((r) => r.kind === "video").flatMap((r) => (r.shots || []).map((shot, i) => ({ id: r.id + ":" + shot.id, label: r.title + " / Shot " + (i + 1) + " " + shot.subject, kind: "shot" })))];
  return /* @__PURE__ */ jsx9("div", { className: "overlay", children: /* @__PURE__ */ jsxs6("form", { className: "modal wide", role: "dialog", "aria-modal": "true", onSubmit: (e) => {
    e.preventDefault();
    try {
      saveRecord({ ...asset, folder, associations: links });
      onClose();
    } catch (e2) {
      E(e2.message);
    }
  }, children: [
    /* @__PURE__ */ jsxs6("h2", { children: [
      "Assign / organize ",
      asset.title
    ] }),
    /* @__PURE__ */ jsx9("p", { children: "One original, any number of relationships. Removing a check never deletes the file." }),
    /* @__PURE__ */ jsxs6("label", { children: [
      "Physical library folder",
      /* @__PURE__ */ jsxs6("select", { value: folder, onChange: (e) => F(e.target.value), children: [
        /* @__PURE__ */ jsx9("option", { value: "", children: "Unfiled Asset Pool" }),
        s.records.filter((r) => r.kind === "folder" && !r.archived).map((r) => /* @__PURE__ */ jsxs6("option", { value: r.id, children: [
          r.dealership && r.dealership !== r.title ? r.dealership + " / " : "",
          r.title
        ] }, r.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx9("input", { "aria-label": "Search assignment destinations", placeholder: "Search locations, projects, tasks or shots\u2026", value: q, onChange: (e) => Q(e.target.value) }),
    /* @__PURE__ */ jsx9("div", { className: "assignment-targets", children: targets.filter((t) => t.label.toLowerCase().includes(q.toLowerCase())).map((t) => /* @__PURE__ */ jsxs6("label", { className: "ops-taskline", children: [
      /* @__PURE__ */ jsx9("input", { type: "checkbox", checked: links.some((l) => l.id === t.id), onChange: (e) => L(e.target.checked ? [...links, t] : links.filter((l) => l.id !== t.id)) }),
      /* @__PURE__ */ jsxs6("span", { children: [
        t.label,
        /* @__PURE__ */ jsx9("small", { className: "block", children: t.kind })
      ] })
    ] }, t.id)) }),
    error && /* @__PURE__ */ jsx9("p", { role: "alert", children: error }),
    /* @__PURE__ */ jsxs6("div", { className: "modalactions", children: [
      /* @__PURE__ */ jsx9("button", { type: "button", onClick: () => L([]), children: "Remove all associations" }),
      /* @__PURE__ */ jsx9("button", { type: "button", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsx9("button", { className: "primary", children: "Save assignments" })
    ] })
  ] }) });
}

// app/library.tsx
import { useState as useState7, useRef as useRef4, useEffect as useEffect4 } from "react";
import { Fragment as Fragment5, jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function Library({ locationsMode = false }) {
  const s = useWorkspace(), [pageIndex, Page] = useState7(0), [folder, F] = useState7(""), [loc, L] = useState7(""), [q, Q] = useState7(""), [type, T] = useState7(""), [view, V] = useState7("Grid"), [sort, S] = useState7("Newest"), [selection, C] = useState7([]), [edit, E] = useState7(null), [detail, D] = useState7(null), [busy, B] = useState7(false), [error, Error2] = useState7(""), [unassigned, U] = useState7(false), [archived, A] = useState7(false), [newFolder, N] = useState7(false), [name, Name] = useState7(""), [assignAsset, AssignAsset] = useState7(null), [bulk, K] = useState7(false), [target, J] = useState7("");
  const press = useRef4();
  useEffect4(() => Page(0), [folder, loc, q, type, view, archived, unassigned]);
  const root = s.records.find((r) => r.id === folder);
  const folders = s.records.filter((r) => r.kind === "folder" && !!r.archived === archived && (r.folder || "") === folder && (!loc || r.dealership === loc));
  let assets = s.records.filter((r) => r.kind === "asset" && (!r.privateConversation || [r.privateConversation, ...r.sharedConversations || []].some((id) => s.conversations.some((c) => c.id === id && c.members.includes(user().id)))) && !!r.archived === archived && (!folder || (r.folder || "") === folder) && (!loc || r.dealership === loc) && (!unassigned || !r.project && !r.dealership && !r.folder && !r.associations?.some((a) => ["project", "video", "event", "dealership", "folder"].includes(a.kind))) && (!type || r.type?.startsWith(type)) && (!q || (r.title + " " + r.originalName + " " + JSON.stringify(r.tags)).toLowerCase().includes(q.toLowerCase())));
  assets.sort((a, b) => sort === "Name" ? a.title.localeCompare(b.title) : sort === "Size" ? (b.size || 0) - (a.size || 0) : String(b.updated || "").localeCompare(String(a.updated || "")));
  function select(id) {
    C((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  }
  async function upload(files) {
    if (!files) return;
    B(true);
    Error2("");
    try {
      for (const f of Array.from(files)) await addAsset(f);
    } catch (e) {
      Error2(e.message);
    } finally {
      B(false);
    }
  }
  const fileInput = useRef4(null);
  function bulkApply(action) {
    try {
      if (action === "archive" && !confirm("Archive selected assets? Originals remain in local storage.")) return;
      mutate((s2) => s2.records = s2.records.map((r) => selection.includes(r.id) ? action === "archive" ? { ...r, archived: true } : action === "restore" ? { ...r, archived: false } : { ...r, folder: target, dealership: s2.records.find((x) => x.id === target)?.dealership || "" } : r), "Updated " + selection.length + " assets");
      C([]);
      K(false);
    } catch (e) {
      Error2(e.message);
    }
  }
  return /* @__PURE__ */ jsxs7(Fragment5, { children: [
    /* @__PURE__ */ jsx10(UploadQueue, {}),
    /* @__PURE__ */ jsxs7("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsx10("button", { className: "primary", disabled: busy, onClick: () => fileInput.current?.click(), children: busy ? "Uploading\u2026" : "\uFF0B Upload files" }),
      /* @__PURE__ */ jsx10("input", { type: "file", ref: fileInput, multiple: true, hidden: true, onChange: (e) => {
        upload(e.target.files);
        e.target.value = "";
      } }),
      /* @__PURE__ */ jsx10("button", { onClick: () => N(true), children: "\uFF0B New folder" }),
      /* @__PURE__ */ jsx10("input", { "aria-label": "Search assets", placeholder: "Search files or tags\u2026", value: q, onChange: (e) => Q(e.target.value) }),
      /* @__PURE__ */ jsx10(LocationSelect, { value: loc, onChange: (v) => {
        L(v);
        F("");
      } }),
      /* @__PURE__ */ jsxs7("select", { "aria-label": "Media type", value: type, onChange: (e) => T(e.target.value), children: [
        /* @__PURE__ */ jsx10("option", { value: "", children: "All file types" }),
        [["image/", "Images"], ["video/", "Video"], ["audio/", "Audio"], ["application/", "Documents"]].map(([v, n]) => /* @__PURE__ */ jsx10("option", { value: v, children: n }, v))
      ] }),
      /* @__PURE__ */ jsxs7("select", { "aria-label": "Asset view", value: view, onChange: (e) => V(e.target.value), children: [
        /* @__PURE__ */ jsx10("option", { children: "Grid" }),
        /* @__PURE__ */ jsx10("option", { children: "List" })
      ] }),
      /* @__PURE__ */ jsxs7("select", { "aria-label": "Sort assets", value: sort, onChange: (e) => S(e.target.value), children: [
        /* @__PURE__ */ jsx10("option", { children: "Newest" }),
        /* @__PURE__ */ jsx10("option", { children: "Name" }),
        /* @__PURE__ */ jsx10("option", { children: "Size" })
      ] }),
      /* @__PURE__ */ jsx10("button", { "aria-pressed": unassigned, onClick: () => {
        U(!unassigned);
        F("");
        L("");
      }, children: "Unassigned" }),
      /* @__PURE__ */ jsx10("button", { "aria-pressed": archived, onClick: () => A(!archived), children: "Archived" })
    ] }),
    /* @__PURE__ */ jsx10("p", { children: "Upload now. Organize whenever you\u2019re ready." }),
    error && /* @__PURE__ */ jsx10("p", { className: "notice", role: "alert", children: error }),
    /* @__PURE__ */ jsxs7("div", { className: "ops-breadcrumb", children: [
      /* @__PURE__ */ jsx10("button", { onClick: () => {
        F("");
        L("");
      }, children: "All files" }),
      root && /* @__PURE__ */ jsxs7(Fragment5, { children: [
        /* @__PURE__ */ jsx10("span", { children: " / " }),
        /* @__PURE__ */ jsx10("button", { onClick: () => F(root.folder || ""), children: "\u2190 Back to folders" }),
        /* @__PURE__ */ jsx10(LocationBadge, { record: root, records: s.records, className: "breadcrumb-badge" }),
        /* @__PURE__ */ jsx10("strong", { children: root.title })
      ] })
    ] }),
    locationsMode && !folder && !unassigned && /* @__PURE__ */ jsx10(Fragment5, { children: /* @__PURE__ */ jsx10("div", { className: "ops-cards", children: locations.map(([n, address], i) => /* @__PURE__ */ jsxs7("button", { className: "card panel location-card branded-folder", style: brandStyle(folderBrand({ kind: "dealership", title: n })), onClick: () => {
      F("locfolder-" + i);
      L(n);
    }, children: [
      /* @__PURE__ */ jsx10(LocationBadge, { record: { kind: "dealership", title: n } }),
      /* @__PURE__ */ jsx10("h3", { children: n }),
      /* @__PURE__ */ jsx10("p", { children: address }),
      /* @__PURE__ */ jsxs7("small", { children: [
        s.records.filter((r) => r.kind === "folder" && r.folder === "locfolder-" + i && !r.archived).length,
        " project folders"
      ] })
    ] }, n)) }) }),
    !unassigned && (!locationsMode || folder) && !!folders.length && /* @__PURE__ */ jsx10("div", { className: "ops-foldergrid", children: folders.map((f) => /* @__PURE__ */ jsxs7("div", { className: "card panel branded-folder", style: brandStyle(folderBrand(f, s.records)), "data-select-id": f.id, children: [
      /* @__PURE__ */ jsxs7("button", { className: "folder-open", onClick: () => F(f.id), children: [
        /* @__PURE__ */ jsx10(LocationBadge, { record: f, records: s.records }),
        /* @__PURE__ */ jsxs7("span", { children: [
          /* @__PURE__ */ jsx10("b", { children: f.title }),
          /* @__PURE__ */ jsx10("small", { children: f.locationRoot ? "Location library" : f.dealership || "Shared folder" })
        ] })
      ] }),
      !f.locationRoot && /* @__PURE__ */ jsx10("button", { onClick: () => E(f), children: "Edit folder" })
    ] }, f.id)) }),
    !!selection.length && /* @__PURE__ */ jsxs7("div", { className: "selectionbar", children: [
      /* @__PURE__ */ jsxs7("b", { children: [
        selection.length,
        " selected"
      ] }),
      /* @__PURE__ */ jsx10("button", { onClick: () => K(true), children: "Move to folder" }),
      /* @__PURE__ */ jsx10("button", { onClick: () => bulkApply(archived ? "restore" : "archive"), children: archived ? "Restore" : "Archive" }),
      /* @__PURE__ */ jsx10("button", { onClick: () => C([]), children: "Clear" })
    ] }),
    /* @__PURE__ */ jsx10("div", { className: view === "Grid" ? "ops-cards" : "ops-filelist", children: assets.slice(pageIndex * 60, (pageIndex + 1) * 60).map((a) => /* @__PURE__ */ jsxs7("article", { className: "card asset-card " + (selection.includes(a.id) ? "is-selected" : ""), "data-select-id": a.id, children: [
      /* @__PURE__ */ jsx10("label", { className: "asset-select legacy-selection", children: /* @__PURE__ */ jsx10("input", { type: "checkbox", "aria-label": "Select " + a.title, checked: selection.includes(a.id), onChange: () => select(a.id) }) }),
      view === "Grid" && /* @__PURE__ */ jsx10(FilePreview, { id: a.id, type: a.type, controls: false }),
      /* @__PURE__ */ jsxs7("div", { className: "asset-info", children: [
        /* @__PURE__ */ jsx10("button", { className: "asset-title", onClick: () => D(a.id), children: a.title }),
        /* @__PURE__ */ jsxs7("small", { children: [
          a.type,
          " \xB7 ",
          ((a.size || 0) / 1024 / 1024).toFixed(1),
          " MB"
        ] }),
        /* @__PURE__ */ jsx10("p", { children: a.chatOrigins?.length ? "From chat: " + [...new Set(a.chatOrigins.map((o) => o.conversationTitle))].join(", ") : "" }),
        /* @__PURE__ */ jsxs7("p", { children: [
          a.dealership || "No location",
          " \xB7 ",
          a.associations?.length ? a.associations.length + " associations" : a.project ? s.records.find((r) => r.id === a.project)?.title || "Linked project" : "No campaign"
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "ops-actions", children: [
          /* @__PURE__ */ jsx10("button", { onClick: () => E(a), children: "Edit details" }),
          /* @__PURE__ */ jsx10("button", { onClick: () => AssignAsset(a), children: "Assign" }),
          /* @__PURE__ */ jsx10("button", { onClick: async () => {
            const url = await fileURL(a.id);
            if (url) {
              const el = document.createElement("a");
              el.href = url;
              el.download = a.originalName || a.title;
              el.click();
            } else Error2("Original file is not available in this local preview");
          }, children: "Download original" })
        ] })
      ] })
    ] }, a.id)) }),
    assets.length > 60 && /* @__PURE__ */ jsxs7("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsx10("button", { disabled: pageIndex === 0, onClick: () => Page((p) => p - 1), children: "Previous 60" }),
      /* @__PURE__ */ jsxs7("span", { children: [
        "Page ",
        pageIndex + 1,
        " of ",
        Math.ceil(assets.length / 60)
      ] }),
      /* @__PURE__ */ jsx10("button", { disabled: (pageIndex + 1) * 60 >= assets.length, onClick: () => Page((p) => p + 1), children: "Next 60" })
    ] }),
    locationsMode && root && /* @__PURE__ */ jsxs7("section", { className: "card panel", children: [
      /* @__PURE__ */ jsxs7("h2", { children: [
        root.dealership,
        " \xB7 marketing workspace"
      ] }),
      /* @__PURE__ */ jsx10("p", { children: "Campaigns, production, events and deadlines for this location." }),
      s.records.filter((r) => ["project", "video", "event", "content", "todo"].includes(r.kind) && !r.archived && (r.dealership === root.dealership || r.dealerships?.includes(root.dealership))).map((r) => /* @__PURE__ */ jsxs7("div", { className: "report-row", "data-select-id": r.id, children: [
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx10("b", { children: r.title }),
          /* @__PURE__ */ jsxs7("small", { className: "block", children: [
            r.kind,
            " \xB7 ",
            r.status,
            " \xB7 ",
            r.date || "Date unconfirmed"
          ] })
        ] }),
        /* @__PURE__ */ jsx10("button", { onClick: () => E(r), children: "Open / edit" })
      ] }, r.id))
    ] }),
    !assets.length && /* @__PURE__ */ jsxs7("div", { className: "card empty", children: [
      /* @__PURE__ */ jsx10("h3", { children: "Room for your next creative." }),
      /* @__PURE__ */ jsx10("p", { children: "Upload any file here. No campaign required." })
    ] }),
    newFolder && /* @__PURE__ */ jsx10("div", { className: "overlay", children: /* @__PURE__ */ jsxs7("form", { className: "modal", role: "dialog", "aria-modal": "true", onSubmit: (e) => {
      e.preventDefault();
      saveRecord({ kind: "folder", title: name, folder, dealership: root?.dealership || loc || "", status: "Active" });
      Name("");
      N(false);
    }, children: [
      /* @__PURE__ */ jsx10("h2", { children: "Create project folder" }),
      /* @__PURE__ */ jsxs7("p", { children: [
        "Inside ",
        root?.title || "Central library"
      ] }),
      /* @__PURE__ */ jsxs7("label", { children: [
        "Folder name",
        /* @__PURE__ */ jsx10("input", { required: true, maxLength: 150, value: name, onChange: (e) => Name(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "modalactions", children: [
        /* @__PURE__ */ jsx10("button", { type: "button", onClick: () => N(false), children: "Cancel" }),
        /* @__PURE__ */ jsx10("button", { className: "primary", children: "Create folder" })
      ] })
    ] }) }),
    bulk && /* @__PURE__ */ jsx10("div", { className: "overlay", children: /* @__PURE__ */ jsxs7("section", { className: "modal", children: [
      /* @__PURE__ */ jsx10("h2", { children: "Move selected assets" }),
      /* @__PURE__ */ jsx10("p", { children: "Folder placement is independent of campaign assignment." }),
      /* @__PURE__ */ jsxs7("select", { "aria-label": "Destination folder", value: target, onChange: (e) => J(e.target.value), children: [
        /* @__PURE__ */ jsx10("option", { value: "", children: "Unfiled central library" }),
        s.records.filter((r) => r.kind === "folder" && !r.archived).map((r) => /* @__PURE__ */ jsxs7("option", { value: r.id, children: [
          r.dealership && r.title !== r.dealership ? r.dealership + " / " : "",
          r.title
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "modalactions", children: [
        /* @__PURE__ */ jsx10("button", { onClick: () => K(false), children: "Cancel" }),
        /* @__PURE__ */ jsx10("button", { className: "primary", onClick: () => bulkApply("move"), children: "Move files" })
      ] })
    ] }) }),
    assignAsset && /* @__PURE__ */ jsx10(AssetAssignment, { asset: assignAsset, onClose: () => AssignAsset(null) }),
    edit && /* @__PURE__ */ jsx10(RecordEditor, { record: edit, onClose: () => E(null) }),
    detail && (() => {
      const a = s.records.find((r) => r.id === detail);
      return /* @__PURE__ */ jsx10("div", { className: "overlay", children: /* @__PURE__ */ jsxs7("section", { className: "modal wide", role: "dialog", "aria-modal": "true", children: [
        /* @__PURE__ */ jsxs7("div", { className: "modalhead", children: [
          /* @__PURE__ */ jsx10("h2", { children: a.title }),
          /* @__PURE__ */ jsx10("button", { onClick: () => D(null), "aria-label": "Close", children: "\xD7" })
        ] }),
        /* @__PURE__ */ jsx10(FilePreview, { id: a.id, type: a.type }),
        /* @__PURE__ */ jsxs7("p", { children: [
          "Original: ",
          a.originalName
        ] }),
        /* @__PURE__ */ jsx10("p", { children: a.notes }),
        /* @__PURE__ */ jsx10("h3", { children: "Chat history" }),
        (a.chatOrigins || []).map((o, i) => /* @__PURE__ */ jsxs7("p", { children: [
          /* @__PURE__ */ jsx10("b", { children: o.conversationTitle }),
          " \xB7 ",
          o.sentBy,
          " \xB7 ",
          new Date(o.sentAt).toLocaleString()
        ] }, i)),
        /* @__PURE__ */ jsx10("h3", { children: "Usage" }),
        /* @__PURE__ */ jsx10("p", { children: a.project ? "Campaign: " + s.records.find((r) => r.id === a.project)?.title : "Available for any campaign. No campaign assigned." }),
        /* @__PURE__ */ jsxs7("p", { children: [
          "Folder: ",
          s.records.find((r) => r.id === a.folder)?.title || "Unfiled"
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "ops-actions", children: [
          /* @__PURE__ */ jsx10("button", { onClick: () => {
            E(a);
            D(null);
          }, children: "Edit metadata" }),
          /* @__PURE__ */ jsx10("button", { onClick: () => saveRecord({ ...a, status: "Review" }), children: "Request review" }),
          /* @__PURE__ */ jsx10("button", { onClick: () => exportJSON(a, a.title + ".metadata.json"), children: "Export metadata" })
        ] })
      ] }) });
    })()
  ] });
}

// app/video-review.tsx
import { useState as useState8, useEffect as useEffect5, useRef as useRef5 } from "react";
import { Fragment as Fragment6, jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var playbackRates = [0.25, 0.5, 1, 1.5, 2];
var timecode = (t) => {
  const n = Math.max(0, t || 0);
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(Math.floor(n % 60)).padStart(2, "0")}.${String(Math.round(n % 1 * 1e3)).padStart(3, "0")}`;
};
function VideoReview({ initial }) {
  const s = useWorkspace(), videos = s.records.filter((r) => r.kind === "video" && !r.archived), [id, ID] = useState8(initial || videos[0]?.id || ""), [version2, V] = useState8(() => {
    try {
      return JSON.parse(sessionStorage.getItem("wam-seek") || "null")?.versionId || "";
    } catch {
      return "";
    }
  }), [url, U] = useState8(""), [speed, Speed] = useState8(2), [draftMarker, Marker] = useState8(false), [now, N] = useState8(0), [duration, Dur] = useState8(0), [manualTiming, ManualTiming] = useState8(false), [start, I] = useState8(0), [end, O] = useState8(null), [type, T] = useState8("GENERAL NOTE"), [text, Text] = useState8(""), [priority, P] = useState8("Normal"), [error, E] = useState8(""), [busy, B] = useState8(false), [refFile, RF] = useState8(null), [edit, Edit] = useState8(null), [query, Q] = useState8(""), [noteFilter, NF] = useState8("All"), [share, Share] = useState8(null), [dest, Dest] = useState8("team");
  const player = useRef5(null);
  const video = s.records.find((r) => r.id === id), versions = video?.versions || [], current = versions.find((v) => v.id === version2) || versions.at(-1), annotations = s.annotations.filter((a) => !a.archived && a.videoId === id && a.versionId === current?.id);
  const reviewer = user().role !== "coordinator";
  useEffect5(() => {
    if (initial) ID(initial);
  }, [initial]);
  useEffect5(() => {
    if (!current) {
      U("");
      return;
    }
    let alive = true;
    fileURL(current.assetId).then((u) => {
      if (alive) U(u);
    });
    return () => {
      alive = false;
    };
  }, [current?.assetId]);
  useEffect5(() => {
    const jump = (e) => {
      ID(e.detail.videoId);
      V(e.detail.versionId);
      setTimeout(() => seek(e.detail.time), 300);
    };
    window.addEventListener("wam-review-link", jump);
    return () => window.removeEventListener("wam-review-link", jump);
  }, []);
  function seek(t) {
    if (player.current) {
      player.current.currentTime = Math.min(duration || Infinity, Math.max(0, t));
      N(t);
    }
  }
  async function upload(file) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      E("Choose a video file");
      return;
    }
    B(true);
    E("");
    try {
      const v = await addVideoVersion(id, file);
      V(v.id);
    } catch (e) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  function updateVersion(status2) {
    try {
      if (status2 === "Approved" && !reviewer) throw Error("McKenzie or Lawrence must approve");
      if (status2 === "Approved" && annotations.some((a) => a.status !== "Resolved")) throw Error("Resolve outstanding annotations before approval");
      reviewVersion(id, current.id, status2);
    } catch (e) {
      E(e.message);
    }
  }
  async function annotate(e) {
    e.preventDefault();
    E("");
    try {
      if (!current) throw Error("Upload a version first");
      if (start < 0 || duration && start > duration || end !== null && (end < start || duration && end > duration)) throw Error("Choose a valid IN / OUT range within this video");
      const reference = refFile ? await addAsset(refFile) : "";
      addAnnotation(id, current.id, { start: manualTiming ? start : now, end: manualTiming ? end : null, type, text, priority, reference });
      Text("");
      RF(null);
      Marker(false);
    } catch (e2) {
      E(e2.message);
    }
  }
  function annotationStatus(a, status2) {
    setAnnotationStatus(a.id, status2);
  }
  const conversations = s.conversations.filter((c) => c.members.includes(user().id));
  return /* @__PURE__ */ jsxs8(Fragment6, { children: [
    /* @__PURE__ */ jsxs8("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsx11("select", { "aria-label": "Select video", value: id, onChange: (e) => {
        ID(e.target.value);
        V("");
        N(0);
      }, children: videos.map((v) => /* @__PURE__ */ jsx11("option", { value: v.id, children: v.title }, v.id)) }),
      /* @__PURE__ */ jsx11("button", { onClick: () => Edit({ kind: "video", title: "", status: "Editing", versions: [], shots: [], owner: "Travis" }), children: "\uFF0B New video project" })
    ] }),
    video ? /* @__PURE__ */ jsx11(Fragment6, { children: /* @__PURE__ */ jsxs8("div", { className: "review-layout", children: [
      /* @__PURE__ */ jsxs8("section", { className: "card panel", children: [
        /* @__PURE__ */ jsxs8("div", { className: "sectionhead", children: [
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx11("span", { className: "eyebrow", children: "VIDEO REVIEW" }),
            /* @__PURE__ */ jsx11("h2", { children: video.title })
          ] }),
          /* @__PURE__ */ jsx11("span", { className: "badge", children: current?.status || "No version" })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "ops-toolbar", children: [
          /* @__PURE__ */ jsx11("select", { "aria-label": "Video version", value: current?.id || "", onChange: (e) => V(e.target.value), children: versions.map((v) => /* @__PURE__ */ jsxs8("option", { value: v.id, children: [
            v.name,
            " \xB7 ",
            v.status
          ] }, v.id)) }),
          /* @__PURE__ */ jsxs8("label", { className: "button", children: [
            busy ? "Saving video\u2026" : "Upload new version",
            /* @__PURE__ */ jsx11("input", { type: "file", accept: "video/*", disabled: busy, hidden: true, onChange: (e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            } })
          ] })
        ] }),
        url ? /* @__PURE__ */ jsx11("video", { ref: player, className: "review-player", src: url, controls: true, playsInline: true, onTimeUpdate: (e) => N(e.currentTarget.currentTime), onLoadedMetadata: (e) => {
          Dur(e.currentTarget.duration);
          e.currentTarget.playbackRate = playbackRates[speed];
          const jump = sessionStorage.getItem("wam-seek");
          if (jump) {
            const j = JSON.parse(jump);
            if (j.videoId === id && j.versionId === current.id) {
              e.currentTarget.currentTime = j.time;
              sessionStorage.removeItem("wam-seek");
            }
          }
        } }, current?.id) : /* @__PURE__ */ jsxs8("div", { className: "review-empty", children: [
          /* @__PURE__ */ jsx11("b", { children: "Upload a video to begin review" }),
          /* @__PURE__ */ jsx11("p", { children: "Your original file stays in this browser. Each version keeps its own feedback." })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "review-player-controls", children: [
          /* @__PURE__ */ jsxs8("output", { "aria-label": "Playback time", children: [
            timecode(now),
            " / ",
            timecode(duration)
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "review-speed", children: [
            /* @__PURE__ */ jsxs8("label", { htmlFor: "review-speed", children: [
              "Speed ",
              /* @__PURE__ */ jsxs8("b", { children: [
                playbackRates[speed],
                "\xD7"
              ] })
            ] }),
            /* @__PURE__ */ jsx11("input", { id: "review-speed", "aria-label": "Playback speed", "aria-valuetext": playbackRates[speed] + " times", type: "range", min: "0", max: "4", step: "1", value: speed, disabled: !url, onChange: (e) => {
              const index = +e.target.value;
              Speed(index);
              if (player.current) player.current.playbackRate = playbackRates[index];
            } }),
            /* @__PURE__ */ jsx11("div", { className: "speed-markers", "aria-hidden": "true", children: playbackRates.map((rate, i) => /* @__PURE__ */ jsxs8("span", { className: i === speed ? "selected" : "", children: [
              rate,
              "\xD7"
            ] }, rate)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "review-mark-actions", children: [
          /* @__PURE__ */ jsx11("button", { disabled: !url, onClick: () => {
            I(now);
            O(null);
            ManualTiming(true);
            Marker(true);
          }, children: "Add marker" }),
          /* @__PURE__ */ jsx11("button", { disabled: !url, onClick: () => {
            I(now);
            ManualTiming(true);
            Marker(true);
          }, children: "Set IN" }),
          /* @__PURE__ */ jsx11("button", { disabled: !url, onClick: () => {
            O(now);
            ManualTiming(true);
            Marker(true);
          }, children: "Set OUT" })
        ] }),
        draftMarker && /* @__PURE__ */ jsxs8("div", { className: "review-range-readout", children: [
          "IN ",
          timecode(start),
          end !== null ? " \xB7 OUT " + timecode(end) : ""
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "review-timeline", "aria-label": "Annotation timeline", children: [
          draftMarker && /* @__PURE__ */ jsx11("span", { className: "draft-review-marker", style: { left: Math.min(98, duration ? start / duration * 100 : 0) + "%" }, title: "Current marker: " + timecode(start), children: "\u25CF" }),
          annotations.map((a) => /* @__PURE__ */ jsx11("button", { style: { left: Math.min(96, duration ? a.start / duration * 100 : 0) + "%" }, onClick: () => seek(a.start), title: `${timecode(a.start)} ${a.type}`, "aria-label": "Seek to " + timecode(a.start), children: "\u25CF" }, a.id))
        ] }),
        /* @__PURE__ */ jsxs8("form", { id: "video-review-note", className: "annotation-form", onSubmit: annotate, children: [
          /* @__PURE__ */ jsxs8("h3", { children: [
            "Leave a review ",
            /* @__PURE__ */ jsx11("small", { children: "Shared with the team" })
          ] }),
          /* @__PURE__ */ jsxs8("label", { children: [
            "What needs to change? ",
            /* @__PURE__ */ jsxs8("small", { children: [
              "At ",
              timecode(manualTiming ? start : now)
            ] }),
            /* @__PURE__ */ jsx11("textarea", { required: true, rows: 2, value: text, onChange: (e) => Text(e.target.value), placeholder: "Write a note about this part of the video\u2026" })
          ] }),
          /* @__PURE__ */ jsxs8("details", { className: "review-options", children: [
            /* @__PURE__ */ jsx11("summary", { children: "Timing & extra details" }),
            /* @__PURE__ */ jsxs8("label", { className: "review-range-toggle", children: [
              /* @__PURE__ */ jsx11("input", { type: "checkbox", checked: manualTiming, onChange: (e) => {
                ManualTiming(e.target.checked);
                I(now);
              } }),
              "Use a custom time or range"
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "ops-formgrid", children: [
              /* @__PURE__ */ jsxs8("label", { children: [
                "Type",
                /* @__PURE__ */ jsx11("select", { value: type, onChange: (e) => T(e.target.value), children: ["REMOVE", "INSERT", "REPLACE", "TRIM", "AUDIO FIX", "GRAPHICS/TEXT", "COLOR", "GENERAL NOTE"].map((x) => /* @__PURE__ */ jsx11("option", { children: x }, x)) })
              ] }),
              /* @__PURE__ */ jsxs8("label", { children: [
                "Priority",
                /* @__PURE__ */ jsx11("select", { value: priority, onChange: (e) => P(e.target.value), children: ["Low", "Normal", "High", "Urgent"].map((x) => /* @__PURE__ */ jsx11("option", { children: x }, x)) })
              ] }),
              /* @__PURE__ */ jsxs8("label", { children: [
                "IN (seconds)",
                /* @__PURE__ */ jsx11("input", { type: "number", min: "0", step: "0.001", value: start, onChange: (e) => {
                  ManualTiming(true);
                  I(+e.target.value);
                } })
              ] }),
              /* @__PURE__ */ jsxs8("label", { children: [
                "OUT (seconds, optional)",
                /* @__PURE__ */ jsx11("input", { type: "number", min: "0", step: "0.001", value: end ?? "", onChange: (e) => {
                  ManualTiming(true);
                  O(e.target.value === "" ? null : +e.target.value);
                } })
              ] })
            ] }),
            /* @__PURE__ */ jsxs8("label", { children: [
              "Optional visual reference",
              /* @__PURE__ */ jsx11("input", { type: "file", onChange: (e) => RF(e.target.files?.[0] || null) })
            ] })
          ] })
        ] }),
        error && /* @__PURE__ */ jsx11("p", { className: "notice", role: "alert", children: error }),
        /* @__PURE__ */ jsxs8("div", { className: "ops-actions review-submit-actions", children: [
          /* @__PURE__ */ jsx11("button", { type: "submit", form: "video-review-note", className: "primary", disabled: !current || !text.trim() || busy, children: "Save review" }),
          /* @__PURE__ */ jsx11("button", { disabled: !current, onClick: () => updateVersion("Submitted for Review"), children: "Submit this version" }),
          reviewer && /* @__PURE__ */ jsxs8(Fragment6, { children: [
            /* @__PURE__ */ jsx11("button", { className: "primary", disabled: !current, onClick: () => updateVersion("Approved"), children: "Approve this version" }),
            /* @__PURE__ */ jsx11("button", { disabled: !current, onClick: () => updateVersion("Revisions requested"), children: "Request revisions" })
          ] }),
          /* @__PURE__ */ jsx11("button", { disabled: !current, onClick: () => exportJSON({ video: video.title, version: current, annotations }, "video-review.json"), children: "Export review" })
        ] }),
        /* @__PURE__ */ jsxs8("details", { children: [
          /* @__PURE__ */ jsx11("summary", { children: "Version approval history" }),
          versions.map((v) => /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsxs8("h3", { children: [
              v.name,
              " \xB7 ",
              v.status
            ] }),
            v.reviews?.map((r, i) => /* @__PURE__ */ jsxs8("p", { children: [
              r.by,
              " \xB7 ",
              r.status,
              " \xB7 ",
              r.at
            ] }, i))
          ] }, v.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("details", { className: "card panel review-notes", children: [
        /* @__PURE__ */ jsxs8("summary", { children: [
          "Review feedback \xB7 ",
          annotations.filter((a) => a.status !== "Resolved").length,
          " open"
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "sectionhead", children: [
          /* @__PURE__ */ jsx11("h2", { children: "Review feedback" }),
          /* @__PURE__ */ jsxs8("span", { className: "badge", children: [
            annotations.filter((a) => a.status !== "Resolved").length,
            " outstanding"
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "ops-toolbar", children: [
          /* @__PURE__ */ jsx11("input", { "aria-label": "Search annotations", placeholder: "Search notes\u2026", value: query, onChange: (e) => Q(e.target.value) }),
          /* @__PURE__ */ jsx11("select", { "aria-label": "Annotation status filter", value: noteFilter, onChange: (e) => NF(e.target.value), children: ["All", "Open", "In Progress", "Ready for Review", "Resolved", "Reopened"].map((x) => /* @__PURE__ */ jsx11("option", { children: x }, x)) })
        ] }),
        annotations.filter((a) => (noteFilter === "All" || a.status === noteFilter) && a.text.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.start - b.start).map((a) => /* @__PURE__ */ jsxs8("article", { className: "annotation", "data-select-kind": "annotation", "data-select-id": a.id, children: [
          /* @__PURE__ */ jsxs8("button", { className: "timecode", onClick: () => seek(a.start), children: [
            timecode(a.start),
            a.end !== null ? "\u2013" + timecode(a.end) : ""
          ] }),
          /* @__PURE__ */ jsxs8("h3", { children: [
            a.type,
            " ",
            /* @__PURE__ */ jsx11("small", { children: a.priority })
          ] }),
          /* @__PURE__ */ jsx11("p", { children: a.text }),
          /* @__PURE__ */ jsxs8("small", { children: [
            a.author,
            " \xB7 ",
            new Date(a.createdAt).toLocaleString(),
            " \xB7 Shared review"
          ] }),
          a.reference && /* @__PURE__ */ jsx11("button", { onClick: async () => window.open(await fileURL(a.reference), "_blank"), children: "Open reference" }),
          /* @__PURE__ */ jsxs8("label", { children: [
            "Status",
            /* @__PURE__ */ jsx11("select", { value: a.status, onChange: (e) => annotationStatus(a, e.target.value), children: ["Open", "In Progress", "Ready for Review", "Resolved", "Reopened"].map((x) => /* @__PURE__ */ jsx11("option", { children: x }, x)) })
          ] }),
          /* @__PURE__ */ jsx11("button", { onClick: () => Share(a), children: "Share to Messenger" }),
          /* @__PURE__ */ jsx11(TeamStatus, { record: a, annotation: true }),
          /* @__PURE__ */ jsx11(AnnotationThread, { annotation: a })
        ] }, a.id)),
        !annotations.length && /* @__PURE__ */ jsx11("p", { children: "No feedback for this version yet." })
      ] })
    ] }) }) : /* @__PURE__ */ jsx11("div", { className: "card empty", children: "Create a video project to start." }),
    edit && /* @__PURE__ */ jsx11(RecordEditor, { record: edit, onClose: () => Edit(null) }),
    share && /* @__PURE__ */ jsx11("div", { className: "overlay", children: /* @__PURE__ */ jsxs8("section", { className: "modal", children: [
      /* @__PURE__ */ jsx11("h2", { children: "Share timestamped feedback" }),
      /* @__PURE__ */ jsx11("select", { value: dest, onChange: (e) => Dest(e.target.value), "aria-label": "Conversation", children: conversations.map((c) => /* @__PURE__ */ jsx11("option", { value: c.id, children: c.title }, c.id)) }),
      /* @__PURE__ */ jsxs8("div", { className: "modalactions", children: [
        /* @__PURE__ */ jsx11("button", { onClick: () => Share(null), children: "Cancel" }),
        /* @__PURE__ */ jsx11("button", { className: "primary", onClick: () => {
          conversation(dest);
          mutate((s2) => s2.messages.push({ id: crypto.randomUUID(), conversationId: dest, sender_id: user().id, sender_name: user().name, text: share.type + " " + timecode(share.start) + " \u2014 " + share.text, annotation: { id: share.id, videoId: id, versionId: share.versionId, time: share.start }, created_at: (/* @__PURE__ */ new Date()).toISOString() }), "Shared local review link");
          Share(null);
        }, children: "Share locally" })
      ] })
    ] }) })
  ] });
}
function AnnotationThread({ annotation: a }) {
  const [t, T] = useState8("");
  return /* @__PURE__ */ jsxs8("details", { children: [
    /* @__PURE__ */ jsxs8("summary", { children: [
      "Discussion (",
      a.comments.length,
      ")"
    ] }),
    a.comments.map((c, i) => /* @__PURE__ */ jsxs8("p", { hidden: c.archived, "data-select-kind": "annotation-comment", "data-select-parent": a.id, "data-select-id": String(i), children: [
      /* @__PURE__ */ jsx11("b", { children: c.by }),
      " ",
      c.text,
      " ",
      /* @__PURE__ */ jsx11("small", { children: c.at })
    ] }, i)),
    /* @__PURE__ */ jsxs8("form", { onSubmit: (e) => {
      e.preventDefault();
      mutate((s) => s.annotations.find((x) => x.id === a.id).comments.push({ text: t, by: user().name, at: (/* @__PURE__ */ new Date()).toISOString() }));
      T("");
    }, children: [
      /* @__PURE__ */ jsx11("input", { required: true, "aria-label": "Reply to feedback", value: t, onChange: (e) => T(e.target.value) }),
      /* @__PURE__ */ jsx11("button", { children: "Reply" })
    ] })
  ] });
}

// app/shot-studio.tsx
import { useState as useState9 } from "react";
import { Fragment as Fragment7, jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
function ShotStudio() {
  const s = useWorkspace(), videos = s.records.filter((r2) => r2.kind === "video" && !r2.archived), [id, ID] = useState9(videos[0]?.id || ""), [edit, E] = useState9(null), [query, Q] = useState9(""), [error, Error2] = useState9("");
  const r = s.records.find((r2) => r2.id === id);
  function save(shots) {
    saveRecord({ ...r, shots });
  }
  const empty = { id: crypto.randomUUID(), framing: "Medium", movement: "Static", subject: "", location: "", notes: "", people: "", vehicles: "", equipment: "", status: "Planned", footage: "", reference: "" };
  return /* @__PURE__ */ jsxs9(Fragment7, { children: [
    /* @__PURE__ */ jsxs9("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsx12("input", { "aria-label": "Search shots", placeholder: "Search shots\u2026", value: query, onChange: (e) => Q(e.target.value) }),
      /* @__PURE__ */ jsx12("select", { "aria-label": "Shot list project", value: id, onChange: (e) => ID(e.target.value), children: videos.map((v) => /* @__PURE__ */ jsx12("option", { value: v.id, children: v.title }, v.id)) }),
      /* @__PURE__ */ jsx12("button", { className: "primary", disabled: !r, onClick: () => E(empty), children: "\uFF0B Add shot" }),
      /* @__PURE__ */ jsx12("button", { disabled: !r, onClick: () => exportJSON({ project: r.title, shots: r.shots || [] }, "shot-list.json"), children: "Export JSON" }),
      /* @__PURE__ */ jsx12("button", { disabled: !r, onClick: () => window.print(), children: "Print / PDF" })
    ] }),
    !r ? /* @__PURE__ */ jsx12("p", { children: "Create a video project first." }) : /* @__PURE__ */ jsxs9(Fragment7, { children: [
      /* @__PURE__ */ jsxs9("h2", { children: [
        r.title,
        " / shot list"
      ] }),
      /* @__PURE__ */ jsxs9("p", { children: [
        r.date || "Shoot date to be confirmed",
        " \xB7 ",
        r.dealership || "Location unassigned"
      ] }),
      (r.shots || []).map((shot, i) => /* @__PURE__ */ jsxs9("article", { className: "card panel shot-card", hidden: shot.archived || !(shot.subject + " " + shot.notes + " " + shot.location).toLowerCase().includes(query.toLowerCase()), "data-select-kind": "shot", "data-select-parent": r.id, "data-select-id": shot.id, children: [
        /* @__PURE__ */ jsxs9("div", { className: "sectionhead", children: [
          /* @__PURE__ */ jsx12("span", { className: "shot-number", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx12("h3", { children: shot.subject || "Untitled shot" }),
          /* @__PURE__ */ jsx12("span", { className: "badge", children: shot.status })
        ] }),
        shot.reference && /* @__PURE__ */ jsx12(FilePreview, { id: shot.reference, type: "image/" }),
        /* @__PURE__ */ jsxs9("p", { children: [
          shot.framing,
          " \xB7 ",
          shot.movement,
          " \xB7 ",
          shot.location || "Location not set"
        ] }),
        /* @__PURE__ */ jsx12("p", { children: shot.notes }),
        /* @__PURE__ */ jsxs9("small", { children: [
          "People: ",
          shot.people || "\u2014",
          " \xB7 Vehicles: ",
          shot.vehicles || "\u2014",
          " \xB7 Equipment: ",
          shot.equipment || "\u2014"
        ] }),
        shot.footage && /* @__PURE__ */ jsx12("p", { children: /* @__PURE__ */ jsx12("a", { href: shot.footage, target: "_blank", rel: "noreferrer", children: "Open footage \u2197" }) }),
        /* @__PURE__ */ jsxs9("div", { className: "ops-actions", children: [
          /* @__PURE__ */ jsx12("button", { onClick: () => E(shot), children: "Edit" }),
          /* @__PURE__ */ jsx12("button", { onClick: () => save([...r.shots || [], { ...shot, id: crypto.randomUUID(), status: "Planned" }]), children: "Duplicate" }),
          /* @__PURE__ */ jsx12("button", { disabled: i === 0, "aria-label": "Move shot " + (i + 1) + " up", onClick: () => {
            const shots = [...r.shots];
            [shots[i - 1], shots[i]] = [shots[i], shots[i - 1]];
            save(shots);
          }, children: "\u2191" }),
          /* @__PURE__ */ jsx12("button", { disabled: i === r.shots.length - 1, "aria-label": "Move shot " + (i + 1) + " down", onClick: () => {
            const shots = [...r.shots];
            [shots[i + 1], shots[i]] = [shots[i], shots[i + 1]];
            save(shots);
          }, children: "\u2193" }),
          /* @__PURE__ */ jsx12("button", { onClick: () => {
            if (confirm("Archive this shot?")) save(r.shots.map((x) => x.id === shot.id ? { ...x, archived: true } : x));
          }, children: "Archive" })
        ] })
      ] }, shot.id)),
      !r.shots?.length && /* @__PURE__ */ jsx12("div", { className: "card empty", children: "Build your first shot. Add framing, movement, talent, equipment and visual references." })
    ] }),
    edit && /* @__PURE__ */ jsx12("div", { className: "overlay", children: /* @__PURE__ */ jsxs9("form", { className: "modal wide", role: "dialog", "aria-modal": "true", onSubmit: (e) => {
      e.preventDefault();
      const exists = r.shots?.some((x) => x.id === edit.id);
      save(exists ? r.shots.map((x) => x.id === edit.id ? edit : x) : [...r.shots || [], edit]);
      E(null);
    }, children: [
      /* @__PURE__ */ jsx12("h2", { children: "Shot details" }),
      /* @__PURE__ */ jsxs9("div", { className: "formgrid", children: [
        ["subject", "framing", "movement", "location", "people", "vehicles", "equipment"].map((k) => /* @__PURE__ */ jsxs9("label", { children: [
          k[0].toUpperCase() + k.slice(1),
          /* @__PURE__ */ jsx12("input", { required: k === "subject", value: edit[k] || "", onChange: (e) => E({ ...edit, [k]: e.target.value }) })
        ] }, k)),
        /* @__PURE__ */ jsxs9("label", { children: [
          "Status",
          /* @__PURE__ */ jsx12("select", { value: edit.status, onChange: (e) => E({ ...edit, status: e.target.value }), children: ["Planned", "Filmed", "Editing", "Approved", "Completed"].map((x) => /* @__PURE__ */ jsx12("option", { children: x }, x)) })
        ] }),
        /* @__PURE__ */ jsxs9("label", { children: [
          "Footage URL",
          /* @__PURE__ */ jsx12("input", { type: "url", value: edit.footage || "", onChange: (e) => E({ ...edit, footage: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs9("label", { children: [
          "Visual reference",
          /* @__PURE__ */ jsx12("input", { type: "file", accept: "image/*", onChange: async (e) => {
            try {
              const f = e.target.files?.[0];
              if (f) E({ ...edit, reference: await addAsset(f) });
            } catch (e2) {
              Error2(e2.message);
            }
          } })
        ] }),
        /* @__PURE__ */ jsxs9("label", { className: "full", children: [
          "Notes",
          /* @__PURE__ */ jsx12("textarea", { value: edit.notes || "", onChange: (e) => E({ ...edit, notes: e.target.value }) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx12("p", { role: "alert", children: error }),
      /* @__PURE__ */ jsxs9("div", { className: "modalactions", children: [
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: () => E(null), children: "Cancel" }),
        /* @__PURE__ */ jsx12("button", { className: "primary", children: "Save shot" })
      ] })
    ] }) })
  ] });
}

// app/planning.tsx
import { useState as useState10 } from "react";
import { Fragment as Fragment8, jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
function PlanningCalendar({ onOpen } = {}) {
  const s = useWorkspace(), [view, V] = useState10("Month"), [date, D] = useState10(chicagoDate()), [loc, L] = useState10(""), [who, W] = useState10(""), [edit, E] = useState10(null), [preview, P] = useState10("");
  let entries = s.records.filter((r) => ["event", "project", "video", "content", "todo"].includes(r.kind) && !r.archived && r.date && (!loc || r.dealership === loc || r.dealerships?.includes(loc)) && (!who || r.owner === who));
  const dt = /* @__PURE__ */ new Date(date + "T12:00:00"), start = new Date(dt.getFullYear(), dt.getMonth(), 1), end = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
  const str = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  let days = [];
  if (view === "Month") {
    const first = new Date(start);
    first.setDate(1 - start.getDay());
    days = Array.from({ length: 42 }, (_, i) => {
      const d = new Date(first);
      d.setDate(d.getDate() + i);
      return d;
    });
  } else if (view === "Week") {
    const first = new Date(dt);
    first.setDate(dt.getDate() - dt.getDay());
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(first);
      d.setDate(d.getDate() + i);
      return d;
    });
  }
  function forDay(day) {
    return entries.filter((r) => r.date === day || r.recurrence === "Weekly" && r.date < day && (/* @__PURE__ */ new Date(r.date + "T12:00:00")).getDay() === (/* @__PURE__ */ new Date(day + "T12:00:00")).getDay());
  }
  function openDay(day) {
    if (forDay(day).length) P(day);
    else E({ kind: "content", date: day, title: "", status: "Draft", owner: user().name });
  }
  function shift(n) {
    const d = new Date(dt);
    view === "Month" ? d.setMonth(d.getMonth() + n) : d.setDate(d.getDate() + n * 7);
    D(str(d));
  }
  function reschedule(id, target) {
    const r = s.records.find((r2) => r2.id === id);
    if (!r) return;
    let endDate = r.endDate;
    if (endDate) {
      const diff = Date.parse(target) - Date.parse(r.date);
      endDate = new Date(Date.parse(endDate) + diff).toISOString().slice(0, 10);
    }
    saveRecord({ ...r, date: target, endDate });
  }
  return /* @__PURE__ */ jsxs10(Fragment8, { children: [
    /* @__PURE__ */ jsxs10("div", { className: "ops-toolbar calendar-toolbar", children: [
      /* @__PURE__ */ jsx13("button", { className: "primary", onClick: () => E({ kind: "event", title: "", date, status: "Planned", owner: user().name }), children: "\uFF0B Calendar entry" }),
      /* @__PURE__ */ jsx13("select", { "aria-label": "Calendar view", value: view, onChange: (e) => V(e.target.value), children: ["Month", "Week", "Agenda"].map((x) => /* @__PURE__ */ jsx13("option", { children: x }, x)) }),
      /* @__PURE__ */ jsx13("button", { onClick: () => shift(-1), "aria-label": "Previous period", children: "\u2190" }),
      /* @__PURE__ */ jsx13("input", { type: "date", "aria-label": "Calendar date", value: date, onChange: (e) => D(e.target.value) }),
      /* @__PURE__ */ jsx13("button", { onClick: () => shift(1), "aria-label": "Next period", children: "\u2192" }),
      /* @__PURE__ */ jsx13(LocationSelect, { value: loc, onChange: L }),
      /* @__PURE__ */ jsxs10("select", { "aria-label": "Calendar assignee", value: who, onChange: (e) => W(e.target.value), children: [
        /* @__PURE__ */ jsx13("option", { value: "", children: "All people" }),
        people.map((p) => /* @__PURE__ */ jsx13("option", { children: p.name }, p.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx13("h2", { className: "calendar-period-title", children: dt.toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
    /* @__PURE__ */ jsx13("p", { className: "calendar-help", children: "Tap an empty day to plan content. Tap a day or item for a quick overview." }),
    view === "Agenda" ? /* @__PURE__ */ jsx13("div", { className: "card panel", children: entries.sort((a, b) => a.date.localeCompare(b.date)).filter((r) => r.date >= str(start) && r.date <= str(end)).map((r) => /* @__PURE__ */ jsxs10("button", { className: "agenda-item", onClick: () => P(r.date), children: [
      /* @__PURE__ */ jsx13("b", { children: r.date }),
      /* @__PURE__ */ jsx13("span", { children: r.title }),
      /* @__PURE__ */ jsxs10("small", { children: [
        r.kind,
        " \xB7 ",
        r.owner,
        " \xB7 ",
        r.status
      ] })
    ] }, r.id)) }) : /* @__PURE__ */ jsxs10("div", { className: "ops-calendar", children: [
      /* @__PURE__ */ jsx13("div", { className: "calendar-weekheads", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => /* @__PURE__ */ jsx13("span", { children: d }, d)) }),
      /* @__PURE__ */ jsx13("div", { className: "calendar-days", children: days.map((d) => /* @__PURE__ */ jsxs10("div", { className: "calendar-day " + (str(d) === chicagoDate() ? "is-today" : ""), tabIndex: 0, role: "button", "aria-label": "Plan content on " + str(d), onClick: (e) => {
        if (!e.target.closest("button,input,select,a")) openDay(str(d));
      }, onKeyDown: (e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          openDay(str(d));
        }
      }, onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
        e.preventDefault();
        reschedule(e.dataTransfer.getData("text/plain"), str(d));
      }, children: [
        /* @__PURE__ */ jsx13("button", { className: "day-number", "aria-label": "Plan content on " + str(d), onClick: () => openDay(str(d)), children: d.getDate() }),
        forDay(str(d)).length > 0 && /* @__PURE__ */ jsxs10("button", { className: "calendar-day-count", onClick: () => P(str(d)), children: [
          forDay(str(d)).length,
          " ",
          forDay(str(d)).length === 1 ? "event" : "events"
        ] }),
        forDay(str(d)).slice(0, 2).map((r) => /* @__PURE__ */ jsxs10("button", { className: "calendar-event", title: r.title, draggable: true, onDragStart: (e) => e.dataTransfer.setData("text/plain", r.id), onClick: () => P(str(d)), children: [
          /* @__PURE__ */ jsx13("small", { children: r.kind }),
          r.title
        ] }, r.id))
      ] }, str(d))) })
    ] }),
    preview && /* @__PURE__ */ jsx13("div", { className: "overlay", onClick: () => P(""), children: /* @__PURE__ */ jsxs10("section", { className: "modal calendar-day-preview", role: "dialog", "aria-modal": "true", "aria-label": "Day overview", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs10("div", { className: "modalhead", children: [
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx13("h2", { children: (/* @__PURE__ */ new Date(preview + "T12:00:00")).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) }),
          /* @__PURE__ */ jsxs10("small", { children: [
            forDay(preview).length,
            " events"
          ] })
        ] }),
        /* @__PURE__ */ jsx13("button", { type: "button", "aria-label": "Close day overview", onClick: () => P(""), children: "\xD7" })
      ] }),
      forDay(preview).map((r) => /* @__PURE__ */ jsxs10("article", { children: [
        /* @__PURE__ */ jsxs10("small", { children: [
          r.kind === "project" ? "Campaign" : r.kind === "todo" ? "Task" : r.kind === "content" ? "Content" : r.kind === "video" ? "Video" : "Event",
          " \xB7 ",
          r.status
        ] }),
        /* @__PURE__ */ jsx13("h3", { children: r.title }),
        /* @__PURE__ */ jsx13("p", { children: String(r.notes || r.description || r.objectives || "No description yet.").slice(0, 240) }),
        r.owner && /* @__PURE__ */ jsx13("small", { children: r.owner }),
        /* @__PURE__ */ jsx13("button", { type: "button", onClick: () => {
          P("");
          onOpen ? onOpen(r) : E(r);
        }, children: "Show more \u2192" })
      ] }, r.id)),
      /* @__PURE__ */ jsx13("button", { type: "button", className: "primary", onClick: () => {
        E({ kind: "content", date: preview, title: "", status: "Draft", owner: user().name });
        P("");
      }, children: "\uFF0B Plan content for this day" })
    ] }) }),
    edit && /* @__PURE__ */ jsx13(RecordEditor, { record: edit, onClose: () => E(null) })
  ] });
}
function TaskBoard({ onReview }) {
  const s = useWorkspace(), [view, V] = useState10("List"), [who, W] = useState10(""), [edit, E] = useState10(null), [loc, L] = useState10("");
  const tasks = [...s.records.filter((r) => r.kind === "todo" && !r.archived).map((r) => ({ ...r, standalone: true })), ...s.records.filter((r) => !r.archived).flatMap((r) => (r.tasks || []).map((t, index) => ({ ...t, id: r.id + ":" + index, record: r, index, owner: t.assignee === "Trav" ? "Travis" : t.assignee, date: t.due, dealership: r.dealership })))].filter((t) => !t.archived && (!who || t.owner === who) && (!loc || t.dealership === loc));
  const statuses = ["To Do", "In Progress", "Complete"];
  function change(t, status2) {
    if (t.standalone) saveRecord({ ...t, status: status2 });
    else saveRecord({ ...t.record, tasks: t.record.tasks.map((x, i) => i === t.index ? { ...x, status: status2 } : x) });
  }
  const card = (t) => /* @__PURE__ */ jsxs10("article", { className: "card panel", "data-select-kind": t.standalone ? "record" : "task", "data-select-parent": t.record?.id, "data-select-id": t.standalone ? t.id : String(t.index), children: [
    /* @__PURE__ */ jsxs10("small", { children: [
      t.record?.title || "Independent task",
      " \xB7 ",
      t.dealership || "Group-wide"
    ] }),
    /* @__PURE__ */ jsx13("h3", { children: t.title }),
    /* @__PURE__ */ jsxs10("p", { children: [
      t.owner || "Unassigned",
      " \xB7 ",
      t.date || "No deadline",
      " \xB7 ",
      t.urgency || "Normal"
    ] }),
    /* @__PURE__ */ jsx13("select", { "aria-label": "Status for " + t.title, value: t.status || "To Do", onChange: (e) => change(t, e.target.value), children: [...new Set([...statuses, t.status].filter(Boolean))].map((x) => /* @__PURE__ */ jsx13("option", { children: x }, x)) }),
    t.annotationId && /* @__PURE__ */ jsx13("button", { onClick: () => {
      const a = s.annotations.find((a2) => a2.id === t.annotationId);
      if (a) {
        sessionStorage.setItem("wam-seek", JSON.stringify({ ...a, time: a.start }));
        onReview(a.videoId);
      }
    }, children: "Jump to video feedback" }),
    t.standalone && /* @__PURE__ */ jsx13("button", { onClick: () => E(t), children: "Edit" }),
    /* @__PURE__ */ jsx13(TeamStatus, { record: t.standalone ? t : t.record, taskIndex: t.standalone ? void 0 : t.index })
  ] }, t.id);
  return /* @__PURE__ */ jsxs10(Fragment8, { children: [
    /* @__PURE__ */ jsxs10("div", { className: "ops-toolbar", children: [
      /* @__PURE__ */ jsx13("button", { className: "primary", onClick: () => E({ kind: "todo", title: "", status: "To Do", owner: "Travis" }), children: "\uFF0B Add task" }),
      /* @__PURE__ */ jsx13("select", { "aria-label": "Task view", value: view, onChange: (e) => V(e.target.value), children: ["Kanban", "List", "Calendar"].map((x) => /* @__PURE__ */ jsx13("option", { children: x }, x)) }),
      /* @__PURE__ */ jsxs10("select", { "aria-label": "Task assignee", value: who, onChange: (e) => W(e.target.value), children: [
        /* @__PURE__ */ jsx13("option", { value: "", children: "All people" }),
        people.map((p) => /* @__PURE__ */ jsx13("option", { children: p.name }, p.id))
      ] }),
      /* @__PURE__ */ jsx13(LocationSelect, { value: loc, onChange: L })
    ] }),
    view === "Calendar" ? /* @__PURE__ */ jsx13("div", { className: "card panel", children: tasks.filter((t) => t.date).sort((a, b) => a.date.localeCompare(b.date)).map(card) }) : view === "List" ? /* @__PURE__ */ jsx13("div", { className: "ops-cards", children: tasks.map(card) }) : /* @__PURE__ */ jsx13("div", { className: "ops-kanban", children: statuses.map((status2) => /* @__PURE__ */ jsxs10("section", { children: [
      /* @__PURE__ */ jsxs10("h3", { children: [
        status2,
        " ",
        /* @__PURE__ */ jsx13("small", { children: tasks.filter((t) => status2 === "To Do" ? !["In Progress", "Complete"].includes(t.status) : t.status === status2).length })
      ] }),
      tasks.filter((t) => status2 === "To Do" ? !["In Progress", "Complete"].includes(t.status) : t.status === status2).map(card)
    ] }, status2)) }),
    edit && /* @__PURE__ */ jsx13(RecordEditor, { record: edit, onClose: () => E(null) })
  ] });
}
function Reports() {
  const s = useWorkspace(), active = s.records.filter((r) => !r.archived), tasks = active.flatMap((r) => r.tasks || []), content = active.filter((r) => r.kind === "content"), counts = workflow.map((status2) => [status2, active.filter((r) => r.status === status2).length]);
  return /* @__PURE__ */ jsxs10(Fragment8, { children: [
    /* @__PURE__ */ jsx13("p", { className: "notice", children: "Preview operations only \xB7 includes unverified uploaded history and sample records. No connected social analytics or verified publication." }),
    /* @__PURE__ */ jsx13("div", { className: "stats", children: [[tasks.filter((t) => t.status === "Complete").length, "Tasks complete"], [tasks.filter((t) => t.status !== "Complete").length, "Outstanding tasks"], [content.filter((r) => r.status === "Scheduled").length, "Planned as scheduled"], [content.filter((r) => r.status === "Published").length, "Marked published (unverified)"]].map(([n, l]) => /* @__PURE__ */ jsxs10("div", { className: "card stat", children: [
      /* @__PURE__ */ jsx13("small", { children: l }),
      /* @__PURE__ */ jsx13("strong", { children: n })
    ] }, l)) }),
    /* @__PURE__ */ jsxs10("div", { className: "twocol", children: [
      /* @__PURE__ */ jsxs10("section", { className: "card panel", children: [
        /* @__PURE__ */ jsx13("h2", { children: "Campaign & production pipeline" }),
        counts.map(([status2, n]) => /* @__PURE__ */ jsxs10("div", { className: "report-row", children: [
          /* @__PURE__ */ jsx13("span", { children: status2 }),
          /* @__PURE__ */ jsx13("meter", { min: "0", max: Math.max(1, ...counts.map((x) => Number(x[1]))), value: n }),
          /* @__PURE__ */ jsx13("b", { children: n })
        ] }, status2))
      ] }),
      /* @__PURE__ */ jsxs10("section", { className: "card panel", children: [
        /* @__PURE__ */ jsx13("h2", { children: "Recent activity" }),
        s.activity.slice(0, 15).map((a) => /* @__PURE__ */ jsxs10("p", { children: [
          /* @__PURE__ */ jsx13("b", { children: a.by }),
          " \xB7 ",
          a.text,
          /* @__PURE__ */ jsx13("small", { className: "block", children: new Date(a.at).toLocaleString() })
        ] }, a.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs10("section", { className: "card panel", children: [
      /* @__PURE__ */ jsx13("h2", { children: "Content per dealership" }),
      s.records.filter((r) => r.kind === "dealership").map((l) => /* @__PURE__ */ jsxs10("div", { className: "report-row", children: [
        /* @__PURE__ */ jsx13("span", { children: l.title }),
        /* @__PURE__ */ jsxs10("b", { children: [
          active.filter((r) => ["video", "content", "asset"].includes(r.kind) && r.dealership === l.title).length,
          " deliverables / assets"
        ] })
      ] }, l.id))
    ] })
  ] });
}

// app/local-accounts.tsx
import { useState as useState11, useEffect as useEffect6 } from "react";
import { Fragment as Fragment9, jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
function ProfileAvatar({ id }) {
  const s = useWorkspace(), [url, U] = useState11(""), [version2, V] = useState11(Date.now());
  useEffect6(() => {
    const update = () => V(Date.now());
    window.addEventListener("wam-profile", update);
    return () => window.removeEventListener("wam-profile", update);
  }, []);
  useEffect6(() => {
    if (sessionStorage.getItem("wam-local-auth")) {
      U("/__local/photo?id=" + encodeURIComponent(id) + "&v=" + version2);
      return;
    }
    const image = s.preferences[id]?.avatar;
    if (image) fileURL(image).then(U).catch(() => U(""));
    else U("");
  }, [id, s.preferences[id]?.avatar, version2]);
  return /* @__PURE__ */ jsxs11("span", { className: "profile-avatar", children: [
    url && /* @__PURE__ */ jsx14("img", { src: url, alt: "Profile photo", onError: () => U("") }),
    !url && (people.find((p) => p.id === id)?.name || "User").split(" ").map((x) => x[0]).join("").slice(0, 2)
  ] });
}
function LocalAccounts() {
  const [data, D] = useState11(null), [error, E] = useState11(""), [busy, B] = useState11(false), [draft, Edit] = useState11(null), [email, Email] = useState11(""), [password, Password] = useState11(""), [name, Name] = useState11("Travis");
  const s = useWorkspace();
  async function load() {
    try {
      D(await refreshLocalSession());
      E("");
    } catch (e) {
      E(e.message);
    }
  }
  useEffect6(() => {
    load();
  }, []);
  async function run(fn) {
    B(true);
    E("");
    try {
      await fn();
      await load();
      Password("");
    } catch (e) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return /* @__PURE__ */ jsxs11("section", { className: "card panel local-account-panel", children: [
    /* @__PURE__ */ jsxs11("div", { className: "sectionhead", children: [
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx14("h2", { children: "Account, profile & users" }),
        /* @__PURE__ */ jsx14("p", { children: "Local SQLite account service \xB7 no production account changes" })
      ] }),
      /* @__PURE__ */ jsx14(ProfileAvatar, { id: user().id })
    ] }),
    error && /* @__PURE__ */ jsx14("p", { className: "notice", role: "alert", children: error }),
    !data && /* @__PURE__ */ jsx14("button", { onClick: load, children: "Load local accounts" }),
    data && !data.user && /* @__PURE__ */ jsxs11(Fragment9, { children: [
      /* @__PURE__ */ jsx14("h3", { children: data.setupRequired ? "Set up your local administrator login" : "Sign in to your local account" }),
      /* @__PURE__ */ jsx14("p", { children: "Account passwords are hashed on this computer. Campaign data is still stored in this browser. Preview identities remain available without a login." }),
      /* @__PURE__ */ jsxs11("form", { className: "account-form", onSubmit: (e) => {
        e.preventDefault();
        run(() => accountRequest(data.setupRequired ? "setup" : "login", { email, password, name }));
      }, children: [
        data.setupRequired && /* @__PURE__ */ jsxs11("label", { children: [
          "Name",
          /* @__PURE__ */ jsx14("input", { required: true, value: name, onChange: (e) => Name(e.target.value), autoComplete: "name" })
        ] }),
        /* @__PURE__ */ jsxs11("label", { children: [
          "Email",
          /* @__PURE__ */ jsx14("input", { type: "email", required: true, value: email, onChange: (e) => Email(e.target.value), autoComplete: "username" })
        ] }),
        /* @__PURE__ */ jsxs11("label", { children: [
          "Password",
          /* @__PURE__ */ jsx14("input", { type: "password", minLength: 10, required: true, value: password, onChange: (e) => Password(e.target.value), autoComplete: data.setupRequired ? "new-password" : "current-password" })
        ] }),
        /* @__PURE__ */ jsx14("button", { className: "primary", disabled: busy, children: busy ? "Working\u2026" : data.setupRequired ? "Create local administrator" : "Sign in locally" })
      ] })
    ] }),
    data?.user && /* @__PURE__ */ jsxs11(Fragment9, { children: [
      /* @__PURE__ */ jsxs11("div", { className: "ops-toolbar", children: [
        /* @__PURE__ */ jsxs11("span", { children: [
          "Signed in as ",
          /* @__PURE__ */ jsx14("b", { children: data.user.name }),
          data.user.isAdmin ? " \xB7 Administrator" : ""
        ] }),
        /* @__PURE__ */ jsx14("button", { disabled: busy, onClick: () => run(() => accountRequest("logout", {})), children: "Sign out" })
      ] }),
      data.user.isAdmin && /* @__PURE__ */ jsxs11(Fragment9, { children: [
        /* @__PURE__ */ jsxs11("div", { className: "sectionhead", children: [
          /* @__PURE__ */ jsx14("h3", { children: "User management" }),
          /* @__PURE__ */ jsx14("button", { className: "primary", onClick: () => Edit({ name: "", email: "", password: "", role: "coordinator", isAdmin: false, active: true }), children: "\uFF0B Add user" })
        ] }),
        data.users.map((p) => /* @__PURE__ */ jsxs11("div", { className: "user-row", children: [
          /* @__PURE__ */ jsx14(ProfileAvatar, { id: p.id }),
          /* @__PURE__ */ jsxs11("div", { children: [
            /* @__PURE__ */ jsx14("b", { children: p.name }),
            /* @__PURE__ */ jsxs11("small", { className: "block", children: [
              p.email,
              " \xB7 ",
              p.role,
              p.isAdmin ? " \xB7 Admin" : "",
              " \xB7 ",
              p.active ? "Active" : "Deactivated"
            ] })
          ] }),
          /* @__PURE__ */ jsxs11("div", { className: "ops-actions", children: [
            /* @__PURE__ */ jsx14("button", { disabled: busy, onClick: () => Edit({ ...p, password: "" }), children: "Edit" }),
            /* @__PURE__ */ jsx14("button", { disabled: busy, onClick: () => {
              if (confirm(p.active ? "Deactivate this account and revoke its sessions?" : "Restore this local account?")) run(() => accountRequest("users", { ...p, active: !p.active }));
            }, children: p.active ? "Deactivate" : "Restore" })
          ] })
        ] }, p.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx14("h3", { children: "My profile photo" }),
    /* @__PURE__ */ jsxs11("div", { className: "profile-photo-control", children: [
      /* @__PURE__ */ jsx14(ProfileAvatar, { id: user().id }),
      /* @__PURE__ */ jsxs11("label", { children: [
        "Upload PNG, JPEG or WebP",
        /* @__PURE__ */ jsx14("input", { type: "file", accept: "image/png,image/jpeg,image/webp", disabled: busy, onChange: async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          B(true);
          E("");
          try {
            if (f.size > 5 * 1024 * 1024) throw Error("Choose an image under 5 MB");
            if (data?.user) {
              const r = await fetch("/__local/photo", { method: "POST", credentials: "same-origin", headers: { "Content-Type": f.type }, body: f });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
            } else {
              const id = await addAsset(f, { category: "Profile photo" });
              mutate((s2) => {
                s2.preferences[user().id] ||= {};
                s2.preferences[user().id].avatar = id;
              });
            }
            window.dispatchEvent(new Event("wam-profile"));
            E("Profile photo saved locally");
          } catch (e2) {
            E(e2.message);
          } finally {
            B(false);
            e.target.value = "";
          }
        } })
      ] })
    ] }),
    draft && /* @__PURE__ */ jsx14("div", { className: "overlay", children: /* @__PURE__ */ jsxs11("form", { className: "modal", role: "dialog", "aria-modal": "true", onSubmit: (e) => {
      e.preventDefault();
      run(async () => {
        await accountRequest("users", draft);
        Edit(null);
      });
    }, children: [
      /* @__PURE__ */ jsx14("h2", { children: draft.id ? "Edit user" : "Add local user" }),
      /* @__PURE__ */ jsxs11("label", { children: [
        "Name",
        /* @__PURE__ */ jsx14("input", { required: true, value: draft.name, onChange: (e) => Edit({ ...draft, name: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs11("label", { children: [
        "Email",
        /* @__PURE__ */ jsx14("input", { required: true, type: "email", value: draft.email, onChange: (e) => Edit({ ...draft, email: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs11("label", { children: [
        draft.id ? "New password (leave blank to keep)" : "Initial password",
        /* @__PURE__ */ jsx14("input", { type: "password", required: !draft.id, minLength: draft.password ? 10 : void 0, autoComplete: "new-password", value: draft.password, onChange: (e) => Edit({ ...draft, password: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs11("label", { children: [
        "Role",
        /* @__PURE__ */ jsxs11("select", { value: draft.role, onChange: (e) => Edit({ ...draft, role: e.target.value }), children: [
          /* @__PURE__ */ jsx14("option", { value: "owner", children: "Marketing lead" }),
          /* @__PURE__ */ jsx14("option", { value: "coordinator", children: "Media coordinator" }),
          /* @__PURE__ */ jsx14("option", { value: "executive", children: "Executive reviewer" }),
          /* @__PURE__ */ jsx14("option", { value: "viewer", children: "Viewer" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("label", { className: "ops-taskline", children: [
        /* @__PURE__ */ jsx14("input", { type: "checkbox", checked: draft.isAdmin, onChange: (e) => Edit({ ...draft, isAdmin: e.target.checked }) }),
        "Manage local accounts"
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "modalactions", children: [
        /* @__PURE__ */ jsx14("button", { type: "button", onClick: () => Edit(null), children: "Cancel" }),
        /* @__PURE__ */ jsx14("button", { className: "primary", disabled: busy, children: "Save user" })
      ] }),
      error && /* @__PURE__ */ jsx14("p", { role: "alert", children: error })
    ] }) })
  ] });
}

// app/preview-admin.tsx
import { useState as useState12 } from "react";
import { Fragment as Fragment10, jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
function PreviewAdmin() {
  const s = useWorkspace(), [quote, Q] = useState12(""), [author, A] = useState12(""), [date, D] = useState12(chicagoDate()), [edit, E] = useState12(null), [error, Error2] = useState12("");
  const admin = user().role === "owner" || user().isAdmin;
  return /* @__PURE__ */ jsxs12(Fragment10, { children: [
    /* @__PURE__ */ jsx15(LocalAccounts, {}),
    /* @__PURE__ */ jsxs12("section", { className: "card panel", children: [
      /* @__PURE__ */ jsx15("h2", { children: "Preview identity" }),
      /* @__PURE__ */ jsxs12("label", { children: [
        "View the demo as",
        /* @__PURE__ */ jsx15("select", { "aria-label": "Preview identity", disabled: !!sessionStorage.getItem("wam-local-auth"), value: user().id, onChange: (e) => setUser(e.target.value), children: people.map((p) => /* @__PURE__ */ jsxs12("option", { value: p.id, children: [
          p.name,
          " \xB7 Demo"
        ] }, p.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx15("p", { className: "notice", children: "Preview identities simulate roles in one browser. They are not secure production accounts. Private conversation filtering is demonstrated in the interface; browser storage is accessible to the device owner. Local account passwords are stored as hashes on this computer. Production authentication and invitations remain disconnected." }),
    /* @__PURE__ */ jsxs12("div", { className: "twocol", children: [
      /* @__PURE__ */ jsxs12("section", { className: "card panel", children: [
        /* @__PURE__ */ jsx15("h2", { children: "People & roles" }),
        people.map((p) => /* @__PURE__ */ jsxs12("div", { className: "report-row", children: [
          /* @__PURE__ */ jsx15("b", { children: p.name }),
          /* @__PURE__ */ jsx15("span", { children: p.role === "owner" ? "Marketing lead" : p.role === "coordinator" ? "Media coordinator" : "Executive reviewer" })
        ] }, p.id)),
        /* @__PURE__ */ jsx15("p", { children: "Switch demo identities above. Production identity and access configuration remain paused." }),
        /* @__PURE__ */ jsxs12("label", { children: [
          "In-app deadline & approval reminders",
          /* @__PURE__ */ jsx15("input", { type: "checkbox", checked: s.settings.notifications, disabled: !admin, onChange: (e) => mutate((s2) => s2.settings.notifications = e.target.checked) })
        ] }),
        /* @__PURE__ */ jsx15("button", { onClick: () => exportJSON({ ...s, messages: s.messages.filter((m) => s.conversations.some((c) => c.id === m.conversationId && c.members.includes(user().id))), conversations: s.conversations.filter((c) => c.members.includes(user().id)), personal: { [user().id]: s.personal[user().id] || [] } }, "walker-preview-workspace.json"), children: "Export metadata backup" }),
        /* @__PURE__ */ jsx15("p", { children: "Uploaded originals remain in this browser\u2019s file storage and are downloaded individually from Media Vault." })
      ] }),
      /* @__PURE__ */ jsxs12("section", { className: "card panel", children: [
        /* @__PURE__ */ jsx15("h2", { children: "Quote management" }),
        /* @__PURE__ */ jsxs12("form", { onSubmit: (e) => {
          e.preventDefault();
          if (!admin) return;
          mutate((s2) => {
            s2.quotes = s2.quotes.filter((q) => q.date !== date);
            s2.quotes.push({ text: quote, author, date });
          }, "Scheduled custom quote");
          Q("");
        }, children: [
          /* @__PURE__ */ jsxs12("label", { children: [
            "Quote",
            /* @__PURE__ */ jsx15("textarea", { required: true, value: quote, onChange: (e) => Q(e.target.value), disabled: !admin })
          ] }),
          /* @__PURE__ */ jsxs12("label", { children: [
            "Author / attribution",
            /* @__PURE__ */ jsx15("input", { value: author, onChange: (e) => A(e.target.value), disabled: !admin })
          ] }),
          /* @__PURE__ */ jsxs12("label", { children: [
            "Scheduled day",
            /* @__PURE__ */ jsx15("input", { type: "date", required: true, value: date, onChange: (e) => D(e.target.value), disabled: !admin })
          ] }),
          /* @__PURE__ */ jsx15("button", { className: "primary", disabled: !admin, children: "Save scheduled quote" })
        ] }),
        s.quotes.map((q) => /* @__PURE__ */ jsxs12("div", { className: "comment", children: [
          /* @__PURE__ */ jsx15("b", { children: q.date }),
          /* @__PURE__ */ jsx15("p", { children: q.text }),
          /* @__PURE__ */ jsx15("small", { children: q.author }),
          /* @__PURE__ */ jsxs12("div", { className: "ops-actions", children: [
            /* @__PURE__ */ jsx15("button", { disabled: !admin, onClick: () => {
              Q(q.text);
              A(q.author);
              D(q.date);
            }, children: "Edit" }),
            /* @__PURE__ */ jsx15("button", { disabled: !admin, onClick: () => {
              if (confirm("Remove this custom quote?")) mutate((s2) => s2.quotes = s2.quotes.filter((x) => x.date !== q.date));
            }, children: "Remove" })
          ] })
        ] }, q.date))
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("section", { className: "card panel", children: [
      /* @__PURE__ */ jsx15("h2", { children: "Configuration" }),
      [["categories", "Campaign categories"], ["assetTypes", "Asset types"], ["statuses", "Workflow statuses"]].map(([key2, label]) => /* @__PURE__ */ jsxs12("label", { children: [
        label,
        /* @__PURE__ */ jsx15("input", { disabled: !admin, defaultValue: s.settings[key2].join(", "), onBlur: (e) => {
          const values = e.target.value.split(",").map((x) => x.trim()).filter(Boolean);
          if (values.length) mutate((s2) => s2.settings[key2] = values);
        } }),
        /* @__PURE__ */ jsx15("small", { children: "Comma-separated. Changes save when leaving the field." })
      ] }, key2))
    ] }),
    /* @__PURE__ */ jsxs12("section", { className: "card panel", children: [
      /* @__PURE__ */ jsxs12("div", { className: "sectionhead", children: [
        /* @__PURE__ */ jsx15("h2", { children: "Location directory & branding" }),
        /* @__PURE__ */ jsx15("button", { disabled: !admin, onClick: () => E({ kind: "dealership", title: "", status: "Active" }), children: "\uFF0B Add confirmed location" })
      ] }),
      s.records.filter((r) => r.kind === "dealership").map((r) => /* @__PURE__ */ jsxs12("div", { className: "report-row", children: [
        /* @__PURE__ */ jsxs12("div", { children: [
          /* @__PURE__ */ jsx15("b", { children: r.title }),
          /* @__PURE__ */ jsx15("small", { className: "block", children: r.address })
        ] }),
        /* @__PURE__ */ jsx15("button", { disabled: !admin, onClick: () => E(r), children: "Edit location" })
      ] }, r.id))
    ] }),
    edit && /* @__PURE__ */ jsx15(RecordEditor, { record: edit, onClose: () => E(null) })
  ] });
}
function RoleOverview({ onGo, onReview }) {
  const s = useWorkspace(), me = user(), active = s.records.filter((r) => !r.archived), videos = active.filter((r) => r.kind === "video"), notes = s.annotations.filter((a) => a.status !== "Resolved"), reviews = active.filter((r) => r.status === "Review" || r.status === "Revision" || r.versions?.some((v) => v.status === "Submitted for Review"));
  return /* @__PURE__ */ jsxs12("details", { className: "card panel role-overview", children: [
    /* @__PURE__ */ jsx15("summary", { className: "priorities-toggle", children: /* @__PURE__ */ jsxs12("div", { children: [
      /* @__PURE__ */ jsx15("span", { className: "eyebrow", children: me.role === "executive" ? "EXECUTIVE REVIEW INBOX" : me.role === "coordinator" ? "YOUR PRODUCTION DESK" : "MARKETING COMMAND CENTER" }),
      /* @__PURE__ */ jsxs12("h2", { children: [
        me.name,
        "\u2019s priorities"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs12("div", { className: "ops-actions", children: [
      /* @__PURE__ */ jsx15("button", { onClick: () => onGo("Campaigns"), children: "\uFF0B Campaign" }),
      /* @__PURE__ */ jsx15("button", { onClick: () => onGo("Video production"), children: "\uFF0B Video project" }),
      /* @__PURE__ */ jsx15("button", { onClick: () => onGo("Media Vault"), children: "Upload assets" }),
      /* @__PURE__ */ jsx15("button", { onClick: () => onGo("Content Calendar"), children: "Plan content" }),
      /* @__PURE__ */ jsx15("button", { onClick: () => onGo(me.role === "executive" ? "Video review" : "Tasks"), children: "Open workspace \u2192" })
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: "priority-sections", children: [
      /* @__PURE__ */ jsxs12("details", { className: "priority-section", children: [
        /* @__PURE__ */ jsx15("summary", { children: "Upcoming deadlines" }),
        /* @__PURE__ */ jsx15("div", { className: "priority-list", children: active.filter((r) => r.date && r.date >= chicagoDate() && r.kind !== "system").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((r) => /* @__PURE__ */ jsxs12("p", { children: [
          /* @__PURE__ */ jsx15("b", { children: r.date }),
          " \xB7 ",
          r.title,
          /* @__PURE__ */ jsxs12("small", { className: "block", children: [
            r.owner || "Unassigned",
            " \xB7 ",
            r.status
          ] })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxs12("details", { className: "priority-section", children: [
        /* @__PURE__ */ jsx15("summary", { children: me.role === "coordinator" ? "Videos to work on" : "Ready for your review" }),
        /* @__PURE__ */ jsxs12("div", { className: "priority-list", children: [
          (me.role === "coordinator" ? videos : reviews).slice(0, 4).map((r) => /* @__PURE__ */ jsxs12("button", { className: "agenda-item", onClick: () => r.kind === "video" ? onReview(r.id) : onGo("Campaigns"), children: [
            /* @__PURE__ */ jsx15("b", { children: r.title }),
            /* @__PURE__ */ jsxs12("small", { children: [
              r.status,
              " \xB7 ",
              r.date || "Date not set"
            ] })
          ] }, r.id)),
          !(me.role === "coordinator" ? videos : reviews).length && /* @__PURE__ */ jsx15("p", { className: "priority-empty", children: "Nothing waiting here." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs12("details", { className: "priority-section", children: [
        /* @__PURE__ */ jsx15("summary", { children: "Changes requested" }),
        /* @__PURE__ */ jsxs12("div", { className: "priority-list", children: [
          notes.slice(0, 5).map((a) => /* @__PURE__ */ jsxs12("button", { className: "agenda-item", onClick: () => {
            sessionStorage.setItem("wam-seek", JSON.stringify({ ...a, time: a.start }));
            onReview(a.videoId);
          }, children: [
            /* @__PURE__ */ jsxs12("b", { children: [
              a.type,
              ": ",
              a.text
            ] }),
            /* @__PURE__ */ jsxs12("small", { children: [
              a.status,
              " \xB7 Travis \xB7 ",
              a.author
            ] })
          ] }, a.id)),
          !notes.length && /* @__PURE__ */ jsx15("p", { children: "No changes requested." })
        ] })
      ] })
    ] })
  ] });
}

// app/messenger-inbox.tsx
import { createPortal } from "react-dom";
import { useState as useState13, useEffect as useEffect7, useRef as useRef6 } from "react";

// components/ui/textarea.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx16(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}

// components/ui/bubble.tsx
import { cva as cva2 } from "class-variance-authority";
import { Slot as Slot2 } from "radix-ui";
import { jsx as jsx17 } from "react/jsx-runtime";
var bubbleVariants = cva2(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default: "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary: "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted: "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted: "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline: "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost: "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive: "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx17(
    "div",
    {
      "data-slot": "bubble",
      "data-variant": variant,
      "data-align": align,
      className: cn(bubbleVariants({ variant }), className),
      ...props
    }
  );
}
function BubbleContent({
  asChild = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "div";
  return /* @__PURE__ */ jsx17(
    Comp,
    {
      "data-slot": "bubble-content",
      className: cn(
        "w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
        className
      ),
      ...props
    }
  );
}
var bubbleReactionsVariants = cva2(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4"
      },
      align: {
        start: "left-3",
        end: "right-3"
      }
    },
    defaultVariants: {
      side: "bottom",
      align: "end"
    }
  }
);

// app/messenger-inbox.tsx
import { Dialog } from "radix-ui";
import { ArrowLeft, Maximize2, MessageCircle, Paperclip as Paperclip2, FolderOpen, Send, Search, X as X2, PenSquare, Users } from "lucide-react";
import { Fragment as Fragment11, jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
function MessengerInbox({ active = true, floating = false, onClose, onExpand, onUnread = () => {
} }) {
  const s = useWorkspace(), me = user(), [cid, C] = useState13("team"), [list, List] = useState13(false), [newDM, DM] = useState13(false), [query, Q] = useState13(""), [search, S] = useState13(""), [text, T] = useState13(""), [reply, R] = useState13(null), [editing, Edit] = useState13(""), [files, F] = useState13([]), [assets, A] = useState13([]), [picker, Pick] = useState13(false), [busy, B] = useState13(false), [error, E] = useState13("");
  const fileInput = useRef6(null), end = useRef6(null), uploaded = useRef6(/* @__PURE__ */ new Map());
  const [pop, Pop] = useState13(null);
  useEffect7(() => () => {
    pop?.close();
  }, [pop]);
  const visible = active || floating || !!pop;
  const allowed = s.conversations.filter((c) => (c.id === "team" || c.type === "Direct") && c.members.includes(me.id)), current = allowed.find((c) => c.id === cid) || allowed[0];
  const messages = current ? s.messages.filter((m) => !m.archived && m.conversationId === current.id && (!search || m.text?.toLowerCase().includes(search.toLowerCase()))) : [];
  const label = (c) => c.id === "team" ? "COLLAB chat" : c.members.filter((id) => id !== me.id).map((id) => people.find((p) => p.id === id)?.name || "Team member").join(", ");
  useEffect7(() => {
    ensureTeamChat();
  }, [me.id, people.length]);
  useEffect7(() => {
    onUnread(s.messages.filter((m) => !m.archived && allowed.some((c) => c.id === m.conversationId) && m.sender_id !== me.id && m.created_at > (s.read[me.id + m.conversationId] || "")).length);
  }, [s.messages.length, me.id, current?.id, s.read[me.id + (current?.id || "")]]);
  useEffect7(() => {
    if (visible && current && !list) {
      const last = s.messages.filter((m) => m.conversationId === current.id && !m.archived).at(-1)?.created_at;
      if (last && s.read[me.id + current.id] !== last) mutate((s2) => s2.read[me.id + current.id] = last);
    }
    end.current?.scrollIntoView({ block: "nearest" });
  }, [visible, current?.id, s.messages.length, list]);
  if (!visible) return null;
  async function popOut() {
    try {
      if (pop && !pop.closed) {
        pop.focus();
        return;
      }
      const api = window.documentPictureInPicture;
      const w = api ? await api.requestWindow({ width: 460, height: 650 }) : window.open("", "wam-collab-chat", "popup=yes,width=460,height=650");
      if (!w) throw Error("Allow pop-ups to open COLLAB chat");
      w.document.title = "COLLAB chat";
      w.document.body.style.margin = "0";
      document.querySelectorAll('style,link[rel="stylesheet"]').forEach((el) => w.document.head.appendChild(el.cloneNode(true)));
      const host = w.document.createElement("div");
      host.id = "collab-popout";
      const app = (pop?.document || document).querySelector(".app");
      host.className = (app?.className || "app") + " chat-window-root";
      if (app) host.setAttribute("style", app.getAttribute("style") || "");
      w.document.body.replaceChildren(host);
      w.addEventListener("pagehide", () => Pop(null), { once: true });
      Pop(w);
      if (!api) E("Separate chat window opened. Always-on-top is available in browsers supporting Picture-in-Picture.");
    } catch (e) {
      E(e.message);
    }
  }
  function open(id) {
    C(id);
    List(false);
    R(null);
    Edit("");
    T("");
    F([]);
    A([]);
    E("");
    DM(false);
  }
  async function send(e) {
    e.preventDefault();
    if (!current) return;
    B(true);
    E("");
    const failed = [];
    let failures = [];
    try {
      conversation(current.id);
      if (editing) {
        if (!text.trim()) throw Error("Enter message text");
        mutate((s2) => {
          const m = s2.messages.find((m2) => m2.id === editing && m2.conversationId === current.id && m2.sender_id === me.id);
          if (!m) throw Error("Only the sender can edit this message");
          m.text = text;
          m.edited = true;
        });
        Edit("");
        T("");
        return;
      }
      const ids = [...assets];
      for (const file of files) {
        try {
          let id = uploaded.current.get(file);
          if (!id) {
            id = await addAsset(file, { privateConversation: current.id, chatUploadPending: true, uploadedBy: me.name });
            uploaded.current.set(file, id);
          }
          ids.push(id);
        } catch (e2) {
          failed.push(file);
          failures.push(file.name + ": " + e2.message);
        }
      }
      if (!text.trim() && !ids.length) throw Error(failures.join(" \xB7 ") || "Write a message or attach media");
      sendChatMedia(current.id, { text, assetIds: ids, replyTo: reply?.id });
      T("");
      F(failed);
      A([]);
      R(null);
      if (failures.length) E("Message sent with available files. Retry: " + failures.join(" \xB7 "));
    } catch (e2) {
      E(e2.message);
    } finally {
      B(false);
    }
  }
  const conversationList = /* @__PURE__ */ jsxs13("div", { className: "inbox-conversations", children: [
    /* @__PURE__ */ jsxs13("div", { className: "inbox-list-title", children: [
      /* @__PURE__ */ jsx18("h2", { children: "Chats" }),
      /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", "aria-label": "New direct message", onClick: () => {
        DM(!newDM);
        Q("");
      }, children: /* @__PURE__ */ jsx18(PenSquare, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "inbox-search", children: [
      /* @__PURE__ */ jsx18(Search, { size: 15 }),
      /* @__PURE__ */ jsx18(Input, { "aria-label": "Search people and chats", placeholder: newDM ? "Choose a person\u2026" : "Search chats\u2026", value: query, onChange: (e) => Q(e.target.value) })
    ] }),
    newDM ? /* @__PURE__ */ jsxs13(Fragment11, { children: [
      /* @__PURE__ */ jsx18("small", { className: "inbox-hint", children: "New direct message" }),
      people.filter((p) => p.id !== me.id && p.active !== false && p.name.toLowerCase().includes(query.toLowerCase())).map((p) => /* @__PURE__ */ jsxs13(Button, { variant: "ghost", className: "chat-row", onClick: () => {
        try {
          open(directChat(p.id));
        } catch (e) {
          E(e.message);
        }
      }, children: [
        /* @__PURE__ */ jsx18(ProfileAvatar, { id: p.id }),
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx18("b", { children: p.name }),
          /* @__PURE__ */ jsx18("small", { children: p.role === "executive" ? "Executive reviewer" : p.role === "owner" ? "Marketing lead" : "Team member" })
        ] })
      ] }, p.id))
    ] }) : allowed.filter((c) => label(c).toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.id === "team" ? -1 : b.id === "team" ? 1 : 0).map((c) => {
      const last = s.messages.filter((m) => m.conversationId === c.id && !m.archived).at(-1), unread = s.messages.filter((m) => m.conversationId === c.id && !m.archived && m.sender_id !== me.id && m.created_at > (s.read[me.id + c.id] || "")).length;
      return /* @__PURE__ */ jsxs13(Button, { variant: "ghost", className: "chat-row " + (current?.id === c.id ? "current" : ""), onClick: () => open(c.id), children: [
        c.id === "team" ? /* @__PURE__ */ jsx18("span", { className: "team-chat-avatar", children: /* @__PURE__ */ jsx18(Users, { size: 22 }) }) : /* @__PURE__ */ jsx18(ProfileAvatar, { id: c.members.find((id) => id !== me.id) }),
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx18("b", { children: label(c) }),
          /* @__PURE__ */ jsx18("small", { children: last?.text || (last?.attachments?.length || last?.attachment_id ? "Shared media" : c.id === "team" ? "One shared team conversation" : "Start a conversation") })
        ] }),
        unread > 0 && /* @__PURE__ */ jsx18("span", { className: "chat-unread", children: unread })
      ] }, c.id);
    }),
    /* @__PURE__ */ jsx18("small", { className: "inbox-hint", children: "Local preview \xB7 messages stay on this device" })
  ] });
  const panel = /* @__PURE__ */ jsxs13("section", { className: "team-messenger inbox-messenger " + (floating && !pop ? "messenger-popout" : "messenger-page") + (list ? " show-chat-list" : ""), "aria-label": "Messenger", children: [
    /* @__PURE__ */ jsxs13("div", { className: "inbox-top", children: [
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx18(MessageCircle, { size: 18 }),
        /* @__PURE__ */ jsx18("b", { children: "COLLAB chat" })
      ] }),
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", "aria-label": "Pop out COLLAB chat", title: "Pop out chat", onClick: popOut, children: /* @__PURE__ */ jsx18(Maximize2, { size: 17 }) }),
        onClose && /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", "aria-label": "Close Messenger", onClick: () => {
          if (pop) {
            pop.close();
            Pop(null);
          } else onClose?.();
        }, children: /* @__PURE__ */ jsx18(X2, { size: 18 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "inbox-layout", children: [
      conversationList,
      /* @__PURE__ */ jsx18("div", { className: "inbox-thread", children: current ? /* @__PURE__ */ jsxs13(Fragment11, { children: [
        /* @__PURE__ */ jsxs13("div", { className: "inbox-thread-head", children: [
          /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", className: "chat-back", "aria-label": "Show chats", onClick: () => List(true), children: /* @__PURE__ */ jsx18(ArrowLeft, { size: 19 }) }),
          current.id === "team" ? /* @__PURE__ */ jsx18("span", { className: "team-chat-avatar", children: /* @__PURE__ */ jsx18(Users, { size: 19 }) }) : /* @__PURE__ */ jsx18(ProfileAvatar, { id: current.members.find((id) => id !== me.id) }),
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx18("h3", { children: label(current) }),
            /* @__PURE__ */ jsx18("small", { children: current.id === "team" ? current.members.length + " team members" : "Private conversation" })
          ] }),
          /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", "aria-label": "New direct message", onClick: () => {
            List(true);
            DM(true);
          }, children: /* @__PURE__ */ jsx18(PenSquare, { size: 17 }) })
        ] }),
        /* @__PURE__ */ jsx18("div", { className: "inbox-thread-search", children: /* @__PURE__ */ jsx18(Input, { "aria-label": "Search messages", placeholder: "Search this chat\u2026", value: search, onChange: (e) => S(e.target.value) }) }),
        /* @__PURE__ */ jsxs13("div", { className: "inbox-messages", role: "log", "aria-label": "Messages", children: [
          messages.map((m) => {
            const ids = m.attachments || [m.attachment_id].filter(Boolean);
            return /* @__PURE__ */ jsxs13("article", { className: "message-row " + (m.sender_id === me.id ? "mine" : ""), "data-select-kind": "message", "data-select-id": m.id, children: [
              /* @__PURE__ */ jsxs13("small", { children: [
                m.sender_name,
                " \xB7 ",
                new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                m.edited ? " \xB7 edited" : ""
              ] }),
              m.replyTo && /* @__PURE__ */ jsxs13("small", { children: [
                "\u21B3 ",
                s.messages.find((x) => x.id === m.replyTo && x.conversationId === current.id)?.text || "Media reply"
              ] }),
              /* @__PURE__ */ jsx18(Bubble, { variant: "secondary", className: "suite-bubble", children: /* @__PURE__ */ jsxs13(BubbleContent, { children: [
                m.text && /* @__PURE__ */ jsx18("p", { children: m.text }),
                ids.map((id) => {
                  const a = s.records.find((r) => r.id === id);
                  return /* @__PURE__ */ jsxs13("div", { className: "chat-attachment", children: [
                    a && /* @__PURE__ */ jsx18(FilePreview, { id, type: a.type }),
                    /* @__PURE__ */ jsx18(Button, { variant: "ghost", onClick: async () => {
                      try {
                        const u = await fileURL(id);
                        if (u) window.open(u, "_blank");
                        else E("Original file is unavailable");
                      } catch (e) {
                        E(e.message);
                      }
                    }, children: a?.title || "Open attachment" }),
                    /* @__PURE__ */ jsxs13("small", { children: [
                      "Saved in Asset Room \xB7 ",
                      label(current)
                    ] })
                  ] }, id);
                }),
                m.annotation && /* @__PURE__ */ jsx18(Button, { variant: "ghost", onClick: () => {
                  sessionStorage.setItem("wam-seek", JSON.stringify(m.annotation));
                  window.dispatchEvent(new CustomEvent("wam-open-review", { detail: m.annotation }));
                  onClose?.();
                }, children: "\u25B6 Open video at marked time" })
              ] }) }),
              /* @__PURE__ */ jsxs13("div", { className: "inbox-message-actions", children: [
                /* @__PURE__ */ jsx18(Button, { variant: "ghost", onClick: () => R(m), children: "Reply" }),
                m.sender_id === me.id && /* @__PURE__ */ jsxs13(Fragment11, { children: [
                  /* @__PURE__ */ jsx18(Button, { variant: "ghost", onClick: () => {
                    Edit(m.id);
                    T(m.text || "");
                  }, children: "Edit" }),
                  /* @__PURE__ */ jsx18(Button, { variant: "ghost", onClick: () => {
                    if (confirm("Archive this message? Media originals will be preserved.")) mutate((s2) => s2.messages.find((x) => x.id === m.id).archived = true);
                  }, children: "Archive" })
                ] })
              ] })
            ] }, m.id);
          }),
          !messages.length && /* @__PURE__ */ jsxs13("div", { className: "inbox-empty", children: [
            /* @__PURE__ */ jsx18(MessageCircle, { size: 32 }),
            /* @__PURE__ */ jsx18("h3", { children: label(current) }),
            /* @__PURE__ */ jsx18("p", { children: "Start with a message, photo, video or a file from the Asset Room." })
          ] }),
          /* @__PURE__ */ jsx18("div", { ref: end })
        ] }),
        error && /* @__PURE__ */ jsx18("div", { className: "inbox-error", role: "alert", children: error }),
        /* @__PURE__ */ jsxs13("form", { className: "inbox-compose", onSubmit: send, children: [
          reply && /* @__PURE__ */ jsxs13("div", { className: "compose-context", children: [
            /* @__PURE__ */ jsxs13("small", { children: [
              "Reply to ",
              reply.sender_name,
              ": ",
              reply.text || "Media"
            ] }),
            /* @__PURE__ */ jsx18(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": "Cancel reply", onClick: () => R(null), children: /* @__PURE__ */ jsx18(X2, { size: 14 }) })
          ] }),
          editing && /* @__PURE__ */ jsxs13("div", { className: "compose-context", children: [
            /* @__PURE__ */ jsx18("small", { children: "Editing your message" }),
            /* @__PURE__ */ jsx18(Button, { type: "button", variant: "ghost", onClick: () => {
              Edit("");
              T("");
            }, children: "Cancel" })
          ] }),
          (files.length > 0 || assets.length > 0) && /* @__PURE__ */ jsxs13("div", { className: "chat-pending-files", children: [
            files.map((f, i) => /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx18("span", { children: f.name }),
              /* @__PURE__ */ jsx18(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": "Remove " + f.name, onClick: () => F(files.filter((_, j) => i !== j)), children: /* @__PURE__ */ jsx18(X2, { size: 13 }) })
            ] }, "file" + i)),
            assets.map((id) => /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx18("span", { children: s.records.find((r) => r.id === id)?.title }),
              /* @__PURE__ */ jsx18(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": "Remove selected asset", onClick: () => A(assets.filter((x) => x !== id)), children: /* @__PURE__ */ jsx18(X2, { size: 13 }) })
            ] }, id))
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "compose-input-row", children: [
            /* @__PURE__ */ jsx18(Textarea, { "aria-label": "Message", placeholder: "Message\u2026", rows: 2, maxLength: 4e3, value: text, onChange: (e) => T(e.target.value), onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (text.trim() || files.length || assets.length) e.currentTarget.form?.requestSubmit();
              }
            } }),
            /* @__PURE__ */ jsx18(Button, { type: "submit", className: "primary chat-send", size: "icon", "aria-label": editing ? "Save edited message" : "Send message", disabled: busy || !text.trim() && !files.length && !assets.length, children: /* @__PURE__ */ jsx18(Send, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "compose-tools", children: [
            /* @__PURE__ */ jsx18("input", { ref: fileInput, type: "file", multiple: true, hidden: true, onChange: (e) => {
              F([...files, ...Array.from(e.target.files || [])]);
              e.target.value = "";
            } }),
            /* @__PURE__ */ jsxs13(Button, { type: "button", variant: "ghost", disabled: busy || !!editing, onClick: () => fileInput.current?.click(), children: [
              /* @__PURE__ */ jsx18(Paperclip2, { size: 16 }),
              " Upload media"
            ] }),
            /* @__PURE__ */ jsxs13(Button, { type: "button", variant: "ghost", disabled: busy || !!editing, onClick: () => Pick(true), children: [
              /* @__PURE__ */ jsx18(FolderOpen, { size: 16 }),
              " Asset Room"
            ] }),
            /* @__PURE__ */ jsx18("small", { children: busy ? "Saving\u2026" : "Enter to send \xB7 Shift+Enter for a new line" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx18("div", { className: "inbox-empty", children: /* @__PURE__ */ jsx18("p", { children: "Choose a chat." }) }) })
    ] }),
    /* @__PURE__ */ jsx18(Dialog.Root, { open: picker, onOpenChange: Pick, children: /* @__PURE__ */ jsxs13(Dialog.Portal, { container: typeof document !== "undefined" ? document.querySelector(".app") : void 0, children: [
      /* @__PURE__ */ jsx18(Dialog.Overlay, { className: "crop-overlay" }),
      /* @__PURE__ */ jsxs13(Dialog.Content, { className: "crop-dialog chat-asset-dialog", children: [
        /* @__PURE__ */ jsxs13("div", { className: "crop-heading", children: [
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx18(Dialog.Title, { children: "Send from Asset Room" }),
            /* @__PURE__ */ jsx18(Dialog.Description, { children: "Select existing files. Originals are reused and linked to this chat." })
          ] }),
          /* @__PURE__ */ jsx18(Dialog.Close, { asChild: true, children: /* @__PURE__ */ jsx18(Button, { variant: "ghost", size: "icon", "aria-label": "Close asset picker", children: /* @__PURE__ */ jsx18(X2, { size: 18 }) }) })
        ] }),
        /* @__PURE__ */ jsx18(AssetPicker, { selected: assets, onChange: A }),
        /* @__PURE__ */ jsx18("div", { className: "crop-actions", children: /* @__PURE__ */ jsx18(Dialog.Close, { asChild: true, children: /* @__PURE__ */ jsxs13(Button, { children: [
          "Done \xB7 ",
          assets.length,
          " selected"
        ] }) }) })
      ] })
    ] }) })
  ] });
  return pop && !pop.closed ? createPortal(panel, pop.document.getElementById("collab-popout")) : panel;
}
function AssetPicker({ selected, onChange }) {
  const s = useWorkspace(), [q, Q] = useState13("");
  const assets = s.records.filter((a) => a.kind === "asset" && !a.archived && canAccessAsset(a, s) && a.title.toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ jsxs13(Fragment11, { children: [
    /* @__PURE__ */ jsx18(Input, { "aria-label": "Search Asset Room files", placeholder: "Search files\u2026", value: q, onChange: (e) => Q(e.target.value) }),
    /* @__PURE__ */ jsxs13("div", { className: "chat-asset-picker", children: [
      assets.map((a) => /* @__PURE__ */ jsxs13("label", { children: [
        /* @__PURE__ */ jsx18("input", { type: "checkbox", checked: selected.includes(a.id), onChange: (e) => onChange(e.target.checked ? [...selected, a.id] : selected.filter((id) => id !== a.id)) }),
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx18("b", { children: a.title }),
          /* @__PURE__ */ jsxs13("small", { children: [
            a.type,
            " \xB7 ",
            a.chatOrigins?.length ? "Previously shared in chat" : "Asset Room"
          ] })
        ] })
      ] }, a.id)),
      !assets.length && /* @__PURE__ */ jsx18("p", { children: "No matching files. Use Upload media to add files from your device." })
    ] })
  ] });
}

// app/theme-workbench.tsx
import { useState as useState15, useEffect as useEffect9 } from "react";

// app/theme-studio.tsx
import { useState as useState14, useEffect as useEffect8 } from "react";
import { Fragment as Fragment12, jsx as jsx19, jsxs as jsxs14 } from "react/jsx-runtime";

// app/theme-workbench.tsx
import { Fragment as Fragment13, jsx as jsx20, jsxs as jsxs15 } from "react/jsx-runtime";
var colorGroups = [["Surfaces", ["pageBg", "cardBg", "headerBg", "sidebarBg", "inputBg"]], ["Text & links", ["bodyText", "headingText", "mutedText", "linkText", "inputText", "sidebarText", "headerText"]], ["Buttons, borders & highlights", ["buttonBg", "buttonText", "primaryBg", "primaryText", "borderColor", "highlight"]]];
function ThemeWorkbench({ preferences, onSave }) {
  const [draft, D] = useState15(preferences), [message2, M] = useState15(""), [presetName, P] = useState15(""), [busy, B] = useState15(false);
  const s = useWorkspace(), colors = appearance(draft);
  const patch = (p) => D((d) => ({ ...d, ...p }));
  useEffect9(() => {
    window.dispatchEvent(new CustomEvent("wam-theme-preview", { detail: draft }));
  }, [draft]);
  useEffect9(() => {
    const mode = (e) => D(e.detail);
    window.addEventListener("wam-theme-mode", mode);
    return () => {
      window.removeEventListener("wam-theme-mode", mode);
      window.dispatchEvent(new CustomEvent("wam-theme-preview", { detail: getState().preferences[user().id] || defaultTheme(user().id) }));
    };
  }, []);
  function preset(name, value) {
    D({ ...draft, ...structuredClone(value), presetName: name, appearance: { ...value.appearance } });
    M(name + " selected \u2014 previewing now");
  }
  async function save(asPreset = false) {
    B(true);
    M("");
    try {
      if (asPreset && !presetName.trim()) throw Error("Enter a name for your custom preset");
      if (await onSave({ action: "preferences", preferences: draft })) {
        if (asPreset) {
          mutate((s2) => {
            s2.themePresets ||= {};
            s2.themePresets[presetName.trim()] = draft;
          });
          P("");
        }
        M(asPreset ? "Custom preset and appearance saved" : "Appearance saved");
      }
    } catch (e) {
      M(e.message);
    } finally {
      B(false);
    }
  }
  const pairs = [["Body text", colors.bodyText, colors.cardBg], ["Page text", colors.pageText, colors.pageBg], ["Secondary text", colors.mutedText, colors.cardBg], ["Sidebar", colors.sidebarText, colors.sidebarBg], ["Header", colors.headerText, colors.headerBg], ["Inputs", colors.inputText, colors.inputBg], ["Buttons", colors.buttonText, colors.buttonBg], ["Primary action", colors.primaryText, colors.primaryBg]];
  return /* @__PURE__ */ jsxs15("div", { className: "theme-workbench", children: [
    /* @__PURE__ */ jsxs15("div", { className: "theme-intro", children: [
      /* @__PURE__ */ jsx20("h2", { children: "Your workspace, your way." }),
      /* @__PURE__ */ jsx20("p", { children: "Choose a template, then open only the settings you need. Changes preview immediately." })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", open: true, children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "01" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Theme templates" }),
          /* @__PURE__ */ jsx20("small", { children: "Walker, McKenzie, Travis, neutral and dark options" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-section-body", children: [
        /* @__PURE__ */ jsx20("div", { className: "theme-template-grid", children: Object.entries(themePresets).map(([name, p]) => {
          const c = appearance(p);
          return /* @__PURE__ */ jsxs15("button", { className: "theme-template", "aria-pressed": draft.presetName === name, onClick: () => preset(name, p), children: [
            /* @__PURE__ */ jsxs15("div", { className: "theme-mini", style: { background: c.pageBg }, children: [
              /* @__PURE__ */ jsx20("i", { style: { background: c.sidebarBg } }),
              /* @__PURE__ */ jsxs15("div", { style: { background: c.cardBg }, children: [
                /* @__PURE__ */ jsx20("span", { style: { background: c.primaryBg } }),
                /* @__PURE__ */ jsx20("hr", { style: { borderColor: c.bodyText } }),
                /* @__PURE__ */ jsx20("hr", { style: { borderColor: c.mutedText } })
              ] })
            ] }),
            /* @__PURE__ */ jsx20("b", { children: name }),
            /* @__PURE__ */ jsxs15("small", { children: [
              p.theme === "dark" ? "Dark" : "Light",
              " \xB7 ",
              /* @__PURE__ */ jsx20("span", { style: { color: c.primaryBg }, children: "\u25CF" })
            ] })
          ] }, name);
        }) }),
        !!Object.keys(s.themePresets || {}).length && /* @__PURE__ */ jsxs15(Fragment13, { children: [
          /* @__PURE__ */ jsx20("h3", { children: "Saved custom presets" }),
          /* @__PURE__ */ jsx20("div", { className: "saved-presets", children: Object.entries(s.themePresets || {}).map(([name, p]) => /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx20("button", { onClick: () => preset(name, p), children: name }),
            /* @__PURE__ */ jsx20("button", { "aria-label": "Remove " + name, onClick: () => {
              if (confirm("Remove this saved preset?")) mutate((s2) => delete s2.themePresets[name]);
            }, children: "\xD7" })
          ] }, name)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "02" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Appearance & typography" }),
          /* @__PURE__ */ jsx20("small", { children: "Light/dark, font, accent and corners" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-section-body theme-fields", children: [
        /* @__PURE__ */ jsxs15("label", { children: [
          "Appearance",
          /* @__PURE__ */ jsxs15("select", { value: draft.theme || "light", onChange: (e) => patch({ theme: e.target.value, appearance: {}, presetName: "" }), children: [
            /* @__PURE__ */ jsx20("option", { value: "light", children: "Light" }),
            /* @__PURE__ */ jsx20("option", { value: "dark", children: "Dark" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs15("label", { children: [
          "Typography",
          /* @__PURE__ */ jsxs15("select", { value: draft.font || "Arial, Helvetica, sans-serif", onChange: (e) => patch({ font: e.target.value }), children: [
            /* @__PURE__ */ jsx20("option", { value: "Arial, Helvetica, sans-serif", children: "Walker \xB7 Arial" }),
            /* @__PURE__ */ jsx20("option", { value: "'Segoe UI', sans-serif", children: "Segoe UI" }),
            /* @__PURE__ */ jsx20("option", { value: "Verdana, sans-serif", children: "Verdana" }),
            /* @__PURE__ */ jsx20("option", { value: "Georgia, serif", children: "Georgia" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs15("label", { children: [
          "Accent",
          /* @__PURE__ */ jsx20("input", { type: "color", value: draft.accent || "#c81927", onChange: (e) => patch({ accent: e.target.value, appearance: { ...draft.appearance, primaryBg: e.target.value, highlight: e.target.value }, presetName: "" }) })
        ] }),
        /* @__PURE__ */ jsxs15("label", { children: [
          "Corners \xB7 ",
          draft.radius ?? 9,
          "px",
          /* @__PURE__ */ jsx20("input", { type: "range", min: "0", max: "22", value: draft.radius ?? 9, onChange: (e) => patch({ radius: +e.target.value }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "03" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Colors by category" }),
          /* @__PURE__ */ jsx20("small", { children: "Surfaces, readable text, navigation and controls" })
        ] })
      ] }),
      /* @__PURE__ */ jsx20("div", { className: "theme-section-body", children: colorGroups.map(([name, keys]) => /* @__PURE__ */ jsxs15("details", { className: "theme-subsection", children: [
        /* @__PURE__ */ jsx20("summary", { children: name }),
        /* @__PURE__ */ jsx20("div", { className: "theme-fields", children: keys.map((key2) => /* @__PURE__ */ jsxs15("label", { children: [
          appearanceFields.find(([k]) => k === key2)?.[1],
          /* @__PURE__ */ jsxs15("div", { className: "color-editor-control", children: [
            /* @__PURE__ */ jsx20("input", { "aria-label": key2 + " color", type: "color", value: draft.appearance?.[key2] || colors[key2], onChange: (e) => patch({ appearance: { ...draft.appearance, [key2]: e.target.value }, presetName: "" }) }),
            /* @__PURE__ */ jsx20("input", { "aria-label": key2 + " hex", value: draft.appearance?.[key2] || colors[key2], maxLength: 7, onChange: (e) => {
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) patch({ appearance: { ...draft.appearance, [key2]: e.target.value }, presetName: "" });
            } })
          ] })
        ] }, key2)) })
      ] }, name)) })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "04" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Logo & branding" }),
          /* @__PURE__ */ jsx20("small", { children: "Walker default or a custom workspace logo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-section-body", children: [
        /* @__PURE__ */ jsxs15("label", { children: [
          "Upload logo",
          /* @__PURE__ */ jsx20("input", { type: "file", accept: "image/png,image/jpeg,image/webp", onChange: async (e) => {
            const file = e.target.files?.[0];
            if (file) try {
              patch({ logo: await addAsset(file, { category: "Branding" }) });
            } catch (e2) {
              M(e2.message);
            }
          } })
        ] }),
        draft.logo ? /* @__PURE__ */ jsxs15(Fragment13, { children: [
          /* @__PURE__ */ jsx20(FilePreview, { id: draft.logo, type: "image/" }),
          /* @__PURE__ */ jsx20("button", { onClick: () => patch({ logo: "" }), children: "Restore Walker logo" })
        ] }) : /* @__PURE__ */ jsx20("img", { className: "theme-logo-preview", src: "/walker-suite-logo.png", alt: "Walker Automotive logo" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "05" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Dashboard artwork" }),
          /* @__PURE__ */ jsx20("small", { children: "Personal hero images and the Walker graphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-section-body", children: [
        /* @__PURE__ */ jsxs15("label", { children: [
          "Add photo",
          /* @__PURE__ */ jsx20("input", { type: "file", accept: "image/*", onChange: async (e) => {
            const file = e.target.files?.[0];
            if (file) try {
              patch({ heroImages: [...draft.heroImages || [], await addAsset(file, { category: "Branding" })] });
            } catch (e2) {
              M(e2.message);
            }
          } })
        ] }),
        /* @__PURE__ */ jsx20("div", { className: "theme-photo-grid", children: (draft.heroImages || []).map((id) => /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20(FilePreview, { id, type: "image/" }),
          /* @__PURE__ */ jsx20("button", { onClick: () => patch({ heroImages: draft.heroImages.filter((x) => x !== id) }), children: "Remove image" })
        ] }, id)) }),
        /* @__PURE__ */ jsx20("p", { children: !draft.heroImages?.length ? "Using the Walker seasonal graphic." : "Photos remain private to this browser profile." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("details", { className: "theme-section", children: [
      /* @__PURE__ */ jsxs15("summary", { children: [
        /* @__PURE__ */ jsx20("span", { children: "06" }),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx20("b", { children: "Readability check" }),
          /* @__PURE__ */ jsx20("small", { children: "Text contrast across each major surface" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-section-body", children: [
        /* @__PURE__ */ jsx20("div", { className: "contrast-grid", children: pairs.map(([name, fg, bg]) => /* @__PURE__ */ jsxs15("div", { style: { color: fg, background: bg }, children: [
          /* @__PURE__ */ jsx20("b", { children: name }),
          /* @__PURE__ */ jsx20("span", { children: "Readable sample text" }),
          /* @__PURE__ */ jsxs15("small", { style: { color: fg }, children: [
            contrast(fg, bg).toFixed(2),
            ":1 \xB7 ",
            contrast(fg, bg) >= 4.5 ? "Pass" : "Needs adjustment"
          ] })
        ] }, name)) }),
        /* @__PURE__ */ jsx20("p", { children: "Colors are corrected to a minimum 4.5:1 for these text pairs. Browser visual verification is still pending." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("section", { className: "theme-save-panel", children: [
      /* @__PURE__ */ jsxs15("div", { children: [
        /* @__PURE__ */ jsx20("h3", { children: "Save your appearance" }),
        /* @__PURE__ */ jsx20("p", { children: "Keep your current setup or save it as a reusable preset." })
      ] }),
      /* @__PURE__ */ jsxs15("label", { children: [
        "Custom preset name (optional)",
        /* @__PURE__ */ jsx20("input", { value: presetName, maxLength: 80, placeholder: "e.g. Travis \u2014 Studio Night", onChange: (e) => P(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "theme-save-actions", children: [
        /* @__PURE__ */ jsx20("button", { disabled: busy, onClick: () => {
          D(getState().preferences[user().id] || defaultTheme(user().id));
          M("Reverted to saved appearance");
        }, children: "Cancel / revert" }),
        /* @__PURE__ */ jsx20("button", { disabled: busy || !presetName.trim(), onClick: () => save(true), children: "Save named preset" }),
        /* @__PURE__ */ jsx20("button", { className: "primary", disabled: busy, onClick: () => save(), children: busy ? "Saving\u2026" : "Save appearance" })
      ] }),
      /* @__PURE__ */ jsx20("p", { role: "status", children: message2 })
    ] })
  ] });
}

// app/archive-room.tsx
import { useState as useState16 } from "react";
import { Fragment as Fragment14, jsx as jsx21, jsxs as jsxs16 } from "react/jsx-runtime";
function ArchiveRoom() {
  const s = useWorkspace(), [q, Q] = useState16("");
  const rows = [];
  for (const r of s.records) {
    if (r.archived) rows.push({ ref: { kind: "record", id: r.id }, item: r });
    for (const [list, kind] of [["shots", "shot"], ["tasks", "task"], ["comments", "comment"]]) for (const [i, x] of (r[list] || []).entries()) if (x.archived) rows.push({ ref: { kind, id: kind === "shot" ? x.id : String(i), parent: r.id }, item: x });
  }
  for (const [list, kind] of [["messages", "message"], ["annotations", "annotation"]]) for (const x of s[list]) if (x.archived) rows.push({ ref: { kind, id: x.id }, item: x });
  for (const x of s.personal[user().id] || []) if (x.archived) rows.push({ ref: { kind: "personal", id: x.id, parent: user().id }, item: x });
  for (const a of s.annotations) for (const [i, c] of a.comments.entries()) if (c.archived) rows.push({ ref: { kind: "annotation-comment", parent: a.id, id: String(i) }, item: c });
  const visible = rows.filter((r) => {
    try {
      canEdit(s, r.ref, r.item);
      return true;
    } catch {
      return false;
    }
  }).filter((r) => (r.item.title || r.item.text || r.item.subject || "").toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ jsxs16(Fragment14, { children: [
    /* @__PURE__ */ jsxs16("div", { className: "archive-toolbar", children: [
      /* @__PURE__ */ jsxs16("span", { children: [
        visible.length,
        " archived items \xB7 originals preserved"
      ] }),
      /* @__PURE__ */ jsx21("input", { "aria-label": "Search archive", placeholder: "Search archived items\u2026", value: q, onChange: (e) => Q(e.target.value) })
    ] }),
    visible.map(({ ref, item }) => /* @__PURE__ */ jsxs16("article", { className: "archive-row", "data-select-kind": ref.kind, "data-select-parent": ref.parent, "data-select-id": ref.id, children: [
      /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx21("h3", { children: item.title || item.text || item.subject }),
        /* @__PURE__ */ jsx21("small", { children: ref.kind })
      ] }),
      /* @__PURE__ */ jsx21("button", { onClick: () => bulkItems([ref], "restore"), children: "Restore" })
    ] }, ref.kind + "-" + ref.parent + "-" + ref.id)),
    !visible.length && /* @__PURE__ */ jsx21("div", { className: "archive-empty", children: "No archived items match." })
  ] });
}

// checks/workflows.ts
var storage = () => {
  const m = /* @__PURE__ */ new Map();
  return { getItem: (k) => m.get(k) || null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k), clear: () => m.clear() };
};
Object.assign(globalThis, { localStorage: storage(), sessionStorage: storage() });
var events = new EventTarget();
Object.assign(globalThis, { window: { location: { origin: "http://localhost" }, dispatchEvent: events.dispatchEvent.bind(events), addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events) } });
var count = 0;
async function check(name, fn) {
  await fn();
  console.log("PASS " + name);
  count++;
}
await check("Official directory includes ten operations and no invented Nissan", () => {
  assert.equal(locations.length, 10);
  assert(!locations.some(([n]) => n.includes("Nissan")));
  assert.equal(getState().records.filter((r) => r.locationRoot).length, 10);
});
await check("Day plans are shared across identities and future calendar dates", () => {
  setUser("travis");
  const id = createDayTask({ title: "Film service tips", owner: "Travis", date: "2026-11-12" });
  setUser("mckenzie");
  assert(dayPlan("2026-11-12").some((x) => x.id === id && x.person === "Travis"));
  createDayTask({ title: "Approve weekly captions", owner: "McKenzie", date: "2026-11-12" });
  saveRecord({ kind: "event", title: "Future shoot", owner: "Travis", date: "2026-11-13", status: "Planned" });
  setUser("travis");
  assert(dayPlan("2026-11-12").some((x) => x.person === "McKenzie"));
  assert(!dayPlan("2026-11-12").some((x) => x.title === "Future shoot"));
  assert(dayPlan("2026-11-13").some((x) => x.title === "Future shoot"));
  completeDayTask(dayPlan("2026-11-12").find((x) => x.id === id), true);
  setUser("mckenzie");
  assert(dayPlan("2026-11-12").find((x) => x.id === id).complete);
});
await check("Unassigned multi-file uploads persist original bytes in IndexedDB", async () => {
  for (const name of ["photo.png", "script.txt"]) {
    const id = await addAsset(new File(["test original"], name, { type: name.endsWith(".png") ? "image/png" : "text/plain" }));
    const r = getState().records.find((r2) => r2.id === id);
    assert.equal(r.project, "");
    assert.equal(r.dealership, "");
    assert.equal(r.folder, "");
    assert.equal(await (await readFile(id)).text(), "test original");
  }
});
var assetId = getState().records.find((r) => r.kind === "asset").id;
await check("Assets support multiple relationships; unassign preserves original", async () => {
  const a = getState().records.find((r) => r.id === assetId);
  saveRecord({ ...a, associations: [{ id: "pink-demo", kind: "project" }, { id: "demo-video", kind: "video" }] });
  assert.equal(getState().records.find((r) => r.id === assetId).associations.length, 2);
  const out = bulkItems([{ kind: "record", id: assetId }], "unassign");
  assert.equal(out.failures.length, 0);
  assert.equal((await readFile(assetId)).size, 13);
  assert.equal(getState().records.find((r) => r.id === assetId).associations.length, 0);
  out.undo();
  assert.equal(getState().records.find((r) => r.id === assetId).associations.length, 2);
});
var version;
var annotation;
await check("Lawrence can request REMOVE at exactly 42\u201348 seconds", async () => {
  setUser("travis");
  version = await addVideoVersion("demo-video", new File(["demo-video-bytes"], "cut-v1.webm", { type: "video/webm" }));
  setUser("lawrence");
  annotation = addAnnotation("demo-video", version.id, { start: 42, end: 48, type: "REMOVE", text: "Cut directly to the inventory shot.", priority: "High" });
  assert.equal(annotation.start, 42);
  assert.equal(annotation.end, 48);
  assert.equal(annotation.versionId, version.id);
});
await check("Travis revision queue links to the annotation; unresolved notes block approval", () => {
  setUser("travis");
  const video = getState().records.find((r) => r.id === "demo-video");
  assert(video.tasks.some((t) => t.annotationId === annotation.id && t.assignee === "Trav"));
  assert.throws(() => reviewVersion("demo-video", version.id, "Approved"), /McKenzie/);
  setUser("mckenzie");
  assert.throws(() => reviewVersion("demo-video", version.id, "Approved"), /outstanding/);
});
await check("Resolved feedback completes linked task; correct version can be approved", () => {
  setUser("travis");
  setAnnotationStatus(annotation.id, "Resolved");
  assert.equal(getState().records.find((r) => r.id === "demo-video").tasks[0].status, "Complete");
  setUser("mckenzie");
  reviewVersion("demo-video", version.id, "Approved");
  assert.equal(getState().records.find((r) => r.id === "demo-video").versions[0].status, "Approved");
});
await check("Revised version never inherits approval or old-version annotations", async () => {
  setUser("travis");
  const next = await addVideoVersion("demo-video", new File(["revised"], "cut-v2.webm", { type: "video/webm" }));
  assert.equal(next.status, "Video Draft");
  assert.equal(next.reviews.length, 0);
  assert.equal(getState().annotations.filter((a) => a.versionId === next.id).length, 0);
  assert.equal(getState().annotations[0].versionId, version.id);
  setUser("mckenzie");
  reviewVersion("demo-video", next.id, "Approved");
});
var message;
await check("Direct messages retain correct sender, conversation and timestamp", () => {
  setUser("travis");
  message = sendLocalMessage("private-mt", { text: "Version two is ready." });
  assert.equal(message.sender_name, "Travis");
  assert.equal(message.conversationId, "private-mt");
  assert(Number.isFinite(Date.parse(message.created_at)));
  setUser("mckenzie");
  assert.equal(conversation("private-mt").id, "private-mt");
});
await check("Executive cannot read private McKenzie/Travis conversation through API", async () => {
  setUser("lawrence");
  assert.throws(() => conversation("private-mt"), /private/);
  assert.throws(() => sendLocalMessage("private-mt", { text: "blocked" }), /private/);
  assert.equal((await apiFetch("/api/chat?conversation=private-mt")).ok, false);
});
await check("Private attachments are filtered from another user and cannot create playback URLs", async () => {
  setUser("travis");
  const id = await addAsset(new File(["private attachment"], "private.txt", { type: "text/plain" }), { privateConversation: "private-mt" });
  assert.equal(await (await readFile(id)).text(), "private attachment");
  setUser("lawrence");
  await assert.rejects(() => readFile(id), /private/);
  await assert.rejects(() => fileURL(id), /private/);
  const r = await (await apiFetch("/api/workspace")).json();
  assert(!r.records.some((x) => x.id === id));
});
await check("Shared review link preserves exact video, version and timestamp", () => {
  const m = sendLocalMessage("team", { text: "Review this cut", annotation: { videoId: "demo-video", versionId: version.id, time: 42 } });
  assert.equal(getState().messages.find((x) => x.id === m.id).annotation.time, 42);
});
await check("Chat media keeps its asset and records conversation provenance", () => {
  setUser("travis");
  assert.equal(directChat("mckenzie"), directChat("mckenzie"));
  const m = sendChatMedia("team", { text: "Reference photo", assetIds: [assetId] });
  const a = getState().records.find((r) => r.id === assetId);
  assert(a.chatOrigins.some((o) => o.messageId === m.id && o.conversationId === "team"));
  assert.equal(a.project, "");
  assert(m.attachments.includes(assetId));
});
await check("Bulk archive reports permission failures and success accurately", () => {
  setUser("mckenzie");
  const out = bulkItems([{ kind: "message", id: message.id }, { kind: "record", id: assetId }], "archive");
  assert.equal(out.failures.length, 1);
  assert.equal(out.successes.length, 1);
  assert(getState().records.find((r) => r.id === assetId).archived);
  out.undo();
  assert(!getState().records.find((r) => r.id === assetId).archived);
});
await check("Duplicate + Undo removes only the duplicate", () => {
  const before = getState().records.length;
  const out = bulkItems([{ kind: "record", id: "pink-demo" }], "duplicate");
  assert.equal(getState().records.length, before + 1);
  out.undo();
  assert.equal(getState().records.length, before);
});
await check("Comments, tasks, shots and annotations support shared edit/archive/restore", () => {
  mutate((s) => {
    const r = s.records.find((r2) => r2.id === "demo-video");
    r.shots = [{ id: "shot1", subject: "Exterior", status: "Planned" }];
    r.comments = [{ text: "Initial note", by: "McKenzie" }];
  });
  for (const ref of [{ kind: "shot", parent: "demo-video", id: "shot1" }, { kind: "task", parent: "demo-video", id: "0" }, { kind: "comment", parent: "demo-video", id: "0" }, { kind: "annotation", id: annotation.id }]) {
    const out = bulkItems([ref], "archive");
    assert.equal(out.successes.length, 1);
    assert.equal(bulkItems([ref], "restore").successes.length, 1);
  }
  updateItem({ kind: "comment", parent: "demo-video", id: "0" }, { text: "Updated note" });
  assert.equal(getState().records.find((r) => r.id === "demo-video").comments[0].text, "Updated note");
});
await check("Theme persists and computed colors maintain readable contrast", () => {
  mutate((s) => s.preferences.mckenzie = { theme: "dark", accent: "#cd315e", font: "Georgia, serif", radius: 12, appearance: { bodyText: "#111111", cardBg: "#111111" } });
  const p = getState().preferences.mckenzie;
  assert.equal(p.radius, 12);
  const c = appearance(p);
  assert(contrast(c.bodyText, c.cardBg) >= 4.5);
});
await check("Every light and dark preset passes surface text contrast checks", () => {
  for (const [name, p] of Object.entries(themePresets)) {
    const c = appearance(p);
    for (const [fg, bg] of [["bodyText", "cardBg"], ["headingText", "cardBg"], ["mutedText", "cardBg"], ["linkText", "cardBg"], ["pageText", "pageBg"], ["pageHeading", "pageBg"], ["pageMuted", "pageBg"], ["pageLink", "pageBg"], ["sidebarText", "sidebarBg"], ["headerText", "headerBg"], ["inputText", "inputBg"], ["buttonText", "buttonBg"], ["primaryText", "primaryBg"]]) assert(contrast(c[fg], c[bg]) >= 4.5, name + " " + fg + "/" + bg);
  }
});
await check("Theme editor uses grouped accordions with saving after settings", () => {
  const html = renderToString(React2.createElement(ThemeWorkbench, { preferences: themePresets["Travis Default"], onSave: () => true }));
  assert((html.match(/<details/g) || []).length >= 6);
  assert(html.indexOf("theme-save-panel") > html.indexOf("Dashboard artwork"));
  for (const name of ["Walker Default", "McKenzie Default", "Travis Default", "Carbon", "Midnight Navy"]) assert(html.includes(name));
});
await check("Quote is deterministic within a Chicago calendar day", () => {
  assert.equal(quoteForDay("2026-10-16"), quoteForDay("2026-10-16"));
  mutate((s) => s.quotes.push({ date: "2026-10-16", text: "A custom daily quote", author: "Preview team" }));
  assert.equal(getState().quotes[0].text, "A custom daily quote");
});
await check("Invalid campaigns reject reversed date ranges", () => assert.throws(() => saveRecord({ title: "Invalid", kind: "project", date: "2026-10-21", endDate: "2026-10-20" }), /End date/));
await check("Approving an older cut cannot mark a newer unreviewed cut approved", async () => {
  setUser("travis");
  const latest = await addVideoVersion("demo-video", new File(["third"], "cut-v3.webm", { type: "video/webm" }));
  setUser("mckenzie");
  reviewVersion("demo-video", version.id, "Approved");
  const r = getState().records.find((r2) => r2.id === "demo-video");
  assert.equal(r.versions.find((v) => v.id === latest.id).status, "Video Draft");
  assert.equal(r.status, "Editing");
});
await check("Quick ideas need no campaign or dates and keep separate Seen / On it acknowledgements", async () => {
  setUser("lawrence");
  const idea = await quickIdeaAction({ action: "save", title: "Try this service tip", notes: "Film a quick example", attachments: [] });
  assert.equal(idea.date, void 0);
  assert.equal(idea.project, void 0);
  setUser("travis");
  assert(unreadIdeas().some((x) => x.id === idea.id));
  await quickIdeaAction({ action: "ack", id: idea.id, value: "onit" });
  assert(!unreadIdeas().some((x) => x.id === idea.id));
  await quickIdeaAction({ action: "react", id: idea.id, value: 1 });
  await quickIdeaAction({ action: "react", id: idea.id, value: -1 });
  setUser("mckenzie");
  assert(unreadIdeas().some((x) => x.id === idea.id));
  let r = getState().records.find((x) => x.id === idea.id);
  assert.equal(r.acknowledgements.travis.status, "onit");
  assert.equal(r.votes.travis, -1);
  await quickIdeaAction({ action: "ack", id: idea.id, value: "seen" });
  await quickIdeaAction({ action: "comment", id: idea.id, text: "Good reference" });
  r = getState().records.find((x) => x.id === idea.id);
  assert.equal(r.acknowledgements.travis.status, "onit");
  assert.equal(r.acknowledgements.mckenzie.status, "seen");
  assert.equal(r.comments[0].by, "McKenzie");
  await quickIdeaAction({ action: "archive", id: idea.id });
  assert(!unreadIdeas().some((x) => x.id === idea.id));
  await quickIdeaAction({ action: "restore", id: idea.id });
});
await check("All major modules render without runtime errors", () => {
  const props = { onReview: () => {
  }, onGo: () => {
  }, onClose: () => {
  }, onSave: () => true, preferences: getState().preferences.mckenzie };
  for (const C of [QuickIdeas, DayPlanner, Library, VideoReview, ShotStudio, PlanningCalendar, TaskBoard, Reports, PreviewAdmin, RoleOverview, MessengerInbox, ThemeWorkbench, ArchiveRoom, DailyQuote]) {
    const html = renderToString(React2.createElement(C, { ...props, active: true }));
    assert(html.length > 10, C.name);
  }
  for (const section of ["Campaigns", "Video production", "Ideas library", "Social planner"]) assert(renderToString(React2.createElement(Operations, { ...props, section })).length > 50);
});
console.log(`
${count} workflow checks passed. Browser playback, layout, touch and drag/drop remain pending browser permission.`);
