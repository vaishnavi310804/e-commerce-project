import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import TicketTable from "../../components/tickets/TicketTable";
import TicketDetailsModal from "../../components/tickets/TicketDetailsModal";
import UpdateTicketStatusModal from "../../components/tickets/UpdateTicketStatusModal";
import {
  getAllTickets,
  assignTicket,
} from "../../services/ticketApi";

const ITEMS_PER_PAGE = 10;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [escalatedFilter, setEscalatedFilter] = useState("All");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTicket, setStatusTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (priorityFilter !== "All") {
        params.priority = priorityFilter;
      }

      if (categoryFilter !== "All") {
        params.category = categoryFilter;
      }

      if (escalatedFilter !== "All") {
        params.isEscalated = escalatedFilter === "Escalated";
      }

      const response = await getAllTickets(params);

      console.log("TICKETS RESPONSE:", response);

      setTickets(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [
    statusFilter,
    priorityFilter,
    categoryFilter,
    escalatedFilter,
  ]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved",
  ).length;

  const escalatedTickets = tickets.filter(
    (ticket) => ticket.isEscalated,
  ).length;

  const breachedTickets = tickets.filter(
    (ticket) => ticket.slaBreached,
  ).length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        ticket.category === categoryFilter;

      const matchesEscalation =
        escalatedFilter === "All" ||
        (escalatedFilter === "Escalated"
          ? ticket.isEscalated === true
          : ticket.isEscalated === false);

      return (
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesEscalation
      );
    });
  }, [
    tickets,
    statusFilter,
    priorityFilter,
    categoryFilter,
    escalatedFilter,
  ]);

  const totalPages =
    Math.ceil(filteredTickets.length / ITEMS_PER_PAGE) || 1;

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    statusFilter,
    priorityFilter,
    categoryFilter,
    escalatedFilter,
  ]);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleAssignTicket = async (ticket, assignedTo) => {
    try {
      const response = await assignTicket(
        ticket._id,
        assignedTo,
      );

      const updatedTicket = response?.data || response;

      setTickets((currentTickets) =>
        currentTickets.map((currentTicket) =>
          currentTicket._id === updatedTicket._id
            ? updatedTicket
            : currentTicket,
        ),
      );

      if (
        selectedTicket &&
        selectedTicket._id === updatedTicket._id
      ) {
        setSelectedTicket(updatedTicket);
      }

      await fetchTickets();
    } catch (error) {
      console.error("FAILED TO ASSIGN TICKET:", error);

      alert(
        error.response?.data?.message ||
          "Failed to assign ticket.",
      );
    }
  };

  const handleUpdateTicket = (ticket) => {
    setStatusTicket(ticket);
    setShowStatusModal(true);
  };

  const handleTicketStatusUpdated = async (updatedTicket) => {
    if (!updatedTicket?._id) {
      return;
    }

    setTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket._id === updatedTicket._id
          ? updatedTicket
          : currentTicket,
      ),
    );

    if (
      selectedTicket &&
      selectedTicket._id === updatedTicket._id
    ) {
      setSelectedTicket(updatedTicket);
    }

    setStatusTicket(updatedTicket);
    setShowStatusModal(false);

    await fetchTickets();
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTicket(null);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setStatusTicket(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Ticket Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all customer support tickets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaTicketAlt size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Total Tickets
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {totalTickets}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Open Tickets
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {openTickets}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaClock size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                In Progress
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {inProgressTickets}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaCheckCircle size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Resolved Tickets
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {resolvedTickets}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
              <FaBan size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Escalated
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {escalatedTickets}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-orange-50 p-3 text-orange-600">
              <FaBan size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                SLA Breached
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {breachedTickets}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 shadow">
          {[
            "All",
            "Open",
            "In Progress",
            "Resolved",
            "Closed",
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <TicketTable
          tickets={paginatedTickets}
          loading={loading}
          onViewTicket={handleViewTicket}
          onUpdateTicket={handleUpdateTicket}
        />

        {!loading && filteredTickets.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredTickets.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredTickets.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1),
                  )
                }
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages),
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <TicketDetailsModal
          open={showDetailsModal}
          ticket={selectedTicket}
          onClose={handleCloseDetailsModal}
          onAssign={handleAssignTicket}
          onUpdated={handleTicketStatusUpdated}
          onEscalated={handleTicketStatusUpdated}
        />

        <UpdateTicketStatusModal
          open={showStatusModal}
          ticket={statusTicket}
          onClose={handleCloseStatusModal}
          onUpdated={handleTicketStatusUpdated}
        />
      </div>
    </DashboardLayout>
  );
};

export default Tickets;