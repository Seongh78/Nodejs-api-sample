/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
const jwt = require('jsonwebtoken');
const User = require('../../models/user');



/** ===================================
 *  register
 *  ===================================
 *  
 */
exports.register = (req, res) => {

    const { username, password } = req.body
    let newUser = null

    /**
     * CREATE
     * @param {*} user 
     */
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            return User.create(username, password)
        }
    }

    /**
     * 
     * @param {*} user 
     */
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }

    /**
     * 
     * @param {*} count 
     */
    const assign = (count) => {
        if(count === 1) {
            return newUser.assignAdmin()
        } else {
            // if not, return a promise that returns false
            return Promise.resolve(false)
        }
    }

    /**
     * 
     * @param {*} isAdmin 
     */
    const respond = (isAdmin) => {
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        })
    }

    /**
     * 
     * @param {*} error 
     */
    const onError = (error) => {
        console.log(error);
        
        res.status(409).json({
            message: error.message
        })
    }

    /**
     * 
     */
    User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)


}; // register



/** ===================================
 *  login
 *  ===================================
 *  
 */
exports.login = (req, res) => {
    const { username, password } = req.body
    const secret = req.app.get('jwt-secret')

    /**
     * 
     * @param {*} user 
     */
    const check = (user) => {
        if(!user) {
            throw new Error('login failed')
        }
        else{
            if(user.verify(password)) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'seongh.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            }
            else{
                throw new Error('login failed')
            }
        }
    }// check

    /**
     * 
     * @param {*} token 
     */
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }// respond

    /**
     * 
     * @param {*} error 
     */
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }


    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}; // login



/** ===================================
 *  check
 *  ===================================
 *  
 */
exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}


/** ===================================
 *  check
 *  ===================================
 *  
 */
// exports.check = (req, res) => {
//     const token = req.headers['x-access-token'] || req.query.token

//     // token does not exist
//     if(!token) {
//         return res.status(403).json({
//             success: false,
//             message: 'not logged in'
//         })
//     }

//     // create a promise that decodes the token
//     const p = new Promise(
//         (resolve, reject) => {
//             jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
//                 if(err) reject(err)
//                 resolve(decoded)
//             })
//         }
//     )

//     // if token is valid, it will respond with its info
//     const respond = (token) => {
//         res.json({
//             success: true,
//             info: token
//         })
//     }

//     // if it has failed to verify, it will return an error message
//     const onError = (error) => {
//         res.status(403).json({
//             success: false,
//             message: error.message
//         })
//     }

//     // process the promise
//     p.then(respond).catch(onError)

// }
