const { signup, login } = require('../../../services/passport_auth');

exports.signup = async function({ userInput: {
    email,
    password
}}, req) {
    
    try {
        const user = await signup({ email, password, req });
        if(!user) throw new Error('Unable to register you for service.');
    
        return {
            email: user.email,
            message: 'Congrats! You successfully signed up!'
        };
    } catch(e) {
        throw new Error(e || 'Faile to signup');
    }
}

exports.logout = function(args, req) {
    const { user } = req;
    if(!user) throw new Error('User to logou is not available, now.');
    req.logout();
    return {
        email: user.email,
        message: 'Successfully loged out.'
    };
}


exports.login = async function({ userInput: {
    email,
    password
}}, req) {
    try {
        const user = await login({ email, password, req });
        if(!user) throw new Error('Unable to log you in!');

        return {
            email: user.email,
            message: 'You logged in.'
        }
    } catch(e) {
        throw new Error(e || 'Faile to login');
    }
}