import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { linkProfile } from "./profile-link.js";
import { connectCloudProfile, listCloudProfiles, readCloud, syncProfile } from "./profile-sync.js";

const projectUrl = "https://dnnpakvhiipflpvmkymf.supabase.co";
const publishableKey = "sb_publishable_lSHa1JshQ3lKb4k7MFtEcw_Kigs8Yy8";

function StartupDialog({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return createPortal(
    <dialog ref={ref} className="startup-dialog" aria-labelledby="startup-title"
      onCancel={(event) => event.preventDefault()}>
      {children}
    </dialog>,
    document.body,
  );
}

function GoogleAuth({ getLocalProfile, getSyncLocalProfile, getSyncTargets, replaceLocalProfile,
  hasCurrentLink, finishStartup, openCloudProfile, setSyncStatus: setBarSyncStatus }) {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [linkStatus, setLinkStatus] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkAttempt, setLinkAttempt] = useState(0);
  const [linkBusy, setLinkBusy] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [syncError, setSyncError] = useState("");
  const [conflict, setConflict] = useState(null);
  const [cloudProfiles, setCloudProfiles] = useState(null);
  const [selectedCloud, setSelectedCloud] = useState("");
  const [startup, setStartup] = useState("checking");
  const [startupProfiles, setStartupProfiles] = useState([]);
  const [startupSelected, setStartupSelected] = useState("");
  const [startupError, setStartupError] = useState("");
  const [startupAttempt, setStartupAttempt] = useState(0);
  const sessionRef = useRef(null);
  const runningRef = useRef(false);
  const conflictsRef = useRef(new Map());
  const autoSyncRef = useRef(null);
  const supported = window.location.protocol === "https:" || window.location.protocol === "http:";

  useEffect(() => {
    if (!supported) {
      setBusy(false);
      return;
    }

    const supabase = createClient(projectUrl, publishableKey, {
      auth: { flowType: "pkce" },
    });
    setClient(supabase);
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        sessionRef.current = nextSession;
        setSession(nextSession);
      }
    });

    async function initialize() {
      try {
        const { error: initError } = await supabase.auth.initialize();
        if (initError) throw initError;
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (active) {
          sessionRef.current = data.session;
          setSession(data.session);
        }
      } catch (err) {
        console.error("Could not initialize Google sign-in", err);
        if (active) setError("Could not initialize sign-in. Please reload and try again.");
      } finally {
        if (active) setBusy(false);
      }
    }
    initialize();
    return () => {
      active = false;
      sessionRef.current = null;
      subscription.unsubscribe();
    };
  }, [supported]);

  useEffect(() => {
    if (busy || startup === "ready" || !["checking", "choice"].includes(startup)) return;
    if (!session) {
      setStartup("choice");
      return;
    }
    if (!client) return;
    let active = true;
    const current = () => active && sessionRef.current?.user?.id === session.user.id
      && sessionRef.current?.access_token === session.access_token;
    async function prepare() {
      try {
        if (hasCurrentLink(session.user.id)) {
          finishStartup();
          if (current()) setStartup("ready");
          return;
        }
        const profiles = await listCloudProfiles(client, session);
        if (!current()) return;
        if (profiles.length === 1) {
          const remote = await readCloud(client, session, profiles[0].id);
          if (!current()) return;
          openCloudProfile(session.user.id, profiles[0].id, remote);
          setStartup("ready");
        } else {
          setStartupProfiles(profiles);
          setStartupSelected(profiles[0]?.id || "");
          setStartup(profiles.length ? "profiles" : "empty");
        }
      } catch (err) {
        console.error("Could not load a cloud profile", err);
        if (current()) {
          setStartupError("Could not load your cloud profiles. Your local saves are unchanged.");
          setStartup("error");
        }
      }
    }
    prepare();
    return () => { active = false; };
  }, [busy, client, session?.user?.id, session?.access_token, startup, startupAttempt,
    hasCurrentLink, finishStartup, openCloudProfile]);

  useEffect(() => {
    conflictsRef.current.clear();
    setConflict(null);
    setSyncStatus("");
    setSyncError("");
    setCloudProfiles(null);
    if (!session) setBarSyncStatus("");
  }, [session?.user?.id, setBarSyncStatus]);

  useEffect(() => {
    if (!client || !session || startup !== "ready") {
      setLinkStatus("");
      setLinkError("");
      setLinkBusy(false);
      setSyncStatus("");
      setSyncError("");
      setConflict(null);
      setCloudProfiles(null);
      return;
    }
    let active = true;
    setLinkBusy(true);
    setLinkStatus("Linking the current profile...");
    setLinkError("");
    linkProfile(client, session, getLocalProfile).then((name) => {
      if (active) setLinkStatus(`Linked ${name} to this Google account.`);
    }).catch((err) => {
      console.error("Could not link profile", err);
      if (active) {
        setLinkStatus("");
        setLinkError(err.message === "Local profiles changed. Reload before syncing."
          ? "Local profiles changed. Reload before linking."
          : err.message === "Linked cloud profile is missing"
            ? "The linked cloud profile is missing. Your local save is unchanged."
            : "Could not link the current profile. Your local save is unchanged.");
      }
    }).finally(() => {
      if (active) setLinkBusy(false);
    });
    return () => { active = false; };
  }, [client, session?.user?.id, getLocalProfile, linkAttempt, startup]);

  const linkReady = !!linkStatus || !!linkError;
  useEffect(() => {
    if (!client || !session || startup !== "ready" || linkBusy || !linkReady) return;
    let disposed = false;
    let timer;
    let pending = false;
    let retryDelay = 2000;
    const current = () => !disposed && sessionRef.current?.user?.id === session.user.id
      && sessionRef.current?.access_token === session.access_token;
    function schedule(delay) {
      if (disposed) return;
      clearTimeout(timer);
      timer = setTimeout(run, delay);
    }
    function wake() {
      pending = true;
      schedule(500);
    }
    async function run() {
      if (!current()) return;
      if (!navigator.onLine) {
        setBarSyncStatus("Offline · changes saved locally");
        setSyncStatus("Offline. Changes will sync after reconnecting.");
        schedule(10000);
        return;
      }
      if (runningRef.current) {
        pending = true;
        schedule(500);
        return;
      }
      runningRef.current = true;
      pending = false;
      setSyncBusy(true);
      setBarSyncStatus("Syncing…");
      let failed = false;
      let message = "";
      try {
        const targets = getSyncTargets(session.user.id);
        for (const id of targets) {
          if (!current()) return;
          if (conflictsRef.current.has(id)) continue;
          try {
            const result = await syncProfile(client, session, () => getSyncLocalProfile(id),
              replaceLocalProfile, undefined, undefined, current);
            if (!current()) return;
            if (result.conflict) {
              const profile = getSyncLocalProfile(id);
              conflictsRef.current.set(id, { ...result.conflict, profileName: profile.state.p.name || "Profile" });
            }
            if (id === targets[0]) {
              const profile = getSyncLocalProfile(id);
              setLinkError("");
              setLinkStatus(`Linked ${profile.state.p.name || "Current profile"} to this Google account.`);
            }
          } catch (err) {
            if (!current()) return;
            console.error("Could not sync profile", err);
            failed = true;
            message = err.message === "Local profiles changed. Reload before syncing."
              || err.message === "Save or discard the journal draft before downloading cloud changes."
              ? err.message
              : "Could not sync a profile. Changes remain local; retrying.";
          }
        }
        if (!current()) return;
        const nextConflict = conflictsRef.current.values().next().value || null;
        setConflict(nextConflict);
        setSyncError(failed ? message : "");
        const offline = !navigator.onLine;
        setSyncStatus(offline ? "Offline. Changes will sync after reconnecting."
          : nextConflict ? "Choose how to resolve the sync conflict."
            : failed ? "" : pending ? "Changes are waiting to sync." : "Profiles are synced.");
        setBarSyncStatus(offline ? "Offline · changes saved locally"
          : nextConflict ? "Sync conflict · action needed"
            : failed ? "Sync error · retrying" : pending ? "Changes pending · syncing" : "Synced ✓");
      } catch (err) {
        if (!current()) return;
        console.error("Could not start profile sync", err);
        failed = true;
        setSyncError("Could not sync profiles. Changes remain local; retrying.");
        setBarSyncStatus("Sync error · retrying");
      } finally {
        runningRef.current = false;
        if (!disposed) {
          setSyncBusy(false);
          if (failed) {
            schedule(retryDelay);
            retryDelay = Math.min(retryDelay * 2, 60000);
          } else {
            retryDelay = 2000;
            schedule(pending ? 500 : 10000);
          }
        }
      }
    }
    function onOffline() {
      setBarSyncStatus("Offline · changes saved locally");
      setSyncStatus("Offline. Changes will sync after reconnecting.");
    }
    function onSaved() {
      setBarSyncStatus(navigator.onLine ? "Changes pending · syncing" : "Offline · changes saved locally");
      wake();
    }
    function onVisibility() {
      if (!document.hidden) wake();
    }
    autoSyncRef.current = { wake };
    window.addEventListener("dailywalk:profile-saved", onSaved);
    window.addEventListener("online", wake);
    window.addEventListener("offline", onOffline);
    window.addEventListener("storage", wake);
    document.addEventListener("visibilitychange", onVisibility);
    schedule(0);
    return () => {
      disposed = true;
      clearTimeout(timer);
      if (autoSyncRef.current?.wake === wake) autoSyncRef.current = null;
      window.removeEventListener("dailywalk:profile-saved", onSaved);
      window.removeEventListener("online", wake);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("storage", wake);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [client, session?.user?.id, session?.access_token, startup, linkBusy, linkReady,
    getSyncLocalProfile, getSyncTargets, replaceLocalProfile, setBarSyncStatus]);

  async function useLocalProfile() {
    setStartupError("");
    try {
      if (session) {
        const { error: signOutError } = await client.auth.signOut({ scope: "local" });
        if (signOutError) throw signOutError;
      }
      finishStartup();
      setStartup("ready");
    } catch (err) {
      console.error("Could not start a local profile", err);
      setStartupError("Could not start locally. Check browser storage and try again.");
    }
  }

  async function selectStartupProfile() {
    setStartupError("");
    setStartup("opening");
    try {
      const current = () => sessionRef.current?.user?.id === session.user.id
        && sessionRef.current?.access_token === session.access_token;
      const remote = await readCloud(client, session, startupSelected);
      if (!current()) throw new Error("The signed-in account changed.");
      openCloudProfile(session.user.id, startupSelected, remote);
      setStartup("ready");
    } catch (err) {
      console.error("Could not open cloud profile", err);
      setStartupError("Could not open this cloud profile. Your local saves are unchanged.");
      setStartup("profiles");
    }
  }

  function createCloudProfile() {
    setStartupError("");
    try {
      openCloudProfile(session.user.id, null, null);
      setStartup("ready");
    } catch (err) {
      console.error("Could not create a cloud profile", err);
      setStartupError("Could not create a profile. Check browser storage and try again.");
    }
  }

  async function sync(choice) {
    if (runningRef.current) return;
    runningRef.current = true;
    setSyncBusy(true);
    setSyncError("");
    setSyncStatus("");
    try {
      const current = () => sessionRef.current?.user?.id === session.user.id
        && sessionRef.current?.access_token === session.access_token;
      const id = choice ? conflict?.profileId : getSyncTargets(session.user.id)[0];
      const result = await syncProfile(client, session, () => getSyncLocalProfile(id), replaceLocalProfile, choice, conflict, current);
      if (result.conflict) {
        const profile = getSyncLocalProfile(id);
        conflictsRef.current.set(id, { ...result.conflict, profileName: profile.state.p.name || "Profile" });
      }
      else conflictsRef.current.delete(id);
      setConflict(conflictsRef.current.values().next().value || null);
      setSyncStatus(result.conflictChanged ? "The profile changed again. Review your choice." : result.message || "");
    } catch (err) {
      console.error("Could not sync profile", err);
      setSyncError(err.message === "Local profiles changed. Reload before syncing." ||
        err.message === "Save or discard the journal draft before downloading cloud changes."
        ? err.message
        : "Could not sync this profile. Local data was kept; retry.");
    } finally {
      runningRef.current = false;
      setSyncBusy(false);
      autoSyncRef.current?.wake();
    }
  }

  async function chooseCloudProfile() {
    if (runningRef.current) return;
    runningRef.current = true;
    setSyncBusy(true);
    setSyncError("");
    try {
      const profiles = await listCloudProfiles(client, session);
      if (sessionRef.current?.user?.id !== session.user.id) throw new Error("The signed-in account changed.");
      setCloudProfiles(profiles);
      setSelectedCloud(profiles[0]?.id || "");
    } catch (err) {
      console.error("Could not list cloud profiles", err);
      setSyncError("Could not load cloud profiles. Retry when online.");
    } finally {
      runningRef.current = false;
      setSyncBusy(false);
      autoSyncRef.current?.wake();
    }
  }

  async function connectProfile() {
    if (runningRef.current) return;
    runningRef.current = true;
    setSyncBusy(true);
    setSyncError("");
    setSyncStatus("");
    try {
      const current = () => sessionRef.current?.user?.id === session.user.id
        && sessionRef.current?.access_token === session.access_token;
      const local = getSyncLocalProfile();
      await connectCloudProfile(client, session, getSyncLocalProfile, selectedCloud, current);
      setCloudProfiles(null);
      conflictsRef.current.delete(local.id);
      setConflict(conflictsRef.current.values().next().value || null);
      setLinkError("");
      setLinkStatus("Linked the current profile to this Google account.");
      const result = await syncProfile(client, session, () => getSyncLocalProfile(local.id), replaceLocalProfile, undefined, undefined, current);
      if (result.conflict) conflictsRef.current.set(local.id, {
        ...result.conflict, profileName: local.state.p.name || "Profile",
      });
      setConflict(conflictsRef.current.values().next().value || null);
      setSyncStatus(result.message || "");
    } catch (err) {
      console.error("Could not connect cloud profile", err);
      setSyncError("Could not connect this cloud profile. Local data was kept; retry.");
    } finally {
      runningRef.current = false;
      setSyncBusy(false);
      autoSyncRef.current?.wake();
    }
  }

  async function signIn() {
    setBusy(true);
    setError("");
    try {
      const { error: signInError } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: new URL(".", window.location.href).href },
      });
      if (signInError) throw signInError;
    } catch (err) {
      console.error("Google sign-in failed", err);
      setError("Could not start Google sign-in. Please try again.");
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await client.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
    } catch (err) {
      console.error("Sign-out failed", err);
      setError("Could not sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (<>
    {startup !== "ready" && <StartupDialog>
      <h2 id="startup-title">Welcome to Daily Walk</h2>
      {startup === "choice" && <>
        <p>Sign in to use your cloud profile, or continue with a profile on this device.</p>
        {supported && <button type="button" className="ubtn" disabled={busy || !client} onClick={signIn}>Sign in with Google</button>}
        {!supported && <p className="auth-note">Sign-in requires the hosted site or local development server.</p>}
        <button type="button" className="ubtn sec" onClick={useLocalProfile}>Continue locally</button>
      </>}
      {(startup === "checking" || startup === "opening") && <p aria-live="polite">Checking your account and profiles…</p>}
      {startup === "profiles" && <>
        <p>Choose the cloud profile you want to open.</p>
        <label>Cloud profile{" "}
          <select value={startupSelected} onChange={(event) => setStartupSelected(event.target.value)}>
            {startupProfiles.map((profile) => <option key={profile.id} value={profile.id}>
              {profile.display_name} · {profile.id.slice(0, 8)}
            </option>)}
          </select>
        </label>
        <button type="button" className="ubtn" disabled={!startupSelected} onClick={selectStartupProfile}>Open profile</button>
      </>}
      {startup === "empty" && <>
        <p>This Google account has no cloud profiles yet.</p>
        <button type="button" className="ubtn" onClick={createCloudProfile}>Create cloud profile</button>
        <button type="button" className="ubtn sec" onClick={useLocalProfile}>Continue locally</button>
      </>}
      {startup === "error" && <>
        <button type="button" className="ubtn" onClick={() => {
          setStartupError("");
          setStartup("checking");
          setStartupAttempt((attempt) => attempt + 1);
        }}>Retry</button>
        <button type="button" className="ubtn sec" onClick={useLocalProfile}>Continue locally</button>
      </>}
      {(startupError || error) && <p className="auth-error" role="alert">{startupError || error}</p>}
    </StartupDialog>}
    <div className="acct-box">
      <div className="acct-h"><b>Google account</b></div>
      <p className="auth-note">Signed-in profiles sync automatically. Offline changes sync after reconnecting.</p>
      {!supported ? (
        <p className="auth-note">Sign-in requires the hosted site or local development server.</p>
      ) : (
        <>
          <p className="auth-note" aria-live="polite">
            {session ? "Signed in as " + (session.user.email || "Google user") : "Not signed in"}
          </p>
          <button type="button" className="ubtn" disabled={busy || !client}
            onClick={session ? signOut : signIn}>
            {session ? "Sign out" : "Sign in with Google"}
          </button>{" "}
          {session && <p className="auth-note" aria-live="polite">{linkStatus}</p>}
          {session && <>
            <button type="button" className="ubtn" disabled={syncBusy || busy || linkBusy || !!linkError || !linkStatus}
              onClick={() => sync()}>Sync now</button>{" "}
            <button type="button" className="ubtn sec" disabled={syncBusy || busy || linkBusy}
              onClick={chooseCloudProfile}>Choose cloud profile</button>
            {cloudProfiles && <>
              {cloudProfiles.length ? <>
                <p className="auth-note"><label>Cloud profile{" "}
                    <select value={selectedCloud} onChange={(event) => setSelectedCloud(event.target.value)}>
                      {cloudProfiles.map((profile) => <option key={profile.id} value={profile.id}>
                        {profile.display_name} · {profile.id.slice(0, 8)}
                      </option>)}
                    </select>
                </label></p>
                <button type="button" className="ubtn" disabled={syncBusy || !selectedCloud}
                  onClick={connectProfile}>Connect profile</button>
              </> : <p className="auth-note">No cloud profiles found.</p>}
            </>}
            {conflict && <div role="alert">
              <p className="auth-error">Local and cloud profiles may both have changed for {conflict.profileName}. Using this device replaces the cloud copy; using cloud keeps a local backup.</p>
              <button type="button" className="ubtn" disabled={syncBusy} onClick={() => sync("local")}>Use this device</button>{" "}
              <button type="button" className="ubtn sec" disabled={syncBusy} onClick={() => sync("cloud")}>Use cloud</button>
            </div>}
            {syncStatus && <p className="auth-note" aria-live="polite">{syncStatus}</p>}
            {syncError && <p className="auth-error" role="alert">{syncError}</p>}
          </>}
          {session && linkError && <>
            <p className="auth-error" role="alert">{linkError}</p>
            <button type="button" className="ubtn" disabled={syncBusy || linkBusy}
              onClick={() => setLinkAttempt((n) => n + 1)}>
              Retry linking
            </button>
          </>}
          {error && <p className="auth-error" role="alert">{error}</p>}
        </>
      )}
    </div>
  </>);
}

export function renderGoogleAuth(props) {
  createRoot(document.getElementById("google-auth")).render(<GoogleAuth {...props} />);
}
