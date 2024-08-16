type TFilePreSignedRequest = {
  file_name: string
  attachment_id: number
  attachment_type: string
  content_type: string
  file_size: number
  field: string
  sort_order?: number
}

type TAttachmentsInfo = {
  attachment_id_in: number[]
  attachment_type: string
  field: string
  sort_order?: number
}

type TAttachmentInfo = {
  attachment_id: number
  attachment_type: string
  field: string
  sort_order?: number
}

type TBatchFilePreSignedRequest = {
  data: TFilePreSignedRequest[]
}

type TFileResponse = {
  id: string
  created_at: string
  path_name: string
  file_name: string
  field: string
  attachment_id: string
  attachment_type: string
  get_url: string
  upload_url: string
  sort_order: string
}

type TBatchFileResponse = {
  data: TFileResponse[]
}

type TUploadS3<TResp> = (resp: TResp, files: UploadFile[]) => void
