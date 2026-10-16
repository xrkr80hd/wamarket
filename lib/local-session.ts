import { people, setUser } from "./preview-store";
export async function accountRequest(
  path: string,
  body?: any,
  method = "POST",
) {
  const r = await fetch("/__local/" + path, {
    method: body === undefined ? "GET" : method,
    credentials: "same-origin",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Local account request failed");
  return data;
}
export async function refreshLocalSession() {
  const data = await accountRequest("me");
  for (const p of [...(data.users || []), data.user].filter(Boolean))
    if (p.name === "Lawrence Searcy") p.name = "Lawrence";
  if (data.user) {
    const directory = data.users.filter((u: any) => u.active);
    for (const u of data.users.filter((u: any) => !u.active)) {
      const i = people.findIndex((p) => p.id === u.id);
      if (i >= 0) people.splice(i, 1);
    }
    for (const u of directory) {
      const index = people.findIndex((p: any) => p.id === u.id);
      if (index >= 0) people[index] = u;
      else people.push(u);
    }
    localStorage.setItem("wam-user-directory", JSON.stringify(directory));
    sessionStorage.setItem("wam-local-auth", data.user.id);
    setUser(data.user.id);
  } else sessionStorage.removeItem("wam-local-auth");
  window.dispatchEvent(
    new CustomEvent("wam-account-session", { detail: data }),
  );
  return data;
}
