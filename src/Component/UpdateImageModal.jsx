import { useState } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import UpdateProductImageApi from '../api/AuthAPI/UpdateProductImageApi';

export default function UpdateImageModal({ isOpen, onClose, product, onSuccess }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError('');
        setSelectedImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await UpdateProductImageApi(product._id, selectedImage);

            if (response.status === 200) {
                setSuccess('Image updated successfully!');

                // ✅ Call parent success handler immediately
                if (onSuccess) {
                    onSuccess(response.data);
                }

                // ❌ REMOVE the auto-close timeout
                // The parent component will handle closing

            } else {
                setError(response.message || 'Failed to update image');
            }
        } catch (err) {
            console.error(err);
            setError('Server error! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setError('');
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Update Product Image
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Product Info */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Product: <span className="font-medium text-gray-800">{product.name}</span>
                        </p>
                    </div>

                    {/* Current Image */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Image
                        </label>
                        <div className="border rounded-lg p-2 bg-gray-50">
                            {product.image?.url ? (
                                <img
                                    src={product.image.url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded">
                                    <ImageIcon size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Image Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Image
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={loading}
                            />

                            <label
                                htmlFor="imageUpload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <Upload size={48} className="text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, JPEG (max 5MB)
                                </span>
                            </label>
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                <div className="border rounded-lg p-2 bg-gray-50">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={loading || !selectedImage}
                        >
                            {loading ? 'Updating...' : 'Update Image'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}