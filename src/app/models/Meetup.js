import { isBefore } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
    // método que é chamado automaticamente pelo sequelize
    static init(sequelize) {
        /**
         * método instanciado da class pai Model
         * definindo o tipo de dados que as colunas podem receber
         */
        super.init(
            {
                location: Sequelize.STRING,
                title: Sequelize.STRING,
                description: Sequelize.STRING,
                date: Sequelize.DATE,
                past: {
                    type: Sequelize.VIRTUAL,
                    // verifica se a data do evento é maior que a data atual
                    get() {
                        return isBefore(this.date, new Date());
                    },
                },
            },
            {
                sequelize,
            }
        );

        // return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'file_id' });
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    }
}

export default Meetup;
