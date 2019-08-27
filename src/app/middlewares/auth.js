import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

/**
 * verificando se o usuario esta logado na aplicação
 */
export default async (req, res, next) => {

    // buscando o token do usuario
    const authHeader = req.headers.authorization;

    // validando o token
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provider' });
    }

    /**
     * pegando somente a parte do token que vem na string
     * desestruturando e pegando a posição 1 do array que te, o token
     */
    const [, token] = authHeader.split(' ');

    try {

        /**
         * promisify é uma função do Util vem por padrão no node,
         * o promisify pega um função de callback e
         * transforma em uma função que possa utilizar async await.
         * o promisify vai retornar uma nova função onde passo os parametro (token, authConfig.secret);
         */
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        // adiciona o id do usuario na requisicao
        req.userId = decoded.id;

        return next();

    } catch (err) {

        return res.status(401).json({ error: 'Token invalid' });
    }
};
