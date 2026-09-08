import type { UserProfile } from '../types';

export const sampleUser: UserProfile = {
  id: 'user-001',
  name: 'Nguyễn Văn Minh',
  email: 'minh.nguyen@email.com',
  phone: '0909123456',
  avatarUrl: 'https://placehold.co/100x100/6366f1/ffffff?text=NVM',
  role: 'buyer',
};

export const sampleDealerUser: UserProfile = {
  id: 'dealer-user-001',
  name: 'Trần Đại Lý',
  email: 'daily@automart.vn',
  phone: '0901234567',
  avatarUrl: 'https://placehold.co/100x100/dc2626/ffffff?text=TDL',
  role: 'dealer',
};

export type FixtureOutcome = 'success' | 'fail';

let loginOutcome: FixtureOutcome = 'success';
export function setLoginOutcome(o: FixtureOutcome): void { loginOutcome = o; }
export function getLoginOutcome(): FixtureOutcome { return loginOutcome; }

let registerOutcome: FixtureOutcome = 'success';
export function setRegisterOutcome(o: FixtureOutcome): void { registerOutcome = o; }
export function getRegisterOutcome(): FixtureOutcome { return registerOutcome; }

let verifyOtpOutcome: 'verified' | 'wrong' | 'maxAttemptsExceeded' = 'verified';
export function setVerifyOtpOutcome(o: 'verified' | 'wrong' | 'maxAttemptsExceeded'): void { verifyOtpOutcome = o; }
export function getVerifyOtpOutcome(): 'verified' | 'wrong' | 'maxAttemptsExceeded' { return verifyOtpOutcome; }

let saveProfileOutcome: FixtureOutcome = 'success';
export function setSaveProfileOutcome(o: FixtureOutcome): void { saveProfileOutcome = o; }
export function getSaveProfileOutcome(): FixtureOutcome { return saveProfileOutcome; }

let forgotPasswordOutcome: FixtureOutcome = 'success';
export function setForgotPasswordOutcome(o: FixtureOutcome): void { forgotPasswordOutcome = o; }
export function getForgotPasswordOutcome(): FixtureOutcome { return forgotPasswordOutcome; }

let sendInquiryOutcome: FixtureOutcome = 'success';
export function setSendInquiryOutcome(o: FixtureOutcome): void { sendInquiryOutcome = o; }
export function getSendInquiryOutcome(): FixtureOutcome { return sendInquiryOutcome; }
