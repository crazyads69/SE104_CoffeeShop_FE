import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Product, getProducts } from '../../../api/productAPI';
import SelectProduct from '../SelectProduct/SelectProduct';
import SelectAllProduct from '../SelectProduct/SelectAllProduct';
import { RootState } from '../../../stores/store';
import ProductDetail from '../ProductDetail/ProductDetail';
import DeleteProductList from '../DeleteProduct/DeleteProductList';
import AddProductItem from '../AddProductItem/AddProductItem';

interface ProductTableProps {
    products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
    // State for hold selected product list in table
    const selectedProductsList = useSelector(
        (state: RootState) => state.selectedProduct.selectedProduct,
    );
    // State for track which product is selected to show detail
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    // State for show product detail modal
    const [showProductDetail, setShowProductDetail] = useState<boolean>(false);
    // State for show delete selected product modal
    const [showDeleteProductModal, setShowDeleteProductModal] = useState<boolean>(false);
    // State for show add product modal
    const [showAddProductModal, setShowAddProductModal] = useState<boolean>(true);
    // Disable scroll when modal is open to prevent user from scrolling background
    useEffect(() => {
        if (showProductDetail) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showProductDetail]);
    // Format product price to currency format: 1000000 => 1.000.000
    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('en-US').format(price);
    };
    const handleProductClick = (product: Product) => {
        setShowProductDetail(true);
        setSelectedProduct(product);
    };
    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full flex-row items-center justify-between">
                <h1 className="font-sans text-[1.5rem] font-bold">Hàng hoá</h1>
                <div className="flex flex-row items-center">
                    {/* Xoá hàng hoá */}
                    {/** Only render delete product button if selectedProduct is not empty */}
                    {selectedProductsList.length > 0 && (
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-[#E10E0E] px-[1.5rem]
                    py-[0.75rem]"
                            onClick={() => {
                                setShowDeleteProductModal(true);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="#DFE4EA"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="ml-[0.5rem] font-sans text-[1rem] font-medium text-white">
                                Xoá hàng hoá
                            </p>
                        </button>
                    )}
                    {/* Thêm hàng hoá */}
                    <button
                        type="button"
                        className="ml-[1.25rem] inline-flex items-center rounded-md bg-[#1C3FB7]
                    px-[1.5rem] py-[0.75rem]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#DFE4EA"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <p className="ml-[0.5rem] font-sans text-[1rem] font-medium text-white">
                            Thêm mới
                        </p>
                    </button>
                </div>
            </div>
            {/* Product table */}
            <div
                className="relative mt-[0.94rem] w-full overflow-x-auto rounded-[0.625rem]
shadow-[0px_3px_8px_0px_rgba(0,0,0,0.08)]"
            >
                <table className="w-full text-left rtl:text-right">
                    <thead className="h-[3.75rem] border-b border-[#EEE] bg-[#F9FAFB] font-sans text-[0.9375rem] font-normal text-[#111928]">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                <SelectAllProduct />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                MÃ HÀNG HOÁ
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                TÊN HÀNG HOÁ
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                LOẠI THỰC ĐƠN
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                GIÁ BÁN
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Product item */}
                        {products.map((product) => (
                            <tr
                                key={product.product_code}
                                className="h-[2.3125rem] cursor-pointer border-b border-[#EEE] bg-white hover:bg-gray-200"
                            >
                                <td className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium">
                                    <SelectProduct productCode={product.product_code} />
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => handleProductClick(product)}
                                >
                                    {product.product_code}
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => handleProductClick(product)}
                                >
                                    {product.product_name}
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => handleProductClick(product)}
                                >
                                    {product.product_type}
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => handleProductClick(product)}
                                >
                                    {formatCurrency(product.product_price)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Product detail */}
                {showProductDetail === true && (
                    <ProductDetail
                        product={selectedProduct}
                        setShowProductDetail={setShowProductDetail}
                    />
                )}
                {/* Delete selected product modal */}
                {showDeleteProductModal === true && (
                    <DeleteProductList
                        showDeleteProductModal={showDeleteProductModal}
                        setShowDeleteProductModal={setShowDeleteProductModal}
                    />
                )}
                {/* Add product modal */}
                {showAddProductModal === true && (
                    <AddProductItem setShowAddProductModal={setShowAddProductModal} />
                )}
            </div>
        </div>
    );
}
