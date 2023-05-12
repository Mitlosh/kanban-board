const SET_REPOS = "SET_REPOS";
const SET_LOADING = "SET_LOADING";

const defaultState: {
  issues: any[] | null;
  loading: boolean;
} = {
  issues: null,
  loading: false,
};

export const reposReducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case SET_REPOS:
      return {
        ...state,
        issues: action.payload.issues,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const setRepos = (issuesArray: any[]) => ({ type: SET_REPOS, payload: issuesArray });
export const setLoading = (loading: boolean) => ({ type: SET_LOADING, payload: loading });
