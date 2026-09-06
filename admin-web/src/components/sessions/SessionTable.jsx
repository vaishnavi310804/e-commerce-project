import React from "react";
import { FaBan } from "react-icons/fa";

const SessionTable = ({
  sessions = [],
  loading = false,
  onForceLogout,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow">
        Loading session records...
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow space-y-2">
        <h3 className="text-base font-semibold text-gray-900">
          No session records found
        </h3>
      </div>
    );
  }

  const formatRoleLabel = (roleStr) => {
    switch (String(roleStr).toUpperCase()) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "FULL_ADMIN":
        return "Full Admin";
      case "ADMIN":
        return "Admin";
      case "CUSTOMER":
        return "Customer";
      default:
        return roleStr || "User";
    }
  };

  const getRoleBadgeClasses = (roleStr) => {
    switch (String(roleStr).toUpperCase()) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "FULL_ADMIN":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CUSTOMER":
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const renderStatusBadge = (session) => {
    const isExpired =
      session.expiresAt && new Date(session.expiresAt) <= new Date();

    if (session.isRevoked) {
      return (
        <span className="inline-flex items-center rounded-md border border-red-300 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
          Revoked
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
        Active
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  User Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Role / User Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Login Date & Time
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Last Activity
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Active Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sessions.map((session) => {
                const userObj = session.userId || {};
                const userName = userObj.fullName || "—";
                const userEmail = userObj.email || "—";

                const isRevoked = session.isRevoked;

                const isExpired =
                  session.expiresAt &&
                  new Date(session.expiresAt) <= new Date();

                const isActive = !isRevoked && !isExpired;

                return (
                  <tr
                    key={session._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {userName}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {userEmail}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClasses(
                          session.role
                        )}`}
                      >
                        {formatRoleLabel(session.role)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {session.loginAt
                        ? new Date(session.loginAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {session.lastActivityAt
                        ? new Date(
                            session.lastActivityAt
                          ).toLocaleString()
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {renderStatusBadge(session)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => onForceLogout(session)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                        >
                          <FaBan className="shrink-0" />
                          Force Logout
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {sessions.map((session) => {
          const userObj = session.userId || {};
          const userName = userObj.fullName || "—";
          const userEmail = userObj.email || "—";

          const isRevoked = session.isRevoked;

          const isExpired =
            session.expiresAt &&
            new Date(session.expiresAt) <= new Date();

          const isActive = !isRevoked && !isExpired;

          return (
            <div
              key={session._id}
              className="space-y-3 rounded-xl bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {userName}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {userEmail}
                  </p>
                </div>

                {renderStatusBadge(session)}
              </div>

              <div className="space-y-1.5 rounded-lg bg-gray-50/50 p-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">Role:</span>

                  <span className="font-semibold text-gray-800">
                    {formatRoleLabel(session.role)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Login:</span>

                  <span className="font-medium text-gray-700">
                    {session.loginAt
                      ? new Date(session.loginAt).toLocaleString()
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Last Activity:
                  </span>

                  <span className="font-medium text-gray-700">
                    {session.lastActivityAt
                      ? new Date(
                          session.lastActivityAt
                        ).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-gray-100 pt-2">
                {isActive ? (
                  <button
                    type="button"
                    onClick={() => onForceLogout(session)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800"
                  >
                    <FaBan />
                    Force Logout
                  </button>
                ) : (
                  <span className="text-xs font-medium text-gray-400">
                    —
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SessionTable;