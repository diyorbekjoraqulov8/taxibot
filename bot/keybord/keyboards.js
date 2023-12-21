/* Common */
const phoneShare = [
  [
    {text:'📞 Telefon raqamni yuborish',request_contact: true}
  ]
]
/* Driver */
const menuDriver = [
  [
    {text:'🚗 Ishni boshlash'},
    {text:'Malumotlarim'}
  ],
  [
    {text:'Hisob'},
    {text: "📞 Bog'lanish"}
  ],
  [
    {text: "📦 Mahsulot buyurtma berish"}
  ]
]

const menuDriverWork = [
  [
    {text:'❌ 🚗 Ishni tugatish'},
    {text:'Malumotlarim'}
  ],
  [
    {text:'Hisob'},
    {text: "📞 Bog'lanish"}
  ],
  [
    {text: "📦 Mahsulot buyurtma berish"}
  ]
]
/* Client */
const menuClient = [
  [
    {text: "🚕 Taksi chaqirish"}
  ],
  [
    {text: "📦 Mahsulot buyurtma berish"}
  ],
  [
    {text: "🚗 Haydovchi bo'lish"},
    {text: "📞 Bog'lanish"}
  ]
]
const shareLocation = [
  [
    {text:'📍 Joriy Lokatsiyani yuborish',request_location:true}
  ],
  [
    {text:'🔝 Bosh sahifa'}
  ],
]

module.exports = {
  phoneShare,
  menuDriver,
  menuClient,
  shareLocation,
  menuDriverWork
}