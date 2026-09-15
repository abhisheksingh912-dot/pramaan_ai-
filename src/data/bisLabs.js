// Official BIS Recognized Laboratories Database in India

export const BIS_LABORATORIES = [
  {
    id: 'LAB-DEL-01',
    name: 'BIS Central Laboratory, Sahibabad',
    type: 'Central Government Laboratory',
    accreditation: 'NABL Accredited (ISO/IEC 17025)',
    city: 'Ghaziabad / Delhi NCR',
    state: 'Uttar Pradesh',
    lat: 28.671,
    lng: 77.378,
    address: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP - 201010',
    phone: '+91 120 2895123',
    email: 'cl-sahibabad@bis.gov.in',
    categories: ['Food & Beverages', 'Electrical', 'Chemical', 'Textile', 'Mechanical'],
    testingCapabilities: [
      'Packaged Drinking Water (IS 14544) Micro-biological & Heavy Metals',
      'Electrical Cables & Wires (IS 694)',
      'Cement Compressive Strength (IS 269)',
      'Toy Heavy Metals Toxicity (IS 9873)'
    ]
  },
  {
    id: 'LAB-MUM-01',
    name: 'BIS Western Regional Office Laboratory, Mumbai',
    type: 'Regional BIS Laboratory',
    accreditation: 'NABL Accredited (ISO/IEC 17025)',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.117,
    lng: 72.863,
    address: 'Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (E), Mumbai - 400093',
    phone: '+91 22 28329295',
    email: 'wrolab@bis.gov.in',
    categories: ['Electronics', 'Electrical', 'Mechanical', 'Consumer Toys'],
    testingCapabilities: [
      'IT Equipment Safety & Power Adapters (IS 13252)',
      'Protective Helmets Impact Drop Test (IS 4151)',
      'Domestic Pressure Cookers (IS 2347)',
      'Gold Fire Assay & Hallmarking Referral'
    ]
  },
  {
    id: 'LAB-BLR-01',
    name: 'BIS Southern Regional Laboratory, Bengaluru',
    type: 'Regional BIS Laboratory',
    accreditation: 'NABL Accredited (ISO/IEC 17025)',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.971,
    lng: 77.594,
    address: 'Peenya Industrial Area 1st Stage, Tumkur Road, Bengaluru - 560058',
    phone: '+91 80 28394931',
    email: 'srolab@bis.gov.in',
    categories: ['Electronics', 'Automotive', 'Electrical', 'Chemical'],
    testingCapabilities: [
      'EV Battery Safety & Thermal Runaway (IS 17855)',
      'Solar Photovoltaic Modules (IS 14286)',
      'Transformers & Switchgear (IS 2026)',
      'Smart Metering Equipment (IS 16444)'
    ]
  },
  {
    id: 'LAB-CHE-01',
    name: 'BIS Branch Laboratory, Chennai',
    type: 'Branch BIS Laboratory',
    accreditation: 'NABL Accredited (ISO/IEC 17025)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.082,
    lng: 80.27,
    address: 'CIT Campus, IV Cross Road, Taramani, Chennai - 600113',
    phone: '+91 44 22541442',
    email: 'chennai-lab@bis.gov.in',
    categories: ['Food & Beverages', 'Textile', 'Mechanical', 'Chemical'],
    testingCapabilities: [
      'Packaged Natural Mineral Water (IS 13428)',
      'Textile Tensile Strength & Color Fastness (IS 199)',
      'Steel Rebars & Structural Steel (IS 1786)'
    ]
  },
  {
    id: 'LAB-KOL-01',
    name: 'BIS Eastern Regional Laboratory, Kolkata',
    type: 'Regional BIS Laboratory',
    accreditation: 'NABL Accredited (ISO/IEC 17025)',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.572,
    lng: 88.363,
    address: '1/14 CIT Scheme VII M, VIP Road, Kankurgachi, Kolkata - 700054',
    phone: '+91 33 23553243',
    email: 'erolab@bis.gov.in',
    categories: ['Chemical', 'Construction', 'Mechanical', 'Food'],
    testingCapabilities: [
      'Jute & Agricultural Packaging (IS 16182)',
      'Portland Slag Cement (IS 455)',
      'Chemical Fertilizer & Pesticide Purity (IS 539)'
    ]
  }
];

// Utility to compute distance between two lat/lng coordinates (Haversine formula)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
