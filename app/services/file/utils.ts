// import { UploadFile, message } from "antd";

export const convertToFileRequest = (
  // file: UploadFile,
  file: any,
  attachment_id: number,
  attachment_type: string,
  field: {
    thumbnail: string
  },
  sort_order?: number,
) => {
  const fileReq: TFilePreSignedRequest = {
    file_name: file.name,
    attachment_id,
    attachment_type,
    content_type: file.type as string,
    file_size: file.size as number,
    field,
    sort_order,
  }

  return fileReq
}

export const convertToBatchFileRequest = (
  // files: UploadFile[],
  files: any[],
  attachmentInfo: TAttachmentInfo,
): TBatchFilePreSignedRequest => {
  return {
    data: files.map((file, index) =>
      convertToFileRequest(
        file,
        attachmentInfo.attachment_id,
        attachmentInfo.attachment_type,
        attachmentInfo.field,
        index,
      ),
    ),
  }
}

export const uploadS3 = async (
  resp: TBatchFileResponse,
  // files: UploadFile[]
  files: any[],
) => {
  for (let index = 0; index < resp.data.length; index++) {
    const fileResp = resp.data[index]
    const uploadUrl = fileResp.upload_url
    const fileReq = files[index]
    const opt = {
      method: "PUT",
      body: fileReq.originFileObj as Blob,
    }
    try {
      await fetch(uploadUrl, opt)
    } catch (err) {
      // message.error("Upload fail with file name " + fileReq.fileName);
    }
  }
}
