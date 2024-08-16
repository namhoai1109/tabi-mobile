import { useMutation, useQuery } from "react-query"
import { getFiles, postPresignedFiles } from "./callers"
import { uploadS3 } from "./utils"

const keyFile = {
  fileBatch: "FILE_BATCH",
}

export const usePostBatchFilePresigned = (files: any[]) => {
  return useMutation<TBatchFileResponse, TErrorResponse, TBatchFilePreSignedRequest>({
    mutationKey: keyFile.fileBatch,
    mutationFn: (creation) => {
      return postPresignedFiles(creation)
    },
    onSuccess: (resp) => {
      uploadS3(resp, files)
    },
  })
}

export const useGetFiles = (params: TAttachmentsInfo) => {
  return useQuery({
    queryKey: [keyFile.fileBatch, params.attachment_type, params.field, params.sort_order],
    queryFn: () => {
      return getFiles(params)
    },
  })
}
