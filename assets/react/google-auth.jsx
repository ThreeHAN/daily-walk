import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://dnnpakvhiipflpvmkymf.supabase.co";
const publishableKey = "sb_publishable_lSHa1JshQ3lKb4k7MFtEcw_Kigs8Yy8";

function GoogleAuth() {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
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
      if (active) setSession(nextSession);
    });

    async function initialize() {
      try {
        const { error: initError } = await supabase.auth.initialize();
        if (initError) throw initError;
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (active) setSession(data.session);
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
      subscription.unsubscribe();
    };
  }, [supported]);

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

  return (
    <div className="acct-box">
      <div className="acct-h"><b>Google account</b></div>
      <p className="auth-note">Profiles and progress stay on this browser and are not synced.</p>
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
          </button>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </>
      )}
    </div>
  );
}

export function renderGoogleAuth() {
  createRoot(document.getElementById("google-auth")).render(<GoogleAuth />);
}
