import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helper'
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  console.log(action)

  // True -> chỉ thực thi với các lỗi từ server!!!
  if (isRejected(action)) {
    console.log(action)
  }
  if (isRejectedWithValue(action)) {
    if (isPayloadErrorMessage(action.payload)) {
      // Lỗi reject tuwf server chỉ có message thôi

      toast.warn(action.payload.data.error)
    } else if (!isEntityError(action.payload)) {
      toast.warn(action.error.message)
    }
  }

  return next(action)
}
