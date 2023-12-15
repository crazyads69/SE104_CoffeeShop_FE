import React, { useState, useEffect } from 'react';
import { set } from 'react-hook-form';
import { Customer } from '../../../hooks/useGetCustomers';
import SelectAllCustomer from '../SelectCustomer/SelectAllCustomer';
import SelectCustomer from '../SelectCustomer/SelectCustomer';
import CustomerDetail from '../CustomerDetail/CustomerDetail';

export interface CustomerTable {
    customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTable) {
    const [showCustomerDetail, setShowCustomerDetail] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const handleShowCustomerDetail = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowCustomerDetail(true);
    };
    return (
        <div className="flex w-full flex-col">
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
                                <SelectAllCustomer />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                MÃ KHÁCH HÀNG
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                TÊN KHÁCH HÀNG
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 font-sans text-[0.9375rem] font-medium text-[#111928]"
                            >
                                SỐ ĐIỆN THOẠI
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Product item */}
                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className="h-[2.3125rem] cursor-pointer border-b border-[#EEE] bg-white hover:bg-gray-200"
                            >
                                <td className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium">
                                    <SelectCustomer customerCode={String(customer.id)} />
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => {
                                        handleShowCustomerDetail(customer);
                                    }}
                                >
                                    {customer.id}
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => {
                                        handleShowCustomerDetail(customer);
                                    }}
                                >
                                    {customer.name}
                                </td>
                                <td
                                    className="select-none px-6 py-4 font-sans text-[0.875rem] font-medium"
                                    onClick={() => {
                                        handleShowCustomerDetail(customer);
                                    }}
                                >
                                    {customer.phone_number}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showCustomerDetail === true && (
                    <CustomerDetail
                        customer={selectedCustomer as Customer}
                        setShowCustomerDetail={setShowCustomerDetail}
                    />
                )}

                {/* Delete selected product modal */}
                {/* {showDeleteProductModal === true && (
                    <DeleteProductList
                        showDeleteProductModal={showDeleteProductModal}
                        setShowDeleteProductModal={setShowDeleteProductModal}
                    />
                )} */}
                {/* Add product modal */}
                {/* {showAddProductModal === true && (
                    <AddProductItem setShowAddProductModal={setShowAddProductModal} />
                )} */}
            </div>
        </div>
    );
}
