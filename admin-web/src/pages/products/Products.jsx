import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import ProductTable from "../../components/products/ProductTable";
import ProductModel from "../../components/products/ProductModel";

import {
  getAllProducts,
  updateProductStatus,
} from "../../services/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [statusFilter, setStatusFilter] = useState("active");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "active" ? product.isActive : !product.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  const handleToggleStatus = async (product) => {
    try {
      await updateProductStatus(product._id);
      await fetchProducts();
      alert(`Product ${product.isActive ? "disabled" : "enabled"} successfully.`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update product status.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="mt-1 text-gray-500">Manage all products</p>
          </div>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
        />

        <div className="flex gap-3">
          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "active"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "inactive"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>

        <ProductTable
          products={filteredProducts}
          loading={loading}
          onEdit={handleEditProduct}
          onToggleStatus={handleToggleStatus}
        />

        <ProductModel
          open={isOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onSuccess={fetchProducts}
        />
      </div>
    </DashboardLayout>
  );
};

export default Products;
