import { type WorkspaceItem } from '@/modules/dashboard/models/workspace.model'
import { createSlice } from '@reduxjs/toolkit'

export interface WorkSpaceState {
  workspace: WorkspaceItem
  projectOpen: string
  sheetOpen: string
  collaborators?: any[]
}

const WorkSpaceEmptyState: WorkSpaceState = {
  workspace: {
    id: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    projects: [],
    owner: undefined
  },
  projectOpen: '',
  sheetOpen: '',
  collaborators: []
}

export const workSpaceSlice = createSlice({
  name: 'workspace',
  initialState: WorkSpaceEmptyState,
  reducers: {
    createWorkspace: (state, action) => {
      return {
        ...state,
        workspace: action.payload
      }
    },
    updateWorkspace: (state, action) => {
      return {
        ...state,
        workspace: {
          ...state.workspace,
          ...action.payload
        }
      }
    },
    resetWorkspace: () => {
      return WorkSpaceEmptyState
    },
    setProjectOpen: (state, action) => {
      return { ...state, projectOpen: action.payload }
    },
    setSheetOpen: (state, action) => {
      return { ...state, sheetOpen: action.payload }
    },
    setCollaborators: (state, action) => {
      return { ...state, collaborators: action.payload }
    }
    // updateCollaborators: (state, action) => {
    //   return {
    //     ...state,
    //     collaborators: state.collaborators?.map((collaborator) => {
    //       if (collaborator.id === action.payload.id) {
    //         return {
    //           ...collaborator,
    //           ...action.payload
    //         }
    //       }
    //       return collaborator
    //     })
    //   }
    // }
  }
})

// Action creators are generated for each case reducer function
export const { createWorkspace, updateWorkspace, resetWorkspace, setProjectOpen, setSheetOpen, setCollaborators } = workSpaceSlice.actions

export default workSpaceSlice.reducer
