import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { linkProfile, newProfileId, storedProfileLink } from "./profile-link.js";
import { connectCloudProfile, listCloudProfiles, readCloud, syncProfile } from "./profile-sync.js";
import { AvatarSetup } from "./onboarding.jsx";

const projectUrl = "https://dnnpakvhiipflpvmkymf.supabase.co";
const publishableKey = "sb_publishable_lSHa1JshQ3lKb4k7MFtEcw_Kigs8Yy8";
const onboardingKey = "dailywalk_admin_max:onboarding:v1";

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

function GoogleAuth({ getLocalProfile, getSyncLocalProfile, getSyncTargets, replaceLocalProfile, backupCloudProfile,
  hasCurrentLink, finishStartup, openCloudProfile, setSyncStatus: setBarSyncStatus,
  needsOnboarding, appearanceDefaults, appearanceOptions, renderAvatar }) {
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
  const [cloudProfiles, setCloudProfiles] = useState(null);
  const [selectedCloud, setSelectedCloud] = useState("");
  const [startup, setStartup] = useState("checking");
  const [startupProfiles, setStartupProfiles] = useState([]);
  const [startupSelected, setStartupSelected] = useState("");
  const [startupError, setStartupError] = useState("");
  const [startupAttempt, setStartupAttempt] = useState(0);
  const sessionRef = useRef(null);
  const runningRef = useRef(false);
  const autoSyncRef = useRef(null);
  const queuedSyncRef = useRef(false);
  const reconnectSyncRef = useRef(false);
  const linkStateRef = useRef({ busy: false, ready: false });
  const retryLinkOwnerRef = useRef(null);
  const onboardingRef = useRef(null);
  const onboardingCheckedRef = useRef(false);
  const [appearance, setAppearance] = useState(appearanceDefaults);
  const supported = window.location.protocol === "https:" || window.location.protocol === "http:";

  function updateOnboarding(step, nextAppearance = appearance) {
    try {
      const draft = { step, appearance: nextAppearance };
      sessionStorage.setItem(onboardingKey, JSON.stringify(draft));
      onboardingRef.current = draft;
      setAppearance(nextAppearance);
      setStartupError("");
      setStartup(step);
    } catch (err) {
      console.error("Could not save onboarding progress", err);
      setStartupError("Could not save your setup. Check browser storage and try again.");
    }
  }

  function finishOnboarding() {
    if (!onboardingRef.current) return;
    onboardingRef.current = null;
    try {
      sessionStorage.removeItem(onboardingKey);
    } catch (err) {
      console.error("Could not clear completed onboarding progress", err);
    }
  }

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
    if (needsOnboarding && !onboardingCheckedRef.current) {
      try {
        const raw = sessionStorage.getItem(onboardingKey);
        const draft = raw === null ? null : JSON.parse(raw);
        if (draft && (!["welcome", "avatar", "choice"].includes(draft.step) ||
            !draft.appearance || typeof draft.appearance !== "object" || Array.isArray(draft.appearance) ||
            Object.keys(draft.appearance).length !== Object.keys(appearanceDefaults).length ||
            Object.keys(appearanceDefaults).some((key) =>
              draft.appearance[key] !== appearanceDefaults[key] &&
              !appearanceOptions[key].some(([value]) => value === draft.appearance[key])))) {
          throw new Error("Invalid onboarding progress.");
        }
        onboardingCheckedRef.current = true;
        if (draft || !session) {
          const currentDraft = draft || { step: "welcome", appearance: appearanceDefaults };
          onboardingRef.current = currentDraft;
          setAppearance(currentDraft.appearance);
          setStartup(currentDraft.step);
          return;
        }
      } catch (err) {
        console.error("Could not load onboarding progress", err);
        setStartupError("Could not load your setup. Check browser storage and retry.");
        setStartup("setup-error");
        return;
      }
    }
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
          openCloudProfile(session.user.id, profiles[0].id, remote, { skipSplash: !!onboardingRef.current });
          finishOnboarding();
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
    hasCurrentLink, finishStartup, openCloudProfile, needsOnboarding, appearanceDefaults, appearanceOptions]);

  useEffect(() => {
    queuedSyncRef.current = false;
    reconnectSyncRef.current = false;
    retryLinkOwnerRef.current = null;
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
      setCloudProfiles(null);
      return;
    }
    let active = true;
    setLinkBusy(true);
    setLinkStatus("Linking the current profile...");
    setLinkError("");
    async function prepareLink() {
      const profile = getLocalProfile();
      const link = storedProfileLink(session, profile);
      if (link?.status === "linked") return profile.state.p.name || "Current profile";
      if (link?.status === "pending" && retryLinkOwnerRef.current !== session.user.id) {
        throw new Error("Profile linking needs an explicit retry.");
      }
      retryLinkOwnerRef.current = null;
      return linkProfile(client, session, getLocalProfile);
    }
    prepareLink().then((name) => {
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
  linkStateRef.current = { busy: linkBusy, ready: linkReady };
  useEffect(() => {
    if (!client || !session || startup !== "ready") return;
    let disposed = false;
    let scheduled = false;
    let onlineGeneration = 0;
    const pendingKey = "dailywalk_admin_max:profile-sync-pending:v1:" + encodeURIComponent(session.user.id);
    const current = () => !disposed && sessionRef.current?.user?.id === session.user.id
      && sessionRef.current?.access_token === session.access_token;
    function pendingStorageError(err) {
      console.error("Could not store pending profile sync", err);
      setSyncError("Changes are saved locally, but sync retry information could not be stored.");
    }
    function markPending(offline) {
      try {
        localStorage.setItem(pendingKey, JSON.stringify({ id: newProfileId(), offline }));
      } catch (err) {
        pendingStorageError(err);
      }
    }
    function drain() {
      if (disposed || scheduled || !queuedSyncRef.current) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        if (!disposed) run();
      });
    }
    async function run() {
      if (!current()) return;
      if (!navigator.onLine) {
        reconnectSyncRef.current ||= queuedSyncRef.current;
        queuedSyncRef.current = false;
        setBarSyncStatus("Offline · changes saved locally");
        setSyncStatus("Offline. Changes will sync after reconnecting.");
        return;
      }
      if (runningRef.current || linkStateRef.current.busy || !linkStateRef.current.ready) return;
      runningRef.current = true;
      queuedSyncRef.current = false;
      setSyncBusy(true);
      setBarSyncStatus("Syncing…");
      const attemptGeneration = onlineGeneration;
      let pendingAtStart;
      let failed = false;
      let message = "";
      try {
        pendingAtStart = localStorage.getItem(pendingKey);
        const targets = getSyncTargets(session.user.id);
        for (const id of targets) {
          if (!current()) return;
          try {
            await syncProfile(client, session, () => getSyncLocalProfile(id),
              replaceLocalProfile, backupCloudProfile, current);
            if (!current()) return;
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
              ? err.message
              : "Could not sync a profile. Changes remain local; use Sync now to retry.";
          }
        }
        if (!current()) return;
        if (pendingAtStart !== null && localStorage.getItem(pendingKey) === pendingAtStart) {
          if (failed) {
            const pending = JSON.parse(pendingAtStart);
            localStorage.setItem(pendingKey, JSON.stringify({ ...pending, offline: !navigator.onLine }));
          } else {
            localStorage.removeItem(pendingKey);
          }
        }
        setSyncError(failed ? message : "");
        reconnectSyncRef.current = failed;
        if (failed && navigator.onLine && onlineGeneration !== attemptGeneration) {
          reconnectSyncRef.current = false;
          queuedSyncRef.current = true;
        }
        const offline = !navigator.onLine;
        setSyncStatus(offline ? "Offline. Changes will sync after reconnecting."
          : failed ? "" : queuedSyncRef.current ? "Changes are waiting to sync." : "Profiles are synced.");
        setBarSyncStatus(offline ? "Offline · changes saved locally"
          : failed ? "Sync error · retry needed" : queuedSyncRef.current ? "Changes pending · syncing" : "Synced ✓");
      } catch (err) {
        if (!current()) return;
        console.error("Could not start profile sync", err);
        failed = true;
        reconnectSyncRef.current = true;
        if (pendingAtStart != null) {
          try {
            if (localStorage.getItem(pendingKey) === pendingAtStart) {
              const pending = JSON.parse(pendingAtStart);
              localStorage.setItem(pendingKey, JSON.stringify({ ...pending, offline: !navigator.onLine }));
            }
          } catch (storageError) {
            pendingStorageError(storageError);
          }
        }
        if (navigator.onLine && onlineGeneration !== attemptGeneration) {
          reconnectSyncRef.current = false;
          queuedSyncRef.current = true;
        }
        setSyncError("Could not sync profiles. Changes remain local; use Sync now to retry.");
        setBarSyncStatus("Sync error · retry needed");
      } finally {
        runningRef.current = false;
        if (!disposed) setSyncBusy(false);
        autoSyncRef.current?.drain();
      }
    }
    function onOffline() {
      try {
        const saved = localStorage.getItem(pendingKey);
        if (saved !== null) {
          const pending = JSON.parse(saved);
          if (!pending || typeof pending.id !== "string" || typeof pending.offline !== "boolean") {
            throw new Error("Pending sync metadata is invalid.");
          }
          if (!pending.offline) localStorage.setItem(pendingKey, JSON.stringify({ ...pending, offline: true }));
        }
      } catch (err) {
        pendingStorageError(err);
      }
      setBarSyncStatus("Offline · changes saved locally");
      setSyncStatus("Offline. Changes will sync after reconnecting.");
    }
    function onSaved() {
      setBarSyncStatus(navigator.onLine ? "Changes pending · syncing" : "Offline · changes saved locally");
      markPending(!navigator.onLine);
      queuedSyncRef.current = true;
      drain();
    }
    function onOnline() {
      onlineGeneration += 1;
      if (reconnectSyncRef.current) {
        reconnectSyncRef.current = false;
        queuedSyncRef.current = true;
      }
      drain();
    }
    autoSyncRef.current = { drain };
    window.addEventListener("dailywalk:profile-saved", onSaved);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    try {
      const saved = localStorage.getItem(pendingKey);
      if (saved !== null) {
        const pending = JSON.parse(saved);
        if (!pending || typeof pending.id !== "string" || typeof pending.offline !== "boolean") {
          throw new Error("Pending sync metadata is invalid.");
        }
        reconnectSyncRef.current = true;
        if (pending.offline && navigator.onLine) {
          queuedSyncRef.current = true;
          setBarSyncStatus("Changes pending · syncing");
        } else if (!navigator.onLine) {
          setBarSyncStatus("Offline · changes saved locally");
          setSyncStatus("Offline. Changes will sync after reconnecting.");
        } else {
          setBarSyncStatus("Sync pending · action needed");
          setSyncStatus("Changes are saved locally. Use Sync now to retry.");
        }
        drain();
      }
    } catch (err) {
      pendingStorageError(err);
    }
    return () => {
      disposed = true;
      if (autoSyncRef.current?.drain === drain) autoSyncRef.current = null;
      window.removeEventListener("dailywalk:profile-saved", onSaved);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [client, session?.user?.id, session?.access_token, startup,
    getSyncLocalProfile, getSyncTargets, replaceLocalProfile, backupCloudProfile, setBarSyncStatus]);
  useEffect(() => {
    if (!linkBusy && linkReady) autoSyncRef.current?.drain();
  }, [linkBusy, linkReady]);

  async function useLocalProfile() {
    setStartupError("");
    try {
      if (session) {
        const { error: signOutError } = await client.auth.signOut({ scope: "local" });
        if (signOutError) throw signOutError;
      }
      finishStartup({
        appearance: onboardingRef.current?.appearance,
        skipSplash: !!onboardingRef.current,
      });
      finishOnboarding();
      setStartup("ready");
    } catch (err) {
      console.error("Could not start a local profile", err);
      setStartupError(err.message === "Local profiles changed. Reload before continuing."
        ? err.message : "Could not start locally. Check browser storage and try again.");
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
      openCloudProfile(session.user.id, startupSelected, remote, { skipSplash: !!onboardingRef.current });
      finishOnboarding();
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
      openCloudProfile(session.user.id, null, null, {
        appearance: onboardingRef.current?.appearance,
        skipSplash: !!onboardingRef.current,
      });
      finishOnboarding();
      setStartup("ready");
    } catch (err) {
      console.error("Could not create a cloud profile", err);
      setStartupError("Could not create a profile. Check browser storage and try again.");
    }
  }

  async function sync() {
    if (runningRef.current) return;
    runningRef.current = true;
    setSyncBusy(true);
    setSyncError("");
    setSyncStatus("");
    setBarSyncStatus("Syncing…");
    try {
      const pendingKey = "dailywalk_admin_max:profile-sync-pending:v1:" + encodeURIComponent(session.user.id);
      const pendingAtStart = localStorage.getItem(pendingKey);
      const current = () => sessionRef.current?.user?.id === session.user.id
        && sessionRef.current?.access_token === session.access_token;
      const targets = getSyncTargets(session.user.id);
      const id = targets[0];
      const result = await syncProfile(client, session, () => getSyncLocalProfile(id), replaceLocalProfile, backupCloudProfile, current);
      setSyncStatus(result.message || "");
      if (!queuedSyncRef.current && targets.length === 1 && targets[0] === id
          && result.message !== "Profile uploaded, but newer local changes still need syncing."
          && localStorage.getItem(pendingKey) === pendingAtStart) {
        if (pendingAtStart !== null) localStorage.removeItem(pendingKey);
        reconnectSyncRef.current = false;
      }
      setBarSyncStatus(queuedSyncRef.current ? "Changes pending · syncing"
          : localStorage.getItem(pendingKey) !== null ||
            result.message === "Profile uploaded, but newer local changes still need syncing."
            ? "Changes pending · action needed" : "Synced ✓");
    } catch (err) {
      console.error("Could not sync profile", err);
      setSyncError(err.message === "Local profiles changed. Reload before syncing."
        ? err.message
        : "Could not sync this profile. Local data was kept; retry.");
      setBarSyncStatus("Sync error · retry needed");
    } finally {
      runningRef.current = false;
      setSyncBusy(false);
      autoSyncRef.current?.drain();
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
      autoSyncRef.current?.drain();
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
      await connectCloudProfile(client, session, getSyncLocalProfile, replaceLocalProfile, selectedCloud, current);
      setCloudProfiles(null);
      setLinkError("");
      setLinkStatus("Linked the current profile to this Google account.");
      const result = await syncProfile(client, session, () => getSyncLocalProfile(local.id), replaceLocalProfile, backupCloudProfile, current);
      setSyncStatus(result.message || "");
      setBarSyncStatus("Profile checked ✓");
    } catch (err) {
      console.error("Could not connect cloud profile", err);
      setSyncError("Could not connect this cloud profile. Local data was kept; retry.");
      setBarSyncStatus("Sync error · retry needed");
    } finally {
      runningRef.current = false;
      setSyncBusy(false);
      autoSyncRef.current?.drain();
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
      <h2 id="startup-title">{startup === "welcome" ? "Ready to begin your journey with Steadfast Steps?"
        : startup === "avatar" ? "Edit your avatar" : "Welcome to Daily Walk"}</h2>
      {startup === "welcome" && <button type="button" className="ubtn"
        onClick={() => updateOnboarding("avatar")}>Ready</button>}
      {startup === "avatar" && <AvatarSetup appearance={appearance} options={appearanceOptions}
        renderAvatar={renderAvatar}
        onChange={(key, value) => updateOnboarding("avatar", { ...appearance, [key]: value })}
        onBack={() => updateOnboarding("welcome")} onNext={() => updateOnboarding("choice")} />}
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
      {startup === "setup-error" && <button type="button" className="ubtn" onClick={() => {
        setStartupError("");
        setStartup("checking");
        setStartupAttempt((attempt) => attempt + 1);
      }}>Retry</button>}
      {(startupError || error) && <p className="auth-error" role="alert">{startupError || error}</p>}
    </StartupDialog>}
    <div className="acct-box">
      <div className="acct-h"><b>Google account</b></div>
      <p className="auth-note">Profile changes sync when you make them. Offline changes retry after reconnecting.</p>
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
            {syncStatus && <p className="auth-note" aria-live="polite">{syncStatus}</p>}
            {syncError && <p className="auth-error" role="alert">{syncError}</p>}
          </>}
          {session && linkError && <>
            <p className="auth-error" role="alert">{linkError}</p>
            <button type="button" className="ubtn" disabled={syncBusy || linkBusy}
              onClick={() => {
                retryLinkOwnerRef.current = session.user.id;
                setLinkAttempt((n) => n + 1);
              }}>
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
