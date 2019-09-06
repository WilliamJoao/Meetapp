import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import databaseConfig from '../config/database';

// array de models
const models = [User, File, Meetup];

class Database {
    constructor() {
        this.init();
        this.associate();
    }

    /**
     * Metodo que faz a conexao com o banco de dados
     * e carrega o models
     */
    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
    }

    associate() {
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();
