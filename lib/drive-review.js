// Share URLs are parsed, never fetched. Only the fixed Google API host is used.
export function parseDriveLink(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw Error("Paste a Google Drive video share link.");
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "drive.google.com" ||
    url.username ||
    url.password ||
    url.port
  )
    throw Error("Use an https://drive.google.com video share link.");
  const match = url.pathname.match(
    /^\/file\/d\/([\w-]+)(?:\/(?:view|preview|edit))?\/?$/,
  );
  const fileId =
    match?.[1] ||
    (/^\/(?:open|uc)\/?$/.test(url.pathname) ? url.searchParams.get("id") : "");
  const resourceKey = url.searchParams.get("resourcekey") || "";
  if (
    !fileId ||
    !/^[\w-]{10,200}$/.test(fileId) ||
    !/^[\w-]{0,200}$/.test(resourceKey)
  )
    throw Error("Paste a link to a Drive file, rather than a folder.");
  return { fileId, resourceKey };
}

export async function driveVideoMetadata(access, source) {
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files/" +
      encodeURIComponent(source.fileId) +
      "?supportsAllDrives=true&fields=id,name,mimeType,trashed,md5Checksum,size,capabilities(canDownload)",
    {
      headers: driveHeaders(access, source),
      redirect: "error",
    },
  );
  if (!response.ok)
    throw Object.assign(
      Error(
        response.status === 429
          ? "Drive is busy. Try again shortly."
          : "This Drive video is missing or inaccessible. Share it with the connected Google account and check Drive permissions.",
      ),
      { status: response.status === 429 ? 429 : 403 },
    );
  const file = await response.json();
  if (file.trashed)
    throw Object.assign(Error("This Drive video is in the trash."), {
      status: 410,
    });
  if (!file.mimeType?.startsWith("video/"))
    throw Error("Choose a video file stored in Drive.");
  if (!file.capabilities?.canDownload)
    throw Object.assign(
      Error(
        "Drive download permission is required for synchronized video review.",
      ),
      { status: 403 },
    );
  if (!file.md5Checksum)
    throw Error(
      "Drive has not finished processing this video. Try again later.",
    );
  return file;
}

export function driveHeaders(access, source) {
  return {
    Authorization: "Bearer " + access,
    ...(source.resourceKey
      ? {
          "X-Goog-Drive-Resource-Keys":
            source.fileId + "/" + source.resourceKey,
        }
      : {}),
  };
}

export function reviewPlaybackURL(videoId, versionId) {
  return (
    "/api/drive?route=review-file&videoId=" +
    encodeURIComponent(videoId) +
    "&versionId=" +
    encodeURIComponent(versionId)
  );
}

export function timecode(t) {
  const milliseconds = Math.round(
    Math.max(0, Number.isFinite(t) ? t : 0) * 1000,
  );
  return `${String(Math.floor(milliseconds / 60000)).padStart(2, "0")}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, "0")}.${String(milliseconds % 1000).padStart(3, "0")}`;
}

// Construct only Google-owned preview URLs, never arbitrary user-provided embeds.
export function publicDriveEmbedURL(source) {
  const id = String(source?.fileId || "");
  const resourceKey = String(source?.resourceKey || "");
  if (!/^[\w-]{10,200}$/.test(id) || !/^[\w-]{0,200}$/.test(resourceKey)) return "";
  const url = new URL("https://drive.google.com/file/d/" + id + "/preview");
  if (resourceKey) url.searchParams.set("resourcekey", resourceKey);
  return url.toString();
}
