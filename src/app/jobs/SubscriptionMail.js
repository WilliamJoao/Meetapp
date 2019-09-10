import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }

    async handle({ data }) {
        const { meetup, user } = data;

        console.log('vaai porra');
        await Mail.sendMail({
            to: `${meetup.users.name} <${meetup.users.email}>`,
            subject: `[${meetup.title}] Nova inscrição`,
            template: 'subscription',
            context: {
                organizer: meetup.users.name,
                meetup: meetup.title,
                user: user.name,
                email: user.email,
            },
        });
    }
}

export default new SubscriptionMail();
