import React, { useEffect, useState } from 'react'
import getAllProductApi from '../../../api/AuthAPI/getAllproductApi'
import UpdateProductApi from '../../../api/AuthAPI/UpdateProductApi';
import DeleteProductApi from '../../../api/AuthAPI/DeleteProductApi';
import { API_URL } from '../../../api/NwConfig';
import Loader from '../../../Component/Loader';
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2';
import { HiRefresh } from "react-icons/hi";
import UpdateImageModal from '../../../Component/UpdateImageModal';
import { useQueryClient } from '@tanstack/react-query';

export default function AllProducts() {
    //   console.log("all product page :",AllProductData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["product"],
        queryFn: getAllProductApi,
        staleTime: 20 * 60 * 1000, // 20 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })
    const AllProductData = data?.data;
    // console.log("allProduct page : ", AllProductData);

    const [loading, setLoading] = useState(isLoading);
    // console.log("loading :", isLoading);



    //Surch
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    //update modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    //Filter function 
    const filteredData = AllProductData?.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = categoryFilter
            ? item.category.toLowerCase() === categoryFilter.toLowerCase()
            : true; // no filter → show all

        return matchesSearch && matchesCategory;
    });

    // console.log("filter data :", filteredData);
    const [Productdata, setProductdata] = useState(filteredData)

    // const [Productdata, setProductdata] = useState(AllProductData)

    //Handel update!!
    const handleUpdateSubmit = async (updatedProduct) => {
        // console.log("Updated Data:", updatedProduct);
        try {
            const updatedata = await UpdateProductApi(updatedProduct._id, updatedProduct)

            if (!updatedata) {
                return Swal.fire({
                    icon: "error",
                    title: "Network error",
                    text: "Something went wrong!",

                });
            }

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Product Updated Successfully",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                width: "350px"
            });
            setEditModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Handel Delete product
    const handleDeleteProduct = async (pro, index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Remove!",
                    text: "Product has been removed .",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                // console.log("Product id:", pro);
                // console.log("Product index:", index);
                try {
                    const deletepro = await DeleteProductApi(pro)
                    // console.log(deletepro);

                    if (!deletepro) {
                        alert('sonthing wents wrong !!')
                    }
                    alert("Product delete Successfully");
                    setProductdata(Productdata.filter(data => data._id !== pro))
                    setEditModalOpen(false);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleUpdateSuccess = (updatedProduct) => {
        // console.log('Image updated successfully!', updatedProduct);

        // Update the cache directly
        queryClient.setQueryData(["product"], (oldData) => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                data: oldData.data.map(product =>
                    product._id === updatedProduct._id
                        ? updatedProduct
                        : product
                )
            };
        });

        // Show success message
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Image Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            width: "350px"
        });

        // Close the modal
        setIsModalOpen(false);
        setEditProduct(null);
    };



    useEffect(() => {

    }, [])

    return (
        <div className="bg-white rounded shadow p-4">
            {isLoading && <Loader />}
            {!isLoading && (<div>
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">All Products</h2>

                    <div className="flex items-center justify-between mb-3">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-5 py-2 border rounded w-1/2"
                        />

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="">All products</option>
                            <option value="achar">Achar</option>
                            <option value="murabba & candy">Murabba & Candy</option>
                            <option value="papad">Papad</option>
                            <option value="rice papard">Rice Papard</option>
                            <option value="fry papard">Fry Papard</option>
                            <option value="imported fryms">Imported Fryms</option>
                            <option value="figur fryms">Figur Fryms</option>
                            <option value="noodels">Noodels</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="mt-2 overflow-x-auto">
                    <div className='w-full flex'>
                        <div className=''>
                            <p className='font-thin text-nowrap'>Total Product:
                                <span className='font-heading text-lg mx-1'>{filteredData?.length}</span>
                            </p>
                        </div>
                        <div className='flex justify-end w-full'>
                            <button className=" text-xl flex border px-2 rounded-lg py-1" onClick={refetch}>
                                <HiRefresh className='text-xl my-1' /> Refatch !</button>
                        </div>
                    </div>



                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="p-2 border">Image</th>
                                <th className="p-2 border">Product</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border w-1/2">Packaging Details</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData?.slice().reverse().map((item, index) => (
                                <tr key={index} className="border hover:bg-gray-50">

                                    {/* IMAGE */}
                                    <td className="p-2 space-y-2 border">
                                        <img
                                            src={item.image?.url || "loading"}
                                            alt="Loading...."
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                        <div>
                                            <button
                                                onClick={() => { setIsModalOpen(true); setEditProduct(item); }}
                                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                                Update
                                            </button>
                                        </div>
                                    </td>

                                    {/* PRODUCT NAME */}
                                    <td className="p-2 border font-medium">{item?.name || "loading"}</td>

                                    {/* CATEGORY */}
                                    <td className="p-2 border">{item.category}</td>

                                    {/* PACKAGING DETAILS - Redesigned */}
                                    <td className="p-2 border">
                                        <div className="grid gap-3">
                                            {item.packeging?.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gray-100 border border-gray-300 rounded p-2 text-sm shadow-sm"
                                                >
                                                    <p className="font-semibold text-gray-700">
                                                        Packaging {i + 1}
                                                    </p>

                                                    <div className="grid grid-cols-2 text-xs gap-y-1 mt-1">
                                                        <p><b>Quantity:</b> {p.productQuentity}</p>
                                                        <p><b>Price:</b> ₹{p.price}</p>

                                                        <p><b>Order Unit:</b> {p.OrderUnit}</p>
                                                        <p><b>Big Pack Size:</b> {p.bigPackagSize}</p>

                                                        <p><b>Box Price:</b> ₹{p.bpPrice}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* ACTION BUTTONS */}
                                    <td className="p-2 border">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => { setEditProduct(item); setEditModalOpen(true); }}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(item._id, index)}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ====== Image update Popup ========= */}
                <UpdateImageModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditProduct(null);
                    }}
                    product={editProduct}
                    onSuccess={handleUpdateSuccess}
                />

                {editModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white w-[95%] max-w-2xl rounded-xl shadow-xl animate-fadeIn">

                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800">Update Product</h2>
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                                {/* Name */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 font-medium">Product Name</label>
                                    <input
                                        type="text"
                                        value={editProduct?.name}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, name: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 font-medium">Category</label>
                                    <input
                                        type="text"
                                        value={editProduct?.category}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, category: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Packaging Section */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-gray-600 font-medium">
                                            Packaging Details
                                        </label>

                                        {/* ADD PACKAGING BUTTON */}
                                        <button
                                            onClick={() => {
                                                setEditProduct({
                                                    ...editProduct,
                                                    packeging: [
                                                        ...editProduct.packeging,
                                                        {
                                                            productQuentity: "",
                                                            price: "",
                                                            OrderUnit: "",
                                                            bigPackagSize: "",
                                                            bpPrice: ""
                                                        }
                                                    ],
                                                });
                                            }}
                                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                                        >
                                            + Add Packaging
                                        </button>
                                    </div>

                                    {/* PACKAGING ITERATION */}
                                    {editProduct?.packeging?.map((pkg, i) => (
                                        <div
                                            key={i}
                                            className="mt-3 p-4 border rounded-lg bg-gray-50 relative"
                                        >
                                            {/* DELETE BUTTON */}
                                            <button
                                                onClick={() => {
                                                    const updated = editProduct.packeging.filter(
                                                        (_, index) => index !== i
                                                    );
                                                    setEditProduct({ ...editProduct, packeging: updated });
                                                }}
                                                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>

                                            {/* Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Quantity"
                                                    value={pkg.productQuentity}
                                                    onChange={(e) => {
                                                        const updated = [...editProduct.packeging];
                                                        updated[i].productQuentity = e.target.value;
                                                        setEditProduct({ ...editProduct, packeging: updated });
                                                    }}
                                                    className="px-3 py-2 border rounded-lg"
                                                />

                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={pkg.price}
                                                    onChange={(e) => {
                                                        const updated = [...editProduct.packeging];
                                                        updated[i].price = e.target.value;
                                                        setEditProduct({ ...editProduct, packeging: updated });
                                                    }}
                                                    className="px-3 py-2 border rounded-lg"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Order Unit"
                                                    value={pkg.OrderUnit}
                                                    onChange={(e) => {
                                                        const updated = [...editProduct.packeging];
                                                        updated[i].OrderUnit = e.target.value;
                                                        setEditProduct({ ...editProduct, packeging: updated });
                                                    }}
                                                    className="px-3 py-2 border rounded-lg"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Big Pack Size"
                                                    value={pkg.bigPackagSize}
                                                    onChange={(e) => {
                                                        const updated = [...editProduct.packeging];
                                                        updated[i].bigPackagSize = e.target.value;
                                                        setEditProduct({ ...editProduct, packeging: updated });
                                                    }}
                                                    className="px-3 py-2 border rounded-lg"
                                                />

                                                <input
                                                    type="number"
                                                    placeholder="BP Price"
                                                    value={pkg.bpPrice}
                                                    onChange={(e) => {
                                                        const updated = [...editProduct.packeging];
                                                        updated[i].bpPrice = e.target.value;
                                                        setEditProduct({ ...editProduct, packeging: updated });
                                                    }}
                                                    className="px-3 py-2 border rounded-lg col-span-1 md:col-span-2"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => handleUpdateSubmit(editProduct)}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>)}

        </div>
    )
}