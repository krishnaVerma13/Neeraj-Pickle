import axios from "axios";
import { API_URL, CreateProduct } from "../NwConfig";

export default async function CreateProductApi(form) {
  try {
    const url = API_URL + CreateProduct;

    const res = await axios.post(url, form, {
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