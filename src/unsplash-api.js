import axios from "axios";

const ACCESS_KEY = "O16h2LLLiG7M7l96QwWTuuM3iMLqdiuzGJMyO-o4xiM";
axios.defaults.baseURL = "https://api.unsplash.com";

export const fetchImagesByQuery = async (query, page) => {
  const response = await axios.get("/search/photos", {
    params: {
      client_id: ACCESS_KEY,
      query,
      page,
      per_page: 15,
      orientation: "landscape",
    },
  });
  return response.data;
};

export const getDownloadLink = async (link) => {
  const response = await axios.get(link, { params: { client_id: ACCESS_KEY } });
  return response.data.url;
};
