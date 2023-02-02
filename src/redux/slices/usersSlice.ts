import { Item, SearchResponse} from "../../models/users.model"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { FETCH_USERS_GITHUB_API } from "../../api/endpoints";
import { User, UserResponse } from "../../models/user.model";
import { parseLink } from "../../heplers/parseLink";

type ArgsT = {
  query: string
  isFirstLoad: boolean
}

type PayloadT = {
  users: User[],
  nextUrl: string,
  isFirstLoad: boolean,
}

type InitialStateT = {
  isLoading: boolean
  isSuccess: boolean
  users: User[]
  nextUrl: string | null
  error: string | null
}

const initialState: InitialStateT = {
  isLoading: false,
  isSuccess: false,
  users: [],
  nextUrl: null,
  error: null
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({query, isFirstLoad}: ArgsT, { signal }) => {

  const params = {
    q: `${query} in:login type:user`,
    per_page: 10,
  }

  // ! Canceling the request on promise abort
  // const source = axios.CancelToken.source()
  // signal.addEventListener('abort', () => {
  //   source.cancel()
  // })

  const { data, headers }: AxiosResponse<SearchResponse> = isFirstLoad
    ? await axios.get(FETCH_USERS_GITHUB_API, {
    // cancelToken: source.token,
    params
    })
    : await axios.get(query)

  let nextUrl: string = ''
  if (headers.link) {
    nextUrl = parseLink(headers.link)
  }
  
  const users = await Promise.all(
    data.items.map(async (userData: Item) => {
      const response: AxiosResponse<UserResponse> = await axios.get(userData.url)
      const userInfo = response.data
      const user: User = {
        id: userInfo.id,
        name: userInfo.name,
        login: userInfo.login,
        email: userInfo.email,
        location: userInfo.location,
        bio: userInfo.bio,
        followers: userInfo.followers,
        following: userInfo.following,
        created: userInfo.created_at,
        reposUrl: userInfo.repos_url,
        avatarUrl: userInfo.avatar_url,
        publicRepos: userInfo.public_repos
      }
      return user
      })
  )
  return {users, nextUrl, isFirstLoad }
})


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(fetchUsers.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PayloadT>) => {
      state.isLoading = false
      state.isSuccess = true
      state.users = action.payload.isFirstLoad
        ? action.payload.users
        : [...state.users, ...action.payload.users]
      state.nextUrl = action.payload.nextUrl
      state.error = null
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      console.log(action.error);
      
      state.isLoading = false
      state.isSuccess = false
      state.users = []
      state.error = action.error.message || 'Something went wrong. Can not get Users.'
    })
  },
})

export const { } = usersSlice.actions
export default usersSlice.reducer

