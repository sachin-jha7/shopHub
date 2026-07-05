import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';



const generateToken = (userId, fullName) => {
    return jwt.sign(
        { id: userId, userName: fullName },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}


const signUp = async (req, res) => {

    try {
        let { fullName, email, password } = req.body;

        if (fullName == '' || email == '' || password == '') {
            return res.status(422).json({ message: 'Invalid input!' });
        }
        fullName = fullName.trim();
        email = email.trim();
        password = password.trim();
        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return res.status(409).json({ message: 'User already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        const accessToken = generateToken(newUser._id, fullName);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        req.user = newUser._id;

        return res.status(201).json({ message: `Welcome to ShopHub!` });

    } catch (err) {
        console.log(err)
    }
}



const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (email == '' || password == '') {
            return res.status(422).json({ message: 'Invalid input!' });
        }
        email = email.trim();
        password = password.trim();

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(409).json({ message: "User doesn't exists!" });
        }

        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong email or password!' });
        }
        const accessToken = generateToken(userExist._id, userExist.fullName);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({ message: "Welcome Back!" });
    } catch (err) {
        console.log(err);
    }
}

const verify = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(400).json({ message: "Token not found!" });
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (err) {
        console.log(err)
    }
}

const logout = (req, res) => {
    res.clearCookie("accessToken");
    return res.status(201).json({ message: "Successfully logged out!" });
}

export default { login, logout, signUp, verify };