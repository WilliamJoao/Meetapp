import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
    storage: multer.diskStorage({
        // definindo onde irei publicar as imagens que vem na requisição
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        // modificando o nome da imagem
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);

                return cb(
                    null,
                    res.toString('hex') + extname(file.originalname) // retorno ex 6vhdgs76523.png
                );
            });
        },
    }),
};
