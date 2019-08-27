import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
    constructor() {
        this.init();
    }

    /**
     * Metodo que faz a conexao com o banco de dados
     * e carrega o models
     */
    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
    }
}

export default new Database();
