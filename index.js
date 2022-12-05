import bcrypt from 'bcrypt';
import prisma from './prisma/index.js';

const providerIdsMap = {
  google: '',
  linkedin: '',
  twitter: '',
}
function verifyPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

function verifyEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}


// send email verification code to user email
function sendEmailVerificationCode(email, email_verification_code) {
  return true;
}
async function signup(req, res) {
  try {
    let { email, password, provider, provider_id } = req.body;
    if (!email || !password || !provider || !provider_id) return res.status(400).json({ message: 'Invalid request' });

    email = req.body.email.toLowerCase().trim();
    password = req.body.password.trim();
    provider_source = req.body.provider_source;

    if (!verifyEmail(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!verifyPassword(password)) return res.status(400).json({ message: 'Invalid password' });

    const userData = await prisma.users.findFirst({ where: { email } });
    if (userData) return res.status(400).json({ message: 'Email already exists' });
    if (userproviderdata.provider_id === providerIdsMap[provider_source]) return res.status(400).json({ message: 'Invalid provider' });

    const email_verification_code = Math.floor(100000 + Math.random() * 900000);
    const email_verification_expiry = new Date();
    email_verification_expiry.setMinutes(email_verification_expiry.getMinutes() + 60);

    const userDataPayload = await prisma.users.create({
      data: {
        email,
        password: hashPassword(password),
        email_verified: false,
        email_verification_code,
        email_verification_expiry
      }
    });

    if (sendEmailVerificationCode(email, email_verification_code)) {
      return res.status(200).json({ message: 'Email verification code sent' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password.trim();
  const provider_source = req.body.provider_source;

  if (!verifyEmail(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!verifyPassword(password)) return res.status(400).json({ message: 'Invalid password' });

  const hashedPassword = hashPassword(password);

  const userData = await prisma.users.findFirst({ where: { email } });

  const userproviderdata = await prisma.user_providers.findFirst({ where: { user_id: userData.user_id } });
  if (userproviderdata.provider_id === providerIdsMap[provider_source]) throw new Error('already signedup Error!');

  const userProviderPayload = await prisma.user_providers.upsert({
    where: { user_id },
    create: { user_id, provider_id },
    update: { provider_id }
  });

  const email_verification_code = Math.floor(100000 + Math.random() * 900000);
  const email_verification_code_expires = new Date(Date.now() + 3600000);

  const userDataPayload = await prisma.users.upsert({
    where: { email },
    create: {
      password, user_name,
      email_verification_code,
      email_verified: false,
      email_verification_expiry: email_verification_code_expires,
    }
  });

  // send email verification code to user email 
  const emailStatus = sendEmailVerificationCode(email, email_verification_code);
  if (!emailStatus) throw new Error('Email not sent');

  return res.redirect('/verify-user-email');
}

async function login() {

}
export default signup;
// exports.signup = signup;
// exports.login = login;