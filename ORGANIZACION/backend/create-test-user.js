require('dotenv').config();
const mongoose = require('mongoose');
const Vendedor = require('./models/Vendedor');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('âœ… Conectado a MongoDB');
  
  await Vendedor.deleteOne({ email: 'test@urbanstand.com' });
  console.log('í·‘ï¸  Usuario anterior eliminado (si existÃ­a)');
  
  const testUser = new Vendedor({
    firstName: 'Maria',
    lastName: 'Perez',
    email: 'test@urbanstand.com',
    password: '12345678',
    numDoc: '9876543210',
    NumTel: '3009876543',
    TypeDoc: 'CC',
    genero: 'femenino',
    selectedProducts: ['Comidas preparadas'],
    direccion: 'Calle Test 123',
    rivi: 'test-rivi.jpg',
    vigencia: 'activo'
  });
  
  await testUser.save();
  
  console.log('\nâœ… USUARIO DE PRUEBA CREADO EXITOSAMENTE\n');
  console.log('í³§ Email:', 'test@urbanstand.com');
  console.log('í´‘ Password:', '12345678');
  console.log('í±¤ Nombre:', testUser.firstName, testUser.lastName);
  console.log('íº» GÃ©nero:', testUser.genero);
  console.log('í´ Password hasheada:', testUser.password.substring(0, 30) + '...');
  console.log('\ní¾¯ Prueba hacer login con estas credenciales\n');
  
  process.exit(0);
}).catch(err => {
  console.error('âŒ Error:', err);
  process.exit(1);
});
