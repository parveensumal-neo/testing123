import prisma from './prisma';

export default async (req, res) => {
    try {
        const { email, email_verification_code } = req.body;
        const userData = await prisma.users.findFirst({ where: { email } });

        if (!userData) return res.status(400).json({ message: 'Invalid email' });
        if (userData.email_verification_code !== email_verification_code) return res.status(400).json({ message: 'Invalid verification code' });
        if (userData.email_verification_expiry < new Date()) return res.status(400).json({ message: 'Verification code expired' });

        const userDataPayload = await prisma.users.update({
            where: { email },
            data: {
                email_verified: true,
                email_verification_expiry: null,
                email_verification_code: null
            }
        });

        return res.status(200).json({ message: 'Email verified' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}