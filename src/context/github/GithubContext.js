import { useReducer, createContext } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
    const initalState = {
        users: [],
        user: {},
        repos: {},
        loading: false,
    };

    const [state, dispatch] = useReducer(githubReducer, initalState);

    // Get inital users (For testing )
    const fetchUsers = async () => {
        setLoading();
        const response = await fetch(`${GITHUB_URL}/users`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        const data = await response.json();

        dispatch({
            type: "GET_USERS",
            payload: data,
        });
    };
    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text,
        });

        const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        const { items } = await response.json();

        dispatch({
            type: "GET_USERS",
            payload: items,
        });
    };
    // get data for a single user
    const getUser = async (login) => {
        setLoading();
        // https://api.github.com/users/username
        const response = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        if (response.status === 404) {
            window.location = "/notfound";
        } else {
            const data = await response.json();

            dispatch({
                type: "GET_USER",
                payload: data,
            });
        }
    };
    const clearUsers = () =>
        dispatch({
            type: "CLEAR_USERS",
        });
    //set loading
    const setLoading = () => dispatch({ type: "SET_LOADING" });

    // get user repos
    const getRepos = async (login) => {
        setLoading();
        // https://api.github.com/users/username/repos
        const response = await fetch(`${GITHUB_URL}/users/${login}/repos`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        if (response.status === 404) {
            window.location = "/notfound";
        } else {
            const data = await response.json();

            dispatch({
                type: "GET_REPOS",
                payload: data,
            });
        }
    };
    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                loading: state.loading,
                fetchUsers,
                searchUsers,
                clearUsers,
                user: state.user,
                getUser,
                getRepos,
                repos: state.repos,
            }}>
            {children}
        </GithubContext.Provider>
    );
};

export default GithubContext;
