import React, { useState } from 'react'
import CreateProductApi from '../../../api/AuthAPI/CreateProductApi';

//Material UI
import { green, red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export default function AddProduct() {

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const timer = React.useRef(undefined);

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
        ...(error && {
            bgcolor: red[500],
            '&:hover': {
                bgcolor: red[700],
            },
        }),
    };

    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };


    const [formData, setFormData] = useState({
        name: '',
        category: '',
        packeging: [
            {
                productQuentity: '',
                price: '',
                OrderUnit: '',
                bigPackagSize: '',
                bpPrice: ''
            }
        ],
        image: ''
    });

    const [ImageFile, setImageFile] = useState(null)

    // normal form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // packaging form change
    const handlePackegChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData.packeging];
        updated[index][name] = value;
        setFormData({ ...formData, packeging: updated });
    };

    // Remove a packaging block
    const handleRemovePackeging = (index) => {
        const updated = formData.packeging.filter((_, i) => i !== index);
        setFormData({ ...formData, packeging: updated });
    };

    // Add new packaging block
    const addPackeg = () => {
        setFormData({
            ...formData,
            packeging: [
                ...formData.packeging,
                {
                    productQuentity: '',
                    price: '',
                    OrderUnit: '',
                    bigPackagSize: '',
                    bpPrice: ''
                }
            ]
        });
    };

    // Submit
    const submit = async (e) => {
    e.preventDefault();
    handleButtonClick()

    // ------------ RESET & START LOADING ------------
    setError("");
    setSuccess("");
    setLoading(true);

    try {
        // ------------ VALIDATION ------------
        if (!formData.name || !formData.category || !ImageFile) {
            setError("Please fill all required fields");
            setLoading(false);
            return;
        }

        // ------------ FORM DATA SETUP ------------
        const data = new FormData();
        data.append("name", formData.name);
        data.append("category", formData.category);
        data.append("packeging", JSON.stringify(formData.packeging));
        data.append("product_image", ImageFile);
        
        console.log("formdata :", data);
        
        // ------------ API CALL ------------
        const responce = await CreateProductApi(data);

        if (responce.status === 200) {
            setSuccess("Product created successfully!");
            console.log("Success:", responce);

            // Optional timeout clear
            clearTimeout(timer.current);

            // Clear form
            setFormData({
                name: "",
                category: "",
                packeging: [
                    {
                        productQuentity: "",
                        price: "",
                        OrderUnit: "",
                        bigPackagSize: "",
                        bpPrice: ""
                    }
                ],
            });
            setImageFile(null);
        } else {
            setError("Something went wrong!");
        }

    } catch (err) {
        console.log(err);
        setError("Server error! Please try again.");
    } finally {
        // ------------ STOP LOADING ------------
        setLoading(false);
    }
};


    return (
        <div className="max-w-2xl bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Add Product</h2>

            <form className="mt-3 space-y-3" onSubmit={submit}>

                {/* PRODUCT NAME */}
                <div>
                    <label className="block text-sm">Product name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                </div>

                {/* CATEGORY */}

                <div>
                    <label className="block text-sm">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded bg-white"
                        required

                    >
                        <option value="">Select Category</option>
                        <option value="achar">Achar</option>
                        <option value="murabba & candy">Murabba & Candy</option>
                        <option value="papad">Papad</option>
                        <option value="rice papad">Rice Papad</option>
                        <option value="fry papad">Fry Papad</option>
                        <option value="imported fryums">Imported Fryums</option>
                        <option value="figure fryums">Figur Fryms</option>
                        <option value="noodles">Noodles</option>
                        <option value="other">Other</option>
                        <option value="seasonal">Seasonal</option>
                    </select>
                </div>

                <p className="block text-sm font-medium">Packaging:</p>

                {/* PACKAGING BLOCK */}
                {formData.packeging.map((value, index) => (
                    <div key={index} className="px-5 border py-2 rounded">

                        <div className="w-full flex justify-end">
                            <p
                                onClick={() => handleRemovePackeging(index)}
                                className="cursor-pointer text-red-500 font-bold"
                            >
                                X
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            {/* QUANTITY */}
                            <div>
                                <label className="block text-sm">Quantity</label>
                                <input
                                    name="productQuentity"
                                    type="text"
                                    value={value.productQuentity}
                                    onChange={(e) => handlePackegChange(index, e)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required
                                />
                            </div>

                            {/* PRICE */}
                            <div>
                                <label className="block text-sm">Price (per unit)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={value.price}
                                    onChange={(e) => handlePackegChange(index, e)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required

                                />
                            </div>

                            {/* ORDER UNIT */}
                            <div>
                                <label className="block text-sm">Unit</label>
                                <select
                                    name="OrderUnit"
                                    value={value.OrderUnit}
                                    onChange={(e) => handlePackegChange(index, e)}
                                    className="w-full mt-1 p-2 border rounded bg-white"
                                    required

                                >
                                    <option value="">Select Unit</option>
                                    <option value="KG">KG</option>
                                    <option value="UNIT">UNIT</option>
                                    <option value="JAR">JAR</option>
                                    <option value="PACK">PACK</option>
                                    <option value="TIN">TIN</option>
                                    <option value="CAN">CAN</option>
                                    <option value="BOX">BOX</option>
                                </select>
                            </div>

                            {/* BOX QUANTITY */}
                            <div>
                                <label className="block text-sm">Box Quantity</label>
                                <input
                                    name="bigPackagSize"
                                    type="number"
                                    value={value.bigPackagSize}
                                    onChange={(e) => handlePackegChange(index, e)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required

                                />
                            </div>

                            {/* BOX PRICE */}
                            <div>
                                <label className="block text-sm">Price (Box)</label>
                                <input
                                    name="bpPrice"
                                    type="number"
                                    value={value.bpPrice}
                                    onChange={(e) => handlePackegChange(index, e)}
                                    className="w-full mt-1 p-2 border rounded"
                                    required

                                />
                            </div>

                        </div>
                    </div>
                ))}

                {/* BUTTON to add packaging */}
                <div className="w-full flex justify-end">
                    <button
                        type="button"
                        onClick={addPackeg}
                        className="px-3 py-1 bg-sky-500 text-white rounded"
                    >
                        + Add Packaging
                    </button>
                </div>

                {/* IMAGE */}
                <div>
                    <label className="block text-sm">Image</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        // onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded"
                        required

                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Box sx={{ m: 1, position: 'relative' }}>
                            <Fab
                                aria-label="save"
                                color="primary"
                                sx={buttonSx}
                                onClick={handleButtonClick}
                            >
                                {success ? <CheckIcon /> : error ? <CloseIcon /> : <SaveIcon />}
                            </Fab>

                            {loading && (
                                <CircularProgress
                                    size={68}
                                    sx={{
                                        color: success ? green[500] : error ? red[500] : green[500],
                                        position: 'absolute',
                                        top: -6,
                                        left: -6,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                        </Box> */}

                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                disabled={loading}
                                type="submit"
                            >
                               
                                {success ? "Saved" : error ? "Failed" : "Save Product"}
                            </Button>

                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: success ? green[500] : error ? red[500] : green[500],
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    <button
                        type="reset"
                        onClick={() =>
                            setFormData({
                                name: '',
                                category: '',
                                packeging: [
                                    {
                                        productQuentity: '',
                                        price: '',
                                        OrderUnit: '',
                                        bigPackagSize: '',
                                        bpPrice: ''
                                    }
                                ],
                                image: ''
                            })
                        }
                        className="px-4 py-2 border rounded"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
