import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    // Metodo que cria um usuario
    async store(req, res) {
        // Define obrigatoriedade dos campos
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        // valida os dados de entrada
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        // busca o email informado no banco
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        // verifica se o email informado ja existe
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // cria o usuario
        const { id, name, email } = await User.create(req.body);

        // retorna um json com as infomações do usuario criado
        return res.json({ id, name, email });
    }

    // Metodo que ayualiza um usuario
    async update(req, res) {
        // Define obrigatoriedade dos campos
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),

            // garantindo que o campo 'confirmPassword' seja igual ao campo 'password'
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        // valida os dados de entrada
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, oldPassword } = req.body;

        // busco o usuario no banco
        const user = await User.findByPk(req.userId);

        // verifica se o email informado é diferente do email que esta salvo no banco
        if (email && email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        // verifica se a senha informada é a mesma que foi salva no banco
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(400).json({
                error: 'Password does not match.',
            });
        }

        // atualiza os dados do usuario
        const { id, name } = await user.update(req.body);

        // retorna um json com as infomações do usuario criado
        return res.json({
            id,
            name,
            email,
        });
    }
}

export default new UserController();
