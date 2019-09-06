import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    // método que é chamado automaticamente pelo sequelize
    static init(sequelize) {
        /**
         * método instanciado da class pai Model
         * definindo o tipo de dados que as colunas podem receber
         */
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        /**
         * Método executado antes de salvar os dados no banco
         * Verifica se foi informado uma senha,
         * caso seja true encriptografa a senha e adiciona no obj user.password_hash
         * caso contrario não faz nada
         */
        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    // Método que returna true caso as senhas sejam iguais
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
