import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, Nullable } from '@/types'

interface UserState {
  user: Nullable<User>
  isLoggedIn: boolean
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoggedIn = true
    },
    clearUser: (state) => {
      state.user = null
      state.isLoggedIn = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer 