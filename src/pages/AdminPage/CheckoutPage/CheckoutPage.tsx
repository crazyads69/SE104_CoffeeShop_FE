import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../../layout/AdminLayout/AdminLayout';
import Loading from '../../../components/Loading/Loading';
import FilterPill from '../../../components/Admin/FilterPill/FilterPill';
import { RootState } from '../../../stores/store';
import ProductGallery from '../../../components/Admin/ProductGallery/ProductGallery';
import useGetProducts, { Product } from '../../../hooks/useGetProducts';
import useGetTotalPage from '../../../hooks/useGetTotalPage';
import fuzzyMatch, { formatCurrency } from '../../../utils/customFunction';
import { setProducts } from '../../../stores/slices/productSlice';
import Pagination from '../../../components/Admin/Pagination/Pagination';
import BillingItem from '../../../components/Admin/BillingItem/BillingItem';
import { clearCheckoutList, updateTotalPrice } from '../../../stores/slices/checkoutSlice';
import { useAuth } from '../../../provider/AuthProvider';
import NoteBill from '../../../components/Admin/NoteBill/NoteBill';
import ConfirmPayment from '../../../components/Admin/CofirmPayment/ConfirmPayment';
import CheckoutDetail from '../../../components/Admin/CheckoutDetail/CheckoutDetail';

