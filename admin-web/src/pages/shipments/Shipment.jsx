import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FaUndoAlt,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaRupeeSign,
  FaTruck,
  FaCog,
  FaPlus,
  FaOpencart,
  FaBoxOpen,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import ShipmentTable from "../../components/shipments/ShipmentTable";
import ShipmentDetailsModal from "../../components/shipments/ShipmentDetailsModal";
import UpdateShipmentStatus from "../../components/shipments/UpdateShipmentStatus";
import CreateShipmentModal from "../../components/shipments/CreateShipmentModal";
import {
  getAllShipments,
  getShipmentDetails,
} from "../../services/shipmentApi";
import { getAllOrders } from "../../services/orderApi";

const ITEMS_PER_PAGE = 10;
const Shipment = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllShipments();
      setShipments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
    fetchOrders();
  }, [fetchShipments, fetchOrders]);

  const totalShipments = shipments.length;

  const pendingShipments = shipments.filter(
    (shipment) => shipment.status === "Pending",
  ).length;

  const processingShipments = shipments.filter(
    (shipment) => shipment.status === "Processing",
  ).length;

  const inTransitShipments = shipments.filter((shipment) =>
    ["Shipped", "In Transit", "Out for Delivery"].includes(shipment.status),
  ).length;

  const deliveredShipments = shipments.filter(
    (shipment) => shipment.status === "Delivered",
  ).length;

  const failedShipments = shipments.filter(
    (shipment) =>
      shipment.status === "Failed" || shipment.status === "Cancelled",
  ).length;

  const filteredShipments = useMemo(() => {
    if (statusFilter === "All") {
      return shipments;
    }

    if (statusFilter === "In Transit") {
      return shipments.filter((shipment) =>
        ["Shipped", "In Transit", "Out for Delivery"].includes(shipment.status),
      );
    }

    return shipments.filter((shipment) => shipment.status === statusFilter);
  }, [shipments, statusFilter]);

  const eligibleOrders = useMemo(() => {
  const activeShipmentOrderIds = new Set(
    shipments
      .filter(
        (shipment) =>
          !["Cancelled", "Failed"].includes(shipment.status),
      )
      .map((shipment) => shipment.order?._id)
      .filter(Boolean)
      .map((id) => id.toString()),
  );

  return orders.filter((order) => {
    if (order.orderStatus === "Cancelled") {
      return false;
    }

    return !activeShipmentOrderIds.has(order._id?.toString());
  });
}, [orders, shipments]);

  const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) || 1;
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleViewShipment = async (shipment) => {
    try {
      const response = await getShipmentDetails(shipment._id);
      setSelectedShipment(response.data);
      setShowShipmentDetails(true);
    } catch (error) {
      console.error("Failed to fetch shipment details:", error);
    }
  };

  const handleCloseShipmentDetails = () => {
    setShowShipmentDetails(false);
    setSelectedShipment(null);
  };
  const handleUpdateStatus = (shipment) => {
    setSelectedShipment(shipment);
    setShowUpdateStatus(true);
  };
  const handleCreateShipment = async () => {
    await fetchOrders();
    setShowCreateShipment(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Shipment Dashboard
            </h1>
            <p className="mt-1 text-gray-500">Manage all the Shipments.</p>
          </div>
          <button
            onClick={handleCreateShipment}
            className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <FaPlus /> Create Shipment
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaBoxOpen size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Total Shipments
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {totalShipments}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Pending</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {pendingShipments}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaCog size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Processing</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {processingShipments}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-yellow-50 p-3 text-yellow-600">
              <FaTruck size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">In Transit</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {inTransitShipments}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
              <FaCheckCircle size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Delivered</p>

              <h3 className="truncate text-2xl font-bold text-gray-800">
                {deliveredShipments}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
              <FaBan size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Failed</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {failedShipments}
              </h3>
            </div>
          </div>
        </div>

        <ShipmentTable
          shipments={paginatedShipments}
          loading={loading}
          onViewShipment={handleViewShipment}
          onUpdateStatus={handleUpdateStatus}
        />
        {!loading && filteredShipments.length > 0 && (
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
                  filteredShipments.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredShipments.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <ShipmentDetailsModal
          open={showShipmentDetails}
          shipment={selectedShipment}
          onClose={handleCloseShipmentDetails}
        />

        <UpdateShipmentStatus
          open={showUpdateStatus}
          shipment={selectedShipment}
          onClose={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
          }}
          onSuccess={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
            fetchShipments();
          }}
        />

        <CreateShipmentModal
          open={showCreateShipment}
          orders={eligibleOrders}
          onClose={() => setShowCreateShipment(false)}
          onSuccess={() => {
            setShowCreateShipment(false);
            fetchShipments();
            fetchOrders();
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default Shipment;
