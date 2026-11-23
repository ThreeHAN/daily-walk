function readStoredJson(key) {
  const raw = localStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

function readStoredUsers() {
  const raw = localStorage.getItem(K_USERS);
  if (raw === null) return [];
  const users = JSON.parse(raw);
  if (!Array.isArray(users)) throw new Error("Saved profile index is invalid");
  return users;
}

function readStoredProfile(id) {
  const data = readStoredJson(uKey(id));
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("Saved profile is missing or invalid");
  return data;
}

function writeStoredProfile(id, state, users) {
  localStorage.setItem(uKey(id), JSON.stringify(state));
  localStorage.setItem(K_USERS, JSON.stringify(users));
  localStorage.setItem(K_CUR, id);
}

function deleteStoredProfile(id, remainingUsers, previousUsers) {
  localStorage.setItem(K_USERS, JSON.stringify(remainingUsers));
  try {
    localStorage.removeItem(uKey(id));
  } catch (error) {
    try {
      localStorage.setItem(K_USERS, JSON.stringify(previousUsers));
    } catch (rollbackError) {
      console.error("Could not restore profile index after deletion failed", rollbackError);
    }
    throw error;
  }
}
