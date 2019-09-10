import { Model } from 'sequelize';

class Subscription extends Model {
    // método que é chamado automaticamente pelo sequelize
    static init(sequelize) {
        /**
         * método instanciado da class pai Model
         * definindo o tipo de dados que as colunas podem receber
         */
        super.init(
            {},
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Meetup, {
            foreignKey: 'meetup_id',
            as: 'meetup',
        });
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    }
}

export default Subscription;
