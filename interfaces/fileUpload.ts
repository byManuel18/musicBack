export interface I_FileUpload {
    name: string,
    data: any,
    encoding: string,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,
    mv: Function,
}