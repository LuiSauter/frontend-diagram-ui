import { configureStore } from '@reduxjs/toolkit'

import userSlice from './slices/user.slice'
import workSpaceSlice, { type WorkSpaceState } from './slices/workspace.slice'
import { type User } from '@/modules/dashboard/models/workspace.model'

export interface AppStore {
  user: User
  workspace: WorkSpaceState
}

export const store = configureStore<AppStore>({
  reducer: {
    user: userSlice,
    workspace: workSpaceSlice
  }
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
