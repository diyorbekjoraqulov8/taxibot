const carModels = [
  [
    { text:'Nexia 1',callback_data:'register_car_nexia1' },
    { text:'Nexia 2',callback_data:'register_car_nexia2' },
    { text:'Nexia 3',callback_data:'register_car_nexia3' },
    { text:'Cobalt',callback_data:'register_car_cobalt' }
  ],
  [
    { text:'Malibu',callback_data:'register_car_malibu' },
    { text:'Matiz',callback_data:'register_car_matiz' },
    { text:'Nexia 1',callback_data:'register_car_nexia1' },
    { text:'Nexia 1',callback_data:'register_car_nexia1' }
  ],
]
const carColors = [
  [
    { text:'Qizil',callback_data:'register_car_red' },
    { text:'Yashil',callback_data:'register_car_green' },
    { text:'Sariq',callback_data:'register_car_yellow' },
    { text:'Kulrang',callback_data:'register_car_grey' }
  ]
]

const sendTaxiOrderAcceptIK = [
  [
    {
      text:"Ishni bekor qilish",
      callback_data:`taxiOrderDriver-cancel`
    },
    {
      text:"Ish bajarildi",
      callback_data:`taxiOrderDriver-success`
    },
  ],
  [
    {
      text:"Lakatsiyani olish",
      url: `https://maps.google.com/?q=`
    }, 
  ]
]

module.exports = {
  carModels,
  carColors,
  sendTaxiOrderAcceptIK
}