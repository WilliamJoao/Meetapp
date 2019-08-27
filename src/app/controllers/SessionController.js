import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {

    // Define obrigatoriedade dos campos
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        // valida os dados de entrada
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        // pegando os dados da requisição
        const { email, password } = req.body;

        // buscando o usuario
        const user = await User.findOne({ where: { email } });

        // verificando se o usuario existe
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        // verificando se a senha informada está correta
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match.' });
        }

        // pegando os dados do usuario
        const { id, name } = user;

        // retornando os dados do usuario e gerando o token
        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
