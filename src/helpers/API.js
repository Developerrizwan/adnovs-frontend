import axios from "axios";
import { smartsightAPI } from "../components/constants/defaultValues";

export default axios.create({
  baseURL: smartsightAPI,
});
