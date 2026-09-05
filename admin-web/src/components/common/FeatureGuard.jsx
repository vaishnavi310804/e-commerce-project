import React from "react";
import { useFeatureToggle } from "../../context/FeatureContext";
import ModuleDisabled from "./ModuleDisabled";

const FeatureGuard = ({ moduleKey, children }) => {
  const { isFeatureEnabled, loading } = useFeatureToggle();

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6547C9] border-t-transparent" />
      </div>
    );
  }

  if (!isFeatureEnabled(moduleKey)) {
    return <ModuleDisabled moduleKey={moduleKey} />;
  }

  return children;
};

export default FeatureGuard;
