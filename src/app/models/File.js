import Sequelize, { Model } from 'sequelize';

class File extends Model {
    // método que é chamado automaticamente pelo sequelize
    static init(sequelize) {
        /**
         * método instanciado da class pai Model
         * definindo o tipo de dados que as colunas podem receber
         */
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.APP_URL}/files/${this.path}`;
                    },
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default File;
