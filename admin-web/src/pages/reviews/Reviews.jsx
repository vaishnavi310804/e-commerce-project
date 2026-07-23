import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ReviewStatsCards from "../../components/reviews/ReviewStatsCards";
import ReviewFilters from "../../components/reviews/ReviewFilters";
import ReviewTable from "../../components/reviews/ReviewTable";
import ReviewDetailsModal from "../../components/reviews/ReviewDetailsModal";
import DeleteReviewModal from "../../components/reviews/DeleteReviewModal";
import {
  getAllReviews,
  getReviewStats,
  toggleHideReview,
  deleteReview,
  bulkHideReviews,
  bulkDeleteReviews,
} from "../../services/reviewApi";

const ITEMS_PER_PAGE = 10;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");

  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        getAllReviews({
          search: searchTerm,
          rating: ratingFilter,
          status: statusFilter,
          sort: sortFilter,
        }),
        getReviewStats(),
      ]);
      setReviews(reviewsRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [searchTerm, ratingFilter, statusFilter, sortFilter]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, ratingFilter, statusFilter, sortFilter]);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE) || 1;
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReviews.map((r) => r._id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRatingFilter("all");
    setStatusFilter("all");
    setSortFilter("newest");
  };

  const handleToggleHide = async (rev) => {
    try {
      const res = await toggleHideReview(rev._id);
      showToast(res.message || "Review status updated.");

      setReviews((prev) =>
        prev.map((r) => (r._id === rev._id ? { ...r, isHidden: !r.isHidden } : r))
      );

      if (selectedReview && selectedReview._id === rev._id) {
        setSelectedReview((prev) => ({
          ...prev,
          isHidden: !prev.isHidden,
        }));
      }

      const statsRes = await getReviewStats();
      setStats(statsRes.data || {});
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update review status.");
    }
  };

  const handleOpenDeleteSingle = (rev) => {
    setDeleteTarget(rev);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget(null);
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      if (isBulkDelete) {
        await bulkDeleteReviews(selectedIds);
        showToast(`Deleted ${selectedIds.length} reviews.`);
        setSelectedIds([]);
      } else if (deleteTarget) {
        await deleteReview(deleteTarget._id);
        showToast("Review deleted successfully.");
        if (selectedReview && selectedReview._id === deleteTarget._id) {
          setIsDetailsOpen(false);
        }
      }
      setIsDeleteModalOpen(false);
      await fetchReviewData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkHide = async (isHidden) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkHideReviews(selectedIds, isHidden);
      showToast(
        `Selected reviews ${isHidden ? "hidden" : "unhidden"} successfully.`
      );
      setSelectedIds([]);
      await fetchReviewData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed bulk update.");
    }
  };

  const handleViewReview = (rev) => {
    setSelectedReview(rev);
    setIsDetailsOpen(true);
  };

  const handleExportCSV = () => {
    if (!reviews || reviews.length === 0) {
      alert("No reviews available to export.");
      return;
    }

    const headers = [
      "Review ID",
      "Product",
      "Customer",
      "Rating",
      "Comment",
      "Status",
      "Date",
    ];

    const rows = reviews.map((r) => [
      r._id,
      `"${r.product?.name || ""}"`,
      `"${r.user?.fullName || r.user?.name || ""}"`,
      r.rating,
      `"${(r.comment || r.review || "").replace(/"/g, '""')}"`,
      r.isHidden ? "Hidden" : "Visible",
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reviews_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Exported reviews CSV successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-2xl transition">
            {toastMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
            <p className="mt-1 text-gray-500">
              Moderate and manage customer product ratings and reviews
            </p>
          </div>
        </div>

        <ReviewStatsCards stats={stats} />

        <ReviewFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          ratingFilter={ratingFilter}
          onRatingChange={setRatingFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortFilter={sortFilter}
          onSortChange={setSortFilter}
          selectedCount={selectedIds.length}
          onBulkHide={() => handleBulkHide(true)}
          onBulkUnhide={() => handleBulkHide(false)}
          onBulkDelete={handleOpenBulkDelete}
          onReset={handleResetFilters}
          onExportCSV={handleExportCSV}
        />

        <ReviewTable
          reviews={paginatedReviews}
          loading={loading}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onViewReview={handleViewReview}
          onToggleHide={handleToggleHide}
          onDeleteReview={handleOpenDeleteSingle}
        />

        {!loading && reviews.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, reviews.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {reviews.length}
              </span>{" "}
              reviews
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

        <ReviewDetailsModal
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          review={selectedReview}
          onToggleHide={handleToggleHide}
          onDelete={handleOpenDeleteSingle}
        />

        <DeleteReviewModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          review={deleteTarget}
          isBulk={isBulkDelete}
          bulkCount={selectedIds.length}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
