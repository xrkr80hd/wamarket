import{folderBrand}from'../lib/location-branding';
export default function LocationBadge({record,records=[],className=''}:any){const brand=folderBrand(record,records);return brand?<img className={'location-badge '+className} src={'/location-badges/'+brand.file+'.png'} alt="" loading="lazy" decoding="async"/>:<span className="shared-folder-icon" aria-hidden="true">▱</span>}
