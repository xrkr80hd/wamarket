import{addAsset,fileURL,readFile}from'./preview-store';
export interface AssetStorage{kind:string;upload(file:File,metadata?:any):Promise<string>;playback(id:string):Promise<string>;original(id:string):Promise<Blob|undefined>}
export const localStorageAdapter:AssetStorage={kind:'Local demo · not in Google Drive',upload:addAsset,playback:fileURL,original:readFile};
export const driveConnection={connected:false,status:'Google Drive unavailable — local demo storage',rootFolderId:null};
