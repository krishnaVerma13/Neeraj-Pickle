import axios from "axios";
import { API_URL, UpdateProductImage } from "../NwConfig";

/**
 * Update only product image
 * @param {string} id - product id
 * @param {File} imageFile - selected image file
 */
export default async function UpdateProductImageApi(id, imageFile) {
  try {
    const url = API_URL + UpdateProductImage + id + "/image";

    const formData = new FormData();
    formData.append("product_image", imageFile);

    const res = await axios.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data || error;
  }
}
