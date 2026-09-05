import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getFeatureToggles, updateFeatureToggle } from "../services/configApi";

const FeatureContext = createContext();

export const FeatureProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [togglesList, setTogglesList] = useState([]);
  const [featuresMap, setFeaturesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToggles = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getFeatureToggles();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      const map = {};
      list.forEach((toggle) => {
        if (toggle?.key) {
          map[String(toggle.key).toUpperCase()] = toggle.isEnabled !== false;
        }
      });

      setTogglesList(list);
      setFeaturesMap(map);
    } catch (err) {
      console.error("Failed to fetch feature toggles:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchToggles();
  }, [fetchToggles]);

  const isFeatureEnabled = useCallback(
    (moduleKey) => {
      if (!moduleKey) return true;
      const key = String(moduleKey).toUpperCase();
      if (featuresMap[key] !== undefined) {
        return featuresMap[key];
      }
      return true; // Default to true if not specified
    },
    [featuresMap]
  );

  const setToggleState = useCallback(async (key, isEnabled, version) => {
    const res = await updateFeatureToggle(key, { isEnabled, version });
    const updated = res?.data || res;

    if (updated?.key) {
      const upperKey = String(updated.key).toUpperCase();
      setFeaturesMap((prev) => ({
        ...prev,
        [upperKey]: updated.isEnabled !== false,
      }));
      setTogglesList((prev) =>
        prev.map((t) => (t.key === upperKey ? updated : t))
      );
    }
    return updated;
  }, []);

  return (
    <FeatureContext.Provider
      value={{
        togglesList,
        featuresMap,
        loading,
        error,
        isFeatureEnabled,
        refetchFeatures: fetchToggles,
        setToggleState,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureToggle = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatureToggle must be used within a FeatureProvider");
  }
  return context;
};

export default FeatureContext;
