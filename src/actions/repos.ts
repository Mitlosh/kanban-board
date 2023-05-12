import axios from "axios";
import { setLoading, setRepos } from "../store/reposReducer";

export const getRepos = (repoName: string) => {
  return async (dispatch: any) => {
    try {
      // if (searchQuery === "") {
      //   searchQuery = "stars:%3E1";
      // }
      // const res = await axios.get(`https://api.github.com/search/repositories?q=${searchQuery}&sort=stars`);

      dispatch(setLoading(true));
      const response = await axios.get(`https://api.github.com/repos/${repoName}/issues`);
      dispatch(setRepos(response.data));
      console.log("Call response:", response.data);
    } catch (err) {
      console.log(err);
    }
  };
};
