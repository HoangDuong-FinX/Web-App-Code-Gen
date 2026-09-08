import type { Buyer } from '../types';

let loginOutcome: 'success' | 'fail' | 'locked' = 'success';
export function setLoginOutcome(v: 'success' | 'fail' | 'locked'): void { loginOutcome = v; }

let registerOutcome: 'success' | 'fail' | 'duplicate' = 'success';
export function setRegisterOutcome(v: 'success' | 'fail' | 'duplicate'): void { registerOutcome = v; }

const sampleBuyer: Buyer = {
  id: 'buyer-1',
  name: 'Nguy\u1ec5n V\u0103n A',
  phone: '0901234567',
  email: 'nguyenvana@email.com',
};

export async function submitLogin(_identity: string, _password: string): Promise<Buyer> {
  await new Promise(r => setTimeout(r, 300));
  if (loginOutcome === 'fail') throw new Error('WRONG_CREDENTIALS');
  if (loginOutcome === 'locked') throw new Error('ACCOUNT_LOCKED');
  return sampleBuyer;
}

export async function submitRegister(_name: string, _phone: string, _email: string, _password: string): Promise<Buyer> {
  await new Promise(r => setTimeout(r, 300));
  if (registerOutcome === 'fail') throw new Error('NETWORK_ERROR');
  if (registerOutcome === 'duplicate') throw new Error('DUPLICATE');
  return sampleBuyer;
}

export { sampleBuyer };
