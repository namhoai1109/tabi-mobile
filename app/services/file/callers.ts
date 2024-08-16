import { AxiosResponse } from "axios"
import { fileRequest } from "../axios"
import { GET_FILES_PATH, UPLOAD_PRESIGNED_PATH } from "./paths"

export const postPresignedFiles = async (creation: TBatchFilePreSignedRequest) => {
  return fileRequest.post<any, AxiosResponse<any>>(UPLOAD_PRESIGNED_PATH, {
    data: creation,
  })
}

export const getFiles = async (params: TAttachmentsInfo) => {
  const fParams = encodeURIComponent(
    JSON.stringify({
      attachment_id__in: params.attachment_id_in,
      attachment_type: params.attachment_type,
      field: params.field,
    }),
  )
  return fileRequest.get<TBatchFileResponse, AxiosResponse<TBatchFileResponse>>(
    `${GET_FILES_PATH}?f=${fParams}`,
  )
}
