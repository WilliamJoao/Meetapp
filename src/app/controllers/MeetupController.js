import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import User from '../models/User';
import Meetup from '../models/Meetup';

class MeetupController {
    async index(req, res) {
        const where = {};
        const page = req.query.page || 1;

        // cria where com a data informada
        if (req.query.date) {
            const searchDate = parseISO(req.query.date);

            where.date = {
                [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
            };
        }

        // faz a busca dos meetups
        const meetups = await Meetup.findAll({
            where,
            limit: 10,
            offset: 10 * page - 10,
            attributes: [
                'id',
                'location',
                'title',
                'description',
                'past',
                'date',
                'file_id',
            ],
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return res.json(meetups);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            file_id: Yup.number().required(),
            location: Yup.string().required(),
            title: Yup.string().required(),
            description: Yup.string().required(),
            date: Yup.date().required(),
        });

        // valida os dados de entrada
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        // verifica se data informada é anterior a atual
        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        const user_id = req.userId;

        const meetup = await Meetup.create({
            ...req.body, // pega tudo que vem no req.body
            user_id,
        });

        return res.json(meetup);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            file_id: Yup.number(),
            location: Yup.string(),
            title: Yup.string(),
            description: Yup.string(),
            date: Yup.date(),
        });

        // valida os dados de entrada
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const user_id = req.userId;

        // busca o evento
        const meetup = await Meetup.findByPk(req.params.id);

        // verifica se o usuario logado é o dono do evento
        if (meetup.user_id !== user_id) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        // verifica se data informada é anterior a atual
        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        // verifica se o evento ja aconteceu
        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't update past meetups." });
        }

        await meetup.update(req.body);

        return res.json(meetup);
    }

    async delete(req, res) {
        const user_id = req.userId;

        // busca o evento
        const meetup = await Meetup.findByPk(req.params.id);

        // verifica se o usuario logado é o dono do evento
        if (meetup.user_id !== user_id) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        // verifica se o evento ja aconteceu
        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't delete past meetups." });
        }

        await meetup.destroy();

        return res.send();
    }
}

export default new MeetupController();
