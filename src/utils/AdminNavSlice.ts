import { createSlice } from '@reduxjs/toolkit'

interface NavState {
    ActiveNav : string,
    activeWeeklyMenu: boolean,
}

const initialState : NavState = {
    ActiveNav : 'Base',
    activeWeeklyMenu: false
}

export const AdminNav = createSlice({
  name: 'AdminNav',
  initialState,
  reducers: {
    setNavActive : (state, action) => {
        state.ActiveNav = action.payload
    }

    
  },
})

// Action creators are generated for each case reducer function
export const { setNavActive} = AdminNav.actions

export const AdminNavReducer =  AdminNav.reducer