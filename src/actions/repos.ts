import axios from "axios";
import { setLoading, setRepos } from "../store/reposReducer";

export const getRepos = (repoName: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`https://api.github.com/repos/${repoName}/issues`);
      dispatch(setRepos(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};
