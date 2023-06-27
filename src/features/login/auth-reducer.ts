import { Dispatch } from 'redux'
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer'
import {LoginType} from "./Login";
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (isLoggedIn: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', isLoggedIn} as const)

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const result = await authAPI.login(data)
        if(result.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
            console.log('ok')
        } else {
            handleServerAppError(result.data, dispatch)
            console.log('error')
        }
    } catch (e) {
        const error = (e as {message: string})
        handleServerNetworkError(error, dispatch)
        console.log(error)
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
