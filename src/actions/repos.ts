import axios from "axios";
import { setLoading, setRepos } from "../store/reposReducer";

export const getRepos = (searchQuery = "stars:%3E1") => {
  return async (dispatch: any) => {
    try {
      if (searchQuery === "") {
        searchQuery = "stars:%3E1";
      }
      dispatch(setLoading(true));
      const res = await axios.get(`https://api.github.com/search/repositories?q=${searchQuery}&sort=stars`);
      dispatch(setRepos(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};