export default function CheckoutPage() {
    // State for hold product type
    const { user } = useAuth();
    const [selectedProductType, setSelectedProductType] = useState<string>('');
    const [showNote, setShowNote] = useState<boolean>(false);
    const [activePage, setActivePage] = useState<number>(1);
    const [filterProductList, setFilterProductList] = useState<Product[]>([]);
    // State for confirmation payment modal
    const [showConfirmationPaymentModal, setShowConfirmationPaymentModal] =
        useState<boolean>(false);
    // State for show detail checkout modal
    const [showDetailCheckoutModal, setShowDetailCheckoutModal] = useState<boolean>(false);

    // State for hold search value
    const { totalPage } = useGetTotalPage('/products');
    const [searchValue, setSearchValue] = useState<string>('');
    const products = useSelector((state: RootState) => state.product.products);
    const { productsList, loading, getProducts } = useGetProducts();
    const checkouts = useSelector((state: RootState) => state.checkout.checkoutList);
    const noteValue = useSelector((state: RootState) => state.checkout.checkoutList.note);
    const dispatch = useDispatch();
    // Callculate total price of all product in checkout list
    useEffect(() => {
        let totalPrice = 0;
        checkouts.items.forEach((item) => {
            totalPrice += item.quantity * item.unit_price;
        });
        dispatch(updateTotalPrice(totalPrice));
    }, [checkouts.items]);
    // // Update product list when active page change
    useEffect(() => {
        dispatch(setProducts(productsList));
        setFilterProductList(products);
    }, []);
    // Update product list when search value and product type change
    useEffect(() => {
        let filteredProductList = filterByProductType(products, selectedProductType);

        filteredProductList = filterBySearchValue(filteredProductList, searchValue);
        setFilterProductList(filteredProductList);
    }, [selectedProductType, searchValue, filterProductList, products]);
    const filterBySearchValue = (products: Product[], searchValue: string) => {
        return products.filter(
            (product) =>
                fuzzyMatch(product.name, searchValue) ||
                fuzzyMatch(searchValue, product.name) ||
                fuzzyMatch(String(product.id), searchValue) ||
                fuzzyMatch(searchValue, String(product.id)),
        );
    };
    const filterByProductType = (products: Product[], selectedProductType: string) => {
        return products.filter((product) => {
            if (selectedProductType === '') return true;
            return product.type === selectedProductType;
        });
    };
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <AdminLayout className="relative flex-row items-start justify-start pb-[0.19rem] pl-[0.63rem] pr-[0.63rem] pt-[0.56rem]">
                    {showConfirmationPaymentModal && (
                        <ConfirmPayment
                            showConfirmationPaymentModal={showConfirmationPaymentModal}
                            setShowConfirmationPaymentModal={setShowConfirmationPaymentModal}
                            showDetailCheckoutModal={showDetailCheckoutModal}
                            setShowDetailCheckoutModal={setShowDetailCheckoutModal}
                        />
                    )}
                    {/** Checkout UI */}
                    <div className="flex h-fit w-full items-start justify-start rounded-b-[0.8125rem] bg-[#FEFEFE] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        {/** Checkout Left Menu */}
                        <div className="flex h-fit w-3/5 flex-col items-start justify-center pb-[0.19rem] pl-[0.68rem] pr-[0.69rem] pt-[1.31rem]">
                            <FilterPill
                                selectedProductType={selectedProductType}
                                setSelectedProductType={setSelectedProductType}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                            />
                            <ProductGallery products={filterProductList} />
                            <div className="mt-[0.75rem] flex h-fit w-full flex-row items-center justify-center">
                                {totalPage > 1 && (
                                    <Pagination
                                        path="/checkout"
                                        activePage={activePage}
                                        setActivePage={setActivePage}
                                        totalPage={totalPage}
                                    />
                                )}
                            </div>
                        </div>
                        {/** Checkout Right Menu (Billing Item) */}
                        <div className="ml-[1.12rem] flex h-[40rem] w-2/5 flex-col items-center justify-start border-l border-black">
                            {/** Remove All Billing Item */}

                            {checkouts.items.length > 0 && (
                                <button
                                    type="button"
                                    className=" mx-[0.5rem] my-[0.5rem] inline-flex items-center self-end rounded-md
                    bg-[#E10E0E] px-[1.5rem] py-[0.75rem]"
                                    onClick={() => {
                                        dispatch(clearCheckoutList());
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
                                        Xoá tất cả
                                    </p>
                                </button>
                            )}
                            {/** Billing Item */}
                            <div className="flex h-[35.38rem] w-full flex-col items-center justify-start overflow-y-scroll">
                                {checkouts.items.map((item) => (
                                    <BillingItem
                                        productPrice={item.unit_price}
                                        key={item.productID}
                                        productID={item.productID}
                                        quantity={item.quantity}
                                    />
                                ))}
                            </div>
                            {/** Total Price */}
                            <div className="flex h-fit w-full flex-col items-start justify-start border-t border-black">
                                {/** Total Price Label */}
                                <div className="flex h-fit w-full flex-row items-center justify-between  px-[0.56rem] py-[0.37rem]">
                                    <div className="flex h-fit w-[10rem] items-center justify-center rounded-full bg-[#E0E3E8] px-[0.5rem] py-[0.25rem]">
                                        <p className="font-sans text-[1rem] font-bold text-black">
                                            {user?.name}
                                        </p>
                                    </div>
                                    {/** Note for bill */}
                                    <div
                                        onClick={() => {
                                            if (checkouts.items.length > 0) setShowNote(true);
                                        }}
                                        className={`${
                                            noteValue ? 'bg-blue-gray-700' : 'bg-[#F1F1F2]'
                                        } flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                    </div>
                                    <div className="grid grid-cols-2 grid-rows-1 gap-1">
                                        <p className="font-sans text-[1rem] font-bold text-black">
                                            Tổng tiền:
                                        </p>

                                        <p className="col-start-2 font-sans text-[1rem] font-bold text-black">
                                            {formatCurrency(checkouts.totalPrice)}
                                        </p>
                                    </div>
                                </div>
                                {/** Payment Button */}
                                {checkouts.items.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowConfirmationPaymentModal(true);
                                        }}
                                        className="mx-[0.5rem] mb-[1rem] mt-[0.5rem] inline-flex items-center self-end rounded-md
                    bg-[#12582E] px-[1.75rem] py-[0.81rem] text-white "
                                    >
                                        Thanh toán
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {showNote && checkouts.items.length > 0 && (
                        <NoteBill showNote={showNote} setShowNote={setShowNote} />
                    )}
                    {showDetailCheckoutModal && (
                        <CheckoutDetail
                            showDetailCheckoutModal={showDetailCheckoutModal}
                            setShowDetailCheckoutModal={setShowDetailCheckoutModal}
                        />
                    )}
                </AdminLayout>
            )}
        </>
    );
}
