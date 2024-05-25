import jwt from 'jsonwebtoken'

const generateToken = (res,id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    
    res.cookie('bgc',token, {
        httpOnly: true,
        secure: 'false',
        sameSite: 'none',
        maxAge: 5000000
    })
}

export default generateToken;