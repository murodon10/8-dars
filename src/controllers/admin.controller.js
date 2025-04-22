console.log("");


import Admin from '../models/admin.model.js';
import { adminValidator } from '../utils/admin.validation.js';
import { catchError } from '../utils/error-response.js';
import { decode, encode } from '../utils/bcrypt-encrypt.js';
import jwt from 'jsonwebtoken';

export class AdminController {
    async createAdmin(req, res) {
        try {
            const { error, value } = adminValidator(req.body);
            if (error) {
                throw new Error(`Admin ma'lumotlari xato kiritildi: ${error}`);
            }
            const {username, password, role} = value
            const hashedPassword = await decode(password, 7)
            const newAdmin = await Admin.create({
                username, hashedPassword, role
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'Admin created successfully',
                data: newAdmin
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async signinAdmin(req, res){
        try {
            const {username, password} = req.body;
            const admin = await Admin.findOne({username})
            if(!admin) {
                throw new Error("Username not found")
            }
            const matchPassword = await encode(password, admin.hashedPassword);
            if(!matchPassword){
                throw new Error("Invalid password")
            }
            const payload = {id: admin._id, role: admin.role};
            const token = jwt.sign(payload, process.env.ACCSES_TOKEN_KEY, {expiresIn: process.env.ACCSES_TOKEN_TIME})   
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token
                }
            });
        } catch (error) {
            catchError(error, res);
        }
    }

    async getAllAdmin(_, res){
        try {
            const admins = await Admin.find();
        return res.status(200).json({
            statusCode: 200,
            message: 'Succses',
            data: admins
        })
        } catch (error) {
            catchError(error, res)
        }
    }
    async getAdminById(req, res) {
        try {
            const admin = await Admin.findById(req.params.id);
            if(!admin){
                throw new Error("Admin not found")
            }
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: admin
            });
        } catch (error) {
            catchError(error, res)
        }
    }

    async update (req, res) {
        try {
            const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if(!admin){
                throw new Error("Admin not found")
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: admin
            })
        } catch (error) {
            catchError(error, res);
        }
    }

    async delete(req, res) {
        try {
            const admin = await Admin.findByIdAndDelete(req.params.id)
            if(!admin){
                throw new Error("Admin not found")
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: admin
            })
        } catch (error) {
            catchError(error, res)
        }
    }

};
