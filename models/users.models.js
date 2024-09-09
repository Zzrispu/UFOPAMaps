import mongoose from 'mongoose';

const user = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Adicione o nome do usuário.']
    },
    password: {
        type: String,
        required: [true, 'Adicione a senha do usuário.']
    }
})

const User = mongoose.model('Users', user, 'Users');
export default User;