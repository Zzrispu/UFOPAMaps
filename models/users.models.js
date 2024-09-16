import mongoose from 'mongoose';

const user = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Adicione o nome do usuário.']
    },
    password: {
        type: String,
        required: [true, 'Adicione a senha do usuário.']
    },
    admin: {
        type: Boolean,
        required: [true, 'Espeficique o cargo do usuário.']
    },
    points: Number
})

const User = mongoose.model('Users', user, 'Users');
export default User;