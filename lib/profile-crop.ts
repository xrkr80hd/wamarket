export type CropPixels={x:number;y:number;width:number;height:number};
export function rotatedSize(width:number,height:number,degrees:number){const a=degrees*Math.PI/180;return {width:Math.abs(Math.cos(a)*width)+Math.abs(Math.sin(a)*height),height:Math.abs(Math.sin(a)*width)+Math.abs(Math.cos(a)*height)}}
export async function croppedAvatar(source:string,crop:CropPixels,rotation=0):Promise<Blob>{
 if(!Number.isFinite(crop.width)||crop.width<=0||crop.height<=0)throw Error('Position the photo before saving');
 const image=new Image();image.src=source;await image.decode();
 if(image.naturalWidth*image.naturalHeight>40_000_000)throw Error('Choose a smaller photo (under 40 megapixels)');
 const bounds=rotatedSize(image.naturalWidth,image.naturalHeight,rotation);const work=document.createElement('canvas');work.width=Math.ceil(bounds.width);work.height=Math.ceil(bounds.height);const ctx=work.getContext('2d');if(!ctx)throw Error('Your browser cannot process this image');
 ctx.translate(work.width/2,work.height/2);ctx.rotate(rotation*Math.PI/180);ctx.drawImage(image,-image.naturalWidth/2,-image.naturalHeight/2);
 const result=document.createElement('canvas');result.width=512;result.height=512;const out=result.getContext('2d');if(!out)throw Error('Image export is unavailable');out.imageSmoothingEnabled=true;out.imageSmoothingQuality='high';out.drawImage(work,crop.x,crop.y,crop.width,crop.height,0,0,512,512);work.width=1;work.height=1;
 return new Promise((resolve,reject)=>result.toBlob(b=>b?resolve(b):reject(Error('Unable to export this crop')),'image/png'));
}
