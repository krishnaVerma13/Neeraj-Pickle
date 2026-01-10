import axios from "axios";
import { API_URL, UpdateProduct } from "../NwConfig";

export default async function UpdateProductApi(id, formData) {
  try {
    const url = API_URL + UpdateProduct + id;

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