const SET_REPOS = "SET_REPOS";
const SET_LOADING = "SET_LOADING";

const defaultState: {
  items: any[];
  loading: boolean;
} = {
  items: [],
  loading: false,
};

export const reposReducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case SET_REPOS:
      return {
        ...state,
        items: action.payload.items,
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

export const setRepos = (repos: any) => ({ type: SET_REPOS, payload: repos });
export const setLoading = (loading: boolean) => ({ type: SET_LOADING, payload: loading });
