require('dotenv').config();
const mongoose = require('mongoose');
const Vendedor = require('./models/Vendedor');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Conectado a MongoDB');
  
  await Vendedor.deleteOne({ email: 'test@urbanstand.com' });
  console.log('�️  Usuario anterior eliminado (si existía)');
  
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
  
  console.log('\n✅ USUARIO DE PRUEBA CREADO EXITOSAMENTE\n');
  console.log('� Email:', 'test@urbanstand.com');
  console.log('� Password:', '12345678');
  console.log('� Nombre:', testUser.firstName, testUser.lastName);
  console.log('� Género:', testUser.genero);
  console.log('� Password hasheada:', testUser.password.substring(0, 30) + '...');
  console.log('\n� Prueba hacer login con estas credenciales\n');
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
