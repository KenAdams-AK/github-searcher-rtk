import { AxiosResponse } from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Repo, ReposResponse } from '../../models/repos.model';
import { parseLink } from '../../heplers/parseLink';

type ArgsT = {
  reposLink: string
  isFirstLoad: boolean
}

type PayloadT = {
  repos: Repo[],
  nextUrl: string,
  isFirstLoad: boolean,
}

type InitialStateT = {
  isLoading: boolean
  isSuccess: boolean
  repos: Repo[]
  nextUrl: string | null
  error: string | null
}

const initialState: InitialStateT = {
  isLoading: false,
  isSuccess: false,
  repos: [],
  nextUrl: null,
  error: null
}

export const fetchRepos = createAsyncThunk('repos/fetchRepos', async ({reposLink, isFirstLoad}: ArgsT, { }) => {
  const params = {
    per_page: 7
  }
  const { data, headers }: AxiosResponse<ReposResponse[]> = isFirstLoad
    ? await axios.get(reposLink, { params })
    : await axios.get(reposLink)
  
  let nextUrl: string = ''
  if (headers.link) {
    nextUrl = parseLink(headers.link)
  }

  // let nextUrl: string = ''
  // const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  // const linkHeader = headers.link
  // const pagesRemaining = linkHeader?.includes(`rel=\"next\"`)

  // if (linkHeader && pagesRemaining) {
  //   const arr = linkHeader.match(nextPattern)
  //   if (arr && arr.length > 0) {
  //     nextUrl = arr[0]
  //   }
    
  // }

  // console.log({nextUrl});
  
  const repos = data.map((repoData) => {
    const repo: Repo = {
      id: repoData.id,
      name: repoData.name,
      forksCount: repoData.forks_count,
      stargazersCount: repoData.stargazers_count,
      repoUrl: repoData.html_url,
    }
    return repo
  })
  
  return {repos, nextUrl, isFirstLoad}
})

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchRepos.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchRepos.fulfilled, (state, action: PayloadAction<PayloadT>) => {
      state.isLoading = false
      state.isSuccess = true
      state.repos = action.payload.isFirstLoad
        ? action.payload.repos
        : [...state.repos, ...action.payload.repos]
      state.nextUrl = action.payload.nextUrl
      state.error = null
    })
    builder.addCase(fetchRepos.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.repos = []
      state.error = action.error.message || 'Something went wrong. Can not get Repos.'
    })
  },
})

export const { } = reposSlice.actions
export default reposSlice.reducer