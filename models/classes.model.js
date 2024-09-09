import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    instituto: String,
    graduacoes: Array,
})

const Classes = mongoose.model('Classes', classSchema, 'Classes');
export default Classes;